import { Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/button'
import { dashboard, login, register } from '@/routes';
import AppLogo from '../app-logo';
import WhatsAppIcon from '../whatsapp-icon';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {

    const { url } = usePage();
    const [open, setOpen] = useState(false);

    const currentPath = new URL(url, window.location.origin).pathname;

    const isActive = (href: string) => {
        if (href === '/') {
            return currentPath === '/';
        }

        return (
            currentPath === href ||
            currentPath.startsWith(`${href}/`)
        );
    };

    return (
        <>
            {/* Space divider */}
            <div className="w-full h-16" />

            {/*Fixed navbar */}
            <nav className="fixed top-0 z-999 h-16 w-full border-b bg-card">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between p-5">
                    <span className="flex-1 font-heading text-xl font-bold">Perfu.me</span>

                    {/* Desktop nav */}
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

                    {/* Desktop CTA */}
                    <div className="flex-1 hidden items-center justify-end lg:flex">
                        <Button onClick={() => window.open('https://wa.me/6281234567890', '_blank')}>
                            <Icon />
                            Pesan Sekarang!
                        </Button>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        aria-label="Buka menu"
                        aria-expanded={open}
                        className="flex h-9 w-9 items-center justify-center rounded-md text-foreground lg:hidden"
                    >
                        <Menu className="h-6 w-6" strokeWidth={1.5} />
                    </button>
                </div>
            </nav>

            {/* Backdrop */}
            <div
                onClick={() => setOpen(false)}
                aria-hidden="true"
                className={`fixed inset-0 z-[1000] bg-black/50 transition-opacity duration-300 lg:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                    }`}
            />

            {/* Right-side drawer */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Menu navigasi"
                className={`fixed inset-y-0 right-0 z-[1001] flex h-full w-72 max-w-[80vw] flex-col border-l bg-card shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${open ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex h-16 items-center justify-between border-b px-5">
                    <span className="font-heading text-lg font-bold">Perfu.me</span>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Tutup menu"
                        className="flex h-9 w-9 items-center justify-center rounded-md text-foreground"
                    >
                        <X className="h-6 w-6" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="flex flex-1 flex-col gap-1 px-5 py-6">
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
                            className={`rounded-md px-2 py-3 text-base font-medium text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground ${open ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="border-t p-5">
                    <Button
                        className="w-full"
                        onClick={() => {
                            setOpen(false);
                            window.open('https://wa.me/6281383415432', '_blank');
                        }}
                    >
                        <WhatsAppIcon />
                        Pesan Sekarang!
                    </Button>
                </div>
            </div>
        </>
    )
}