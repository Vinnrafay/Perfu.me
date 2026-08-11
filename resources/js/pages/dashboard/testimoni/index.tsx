import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';

// 1. Disesuaikan import route Wayfinder (menggunakan testimoniIndex)
import { index as testimoniIndex } from '@/routes/testimoni';


// 2. Import Action Controller Wayfinder
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
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, ChevronDown, MoreHorizontal, Star, User } from 'lucide-react';
import AddTestimoniSheet from './add';
import EditTestimoniSheet from './edit';


// 3. Deklarasi interface Testimoni langsung di sini agar tidak error import
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
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    testimonis: PaginatedTestimoni;
    filters: { search: string };
}

const allColumns = ['Email', 'Komentar', 'Rating', 'Tanggal'] as const;
type ColumnKey = (typeof allColumns)[number];

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
        router.get(testimoniIndex().url, { search }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin mau hapus testimoni ini?')) {
            router.delete(destroy(id).url);
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

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="font-heading text-2xl italic">Daftar Testimoni</h1>
                <AddTestimoniSheet onCreated={refreshList} />
            </div>

            <div className="rounded-lg border border-border">
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-3 border-b border-border p-4">
                    <form onSubmit={submitSearch} className="max-w-xs flex-1">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama atau ulasan..."
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
                            {visibleColumns.Email && (
                                <TableHead className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Email
                                </TableHead>
                            )}
                            {visibleColumns.Komentar && (
                                <TableHead className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Komentar
                                </TableHead>
                            )}
                            {visibleColumns.Rating && (
                                <TableHead className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Rating
                                </TableHead>
                            )}
                            {visibleColumns.Tanggal && (
                                <TableHead className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                    Tanggal
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
                                    Belum ada testimoni.
                                </TableCell>
                            </TableRow>
                        )}

                        {rows.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selected.includes(item.id)}
                                        onCheckedChange={() => toggleRow(item.id)}
                                        aria-label={`Pilih ${item.nama}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        {item.profil ? (
                                            <img
                                                src={item.profil}
                                                alt={item.nama}
                                                className="h-7 w-7 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                                <User className="h-4 w-4" />
                                            </div>
                                        )}
                                        <span>{item.nama}</span>
                                    </div>
                                </TableCell>
                                {visibleColumns.Email && (
                                    <TableCell className="text-muted-foreground">
                                        {item.email}
                                    </TableCell>
                                )}
                                {visibleColumns.Komentar && (
                                    <TableCell className="max-w-xs truncate">
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
                                    <TableCell className="text-xs text-muted-foreground">
                                        {item.created_at}
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
                                            <EditTestimoniSheet
                                                testimoni={item}
                                                onUpdated={refreshList}
                                                trigger={
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        Edit
                                                    </DropdownMenuItem>
                                                }
                                            />
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(item.id)}
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

                {/* Footer / Pagination */}
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
                                    testimoniIndex().url,
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
                                    testimoniIndex().url,
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

TestimoniList.layout = {
    breadcrumbs: [
        {
            title: 'Testimonial Management',
            href: testimoniIndex().url,
        },
    ],
};