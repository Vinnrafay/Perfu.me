<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\TestimoniController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomePageController::class, 'index'])->name('home');
Route::get('/products', [ProductsController::class, 'catalog'])->name('products');
Route::get('/products/{product}', [ProductsController::class, 'show'])->name('products.detail');
Route::inertia('/about', 'about')->name('about');
Route::inertia('/contact', 'contact')->name('contact');

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
    
    Route::resource('dashboard/order', OrderController::class)
        ->parameters(['order' => 'order'])
        ->names('order');
});

require __DIR__.'/settings.php';
