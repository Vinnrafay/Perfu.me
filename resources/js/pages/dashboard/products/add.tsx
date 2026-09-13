import { useState, useRef, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/ProductsController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Loader2,
    Plus,
    Trash2,
    UploadCloud,
    X,
    ImagePlus
} from 'lucide-react';
import { ButtonGroup } from '@/components/ui/button-group';

const kategoriOptions = ['EDP', 'EDT', 'EDC'];
const genderOptions = [
    { value: 'male', label: 'Pria' },
    { value: 'female', label: 'Wanita' },
    { value: 'unisex', label: 'Unisex' },
];
const originalOptions = [
    { value: 'Original', label: 'Original' },
    { value: 'Refill', label: 'Refill' },
] as const;

interface Props {
    onCreated?: () => void;
}

interface SizeForm {
    id?: number;
    Ukuran: string;
    Harga: string;
    Diskon: string;
    Stok: string;
}

const emptySize = (): SizeForm => ({ Ukuran: '', Harga: '', Diskon: '', Stok: '' });

const formatNumber = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined || val === '') return '';
    const raw = val.toString().replace(/\D/g, '');
    if (!raw) return '';
    return new Intl.NumberFormat('id-ID').format(Number(raw));
};

const parseRawNumber = (val: string): string => val.replace(/\D/g, '');

