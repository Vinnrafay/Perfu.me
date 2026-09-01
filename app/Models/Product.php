<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'nama',
        'kategori',
        'gender',
        'original',
        'brand',
        'Top_Note',
        'Middle_Note',
        'Base_Note',
        'Komposisi',
        'Kemasan',
        'Tanggal_launch',
        'Deskripsi',
        'Foto',
        'Best_Seller',
        'signature',
    ];

    protected $casts = [
        'Tanggal_launch' => 'date',
    ];

    /**
     * Varian ukuran produk (dulu Ukuran/Harga/Diskon/Stok ada di tabel ini,
     * sekarang dipecah ke tabel product_sizes supaya 1 produk bisa punya
     * beberapa ukuran, masing-masing dengan harga/diskon/stok sendiri).
     */
    public function sizes()
    {
        return $this->hasMany(ProductSize::class)->orderBy('Ukuran');
    }
}