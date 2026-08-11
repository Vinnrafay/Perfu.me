import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/TestimoniController'; // Sesuaikan path action controller
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
import { Plus, Star } from 'lucide-react';

interface AddTestimoniSheetProps {
    onCreated?: () => void;
}

export default function AddTestimoniSheet({ onCreated }: AddTestimoniSheetProps) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        email: '',
        komentar: '',
        rating: 5,
        profil: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Mengirim request menggunakan action Wayfinder
        post(store().url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
                onCreated?.();
            },
        });
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Testimoni
                </Button>
            </SheetTrigger>

            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Tambah Testimoni Baru</SheetTitle>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Nama */}
                    <div className="space-y-1">
                        <Label htmlFor="nama">Nama</Label>
                        <Input
                            id="nama"
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
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
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
                        <Label htmlFor="komentar">Komentar / Ulasan</Label>
                        <Textarea
                            id="komentar"
                            value={data.komentar}
                            onChange={(e) => setData('komentar', e.target.value)}
                            placeholder="Tulis testimoni pelanggan di sini..."
                            rows={4}
                        />
                        {errors.komentar && (
                            <p className="text-xs text-destructive">{errors.komentar}</p>
                        )}
                    </div>

                    {/* Foto Profil (Opsional) */}
                    <div className="space-y-1">
                        <Label htmlFor="profil">Foto Profil (Opsional)</Label>
                        <Input
                            id="profil"
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
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}