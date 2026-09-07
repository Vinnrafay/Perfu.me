import { Link } from '@inertiajs/react';
import { Button } from "../ui/button";
import { Star, Sparkles } from "lucide-react";

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
        <div className="group relative flex flex-col h-full bg-white rounded-[2rem] p-3 border border-neutral-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out">

            {/* AREA GAMBAR */}
            <Link href={`/products/${product.id}`} className="relative aspect-square sm:aspect-[4/5] bg-[#f4f5f7] rounded-[1.5rem] overflow-hidden block">

                {isSoldOut ? (
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                        <span className="inline-flex items-center justify-center bg-neutral-900/90 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-[11px] font-semibold">
                            Sold Out
                        </span>
                    </div>
                ) : (
                    <>
                        {/* Kiri: Hemat */}
                        <div className="absolute top-3 left-3 z-10 pointer-events-none">
                            {hasDiscount && (
                                <span className="inline-flex items-center justify-center bg-neutral-900 text-white px-2.5 py-1.5 rounded-full text-[11px] font-medium shadow-2xs leading-none">
                                    Hemat {formatPrice(discountNominal)}
                                </span>
                            )}
                        </div>

                        {/* Kanan: Best Seller & Signature */}
                        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
                            {isBestSeller && (
                                <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-neutral-700 px-3.5 py-1.5 rounded-full text-[11px] font-semibold border border-neutral-200 shadow-2xs">
                                    <Sparkles className="w-3 h-3" /> Best Seller
                                </span>
                            )}
                            {isSignature && (
                                <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-neutral-900 px-3.5 py-1.5 rounded-full text-[11px] font-semibold border border-neutral-200 shadow-2xs">
                                    <Star className="w-3 h-3 fill-neutral-900" /> Signature
                                </span>
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
            <div className="flex flex-col flex-1 px-2 pb-2 mt-3 justify-between">

                {/* Kategori, Judul, & Harga */}
                <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wide">
                            {product.kategori || product.brand || 'EDP'}
                        </span>
                        {sizeLabel && (
                            <span className="text-[12px] font-medium text-neutral-400 text-right">
                                {sizeLabel}
                            </span>
                        )}
                    </div>

                    <Link href={`/products/${product.id}`}>
                        <h3 className="text-[18px] font-extrabold text-neutral-900 leading-snug line-clamp-2">
                            {product.nama}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-2">
                        {hasDiscount ? (
                            <>
                                <span className="text-neutral-900 font-bold text-[16px]">
                                    {formatPrice(finalPrice)}
                                </span>
                                <span className="text-neutral-400 line-through font-medium text-[12px]">
                                    {formatPrice(originalPrice)}
                                </span>
                            </>
                        ) : (
                            <span className="text-neutral-900 font-bold text-[16px]">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Tombol Buy Now - selalu nempel bawah card */}
                <Button
                    onClick={handleAddToCart}
                    disabled={isSoldOut}
                    className="w-full bg-[#2a2a2a] hover:bg-black text-white rounded-full h-[44px] text-[13px] font-medium transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-3"
                >
                    {isSoldOut ? 'Sold Out' : 'Buy Now'}
                </Button>
            </div>
        </div>
    );
}