<?php

use App\Http\Controllers\ProductsController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('/products', [ProductsController::class, 'index'])->name('products.index');
Route::inertia('/products', 'products')->name('products');
Route::inertia('/about', 'about')->name('about');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
