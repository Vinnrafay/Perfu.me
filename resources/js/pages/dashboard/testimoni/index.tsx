import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { index as testimoniIndex } from '@/routes/testimoni';
import { destroy } from '@/actions/App/Http/Controllers/TestimoniController';
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
    MessageSquareX,
    Star,
    User,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import AddTestimoniSheet from './add';
import EditTestimoniSheet from './edit';

export interface Testimoni {
    id: number;
    nama: string;
    email: string;
    profil?: string | null;
    komentar: string;
    rating: number;
    created_at: string;
}

interface PaginatedTestimoni {
    data: Testimoni[];
    current_page: number;
    last_page: number;
    total: number;
    per_page?: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    testimonis: PaginatedTestimoni;
    filters: { search: string };
}

const allColumns = ['Email', 'Komentar', 'Rating', 'Tanggal'] as const;
type ColumnKey = (typeof allColumns)[number];

// Helper pintar untuk mendeteksi berbagai format path foto agar tidak inkonsisten
const getProfilUrl = (profil: string | null | undefined) => {
    if (!profil) return null;
    if (profil.startsWith('http://') || profil.startsWith('https://')) return profil;
    if (profil.startsWith('/storage/')) return profil;
    if (profil.startsWith('storage/')) return `/${profil}`;
    return `/storage/${profil}`;
};

export default function TestimoniList({ testimonis: paginated, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [selected, setSelected] = useState<number[]>([]);
    const [sortAsc, setSortAsc] = useState(true);
    const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
        Email: true,
        Komentar: true,
        Rating: true,
        Tanggal: true,
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

    const handlePageChange = (page: number) => {
        router.get(
            window.location.pathname,
            { search, page },
            { preserveState: true, replace: true }
        );
    };

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            window.location.pathname,
            { search, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin mau hapus testimoni ini?')) {
            router.delete(destroy(id).url, {
                onSuccess: () => setSelected((prev) => prev.filter((item) => item !== id)),
            });
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Yakin ingin menghapus ${selected.length} testimoni terpilih?`)) {
            selected.forEach((id) => router.delete(destroy(id).url));
            setSelected([]);
        }
    };

    const refreshList = () => {
        router.reload({ only: ['testimonis'] });
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                    i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                }`}
            />
        ));
    };

    // Perhitungan Info Paginasi
    const totalItems = paginated.total ?? 0;
    const perPage = paginated.per_page || paginated.data?.length || 10;
    const from = totalItems === 0 ? 0 : (paginated.current_page - 1) * perPage + 1;
    const to = Math.min(from + (paginated.data?.length || 0) - 1, totalItems);

    return (
        <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Daftar Testimoni
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola testimoni dan ulasan dari pelanggan kamu.
                    </p>
                </div>
                <AddTestimoniSheet onCreated={refreshList} />
            </div>

            {/* Table Card Container */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-border bg-muted/20">
                    {/* Search Form */}
                    <form onSubmit={submitSearch} className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari ulasan atau nama..."
                            className="h-9 pl-9 text-sm rounded-lg bg-background"
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
                                <Button variant="outline" size="sm" className="h-9 gap-2 rounded-lg text-xs font-medium">
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
                                        aria-label="Pilih semua testimoni"
                                    />
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSortAsc((v) => !v)}
                                        className="-ml-3 h-8 gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                                    >
                                        Nama
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </Button>
                                </TableHead>
                                {visibleColumns.Email && (
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Email
                                    </TableHead>
                                )}
                                {visibleColumns.Komentar && (
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Komentar
                                    </TableHead>
                                )}
                                {visibleColumns.Rating && (
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Rating
                                    </TableHead>
                                )}
                                {visibleColumns.Tanggal && (
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Tanggal
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
                                        colSpan={7}
                                        className="py-12 text-center text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <MessageSquareX className="h-10 w-10 stroke-[1.25] text-muted-foreground/60" />
                                            <p className="text-sm font-medium text-foreground">Tidak Ada Testimoni</p>
                                            <p className="text-xs text-muted-foreground">
                                                Belum ada ulasan yang ditambahkan atau pencarian tidak ditemukan.
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Data Rows */}
                            {rows.map((item) => {
                                const isSelected = selected.includes(item.id);
                                const profilUrl = getProfilUrl(item.profil);

                                return (
                                    <TableRow
                                        key={item.id}
                                        className={isSelected ? 'bg-muted/50 data-[state=selected]:bg-muted/50' : undefined}
                                    >
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => toggleRow(item.id)}
                                                aria-label={`Pilih ${item.nama}`}
                                            />
                                        </TableCell>

                                        <TableCell className="font-medium text-foreground">
                                            <div className="flex items-center gap-2.5">
                                                {profilUrl ? (
                                                    <img
                                                        src={profilUrl}
                                                        alt={item.nama}
                                                        className="h-7 w-7 rounded-full object-cover shrink-0 border border-border"
                                                    />
                                                ) : (
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0 border border-border">
                                                        <User className="h-3.5 w-3.5" />
                                                    </div>
                                                )}
                                                <span className="truncate">{item.nama}</span>
                                            </div>
                                        </TableCell>

                                        {visibleColumns.Email && (
                                            <TableCell className="text-muted-foreground text-sm">
                                                {item.email}
                                            </TableCell>
                                        )}

                                        {visibleColumns.Komentar && (
                                            <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                                                {item.komentar}
                                            </TableCell>
                                        )}

                                        {visibleColumns.Rating && (
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    {renderStars(item.rating)}
                                                </div>
                                            </TableCell>
                                        )}

                                        {visibleColumns.Tanggal && (
                                            <TableCell className="text-muted-foreground text-xs">
                                                {item.created_at || '-'}
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
                                                    <EditTestimoniSheet
                                                        testimoni={item}
                                                        onUpdated={refreshList}
                                                        trigger={
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                                                                Edit
                                                            </DropdownMenuItem>
                                                        }
                                                    />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(item.id)}
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

                {/* Footer Paginasi */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border p-4 bg-muted/10 text-xs text-muted-foreground">
                    <div>
                        {selected.length > 0 ? (
                            <span className="font-medium text-foreground">
                                {selected.length} dari {rows.length} baris terpilih.
                            </span>
                        ) : (
                            <span>
                                Menampilkan <strong className="text-foreground">{from}</strong> - <strong className="text-foreground">{to}</strong> dari <strong className="text-foreground">{totalItems}</strong> testimoni
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
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

TestimoniList.layout = {
    breadcrumbs: [
        {
            title: 'Testimonial Management',
            href: testimoniIndex().url,
        },
    ],
};