<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\ProductSize;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PesananController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * Dipecah jadi dua: yang masih nunggu diverifikasi, dan yang udah
     * beres diverifikasi (list pesanan aktif dengan status pengiriman).
     * Search yang sama diterapkan ke DUA list sekaligus.
     */
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));

        $pendingQuery = Pesanan::with('productSize.product')->where('verifikasi', 'pending');
        $verifiedQuery = Pesanan::with('productSize.product')->where('verifikasi', 'selesai');

        if ($search !== '') {
            $pendingQuery = $this->applySearch($pendingQuery, $search);
            $verifiedQuery = $this->applySearch($verifiedQuery, $search);
        }

        $pending = $pendingQuery->latest()
            ->paginate(10, ['*'], 'pending_page')
            ->withQueryString();

        $verified = $verifiedQuery->latest()
            ->paginate(10, ['*'], 'verified_page')
            ->withQueryString();

        $productSizes = ProductSize::with('product')->where('Stok', '>', 0)->get();

        return Inertia::render('dashboard/pesanan/index', [
            'pending' => $pending,
            'verified' => $verified,
            'productSizes' => $productSizes,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Terapkan pencarian lintas kolom: kode invoice, nama pembeli,
     * nama produk (lewat relasi), alamat, metode pembayaran, dan status.
     */
    private function applySearch($query, string $search)
    {
        $searchLower = strtolower(trim($search));

        // Kalau user mengetik kode invoice seperti:
        // #000003, 000003, atau 3 -> semuanya mengarah ke id pesanan 3.
        $numericSearch = preg_replace('/\D/', '', $search);

        // Terjemahkan label yang biasa diketik user ke value enum database.
        $metodeMap = [
            'transfer' => 'transfer',
            'e-wallet' => 'e-wallet',
            'ewallet' => 'e-wallet',
            'e wallet' => 'e-wallet',
            'qris' => 'qris',
            'cod' => 'cod',
            'cash on delivery' => 'cod',
        ];

        $statusMap = [
            'dikemas' => 'dikemas',
            'dikirim' => 'dikirim',
            'selesai' => 'selesai',
        ];

        $metodeMatch = $metodeMap[$searchLower] ?? null;
        $statusMatch = $statusMap[$searchLower] ?? null;

        return $query->where(function ($q) use (

            $searchLower,
            $numericSearch,
            $metodeMatch,
            $statusMatch
        ) {
            // Nama pelanggan
            $q->whereRaw('LOWER(nama_pembeli) LIKE ?', ["%{$searchLower}%"])

                // Alamat
                ->orWhereRaw('LOWER(alamat) LIKE ?', ["%{$searchLower}%"])

                // Metode pembayaran
                ->orWhereRaw('LOWER(metode_pembayaran) LIKE ?', ["%{$searchLower}%"])

                // Status pengiriman
                ->orWhereRaw('LOWER(status) LIKE ?', ["%{$searchLower}%"])

                // Nama produk melalui relasi productSize -> product
                ->orWhereHas('productSize.product', function ($pq) use ($searchLower) {
                    $pq->whereRaw('LOWER(nama) LIKE ?', ["%{$searchLower}%"]);
                });

            // Kode invoice:
            // tampilan invoice = # + ID 6 digit, contoh #000003.
            // Kita cocokkan angka yang diketik dengan ID pesanan.
            if ($numericSearch !== '') {
                $invoiceId = (int) $numericSearch;

                if ($invoiceId > 0) {
                    $q->orWhere('id', $invoiceId);
                }
            }

            // Exact match tambahan untuk label metode pembayaran.
            if ($metodeMatch !== null) {
                $q->orWhere('metode_pembayaran', $metodeMatch);
            }

            // Exact match tambahan untuk status.
            if ($statusMatch !== null) {
                $q->orWhere('status', $statusMatch);
            }
        });
    }

    /**
     * Store a newly created resource in storage.
     *
     * Endpoint PUBLIK — dipakai dari form pesan di halaman produk.
     * Verifikasi default 'pending', menunggu dicek admin.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_pembeli' => 'required|string|max:255',
            'no_wa' => 'required|string|max:20',
            'alamat' => 'required|string',
            'catatan' => 'nullable|string',
            'metode_pembayaran' => 'required|in:transfer,e-wallet,qris,cod',
            'items' => 'required|array|min:1',
            'items.*.product_size_id' => 'required|exists:product_sizes,id',
            'items.*.jumlah' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated): void {
            foreach ($validated['items'] as $item) {
                $this->createOrderAndDeductStock([
                    'nama_pembeli' => $validated['nama_pembeli'],
                    'no_wa' => $validated['no_wa'],
                    'alamat' => $validated['alamat'],
                    'catatan' => $validated['catatan'] ?? null,
                    'metode_pembayaran' => $validated['metode_pembayaran'],
                    'product_size_id' => $item['product_size_id'],
                    'jumlah' => $item['jumlah'],
                ], verifikasi: 'pending');
            }
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pesanan kamu berhasil dikirim! Kami akan segera memverifikasi.',
        ]);

        return redirect()->back();
    }

    /**
     * Store dari dashboard admin — pesanan yang diinput manual sama admin
     * otomatis dianggap sudah terverifikasi.
     */
    public function adminStore(Request $request)
    {
        $validated = $this->validateOrder($request);

        $this->createOrderAndDeductStock($validated, verifikasi: 'selesai');

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pesanan berhasil ditambahkan.']);

        return redirect()->route('pesanan.index');
    }

    /**
     * Tandai pesanan sebagai sudah diverifikasi.
     * Ini yang dipencet admin di tabel "Menunggu Verifikasi".
     */
    public function verify(Pesanan $pesanan)
    {
        $pesanan->update(['verifikasi' => 'selesai']);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pesanan berhasil diverifikasi.']);

        return redirect()->back();
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

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Status pesanan berhasil diperbarui.']);

        return redirect()->back();
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

            $oldProductSize->increment('Stok', $pesanan->jumlah);

            if ($newProductSize->id === $oldProductSize->id) {
                $newProductSize->refresh();
            }

            if ($newProductSize->Stok < $validated['jumlah']) {
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

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pesanan berhasil diperbarui.']);

        return redirect()->route('pesanan.index');
    }

    /**
     * Tampilin halaman preview invoice (struk) di web.
     */
    public function invoice(Pesanan $pesanan)
    {
        $pesanan->load('productSize.product');

        return Inertia::render('dashboard/pesanan/invoice', [
            'pesanan' => $pesanan,
            'appName' => config('app.name'),
        ]);
    }

    /**
     * Generate & download PDF invoice-nya beneran.
     */
    public function downloadInvoice(Pesanan $pesanan)
    {
        $pesanan->load('productSize.product');

        $pdf = Pdf::loadView('pdf.invoice', [
            'pesanan' => $pesanan,
        ]);

        return $pdf->download("invoice-{$pesanan->id}.pdf");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pesanan $pesanan)
    {
        $pesanan->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pesanan berhasil dihapus.']);

        return redirect()->back();
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
     *
     * @throws ValidationException kalau stok gak cukup
     */
    private function createOrderAndDeductStock(array $validated, string $verifikasi): Pesanan
    {
        $productSize = ProductSize::query()
            ->lockForUpdate()
            ->findOrFail($validated['product_size_id']);

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

        $productSize->decrement('Stok', $validated['jumlah']);

        return $pesanan;
    }
}
