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
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, ChevronDown, MoreHorizontal, Star } from 'lucide-react';
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

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTestimoni {
    data: Testimoni[];
    current_page: number;
    last_page: number;
    total: number;
    links: PaginationLink[];
}

interface Props {
    testimonis: PaginatedTestimoni;
    filters: { search: string };
}

const allColumns = ['Email', 'Komentar', 'Rating', 'Tanggal'] as const;
type ColumnKey = (typeof allColumns)[number];
type NameSort = 'none' | 'asc' | 'desc';

export default function TestimoniList({ testimonis: paginated, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [selected, setSelected] = useState<number[]>([]);
    const [nameSort, setNameSort] = useState<NameSort>('none');
    const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
        Email: true,
        Komentar: true,
        Rating: true,
        Tanggal: true,
    });
    const [columnsOpen, setColumnsOpen] = useState(false);

    // Default: ikutin urutan asli dari backend (terbaru di atas).
    // Cuma di-override kalau user eksplisit klik header "Nama".
    const rows = useMemo(() => {
        if (nameSort === 'none') return paginated.data;
        return [...paginated.data].sort((a, b) =>
            nameSort === 'asc'
                ? a.nama.localeCompare(b.nama)
                : b.nama.localeCompare(a.nama)
        );
    }, [paginated.data, nameSort]);

    const allSelected = rows.length > 0 && selected.length === rows.length;

    const toggleAll = () => {
        setSelected(allSelected ? [] : rows.map((r) => r.id));
    };

    const toggleRow = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const cycleNameSort = () => {
        setNameSort((prev) => (prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none'));
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

    const goToPageUrl = (url: string | null) => {
        if (!url) return;
        router.visit(url, { preserveState: true, preserveScroll: true });
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

    const pageLinks = paginated.links.slice(1, -1);
    const prevLink = paginated.links[0];
    const nextLink = paginated.links[paginated.links.length - 1];

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
                                    onClick={cycleNameSort}
                                    className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                                >
                                    Nama
                                    <ArrowUpDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                                    {nameSort !== 'none' && (
                                        <span className="text-[10px] normal-case text-muted-foreground/70">
                                            ({nameSort === 'asc' ? 'A-Z' : 'Z-A'})
                                        </span>
                                    )}
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
                                <TableCell className="font-medium">{item.nama}</TableCell>
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
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4">
                    <span className="text-sm text-muted-foreground">
                        {selected.length} of {rows.length} row(s) selected.
                    </span>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!prevLink?.url}
                            onClick={() => goToPageUrl(prevLink?.url ?? null)}
                        >
                            Previous
                        </Button>

                        {pageLinks.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => goToPageUrl(link.url)}
                                className="min-w-9"
                            >
                                {link.label}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!nextLink?.url}
                            onClick={() => goToPageUrl(nextLink?.url ?? null)}
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