import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import type { TopVariant } from '@/pages/dashboard';

interface ChartBarTopSellingProps {
    data: TopVariant[];
}

const chartConfig = {
    units: { label: 'Unit terjual', color: 'var(--chart-2)' },
} satisfies ChartConfig;

export function ChartBarTopSelling({ data }: ChartBarTopSellingProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Varian Parfum Terlaris</CardTitle>
                <CardDescription>Top 10 varian berdasarkan jumlah unit terjual.</CardDescription>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">Belum ada data penjualan.</div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-[280px] w-full">
                        <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 24, right: 16 }}>
                            <CartesianGrid horizontal={false} />
                            <XAxis type="number" dataKey="units" hide />
                            <YAxis type="category" dataKey="variant" width={150} tickLine={false} axisLine={false} tickMargin={8} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Bar dataKey="units" fill="var(--color-units)" radius={10} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
