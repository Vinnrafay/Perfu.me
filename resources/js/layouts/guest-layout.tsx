import { useEffect } from 'react';
import Navbar from "@/components/blocks/navbar";
import { StickyFooter } from "@/components/footer";
import { forceLightTheme } from '@/hooks/use-appearance';

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        forceLightTheme();
    }, []);

    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            <StickyFooter />
        </>
    )
}