export default function AddProductSheet({ onCreated }: Props) {
    const [open, setOpen] = useState(false);

    // State Previews
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        nama: '',
        kategori: '',
        gender: '',
        original: 'Original' as 'Original' | 'Refill',
        brand: '',
        Top_Note: '',
        Middle_Note: '',
        Base_Note: '',
        Komposisi: '',
        Kemasan: '',
        Tanggal_launch: '',
        Deskripsi: '',
        Foto: null as File | null,
        Gallery: [] as File[],
        Best_Seller: false,
        signature: false,
        sizes: [emptySize()] as SizeForm[],
    });

    const fieldError = (key: string) => (errors as Record<string, string>)[key];
    const isRefill = data.original === 'Refill';

    // Bersihkan memory saat sheet ditutup
    useEffect(() => {
        if (!open) {
            reset();
            clearErrors();
            setImagePreview(null);
            galleryPreviews.forEach(url => URL.revokeObjectURL(url));
            setGalleryPreviews([]);
        }
    }, [open]);

    // --- Handler Foto Utama ---
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('Foto', file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('Foto', null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // --- Handler Foto Gallery ---
    // Selalu APPEND file baru ke data.Gallery yang lama (bukan replace), dan
    // preview blob URL-nya juga cuma ditambahkan ke belakang array yang lama.
    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const updatedGallery = [...data.Gallery, ...files];
            setData('Gallery', updatedGallery);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
        if (galleryInputRef.current) galleryInputRef.current.value = '';
    };

    const removeGalleryImage = (indexToRemove: number) => {
        const newGallery = data.Gallery.filter((_, idx) => idx !== indexToRemove);
        setData('Gallery', newGallery);

        URL.revokeObjectURL(galleryPreviews[indexToRemove]);
        const newPreviews = galleryPreviews.filter((_, idx) => idx !== indexToRemove);
        setGalleryPreviews(newPreviews);
    };

    const selectOriginal = (val: 'Original' | 'Refill') => {
        setData((prev) => ({
            ...prev,
            original: val,
            signature: val === 'Refill' ? false : prev.signature,
        }));
    };

    // --- Varian ukuran ---
    const addSize = () => {
        setData('sizes', [...data.sizes, emptySize()]);
    };

    const removeSize = (index: number) => {
        if (data.sizes.length <= 1) return;
        setData('sizes', data.sizes.filter((_, i) => i !== index));
    };

    const updateSize = (index: number, field: keyof SizeForm, value: string) => {
        setData(
            'sizes',
            data.sizes.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
        );
    };

    const submitProduct = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url, {
            forceFormData: true, // WAJIB untuk mengirim File & File[] ke Laravel
            onSuccess: () => {
                setOpen(false);
                onCreated?.();
            },
        });
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Produk
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="h-screen w-screen max-w-none p-0 border-none rounded-none flex flex-col bg-background overflow-hidden !top-0 !translate-y-0"
            >
                <form onSubmit={submitProduct} className="flex flex-col h-full w-full overflow-hidden">

                    <SheetHeader>
                        <SheetTitle>
                            Tambah Produk Baru
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 min-h-0 overflow-y-auto w-full custom-scrollbar" data-lenis-prevent>
                        <div className="max-w-3xl mx-auto w-full p-6 grid gap-6">

                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">
                                    Tipe Produk <span className="text-destructive">*</span>
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <ButtonGroup className="w-full">
                                        {originalOptions.map((opt) => (
                                            <Button
                                                key={opt.value}
                                                type="button"
                                                variant={data.original === opt.value ? 'default' : 'outline'}
                                                onClick={() => selectOriginal(opt.value)}
                                                className="w-full"
                                            >
                                                {opt.label}
                                            </Button>
                                        ))}
                                    </ButtonGroup>
                                </div>
                                {errors.original && <span className="text-[10px] text-destructive">{errors.original}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nama" className="text-sm font-medium">Nama Produk <span className="text-destructive">*</span></Label>
                                <Input
                                    id="nama"
                                    placeholder="Masukkan nama produk"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                />
                                {errors.nama && <span className="text-[10px] text-destructive">{errors.nama}</span>}
                            </div>

                            {isRefill && (
                                <div className="grid gap-2">
                                    <Label htmlFor="brand" className="text-sm font-medium">Brand Original <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="brand"
                                        placeholder="Contoh: Chanel, Dior, YSL..."
                                        value={data.brand}
                                        onChange={(e) => setData('brand', e.target.value)}
                                    />
                                    {errors.brand && <span className="text-[10px] text-destructive">{errors.brand}</span>}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium">Kategori <span className="text-destructive">*</span></Label>
                                    <Select value={data.kategori} onValueChange={(val) => setData('kategori', val)}>
                                        <SelectTrigger className="w-full">
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
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih target gender" />
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

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="top_note" className="text-sm font-medium">Top Note <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="top_note"
                                        placeholder="Wangian awal..."
                                        value={data.Top_Note}
                                        onChange={(e) => setData('Top_Note', e.target.value)}
                                    />
                                    {errors.Top_Note && <span className="text-[10px] text-destructive">{errors.Top_Note}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="middle_note" className="text-sm font-medium">Middle Note <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="middle_note"
                                        placeholder="Wangian inti..."
                                        value={data.Middle_Note}
                                        onChange={(e) => setData('Middle_Note', e.target.value)}
                                    />
                                    {errors.Middle_Note && <span className="text-[10px] text-destructive">{errors.Middle_Note}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="base_note" className="text-sm font-medium">Base Note <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="base_note"
                                        placeholder="Wangian akhir (dry down)..."
                                        value={data.Base_Note}
                                        onChange={(e) => setData('Base_Note', e.target.value)}
                                    />
                                    {errors.Base_Note && <span className="text-[10px] text-destructive">{errors.Base_Note}</span>}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="komposisi" className="text-sm font-medium">Komposisi Bahan</Label>
                                <Textarea
                                    id="komposisi"
                                    rows={2}
                                    placeholder="Alkohol, Fragrance Oil, Fixative..."
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
                                    placeholder="Jelaskan karakteristik parfum ini..."
                                    value={data.Deskripsi}
                                    onChange={(e) => setData('Deskripsi', e.target.value)}
                                    className="resize-none"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="kemasan" className="text-sm font-medium">Tipe Kemasan</Label>
                                <Input
                                    id="kemasan"
                                    placeholder="Botol Kaca"
                                    value={data.Kemasan}
                                    onChange={(e) => setData('Kemasan', e.target.value)}
                                />
                            </div>

                            {/* Varian Ukuran — bisa lebih dari satu */}
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">
                                        Varian Ukuran <span className="text-destructive">*</span>
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addSize}
                                    >
                                        <Plus className="w-3.5 h-3.5 mr-1" />
                                        Tambah Ukuran
                                    </Button>
                                </div>
                                {typeof errors.sizes === 'string' && (
                                    <span className="text-[10px] text-destructive">{errors.sizes}</span>
                                )}

                                <div className="grid gap-4">
                                    {data.sizes.map((size, index) => {
                                        const hargaAkhir = Math.max(
                                            0,
                                            (Number(size.Harga) || 0) - (Number(size.Diskon) || 0),
                                        );

                                        return (
                                            <div
                                                key={index}
                                                className="rounded-lg border border-border p-4 grid gap-4 bg-card relative"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-muted-foreground">
                                                        Ukuran #{index + 1}
                                                    </span>
                                                    {data.sizes.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSize(index)}
                                                            className="text-destructive hover:opacity-70 transition-opacity"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-medium">Ukuran (ml)</Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="50"
                                                            value={size.Ukuran}
                                                            onChange={(e) => updateSize(index, 'Ukuran', e.target.value)}
                                                        />
                                                        {fieldError(`sizes.${index}.Ukuran`) && (
                                                            <span className="text-[10px] text-destructive">
                                                                {fieldError(`sizes.${index}.Ukuran`)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-medium">Stok</Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="100"
                                                            value={size.Stok}
                                                            onChange={(e) => updateSize(index, 'Stok', e.target.value)}
                                                        />
                                                        {fieldError(`sizes.${index}.Stok`) && (
                                                            <span className="text-[10px] text-destructive">
                                                                {fieldError(`sizes.${index}.Stok`)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-medium">Harga (Rp)</Label>
                                                        <Input
                                                            type="text"
                                                            inputMode="numeric"
                                                            placeholder="45.000"
                                                            value={formatNumber(size.Harga)}
                                                            onChange={(e) =>
                                                                updateSize(index, 'Harga', parseRawNumber(e.target.value))
                                                            }
                                                        />
                                                        {fieldError(`sizes.${index}.Harga`) && (
                                                            <span className="text-[10px] text-destructive">
                                                                {fieldError(`sizes.${index}.Harga`)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-medium">Diskon (Rp)</Label>
                                                        <Input
                                                            type="text"
                                                            inputMode="numeric"
                                                            placeholder="0"
                                                            value={formatNumber(size.Diskon)}
                                                            onChange={(e) =>
                                                                updateSize(index, 'Diskon', parseRawNumber(e.target.value))
                                                            }
                                                        />
                                                        {fieldError(`sizes.${index}.Diskon`) && (
                                                            <span className="text-[10px] text-destructive">
                                                                {fieldError(`sizes.${index}.Diskon`)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="rounded-md bg-muted/30 px-3 py-2 flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">Harga Akhir</span>
                                                    <span className="text-sm font-semibold">
                                                        Rp {formatNumber(hargaAkhir)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Foto Utama */}
                            <div className="grid gap-2 border-t pt-6">
                                <Label className="text-sm font-medium">Foto Produk Utama</Label>
                                <div className="relative border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/40 transition-colors min-h-[200px]">
                                    {imagePreview ? (
                                        <div className="relative w-full max-w-60 aspect-4/5 rounded-md overflow-hidden border border-border bg-white">
                                            <img src={imagePreview} alt="Preview Utama" className="w-full h-full object-contain" />
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
                                            <p className="text-sm font-medium">Klik untuk mengunggah foto utama</p>
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
                                        disabled={!!imagePreview}
                                    />
                                </div>
                                {errors.Foto && <span className="text-[10px] text-destructive">{errors.Foto}</span>}
                            </div>

                            {/* Gallery / Banyak Foto */}
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">Gallery Produk (Opsional)</Label>
                                <p className="text-xs text-muted-foreground mb-2">Tambahkan foto lain dari produk ini untuk ditampilkan sebagai slide.</p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {/* Preview Gallery */}
                                    {galleryPreviews.map((preview, idx) => (
                                        <div key={preview} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-white group">
                                            <img src={preview} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(idx)}
                                                className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black text-white p-1 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Tombol Add Gallery */}
                                    <div className="relative aspect-square rounded-lg border-2 border-dashed border-border bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center cursor-pointer">
                                        <ImagePlus className="w-6 h-6 text-muted-foreground mb-1" />
                                        <span className="text-[11px] font-medium text-muted-foreground">Tambah Foto</span>
                                        <Input
                                            ref={galleryInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            multiple
                                            onChange={handleGalleryChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                {errors.Gallery && <span className="text-[10px] text-destructive">{errors.Gallery}</span>}
                            </div>

                            <div className="grid gap-2 flex-1">
                                <Label htmlFor="tanggal_launch" className="text-sm font-medium">Tanggal Launching</Label>
                                <Input
                                    id="tanggal_launch"
                                    type="date"
                                    value={data.Tanggal_launch}
                                    onChange={(e) => setData('Tanggal_launch', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-3 border-t pt-6">
                                <div className="flex-1 border border-border rounded-lg p-4 flex items-center justify-between bg-card">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="best_seller" className="text-sm font-medium cursor-pointer">
                                            Status Best Seller
                                        </Label>
                                        <p className="text-xs text-muted-foreground text-balance">Tandai produk ini sebagai unggulan toko</p>
                                    </div>
                                    <Checkbox
                                        id="best_seller"
                                        checked={data.Best_Seller}
                                        onCheckedChange={(checked) => setData('Best_Seller', Boolean(checked))}
                                        className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                                    />
                                </div>

                                {!isRefill && (
                                    <div className="flex-1 border border-border rounded-lg p-4 flex items-center justify-between bg-card">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="signature" className="text-sm font-medium cursor-pointer">
                                                Signature
                                            </Label>
                                            <p className="text-xs text-muted-foreground text-balance">Tandai sebagai racikan signature (produk juga akan muncul di halaman depan)</p>
                                        </div>
                                        <Checkbox
                                            id="signature"
                                            checked={data.signature}
                                            onCheckedChange={(checked) => setData('signature', Boolean(checked))}
                                            className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                                        />
                                    </div>
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
                                'Simpan Produk'
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
