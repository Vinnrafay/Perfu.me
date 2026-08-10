import { Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/button'
import { dashboard, login, register } from '@/routes';
import AppLogo from '../app-logo';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {

    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 z-999 h-16 w-full border-b bg-card">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between p-5">
                    <span className="font-heading text-xl font-bold">Perfu.me</span>

                    {/* Desktop nav */}
                    <div className="hidden flex-1 items-center justify-center gap-4 text-lg font-medium lg:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden items-center justify-end lg:flex">
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

            {/* Spacer so page content isn't hidden behind the fixed navbar */}
            <div className="h-16" />

            {/* Backdrop */}
            <div
                onClick={() => setOpen(false)}
                aria-hidden="true"
                className={`fixed inset-0 z-[1000] bg-black/50 transition-opacity duration-300 lg:hidden ${
                    open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                }`}
            />

            {/* Right-side drawer */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Menu navigasi"
                className={`fixed inset-y-0 right-0 z-[1001] flex h-full w-72 max-w-[80vw] flex-col border-l bg-card shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
                    open ? 'translate-x-0' : 'translate-x-full'
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
                            className={`rounded-md px-2 py-3 text-base font-medium text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground ${
                                open ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
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
                        <Icon />
                        Pesan Sekarang!
                    </Button>
                </div>
            </div>
        </>
    )
}

function Icon() {
    return (
        <svg role="img" fill="currentcolor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
    )
}