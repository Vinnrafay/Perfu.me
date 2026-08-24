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
        'Ukuran',
        'Harga',
        'Diskon',
        'Stok',
        'Tanggal_launch',
        'Deskripsi',
        'Foto',
        'Best_Seller',
        'signature',
    ];

    protected $casts = [
        'Tanggal_launch' => 'date',
        'Harga' => 'decimal:2',
        'Diskon' => 'decimal:2',
        'Ukuran' => 'integer',
        'Stok' => 'integer',
    ];

    /**
     * Harga akhir setelah dikurangi diskon.
     * Ini dihitung otomatis (bukan disimpan manual di database),
     * jadi selalu sinkron begitu Harga atau Diskon diubah.
     *
     * @return \Illuminate\Database\Eloquent\Casts\Attribute
     */
    protected function hargaAkhir(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn () => max(0, (float) $this->Harga - (float) ($this->Diskon ?? 0)),
        );
    }

    /**
     * Otomatis ikut ke-include tiap kali model di-convert ke array/JSON
     * (misal dikirim ke frontend lewat Inertia::render).
     *
     * @var array<int, string>
     */
    protected $appends = [
        'harga_akhir',
    ];
}
