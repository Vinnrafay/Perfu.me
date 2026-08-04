import Navbar from "@/components/blocks/navbar";
import {
  ChevronRight,
  Minus,
  Plus,
  Share2,
  CircleHelp,
  Truck,
  ShieldCheck,
  Wallet,
  Headphones,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

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

// ⚠️ DUMMY DATA — hapus/ganti begitu controller sudah kirim data asli lewat props
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
  Foto: null,
  Gallery: [],
  BPOM: "NA18250600809",
  "Best Seller": "yes",
};

const sizeOptions = [50, 100];

const trustBadges = [
  { icon: Truck, label: "Gratis Ongkir" },
  { icon: ShieldCheck, label: "Garansi Uang Kembali" },
  { icon: Wallet, label: "Pembayaran Fleksibel" },
  { icon: Headphones, label: "Customer Support" },
  { icon: RotateCcw, label: "Retur dalam 7 Hari" },
];

export default function ProductDetail({ product = dummyProduct }: Props) {
  const [selectedSize, setSelectedSize] = useState(product.Ukuran);
  const [qty, setQty] = useState(1);

  const inStock = product.Stok > 0;

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.Harga);

  const photoUrl = product.Foto ? `/storage/${product.Foto}` : null;
  const galleryImages = product.Gallery && product.Gallery.length > 0
    ? product.Gallery
    : [];

  const waMessage = encodeURIComponent(
    `Halo Perfu.me, saya mau pesan ${product.nama} (${product.Varian}, ${selectedSize}ml) sebanyak ${qty} pcs.`
  );

  return (
    <>
      <Navbar />

      {/* Dummy data banner — hapus setelah data asli terhubung */}
      <div className="w-full bg-destructive/10 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-destructive">
        Preview — masih pakai data dummy
      </div>

      <main className="flex min-h-screen flex-col items-center bg-background text-foreground">
        {/* Breadcrumb */}
        <div className="flex w-full max-w-7xl items-center gap-2 px-5 py-6 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">Home</a>
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          <a href="/products" className="hover:text-foreground">
            {product.kategori} Collection
          </a>
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span className="truncate text-foreground">
            {product.nama} — {product.Varian}
          </span>
        </div>

        {/* Product hero */}
        <section className="grid w-full max-w-7xl grid-cols-1 gap-12 px-5 pb-16 sm:grid-cols-2">
          {/* Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={product.nama}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Foto belum tersedia
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(galleryImages.length > 0 ? galleryImages : [null, null]).map(
                (src, i) => (
                  <div
                    key={i}
                    className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-muted"
                  >
                    {src ? (
                      <img
                        src={src}
                        alt={`${product.nama} ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Foto {i + 1}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            {product["Best Seller"] === "yes" && (
              <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
                Best Seller
              </span>
            )}
            {!inStock && (
              <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Sold Out
              </span>
            )}

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              {product.nama} — {product.Varian}
            </h1>

            <p className="text-2xl font-semibold">{formattedPrice}</p>

            <p className="leading-relaxed text-muted-foreground">
              {product.Deskripsi}
            </p>

            <div className="flex flex-col gap-1.5 border-t border-border pt-5 text-sm">
              <p>
                <span className="font-medium">Top Notes:</span>{" "}
                <span className="text-muted-foreground">{product["Top Note"]}</span>
              </p>
              <p>
                <span className="font-medium">Middle Notes:</span>{" "}
                <span className="text-muted-foreground">{product["Middle Note"]}</span>
              </p>
              <p>
                <span className="font-medium">Base Notes:</span>{" "}
                <span className="text-muted-foreground">{product["Base Note"]}</span>
              </p>
            </div>

            {product.BPOM && (
              <p className="text-sm text-muted-foreground">
                No. BPOM: {product.BPOM}
              </p>
            )}

            <p className="text-sm text-muted-foreground">
              {inStock ? `Stok tersedia (${product.Stok})` : "Stok habis"}
            </p>

            {/* Size selector */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">
                Ukuran: {selectedSize}ml
              </span>
              <div className="flex flex-wrap gap-3">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {product.Varian} {size}ml
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + CTA */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-4 rounded-full border border-border px-4 py-2">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Kurangi jumlah"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Minus className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <span className="w-4 text-center text-sm">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Tambah jumlah"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>

              {inStock ? (
                <a
                  href={`https://wa.me/6281383415432?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full bg-primary px-8 py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Pesan via WhatsApp
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex-1 cursor-not-allowed rounded-full bg-muted px-8 py-3 text-center text-sm font-semibold text-muted-foreground"
                >
                  Sold Out
                </button>
              )}
            </div>

            <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
              <button type="button" className="flex items-center gap-2 hover:text-foreground">
                <Share2 className="h-4 w-4" strokeWidth={1.5} />
                Share
              </button>
              <a
                href="/contact"
                className="flex items-center gap-2 hover:text-foreground"
              >
                <CircleHelp className="h-4 w-4" strokeWidth={1.5} />
                Ask a question
              </a>
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="flex w-full max-w-7xl flex-wrap items-center justify-center gap-4 border-t border-border px-5 py-10 sm:justify-between">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border">
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </span>
              {label}
            </div>
          ))}
        </section>

        {/* Brand footer strip */}
        <section className="w-full border-t border-border bg-muted px-5 py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-10">
            <div className="flex flex-col gap-3">
              <span className="text-2xl font-semibold tracking-tight">
                PERFU.ME
              </span>
              <p className="max-w-xl text-muted-foreground">
                Brand parfum lokal yang menghadirkan aroma berkarakter dengan
                kualitas yang terasa premium dan harga yang tetap terjangkau —
                Wangi Gak Harus Mahal.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Inquiries</span>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Return &amp; Refund</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Shipping</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Customer Care</span>
                <a
                  href="https://wa.me/6281383415432"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Reach us on WhatsApp
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Get Exclusive Offers</span>
                <p className="text-sm text-muted-foreground">
                  Ikuti Instagram kami @perfu.mefragrance untuk info promo &amp; restock.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}