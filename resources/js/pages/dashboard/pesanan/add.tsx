import { useMemo, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { adminStore } from '@/actions/App/Http/Controllers/PesananController';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import type { ProductSizeOption } from './index';

const metodePembayaranOptions = [
    { value: 'transfer', label: 'Transfer Bank' },
    { value: 'e-wallet', label: 'E-Wallet/QRIS' },
    { value: 'cod', label: 'COD' },
] as const;

interface Props {
    productSizes: ProductSizeOption[];
    onCreated?: () => void;
}

const formatPrice = (val: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(val);

export default function AddPesananSheet({ productSizes, onCreated }: Props) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nama_pembeli: '',
        no_wa: '',
        alamat: '',
        catatan: '',
        metode_pembayaran: '' as '' | 'transfer' | 'e-wallet' | 'qris' | 'cod',
        product_size_id: '',
        jumlah: '1',
    });

    const selectedSize = useMemo(
        () => productSizes.find((p) => p.id === Number(data.product_size_id)) ?? null,
        [productSizes, data.product_size_id],
    );

    const totalHarga = selectedSize
        ? selectedSize.harga_akhir * (Number(data.jumlah) || 0)
        : 0;

    const submitOrder = (e: React.FormEvent) => {
        e.preventDefault();
        post(adminStore().url, {
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
                    Tambah Pesanan
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="h-screen w-screen max-w-none p-0 border-none rounded-none flex flex-col bg-background overflow-hidden !top-0 !translate-y-0"
            >
                <form onSubmit={submitOrder} className="flex flex-col h-full w-full overflow-hidden">
                    <SheetHeader>
                        <SheetTitle>
                            Tambah Pesanan
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 min-h-0 overflow-y-auto w-full custom-scrollbar" data-lenis-prevent>
                        <div className="max-w-3xl mx-auto w-full px-6 grid gap-6">

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="nama_pembeli" className="text-sm font-medium">
                                        Nama Pembeli <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="nama_pembeli"
                                        placeholder="Masukkan nama pembeli"
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
                                        placeholder="08xxxxxxxxxx"
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
                                    placeholder="Masukkan alamat lengkap pembeli"
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    className="resize-none"
                                />
                                {errors.alamat && <span className="text-[10px] text-destructive">{errors.alamat}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="catatan" className="text-sm font-medium">Catatan Tambahan</Label>
                                <Textarea
                                    id="catatan"
                                    rows={2}
                                    placeholder="Masukkan catatan tambahan dari pembeli..."
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
                                        {productSizes.map((ps) => (
                                            <SelectItem key={ps.id} value={String(ps.id)} disabled={ps.Stok === 0}>
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
                                'Simpan Pesanan'
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