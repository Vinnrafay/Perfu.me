import { useRef, useEffect, useState } from 'react';
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
    SheetFooter,
    SheetHeader,
    SheetTitle,
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

export interface ProductSize {
    id: number;
    Ukuran: number;
    Harga: number;
    Diskon: number | null;
    Stok: number;
    harga_akhir?: number;
}

export interface Product {
    id: number;
    nama: string;
    kategori: string;
    gender: string;
    original: 'Original' | 'Refill';
    brand: string | null;
    Top_Note: string | null;
    Middle_Note: string | null;
    Base_Note: string | null;
    Komposisi: string;
    Kemasan: string | null;
    Tanggal_launch: string | null;
    Deskripsi: string;
    Foto: string | null;
    Gallery?: string | string[];
    'Best Seller'?: string;
    Best_Seller: 'yes' | 'no';
    signature: 'yes' | 'no';
    sizes: ProductSize[];
}

interface Props {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdated?: () => void;
}

interface SizeForm {
    id?: number;
    Ukuran: string;
    Harga: string;
    Diskon: string;
    Stok: string;
}

const emptySize = (): SizeForm => ({ Ukuran: '', Harga: '', Diskon: '', Stok: '' });

// FIX: Parsing angka dari DB dibulatkan dulu untuk mencegah bug desimal .00 nambahin nol
const sizesFromProduct = (product: Product): SizeForm[] => {
    if (!product.sizes || product.sizes.length === 0) return [emptySize()];
    return product.sizes.map((s) => ({
        id: s.id,
        Ukuran: s.Ukuran?.toString() ?? '',
        Harga: s.Harga !== null && s.Harga !== undefined ? Math.round(Number(s.Harga)).toString() : '',
        Diskon: s.Diskon !== null && s.Diskon !== undefined ? Math.round(Number(s.Diskon)).toString() : '',
        Stok: s.Stok?.toString() ?? '',
    }));
};

// FIX: Format number yang aman dari angka desimal
const formatNumber = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined || val === '') return '';
    const num = typeof val === 'number' ? val : parseFloat(val.toString().replace(',', '.'));
    if (isNaN(num)) {
        const numericValue = val.toString().replace(/\D/g, '');
        if (!numericValue) return '';
        return new Intl.NumberFormat('id-ID').format(Number(numericValue));
    }
    return new Intl.NumberFormat('id-ID').format(Math.round(num));
};

const parseRawNumber = (val: string): string => val.replace(/\D/g, '');

const parseGallery = (gallery: Product['Gallery']): string[] => {
    if (!gallery) return [];
    if (Array.isArray(gallery)) {
        return gallery.filter(item => typeof item === 'string');
    }
    if (typeof gallery === 'string') {
        const trimmed = gallery.trim();
        if (!trimmed) return [];
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed.filter(item => typeof item === 'string');
            }
            if (typeof parsed === 'string') {
                return [parsed];
            }
        } catch {
            if (trimmed.includes(',')) {
                return trimmed.split(',').map(s => s.trim()).filter(Boolean);
            }
            return [trimmed];
        }
    }
    return [];
};

const blankForm = () => ({
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
    Gallery: [] as (File | string)[],
    Best_Seller: false,
    signature: false,
    sizes: [emptySize()] as SizeForm[],
});

