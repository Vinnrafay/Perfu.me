import Navbar from "@/components/blocks/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card } from "@/components/ui/card";
import {
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  Share2,
  CircleHelp,
  Truck,
  ShieldCheck,
  Wallet,
  Headphones,
  RotateCcw,
  Sparkles,
  Check,
  ShoppingCart,
  ShoppingBag
} from "lucide-react";
import { useState, useRef, UIEvent, useMemo, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { router } from "@inertiajs/react"; // Ditambahkan untuk navigasi

interface ProductSize {
  id?: number;
  product_id?: number;
  Ukuran: number;
  Harga: number;
  Diskon?: number | null;
  Stok: number;
  harga_akhir?: number | null;
}

interface Product {
  id: number;
  nama: string;
  kategori: "EDP" | "EDT" | "EDC";
  gender: "male" | "female" | "unisex";
  Varian: string;
  "Top Note"?: string;
  Top_Note?: string;
  "Middle Note"?: string;
  Middle_Note?: string;
  "Base Note"?: string;
  Base_Note?: string;
  Komposisi: string;
  Kemasan: string | null;
  Ukuran?: number;
  Harga?: number;
  Stok?: number;
  "Tanggal launch"?: string | null;
  Tanggal_launch?: string | null;
  Deskripsi: string;
  Foto: string | null;
  Gallery?: string[] | string;
  BPOM?: string;
  "Best Seller"?: "yes" | "no";
  Best_Seller?: "yes" | "no";
  sizes?: ProductSize[];
}

interface Props {
  product?: Product;
}

const dummyProduct: Product = {
  id: 1,
  nama: "Dynamyst",
  kategori: "EDP",
  gender: "male",
  Varian: "Extrait de Parfum",
  "Top Note": "Bergamot, Grapefruit, Lime",
  "Middle Note": "Lavender, Sea Salt, Green Notes",
  "Base Note": "Musk, Amber, Sandalwood",
  Komposisi: "Alcohol Denat., Parfum, Aqua, Limonene, Linalool",
  Kemasan: "Botol kaca premium + box eksklusif",
  Ukuran: 50,
  Harga: 189000,
  Stok: 24,
  "Tanggal launch": "2026-01-15",
  Deskripsi:
    "Dynamyst hadir untuk mereka yang aktif, percaya diri, dan penuh semangat. Perpaduan aroma fresh, sporty, clean, dengan sentuhan hangat dan manis menciptakan kesan maskulin yang modern, energik, dan mudah diingat.",
  Foto: "/images/FotoEnchancedParfum.svg",
  Gallery: [
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1615397323164-964fa07b4685?auto=format&fit=crop&q=80&w=800",
  ],
  BPOM: "NA18250600809",
  "Best Seller": "yes",
};

const trustBadges = [
  { icon: Truck, label: "Gratis Ongkir" },
  { icon: ShieldCheck, label: "Garansi 100% Original" },
  { icon: Wallet, label: "Pembayaran Fleksibel" },
  { icon: Headphones, label: "Customer Support 24/7" },
  { icon: RotateCcw, label: "Retur Garansi 7 Hari" },
];

export default function ProductDetail({ product = dummyProduct }: Props) {
  const { addToCart } = useCart();

  const availableSizes = useMemo(() => {
    const sizes = Array.isArray(product?.sizes) ? product.sizes : [];

    if (sizes.length > 0) {
      return [...sizes]
        .filter((size) => Number.isFinite(Number(size?.Ukuran)))
        .sort((a, b) => Number(a.Ukuran) - Number(b.Ukuran));
    }

    const legacySize = Number(product?.Ukuran ?? 0);
    const legacyPrice = Number(product?.Harga ?? 0);
    const legacyStock = Number(product?.Stok ?? 0);

    if (!legacySize) {
      return [];
    }

    return [
      {
        Ukuran: legacySize,
        Harga: legacyPrice,
        Diskon: 0,
        Stok: legacyStock,
        harga_akhir: legacyPrice,
      },
    ];
  }, [product]);

  const [selectedSize, setSelectedSize] = useState<number>(() => {
    const firstSize = availableSizes[0];
    return firstSize ? Number(firstSize.Ukuran) : Number(product?.Ukuran ?? 0);
  });
  
  // State qty yang baru, formatnya bisa string sementara pas diketik
  const [qtyInput, setQtyInput] = useState<string>("1"); 
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (!availableSizes.length) return;

    setSelectedSize((current) => {
      const hasCurrentSize = availableSizes.some(
        (size) => Number(size.Ukuran) === Number(current)
      );
      return hasCurrentSize ? Number(current) : Number(availableSizes[0].Ukuran);
    });
  }, [availableSizes]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedSizeData = useMemo(
    () =>
      availableSizes.find((size) => Number(size.Ukuran) === Number(selectedSize)) ??
      availableSizes[0] ??
      null,
    [availableSizes, selectedSize]
  );

  const images = useMemo(() => {
    const resolveImageUrl = (path: string | null | undefined) => {
      if (!path) return null;
      if (path.startsWith("http") || path.startsWith("/images") || path.startsWith("data:")) return path;
      return `/storage/${path}`;
    };

    let parsedGallery: string[] = [];
    if (typeof product.Gallery === 'string') {
        try { parsedGallery = JSON.parse(product.Gallery); } catch(e) {}
    } else if (Array.isArray(product.Gallery)) {
        parsedGallery = product.Gallery;
    }

    return [
      resolveImageUrl(product.Foto),
      ...parsedGallery.map(resolveImageUrl)
    ].filter(Boolean) as string[];
  }, [product.Foto, product.Gallery]);

  const hasMultipleImages = images.length > 1;

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const width = target.clientWidth;
    if (width > 0) {
      const index = Math.round(target.scrollLeft / width);
      setCurrentImgIndex(index);
    }
  };

  const scrollToImage = (index: number) => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: width * index,
        behavior: "smooth",
      });
      setCurrentImgIndex(index);
    }
  };

  const handlePrevImage = () => {
    const nextIdx = currentImgIndex === 0 ? images.length - 1 : currentImgIndex - 1;
    scrollToImage(nextIdx);
  };

  const handleNextImage = () => {
    const nextIdx = (currentImgIndex + 1) % images.length;
    scrollToImage(nextIdx);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.nama,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activePrice = selectedSizeData
    ? Number(selectedSizeData.harga_akhir ?? selectedSizeData.Harga ?? 0)
    : Number(product.Harga ?? 0);
  const activeStock = selectedSizeData
    ? Number(selectedSizeData.Stok ?? 0)
    : Number(product.Stok ?? 0);
  const inStock = activeStock > 0;

  // Logika Quantity: Konversi input string ke number buat kalkulasi keranjang & checkout
  const qtyNumeric = parseInt(qtyInput) || 1;

  useEffect(() => {
    if (!inStock && qtyNumeric > 1) {
      setQtyInput("1");
    } else if (inStock && qtyNumeric > activeStock) {
      setQtyInput(activeStock.toString());
    }
  }, [activeStock, inStock, qtyNumeric]);

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Biarkan kosong jika user lagi nge-backspace habis (biar gak maksa jadi '1' saat ngetik)
    if (val === '') {
      setQtyInput('');
      return;
    }
    const num = parseInt(val);
    if (!isNaN(num) && num > 0) {
      if (num > activeStock) setQtyInput(activeStock.toString());
      else setQtyInput(num.toString());
    }
  };

  const handleQtyBlur = () => {
    // Kalau pas pindah fokus inputnya kosong atau 0, balikin ke 1
    if (qtyInput === '' || parseInt(qtyInput) < 1) {
      setQtyInput("1");
    }
  };

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(activePrice);

  const handleAddToCart = () => {
    if (!inStock || qtyNumeric < 1) return;
    addToCart(
      {
        id: product.id,
        product_size_id: selectedSizeData?.id,
        nama: product.nama,
        Varian: selectedSize ? `${selectedSize}ml` : product.Varian || "-",
        Harga: activePrice,
        Foto: product.Foto,
      },
      qtyNumeric
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Navigasi Checkout ke Halaman Form
  const handleCheckout = () => {
    if (!inStock || qtyNumeric < 1) return;
    router.get('/products/checkout', {
      product_id: product.id,
      ukuran: selectedSize,
      qty: qtyNumeric,
      source: 'direct' // Penanda kalau beli langsung, bukan dari keranjang (opsional)
    });
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center bg-background text-foreground">
        <section className="grid w-full max-w-7xl grid-cols-1 gap-8 px-5 pb-12 lg:grid-cols-12 lg:gap-12 items-start mt-8">

          {/* ... Bagian Gallery dan Info Produk (Sama seperti sebelumnya) ... */}
          <div className="lg:col-span-6 flex flex-col gap-3 w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-muted group">
              <div ref={scrollContainerRef} onScroll={handleScroll} className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth touch-pan-x">
                {images.length > 0 ? (
                  images.map((img, idx) => (
                    <div key={idx} className="relative h-full w-full shrink-0 snap-center overflow-hidden">
                      <img src={img} alt={`${product.nama} - Foto ${idx + 1}`} className="h-full w-full object-cover select-none" draggable={false} />
                    </div>
                  ))
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">Foto belum tersedia</div>
                )}
              </div>
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
                {(product["Best Seller"] === "yes" || product.Best_Seller === "yes") && (
                  <Badge><Sparkles className="w-3 h-3 mr-1" /> Best Seller</Badge>
                )}
              </div>
              {hasMultipleImages && (
                <>
                  <button type="button" onClick={handlePrevImage} className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-md border border-border shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-background"><ChevronLeft className="h-5 w-5" /></button>
                  <button type="button" onClick={handleNextImage} className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-md border border-border shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-background"><ChevronRight className="h-5 w-5" /></button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 z-10 pointer-events-none">
                    {images.map((_, idx) => (
                      <span key={idx} className={`h-1.5 rounded-full transition-all ${currentImgIndex === idx ? "w-4 bg-white" : "w-1.5 bg-white/50"}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            {hasMultipleImages && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory mt-2">
                {images.map((img, idx) => (
                  <button key={idx} type="button" onClick={() => scrollToImage(idx)} className={`relative aspect-square h-14 sm:h-16 shrink-0 snap-center overflow-hidden rounded-xl border transition-all ${currentImgIndex === idx ? "border-primary ring-2 ring-primary/20 scale-[0.98] opacity-100" : "border-border/70 opacity-50 hover:opacity-100"}`}>
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground capitalize">{product.gender} • {product.kategori}</span>
              <h1 className="text-3xl md:text-4xl font-medium tracking-tight capitalize">{product.nama}</h1>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-heading text-foreground">{formattedPrice}</span>
                {product.BPOM && <span className="text-xs text-muted-foreground font-medium">BPOM: {product.BPOM}</span>}
              </div>
            </div>

            <div className="h-px w-full bg-border" />
            <p className="whitespace-pre-line wrap-break-word text-xs sm:text-sm leading-relaxed text-foreground/80 font-normal">{product.Deskripsi}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
              <Card className="p-3 gap-0"><h4 className="text-sm font-medium text-muted-foreground">Top Notes</h4><p className="text-xs font-medium text-foreground mt-1">{product.Top_Note ?? product["Top Note"]}</p></Card>
              <Card className="p-3 gap-0"><h4 className="text-sm font-medium text-muted-foreground">Middle Notes</h4><p className="text-xs font-medium text-foreground mt-1">{product.Middle_Note ?? product["Middle Note"]}</p></Card>
              <Card className="p-3 gap-0"><h4 className="text-sm font-medium text-muted-foreground">Base Notes</h4><p className="text-xs font-medium text-foreground mt-1">{product.Base_Note ?? product["Base Note"]}</p></Card>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span>Ukuran Botol</span>
                <span className="text-muted-foreground">{selectedSize} ML</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.length > 0 ? (
                  availableSizes.map((size) => (
                    <button
                      key={size.id ?? `${size.Ukuran}-${size.Harga}`}
                      type="button"
                      onClick={() => setSelectedSize(Number(size.Ukuran))}
                      className={`rounded-full border px-5 py-2.5 text-sm font-semibold tracking-wider transition-all ${selectedSize === Number(size.Ukuran) ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-background text-foreground hover:bg-muted"}`}
                    >
                      {Number(size.Ukuran)} ML
                    </button>
                  ))
                ) : (
                  <div className="text-sm font-medium text-muted-foreground">Ukuran tidak tersedia</div>
                )}
              </div>
            </div>

            <div className="text-sm text-muted-foreground font-semibold mt-2">
              {inStock ? (
                <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Stok Tersedia ({activeStock} pcs)
                </span>
              ) : (
                <span className="text-destructive">Stok Habis</span>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-center justify-between gap-3">
                
  {/* Quantity Input dengan Border Rapih */}
                <ButtonGroup className="h-12 w-32 shrink-0 border border-border rounded-xl overflow-hidden bg-background shadow-xs">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setQtyInput((q) => (Math.max(1, parseInt(q || "1") - 1)).toString())}
                    className="h-full px-3 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  {/* Input Angka Tengah */}
                  <input
                    type="number"
                    value={qtyInput}
                    onChange={handleQtyChange}
                    onBlur={handleQtyBlur}
                    className="h-full w-full bg-transparent text-center font-semibold text-sm outline-none border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setQtyInput((q) => (Math.min(activeStock, parseInt(q || "0") + 1)).toString())}
                    className="h-full px-3 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </ButtonGroup>

                {/* Checkout CTA */}
                {inStock ? (
                  <Button size="lg" onClick={handleCheckout} className="flex-1 h-12 text-sm shadow-md">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Checkout Sekarang
                  </Button>
                ) : (
                  <Button size="lg" disabled className="flex-1 h-12 text-sm">
                    Stok Habis
                  </Button>
                )}

                {/* Tombol Keranjang */}
                <Button
                  size="icon"
                  variant={added ? "secondary" : "outline"}
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`h-12 w-12 shrink-0 ${added ? "text-emerald-600 border-emerald-200 bg-emerald-50" : ""}`}
                >
                  {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                </Button>

              </div>
            </div>

            <div className="flex items-center gap-6 pt-6 text-sm font-semibold text-muted-foreground border-t border-border mt-2">
              <button type="button" onClick={handleShare} className="flex items-center gap-2 hover:text-foreground transition-colors">
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                {copied ? "Link Tersalin!" : "Bagikan"}
              </button>
              <a href="/contact" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <CircleHelp className="h-4 w-4" /> Ada Pertanyaan?
              </a>
            </div>
          </div>
        </section>

        {/* ... (Trust Badges Section) ... */}
        <section className="w-full max-w-7xl p-5 mt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-border bg-muted/20 p-4 text-left transition-all hover:bg-muted/40">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                  <Icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                </span>
                <span className="text-xs font-semibold text-muted-foreground leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}