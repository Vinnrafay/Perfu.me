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
                <div className="flex flex-col bg-background p-6 md:p-10">
                    <Link
                        href={home()}
                        className="flex items-center gap-2 text-2xl font-semibold font-heading"
                    >
                        Perfu.me
                    </Link>

                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-sm">
                            <div className="flex flex-col gap-8">
                                <div className="space-y-2 text-center md:text-left">
                                    <h1 className="text-3xl font-semibold leading-none tracking-tight">
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
                        src="/images/BannerAboutMe.png"
                        alt="Perfu.me"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/20 to-transparent" />

                    <div className="relative flex h-full flex-col justify-end p-12">
                        <h2 className="text-6xl font-medium leading-[0.95] text-primary-foreground">
                            Smell <span className="font-heading italic">Good</span>,
                            <br />
                            Feel <span className="font-heading italic">Confident</span>.
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}