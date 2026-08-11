import Navbar from "@/components/blocks/navbar";
import { Badge } from "@/components/ui/badge";
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
  MessageSquare,
  Sparkles,
  Check,
} from "lucide-react";
import { useState, useRef, UIEvent } from "react";

interface Product {
  id: number;
  nama: string;
  kategori: "EDP" | "EDT" | "Roll-On" | "Body Mist";
  gender: "male" | "female" | "unisex";
  Varian: string;
  "Top Note": string;
  "Middle Note": string;
  "Base Note": string;
  Komposisi: string;
  Kemasan: string | null;
  Ukuran: number;
  Harga: number;
  Stok: number;
  "Tanggal launch": string | null;
  Deskripsi: string;
  Foto: string | null;
  Gallery?: string[];
  BPOM?: string;
  "Best Seller": "yes" | "no";
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

const sizeOptions = [30, 50, 100];

const trustBadges = [
  { icon: Truck, label: "Gratis Ongkir" },
  { icon: ShieldCheck, label: "Garansi 100% Original" },
  { icon: Wallet, label: "Pembayaran Fleksibel" },
  { icon: Headphones, label: "Customer Support 24/7" },
  { icon: RotateCcw, label: "Retur Garansi 7 Hari" },
];

export default function ProductDetail({ product = dummyProduct }: Props) {
  const [selectedSize, setSelectedSize] = useState(product.Ukuran);
  const [qty, setQty] = useState(1);
  const [copied, setCopied] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const images: string[] = [
    product.Foto
      ? product.Foto.startsWith("http") || product.Foto.startsWith("/images")
        ? product.Foto
        : `/storage/${product.Foto}`
      : null,
    ...(product.Gallery || []),
  ].filter(Boolean) as string[];

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

  const inStock = product.Stok > 0;

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.Harga);

  const waMessage = encodeURIComponent(
    `Halo Perfu.me, saya ingin memesan ${product.nama} (${product.Varian}, ${selectedSize}ml) sebanyak ${qty} pcs.`
  );

