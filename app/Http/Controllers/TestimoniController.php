<?php

namespace App\Http\Controllers;

use App\Models\Testimoni;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimoniController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $testimonis = Testimoni::latest()->paginate(10);

        return Inertia::render('testimoni/index', [
            'testimonis' => $testimonis,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('testimoni/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:testimonis,email'],
            'profil' => ['nullable', 'string', 'max:255'],
            'komentar' => ['required', 'string', 'max:1000'],
            'rating' => ['required', 'integer', 'in:1,2,3,4,5'],
        ]);

        Testimoni::create($validated);

        return redirect()
            ->route('testimoni.index')
            ->with('success', 'Testimoni berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Testimoni $testimoni): Response
    {
        return Inertia::render('testimoni/show', [
            'testimoni' => $testimoni,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Testimoni $testimoni): Response
    {
        return Inertia::render('testimoni/edit', [
            'testimoni' => $testimoni,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Testimoni $testimoni): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:testimonis,email,' . $testimoni->id],
            'profil' => ['nullable', 'string', 'max:255'],
            'komentar' => ['required', 'string', 'max:1000'],
            'rating' => ['required', 'integer', 'in:1,2,3,4,5'],
        ]);

        $testimoni->update($validated);

        return redirect()
            ->route('testimoni.index')
            ->with('success', 'Testimoni berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Testimoni $testimoni): RedirectResponse
    {
        $testimoni->delete();

        return redirect()
            ->route('testimoni.index')
            ->with('success', 'Testimoni berhasil dihapus.');
    }
}