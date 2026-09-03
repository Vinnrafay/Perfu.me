<?php

use App\Models\Product;
use App\Models\Testimoni;

test('homepage returns signature products with ordered sizes and testimonials', function () {
    $signatureProduct = Product::create([
        'nama' => 'Signature Scent',
        'kategori' => 'EDP',
        'gender' => 'unisex',
        'original' => 'Original',
        'Top_Note' => 'Citrus',
        'Middle_Note' => 'Rose',
        'Base_Note' => 'Musk',
        'Komposisi' => 'Alcohol, Fragrance',
        'Deskripsi' => 'A signature fragrance.',
        'signature' => 'yes',
    ]);

    $signatureProduct->sizes()->createMany([
        ['Ukuran' => 50, 'Harga' => 200000, 'Diskon' => 20000, 'Stok' => 5],
        ['Ukuran' => 30, 'Harga' => 150000, 'Diskon' => 10000, 'Stok' => 5],
    ]);

    Product::create([
        'nama' => 'Catalog Scent',
        'kategori' => 'EDP',
        'gender' => 'female',
        'original' => 'Original',
        'Top_Note' => 'Apple',
        'Middle_Note' => 'Jasmine',
        'Base_Note' => 'Amber',
        'Komposisi' => 'Alcohol, Fragrance',
        'Deskripsi' => 'A regular fragrance.',
        'signature' => 'no',
    ]);

    Testimoni::create([
        'nama' => 'Homepage Buyer',
        'email' => 'homepage@example.com',
        'komentar' => 'The scent lasts all day.',
        'rating' => 5,
    ]);

    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertJsonPath('signatureProducts.0.nama', 'Signature Scent');
    $response->assertJsonPath('signatureProducts.0.sizes.0.Ukuran', 30);
    $response->assertJsonPath('signatureProducts.0.sizes.0.harga_akhir', 140000);
    $response->assertJsonMissing(['nama' => 'Catalog Scent']);
    $response->assertJsonPath('testimonials.0.komentar', 'The scent lasts all day.');
});