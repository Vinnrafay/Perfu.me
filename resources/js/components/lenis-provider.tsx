import Lenis from 'lenis';
import { useEffect } from 'react';
import 'lenis/dist/lenis.css';

export default function LenisProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        if (prefersReducedMotion) {
            return;
        }

        const lenis = new Lenis({
            autoRaf: false,
            duration: 1.1,
            smoothWheel: true,
        });

        let rafId = 0;

        const raf = (time: number) => {
            lenis.raf(time);
            rafId = window.requestAnimationFrame(raf);
        };

        rafId = window.requestAnimationFrame(raf);

        return () => {
            window.cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
