import Navbar from "@/components/blocks/navbar";
import { StickyFooter } from "@/components/footer";

export default function GuestLayout({ children }: React.PropsWithChildren<{}>) {
    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            <StickyFooter />
        </>
    )
}
