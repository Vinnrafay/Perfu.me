<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'nama',
        'kategori',
        'gender',
        'Varian',
        'Top Note',
        'Middle Note',
        'Base Note',
        'Komposisi',
        'Kemasan',
        'Ukuran',
        'Harga',
        'Stok',
        'Tanggal launch',
        'Deskripsi',
        'Foto',
        'Best Seller',
    ];

    protected $casts = [
        'Tanggal launch' => 'date',
        'Harga' => 'decimal:2',
        'Ukuran' => 'integer',
        'Stok' => 'integer',
    ];
}