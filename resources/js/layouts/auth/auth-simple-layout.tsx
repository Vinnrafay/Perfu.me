import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col">

            <div className="grid flex-1 lg:grid-cols-2">
                {/* Left: form */}
                <div className="flex flex-col gap-10 bg-background p-6 md:p-10">
                    <Link
                        href={home()}
                        className="flex items-center gap-2 text-2xl font-semibold font-heading tracking-tight"
                    >
                        Perfu.me
                    </Link>

                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-sm">
                            <div className="flex flex-col gap-8">
                                <div className="space-y-2">
                                    <span className="text-xs font-semibold tracking-[0.3em] text-muted-foreground">
                                        Welcome Back
                                    </span>
                                    <h1 className="text-4xl font-bold leading-none tracking-tight">
                                        {title}
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: image with bold overlay text, ala Mykonos hero */}
                <div className="relative hidden overflow-hidden bg-primary lg:block">
                    <img
                        src="/placeholder.svg"
                        alt="Perfu.me"
                        className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />

                    <div className="relative flex h-full flex-col justify-between p-12">
                        <span className="text-xs font-semibold tracking-[0.35em] text-primary-foreground/70">

                        </span>

                        <h2 className="text-6xl font-semibold leading-[0.95] text-primary-foreground">
                            Smell Good.
                            <br />
                            Feel Confident.
                        </h2>
                    </div>
                </div>
            </div>

            <style>{`
                .marquee {
                    animation: marquee 22s linear infinite;
                    width: max-content;
                }
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .marquee { animation: none; }
                }
            `}</style>
        </div>
    );
}