<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\ProductSize;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PesananController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * Dipecah jadi dua: yang masih nunggu diverifikasi, dan yang udah
     * beres diverifikasi (list pesanan aktif dengan status pengiriman).
     */
public function index(Request $request)
{
    $pending = Pesanan::with('productSize.product')
        ->where('verifikasi', 'pending')->latest()
        ->paginate(10, ['*'], 'pending_page');

    $verified = Pesanan::with('productSize.product')
        ->where('verifikasi', 'selesai')->latest()
        ->paginate(10, ['*'], 'verified_page');

    $productSizes = ProductSize::with('product')->where('Stok', '>', 0)->get();

    return Inertia::render('dashboard/pesanan/index', [
        'pending' => $pending,
        'verified' => $verified,
        'productSizes' => $productSizes,
    ]);
}

    /**
     * Store a newly created resource in storage.
     *
     * Endpoint PUBLIK — dipakai dari form pesan di halaman produk.
     * Verifikasi default 'pending', menunggu dicek admin.
     */
    public function store(Request $request)
    {
        $validated = $this->validateOrder($request);

        $this->createOrderAndDeductStock($validated, verifikasi: 'pending');

        return redirect()
            ->back()
            ->with('success', 'Pesanan kamu berhasil dikirim! Kami akan segera memverifikasi.');
    }

    /**
     * Store dari dashboard admin — pesanan yang diinput manual sama admin
     * otomatis dianggap sudah terverifikasi.
     */
    public function adminStore(Request $request)
    {
        $validated = $this->validateOrder($request);

        $this->createOrderAndDeductStock($validated, verifikasi: 'selesai');

        return redirect()
            ->route('pesanan.index')
            ->with('success', 'Pesanan berhasil ditambahkan.');
    }

    /**
     * Tandai pesanan sebagai sudah diverifikasi.
     * Ini yang dipencet admin di tabel "Menunggu Verifikasi".
     */
    public function verify(Pesanan $pesanan)
    {
        $pesanan->update(['verifikasi' => 'selesai']);

        return redirect()
            ->back()
            ->with('success', 'Pesanan berhasil diverifikasi.');
    }

    /**
     * Update status pengiriman (dikemas -> dikirim -> selesai).
     * Ini yang dipencet admin di tabel pesanan yang udah terverifikasi.
     */
    public function updateStatus(Request $request, Pesanan $pesanan)
    {
        $request->validate([
            'status' => 'required|in:dikemas,dikirim,selesai',
        ]);

        $pesanan->update(['status' => $request->input('status')]);

        return redirect()
            ->back()
            ->with('success', 'Status pesanan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pesanan $pesanan)
    {
        $pesanan->delete();

        return redirect()
            ->back()
            ->with('success', 'Pesanan berhasil dihapus.');
    }

    /**
     * Validasi input pesanan, dipakai bersama oleh store() dan adminStore().
     */
    private function validateOrder(Request $request): array
    {
        return $request->validate([
            'nama_pembeli' => 'required|string|max:255',
            'no_wa' => 'required|string|max:20',
            'alamat' => 'required|string',
            'catatan' => 'nullable|string',
            'metode_pembayaran' => 'required|in:transfer,e-wallet,qris,cod',
            'product_size_id' => 'required|exists:product_sizes,id',
            'jumlah' => 'required|integer|min:1',
        ]);
    }

    /**
     * Ambil harga & stok dari ProductSize yang dipilih, hitung total harga,
     * kurangin stok ukuran itu, lalu bikin record pesanan.
     * Dipakai bareng oleh store() dan adminStore().
     *
     * @throws ValidationException kalau stok gak cukup
     */
    private function createOrderAndDeductStock(array $validated, string $verifikasi): Pesanan
    {
        $productSize = ProductSize::findOrFail($validated['product_size_id']);

        if ($productSize->Stok < $validated['jumlah']) {
            throw ValidationException::withMessages([
                'jumlah' => "Stok ukuran ini cuma tersisa {$productSize->Stok}.",
            ]);
        }

        $hargaSatuan = (float) $productSize->harga_akhir;
        $totalHarga = $hargaSatuan * $validated['jumlah'];

        $pesanan = Pesanan::create([
            ...$validated,
            'total_harga' => $totalHarga,
            'verifikasi' => $verifikasi,
        ]);

        // Stok langsung berkurang begitu pesanan dibuat
        // (baik dari form publik maupun input manual admin).
        $productSize->decrement('Stok', $validated['jumlah']);

        return $pesanan;
    }

    /**
 * Update pesanan (full edit). Kalau jumlah atau ukuran produk berubah,
 * stok lama dibalikin dulu, baru dikurangi lagi sesuai data baru.
 */
public function update(Request $request, Pesanan $pesanan)
{
    $validated = $request->validate([
        'nama_pembeli' => 'required|string|max:255',
        'no_wa' => 'required|string|max:20',
        'alamat' => 'required|string',
        'catatan' => 'nullable|string',
        'metode_pembayaran' => 'required|in:transfer,e-wallet,qris,cod',
        'product_size_id' => 'required|exists:product_sizes,id',
        'jumlah' => 'required|integer|min:1',
        'verifikasi' => 'required|in:pending,selesai',
        'status' => 'required|in:dikemas,dikirim,selesai',
    ]);

    DB::transaction(function () use ($pesanan, $validated) {
        $oldProductSize = ProductSize::lockForUpdate()->findOrFail($pesanan->product_size_id);
        $newProductSize = ProductSize::lockForUpdate()->findOrFail($validated['product_size_id']);

        // Balikin dulu stok pesanan lama.
        $oldProductSize->increment('Stok', $pesanan->jumlah);

        // Kalau ukurannya sama persis, refresh biar baca stok yang udah dibalikin.
        if ($newProductSize->id === $oldProductSize->id) {
            $newProductSize->refresh();
        }

        if ($newProductSize->Stok < $validated['jumlah']) {
            // Gagal → balikin lagi ke kondisi semula biar konsisten.
            $oldProductSize->decrement('Stok', $pesanan->jumlah);

            throw ValidationException::withMessages([
                'jumlah' => "Stok ukuran ini cuma tersisa {$newProductSize->Stok}.",
            ]);
        }

        $totalHarga = (float) $newProductSize->harga_akhir * $validated['jumlah'];

        $pesanan->update([
            ...$validated,
            'total_harga' => $totalHarga,
        ]);

        $newProductSize->decrement('Stok', $validated['jumlah']);
    });

    return redirect()
        ->route('pesanan.index')
        ->with('success', 'Pesanan berhasil diperbarui.');
}
}