import { Banknote, Landmark, Wallet, MapPin, ReceiptText, ShoppingBag, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";

// Struktur data item dinamis dari backend/props
export interface CheckoutItem {
    id?: number;
    nama: string;
    Varian?: string;
    Harga: number;
    qty?: number;
    quantity?: number;
    Foto?: string | null;
}

interface Props {
    initialItems?: CheckoutItem[];
    source?: string;
}

const paymentMethods = [
    { value: "bank-transfer", label: "Transfer Bank", icon: Landmark },
    { value: "e-wallet", label: "E-Wallet/QRIS", icon: Wallet },
    { value: "cod", label: "Cash on Delivery", icon: Banknote },
] as const;

type PaymentMethod = (typeof paymentMethods)[number]["value"];

// Helper Format Rupiah
const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);
};

// Komponen Card Item Dinamis
function ProductCard({ nama, Varian, Harga, qty, quantity, Foto }: CheckoutItem) {
    const totalQty = qty ?? quantity ?? 1;
    return (
        <div className="flex gap-4 w-full items-center">
            <div className="h-14 w-14 shrink-0 rounded-xl border border-border bg-muted/30 flex items-center justify-center overflow-hidden">
                {Foto ? (
                    <img src={Foto.startsWith('http') ? Foto : `/storage/${Foto}`} alt={nama} className="h-full w-full object-cover" />
                ) : (
                    <ShoppingBag className="h-5 w-5 text-muted-foreground/50" />
                )}
            </div>
            <div className="flex flex-col flex-1 justify-center min-w-0">
                <h5 className="text-sm font-semibold text-foreground truncate">
                    {nama} {Varian ? `(${Varian})` : ''}
                </h5>
                <span className="text-xs text-muted-foreground mt-0.5">
                    {totalQty} Pcs | {formatRupiah(Harga)}
                </span>
            </div>
            <div className="flex flex-col justify-center items-end shrink-0">
                <span className="text-sm font-bold text-foreground">
                    {formatRupiah(Harga * totalQty)}
                </span>
            </div>
        </div>
    );
}

// Komponen Utama
export default function CheckoutForm({ initialItems = [], source = 'cart' }: Props) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank-transfer");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Ambil data dari hook keranjang
    const { cart } = useCart() as { cart?: CheckoutItem[] };

    // Tentukan item yang akan dirender: Kalau source 'direct' pakai dari props backend, kalau bukan pakai dari keranjang
    const items = source === 'direct' ? initialItems : (cart || []);

    // Kalkulasi Dinamis
    const totalQuantity = items.reduce((total, item) => total + Number(item.qty ?? item.quantity ?? 1), 0);
    const totalPrice = items.reduce((total, item) => total + (Number(item.Harga) * Number(item.qty ?? item.quantity ?? 1)), 0);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const selectedPaymentMethod = paymentMethods.find(({ value }) => value === paymentMethod);

        const productDetails = items
            .map((item, index) => {
                const itemQty = item.qty ?? item.quantity ?? 1;
                const subtotal = item.Harga * itemQty;
                return `${index + 1}. *${item.nama}* ${item.Varian ? `(${item.Varian})` : ''}\n   - ${itemQty} pcs x ${formatRupiah(item.Harga)} = *${formatRupiah(subtotal)}*`;
            })
            .join("\n\n");

        const message = `Halo Admin Perfu.me, saya ingin melakukan pemesanan.

*DETAIL PEMESANAN*
Nama             : *${formData.get("name")}*
No. WhatsApp  : *${formData.get("phone")}*
Alamat           : ${formData.get("address")}
Metode Pembayaran : *${selectedPaymentMethod?.label ?? "-"}*
Catatan          : ${formData.get("note") || "-"}

*DAFTAR PESANAN*
${productDetails}

*RINGKASAN*
Total Barang     : *${totalQuantity} pcs*
Total Pembayaran : *${formatRupiah(totalPrice)}*

Mohon informasi selanjutnya untuk proses pembayaran dan pengiriman. Terima kasih!`;

        const waNumber = "6281383415432";
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, "_blank");

        setTimeout(() => setIsSubmitting(false), 1000);
    }

    return (
        <div className="relative max-w-7xl mx-auto flex flex-col gap-6 px-5 py-10">
            <div>
                <h1 className="text-3xl font-medium tracking-tight text-foreground">Checkout Pesanan</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Lengkapi detail pengiriman dan pilih metode pembayaran di bawah ini.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">

                {/* Form Kiri */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-muted-foreground" />
                                Informasi Pengiriman
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap <span className="text-destructive">*</span></Label>
                                    <Input id="name" name="name" autoComplete="name" placeholder="Budi Santoso" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">No. WhatsApp <span className="text-destructive">*</span></Label>
                                    <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="081234567890" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Alamat Lengkap <span className="text-destructive">*</span></Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos..."
                                    rows={3}
                                    className="resize-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="note">Catatan Tambahan (Opsional)</Label>
                                <Input id="note" name="note" placeholder="Contoh: Patokan rumah warna pagar hitam" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-muted-foreground" />
                                Metode Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {paymentMethods.map(({ value, label, icon: Icon }) => (
                                    <label
                                        key={value}
                                        className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === value
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-border hover:bg-muted/50 text-muted-foreground"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value={value}
                                            checked={paymentMethod === value}
                                            onChange={() => setPaymentMethod(value)}
                                            className="sr-only"
                                        />
                                        <Icon className={`w-6 h-6 mb-2 ${paymentMethod === value ? "text-primary" : ""}`} />
                                        <span className="text-xs font-semibold text-center">{label}</span>

                                        {paymentMethod === value && (
                                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                                        )}
                                    </label>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ringkasan Pesanan Dinamis Kanan */}
                <div className="lg:col-span-5 relative h-full">
                    <div className="sticky top-20 space-y-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ReceiptText className="w-5 h-5 text-muted-foreground" />
                                    Ringkasan Pesanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {items.length === 0 ? (
                                    <div className="text-center py-8 text-sm text-muted-foreground flex flex-col items-center gap-2">
                                        <ShoppingBag className="w-8 h-8 opacity-20" />
                                        <span>Tidak ada produk yang di-checkout.</span>
                                    </div>
                                ) : (
                                    /* Kontainer list produk dengan border rapi & rapat ke atas */
                                    <div className="flex flex-col gap-3">
                                        {items.map((item, index) => {
                                            const normalizedItem = {
                                                ...item,
                                                qty: item.qty ?? item.quantity ?? 1
                                            };
                                            return <ProductCard key={index} {...normalizedItem} />;
                                        })}
                                    </div>
                                )}

                                <div className="h-px w-full bg-border border-dashed my-5" />

                                <div className="space-y-2.5 text-sm">
                                    <div className="flex justify-between text-muted-foreground">
                                        <h4>Jumlah Barang</h4>
                                        <span className="font-medium text-foreground">
                                            {totalQuantity} Pcs
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground items-center w-full">
                                        <h4>Total Pembayaran</h4>
                                        <span className="font-medium text-foreground">
                                            {formatRupiah(totalPrice)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter>
                                <div className="w-full space-y-4">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full"
                                        disabled={isSubmitting || items.length === 0}
                                    >
                                        {isSubmitting ? "Memproses..." : (
                                            <div className="flex items-center justify-center gap-2">
                                                Kirim Pesanan via WhatsApp
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>

                        <p className="max-w-xs mx-auto text-xs text-center text-muted-foreground">
                            Dengan melanjutkan, pesanan Anda akan diarahkan menuju kontak WhatsApp untuk proses konfirmasi.
                        </p>
                    </div>
                </div>

            </form>
        </div>
    );
}