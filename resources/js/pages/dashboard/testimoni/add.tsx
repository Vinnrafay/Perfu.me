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
                <Button className="flex items-center gap-2 rounded-lg bg-black hover:bg-black/90 text-white text-xs px-4 h-9">
                    <Plus className="h-4 w-4" />
                    Tambah Testimoni
                </Button>
            </SheetTrigger>

            <SheetContent 
                side="bottom" 
                className="h-screen w-screen max-w-none p-0 border-none rounded-none flex flex-col bg-background overflow-hidden !top-0 !translate-y-0"
            >
                <form onSubmit={handleSubmit} className="flex flex-col h-full w-full overflow-hidden">
                    
                    {/* STICKY HEADER */}
                    <div className="sticky top-0 z-50 shrink-0 px-6 sm:px-12 py-4 border-b border-border flex items-center justify-between bg-background/95 backdrop-blur-md">
                        <SheetTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                            Tambah Testimoni Baru
                        </SheetTitle>
                        
                        <div className="flex items-center gap-3">
                            <SheetClose asChild>
                                <Button type="button" variant="outline" size="sm" className="rounded-lg text-xs h-9">
                                    Batal
                                </Button>
                            </SheetClose>
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="rounded-lg bg-black hover:bg-black/90 text-white text-xs px-4 h-9 min-w-[130px]"
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
                        </div>
                    </div>

                    {/* SCROLLABLE FORM CONTENT */}
                    <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                        <div className="max-w-3xl mx-auto w-full py-10 px-6 sm:px-8 grid gap-6">
                            
                            {/* Baris 1: Nama & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                                className={`h-7 w-7 transition-colors ${
                                                    star <= data.rating
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
                            <div className="grid gap-2 pb-10">
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
                </form>
            </SheetContent>
        </Sheet>
    );
}