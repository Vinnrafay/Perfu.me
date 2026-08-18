import { useState, useRef } from 'react';
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
const originalOptions = [
    { value: 'Original', label: 'Original' },
    { value: 'Refill', label: 'Refill' },
] as const;

interface Props {
    onCreated?: () => void;
}

// Helper untuk memformat angka dengan pemisah ribuan (contoh: 199000 -> 199.000)
const formatNumber = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined || val === '') return '';
    const raw = val.toString().replace(/\D/g, '');
    if (!raw) return '';
    return new Intl.NumberFormat('id-ID').format(Number(raw));
};

const parseRawNumber = (val: string): string => val.replace(/\D/g, '');

export default function AddProductSheet({ onCreated }: Props) {
    const [open, setOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [displayHarga, setDisplayHarga] = useState<string>('');
    const [displayDiskon, setDisplayDiskon] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
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
        Ukuran: '',
        Harga: '',
        Diskon: '',
        Stok: '',
        Tanggal_launch: '',
        Deskripsi: '',
        Foto: null as File | null,
        Best_Seller: false,
        signature: false,
    });

    const isRefill = data.original === 'Refill';

    // Harga akhir dihitung live di frontend cuma buat preview,
    // perhitungan yang beneran dipakai tetap dari backend (accessor harga_akhir di model).
    const hargaAkhirPreview = Math.max(
        0,
        (Number(data.Harga) || 0) - (Number(data.Diskon) || 0)
    );

    const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = parseRawNumber(e.target.value);
        setData('Harga', raw);
        setDisplayHarga(formatNumber(raw));
    };

    const handleDiskonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = parseRawNumber(e.target.value);
        setData('Diskon', raw);
        setDisplayDiskon(formatNumber(raw));
    };

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

    const selectOriginal = (val: 'Original' | 'Refill') => {
        setData((prev) => ({
            ...prev,
            original: val,
            // Signature cuma berlaku buat Original — reset kalau pindah ke Refill
            signature: val === 'Refill' ? false : prev.signature,
        }));
    };

    const submitProduct = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setDisplayHarga('');
                setDisplayDiskon('');
                setImagePreview(null);
                setOpen(false);
                onCreated?.();
            },
        });
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="bg-black hover:bg-black/90 text-white rounded-lg">
                    Tambah Produk
                </Button>
            </SheetTrigger>
            
            <SheetContent 
                side="bottom" 
                className="h-screen w-screen max-w-none p-0 border-none rounded-none flex flex-col bg-background overflow-hidden !top-0 !translate-y-0"
            >
                <form onSubmit={submitProduct} className="flex flex-col h-full w-full overflow-hidden">
                    
                    {/* STICKY HEADER */}
                    <div className="sticky top-0 z-50 shrink-0 px-6 sm:px-12 py-4 border-b border-border flex items-center justify-between bg-background/95 backdrop-blur-md">
                        <SheetTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                            Tambah Produk Baru
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
                                className="rounded-lg bg-black hover:bg-black/90 text-white text-xs px-4 h-9 min-w-[120px]"
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
                        </div>
                    </div>

                    {/* SCROLLABLE AREA */}
                    <div className="flex-1 min-h-0 overflow-y-auto w-full custom-scrollbar" data-lenis-prevent>
                        <div className="max-w-3xl mx-auto w-full py-10 px-6 sm:px-8 grid gap-6">

                            {/* Tipe Produk */}
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">
                                    Tipe Produk <span className="text-destructive">*</span>
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {originalOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => selectOriginal(opt.value)}
                                            className={`h-10 rounded-lg border text-sm font-medium transition-colors ${
                                                data.original === opt.value
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-background text-foreground border-border hover:bg-muted/50'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.original && <span className="text-[10px] text-destructive">{errors.original}</span>}
                            </div>
                            
                            {/* Nama */}
                            <div className="grid gap-2">
                                <Label htmlFor="nama" className="text-sm font-medium">Nama Produk <span className="text-destructive">*</span></Label>
                                <Input
                                    id="nama"
                                    placeholder="Contoh: Vanessence"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                />
                                {errors.nama && <span className="text-[10px] text-destructive">{errors.nama}</span>}
                            </div>

                            {/* Brand — cuma muncul kalau Refill */}
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

                            {/* Baris 2: Kategori & Gender */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

                            {/* Notes Aroma — sekarang selalu muncul, Original maupun Refill */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                <div className="grid gap-2 sm:col-span-2">
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

                            {/* Komposisi & Deskripsi */}
                            <div className="grid gap-2">
                                <Label htmlFor="komposisi" className="text-sm font-medium">Komposisi Bahan</Label>
                                <Textarea
                                    id="komposisi"
                                    rows={2}
                                    placeholder="Alkohol, Fragrance, Aqua..."
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

                            {/* Ukuran & Kemasan */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="ukuran" className="text-sm font-medium">Ukuran (ml) <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="ukuran"
                                        type="number"
                                        placeholder="50"
                                        value={data.Ukuran}
                                        onChange={(e) => setData('Ukuran', e.target.value)}
                                    />
                                    {errors.Ukuran && <span className="text-[10px] text-destructive">{errors.Ukuran}</span>}
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
                            </div>

                            {/* Harga & Diskon */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="harga" className="text-sm font-medium">Harga Jual (Rp) <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="harga"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="199.000"
                                        value={displayHarga}
                                        onChange={handleHargaChange}
                                    />
                                    {errors.Harga && <span className="text-[10px] text-destructive">{errors.Harga}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="diskon" className="text-sm font-medium">Diskon (Rp, opsional)</Label>
                                    <Input
                                        id="diskon"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="0"
                                        value={displayDiskon}
                                        onChange={handleDiskonChange}
                                    />
                                    {errors.Diskon && <span className="text-[10px] text-destructive">{errors.Diskon}</span>}
                                </div>
                            </div>

                            {/* Harga Akhir — preview otomatis, bukan input */}
                            <div className="rounded-lg border border-border bg-muted/30 p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Harga Akhir</p>
                                    <p className="text-xs text-muted-foreground">Harga setelah dikurangi diskon</p>
                                </div>
                                <span className="text-base font-semibold text-foreground">
                                    Rp {formatNumber(hargaAkhirPreview)}
                                </span>
                            </div>

                            {/* Stok */}
                            <div className="grid gap-2">
                                <Label htmlFor="stok" className="text-sm font-medium">Stok Awal <span className="text-destructive">*</span></Label>
                                <Input
                                    id="stok"
                                    type="number"
                                    placeholder="100"
                                    value={data.Stok}
                                    onChange={(e) => setData('Stok', e.target.value)}
                                />
                                {errors.Stok && <span className="text-[10px] text-destructive">{errors.Stok}</span>}
                            </div>

                            {/* File Upload Dropzone */}
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
                                            <p className="text-sm font-medium">Klik untuk mengunggah foto</p>
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

                            {/* Options */}
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

                                {/* Signature — cuma muncul kalau Original */}
                                {!isRefill && (
                                    <div className="flex-1 border border-border rounded-lg p-4 flex items-center justify-between bg-card">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="signature" className="text-sm font-medium cursor-pointer">
                                                Signature
                                            </Label>
                                            <p className="text-xs text-muted-foreground">Tandai sebagai racikan signature</p>
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
                </form>
            </SheetContent>
        </Sheet>
    );
}