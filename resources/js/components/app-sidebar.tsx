import { memo } from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    Star,
    Store,
    ExternalLink,
    ShoppingCart,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from '@/components/ui/sidebar';
import { index as dashboard } from '@/routes/dashboard';
import { index as productsIndex } from '@/routes/products';
import { index as testimoniIndex } from '@/routes/testimoni';
import { index as pesananIndex } from '@/routes/pesanan';
import type { NavItem } from '@/types';

// Konstan diletakkan di luar komponen agar stabil secara memori
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Produk',
        href: productsIndex(),
        icon: Package,
    },
    {
        title: 'Testimoni',
        href: testimoniIndex(),
        icon: Star,
    },
    {
        title: 'Pesanan',
        href: pesananIndex(),
        icon: ShoppingCart,
    },
];

export const AppSidebar = memo(function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-sidebar-border/60">
            {/* Header: Logo & Identity */}
            <SidebarHeader className="border-b border-sidebar-border/40 pb-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/60 transition-all duration-200">
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Content: Main Navigation */}
            <SidebarContent className="gap-2 py-3">
                {/* Grup Menu Utama */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 px-2 mb-1">
                        Manajemen Toko
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <NavMain items={mainNavItems} />
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Grup Akses Cepat / Pintas */}
                <SidebarGroup className="mt-auto pt-4">
                    <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 px-2 mb-1">
                        Akses Cepat
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Lihat Toko">
                                    <a
                                        href="/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors duration-200"
                                    >
                                        <Store className="h-4 w-4" />
                                        <span>Lihat Website</span>
                                        <ExternalLink className="ml-auto h-3 w-3 opacity-40" />
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer: Profile & Account */}
            <SidebarFooter className="border-t border-sidebar-border/40 pt-3">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
});