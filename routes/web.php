<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\TestimoniController;
use App\Http\Controllers\PesananController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomePageController::class, 'index'])->name('home');
Route::get('/products', [ProductsController::class, 'catalog'])->name('products');
Route::get('/products/{product}', [ProductsController::class, 'show'])->name('products.detail');
Route::inertia('/about', 'about')->name('about');
Route::inertia('/contact', 'contact')->name('contact');
Route::inertia('/checkout', 'checkout')->name('checkout');

// Form pesanan publik — customer isi ini dari halaman produk, TANPA login.
// verifikasi otomatis 'pending', nunggu dicek admin di dashboard.
Route::post('/pesanan', [PesananController::class, 'store'])->name('pesanan.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('dashboard', DashboardController::class)
        ->only(['index'])
        ->names('dashboard');

    Route::resource('dashboard/products', ProductsController::class)
        ->parameters(['products' => 'product'])
        ->names('products');

    Route::resource('dashboard/testimoni', TestimoniController::class)
        ->parameters(['testimoni' => 'testimoni'])
        ->names('testimoni');

    // Resource standar buat pesanan: index, update, destroy.
    // 'create' & 'edit' di-except karena dua-duanya dibuka lewat Sheet
    // (bukan halaman terpisah), dan 'show' juga gak dipakai.
    // 'store' juga di-except karena versi publik udah didaftarin di luar grup auth.
    Route::resource('dashboard/pesanan', PesananController::class)
        ->parameters(['pesanan' => 'pesanan'])
        ->except(['create', 'edit', 'show', 'store'])
        ->names('pesanan');

    // Endpoint tambahan khusus pesanan, di luar method resource standar.
    Route::post('dashboard/pesanan-admin', [PesananController::class, 'adminStore'])
        ->name('pesanan.admin-store');

    Route::patch('dashboard/pesanan/{pesanan}/verify', [PesananController::class, 'verify'])
        ->name('pesanan.verify');

    Route::patch('dashboard/pesanan/{pesanan}/status', [PesananController::class, 'updateStatus'])
        ->name('pesanan.update-status');

    // Invoice: halaman preview (struk) dulu, download PDF terpisah.
    Route::get('dashboard/pesanan/{pesanan}/invoice', [PesananController::class, 'invoice'])
        ->name('pesanan.invoice');

    Route::get('dashboard/pesanan/{pesanan}/invoice/download', [PesananController::class, 'downloadInvoice'])
        ->name('pesanan.invoice.download');
});

require __DIR__.'/settings.php';