import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { update } from '@/actions/App/Http/Controllers/TestimoniController'; // Sesuaikan path action controller
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from '@/components/ui/sheet';
import { Star } from 'lucide-react';
import { Testimoni } from './index';

interface EditTestimoniSheetProps {
    testimoni: Testimoni;
    trigger?: React.ReactNode;
    onUpdated?: () => void;
}

export default function EditTestimoniSheet({
    testimoni,
    trigger,
    onUpdated,
}: EditTestimoniSheetProps) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PUT', // Inertia/Laravel mengolah upload file/update form via POST dengan _method: PUT
        nama: testimoni.nama ?? '',
        email: testimoni.email ?? '',
        komentar: testimoni.komentar ?? '',
        rating: testimoni.rating ?? 5,
        profil: null as File | null,
    });

    // Reset form data jika props testimoni berubah
    useEffect(() => {
        setData({
            _method: 'PUT',
            nama: testimoni.nama ?? '',
            email: testimoni.email ?? '',
            komentar: testimoni.komentar ?? '',
            rating: testimoni.rating ?? 5,
            profil: null,
        });
    }, [testimoni]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Mengirimkan pembaruan data menggunakan URL action dari Wayfinder
        post(update(testimoni.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                onUpdated?.();
            },
        });
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger || <Button variant="outline">Edit</Button>}
            </SheetTrigger>

            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Edit Testimoni</SheetTitle>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Nama */}
                    <div className="space-y-1">
                        <Label htmlFor="edit-nama">Nama</Label>
                        <Input
                            id="edit-nama"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            placeholder="Contoh: John Doe"
                        />
                        {errors.nama && (
                            <p className="text-xs text-destructive">{errors.nama}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                            id="edit-email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="john@example.com"
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email}</p>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="space-y-1">
                        <Label>Rating (1 - 5)</Label>
                        <div className="flex items-center gap-1 py-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setData('rating', star)}
                                    className="p-0.5 focus:outline-none"
                                >
                                    <Star
                                        className={`h-6 w-6 transition-colors ${
                                            star <= data.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-muted-foreground/30'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {errors.rating && (
                            <p className="text-xs text-destructive">{errors.rating}</p>
                        )}
                    </div>

                    {/* Komentar */}
                    <div className="space-y-1">
                        <Label htmlFor="edit-komentar">Komentar / Ulasan</Label>
                        <Textarea
                            id="edit-komentar"
                            value={data.komentar}
                            onChange={(e) => setData('komentar', e.target.value)}
                            placeholder="Tulis ulasan di sini..."
                            rows={4}
                        />
                        {errors.komentar && (
                            <p className="text-xs text-destructive">{errors.komentar}</p>
                        )}
                    </div>

                    {/* Ganti Foto Profil */}
                    <div className="space-y-1">
                        <Label htmlFor="edit-profil">Ganti Foto Profil (Opsional)</Label>
                        {testimoni.profil && (
                            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                                <img
                                    src={testimoni.profil}
                                    alt="Current Profile"
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                                <span>Foto saat ini</span>
                            </div>
                        )}
                        <Input
                            id="edit-profil"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setData('profil', e.target.files ? e.target.files[0] : null)
                            }
                        />
                        {errors.profil && (
                            <p className="text-xs text-destructive">{errors.profil}</p>
                        )}
                    </div>

                    <SheetFooter className="pt-4">
                        <SheetClose asChild>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </SheetClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Simpan Changes...' : 'Perbarui'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}