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
            $table->enum('original', ['Original', 'Refill']);
            $table->string('brand')->nullable();
            $table->string('Top_Note');
            $table->string('Middle_Note');
            $table->string('Base_Note');
            $table->string('Komposisi');
            $table->string('Kemasan')->nullable();
            $table->date('Tanggal_launch')->nullable();
            $table->text('Deskripsi');
            $table->string('Foto', 255)->nullable();
            $table->enum('Best_Seller', ['yes', 'no'])->default('no');
            $table->enum('signature', ['yes', 'no'])->default('no');
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