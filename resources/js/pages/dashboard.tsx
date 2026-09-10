import { Head, usePage } from '@inertiajs/react';
import { index } from '@/routes/dashboard';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, DollarSign, Package, ShoppingBag, type LucideIcon } from 'lucide-react';
import { ChartAreaSales } from '@/components/blocks/area-chart';
import { ChartBarTopSelling } from '@/components/blocks/bar-chart';

interface Summary {
    revenue: number;
    unitsSold: number;
    orders: number;
    pendingOrders: number;
}

export interface TopVariant {
    variant: string;
    units: number;
}

export interface DailySale {
    date: string;
    revenue: number;
    units: number;
    topVariants: TopVariant[];
}

interface DashboardProps {
    summary: Summary;
    dailySales: DailySale[];
    topSellingVariants: TopVariant[];
}

const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);

export default function Dashboard({ summary, dailySales, topSellingVariants }: DashboardProps) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-medium">
                        {getGreetingByTime()}, <span className="text-muted-foreground">{auth.user.name}!</span>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Kelola bisnis Anda dengan mudah melalui dashboard ini.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-4">
                    {summaryCardData(summary).map((data) => (
                        <SummaryCard key={data.label} {...data} />
                    ))}
                </div>

                <ChartAreaSales data={dailySales} />
                <ChartBarTopSelling data={topSellingVariants} />
            </div>
        </>
    );
}

function getGreetingByTime(): string {
    const hour = new Date().getHours();

    if (hour < 12) return 'Selamat Pagi';
    if (hour < 17) return 'Selamat Siang';
    if (hour < 21) return 'Selamat Sore';

    return 'Selamat Malam';
}

interface SummaryCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    description: string;
}

function SummaryCard({ icon: Icon, label, value, description }: SummaryCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                    {label}
                </CardTitle>
                <CardTitle className="text-4xl font-heading tracking-widest tabular-nums">
                    {value}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
        </Card>
    );
}

function summaryCardData(summary: Summary): SummaryCardProps[] {
    return [
        { label: 'Total Omzet / Pendapatan', value: formatCurrency(summary.revenue), description: 'Akumulasi nilai seluruh pesanan', icon: DollarSign },
        { label: 'Total Unit Parfum Terjual', value: `${summary.unitsSold.toLocaleString('id-ID')} Unit`, description: 'Jumlah unit dari seluruh pesanan', icon: Package },
        { label: 'Total Pesanan / Orders', value: summary.orders.toLocaleString('id-ID'), description: 'Jumlah pesanan yang tercatat', icon: ShoppingBag },
        { label: 'Pesanan Perlu Diproses', value: summary.pendingOrders.toLocaleString('id-ID'), description: 'Pesanan menunggu verifikasi admin', icon: Clock },
    ];
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard Overview',
            href: index(),
        },
    ],
};
