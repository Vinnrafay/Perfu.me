import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/TestimoniController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Loader2,
    Plus,
    Star,
} from 'lucide-react';

interface Props {
    onCreated?: () => void;
}

export default function AddTestimoniSheet({ onCreated }: Props) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        email: '',
        komentar: '',
        rating: 5,
        profil: null as File | null,
    });

    const submitTestimoni = (e: React.FormEvent) => {
        e.preventDefault();

        post(store().url, {
            forceFormData: true,
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
                <Button>
                    <Plus />
                    Tambah Testimoni
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="h-screen w-screen max-w-none p-0 border-none rounded-none flex flex-col bg-background overflow-hidden !top-0 !translate-y-0"
            >
                <form onSubmit={submitTestimoni} className="flex flex-col h-full w-full overflow-hidden">

                    {/* STICKY HEADER */}
                    <SheetHeader>
                        <SheetTitle>
                            Tambah Testimoni Baru
                        </SheetTitle>
                    </SheetHeader>

                    {/* SCROLLABLE FORM CONTENT */}
                    <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                        <div className="w-full px-6 grid gap-6">

                            {/* Baris 1: Nama & Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="nama" className="text-sm font-medium">
                                    Nama Lengkap <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    placeholder="Contoh: John Doe"
                                />
                                {errors.nama && (
                                    <span className="text-[10px] text-destructive">{errors.nama}</span>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="john@example.com"
                                />
                                {errors.email && (
                                    <span className="text-[10px] text-destructive">{errors.email}</span>
                                )}
                            </div>

                            {/* Rating */}
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">
                                    Rating (1 - 5) <span className="text-destructive">*</span>
                                </Label>
                                <div className="flex items-center gap-1.5 py-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setData('rating', star)}
                                            className="p-0.5 focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-7 w-7 transition-colors ${star <= data.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-muted-foreground/30'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {errors.rating && (
                                    <span className="text-[10px] text-destructive">{errors.rating}</span>
                                )}
                            </div>

                            {/* Komentar / Ulasan */}
                            <div className="grid gap-2">
                                <Label htmlFor="komentar" className="text-sm font-medium">
                                    Komentar / Ulasan <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="komentar"
                                    rows={4}
                                    value={data.komentar}
                                    onChange={(e) => setData('komentar', e.target.value)}
                                    placeholder="Tulis testimoni atau ulasan pelanggan di sini..."
                                    className="resize-none"
                                />
                                {errors.komentar && (
                                    <span className="text-[10px] text-destructive">{errors.komentar}</span>
                                )}
                            </div>

                        </div>
                    </div>

                    <SheetFooter>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan Testimoni'
                            )}
                        </Button>
                        <SheetClose>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                            >
                                Batal
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}