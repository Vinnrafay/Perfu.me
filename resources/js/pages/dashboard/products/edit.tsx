import { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { update } from '@/actions/App/Http/Controllers/ProductsController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Loader2,
    UploadCloud,
    X,
} from 'lucide-react';

const kategoriOptions = ['EDP', 'EDT', 'Roll-On', 'Body Mist'];
const genderOptions = [
    { value: 'male', label: 'Pria' },
    { value: 'female', label: 'Wanita' },
    { value: 'unisex', label: 'Unisex' },
];

export interface Product {
    id: number;
    nama: string;
    kategori: string;
    gender: string;
    Varian: string;
    Top_Note: string;
    Middle_Note: string;
    Base_Note: string;
    Komposisi: string;
    Kemasan: string | null;
    Ukuran: number;
    Harga: number;
    Stok: number;
    Tanggal_launch: string | null;
    Deskripsi: string;
    Foto: string | null;
    'Best Seller'?: string;
    Best_Seller: 'yes' | 'no';
}

interface Props {
    product: Product;
    trigger?: React.ReactNode;
    onUpdated?: () => void;
}

export default function EditProductSheet({ product, trigger, onUpdated }: Props) {
    const [open, setOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(
        product.Foto ? `/storage/${product.Foto}` : null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, transform } = useForm({
        nama: product.nama ?? '',
        kategori: product.kategori ?? '',
        gender: product.gender ?? '',
        Varian: product.Varian ?? '',
        Top_Note: product.Top_Note ?? '',
        Middle_Note: product.Middle_Note ?? '',
        Base_Note: product.Base_Note ?? '',
        Komposisi: product.Komposisi ?? '',
        Kemasan: product.Kemasan ?? '',
        Ukuran: product.Ukuran?.toString() ?? '',
        Harga: product.Harga?.toString() ?? '',
        Stok: product.Stok?.toString() ?? '',
        Tanggal_launch: product.Tanggal_launch ?? '',
        Deskripsi: product.Deskripsi ?? '',
        Foto: null as File | null,
        Best_Seller: product.Best_Seller === 'yes',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('Foto', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('Foto', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const submitProduct = (e: React.FormEvent) => {
        e.preventDefault();

        // Method spoofing agar upload file binary bisa terkirim via PUT di Inertia/Laravel
        transform((data) => ({
            ...data,
            _method: 'put',
        }));

        post(update(product.id).url, {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                onUpdated?.();
            },
        });
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger ?? <Button variant="outline" className="rounded-lg">Edit</Button>}
            </SheetTrigger>
            
            <SheetContent 
                side="bottom" 
                onPointerDownOutside={(e) => e.preventDefault()}
                className="h-screen w-screen max-w-none p-0 border-none rounded-none flex flex-col bg-background overflow-hidden !top-0 !translate-y-0"
            >
                <form onSubmit={submitProduct} className="flex flex-col h-full w-full overflow-hidden">
                    
                    {/* STICKY HEADER: Tetap menempel rapi di atas */}
                    <div className="sticky top-0 z-50 shrink-0 px-6 sm:px-12 py-4 border-b border-border flex items-center justify-between bg-background/95 backdrop-blur-md">
                        <SheetTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                            Edit Produk: {product.nama}
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
                                    'Simpan Perubahan'
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* SCROLLABLE FORM CONTENT */}
                    <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                        <div className="max-w-3xl mx-auto w-full py-10 px-6 sm:px-8 grid gap-6">
                            
                            {/* Baris 1: Nama & Varian */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="nama" className="text-sm font-medium">Nama Produk <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                    />
                                    {errors.nama && <span className="text-[10px] text-destructive">{errors.nama}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="varian" className="text-sm font-medium">Varian Aroma</Label>
                                    <Input
                                        id="varian"
                                        value={data.Varian}
                                        onChange={(e) => setData('Varian', e.target.value)}
                                    />
                                    {errors.Varian && <span className="text-[10px] text-destructive">{errors.Varian}</span>}
                                </div>
                            </div>

                            {/* Baris 2: Kategori & Gender */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium">Kategori <span className="text-destructive">*</span></Label>
                                    <Select value={data.kategori} onValueChange={(val) => setData('kategori', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kategoriOptions.map((opt) => (
                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kategori && <span className="text-[10px] text-destructive">{errors.kategori}</span>}
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium">Gender <span className="text-destructive">*</span></Label>
                                    <Select value={data.gender} onValueChange={(val) => setData('gender', val)}>
                                        <SelectTrigger className="capitalize">
                                            <SelectValue placeholder="Pilih target" />
                                        </SelectTrigger>
                                        <SelectContent>
                                    {genderOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value} className="capitalize">
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                                    </Select>
                                    {errors.gender && <span className="text-[10px] text-destructive">{errors.gender}</span>}
                                </div>
                            </div>

                            {/* Notes Aroma */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="top_note" className="text-sm font-medium">Top Note</Label>
                                    <Input
                                        id="top_note"
                                        value={data.Top_Note}
                                        onChange={(e) => setData('Top_Note', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="middle_note" className="text-sm font-medium">Middle Note</Label>
                                    <Input
                                        id="middle_note"
                                        value={data.Middle_Note}
                                        onChange={(e) => setData('Middle_Note', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="base_note" className="text-sm font-medium">Base Note</Label>
                                    <Input
                                        id="base_note"
                                        value={data.Base_Note}
                                        onChange={(e) => setData('Base_Note', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Komposisi & Deskripsi */}
                            <div className="grid gap-2">
                                <Label htmlFor="komposisi" className="text-sm font-medium">Komposisi Bahan</Label>
                                <Textarea
                                    id="komposisi"
                                    rows={2}
                                    value={data.Komposisi}
                                    onChange={(e) => setData('Komposisi', e.target.value)}
                                    className="resize-none"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="deskripsi" className="text-sm font-medium">Deskripsi Singkat</Label>
                                <Textarea
                                    id="deskripsi"
                                    rows={4}
                                    value={data.Deskripsi}
                                    onChange={(e) => setData('Deskripsi', e.target.value)}
                                    className="resize-none"
                                />
                            </div>

                            {/* Harga, Stok, dll */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="ukuran" className="text-sm font-medium">Ukuran (ml) <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="ukuran"
                                        type="number"
                                        value={data.Ukuran}
                                        onChange={(e) => setData('Ukuran', e.target.value)}
                                    />
                                    {errors.Ukuran && <span className="text-[10px] text-destructive">{errors.Ukuran}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="kemasan" className="text-sm font-medium">Tipe Kemasan</Label>
                                    <Input
                                        id="kemasan"
                                        value={data.Kemasan}
                                        onChange={(e) => setData('Kemasan', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="harga" className="text-sm font-medium">Harga Jual (Rp) <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="harga"
                                        type="number"
                                        value={data.Harga}
                                        onChange={(e) => setData('Harga', e.target.value)}
                                    />
                                    {errors.Harga && <span className="text-[10px] text-destructive">{errors.Harga}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="stok" className="text-sm font-medium">Stok Awal <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="stok"
                                        type="number"
                                        value={data.Stok}
                                        onChange={(e) => setData('Stok', e.target.value)}
                                    />
                                    {errors.Stok && <span className="text-[10px] text-destructive">{errors.Stok}</span>}
                                </div>
                            </div>

                            {/* File Upload Dropzone dengan Preview */}
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">Foto Produk</Label>
                                <div className="relative border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/40 transition-colors min-h-[200px]">
                                    {imagePreview ? (
                                        <div className="relative w-full max-w-[240px] aspect-[4/5] rounded-md overflow-hidden border border-border bg-white">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-full transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <UploadCloud className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                                            <p className="text-sm font-medium">Klik untuk mengganti foto</p>
                                            <p className="text-xs text-muted-foreground mt-1">Format: JPG, PNG, WebP (Maks. 2MB)</p>
                                        </div>
                                    )}
                                    <Input
                                        ref={fileInputRef}
                                        id="foto"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                                {errors.Foto && <span className="text-[10px] text-destructive">{errors.Foto}</span>}
                            </div>

                            {/* Options (Launch Date & Best Seller) */}
                            <div className="flex flex-col sm:flex-row gap-6 mt-2 pb-10">
                                <div className="grid gap-2 flex-1">
                                    <Label htmlFor="tanggal_launch" className="text-sm font-medium">Tanggal Launching</Label>
                                    <Input
                                        id="tanggal_launch"
                                        type="date"
                                        value={data.Tanggal_launch}
                                        onChange={(e) => setData('Tanggal_launch', e.target.value)}
                                    />
                                </div>
                                
                                <div className="flex-1 border border-border rounded-lg p-4 flex items-center justify-between bg-card">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="best_seller" className="text-sm font-medium cursor-pointer">
                                            Status Best Seller
                                        </Label>
                                        <p className="text-xs text-muted-foreground">Tandai produk ini sebagai unggulan toko</p>
                                    </div>
                                    <Checkbox
                                        id="best_seller"
                                        checked={data.Best_Seller}
                                        onCheckedChange={(checked) => setData('Best_Seller', Boolean(checked))}
                                        className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}