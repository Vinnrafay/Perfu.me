import Navbar from "@/components/blocks/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import WhatsAppIcon from "@/components/whatsapp-icon";
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
  "Top Note"?: string;
  Top_Note?: string;
  "Middle Note"?: string;
  Middle_Note?: string;
  "Base Note"?: string;
  Base_Note?: string;
  Komposisi: string;
  Kemasan: string | null;
  Ukuran: number;
  Harga: number;
  Stok: number;
  "Tanggal launch"?: string | null;
  Tanggal_launch?: string | null;
  Deskripsi: string;
  Foto: string | null;
  Gallery?: string[];
  BPOM?: string;
  "Best Seller"?: "yes" | "no";
  Best_Seller?: "yes" | "no";
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

      <main className="flex min-h-screen flex-col items-center bg-background text-foreground">

        {/* Product Main Container */}
        <section className="grid w-full max-w-7xl grid-cols-1 gap-8 px-5 pb-12 lg:grid-cols-12 lg:gap-12 items-start">

          {/* Gallery View */}
          <div className="lg:col-span-6 flex flex-col gap-3 w-full max-w-md mx-auto lg:max-w-none">

            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-muted group">

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
                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                    Foto belum tersedia
                  </div>
                )}
              </div>

              {/* Floating Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
                {(product["Best Seller"] === "yes" || product.Best_Seller === "yes") && (
                  <Badge>
                    <Sparkles /> Best Seller
                  </Badge>
                )}
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
                        className={`h-1.5 rounded-full transition-all ${currentImgIndex === idx
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
                    className={`relative aspect-square h-14 shrink-0 overflow-hidden rounded-xl border transition-all ${currentImgIndex === idx
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
              <span className="text-sm font-medium text-muted-foreground capitalize">
                {product.gender} • {product.kategori}
              </span>
              <h1 className="text-3xl md:text-4xl font-medium tracking-tight capitalize">
                {product.nama}
              </h1>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-heading text-foreground">
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Card className="p-3 gap-0">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Top Notes
                </h4>
                <p className="text-xs font-medium text-foreground">{product.Top_Note ?? product["Top Note"]}</p>
              </Card>
              <Card className="p-3 gap-0">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Middle Notes
                </h4>
                <p className="text-xs font-medium text-foreground">{product.Middle_Note ?? product["Middle Note"]}</p>
              </Card>
              <Card className="p-3 gap-0">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Base Notes
                </h4>
                <p className="text-xs font-medium text-foreground">{product.Base_Note ?? product["Base Note"]}</p>
              </Card>
            </div>


            {/* Size Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span>Ukuran Botol</span>
                <span className="text-muted-foreground">{selectedSize} ML</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-xl border px-4 py-2 text-xs font-semibold tracking-wider transition-all ${selectedSize === size
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
              <div className="flex items-center justify-between gap-3">
                {/* Quantity Selector Row */}
                <ButtonGroup>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="bg-background"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <ButtonGroupText className="bg-background">
                    {qty}
                  </ButtonGroupText>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQty((q) => q + 1)}
                    className="bg-background"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </ButtonGroup>

                {/* WhatsApp CTA Button */}
                {inStock ? (
                  <Button
                    size="lg"
                    onClick={() => window.open(`https://wa.me/6281383415432?text=${waMessage}`, '_blank')}
                    className="flex-1"
                  >
                    <WhatsAppIcon />
                    Pesan via WhatsApp
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    disabled
                    className="flex-1"
                  >
                    Stok Habis
                  </Button>
                )}
              </div>
            </div>

            {/* Utility Links */}
            <div className="flex items-center gap-6 pt-6 text-xs font-semibold text-muted-foreground border-t border-border">
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
        <section className="w-full max-w-7xl p-5">
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
      </main>
    </>
  );
}