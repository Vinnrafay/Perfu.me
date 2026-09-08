import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { destroy, verify, updateStatus, invoice } from '@/actions/App/Http/Controllers/PesananController';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    MoreHorizontal,
    Package,
    PackageX,
    Search,
    ShieldCheck,
    SlidersHorizontal,
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
    filters: { search: string };
}

const metodeLabel: Record<Pesanan['metode_pembayaran'], string> = {
    transfer: 'Transfer',
    'e-wallet': 'E-Wallet',
    qris: 'QRIS',
    cod: 'COD',
};

const statusOptions: Pesanan['status'][] = ['dikemas', 'dikirim', 'selesai'];

const statusLabel: Record<Pesanan['status'], string> = {
    dikemas: 'Dikemas',
    dikirim: 'Dikirim',
    selesai: 'Selesai',
};

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

const invoiceCode = (id: number) => `#${String(id).padStart(6, '0')}`;

export default function PesananIndex({
    pending,
    verified,
    productSizes,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const [visibleColumns, setVisibleColumns] = useState({
        Invoice: true,
        Pembeli: true,
        Produk: true,
        Jumlah: true,
        Total: true,
        Metode: true,
        Status: true,
    });

    const refreshList = () =>
        router.reload({ only: ['pending', 'verified'] });

    const handleVerify = (item: Pesanan) => {
        if (confirm(`Verifikasi pesanan dari ${item.nama_pembeli}?`)) {
            router.patch(verify(item.id).url, {}, {
                onSuccess: refreshList,
            });
        }
    };

    const handleStatusChange = (
        item: Pesanan,
        status: Pesanan['status'],
    ) => {
        if (status === item.status) return;

        router.patch(
            updateStatus(item.id).url,
            { status },
            { onSuccess: refreshList },
        );
    };

    const handleDelete = (item: Pesanan) => {
        if (confirm(`Hapus pesanan dari ${item.nama_pembeli}?`)) {
            router.delete(destroy(item.id).url, {
                onSuccess: refreshList,
            });
        }
    };

    /**
     * FIX: sebelumnya ini nembak ke '/pesanan' (route POST buat form publik,
     * gak punya method GET), makanya search kerasa gak ngefek. Sekarang
     * pakai window.location.pathname biar konsisten nembak ke halaman yang
     * lagi kebuka ('/dashboard/pesanan').
     */
    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();

        router.get(
            window.location.pathname,
            {
                search,
                pending_page: 1,
                verified_page: 1,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const changePage = (
        pageParam: 'pending_page' | 'verified_page',
        page: number,
    ) => {
        const currentParams = Object.fromEntries(
            new URLSearchParams(window.location.search).entries(),
        );

        router.get(
            window.location.pathname,
            {
                ...currentParams,
                [pageParam]: page,
            },
            {
                preserveState: true,
                replace: true,
                only:
                    pageParam === 'pending_page'
                        ? ['pending']
                        : ['verified'],
            },
        );
    };

    const pendingColSpan =
        1 +
        Number(visibleColumns.Pembeli) +
        Number(visibleColumns.Produk) +
        Number(visibleColumns.Jumlah) +
        Number(visibleColumns.Total) +
        Number(visibleColumns.Metode) +
        1;

    const verifiedColSpan =
        Number(visibleColumns.Invoice) +
        Number(visibleColumns.Pembeli) +
        Number(visibleColumns.Produk) +
        Number(visibleColumns.Jumlah) +
        Number(visibleColumns.Total) +
        Number(visibleColumns.Metode) +
        Number(visibleColumns.Status) +
        1;

    return (
        <div className="flex flex-col gap-3 p-5 w-full">
            {/* Header — dibuat sama seperti halaman Produk */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Pesanan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Verifikasi pesanan masuk dan pantau status pengiriman.
                    </p>
                </div>

                <AddPesananSheet
                    productSizes={productSizes}
                    onCreated={refreshList}
                />
            </div>

            {/* Main Card — style sama seperti card Produk */}
            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-border bg-muted/20">
                    <form
                        onSubmit={submitSearch}
                        className="relative w-full sm:max-w-xs"
                    >
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari invoice, nama, produk, metode, status..."
                            className="pl-9 bg-background"
                        />
                    </form>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto"
                            >
                                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                                Kolom
                                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel className="text-xs">
                                Tampilkan Kolom
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {(
                                [
                                    'Invoice',
                                    'Pembeli',
                                    'Produk',
                                    'Jumlah',
                                    'Total',
                                    'Metode',
                                    'Status',
                                ] as const
                            ).map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column}
                                    checked={visibleColumns[column]}
                                    onCheckedChange={(checked) =>
                                        setVisibleColumns((prev) => ({
                                            ...prev,
                                            [column]: Boolean(checked),
                                        }))
                                    }
                                    className="text-xs"
                                >
                                    {column}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Menunggu Verifikasi */}
                {pending.total > 0 && (
                    <div className="border-b border-border">
                        <div className="flex items-center gap-2 px-4 py-3 bg-muted/10">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <h2 className="text-sm font-semibold text-foreground">
                                Menunggu Verifikasi
                            </h2>
                            <Badge
                                variant="outline"
                                className="ml-1 text-[10px] px-1.5"
                            >
                                {pending.total}
                            </Badge>
                        </div>

                        <div className="relative overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="w-12 text-center text-xs text-muted-foreground">
                                            #
                                        </TableHead>

                                        {visibleColumns.Pembeli && (
                                            <TableHead className="text-xs text-muted-foreground">
                                                Pembeli
                                            </TableHead>
                                        )}

                                        {visibleColumns.Produk && (
                                            <TableHead className="text-xs text-muted-foreground">
                                                Produk
                                            </TableHead>
                                        )}

                                        {visibleColumns.Jumlah && (
                                            <TableHead className="text-xs text-muted-foreground">
                                                Jumlah
                                            </TableHead>
                                        )}

                                        {visibleColumns.Total && (
                                            <TableHead className="text-xs text-muted-foreground">
                                                Total
                                            </TableHead>
                                        )}

                                        {visibleColumns.Metode && (
                                            <TableHead className="text-xs text-muted-foreground">
                                                Metode
                                            </TableHead>
                                        )}

                                        <TableHead className="w-32 text-right" />
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {pending.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={pendingColSpan}
                                                className="py-12 text-center text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <PackageX className="h-10 w-10 stroke-[1.25] text-muted-foreground/60" />
                                                    <p className="text-sm font-medium text-foreground">
                                                        Tidak Ada Pesanan
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Pencarian tidak menemukan pesanan yang cocok.
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {pending.data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="text-center text-xs text-muted-foreground">
                                                <Clock className="mx-auto h-4 w-4 text-amber-500/70" />
                                            </TableCell>

                                            {visibleColumns.Pembeli && (
                                                <TableCell>
                                                    <div className="font-medium text-foreground">
                                                        {item.nama_pembeli}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {item.no_wa}
                                                    </div>
                                                </TableCell>
                                            )}

                                            {visibleColumns.Produk && (
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Package className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                                                        <span>
                                                            {item.product_size.product.nama}{' '}
                                                            ({item.product_size.Ukuran}ml)
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            )}

                                            {visibleColumns.Jumlah && (
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {item.jumlah}
                                                </TableCell>
                                            )}

                                            {visibleColumns.Total && (
                                                <TableCell className="font-semibold text-sm whitespace-nowrap">
                                                    {formatPrice(item.total_harga)}
                                                </TableCell>
                                            )}

                                            {visibleColumns.Metode && (
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {metodeLabel[item.metode_pembayaran]}
                                                </TableCell>
                                            )}

                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleVerify(item)}
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
                            <div className="flex items-center justify-between border-t border-border p-4 bg-muted/10 text-xs text-muted-foreground">
                                <span>
                                    Menampilkan halaman{' '}
                                    <strong className="text-foreground">
                                        {pending.current_page}
                                    </strong>{' '}
                                    dari{' '}
                                    <strong className="text-foreground">
                                        {pending.last_page}
                                    </strong>
                                </span>

                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pending.current_page <= 1}
                                        onClick={() =>
                                            changePage(
                                                'pending_page',
                                                pending.current_page - 1,
                                            )
                                        }
                                        className="h-8 px-3 text-xs gap-1"
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" />
                                        Sebelumnya
                                    </Button>

                                    <span className="px-3 py-1 font-medium text-foreground bg-background border border-border rounded-md">
                                        {pending.current_page} / {pending.last_page}
                                    </span>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            pending.current_page >= pending.last_page
                                        }
                                        onClick={() =>
                                            changePage(
                                                'pending_page',
                                                pending.current_page + 1,
                                            )
                                        }
                                        className="h-8 px-3 text-xs gap-1"
                                    >
                                        Selanjutnya
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Pesanan Terverifikasi */}
                <div>
                    <div className="relative overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    {visibleColumns.Invoice && (
                                        <TableHead className="text-xs text-muted-foreground">
                                            Invoice
                                        </TableHead>
                                    )}

                                    {visibleColumns.Pembeli && (
                                        <TableHead className="text-xs text-muted-foreground">
                                            Pembeli
                                        </TableHead>
                                    )}

                                    {visibleColumns.Produk && (
                                        <TableHead className="text-xs text-muted-foreground">
                                            Produk
                                        </TableHead>
                                    )}

                                    {visibleColumns.Jumlah && (
                                        <TableHead className="text-xs text-muted-foreground">
                                            Jumlah
                                        </TableHead>
                                    )}

                                    {visibleColumns.Total && (
                                        <TableHead className="text-xs text-muted-foreground">
                                            Total
                                        </TableHead>
                                    )}

                                    {visibleColumns.Metode && (
                                        <TableHead className="text-xs text-muted-foreground">
                                            Metode
                                        </TableHead>
                                    )}

                                    {visibleColumns.Status && (
                                        <TableHead className="text-xs text-muted-foreground">
                                            Status
                                        </TableHead>
                                    )}

                                    <TableHead className="w-12 text-right" />
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {verified.data.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={verifiedColSpan}
                                            className="py-12 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <PackageX className="h-10 w-10 stroke-[1.25] text-muted-foreground/60" />
                                                <p className="text-sm font-medium text-foreground">
                                                    {filters.search
                                                        ? 'Gak ada hasil yang cocok'
                                                        : 'Belum ada pesanan terverifikasi'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {filters.search
                                                        ? 'Coba gunakan kata kunci pencarian lain.'
                                                        : 'Pesanan yang sudah diverifikasi akan muncul di sini.'}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {verified.data.map((item) => (
                                    <TableRow key={item.id}>
                                        {visibleColumns.Invoice && (
                                            <TableCell>
                                                <Link
                                                    href={invoice(item.id).url}
                                                    className="font-mono text-xs text-muted-foreground hover:text-foreground hover:underline underline-offset-2"
                                                >
                                                    {invoiceCode(item.id)}
                                                </Link>
                                            </TableCell>
                                        )}

                                        {visibleColumns.Pembeli && (
                                            <TableCell>
                                                <div className="font-medium text-foreground">
                                                    {item.nama_pembeli}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {item.no_wa}
                                                </div>
                                            </TableCell>
                                        )}

                                        {visibleColumns.Produk && (
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Package className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                                                    <span>
                                                        {item.product_size.product.nama}{' '}
                                                        ({item.product_size.Ukuran}ml)
                                                    </span>
                                                </div>
                                            </TableCell>
                                        )}

                                        {visibleColumns.Jumlah && (
                                            <TableCell className="text-sm text-muted-foreground">
                                                {item.jumlah}
                                            </TableCell>
                                        )}

                                        {visibleColumns.Total && (
                                            <TableCell className="font-semibold text-sm whitespace-nowrap">
                                                {formatPrice(item.total_harga)}
                                            </TableCell>
                                        )}

                                        {visibleColumns.Metode && (
                                            <TableCell className="text-sm text-muted-foreground">
                                                {metodeLabel[item.metode_pembayaran]}
                                            </TableCell>
                                        )}

                                        {visibleColumns.Status && (
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Badge
                                                            variant="outline"
                                                            role="button"
                                                            tabIndex={0}
                                                            className={`text-[10px] px-2 py-0.5 capitalize cursor-pointer select-none ${statusBadgeClass[item.status]}`}
                                                        >
                                                            {statusLabel[item.status]}
                                                        </Badge>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent
                                                        align="start"
                                                        className="w-36"
                                                    >
                                                        {statusOptions.map((opt) => (
                                                            <DropdownMenuItem
                                                                key={opt}
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        item,
                                                                        opt,
                                                                    )
                                                                }
                                                                className="text-xs cursor-pointer"
                                                            >
                                                                {statusLabel[opt]}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}

                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-muted"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Buka menu
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-40"
                                                >
                                                    <DropdownMenuItem
                                                        asChild
                                                        className="cursor-pointer"
                                                    >
                                                        <Link
                                                            href={invoice(item.id).url}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <FileText className="h-3.5 w-3.5" />
                                                            Invoice
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <EditPesananSheet
                                                        pesanan={item}
                                                        productSizes={productSizes}
                                                        onUpdated={refreshList}
                                                        trigger={
                                                            <DropdownMenuItem
                                                                onSelect={(e) =>
                                                                    e.preventDefault()
                                                                }
                                                                className="cursor-pointer"
                                                            >
                                                                Edit
                                                            </DropdownMenuItem>
                                                        }
                                                    />

                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDelete(item)
                                                        }
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
                        <div className="flex items-center justify-between border-t border-border p-4 bg-muted/10 text-xs text-muted-foreground">
                            <span>
                                Menampilkan halaman{' '}
                                <strong className="text-foreground">
                                    {verified.current_page}
                                </strong>{' '}
                                dari{' '}
                                <strong className="text-foreground">
                                    {verified.last_page}
                                </strong>
                            </span>

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={verified.current_page <= 1}
                                    onClick={() =>
                                        changePage(
                                            'verified_page',
                                            verified.current_page - 1,
                                        )
                                    }
                                    className="h-8 px-3 text-xs gap-1"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                    Sebelumnya
                                </Button>

                                <span className="px-3 py-1 font-medium text-foreground bg-background border border-border rounded-md">
                                    {verified.current_page} / {verified.last_page}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        verified.current_page >= verified.last_page
                                    }
                                    onClick={() =>
                                        changePage(
                                            'verified_page',
                                            verified.current_page + 1,
                                        )
                                    }
                                    className="h-8 px-3 text-xs gap-1"
                                >
                                    Selanjutnya
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
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