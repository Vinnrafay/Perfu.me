<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pesanan extends Model
{
    protected $fillable = [
        'nama_pembeli',
        'no_wa',
        'alamat',
        'catatan',
        'metode_pembayaran',
        'product_size_id',
        'jumlah',
        'total_harga',
        'verifikasi',
        'status',
    ];

    protected $casts = [
        'jumlah' => 'integer',
        'total_harga' => 'decimal:2',
    ];

    public function productSize(): BelongsTo
    {
        return $this->belongsTo(ProductSize::class);
    }
}