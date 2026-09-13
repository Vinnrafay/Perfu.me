<?php

use App\Models\Product;
use App\Models\ProductSize;

test('guests can submit multiple checkout items for pending verification', function () {
    $product = Product::create([
        'nama' => 'Perfume Checkout',
        'kategori' => 'EDP',
        'gender' => 'unisex',
        'original' => 'Original',
        'Top_Note' => 'Lemon',
        'Middle_Note' => 'Rose',
        'Base_Note' => 'Musk',
        'Komposisi' => 'Alcohol, Perfume',
        'Deskripsi' => 'Checkout test product.',
    ]);

    $small = ProductSize::create([
        'product_id' => $product->id,
        'Ukuran' => 30,
        'Harga' => 100000,
        'Diskon' => 10000,
        'Stok' => 5,
    ]);
    $large = ProductSize::create([
        'product_id' => $product->id,
        'Ukuran' => 50,
        'Harga' => 180000,
        'Diskon' => 20000,
        'Stok' => 3,
    ]);

    $this->withoutMiddleware();

    $response = $this->post(route('pesanan.store'), [
        'nama_pembeli' => 'Budi Santoso',
        'no_wa' => '081234567890',
        'alamat' => 'Jl. Mawar No. 1',
        'catatan' => 'Kirim sore',
        'metode_pembayaran' => 'transfer',
        'items' => [
            ['product_size_id' => $small->id, 'jumlah' => 2],
            ['product_size_id' => $large->id, 'jumlah' => 1],
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseCount('pesanans', 2);
    $this->assertDatabaseHas('pesanans', [
        'product_size_id' => $small->id,
        'jumlah' => 2,
        'total_harga' => 180000,
        'verifikasi' => 'pending',
    ]);
    $this->assertDatabaseHas('pesanans', [
        'product_size_id' => $large->id,
        'jumlah' => 1,
        'total_harga' => 160000,
        'verifikasi' => 'pending',
    ]);
    expect($small->refresh()->Stok)->toBe(3)
        ->and($large->refresh()->Stok)->toBe(2);
});
