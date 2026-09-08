import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import {
    Filter,
    Search,
    RotateCcw,
    Sparkles,
    SlidersHorizontal,
    X,
    ArrowUpDown,
    CheckCircle2,
    RefreshCw,
} from 'lucide-react';
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
import { useCart } from '@/hooks/useCart';

import ProductCard from '@/components/cards/product-card';

export interface ProductSize {
    id?: number;
    Ukuran: number;
    Harga: number;
    Diskon?: number;
    Stok: number;
}

export interface Product {
    id: number;
    nama: string;
    kategori?: string;
    gender: string;
    Varian: string;
    Deskripsi: string;
    Foto: string | null;
    Best_Seller?: string;
    'Best Seller'?: string;
    original?: string;   // 'Original' | 'Refill' — field ini yang nentuin tab, bukan kategori (EDP/EDT/dll)
    signature?: string;
    sizes?: ProductSize[];
}

interface Props {
    products: Product[] | { data: Product[] };
}

const GENDER_OPTIONS = [
    { value: 'male', label: 'Pria' },
    { value: 'female', label: 'Wanita' },
    { value: 'unisex', label: 'Unisex' },
];

function getDefaultSize(product: Product): ProductSize {
    const sizes = product.sizes ?? [];
    if (sizes.length === 0) {
        return { Ukuran: 0, Harga: 0, Diskon: 0, Stok: 0 };
    }
    return [...sizes].sort((a, b) => Number(a.Ukuran) - Number(b.Ukuran))[0];
}

function getPricing(product: Product) {
    const size = getDefaultSize(product);
    const originalPrice = Number(size.Harga) || 0;
    const discountNominal = Number(size.Diskon) || 0;
    const finalPrice = discountNominal > 0 ? originalPrice - discountNominal : originalPrice;
    return { originalPrice, discountNominal, finalPrice, size };
}

// FIX: klasifikasi Original/Refill berdasarkan field `original`, BUKAN `kategori`.
// `kategori` (EDP/EDT/Roll-On/Body Mist) itu jenis parfum, beda konsep sama status original/refill.
function isOriginalType(product: Product): boolean {
    return product.original !== 'Refill';
}

