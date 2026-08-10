import { useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { products } from '@/routes';
import { edit, destroy } from '@/actions/App/Http/Controllers/ProductsController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';

interface Product {
    id: number;
    nama: string;
    kategori: string;
    gender: string;
    Ukuran: number;
    Harga: number;
    Stok: number;
    'Best Seller': 'yes' | 'no';
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    products: PaginatedProducts;
    filters: { search: string };
}

const allColumns = ['Kategori', 'Ukuran', 'Harga', 'Stok', 'Best Seller'] as const;
type ColumnKey = (typeof allColumns)[number];

export default function ProductsList({ products: paginated, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [selected, setSelected] = useState<number[]>([]);
    const [sortAsc, setSortAsc] = useState(true);
    const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
        Kategori: true,
        Ukuran: true,
        Harga: true,
        Stok: true,
        'Best Seller': true,
    });
    const [columnsOpen, setColumnsOpen] = useState(false);

    const rows = useMemo(() => {
        return [...paginated.data].sort((a, b) =>
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

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(products(), { search }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin mau hapus produk ini?')) {
            router.delete(destroy(id));
        }
    };

    const formatPrice = (val: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="font-heading text-2xl italic">Daftar Produk</h1>
                <Button asChild>
                    <Link href="/dashboard/products/create">Tambah Produk</Link>
                </Button>
            </div>

            <div className="rounded-lg border border-border">
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-3 border-b border-border p-4">
                    <form onSubmit={submitSearch} className="max-w-xs flex-1">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama produk..."
                            className="rounded-md"
                        />
                    </form>

                    <div className="relative">
                        <Button
                            variant="outline"
                            onClick={() => setColumnsOpen((v) => !v)}
                            className="flex items-center gap-2 rounded-md"
                        >
                            Columns
                            <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
                        </Button>

                        {columnsOpen && (
                            <div className="absolute right-0 z-20 mt-2 w-40 rounded-md border border-border bg-popover p-2 shadow-md">
                                {allColumns.map((col) => (
                                    <label
                                        key={col}
                                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                                    >
                                        <Checkbox
                                            checked={visibleColumns[col]}
                                            onCheckedChange={(checked) =>
                                                setVisibleColumns((prev) => ({
                                                    ...prev,
                                                    [col]: Boolean(checked),
                                                }))
                                            }
                                        />
                                        {col}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">
                                <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={toggleAll}
                                    aria-label="Pilih semua"
                                />
                            </TableHead>
                            <TableHead>
                                <button
                                    type="button"
                                    onClick={() => setSortAsc((v) => !v)}
                                    className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                                >
                                    Nama
                                    <ArrowUpDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                                </button>
                            </TableHead>
                            {visibleColumns.Kategori && (
                                <TableHead className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Kategori
                                </TableHead>
                            )}
                            {visibleColumns.Ukuran && (
                                <TableHead className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Ukuran
                                </TableHead>
                            )}
                            {visibleColumns.Harga && (
                                <TableHead className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Harga
                                </TableHead>
                            )}
                            {visibleColumns.Stok && (
                                <TableHead className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Stok
                                </TableHead>
                            )}
                            {visibleColumns['Best Seller'] && (
                                <TableHead className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Best Seller
                                </TableHead>
                            )}
                            <TableHead className="w-10" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="py-10 text-center text-sm text-muted-foreground"
                                >
                                    Belum ada produk.
                                </TableCell>
                            </TableRow>
                        )}

                        {rows.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selected.includes(product.id)}
                                        onCheckedChange={() => toggleRow(product.id)}
                                        aria-label={`Pilih ${product.nama}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{product.nama}</TableCell>
                                {visibleColumns.Kategori && (
                                    <TableCell>{product.kategori}</TableCell>
                                )}
                                {visibleColumns.Ukuran && (
                                    <TableCell>{product.Ukuran}ml</TableCell>
                                )}
                                {visibleColumns.Harga && (
                                    <TableCell>{formatPrice(product.Harga)}</TableCell>
                                )}
                                {visibleColumns.Stok && (
                                    <TableCell>{product.Stok}</TableCell>
                                )}
                                {visibleColumns['Best Seller'] && (
                                    <TableCell>
                                        {product['Best Seller'] === 'yes' ? (
                                            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">No</span>
                                        )}
                                    </TableCell>
                                )}
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={edit(product.id)}>Edit</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(product.id)}
                                                className="text-destructive focus:text-destructive"
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

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border p-4">
                    <span className="text-sm text-muted-foreground">
                        {selected.length} of {rows.length} row(s) selected.
                    </span>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={paginated.current_page <= 1}
                            onClick={() =>
                                router.get(
                                    products(),
                                    { search, page: paginated.current_page - 1 },
                                    { preserveState: true }
                                )
                            }
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={paginated.current_page >= paginated.last_page}
                            onClick={() =>
                                router.get(
                                    products(),
                                    { search, page: paginated.current_page + 1 },
                                    { preserveState: true }
                                )
                            }
                        >
                            Next
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