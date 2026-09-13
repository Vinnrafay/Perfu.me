import { Link } from '@inertiajs/react';
import { Button } from "../ui/button";
import { Star, Sparkles } from "lucide-react";
import { Badge } from '../ui/badge';

interface CartPayload {
    id: number;
    nama: string;
    Varian: string;
    Harga: number;
    Foto: string | null;
}

interface ProductCardProps {
    product: any;
    formatPrice: (val: number) => string;
    onAddToCart: (item: CartPayload) => void;
}

export default function ProductCard({ product, formatPrice, onAddToCart }: ProductCardProps) {
    // AMBIL SEMUA UKURAN DARI RELASI 'sizes', diurutin dari kecil ke besar
    const allSizes = product.sizes && product.sizes.length > 0
        ? [...product.sizes].sort((a: any, b: any) => Number(a.Ukuran) - Number(b.Ukuran))
        : [];

    // Size yang dipakai buat hitung harga & diskon di card (default: yang pertama/termurah)
    const defaultSize = allSizes[0] || { Harga: 0, Diskon: 0, Stok: 0, Ukuran: '' };

    // Logika Harga & Diskon
    const originalPrice = Number(defaultSize.Harga) || 0;
    const discountNominal = Number(defaultSize.Diskon) || 0;
    const hasDiscount = discountNominal > 0;
    const finalPrice = hasDiscount ? originalPrice - discountNominal : originalPrice;

    // Logika Stok & Status (dipakai buat disable + label tombol, gak ditampilin ke user selama belum sold out)
    const stockCount = Number(defaultSize.Stok) || 0;
    const isSoldOut = stockCount <= 0;

    // Label ukuran dinamis, contoh: "50ml, 75ml, 100ml"
    const sizeLabel = allSizes.length > 0
        ? allSizes.map((s: any) => `${Number(s.Ukuran)}ml`).join(', ')
        : '';

    const isBestSeller = product.Best_Seller === 'yes' || product['Best Seller'] === 'yes';
    const isSignature = product.signature === 'yes';

    // Bangun data yang dikirim ke cart di sini, langsung dari size & harga yang udah dihitung.
    // Ini yang tadinya bikin harga masuk sebagai 0 — sekarang finalPrice dikirim eksplisit.
    const handleAddToCart = () => {
        if (isSoldOut) return;

        onAddToCart({
            id: product.id,
            nama: product.nama,
            Varian: defaultSize.Ukuran ? `${defaultSize.Ukuran}ml` : (product.Varian || '-'),
            Harga: finalPrice,
            Foto: product.Foto ?? null,
        });
    };

    return (
        <div className="group relative flex flex-col gap-3 h-full bg-card rounded-3xl p-3 border hover:shadowsm hover:-translate-y-1 transition-all duration-300 ease-out">

            {/* AREA GAMBAR */}
            <Link href={`/products/${product.id}`} className="relative aspect-square bg-muted rounded-3xl overflow-hidden block">

                {isSoldOut ? (
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                        <Badge>
                            Sold Out
                        </Badge>
                    </div>
                ) : (
                    <>
                        {/* Kiri: Hemat */}
                        <div className="absolute top-3 left-3 z-10 pointer-events-none">
                            {hasDiscount && (
                                <Badge>
                                    Hemat {formatPrice(discountNominal)}
                                </Badge>
                            )}
                        </div>

                        {/* Kanan: Best Seller & Signature */}
                        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
                            {isBestSeller && (
                                <Badge variant="secondary">
                                    <Sparkles className="w-3 h-3" /> Best Seller
                                </Badge>
                            )}
                        </div>
                    </>
                )}

                {product.Foto ? (
                    <img
                        src={`/storage/${product.Foto}`}
                        alt={product.nama}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 mix-blend-multiply"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-medium">
                        No Image
                    </div>
                )}
            </Link>

            {/* AREA KONTEN - flex-1 + justify-between biar tombol selalu nempel bawah,
                jadi gap-nya konsisten walau judul produk ada yang 1 baris ada yang 2 baris */}
            <div className="flex flex-col gap-3 flex-1 justify-between">

                {/* Kategori, Judul, & Harga */}
                <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                            {product.kategori || product.brand || 'EDP'}
                        </span>
                        {sizeLabel && (
                            <span className="text-[12px] font-medium text-muted-foreground text-right">
                                {sizeLabel}
                            </span>
                        )}
                    </div>

                    <Link href={`/products/${product.id}`}>
                        <h3 className="text-lg font-semibold leading-snug line-clamp-2">
                            {product.nama}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-2">
                        {hasDiscount ? (
                            <>
                                <span className="font-medium text-[16px]">
                                    {formatPrice(finalPrice)}
                                </span>
                                <span className="text-muted-foreground line-through font-medium text-[12px]">
                                    {formatPrice(originalPrice)}
                                </span>
                            </>
                        ) : (
                            <span className="font-medium text-[16px]">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Tombol Buy Now - selalu nempel bawah card */}
                <Button
                    onClick={handleAddToCart}
                    disabled={isSoldOut}
                >
                    {isSoldOut ? 'Sold Out' : 'Tambah ke Keranjang'}
                </Button>
            </div>
        </div>
    );
}