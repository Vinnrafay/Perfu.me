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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->enum('kategori', ['EDP', 'EDT', 'Roll-On', 'Body Mist']);
            $table->enum('gender', ['male', 'female', 'unisex']);
            $table->string('Varian');
            $table->string('Top Note');
            $table->string('Middle Note');
            $table->string('Base Note');
            $table->string('Komposisi');
            $table->string('Kemasan')->nullable();
            $table->integer('Ukuran');
            $table->decimal('Harga', 8, 2);
            $table->integer('Stok');
            $table->date('Tanggal launch')->nullable();
            $table->text('Deskripsi');
            $table->string('Foto', 255)->nullable();
            $table->enum('Best Seller', ['yes', 'no'])->default('no');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
