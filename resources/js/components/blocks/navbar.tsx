import { Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Menu, X, ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '../ui/button'
import { dashboard, login, register } from '@/routes';
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

export default function Navbar() {
    const { url } = usePage();
    const [open, setOpen] = useState(false);
    
    // Panggil fungsi dari custom hook keranjang
    const { cart, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();

    const currentPath = new URL(url, window.location.origin).pathname;

    const isActive = (href: string) => {
        if (href === '/') return currentPath === '/';
        return currentPath === href || currentPath.startsWith(`${href}/`);
    };

    // LOGIKA CHECKOUT WHATSAPP
    const handleCheckoutWA = () => {
        if (cart.length === 0) return;

        const waNumber = '6281383415432'; // Ganti no WA toko
        let message = 'Halo Admin Perfu.me, saya ingin memesan parfum berikut:\n\n';
        
        cart.forEach((item, index) => {
            const subtotal = item.Harga * item.quantity;
            message += `${index + 1}. *${item.nama}*\n`;
            message += `   Varian: ${item.Varian}\n`;
            message += `   Jumlah: ${item.quantity} x Rp ${item.Harga.toLocaleString('id-ID')}\n`;
            message += `   Subtotal: Rp ${subtotal.toLocaleString('id-ID')}\n\n`;
        });

        message += `*Total Keseluruhan: Rp ${totalPrice.toLocaleString('id-ID')}*\n\n`;
        message += 'Mohon informasi ketersediaan stok dan pembayarannya ya. Terima kasih!';

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank');
    };

    return (
        <>
            <div className="w-full h-16" />

            <nav className="fixed top-0 z-[999] h-16 w-full border-b bg-card">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between p-5">
                    <span className="flex-1 font-heading text-xl font-bold">Perfu.me</span>

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

                    <div className="flex-1 flex items-center justify-end gap-3.5 lg:gap-5">
                        
                        {/* KERANJANG BELANJA (SHEET) */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-muted/40 hover:bg-muted/80 border border-border/60 text-foreground hover:text-indigo-600 hover:border-indigo-500/30 transition-all duration-200">
                                    <ShoppingCart className="h-5 w-5" strokeWidth={1.8} />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                                            {totalItems}
                                        </span>
                                    )}
                                </button>
                            </SheetTrigger>
                            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border/50">
                                <SheetHeader className="px-6 py-5 border-b border-border bg-muted/20">
                                    <SheetTitle className="text-left font-bold flex items-center gap-2.5 text-foreground">
                                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                                            <ShoppingBag className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        Keranjang Belanja
                                        {totalItems > 0 && (
                                            <span className="ml-auto text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                                                {totalItems} Item
                                            </span>
                                        )}
                                    </SheetTitle>
                                </SheetHeader>
                                
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
                                    {cart.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-4">
                                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                                                <ShoppingCart className="w-8 h-8 text-muted-foreground/40" />
                                            </div>
                                            <h3 className="font-semibold text-foreground">Keranjang Masih Kosong</h3>
                                            <p className="text-xs max-w-[200px]">Yuk, eksplorasi katalog kami dan temukan wangi favoritmu!</p>
                                        </div>
                                    ) : (
                                        cart.map((item) => (
                                            <div key={item.id} className="group flex gap-4 p-3.5 border border-border/80 rounded-2xl bg-card hover:border-indigo-500/30 hover:shadow-sm transition-all">
                                                <img 
                                                    src={item.Foto ? `/storage/${item.Foto}` : '/placeholder.jpg'} 
                                                    alt={item.nama}
                                                    className="w-20 h-20 object-cover rounded-xl border border-border/50 bg-muted"
                                                />
                                                <div className="flex-1 flex flex-col justify-between py-0.5">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div>
                                                            <h4 className="text-sm font-bold leading-tight line-clamp-1">{item.nama}</h4>
                                                            <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{item.Varian}</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => removeFromCart(item.id)} 
                                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between mt-3">
                                                        <span className="text-xs font-extrabold text-foreground">
                                                            Rp {item.Harga.toLocaleString('id-ID')}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 border border-border/80 rounded-lg p-0.5 bg-muted/30">
                                                            <button 
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                                                className="w-6 h-6 flex items-center justify-center rounded-md bg-background text-muted-foreground hover:text-foreground shadow-sm"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                                                            <button 
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                                                className="w-6 h-6 flex items-center justify-center rounded-md bg-background text-muted-foreground hover:text-foreground shadow-sm"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Bagian Checkout Bawah */}
                                {cart.length > 0 && (
                                    <div className="border-t border-border p-6 bg-card/80 backdrop-blur-md shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                                        <div className="flex justify-between items-center mb-5">
                                            <span className="text-sm font-semibold text-muted-foreground">Total Pembayaran</span>
                                            <span className="text-xl font-black text-foreground">
                                                Rp {totalPrice.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <Button 
                                            className="w-full h-12 text-sm font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2.5 rounded-xl shadow-lg shadow-[#25D366]/20 transition-all active:scale-[0.98]" 
                                            onClick={handleCheckoutWA}
                                        >
                                            <WhatsAppIcon /> Checkout via WhatsApp
                                        </Button>
                                    </div>
                                )}
                            </SheetContent>
                        </Sheet>

                        {/* CTA Desktop */}
                        <div className="hidden lg:block">
                            <Button 
                                className="gap-2 h-10 rounded-xl px-5 font-semibold bg-foreground text-background hover:bg-foreground/90" 
                                onClick={() => window.open('https://wa.me/6281383415432', '_blank')}
                            >
                                <WhatsAppIcon />
                                Pesan Sekarang!
                            </Button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            aria-label="Buka menu"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 hover:bg-muted/80 border border-border/60 text-foreground lg:hidden transition-colors"
                        >
                            <Menu className="h-5 w-5" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Backdrop Mobile Menu */}
            <div
                onClick={() => setOpen(false)}
                className={`fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
            />

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed inset-y-0 right-0 z-[1001] flex h-full w-[280px] flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex h-16 items-center justify-between border-b border-border/50 px-6">
                    <span className="font-heading text-lg font-bold">Perfu.me</span>
                    <button 
                        onClick={() => setOpen(false)} 
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/50 hover:bg-muted text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="flex flex-1 flex-col gap-2 px-4 py-6">
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
                            className={`rounded-xl px-4 py-3.5 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground ${open ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="p-6 border-t border-border/50 bg-muted/10">
                    <Button 
                        className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-bold gap-2 rounded-xl" 
                        onClick={() => window.open('https://wa.me/6281383415432', '_blank')}
                    >
                        <WhatsAppIcon /> Pesan Sekarang!
                    </Button>
                </div>
            </div>
        </>
    )
}