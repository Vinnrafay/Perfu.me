import { useState } from 'react';
import { router } from '@inertiajs/react';
import { destroy, verify, updateStatus } from '@/actions/App/Http/Controllers/PesananController';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    MoreHorizontal,
    PackageX,
    ShieldCheck,
} from 'lucide-react';
import AddPesananSheet from './add';
import EditPesananSheet from './edit';

export interface ProductSizeOption {
    id: number;
    Ukuran: number;
    Stok: number;
    harga_akhir: number;
    product: { id: number; nama: string };
}

export interface Pesanan {
    id: number;
    nama_pembeli: string;
    no_wa: string;
    alamat: string;
    catatan: string | null;
    metode_pembayaran: 'transfer' | 'e-wallet' | 'qris' | 'cod';
    product_size_id: number;
    jumlah: number;
    total_harga: number;
    verifikasi: 'pending' | 'selesai';
    status: 'dikemas' | 'dikirim' | 'selesai';
    // NOTE: Laravel otomatis convert nama relasi camelCase (productSize()
    // di model) jadi snake_case pas di-serialize ke JSON, makanya field-nya
    // 'product_size', BUKAN 'productSize'.
    product_size: ProductSizeOption;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page?: number;
}

interface Props {
    pending: Paginated<Pesanan>;
    verified: Paginated<Pesanan>;
    productSizes: ProductSizeOption[];
}

const metodeLabel: Record<Pesanan['metode_pembayaran'], string> = {
    transfer: 'Transfer',
    'e-wallet': 'E-Wallet',
    qris: 'QRIS',
    cod: 'COD',
};

const statusOptions: Pesanan['status'][] = ['dikemas', 'dikirim', 'selesai'];

