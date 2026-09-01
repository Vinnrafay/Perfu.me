<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class ProductSize extends Model
{
    protected $fillable = [
        'product_id',
        'Ukuran',
        'Harga',
        'Diskon',
        'Stok',
    ];

    protected $casts = [
        'Ukuran' => 'integer',
        'Harga' => 'decimal:2',
        'Diskon' => 'decimal:2',
        'Stok' => 'integer',
    ];

    /**
     * Harga akhir setelah dikurangi diskon.
     * Dipindah ke sini (dari Product) karena tiap ukuran sekarang
     * bisa punya harga/diskon sendiri-sendiri.
     *
     * @return \Illuminate\Database\Eloquent\Casts\Attribute
     */
    protected function hargaAkhir(): Attribute
    {
        return Attribute::make(
            get: fn () => max(0, (float) $this->Harga - (float) ($this->Diskon ?? 0)),
        );
    }

    /**
     * Otomatis ikut ke-include tiap kali model di-convert ke array/JSON.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'harga_akhir',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}