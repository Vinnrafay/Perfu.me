import { Link, usePage, router } from '@inertiajs/react'
import { useState, useCallback } from 'react'
import { Menu, X, ShoppingCart, Plus, Minus, Trash2, ShoppingBag, ImageOff } from 'lucide-react'
import { Button } from '../ui/button'
import AppLogo from '../app-logo';
import WhatsAppIcon from '../whatsapp-icon';
import { useCart } from '@/hooks/useCart';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
];

const formatIDR = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

function CartItemThumbnail({ src, alt }: { src: string | null; alt: string }) {
    const [failed, setFailed] = useState(false);
    const showFallback = !src || failed;

    if (showFallback) {
        return (
            <div className="w-20 h-20 shrink-0 flex items-center justify-center rounded-xl border border-border/50 bg-muted">
                <ImageOff className="w-6 h-6 text-muted-foreground/40" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            onError={() => setFailed(true)}
            className="w-20 h-20 shrink-0 object-cover rounded-xl border border-border/50 bg-muted"
        />
    );
}

export default function Navbar() {
    const { url } = usePage();
    // State untuk Mobile Menu
    const [open, setOpen] = useState(false);
    // State BARU khusus untuk Keranjang (Sheet)
    const [cartOpen, setCartOpen] = useState(false);

    const { cart, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();

    const currentPath = new URL(url, window.location.origin).pathname;

    const isActive = (href: string) => {
        if (href === '/') return currentPath === '/';
        return currentPath === href || currentPath.startsWith(`${href}/`);
    };

    const handleCheckout = useCallback(() => {
        if (cart.length === 0) return;

        router.get('/products/checkout', {
            source: 'cart'
        });

        // Tutup keranjang setelah klik checkout
        setCartOpen(false);
    }, [cart]);

    return (
        <>
            <div className="w-full h-16" />

            <nav className="fixed top-0 z-999 h-16 w-full border-b bg-card">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between p-5">
                    <Link className="flex-1 font-heading text-xl font-bold" href="/">
                        Perfu.me
                    </Link>

                    <div className="hidden flex-1 items-center justify-center gap-4 text-lg font-medium lg:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`transition-colors ${isActive(link.href)
                                    ? 'text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex-1 flex items-center justify-end gap-0 lg:gap-2">
                        {/* CTA Desktop */}
                        <div className="hidden lg:block">
                            <Button onClick={() => window.open('https://wa.me/6281383415432', '_blank')}>
                                <WhatsAppIcon />
                                Pesan Sekarang
                            </Button>
                        </div>

                        {/* KERANJANG BELANJA (SHEET) - Dikontrol oleh cartOpen */}
                        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                            <SheetTrigger asChild>
                                <Button variant="secondary" size="icon" className="relative bg-transparent lg:bg-secondary">
                                    <ShoppingCart />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                                            {totalItems}
                                        </span>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border/50 z-1001">

                                {/* Header */}
                                <SheetHeader className="p-6 pr-12 border-b border-border/60">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex flex-col gap-0.5">
                                            <SheetTitle className="text-left font-sans leading-none text-foreground">
                                                Keranjang Belanja
                                            </SheetTitle>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {totalItems > 0
                                                    ? `${totalItems} item di keranjang kamu`
                                                    : 'Belum ada item'}
                                            </p>
                                        </div>
                                    </div>
                                </SheetHeader>

                                <div className="flex-1 overflow-y-auto bg-background">
                                    {cart.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-4 p-6">
                                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                                                <ShoppingCart className="w-7 h-7 text-muted-foreground/50" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-foreground">Keranjang Masih Kosong</h3>
                                                <p className="text-xs max-w-56 mx-auto">Yuk, eksplorasi katalog kami dan temukan wangi favoritmu!</p>
                                            </div>
                                            <SheetTrigger asChild>
                                                <Link href="/products">
                                                    <Button variant="outline" size="sm" className="mt-1">
                                                        Jelajahi Katalog
                                                    </Button>
                                                </Link>
                                            </SheetTrigger>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border/60">
                                            {cart.map((item) => {
                                                const isLastUnit = item.quantity <= 1;
                                                const subtotal = item.Harga * item.quantity;

                                                return (
                                                    <div key={item.cartKey} className="flex gap-3.5 p-5">
                                                        <CartItemThumbnail src={item.Foto ? `/storage/${item.Foto}` : null} alt={item.nama} />

                                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                            <div className="flex justify-between items-start gap-2">
                                                                <div className="min-w-0">
                                                                    <h4 className="text-sm font-semibold leading-tight line-clamp-1">{item.nama}</h4>
                                                                    <p className="text-[11px] font-medium text-muted-foreground mt-0.5 line-clamp-1">
                                                                        {item.Varian}
                                                                    </p>
                                                                    <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                                                                        {formatIDR(item.Harga)} / pcs
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeFromCart(item.cartKey)}
                                                                    className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors"
                                                                    aria-label={`Hapus ${item.nama} dari keranjang`}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            <div className="flex items-center justify-between mt-3">
                                                                <span className="text-sm font-semibold text-foreground">
                                                                    {formatIDR(subtotal)}
                                                                </span>
                                                                <div className="flex items-center gap-1.5 border border-border/80 rounded-lg p-0.5 bg-muted/30">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            isLastUnit
                                                                                ? removeFromCart(item.cartKey)
                                                                                : updateQuantity(item.cartKey, item.quantity - 1)
                                                                        }
                                                                        className={`w-6 h-6 flex items-center justify-center rounded-md bg-background shadow-sm transition-colors ${isLastUnit
                                                                            ? 'text-destructive hover:bg-destructive/10'
                                                                            : 'text-muted-foreground hover:text-foreground'
                                                                            }`}
                                                                        aria-label={isLastUnit ? 'Hapus item' : 'Kurangi jumlah'}
                                                                    >
                                                                        {isLastUnit ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                                                    </button>
                                                                    <span className="text-xs font-bold w-5 text-center tabular-nums">{item.quantity}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                                                                        className="w-6 h-6 flex items-center justify-center rounded-md bg-background text-muted-foreground hover:text-foreground shadow-sm"
                                                                        aria-label="Tambah jumlah"
                                                                    >
                                                                        <Plus className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Bagian Checkout Bawah */}
                                {cart.length > 0 && (
                                    <div className="border-t border-border p-6 bg-card/80 backdrop-blur-md shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] space-y-4">
                                        <div className="flex justify-between items-center pt-1.5 border-t border-border/60">
                                            <span className="text-sm font-medium text-muted-foreground">Total Pembayaran</span>
                                            <span className="text-xl font-semibold text-foreground">
                                                {formatIDR(totalPrice)}
                                            </span>
                                        </div>
                                        <Button
                                            size="lg"
                                            className="w-full"
                                            onClick={handleCheckout}
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            Lanjut ke Checkout
                                        </Button>
                                        <p className="text-[10px] text-center text-muted-foreground">
                                            Pilih metode pembayaran & isi alamat di halaman checkout
                                        </p>
                                    </div>
                                )}
                            </SheetContent>
                        </Sheet>

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpen(true)}
                            className="lg:hidden"
                        >
                            <Menu />
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Backdrop Mobile Menu */}
            <div
                onClick={() => setOpen(false)}
                className={`fixed inset-0 z-1001 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
            />

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed inset-y-0 right-0 z-1002 flex h-full w-70 flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex h-16 items-center justify-between border-b border-border/50 px-6">
                    <span className="font-heading text-lg font-bold">Perfu.me</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(false)}
                    >
                        <X />
                    </Button>
                </div>

                <div className="flex flex-1 flex-col gap-2 px-4 py-6">
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
                            className={`rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground ${open ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="p-6">
                    <Button
                        className="w-full"
                        onClick={() => window.open('https://wa.me/6281383415432', '_blank')}
                    >
                        <WhatsAppIcon /> Pesan Sekarang!
                    </Button>
                </div>
            </div>
        </>
    )
}