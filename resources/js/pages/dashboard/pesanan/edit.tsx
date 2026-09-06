import { useEffect, useMemo, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { update } from '@/actions/App/Http/Controllers/PesananController';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { Pesanan, ProductSizeOption } from './index';

const metodePembayaranOptions = [
    { value: 'transfer', label: 'Transfer Bank' },
    { value: 'e-wallet', label: 'E-Wallet' },
    { value: 'qris', label: 'QRIS' },
    { value: 'cod', label: 'COD' },
] as const;

const verifikasiOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'selesai', label: 'Terverifikasi' },
] as const;

const statusOptions = [
    { value: 'dikemas', label: 'Dikemas' },
    { value: 'dikirim', label: 'Dikirim' },
    { value: 'selesai', label: 'Selesai' },
] as const;

interface Props {
    pesanan: Pesanan;
    productSizes: ProductSizeOption[];
    trigger?: React.ReactNode;
    onUpdated?: () => void;
}

const formatPrice = (val: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(val);

export default function EditPesananSheet({ pesanan, productSizes, trigger, onUpdated }: Props) {
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        nama_pembeli: pesanan.nama_pembeli,
        no_wa: pesanan.no_wa,
        alamat: pesanan.alamat,
        catatan: pesanan.catatan ?? '',
        metode_pembayaran: pesanan.metode_pembayaran,
        product_size_id: String(pesanan.product_size_id),
        jumlah: String(pesanan.jumlah),
        verifikasi: pesanan.verifikasi,
        status: pesanan.status,
    });

    // Sinkronkan kalau prop pesanan berubah (misal habis update lain).
    useEffect(() => {
        setData({
            nama_pembeli: pesanan.nama_pembeli,
            no_wa: pesanan.no_wa,
            alamat: pesanan.alamat,
            catatan: pesanan.catatan ?? '',
            metode_pembayaran: pesanan.metode_pembayaran,
            product_size_id: String(pesanan.product_size_id),
            jumlah: String(pesanan.jumlah),
            verifikasi: pesanan.verifikasi,
            status: pesanan.status,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pesanan]);

    // NOTE: 'product_size' (snake_case), bukan 'productSize', karena Laravel
    // otomatis convert nama relasi camelCase jadi snake_case pas serialize
    // ke JSON. Method di model tetap boleh bernama productSize().
    const selectedSize = useMemo(
        () => productSizes.find((p) => p.id === Number(data.product_size_id)) ?? pesanan.product_size,
        [productSizes, data.product_size_id, pesanan.product_size],
    );

    const totalHarga = selectedSize
        ? selectedSize.harga_akhir * (Number(data.jumlah) || 0)
        : 0;

    const submitOrder = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(pesanan.id).url, {
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
                <form onSubmit={submitOrder} className="flex flex-col h-full w-full overflow-hidden">
                    <div className="sticky top-0 z-50 shrink-0 px-6 sm:px-12 py-4 border-b border-border flex items-center justify-between bg-background/95 backdrop-blur-md">
                        <SheetTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                            Edit Pesanan: {pesanan.nama_pembeli}
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

                    <div className="flex-1 min-h-0 overflow-y-auto w-full custom-scrollbar" data-lenis-prevent>
                        <div className="max-w-3xl mx-auto w-full py-10 px-6 sm:px-8 grid gap-6">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="nama_pembeli" className="text-sm font-medium">
                                        Nama Pembeli <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="nama_pembeli"
                                        value={data.nama_pembeli}
                                        onChange={(e) => setData('nama_pembeli', e.target.value)}
                                    />
                                    {errors.nama_pembeli && (
                                        <span className="text-[10px] text-destructive">{errors.nama_pembeli}</span>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="no_wa" className="text-sm font-medium">
                                        No. WhatsApp <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="no_wa"
                                        value={data.no_wa}
                                        onChange={(e) => setData('no_wa', e.target.value)}
                                    />
                                    {errors.no_wa && (
                                        <span className="text-[10px] text-destructive">{errors.no_wa}</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="alamat" className="text-sm font-medium">
                                    Alamat <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="alamat"
                                    rows={3}
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    className="resize-none"
                                />
                                {errors.alamat && <span className="text-[10px] text-destructive">{errors.alamat}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="catatan" className="text-sm font-medium">Catatan</Label>
                                <Textarea
                                    id="catatan"
                                    rows={2}
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    className="resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium">
                                        Metode Pembayaran <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.metode_pembayaran}
                                        onValueChange={(val) =>
                                            setData('metode_pembayaran', val as typeof data.metode_pembayaran)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih metode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {metodePembayaranOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.metode_pembayaran && (
                                        <span className="text-[10px] text-destructive">{errors.metode_pembayaran}</span>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="jumlah" className="text-sm font-medium">
                                        Jumlah <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="jumlah"
                                        type="number"
                                        min={1}
                                        value={data.jumlah}
                                        onChange={(e) => setData('jumlah', e.target.value)}
                                    />
                                    {errors.jumlah && (
                                        <span className="text-[10px] text-destructive">{errors.jumlah}</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">
                                    Produk <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.product_size_id}
                                    onValueChange={(val) => setData('product_size_id', val)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih produk & ukuran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Ukuran yang lagi dipakai pesanan ini selalu tersedia, walau stoknya 0 di list utama */}
                                        {!productSizes.some((p) => p.id === pesanan.product_size.id) && (
                                            <SelectItem value={String(pesanan.product_size.id)}>
                                                {pesanan.product_size.product.nama} — {pesanan.product_size.Ukuran}ml (dipakai saat ini)
                                            </SelectItem>
                                        )}
                                        {productSizes.map((ps) => (
                                            <SelectItem
                                                key={ps.id}
                                                value={String(ps.id)}
                                                disabled={ps.Stok === 0 && ps.id !== pesanan.product_size.id}
                                            >
                                                {ps.product.nama} — {ps.Ukuran}ml (stok {ps.Stok})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.product_size_id && (
                                    <span className="text-[10px] text-destructive">{errors.product_size_id}</span>
                                )}
                            </div>

                            {selectedSize && (
                                <div className="rounded-md bg-muted/30 px-3 py-2 flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Total Harga</span>
                                    <span className="text-sm font-semibold">{formatPrice(totalHarga)}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-10">
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium">Verifikasi</Label>
                                    <Select
                                        value={data.verifikasi}
                                        onValueChange={(val) => setData('verifikasi', val as typeof data.verifikasi)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {verifikasiOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium">Status Pengiriman</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(val) => setData('status', val as typeof data.status)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}