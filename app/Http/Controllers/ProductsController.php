<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductsController extends Controller
{
    public function index(Request $request)
    {
        $search = trim($request->string('search')->toString());

        $products = Product::query()
            ->with('sizes')
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
            'filters' => ['search' => $search],
        ]);
    }

    public function catalog()
    {
        $products = Product::with('sizes')->latest()->get();

        return Inertia::render('products/index', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $this->normalizeToggles($request);

        $validated = $request->validate($this->validationRules());
        $sizes = $validated['sizes'];
        unset($validated['sizes']);

        if ($request->hasFile('Foto')) {
            $validated['Foto'] = $request->file('Foto')->store('products', 'public');
        }

        DB::transaction(function () use ($validated, $sizes) {
            $product = Product::create($validated);
            $product->sizes()->createMany($sizes);
        });

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan.');
    }

    public function show(Product $product)
    {
        return Inertia::render('products/detail', [
            'product' => $product->load('sizes'),
        ]);
    }

    public function edit(Product $product)
    {
        return Inertia::render('dashboard/products/edit', [
            'product' => $product->load('sizes'),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $this->normalizeToggles($request);

        $validated = $request->validate($this->validationRules($product->id));
        $sizes = $validated['sizes'];
        unset($validated['sizes']);

        if ($request->hasFile('Foto')) {
            if ($product->Foto && Storage::disk('public')->exists($product->Foto)) {
                Storage::disk('public')->delete($product->Foto);
            }
            $validated['Foto'] = $request->file('Foto')->store('products', 'public');
        }

        DB::transaction(function () use ($product, $validated, $sizes) {
            $product->update($validated);

            // ukuran yang id-nya nggak dikirim lagi dari frontend berarti dihapus user
            $incomingIds = collect($sizes)->pluck('id')->filter()->all();
            $product->sizes()->whereNotIn('id', $incomingIds)->delete();

            foreach ($sizes as $size) {
                $payload = [
                    'Ukuran' => $size['Ukuran'],
                    'Harga'  => $size['Harga'],
                    'Diskon' => $size['Diskon'] ?? 0,
                    'Stok'   => $size['Stok'],
                ];

                if (!empty($size['id'])) {
                    $product->sizes()->where('id', $size['id'])->update($payload);
                } else {
                    $product->sizes()->create($payload);
                }
            }
        });

        return redirect()->back()->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product)
    {
        if ($product->Foto && Storage::disk('public')->exists($product->Foto)) {
            Storage::disk('public')->delete($product->Foto);
        }

        $product->delete(); // product_sizes ikut kehapus lewat cascadeOnDelete()

        return redirect()->back()->with('success', 'Produk berhasil dihapus.');
    }

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

        return redirect()->back()->with('success', count($request->ids).' produk berhasil dihapus.');
    }

    private function normalizeToggles(Request $request): void
    {
        $isRefill = $request->input('original') === 'Refill';

        $sizes = collect($request->input('sizes', []))
            ->map(function ($size) {
                $size['Diskon'] = $size['Diskon'] ?? 0;
                return $size;
            })
            ->all();

        $request->merge([
            'Best_Seller' => $request->boolean('Best_Seller') ? 'yes' : 'no',
            'signature'   => $isRefill ? 'no' : ($request->boolean('signature') ? 'yes' : 'no'),
            'brand'       => $isRefill ? $request->input('brand') : null,
            'sizes'       => $sizes,
        ]);
    }

    private function validationRules(?int $productId = null): array
    {
        return [
            'nama'           => 'required|string|max:255',
            'kategori'       => 'required|in:EDP,EDT,Roll-On,Body Mist',
            'gender'         => 'required|in:male,female,unisex',
            'original'       => 'required|in:Original,Refill',
            'brand'          => 'nullable|required_if:original,Refill|string|max:255',
            'Top_Note'       => 'required|string|max:255',
            'Middle_Note'    => 'required|string|max:255',
            'Base_Note'      => 'required|string|max:255',
            'Komposisi'      => 'required|string|max:255',
            'Kemasan'        => 'nullable|string|max:255',
            'Tanggal_launch' => 'nullable|date',
            'Deskripsi'      => 'required|string',
            'Foto'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'Best_Seller'    => 'required|in:yes,no',
            'signature'      => 'required|in:yes,no',

            'sizes'          => 'required|array|min:1',
            'sizes.*.id'     => 'nullable|integer|exists:product_sizes,id',
            'sizes.*.Ukuran' => 'required|integer|min:1',
            'sizes.*.Harga'  => 'required|numeric|min:0|max:999999999999.99',
            'sizes.*.Diskon' => 'nullable|numeric|min:0|max:999999999999.99|lte:sizes.*.Harga',
            'sizes.*.Stok'   => 'required|integer|min:0',
        ];
    }
}