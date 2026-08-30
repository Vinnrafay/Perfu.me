<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = trim($request->string('search')->toString());

        $products = Product::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('brand', 'like', "%{$search}%")
                      ->orWhere('kategori', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('dashboard/products/index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display the public listing of products.
     *
     * @return Response
     */
    public function catalog()
    {
        $products = Product::latest()->get();

        return Inertia::render('products/index', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->normalizeToggles($request);

        $validated = $request->validate($this->validationRules());

        if ($request->hasFile('Foto')) {
            $validated['Foto'] = $request->file('Foto')->store('products', 'public');
        }

        Product::create($validated);

        return redirect()
            ->back()
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return Inertia::render('products/detail', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return Inertia::render('dashboard/products/edit', [
            'product' => $product,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $this->normalizeToggles($request);

        $validated = $request->validate($this->validationRules($product->id));

        if ($request->hasFile('Foto')) {
            // Hapus gambar lama dari storage jika ada gambar baru
            if ($product->Foto && Storage::disk('public')->exists($product->Foto)) {
                Storage::disk('public')->delete($product->Foto);
            }

            $validated['Foto'] = $request->file('Foto')->store('products', 'public');
        }

        $product->update($validated);

        return redirect()
            ->back()
            ->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Hapus file gambar terkait dari storage
        if ($product->Foto && Storage::disk('public')->exists($product->Foto)) {
            Storage::disk('public')->delete($product->Foto);
        }

        $product->delete();

        return redirect()
            ->back()
            ->with('success', 'Produk berhasil dihapus.');
    }

    /**

     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:products,id',
        ]);

        $products = Product::whereIn('id', $request->ids)->get();

        foreach ($products as $product) {
            if ($product->Foto && Storage::disk('public')->exists($product->Foto)) {
                Storage::disk('public')->delete($product->Foto);
            }
            $product->delete();
        }

        return redirect()
            ->back()
            ->with('success', count($request->ids).' produk berhasil dihapus.');
    }

    /**
     * Normalisasi field sebelum divalidasi:
     * - Best_Seller: checkbox -> 'yes'/'no'
     * - signature: checkbox -> 'yes'/'no', tapi dipaksa 'no' kalau produknya Refill
     *   (karena toggle Signature nggak ditampilkan sama sekali di form Refill)
     * - brand: dikosongin (null) kalau produknya Original, karena field brand
     *   nggak ditampilkan di form Original dan nggak relevan buat tipe itu
     * - Diskon: kalau dikosongin di form, default-in ke 0 (bukan null),
     *   biar perhitungan harga akhir di model selalu aman
     */
    private function normalizeToggles(Request $request): void
    {
        $isRefill = $request->input('original') === 'Refill';

        $request->merge([
            'Best_Seller' => $request->boolean('Best_Seller') ? 'yes' : 'no',
            'signature'   => $isRefill ? 'no' : ($request->boolean('signature') ? 'yes' : 'no'),
            'brand'       => $isRefill ? $request->input('brand') : null,
            'Diskon'      => $request->input('Diskon') === null || $request->input('Diskon') === ''
                ? 0
                : $request->input('Diskon'),
        ]);
    }

    /**
     * Helper Aturan Validasi Produk
     *
     * - Top_Note, Middle_Note, Base_Note selalu wajib, baik Original maupun Refill.
     * - brand cuma wajib kalau produknya Refill.
     * - Diskon nullable secara input, tapi selalu di-normalize ke angka (default 0)
     *   sebelum masuk sini lewat normalizeToggles(), jadi validasinya numeric biasa.
     */
    private function validationRules(?int $productId = null): array
    {
        return [
            'nama'           => 'required|string|max:255',
            'kategori'       => 'required|in:EDP,EDT,Roll-On,Body Mist',
            'gender'         => 'required|in:male,female,unisex',
            'Varian'         => 'required|string|max:255',
            'Top_Note'       => 'required|string|max:255',
            'Middle_Note'    => 'required|string|max:255',
            'Base_Note'      => 'required|string|max:255',
            'Komposisi'      => 'required|string|max:255',
            'Kemasan'        => 'nullable|string|max:255',
            'Ukuran'         => 'required|integer|min:1',
            'Harga'          => 'required|numeric|min:0',
            'Stok'           => 'required|integer|min:0',
            'Tanggal_launch' => 'nullable|date',
            'Deskripsi'      => 'required|string',
            'Foto'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'Best_Seller'    => 'required|in:yes,no',
            'signature'      => 'required|in:yes,no',
=========
            'nama' => 'required|string|max:255',
            'kategori' => 'required|in:EDP,EDT,Roll-On,Body Mist',
            'gender' => 'required|in:male,female,unisex',
            'Varian' => 'required|string|max:255',
            'Top_Note' => 'required|string|max:255',
            'Middle_Note' => 'required|string|max:255',
            'Base_Note' => 'required|string|max:255',
            'Komposisi' => 'required|string|max:255',
            'Kemasan' => 'nullable|string|max:255',
            'Ukuran' => 'required|integer|min:1',
            'Harga' => 'required|numeric|min:0',
            'Stok' => 'required|integer|min:0',
            'Tanggal_launch' => 'nullable|date',
            'Deskripsi' => 'required|string',
            'Foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'Best_Seller' => 'required|in:yes,no',
>>>>>>>>> Temporary merge branch 2
        ];
    }
}
