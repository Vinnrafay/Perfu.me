<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Pesanan::query()
            ->with('productSize.product')
            ->get(['id', 'product_size_id', 'jumlah', 'total_harga', 'created_at']);

        $variantLabel = static function (Pesanan $order): string {
            $product = $order->productSize?->product;
            $size = $order->productSize?->Ukuran;

            return trim(($product?->nama ?? 'Varian tidak diketahui').' '.($size ? "{$size}ml" : ''));
        };

        $dailySales = $orders
            ->groupBy(fn (Pesanan $order): string => $order->created_at->toDateString())
            ->map(function ($orders, string $date) use ($variantLabel): array {
                return [
                    'date' => $date,
                    'revenue' => (float) $orders->sum('total_harga'),
                    'units' => (int) $orders->sum('jumlah'),
                    'topVariants' => $orders
                        ->groupBy($variantLabel)
                        ->map(fn ($variantOrders, string $variant): array => [
                            'variant' => $variant,
                            'units' => (int) $variantOrders->sum('jumlah'),
                        ])
                        ->sortByDesc('units')
                        ->take(3)
                        ->values()
                        ->all(),
                ];
            })
            ->sortBy('date')
            ->values()
            ->all();

        $topSellingVariants = $orders
            ->groupBy($variantLabel)
            ->map(fn ($variantOrders, string $variant): array => [
                'variant' => $variant,
                'units' => (int) $variantOrders->sum('jumlah'),
            ])
            ->sortByDesc('units')
            ->take(10)
            ->values()
            ->all();

        return inertia('dashboard', [
            'summary' => [
                'revenue' => (float) $orders->sum('total_harga'),
                'unitsSold' => (int) $orders->sum('jumlah'),
                'orders' => $orders->count(),
                'pendingOrders' => Pesanan::query()->where('verifikasi', 'pending')->count(),
            ],
            'dailySales' => $dailySales,
            'topSellingVariants' => $topSellingVariants,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