  return (
    <>
      <Navbar />

      <main className="flex min-h-screen flex-col items-center bg-background text-foreground pt-20 sm:pt-24 pb-16">
        
        {/* Breadcrumb */}
        <div className="flex w-full max-w-6xl items-center gap-2 px-5 pb-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors">
            Home
          </a>
          <ChevronRight className="h-3.5 w-3.5" />
          <a href="/products" className="hover:text-foreground transition-colors">
            {product.kategori} Collection
          </a>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-foreground font-bold">
            {product.nama}
          </span>
        </div>

        {/* Product Main Container */}
        <section className="grid w-full max-w-6xl grid-cols-1 gap-8 px-5 pb-12 lg:grid-cols-12 lg:gap-12 items-start">
          
          {/* Gallery View */}
          <div className="lg:col-span-6 flex flex-col gap-3 w-full max-w-md mx-auto lg:max-w-none">
            
            <div className="relative aspect-[4/5] w-full max-h-[460px] sm:max-h-[520px] overflow-hidden rounded-2xl border border-border bg-muted/20 shadow-sm group">
              
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth touch-pan-x"
              >
                {images.length > 0 ? (
                  images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative h-full w-full flex-shrink-0 snap-center overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={`${product.nama} - Foto ${idx + 1}`}
                        className="h-full w-full object-cover select-none"
                        draggable={false}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Foto belum tersedia
                  </div>
                )}
              </div>

              {/* Floating Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
                {product["Best Seller"] === "yes" && (
                  <Badge className="bg-foreground text-background font-semibold uppercase text-[11px] tracking-wider px-2.5 py-0.5 shadow-sm">
                    <Sparkles className="h-3 w-3 mr-1" /> Best Seller
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-background/90 backdrop-blur-md border border-border text-foreground uppercase text-[11px] tracking-wider px-2.5 py-0.5 font-semibold">
                  {product.kategori}
                </Badge>
              </div>

              {/* Desktop Arrow Controls */}
              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-md border border-border shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-background"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-md border border-border shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-background"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 z-10 pointer-events-none">
                    {images.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-1.5 rounded-full transition-all ${
                          currentImgIndex === idx
                            ? "w-4 bg-white"
                            : "w-1.5 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {hasMultipleImages && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToImage(idx)}
                    className={`relative aspect-square h-14 shrink-0 overflow-hidden rounded-xl border transition-all ${
                      currentImgIndex === idx
                        ? "border-primary ring-2 ring-primary/20 scale-95 opacity-100"
                        : "border-border/70 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Actions */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                {product.gender} • {product.Varian}
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight capitalize">
                {product.nama}
              </h1>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">
                  {formattedPrice}
                </span>
                {product.BPOM && (
                  <span className="text-xs text-muted-foreground font-medium">
                    BPOM: {product.BPOM}
                  </span>
                )}
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            <p className="text-xs sm:text-sm leading-relaxed text-foreground/80 font-normal">
              {product.Deskripsi}
            </p>

            {/* Piramida Aroma */}
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Piramida Aroma
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="flex flex-col gap-0.5 rounded-lg bg-background p-2.5 border border-border/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Top Notes
                  </span>
                  <span className="text-xs font-semibold text-foreground">{product["Top Note"]}</span>
                </div>
                <div className="flex flex-col gap-0.5 rounded-lg bg-background p-2.5 border border-border/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Middle Notes
                  </span>
                  <span className="text-xs font-semibold text-foreground">{product["Middle Note"]}</span>
                </div>
                <div className="flex flex-col gap-0.5 rounded-lg bg-background p-2.5 border border-border/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Base Notes
                  </span>
                  <span className="text-xs font-semibold text-foreground">{product["Base Note"]}</span>
                </div>
              </div>
            </div>

            {/* Size Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                <span>Ukuran Botol</span>
                <span className="text-muted-foreground">{selectedSize} ML</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-xl border px-4 py-2 text-xs font-semibold tracking-wider transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {size} ML
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="text-xs text-muted-foreground font-semibold">
              {inStock ? (
                <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Stok Tersedia ({product.Stok} pcs)
                </span>
              ) : (
                <span className="text-destructive">Stok Habis</span>
              )}
            </div>

            {/* Quantity Counter + WhatsApp Button (Mobile Responsive Fix) */}
            <div className="flex flex-col gap-3 pt-1">
              
              {/* Quantity Selector Row */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Jumlah
                </span>
                <div className="flex h-10 items-center justify-between rounded-xl border border-border bg-background px-3 w-32">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs font-bold">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* WhatsApp CTA Button */}
              {inStock ? (
                <a
                  href={`https://wa.me/6281383415432?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 inline-flex items-center justify-center gap-2.5 rounded-xl bg-primary px-6 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:opacity-90 active:scale-[0.99] shadow-sm"
                >
                  <MessageSquare className="h-4 w-4" />
                  Pesan via WhatsApp
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full h-12 cursor-not-allowed rounded-xl bg-muted px-6 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Stok Habis
                </button>
              )}
            </div>

            {/* Utility Links */}
            <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-muted-foreground border-t border-border">
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                {copied ? "Link Tersalin!" : "Bagikan"}
              </button>
              <a
                href="/contact"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <CircleHelp className="h-4 w-4" />
                Ada Pertanyaan?
              </a>
            </div>

          </div>
        </section>

        {/* Trust Badges */}
        <section className="w-full max-w-6xl px-5 py-10 border-t border-border">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-border bg-muted/20 p-3.5 text-left transition-all hover:bg-muted/40"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                  <Icon className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                </span>
                <span className="text-xs font-semibold text-muted-foreground leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Footer Strip */}
        <section className="w-full border-t border-border bg-muted/30 px-5 py-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-2xl font-semibold tracking-tight">
                PERFU.ME
              </span>
              <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-muted-foreground font-normal">
                Brand parfum lokal yang menghadirkan aroma berkarakter dengan
                kualitas yang terasa premium dan harga yang tetap terjangkau —
                Wangi Gak Harus Mahal.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-xs sm:text-sm">
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-foreground">Inquiries</span>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Return &amp; Refund</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Shipping Information</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-foreground">Customer Care</span>
                <a
                  href="https://wa.me/6281383415432"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reach us on WhatsApp
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-foreground">Get Exclusive Offers</span>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Ikuti Instagram kami <span className="font-semibold text-foreground">@perfu.mefragrance</span> untuk info promo &amp; restock.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}