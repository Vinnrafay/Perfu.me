<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Testimoni;
use Inertia\Inertia;
use Inertia\Response;

class HomePageController extends Controller
{
    public function index(): Response
    {
        $testimonials = Testimoni::query()->latest()->get();
        $signatureProducts = Product::query()
            ->where('signature', 'yes')
            ->whereHas('sizes')
            ->with(['sizes' => fn ($query) => $query->orderBy('Ukuran')])
            ->latest()
            ->get();

        return Inertia::render('welcome', [
            'testimonials' => $testimonials,
            'signatureProducts' => $signatureProducts,
        ]);
    }
}