export default function EditProductSheet({ product, open, onOpenChange, onUpdated }: Props) {
    const imagePreviewFromProduct = (p: Product | null) => (p?.Foto ? `/storage/${p.Foto}` : null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, transform, reset, clearErrors } = useForm(blankForm());

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const lastLoadedIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!open || !product) {
            if (!open) {
                lastLoadedIdRef.current = null;
            }
            return;
        }
        if (lastLoadedIdRef.current === product.id) return;
        lastLoadedIdRef.current = product.id;

        const parsedGallery = parseGallery(product.Gallery);

        setData({
            nama: product.nama ?? '',
            kategori: product.kategori ?? '',
            gender: product.gender ?? '',
            original: (product.original ?? 'Original') as 'Original' | 'Refill',
            brand: product.brand ?? '',
            Top_Note: product.Top_Note ?? '',
            Middle_Note: product.Middle_Note ?? '',
            Base_Note: product.Base_Note ?? '',
            Komposisi: product.Komposisi ?? '',
            Kemasan: product.Kemasan ?? '',
            Tanggal_launch: product.Tanggal_launch ?? '',
            Deskripsi: product.Deskripsi ?? '',
            Foto: null,
            Gallery: parsedGallery,
            Best_Seller: product.Best_Seller === 'yes',
            signature: product.signature === 'yes',
            sizes: sizesFromProduct(product),
        });
        clearErrors();
        setImagePreview(imagePreviewFromProduct(product));
        setGalleryPreviews(parsedGallery.map((path) => {
            if (path.startsWith('http') || path.startsWith('blob:')) return path;
            return `/storage/${path.replace(/^\/+/, '')}`;
        }));

        if (fileInputRef.current) fileInputRef.current.value = '';
        if (galleryInputRef.current) galleryInputRef.current.value = '';
    }, [open, product?.id]);

    useEffect(() => {
        if (open) return;
        lastLoadedIdRef.current = null;
        reset();
        clearErrors();
        setImagePreview(null);
        galleryPreviews.forEach((url) => {
            if (url.startsWith('blob:')) URL.revokeObjectURL(url);
        });
        setGalleryPreviews([]);
    }, [open]);

    if (!product) return null;

    const isRefill = data.original === 'Refill';

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('Foto', file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setData('Foto', null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setData('Gallery', [...data.Gallery, ...files]);
            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setGalleryPreviews((prev) => [...prev, ...newPreviews]);
        }
        if (galleryInputRef.current) galleryInputRef.current.value = '';
    };

    const removeGalleryImage = (e: React.MouseEvent, indexToRemove: number) => {
        e.stopPropagation();
        const newGalleryData = data.Gallery.filter((_, idx) => idx !== indexToRemove);
        setData('Gallery', newGalleryData);

        const previewUrl = galleryPreviews[indexToRemove];
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        setGalleryPreviews(galleryPreviews.filter((_, idx) => idx !== indexToRemove));
    };

    const selectOriginal = (val: 'Original' | 'Refill') => {
        setData((prev) => ({
            ...prev,
            original: val,
            signature: val === 'Refill' ? false : prev.signature,
        }));
    };

    const addSize = () => setData('sizes', [...data.sizes, emptySize()]);

    const removeSize = (index: number) => {
        if (data.sizes.length <= 1) return;
        setData('sizes', data.sizes.filter((_, i) => i !== index));
    };

    const updateSize = (index: number, field: keyof SizeForm, value: string) => {
        setData('sizes', data.sizes.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
    };

    const submitProduct = (e: React.FormEvent) => {
        e.preventDefault();
        transform((data) => ({ ...data, _method: 'put' }));

        post(update(product.id).url, {
            forceFormData: true,
            onSuccess: () => {
                onOpenChange(false);
                onUpdated?.();
            },
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="h-screen w-screen max-w-none p-0 border-none rounded-none flex flex-col bg-background overflow-hidden !top-0 !translate-y-0"
            >
                <form onSubmit={submitProduct} className="flex flex-col h-full w-full overflow-hidden">

                    <SheetHeader>
                        <SheetTitle>
                            Edit Produk: {product.nama}
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 min-h-0 overflow-y-auto w-full custom-scrollbar" data-lenis-prevent>
                        <div className="max-w-3xl mx-auto w-full py-10 px-6 sm:px-8 grid gap-6">

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
                                        <SelectTrigger className="w-full capitalize">
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

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="top_note" className="text-sm font-medium">Top Note <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="top_note"
                                        value={data.Top_Note}
                                        onChange={(e) => setData('Top_Note', e.target.value)}
                                    />
                                    {errors.Top_Note && <span className="text-[10px] text-destructive">{errors.Top_Note}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="middle_note" className="text-sm font-medium">Middle Note <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="middle_note"
                                        value={data.Middle_Note}
                                        onChange={(e) => setData('Middle_Note', e.target.value)}
                                    />
                                    {errors.Middle_Note && <span className="text-[10px] text-destructive">{errors.Middle_Note}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="base_note" className="text-sm font-medium">Base Note <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="base_note"
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

                            <div className="grid gap-2">
                                <Label htmlFor="kemasan" className="text-sm font-medium">Tipe Kemasan</Label>
                                <Input
                                    id="kemasan"
                                    value={data.Kemasan}
                                    onChange={(e) => setData('Kemasan', e.target.value)}
                                />
                            </div>

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
                                                key={size.id ?? `new-${index}`}
                                                className="rounded-lg border border-border p-4 grid gap-4 bg-card relative"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-muted-foreground">
                                                        Ukuran #{index + 1}
                                                        {size.id ? '' : ' (baru)'}
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
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-medium">Stok</Label>
                                                        <Input
                                                            type="text"
                                                            inputMode="numeric"
                                                            placeholder="0"
                                                            value={formatNumber(size.Stok)}
                                                            onChange={(e) =>
                                                                updateSize(index, 'Stok', parseRawNumber(e.target.value))
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-medium">Harga (Rp)</Label>
                                                        <Input
                                                            type="text"
                                                            inputMode="numeric"
                                                            placeholder="199.000"
                                                            value={formatNumber(size.Harga)}
                                                            onChange={(e) =>
                                                                updateSize(index, 'Harga', parseRawNumber(e.target.value))
                                                            }
                                                        />
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

                            {/* Foto Produk Utama */}
                            <div className="grid gap-2 mt-2">
                                <Label className="text-sm font-medium">Foto Produk Utama</Label>
                                <div className="relative border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/40 transition-colors min-h-[200px] cursor-pointer">
                                    {imagePreview ? (
                                        <div className="relative w-full max-w-60 aspect-4/5 rounded-md overflow-hidden border border-border bg-white z-10">
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
                                        <div className="text-center py-6 pointer-events-none">
                                            <UploadCloud className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                                            <p className="text-sm font-medium">Klik untuk mengunggah / mengganti foto</p>
                                            <p className="text-xs text-muted-foreground mt-1">Format: JPG, PNG, WebP (Maks. 2MB)</p>
                                        </div>
                                    )}
                                    <Input
                                        ref={fileInputRef}
                                        id="foto"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                </div>
                                {errors.Foto && <span className="text-[10px] text-destructive">{errors.Foto}</span>}
                            </div>

                            {/* Gallery Produk */}
                            <div className="grid gap-2 border-t pt-6">
                                <Label className="text-sm font-medium">Gallery Produk (Opsional)</Label>
                                <p className="text-xs text-muted-foreground mb-2">Kelola foto tambahan produk. Hapus foto lama dengan menekan icon X.</p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {galleryPreviews.map((preview, idx) => (
                                        <div key={preview} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-white group">
                                            <img src={preview} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={(e) => removeGalleryImage(e, idx)}
                                                className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black text-white p-1 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}

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

                            <div className="flex flex-col gap-3 border-t pt-6">
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

                                {!isRefill && (
                                    <div className="flex-1 border border-border rounded-lg p-4 flex items-center justify-between bg-card">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="signature" className="text-sm font-medium cursor-pointer">
                                                Signature
                                            </Label>
                                            <p className="text-xs text-muted-foreground">Tandai sebagai racikan signature (produk juga akan muncul di halaman depan)</p>
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
                            onClick={() => onOpenChange(false)}
                            className="w-full"
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