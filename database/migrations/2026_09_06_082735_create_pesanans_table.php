<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pesanans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_pembeli');
            $table->string('no_wa');
            $table->text('alamat');
            $table->text('catatan')->nullable();
            $table->enum('metode_pembayaran', ['transfer', 'e-wallet', 'qris', 'cod']);
            // Nunjuk ke ukuran spesifik (bukan produk induk langsung), karena
            // harga & stok sekarang nempel di ProductSize, bukan di Product.
            $table->foreignId('product_size_id')->constrained()->restrictOnDelete();
            $table->integer('jumlah');
            $table->decimal('total_harga', 15, 2);
            // pending: baru masuk dari form publik, belum dicek admin
            // selesai: sudah diverifikasi admin (otomatis 'selesai' kalau admin input manual)
            $table->enum('verifikasi', ['pending', 'selesai'])->default('pending');
            // status pengiriman, cuma relevan setelah verifikasi = 'selesai'
            $table->enum('status', ['dikemas', 'dikirim', 'selesai'])->default('dikemas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanans');
    }
};