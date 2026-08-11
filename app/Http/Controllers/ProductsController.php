<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();

        $products = Product::query()
            ->when($search, fn ($query) => $query->where('nama', 'like', "%{$search}%"))
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
       
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Checkbox dari frontend dikirim sebagai boolean (true/false),
        // tapi kolom Best_Seller di database cuma nerima 'yes'/'no'.
        // Konversi dulu sebelum divalidasi.
        $request->merge([
            'Best_Seller' => $request->boolean('Best_Seller') ? 'yes' : 'no',
        ]);

        $validated = $request->validate([
            'nama'               => 'required|string|max:255',
            'kategori'           => 'required|in:EDP,EDT,Roll-On,Body Mist',
            'gender'             => 'required|in:male,female,unisex',
            'Varian'             => 'required|string|max:255',
            'Top_Note'           => 'required|string|max:255',
            'Middle_Note'        => 'required|string|max:255',
            'Base_Note'          => 'required|string|max:255',
            'Komposisi'          => 'required|string|max:255',
            'Kemasan'            => 'nullable|string|max:255',
            'Ukuran'             => 'required|integer',
            'Harga'              => 'required|numeric',
            'Stok'               => 'required|integer',
            'Tanggal_launch'     => 'nullable|date',
            'Deskripsi'          => 'required|string',
            'Foto'               => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'Best_Seller'        => 'required|in:yes,no',
        ]);

        if ($request->hasFile('Foto')) {
            $validated['Foto'] = $request->file('Foto')->store('products', 'public');
        }

        Product::create($validated);

        return redirect()
            ->route('products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);

        return Inertia::render('products/detail', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::findOrFail($id);

        return Inertia::render('dashboard/products/edit', [
            'product' => $product,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        // Sama kayak store(): checkbox boolean dari frontend dikonversi
        // dulu ke 'yes'/'no' sebelum divalidasi.
        $request->merge([
            'Best_Seller' => $request->boolean('Best_Seller') ? 'yes' : 'no',
        ]);

        $validated = $request->validate([
            'nama'               => 'required|string|max:255',
            'kategori'           => 'required|in:EDP,EDT,Roll-On,Body Mist',
            'gender'             => 'required|in:male,female,unisex',
            'Varian'             => 'required|string|max:255',
            'Top_Note'           => 'required|string|max:255',
            'Middle_Note'        => 'required|string|max:255',
            'Base_Note'          => 'required|string|max:255',
            'Komposisi'          => 'required|string|max:255',
            'Kemasan'            => 'nullable|string|max:255',
            'Ukuran'             => 'required|integer',
            'Harga'              => 'required|numeric',
            'Stok'               => 'required|integer',
            'Tanggal_launch'     => 'nullable|date',
            'Deskripsi'          => 'required|string',
            'Foto'               => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'Best_Seller'        => 'required|in:yes,no',
        ]);

        if ($request->hasFile('Foto')) {
            $validated['Foto'] = $request->file('Foto')->store('products', 'public');
        }

        $product->update($validated);

        return redirect()
            ->route('products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);

        $product->delete();

        return redirect()
            ->route('products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }
}