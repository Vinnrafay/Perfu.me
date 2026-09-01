import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { products } from '@/routes';
import { destroy } from '@/actions/App/Http/Controllers/ProductsController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ArrowUpDown,
    ChevronDown,
    MoreHorizontal,
    Search,
    SlidersHorizontal,
    Trash2,
    PackageX,
    Sparkles,
    Package,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import AddProductSheet from './add';
import EditProductSheet, { Product } from './edit';

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    total: number;
    per_page?: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    products: PaginatedProducts;
    filters: { search: string };
}

const allColumns = ['Kategori', 'Ukuran', 'Harga', 'Stok', 'Best Seller'] as const;
type ColumnKey = (typeof allColumns)[number];

const formatPrice = (val: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(val);

// Total stok dari seluruh varian ukuran sebuah produk
const totalStok = (product: Product): number =>
    (product.sizes ?? []).reduce((sum, s) => sum + (s.Stok ?? 0), 0);

// Daftar ukuran (ml) sebuah produk, dipisah koma, contoh: "30ml, 50ml, 100ml"
const daftarUkuran = (product: Product): string => {
    const sizes = product.sizes ?? [];
    if (sizes.length === 0) return '-';
    return sizes.map((s) => `${s.Ukuran}ml`).join(', ');
};

// Rentang harga akhir termurah - termahal dari seluruh varian ukuran
const rentangHarga = (product: Product): string => {
    const sizes = product.sizes ?? [];
    if (sizes.length === 0) return '-';
    const hargaAkhirList = sizes.map(
        (s) => s.harga_akhir ?? Math.max(0, (s.Harga ?? 0) - (s.Diskon ?? 0)),
    );
    const min = Math.min(...hargaAkhirList);
    const max = Math.max(...hargaAkhirList);
    return min === max ? formatPrice(min) : `${formatPrice(min)} - ${formatPrice(max)}`;
};

export default function ProductsList({ products: paginated, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [selected, setSelected] = useState<number[]>([]);
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
        Kategori: true,
        Ukuran: true,
        Harga: true,
        Stok: true,
        'Best Seller': true,
    });

    // Client-side sorting berdasarkan nama
    const rows = useMemo(() => {
        return [...(paginated.data || [])].sort((a, b) =>
            sortAsc ? a.nama.localeCompare(b.nama) : b.nama.localeCompare(a.nama)
        );
    }, [paginated.data, sortAsc]);

    const allSelected = rows.length > 0 && selected.length === rows.length;

    const toggleAll = () => {
        setSelected(allSelected ? [] : rows.map((r) => r.id));
    };

    const toggleRow = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // FIX: Gunakan window.location.pathname agar tidak terlempar ke halaman public catalog
    const handlePageChange = (page: number) => {
        router.get(
            window.location.pathname,
            { search, page },
            { preserveState: true, replace: true }
        );
    };

    // FIX: Search tetap di halaman saat ini dan reset ke halaman 1
    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            window.location.pathname,
            { search, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus produk ini?')) {
            router.delete(destroy(id).url, {
                onSuccess: () => setSelected((prev) => prev.filter((item) => item !== id)),
            });
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Yakin ingin menghapus ${selected.length} produk terpilih?`)) {
            selected.forEach((id) => router.delete(destroy(id).url));
            setSelected([]);
        }
    };

    const refreshList = () => {
        router.reload({ only: ['products'] });
    };

    // Perhitungan Info Paginasi
    const totalItems = paginated.total ?? 0;
    const perPage = paginated.per_page || paginated.data?.length || 10;
    const from = totalItems === 0 ? 0 : (paginated.current_page - 1) * perPage + 1;
    const to = Math.min(from + (paginated.data?.length || 0) - 1, totalItems);

    return (
        <div className="flex flex-col gap-3 p-5 w-full">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Daftar Produk
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola stok, harga, dan informasi produk toko kamu.
                    </p>
                </div>
                <AddProductSheet onCreated={refreshList} />
            </div>

            {/* Table Card Container */}
            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-border bg-muted/20">
                    {/* Search Form */}
                    <form onSubmit={submitSearch} className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama produk..."
                            className="pl-9 bg-background"
                        />
                    </form>

                    {/* Toolbar Action Buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {selected.length > 0 && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleBulkDelete}
                                className="h-9 gap-1.5 text-xs animate-in fade-in zoom-in-95 duration-150"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Hapus ({selected.length})
                            </Button>
                        )}

                        {/* Column Toggle Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                                    Kolom
                                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel className="text-xs">Tampilkan Kolom</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {allColumns.map((col) => (
                                    <DropdownMenuCheckboxItem
                                        key={col}
                                        checked={visibleColumns[col]}
                                        onCheckedChange={(checked) =>
                                            setVisibleColumns((prev) => ({
                                                ...prev,
                                                [col]: Boolean(checked),
                                            }))
                                        }
                                        className="text-xs capitalize"
                                    >
                                        {col}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Table */}
                <div className="relative overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="w-12 text-center">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={toggleAll}
                                        aria-label="Pilih semua produk"
                                    />
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSortAsc((v) => !v)}
                                        className="-ml-3 h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        Nama
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </Button>
                                </TableHead>
                                {visibleColumns.Kategori && (
                                    <TableHead className="text-xs text-muted-foreground">
                                        Kategori
                                    </TableHead>
                                )}
                                {visibleColumns.Ukuran && (
                                    <TableHead className="text-xs text-muted-foreground">
                                        Ukuran
                                    </TableHead>
                                )}
                                {visibleColumns.Harga && (
                                    <TableHead className="text-xs text-muted-foreground">
                                        Harga
                                    </TableHead>
                                )}
                                {visibleColumns.Stok && (
                                    <TableHead className="text-xs text-muted-foreground">
                                        Stok
                                    </TableHead>
                                )}
                                {visibleColumns['Best Seller'] && (
                                    <TableHead className="text-xs text-muted-foreground">
                                        Best Seller
                                    </TableHead>
                                )}
                                <TableHead className="w-12 text-right" />
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {/* Empty State */}
                            {rows.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="py-12 text-center text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <PackageX className="h-10 w-10 stroke-[1.25] text-muted-foreground/60" />
                                            <p className="text-sm font-medium text-foreground">Tidak Ada Produk</p>
                                            <p className="text-xs text-muted-foreground">
                                                Belum ada produk yang ditambahkan atau pencarian tidak ditemukan.
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Data Rows */}
                            {rows.map((product) => {
                                const isSelected = selected.includes(product.id);
                                const stok = totalStok(product);

                                return (
                                    <TableRow
                                        key={product.id}
                                        className={isSelected ? 'bg-muted/50 data-[state=selected]:bg-muted/50' : undefined}
                                    >
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => toggleRow(product.id)}
                                                aria-label={`Pilih ${product.nama}`}
                                            />
                                        </TableCell>

                                        <TableCell className="font-medium text-foreground">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-muted-foreground/70 hidden sm:block" />
                                                <span>{product.nama}</span>
                                            </div>
                                        </TableCell>

                                        {visibleColumns.Kategori && (
                                            <TableCell className="text-muted-foreground text-sm">
                                                {product.kategori || '-'}
                                            </TableCell>
                                        )}

                                        {visibleColumns.Ukuran && (
                                            <TableCell className="text-muted-foreground text-sm">
                                                {daftarUkuran(product)}
                                            </TableCell>
                                        )}

                                        {visibleColumns.Harga && (
                                            <TableCell className="font-semibold text-muted-foreground text-sm whitespace-nowrap">
                                                {rentangHarga(product)}
                                            </TableCell>
                                        )}

                                        {visibleColumns.Stok && (
                                            <TableCell>
                                                {stok === 0 ? (
                                                    <Badge variant="destructive" className="text-[10px] px-2 py-0">
                                                        Habis
                                                    </Badge>
                                                ) : stok <= 5 ? (
                                                    <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] px-2 py-0">
                                                        Sisa {stok}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">{stok}</span>
                                                )}
                                            </TableCell>
                                        )}

                                        {visibleColumns['Best Seller'] && (
                                            <TableCell>
                                                {product.Best_Seller === 'yes' || product['Best Seller'] === 'yes' ? (
                                                    <Badge variant="secondary" className="gap-1 text-[11px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200/50">
                                                        <Sparkles className="h-3 w-3 fill-indigo-500 text-indigo-500" />
                                                        Ya
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground/60">-</span>
                                                )}
                                            </TableCell>
                                        )}

                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Buka menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-36">
                                                    <EditProductSheet
                                                        product={product}
                                                        onUpdated={refreshList}
                                                        trigger={
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                                                                Edit
                                                            </DropdownMenuItem>
                                                        }
                                                    />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                                                    >
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer Paginasi (FIXED LOGIC) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border p-4 bg-muted/10 text-xs text-muted-foreground">
                    <div>
                        {selected.length > 0 ? (
                            <span className="font-medium text-foreground">
                                {selected.length} dari {rows.length} baris terpilih.
                            </span>
                        ) : (
                            <span>
                                Menampilkan <strong className="text-foreground">{from}</strong> - <strong className="text-foreground">{to}</strong> dari <strong className="text-foreground">{totalItems}</strong> produk
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={paginated.current_page <= 1}
                            onClick={() => handlePageChange(paginated.current_page - 1)}
                            className="h-8 px-3 text-xs gap-1"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            Sebelumnya
                        </Button>

                        <span className="px-3 py-1 font-medium text-foreground bg-background border border-border rounded-md">
                            {paginated.current_page} / {paginated.last_page || 1}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={paginated.current_page >= paginated.last_page}
                            onClick={() => handlePageChange(paginated.current_page + 1)}
                            className="h-8 px-3 text-xs gap-1"
                        >
                            Selanjutnya
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

ProductsList.layout = {
    breadcrumbs: [
        {
            title: 'Product Management',
            href: products(),
        },
    ],
};