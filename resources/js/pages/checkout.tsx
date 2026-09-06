import { Banknote, Landmark, Wallet } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Product = {
    image: string;
    name: string;
    quantity: number;
    productPrice: number;
};

const products: Product[] = [
    {
        image: "",
        name: "Evanessence",
        quantity: 2,
        productPrice: 50000,
    },
];

const paymentMethods = [
    { value: "bank-transfer", label: "Transfer Bank", icon: Landmark },
    { value: "e-wallet", label: "E-Wallet/QRIS", icon: Wallet },
    { value: "cod", label: "COD", icon: Banknote },
] as const;

type PaymentMethod = (typeof paymentMethods)[number]["value"];

type ProductCardProps = Product;

function ProductCard({ image, name, productPrice, quantity }: ProductCardProps) {
    return (
        <div className="flex justify-between items-center gap-6 w-full">
            <div className="flex items-center gap-3">
                <img src={image} alt="" className="bg-muted w-16 h-16 rounded-xl border" />
                <div className="font-medium">
                    <h5 className="text-base">
                        {name}
                    </h5>
                    <p className="text-xs">
                        {quantity} Pcs
                    </p>
                </div>
            </div>
            <span className="text-base font-mono">
                Rp {(productPrice * quantity).toLocaleString('id-ID')}
            </span>
        </div>
    )
};

export default function CheckoutForm() {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank-transfer");
    const totalQuantity = products.reduce((total, product) => total + product.quantity, 0);
    const totalPrice = products.reduce((total, product) => total + product.productPrice * product.quantity, 0);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const selectedPaymentMethod = paymentMethods.find(({ value }) => value === formData.get("payment_method"));
        const productDetails = products
            .map((product) => `- ${product.name}: ${product.quantity} pcs x Rp ${product.productPrice.toLocaleString('id-ID')} = Rp ${(product.productPrice * product.quantity).toLocaleString('id-ID')}`)
            .join("\n");
        const message = [
            "Halo, saya ingin melakukan pemesanan:",
            "",
            `Nama Lengkap: ${formData.get("name")}`,
            `No. WhatsApp: ${formData.get("phone")}`,
            `Alamat Pengiriman: ${formData.get("address")}`,
            `Catatan: ${formData.get("note") || "-"}`,
            `Metode Pembayaran: ${selectedPaymentMethod?.label ?? "-"}`,
            "",
            "Detail Pesanan:",
            productDetails,
            "",
            `Jumlah Pesanan: ${totalQuantity} pcs`,
            `Total: Rp ${totalPrice.toLocaleString('id-ID')}`,
        ].join("\n");

        window.open(`https://wa.me/6281383415432?text=${encodeURIComponent(message)}`, "_blank");
    }

    return (
        <form onSubmit={handleSubmit} className="min-h-screen max-w-7xl mx-auto grid md:grid-cols-2 gap-6 p-5">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold">
                        Checkout
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Silakan isi data diri dan alamat pengiriman untuk memproses pesanan Anda.
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <Label className="gap-0">
                            Nama Lengkap<span className="text-destructive">*</span>
                        </Label>
                        <Input name="name" autoComplete="name" placeholder="Masukkan nama lengkap Anda" required />
                    </div>

                    <div className="space-y-2">
                        <Label className="gap-0">
                            No. WhatsApp<span className="text-destructive">*</span>
                        </Label>
                        <Input name="phone" autoComplete="tel" placeholder="Masukkan nomor WhatsApp Anda" required />
                    </div>

                    <div className="space-y-2">
                        <Label className="gap-0">
                            Alamat Pengiriman<span className="text-destructive">*</span>
                        </Label>
                        <Textarea name="address" placeholder="Masukkan alamat pengiriman Anda" required />
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Catatan
                        </Label>
                        <Textarea name="note" placeholder="Berikan catatan tambahan untuk pesanan Anda (opsional)" />
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Metode Pembayaran
                        </Label>
                        <div className="grid md:grid-cols-3 gap-3">
                            {paymentMethods.map(({ value, label, icon: Icon }) => (
                                <div key={value}>
                                    <input
                                        id={`payment-${value}`}
                                        type="radio"
                                        name="payment_method"
                                        value={value}
                                        checked={paymentMethod === value}
                                        onChange={() => setPaymentMethod(value)}
                                        className="sr-only"
                                    />
                                    <Button
                                        variant={paymentMethod === value ? "default" : "outline"}
                                        className="flex-col w-full h-full py-6"
                                        asChild
                                    >
                                        <label htmlFor={`payment-${value}`} aria-pressed={paymentMethod === value}>
                                            <Icon className={paymentMethod === value ? "size-6 text-muted" : "size-6 text-muted-foreground"} />
                                            {label}
                                        </label>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 w-full">
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>
                            Ringkasan Pesanan
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-3">
                        {products.map((product) => (
                            <ProductCard key={product.name} {...product} />
                        ))}
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3 pt-3 border-t">
                        <div className="space-y-1 w-full">
                            <div className="flex justify-between gap-6 w-full">
                                <h4 className="text-base font-medium">
                                    Jumlah Pesanan:
                                </h4>
                                <span className="text-base font-mono">
                                    {totalQuantity}
                                </span>
                            </div>

                            <div className="flex justify-between gap-6 w-full">
                                <h4 className="text-base font-medium">
                                    Total:
                                </h4>
                                <span className="text-base font-mono">
                                    Rp {totalPrice.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>

                        <Button type="submit" className="w-full">
                            Checkout Pesanan Anda
                        </Button>

                    </CardFooter>
                </Card>

                <p className="text-sm text-muted-foreground">
                    Anda akan diarahkan menuju WhatsApp setelah menekan tombol checkout. Pastikan semua data sudah benar sebelum melanjutkan.
                </p>
            </div>
        </form>
    )
}