const statusBadgeClass: Record<Pesanan['status'], string> = {
    dikemas: 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    dikirim: 'border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    selesai: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

const formatPrice = (val: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(val);

export default function PesananIndex({ pending, verified, productSizes }: Props) {
    const refreshList = () => router.reload({ only: ['pending', 'verified'] });

    const handleVerify = (pesanan: Pesanan) => {
        if (confirm(`Verifikasi pesanan dari ${pesanan.nama_pembeli}?`)) {
            router.patch(verify(pesanan.id).url, {}, { onSuccess: refreshList });
        }
    };

    const handleStatusChange = (pesanan: Pesanan, status: Pesanan['status']) => {
        if (status === pesanan.status) return;
        router.patch(updateStatus(pesanan.id).url, { status }, { onSuccess: refreshList });
    };

    const handleDelete = (pesanan: Pesanan) => {
        if (confirm(`Hapus pesanan dari ${pesanan.nama_pembeli}?`)) {
            router.delete(destroy(pesanan.id).url, { onSuccess: refreshList });
        }
    };

    /**
     * FIX: dua tabel (pending & verified) punya pagination independen di satu
     * halaman yang sama. Kalau cuma kirim satu param baru, param page tabel
     * yang satunya ilang dari query dan diam-diam balik ke halaman 1.
     * Solusinya: ambil semua query param yang ada sekarang, baru timpa yang
     * relevan aja.
     */
    const changePage = (pageParam: 'pending_page' | 'verified_page', page: number) => {
        const currentParams = Object.fromEntries(
            new URLSearchParams(window.location.search).entries(),
        );

        router.get(
            window.location.pathname,
            { ...currentParams, [pageParam]: page },
            {
                preserveState: true,
                replace: true,
                only: pageParam === 'pending_page' ? ['pending'] : ['verified'],
            },
        );
    };

    return (
        <div className="flex flex-col gap-6 p-5 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Pesanan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Verifikasi pesanan masuk dan pantau status pengiriman.
                    </p>
                </div>
                <AddPesananSheet productSizes={productSizes} onCreated={refreshList} />
            </div>

            {/*
              Section: Menunggu Verifikasi
              Sengaja section ini CUMA muncul kalau ada pesanan yang masih
              pending. Kalau pending.total === 0, section ini gak dirender
              sama sekali (bukan cuma nampilin empty state) — biar dashboard
              gak penuh sama tabel kosong pas gak ada yang perlu diverifikasi.
            */}
            {pending.total > 0 && (
                <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/20">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <h2 className="text-sm font-semibold text-foreground">Menunggu Verifikasi</h2>
                        <Badge variant="outline" className="ml-1 text-[10px] px-1.5">{pending.total}</Badge>
                    </div>

                    <div className="relative overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="text-xs text-muted-foreground">Pembeli</TableHead>
                                    <TableHead className="text-xs text-muted-foreground">Produk</TableHead>
                                    <TableHead className="text-xs text-muted-foreground">Jumlah</TableHead>
                                    <TableHead className="text-xs text-muted-foreground">Total</TableHead>
                                    <TableHead className="text-xs text-muted-foreground">Metode</TableHead>
                                    <TableHead className="w-32 text-right" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pending.data.map((pesanan) => (
                                    <TableRow key={pesanan.id}>
                                        <TableCell>
                                            <div className="font-medium text-foreground">{pesanan.nama_pembeli}</div>
                                            <div className="text-xs text-muted-foreground">{pesanan.no_wa}</div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {pesanan.product_size.product.nama} ({pesanan.product_size.Ukuran}ml)
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{pesanan.jumlah}</TableCell>
                                        <TableCell className="font-semibold text-sm">{formatPrice(pesanan.total_harga)}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {metodeLabel[pesanan.metode_pembayaran]}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                onClick={() => handleVerify(pesanan)}
                                                className="h-8 gap-1.5 text-xs rounded-lg bg-black hover:bg-black/90 text-white"
                                            >
                                                <ShieldCheck className="h-3.5 w-3.5" />
                                                Verifikasi
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {pending.last_page > 1 && (
                        <div className="flex items-center justify-end gap-1 border-t border-border p-3 bg-muted/10">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pending.current_page <= 1}
                                onClick={() => changePage('pending_page', pending.current_page - 1)}
                                className="h-8 px-3 text-xs gap-1"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </Button>
                            <span className="px-3 py-1 text-xs font-medium text-foreground bg-background border border-border rounded-md">
                                {pending.current_page} / {pending.last_page}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pending.current_page >= pending.last_page}
                                onClick={() => changePage('pending_page', pending.current_page + 1)}
                                className="h-8 px-3 text-xs gap-1"
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Section: Pesanan Terverifikasi */}
            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/20">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <h2 className="text-sm font-semibold text-foreground">Pesanan</h2>
                    <Badge variant="outline" className="ml-1 text-[10px] px-1.5">{verified.total}</Badge>
                </div>

                <div className="relative overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="text-xs text-muted-foreground">Pembeli</TableHead>
                                <TableHead className="text-xs text-muted-foreground">Produk</TableHead>
                                <TableHead className="text-xs text-muted-foreground">Jumlah</TableHead>
                                <TableHead className="text-xs text-muted-foreground">Total</TableHead>
                                <TableHead className="text-xs text-muted-foreground">Metode</TableHead>
                                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                                <TableHead className="w-12 text-right" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {verified.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <PackageX className="h-8 w-8 stroke-[1.25] text-muted-foreground/60" />
                                            <p className="text-sm font-medium text-foreground">Belum ada pesanan terverifikasi</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {verified.data.map((pesanan) => (
                                <TableRow key={pesanan.id}>
                                    <TableCell>
                                        <div className="font-medium text-foreground">{pesanan.nama_pembeli}</div>
                                        <div className="text-xs text-muted-foreground">{pesanan.no_wa}</div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {pesanan.product_size.product.nama} ({pesanan.product_size.Ukuran}ml)
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{pesanan.jumlah}</TableCell>
                                    <TableCell className="font-semibold text-sm">{formatPrice(pesanan.total_harga)}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {metodeLabel[pesanan.metode_pembayaran]}
                                    </TableCell>
                                    <TableCell>
                                        {/*
                                          FIX: sebelumnya Badge dibungkus <button> di dalam
                                          DropdownMenuTrigger yang defaultnya JUGA render <button>
                                          -> nested <button> (invalid HTML, bikin radix warning).
                                          Sekarang pakai asChild langsung ke Badge.
                                        */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Badge
                                                    variant="outline"
                                                    role="button"
                                                    tabIndex={0}
                                                    className={`text-[10px] px-2 py-0.5 capitalize cursor-pointer select-none ${statusBadgeClass[pesanan.status]}`}
                                                >
                                                    {pesanan.status}
                                                </Badge>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="w-36">
                                                {statusOptions.map((opt) => (
                                                    <DropdownMenuItem
                                                        key={opt}
                                                        onClick={() => handleStatusChange(pesanan, opt)}
                                                        className="text-xs capitalize cursor-pointer"
                                                    >
                                                        {opt}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Buka menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-36">
                                                <EditPesananSheet
                                                    pesanan={pesanan}
                                                    productSizes={productSizes}
                                                    onUpdated={refreshList}
                                                    trigger={
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                                                            Edit
                                                        </DropdownMenuItem>
                                                    }
                                                />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(pesanan)}
                                                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                                                >
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {verified.last_page > 1 && (
                    <div className="flex items-center justify-end gap-1 border-t border-border p-3 bg-muted/10">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={verified.current_page <= 1}
                            onClick={() => changePage('verified_page', verified.current_page - 1)}
                            className="h-8 px-3 text-xs gap-1"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>
                        <span className="px-3 py-1 text-xs font-medium text-foreground bg-background border border-border rounded-md">
                            {verified.current_page} / {verified.last_page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={verified.current_page >= verified.last_page}
                            onClick={() => changePage('verified_page', verified.current_page + 1)}
                            className="h-8 px-3 text-xs gap-1"
                        >
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

PesananIndex.layout = {
    breadcrumbs: [
        {
            title: 'Pesanan',
            href: '/dashboard/pesanan',
        },
    ],
};