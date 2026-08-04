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
    public function index()
    {
        return Inertia::render('products/index', [
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
        $validated = $request->validate([
            'nama'               => 'required|string|max:255',
            'kategori'           => 'required|in:EDP,EDT,Roll-On,Body Mist',
            'gender'             => 'required|in:male,female,unisex',
            'Varian'             => 'required|string|max:255',
            'Top Note'           => 'required|string|max:255',
            'Middle Note'        => 'required|string|max:255',
            'Base Note'          => 'required|string|max:255',
            'Komposisi'          => 'required|string|max:255',
            'Kemasan'            => 'nullable|string|max:255',
            'Ukuran'             => 'required|integer',
            'Harga'              => 'required|numeric',
            'Stok'               => 'required|integer',
            'Tanggal launch'     => 'nullable|date',
            'Deskripsi'          => 'required|string',
            'Foto'               => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'Best Seller'        => 'nullable|in:yes,no',
        ]);

        if ($request->hasFile('Foto')) {
            $validated['Foto'] = $request->file('Foto')->store('products', 'public');
        }

        // Default Best Seller
        $validated['Best Seller'] = $validated['Best Seller'] ?? 'no';

        Product::create($validated);

        return redirect()
            ->route('products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
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
        // $product = Product::findOrFail($id);

        // return view('products.edit', compact('product'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'nama'               => 'required|string|max:255',
            'kategori'           => 'required|in:EDP,EDT,Roll-On,Body Mist',
            'gender'             => 'required|in:male,female,unisex',
            'Varian'             => 'required|string|max:255',
            'Top Note'           => 'required|string|max:255',
            'Middle Note'        => 'required|string|max:255',
            'Base Note'          => 'required|string|max:255',
            'Komposisi'          => 'required|string|max:255',
            'Kemasan'            => 'nullable|string|max:255',
            'Ukuran'             => 'required|integer',
            'Harga'              => 'required|numeric',
            'Stok'               => 'required|integer',
            'Tanggal launch'     => 'nullable|date',
            'Deskripsi'          => 'required|string',
            'Foto'               => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'Best Seller'        => 'nullable|in:yes,no',
        ]);

        if ($request->hasFile('Foto')) {
            $validated['Foto'] = $request->file('Foto')->store('products', 'public');
        }

        $validated['Best Seller'] = $validated['Best Seller'] ?? 'no';

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