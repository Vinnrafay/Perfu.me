<?php

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('guests can visit the public products catalog', function () {
    Product::create([
        'nama' => 'Perfume A',
        'kategori' => 'EDP',
        'gender' => 'unisex',
        'Varian' => 'Standard',
        'Top_Note' => 'Lemon',
        'Middle_Note' => 'Rose',
        'Base_Note' => 'Musk',
        'Komposisi' => 'Alcohol, Perfume',
        'Ukuran' => 50,
        'Harga' => 150000,
        'Stok' => 10,
        'Deskripsi' => 'This is Perfume A.',
        'Best_Seller' => 'no',
    ]);

    $response = $this->get(route('products'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('products/index')
        ->has('products')
    );
});

test('guests can visit the public product details page', function () {
    $product = Product::create([
        'nama' => 'Perfume A',
        'kategori' => 'EDP',
        'gender' => 'unisex',
        'Varian' => 'Standard',
        'Top_Note' => 'Lemon',
        'Middle_Note' => 'Rose',
        'Base_Note' => 'Musk',
        'Komposisi' => 'Alcohol, Perfume',
        'Ukuran' => 50,
        'Harga' => 150000,
        'Stok' => 10,
        'Deskripsi' => 'This is Perfume A.',
        'Best_Seller' => 'no',
    ]);

    $response = $this->get(route('products.detail', $product));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('products/detail')
        ->has('product')
    );
});

test('product detail includes the size variants from the database', function () {
    $product = Product::create([
        'nama' => 'Perfume Variant',
        'kategori' => 'EDP',
        'gender' => 'male',
        'Top_Note' => 'Lemon',
        'Middle_Note' => 'Rose',
        'Base_Note' => 'Musk',
        'Komposisi' => 'Alcohol, Perfume',
        'Deskripsi' => "Line one\nLine two",
        'Best_Seller' => 'yes',
    ]);

    $product->sizes()->createMany([
        ['Ukuran' => 30, 'Harga' => 120000, 'Diskon' => 10000, 'Stok' => 5],
        ['Ukuran' => 50, 'Harga' => 180000, 'Diskon' => 15000, 'Stok' => 12],
    ]);

    $response = $this->get(route('products.detail', $product));

    $response->assertOk();
    $response->assertJsonPath('product.sizes.0.Ukuran', 30);
    $response->assertJsonPath('product.sizes.1.Ukuran', 50);
    $response->assertJsonPath('product.sizes.0.Stok', 5);
    $response->assertJsonPath('product.sizes.1.Stok', 12);
});

test('guests are redirected to the login page when trying to access admin dashboard products', function () {
    $response = $this->get(route('products.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard products list', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('products.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard/products/index')
        ->has('products')
    );
});

test('authenticated users can create a new product', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('products.store'), [
        'nama' => 'Perfume New',
        'kategori' => 'EDP',
        'gender' => 'female',
        'Varian' => 'Premium',
        'Top_Note' => 'Apple',
        'Middle_Note' => 'Jasmine',
        'Base_Note' => 'Amber',
        'Komposisi' => 'Alcohol, Fragrance',
        'Ukuran' => 100,
        'Harga' => 200000,
        'Stok' => 25,
        'Deskripsi' => 'This is a brand new perfume.',
        'Foto' => UploadedFile::fake()->image('perfume.jpg'),
        'Best_Seller' => 'yes',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('products', [
        'nama' => 'Perfume New',
        'kategori' => 'EDP',
        'Best_Seller' => 'yes',
    ]);
});

test('authenticated users can update an existing product', function () {
    Storage::fake('public');

    $product = Product::create([
        'nama' => 'Perfume Old',
        'kategori' => 'EDP',
        'gender' => 'female',
        'Varian' => 'Premium',
        'Top_Note' => 'Apple',
        'Middle_Note' => 'Jasmine',
        'Base_Note' => 'Amber',
        'Komposisi' => 'Alcohol, Fragrance',
        'Ukuran' => 100,
        'Harga' => 200000,
        'Stok' => 25,
        'Deskripsi' => 'Old perfume description.',
        'Best_Seller' => 'no',
    ]);

    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->put(route('products.update', $product), [
        'nama' => 'Perfume Update',
        'kategori' => 'EDP',
        'gender' => 'female',
        'Varian' => 'Premium',
        'Top_Note' => 'Apple',
        'Middle_Note' => 'Jasmine',
        'Base_Note' => 'Amber',
        'Komposisi' => 'Alcohol, Fragrance',
        'Ukuran' => 100,
        'Harga' => 220000,
        'Stok' => 30,
        'Deskripsi' => 'Updated perfume description.',
        'Best_Seller' => 'yes',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'nama' => 'Perfume Update',
        'Harga' => '220000.00',
        'Best_Seller' => 'yes',
    ]);
});

test('authenticated users can delete a product', function () {
    $product = Product::create([
        'nama' => 'Perfume For Deletion',
        'kategori' => 'EDP',
        'gender' => 'unisex',
        'Varian' => 'Standard',
        'Top_Note' => 'Lemon',
        'Middle_Note' => 'Rose',
        'Base_Note' => 'Musk',
        'Komposisi' => 'Alcohol, Perfume',
        'Ukuran' => 50,
        'Harga' => 150000,
        'Stok' => 10,
        'Deskripsi' => 'To be deleted.',
        'Best_Seller' => 'no',
    ]);

    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->delete(route('products.destroy', $product));

    $response->assertRedirect();
    $this->assertDatabaseMissing('products', [
        'id' => $product->id,
    ]);
});
