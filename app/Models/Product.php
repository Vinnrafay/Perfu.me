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
        'Top_Note',
        'Middle_Note',
        'Base_Note',
        'Komposisi',
        'Kemasan',
        'Ukuran',
        'Harga',
        'Stok',
        'Tanggal_launch',
        'Deskripsi',
        'Foto',
        'Best_Seller',
    ];

    protected $casts = [
        'Tanggal_launch' => 'date',
        'Harga' => 'decimal:2',
        'Ukuran' => 'integer',
        'Stok' => 'integer',
    ];
}
