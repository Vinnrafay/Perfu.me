import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { update } from '@/actions/App/Http/Controllers/TestimoniController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Star } from 'lucide-react';
import { Testimoni } from './index';

interface Props {
    testimoni: Testimoni;
    trigger?: React.ReactNode;
    onUpdated?: () => void;
}

export default function EditTestimoniSheet({ testimoni, trigger, onUpdated }: Props) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PUT',
        nama: testimoni.nama ?? '',
        email: testimoni.email ?? '',
        komentar: testimoni.komentar ?? '',
        rating: testimoni.rating ?? 5,
        profil: null as File | null,
    });

    useEffect(() => {
        setData({
            _method: 'PUT',
            nama: testimoni.nama ?? '',
            email: testimoni.email ?? '',
            komentar: testimoni.komentar ?? '',
            rating: testimoni.rating ?? 5,
            profil: null,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testimoni]);

    const submitTestimoni = (e: React.FormEvent) => {
        e.preventDefault();
        post(update(testimoni.id).url, {
            forceFormData: true,
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

            <SheetContent className="flex flex-col gap-0 sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Edit Testimoni</SheetTitle>
                    <SheetDescription>
                        Perbarui detail testimoni, lalu klik simpan.
                    </SheetDescription>
                </SheetHeader>

                <form
                    onSubmit={submitTestimoni}
                    className="grid min-h-0 flex-1 auto-rows-min gap-5 overflow-y-auto px-4 pb-4"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="edit-nama">Nama</Label>
                        <Input
                            id="edit-nama"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            placeholder="Contoh: John Doe"
                        />
                        {errors.nama && (
                            <span className="text-xs text-destructive">{errors.nama}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                            id="edit-email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="john@example.com"
                        />
                        {errors.email && (
                            <span className="text-xs text-destructive">{errors.email}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label>Rating (1-5)</Label>
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
                            <span className="text-xs text-destructive">{errors.rating}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-komentar">Komentar / Ulasan</Label>
                        <Textarea
                            id="edit-komentar"
                            rows={4}
                            value={data.komentar}
                            onChange={(e) => setData('komentar', e.target.value)}
                            placeholder="Tulis ulasan di sini..."
                        />
                        {errors.komentar && (
                            <span className="text-xs text-destructive">{errors.komentar}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-profil">Foto Profil (opsional)</Label>
                        <Input
                            id="edit-profil"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) =>
                                setData('profil', e.target.files ? e.target.files[0] : null)
                            }
                        />
                        {errors.profil && (
                            <span className="text-xs text-destructive">{errors.profil}</span>
                        )}
                    </div>

                    <SheetFooter className="px-0">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Perbarui'}
                        </Button>
                        <SheetClose asChild>
                            <Button type="button" variant="outline">Batal</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}