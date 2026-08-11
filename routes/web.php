<?php

use App\Http\Controllers\ProductsController;
use App\Http\Controllers\TestimoniController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('/products', 'products/index')->name('products');
Route::inertia('/about', 'about')->name('about');
Route::inertia('/contact', 'contact')->name('contact');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('dashboard/products', ProductsController::class)
        ->parameters(['products' => 'product'])
        ->names('products');

    Route::resource('dashboard/testimoni', TestimoniController::class)
        ->parameters(['testimoni' => 'testimoni'])
        ->names('testimoni');
});

require __DIR__.'/settings.php';