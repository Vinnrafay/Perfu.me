import { Head, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-medium">
                        {getGreetingByTime()}, <span className="text-muted-foreground">{usePage().props.auth.user.name}!</span>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Kelola bisnis Anda dengan mudah melalui dashboard ini.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {SummaryCardData.map((data, index) => (
                        <SummaryCard
                            key={index}
                            label={data.label}
                            value={data.value}
                            description={data.description}
                            actionLabel={data.actionLabel}
                            onActionClick={data.onActionClick}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

function getGreetingByTime(): string {
    const hour = new Date().getHours();

    if (hour < 12) {
        return 'Selamat Pagi';
    }

    if (hour < 17) {
        return 'Selamat Siang';
    }

    if (hour < 21) {
        return 'Selamat Sore';
    }

    return 'Selamat Malam';
}

function SummaryCard({
    label,
    value,
    description,
    actionLabel,
    onActionClick,
}: {
    label: string;
    value: any;
    description: string;
    actionLabel: string;
    onActionClick: () => void;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-muted-foreground">
                    {label}
                </CardTitle>
                <CardTitle className="text-4xl tabular-nums font-heading tracking-widest">
                    {value}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
                <CardAction>
                    <Button onClick={onActionClick} size="sm" variant="secondary">
                        <Plus />
                        {actionLabel}
                    </Button>
                </CardAction>
            </CardHeader>
        </Card>
    );
}

const SummaryCardData = [
    {
        label: 'Total Produk Original',
        value: 2,
        description: 'Total produk yang tersedia di toko',
        actionLabel: 'Tambah Produk Original',
        onActionClick: () => { }
    },
    {
        label: 'Total Produk Refill',
        value: 10,
        description: 'Total produk yang tersedia untuk refill',
        actionLabel: 'Tambah Produk Refill',
        onActionClick: () => { }
    },
    {
        label: 'Rating Toko',
        value: 4.5,
        description: 'Rata-rata rating toko dari pelanggan',
        actionLabel: 'Tambah Testimoni',
        onActionClick: () => { }
    },
];


Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard Overview',
            href: dashboard(),
        },
    ],
};
