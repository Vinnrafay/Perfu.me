import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import {
    Filter,
    Search,
    RotateCcw,
    Sparkles,
    SlidersHorizontal,
    X,
    ShoppingBag,
    ArrowUpDown,
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

export interface Product {
    id: number;
    nama: string;
    kategori?: string;
    gender: string;
    Varian: string;
    Harga: number;
    Ukuran: number;
    Deskripsi: string;
    Foto: string | null;
    Best_Seller?: string;
    'Best Seller'?: string;
}

interface Props {
    products: Product[];
}

const GENDER_OPTIONS = [
    { value: 'male', label: 'Pria' },
    { value: 'female', label: 'Wanita' },
    { value: 'unisex', label: 'Unisex' },
];

export default function Catalog({ products = [] }: Props) {
    // State Filter & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [bestSellerOnly, setBestSellerOnly] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>('default');

    // Menentukan harga maksimum tertinggi secara dinamis dari data
    const maxDataPrice = useMemo(() => {
        if (!products.length) return 1000000;
        return Math.max(...products.map((p) => Number(p.Harga) || 0));
    }, [products]);

    const [priceRange, setPriceRange] = useState<number>(maxDataPrice || 1000000);

    // Toggle Multi-select Checkbox Helper
    const handleToggleItem = (
        item: string,
        list: string[],
        setList: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        if (list.includes(item)) {
            setList(list.filter((i) => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    // Reset All Filters
    const isFiltered =
        searchTerm !== '' ||
        selectedGenders.length > 0 ||
        bestSellerOnly ||
        priceRange < maxDataPrice;

    const resetFilter = () => {
        setSearchTerm('');
        setSelectedGenders([]);
        setBestSellerOnly(false);
        setPriceRange(maxDataPrice);
        setSortBy('default');
    };

    // Filter Data Produk (Tanpa Kategori)
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const isBestSeller =
                product.Best_Seller === 'yes' || product['Best Seller'] === 'yes';

            // Filter Pencarian (Nama & Varian)
            const matchSearch =
                !searchTerm ||
                product.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.Varian.toLowerCase().includes(searchTerm.toLowerCase());

            // Filter Gender
            const matchGender =
                selectedGenders.length === 0 ||
                selectedGenders.includes(product.gender?.toLowerCase());

            // Filter Best Seller
            const matchBestSeller = !bestSellerOnly || isBestSeller;

            // Filter Harga
            const matchPrice = Number(product.Harga) <= priceRange;

            return matchSearch && matchGender && matchBestSeller && matchPrice;
        });
    }, [products, searchTerm, selectedGenders, bestSellerOnly, priceRange]);

    // Sorting Data Produk
    const sortedProducts = useMemo(() => {
        const items = [...filteredProducts];
        switch (sortBy) {
            case 'price-asc':
                return items.sort((a, b) => Number(a.Harga) - Number(b.Harga));
            case 'price-desc':
                return items.sort((a, b) => Number(b.Harga) - Number(a.Harga));
            case 'name-asc':
                return items.sort((a, b) => a.nama.localeCompare(b.nama));
            case 'best-seller':
                return items.sort((a, b) => {
                    const isABest = a.Best_Seller === 'yes' || a['Best Seller'] === 'yes' ? 1 : 0;
                    const isBBest = b.Best_Seller === 'yes' || b['Best Seller'] === 'yes' ? 1 : 0;
                    return isBBest - isABest;
                });
            default:
                return items;
        }
    }, [filteredProducts, sortBy]);

    // Helper Format Rupiah
    const formatPrice = (val: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);

    // Filter Content Component (Tanpa Kategori)
    const FilterContent = () => (
        <div className="space-y-6">
            {/* Best Seller Quick Toggle
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-transparent border border-amber-500/20">
                <label
                    htmlFor="best-seller-toggle"
                    className="text-xs font-semibold text-foreground flex items-center gap-2 cursor-pointer"
                >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Hanya Best Seller
                </label>
                <Checkbox
                    id="best-seller-toggle"
                    checked={bestSellerOnly}
                    onCheckedChange={(checked) => setBestSellerOnly(Boolean(checked))}
                />
            </div> */}

            <Accordion type="multiple" defaultValue={['gender', 'harga']} className="w-full space-y-2">
                {/* Filter Gender */}
                <AccordionItem value="gender" className="border-border">
                    <AccordionTrigger className="hover:no-underline text-xs font-bold uppercase tracking-wider text-foreground py-3">
                        Target Gender
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2.5 pt-1 pb-3">
                        {GENDER_OPTIONS.map((gen) => (
                            <div key={gen.value} className="flex items-center space-x-3">
                                <Checkbox
                                    id={`gen-${gen.value}`}
                                    checked={selectedGenders.includes(gen.value)}
                                    onCheckedChange={() =>
                                        handleToggleItem(gen.value, selectedGenders, setSelectedGenders)
                                    }
                                />
                                <label
                                    htmlFor={`gen-${gen.value}`}
                                    className="text-sm font-medium leading-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {gen.label}
                                </label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                {/* Filter Harga Maksimum */}
                <AccordionItem value="harga" className="border-border border-b-0">
                    <AccordionTrigger className="hover:no-underline text-xs font-bold uppercase tracking-wider text-foreground py-3">
                        Harga Maksimum
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-2 px-1 space-y-4">
                        <Slider
                            defaultValue={[maxDataPrice]}
                            max={maxDataPrice || 1000000}
                            min={10000}
                            step={10000}
                            value={[priceRange]}
                            onValueChange={(vals) => setPriceRange(vals[0])}
                            className="cursor-pointer"
                        />
                        <div className="flex justify-between items-center text-xs font-medium text-foreground bg-muted/50 py-2 px-3 rounded-lg border border-border/50">
                            <span className="text-muted-foreground uppercase tracking-wider text-[10px]">
                                Batas Atas
                            </span>
                            <span className="font-semibold text-sm">{formatPrice(priceRange)}</span>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );

    return (
        <div className="min-h-screen pb-24 bg-background text-foreground flex flex-col">
            {/* Hero Banner Section */}
            <section className="relative w-full h-[38vh] min-h-[340px] flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/images/BannerPageProduct.png"
                        alt="Discover Your Scent"
                        className="w-full h-full object-cover object-center scale-105 filter brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-black/30" />
                </div>

                <div className="relative z-10 px-6 max-w-3xl mx-auto flex flex-col items-center space-y-3">
                    {/* <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-md px-3.5 py-1 text-[11px] font-medium tracking-widest uppercase">
                        Katalog Eksklusif
                    </Badge> */}
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight leading-tight">
                        Discover Your <span className="font-serif italic font-normal text-indigo-200">Scent</span>
                    </h1>
                    <p className="text-white/80 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-lg">
                        Eksplorasi wewangian aromatik terpilih untuk melengkapi personalitas dan persona unikmu.
                    </p>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="container max-w-7xl w-full mx-auto px-4 sm:px-6 pt-10 flex flex-col md:flex-row gap-8">
                
                {/* Desktop Sidebar Filter */}
                <aside className="hidden md:block w-64 shrink-0">
                    <div className="sticky top-24 p-5 rounded-2xl border border-border space-y-6">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-500" />
                                <h2 className="text-xs font-bold tracking-widest uppercase text-foreground">
                                    Filter Produk
                                </h2>
                            </div>

                            {isFiltered && (
                                <button
                                    onClick={resetFilter}
                                    className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Reset
                                </button>
                            )}
                        </div>

                        <FilterContent />
                    </div>
                </aside>

                {/* Main Product Catalog Section */}
                <main className="flex-1 space-y-6">
                    {/* Top Search & Filter Control Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-3.5 rounded-2xl border border-border">
                        
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nama parfum atau varian..."
                                className="pl-9 h-9 text-xs rounded-xl bg-background/80"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Control Actions */}
                        <div className="flex items-center gap-2 justify-between sm:justify-end">
                            
                            {/* Mobile Filter Sheet Button */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="md:hidden h-9 text-xs gap-2 rounded-xl"
                                    >
                                        <SlidersHorizontal className="w-3.5 h-3.5" />
                                        Filter {isFiltered && '(Aktif)'}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-80 overflow-y-auto">
                                    <SheetHeader className="pb-4 border-b border-border">
                                        <div className="flex items-center justify-between">
                                            <SheetTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                                <Filter className="w-4 h-4 text-indigo-500" />
                                                Filter Katalog
                                            </SheetTitle>
                                            {isFiltered && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={resetFilter}
                                                    className="h-7 text-xs text-destructive hover:bg-destructive/10"
                                                >
                                                    Reset
                                                </Button>
                                            )}
                                        </div>
                                    </SheetHeader>
                                    <div className="py-6">
                                        <FilterContent />
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-2">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="h-9 w-[160px] text-xs rounded-xl bg-background/80">
                                        <ArrowUpDown className="w-3 h-3 mr-1 text-muted-foreground" />
                                        <SelectValue placeholder="Urutkan" />
                                    </SelectTrigger>
                                    <SelectContent align="end">
                                        <SelectItem value="default" className="text-xs">Terbaru</SelectItem>
                                        <SelectItem value="best-seller" className="text-xs">Best Seller</SelectItem>
                                        <SelectItem value="price-asc" className="text-xs">Harga: Rendah ke Tinggi</SelectItem>
                                        <SelectItem value="price-desc" className="text-xs">Harga: Tinggi ke Rendah</SelectItem>
                                        <SelectItem value="name-asc" className="text-xs">Nama: A - Z</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Active Filter Pills Indicator */}
                    {isFiltered && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-[11px] font-medium text-muted-foreground mr-1">
                                Filter Aktif:
                            </span>

                            {searchTerm && (
                                <Badge variant="secondary" className="gap-1.5 text-[10px] py-1 px-2.5 rounded-full">
                                    Cari: "{searchTerm}"
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                                </Badge>
                            )}

                            {selectedGenders.map((gen) => (
                                <Badge key={gen} variant="secondary" className="gap-1.5 text-[10px] py-1 px-2.5 rounded-full capitalize">
                                    {gen}
                                    <X
                                        className="w-3 h-3 cursor-pointer"
                                        onClick={() => handleToggleItem(gen, selectedGenders, setSelectedGenders)}
                                    />
                                </Badge>
                            ))}

                            {bestSellerOnly && (
                                <Badge variant="secondary" className="gap-1.5 text-[10px] py-1 px-2.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                    <Sparkles className="w-3 h-3 fill-amber-500" />
                                    Best Seller
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setBestSellerOnly(false)} />
                                </Badge>
                            )}

                            {priceRange < maxDataPrice && (
                                <Badge variant="secondary" className="gap-1.5 text-[10px] py-1 px-2.5 rounded-full">
                                    Maks {formatPrice(priceRange)}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange(maxDataPrice)} />
                                </Badge>
                            )}

                            <button
                                onClick={resetFilter}
                                className="text-[11px] text-destructive hover:underline ml-1 font-medium"
                            >
                                Hapus Semua
                            </button>
                        </div>
                    )}

                    {/* Total Product Indicator */}
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-1">
                        Menampilkan <span className="text-foreground font-bold">{sortedProducts.length}</span> dari {products.length} produk
                    </div>

                    {/* Empty State */}
                    {sortedProducts.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-card/30 gap-3 text-center px-4">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-1">
                                <Search className="w-6 h-6 text-muted-foreground/60" />
                            </div>
                            <h3 className="font-semibold text-foreground text-base">Produk Tidak Ditemukan</h3>
                            <p className="text-muted-foreground font-normal text-xs max-w-sm">
                                Coba ubah kata kunci pencarian atau bersihkan filter untuk menampilkan produk lainnya.
                            </p>
                            <Button variant="outline" size="sm" onClick={resetFilter} className="mt-2 text-xs rounded-xl">
                                Bersihkan Filter
                            </Button>
                        </div>
                    ) : (
                        /* Product Grid Layout */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedProducts.map((product) => {
                                const isBestSeller =
                                    product.Best_Seller === 'yes' || product['Best Seller'] === 'yes';

                                return (
                                    <Card
                                        key={product.id}
                                        className="group border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 rounded-2xl flex flex-col justify-between"
                                    >
                                        {/* Image Container */}
                                        <CardContent className="p-0 relative aspect-[4/5] bg-muted overflow-hidden">
                                            {product.Foto ? (
                                                <img
                                                    src={`/storage/${product.Foto}`}
                                                    alt={product.nama}
                                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-muted/60 text-muted-foreground text-xs uppercase tracking-widest font-medium">
                                                    No Image
                                                </div>
                                            )}

                                            {/* Top Floating Badges */}
                                            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none">
                                                <div className="flex flex-col gap-1.5 items-start">
                                                    {isBestSeller && (
                                                        <Badge className="bg-foreground text-background hover:bg-foreground rounded-lg px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest shadow-md gap-1">
                                                            <Sparkles className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                                            Best Seller
                                                        </Badge>
                                                    )}
                                                </div>

                                                <Badge variant="outline" className="bg-background/80 backdrop-blur-md text-[9px] font-semibold uppercase text-muted-foreground border-border/60">
                                                    {product.gender}
                                                </Badge>
                                            </div>

                                            {/* Quick Action Button (Hover Effect) */}
                                            <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                                                <Button
                                                    asChild
                                                    className="w-full bg-background/95 backdrop-blur-md text-foreground hover:bg-primary hover:text-primary-foreground border border-border rounded-xl h-9 text-[11px] font-semibold uppercase tracking-wider shadow-lg gap-2"
                                                >
                                                    <Link href={`/products/${product.id}`}>
                                                        <ShoppingBag className="w-3.5 h-3.5" />
                                                        Lihat Detail
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>

                                        {/* Product Info */}
                                        <CardFooter className="p-4 flex flex-col items-start gap-1.5 bg-card">
                                            <div className="w-full flex justify-between items-start gap-2">
                                                <h3 className="font-bold text-sm text-foreground tracking-tight line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    <Link href={`/products/${product.id}`}>
                                                        {product.nama}
                                                    </Link>
                                                </h3>
                                                <span className="text-[11px] font-medium text-muted-foreground uppercase shrink-0 pt-0.5">
                                                    {product.Ukuran} ml
                                                </span>
                                            </div>

                                            <p className="text-xs text-muted-foreground line-clamp-1 font-normal">
                                                {product.Varian}
                                            </p>

                                            <div className="w-full pt-2 flex items-center justify-between border-t border-border/40 mt-1">
                                                <span className="font-extrabold text-sm text-foreground">
                                                    {formatPrice(Number(product.Harga))}
                                                </span>
                                                <span className="text-[10px] text-indigo-500 font-semibold group-hover:underline">
                                                    Detail &rarr;
                                                </span>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}