export default function Catalog({ products }: Props) {
    const { addToCart } = useCart();

    const productList = useMemo<Product[]>(() => {
        if (Array.isArray(products)) return products;
        if (products && typeof products === 'object' && 'data' in products && Array.isArray(products.data)) {
            return products.data;
        }
        return [];
    }, [products]);

    const [productType, setProductType] = useState<'original' | 'refill'>('original');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [bestSellerOnly, setBestSellerOnly] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>('default');

    const productsOfCurrentType = useMemo(() => {
        return productList.filter((product) =>
            productType === 'original' ? isOriginalType(product) : !isOriginalType(product)
        );
    }, [productList, productType]);

    const maxDataPrice = 1000000;

    const [priceRange, setPriceRange] = useState<number>(maxDataPrice);

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

    const filteredProducts = useMemo(() => {
        return productsOfCurrentType.filter((product) => {
            const isBestSeller =
                product.Best_Seller === 'yes' || product['Best Seller'] === 'yes';

            const matchSearch =
                !searchTerm ||
                product.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.Varian ?? '').toLowerCase().includes(searchTerm.toLowerCase());

            const matchGender =
                selectedGenders.length === 0 ||
                selectedGenders.includes(product.gender?.toLowerCase());

            const matchBestSeller = !bestSellerOnly || isBestSeller;

            const { finalPrice } = getPricing(product);
            const matchPrice = finalPrice <= priceRange;

            return matchSearch && matchGender && matchBestSeller && matchPrice;
        });
    }, [productsOfCurrentType, searchTerm, selectedGenders, bestSellerOnly, priceRange]);

    const sortedProducts = useMemo(() => {
        const items = [...filteredProducts];
        switch (sortBy) {
            case 'price-asc':
                return items.sort((a, b) => getPricing(a).finalPrice - getPricing(b).finalPrice);
            case 'price-desc':
                return items.sort((a, b) => getPricing(b).finalPrice - getPricing(a).finalPrice);
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

    const formatPrice = (val: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);

    const FilterContent = () => (
        <div className="space-y-6">
            <Accordion type="multiple" defaultValue={['gender', 'harga']} className="w-full space-y-2">
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

                <AccordionItem value="harga" className="border-border border-b-0">
                    <AccordionTrigger className="hover:no-underline text-xs font-bold uppercase tracking-wider text-foreground py-3">
                        Harga Maksimum
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-2 px-1 space-y-4">
                        <Slider
                            max={maxDataPrice}
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
            <section className="relative w-full h-[38vh] min-h-90 flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/images/BannerPageProduct.png"
                        alt="Discover Your Scent"
                        className="w-full h-full object-cover object-center scale-105 filter brightness-90"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-black/50 to-black/30" />
                </div>

                <div className="relative -top-6 z-10 px-6 max-w-3xl mx-auto flex flex-col items-center space-y-1">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight leading-tight">
                        Discover Your <span className="font-heading italic">Scent</span>
                    </h1>
                    <p className="text-muted text-xs sm:text-sm md:text-base font-light leading-relaxed">
                        Eksplorasi wewangian aromatik terpilih untuk melengkapi kepribadian dan persona unikmu.
                    </p>
                </div>
            </section>

            <div className="container max-w-7xl w-full mx-auto px-4 sm:px-6 pt-10 flex flex-col md:flex-row gap-8">

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

                <main className="flex-1 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between w-full">

                        <div className="inline-flex h-10 p-1 bg-muted/40 backdrop-blur-md rounded-xl border border-border/80 items-center gap-1 shrink-0 self-start sm:self-auto">
                            <button
                                type="button"
                                onClick={() => setProductType('original')}
                                className={`flex items-center gap-1.5 px-4 h-8 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                                    productType === 'original'
                                        ? 'bg-background text-foreground shadow-xs border border-border/60'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                                }`}
                            >
                                <CheckCircle2 className={`w-3.5 h-3.5 ${productType === 'original' ? 'text-indigo-500' : 'text-muted-foreground'}`} />
                                Original
                            </button>

                            <button
                                type="button"
                                onClick={() => setProductType('refill')}
                                className={`flex items-center gap-1.5 px-4 h-8 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                                    productType === 'refill'
                                        ? 'bg-background text-foreground shadow-xs border border-border/60'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                                }`}
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${productType === 'refill' ? 'text-indigo-500' : 'text-muted-foreground'}`} />
                                Refill
                            </button>
                        </div>

                        <div className="relative flex-1 w-full min-w-0">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={`Cari ${productType === 'original' ? 'original' : 'refill'}...`}
                                className="pl-10 h-10 w-full text-sm rounded-xl bg-background border-border/80"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 justify-between sm:justify-end">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="md:hidden h-10 text-sm gap-2 rounded-xl px-4"
                                    >
                                        <SlidersHorizontal className="w-4 h-4" />
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

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-10 w-[150px] text-sm rounded-xl bg-background border-border/80">
                                    <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    <SelectItem value="default" className="text-sm">Terbaru</SelectItem>
                                    <SelectItem value="best-seller" className="text-sm">Best Seller</SelectItem>
                                    <SelectItem value="price-asc" className="text-sm">Harga: Rendah ke Tinggi</SelectItem>
                                    <SelectItem value="price-desc" className="text-sm">Harga: Tinggi ke Rendah</SelectItem>
                                    <SelectItem value="name-asc" className="text-sm">Nama: A - Z</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

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

                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-1">
                        Menampilkan <span className="text-foreground font-bold">{sortedProducts.length}</span> produk {productType}
                    </div>

                    {sortedProducts.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-card/30 gap-3 text-center px-4">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-1">
                                <Search className="w-6 h-6 text-muted-foreground/60" />
                            </div>
                            <h3 className="font-semibold text-foreground text-base">
                                Produk {productType === 'original' ? 'Original' : 'Refill'} Tidak Ditemukan
                            </h3>
                            <p className="text-muted-foreground font-normal text-xs max-w-sm">
                                Coba ubah kata kunci pencarian atau bersihkan filter untuk menampilkan produk lainnya.
                            </p>
                            <Button variant="outline" size="sm" onClick={resetFilter} className="mt-2 text-xs rounded-xl">
                                Bersihkan Filter
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedProducts.map((product) => {
                                const { finalPrice, size } = getPricing(product);

                                return (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        formatPrice={formatPrice}
                                        onAddToCart={() => addToCart({
                                            id: product.id,
                                            nama: product.nama,
                                            Varian: size.Ukuran ? `${size.Ukuran}ml` : (product.Varian || '-'),
                                            Harga: finalPrice,
                                            Foto: product.Foto,
                                        })}
                                    />
                                );
                            })}
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}