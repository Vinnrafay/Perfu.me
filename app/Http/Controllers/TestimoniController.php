<?php

namespace App\Http\Controllers;

use App\Models\Testimoni;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TestimoniController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $testimonis = Testimoni::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('komentar', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('dashboard/testimoni/index', [
            'testimonis' => $testimonis,
            'filters' => [
                'search' => $request->input('search', ''),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('dashboard/testimoni/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:testimonis,email'],
            // Ini gua FIX: Ubah validasi string jadi file gambar
            'profil' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'komentar' => ['required', 'string', 'max:1000'],
            'rating' => ['required', 'integer', 'in:1,2,3,4,5'],
        ]);

        // Ini gua FIX: simpanz
        if ($request->hasFile('profil')) {
            $validated['profil'] = $request->file('profil')->store('testimonis', 'public');
        }

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
        return Inertia::render('dashboard/testimoni/show', [
            'testimoni' => $testimoni,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Testimoni $testimoni): Response
    {
        return Inertia::render('dashboard/testimoni/edit', [
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
            'email' => ['required', 'email', 'max:255', 'unique:testimonis,email,'.$testimoni->id],
            // Ini gua FIX: validasi string jadi file gambar
            'profil' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'komentar' => ['required', 'string', 'max:1000'],
            'rating' => ['required', 'integer', 'in:1,2,3,4,5'],
        ]);

        // Ini gua FIX: Handle update file profil (rafay)
        if ($request->hasFile('profil')) {
            // Hapus foto lama jika ada
            if ($testimoni->profil && Storage::disk('public')->exists($testimoni->profil)) {
                Storage::disk('public')->delete($testimoni->profil);
            }
            $validated['profil'] = $request->file('profil')->store('testimonis', 'public');
        }

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
        // Opsional: Hapus file dari storage saat data dihapus
        if ($testimoni->profil && Storage::disk('public')->exists($testimoni->profil)) {
            Storage::disk('public')->delete($testimoni->profil);
        }

        $testimoni->delete();

        return redirect()
            ->route('testimoni.index')
            ->with('success', 'Testimoni berhasil dihapus.');
    }
}
