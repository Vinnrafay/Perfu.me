import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DailySale } from '@/pages/dashboard';

interface ChartAreaSalesProps {
    data: DailySale[];
}

const chartConfig = {
    revenue: { label: 'Pendapatan', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

type TimeRange = '7d' | '30d' | '90d';

const timeRangeOptions: Array<{ value: TimeRange; label: string; days: number }> = [
    { value: '7d', label: '7 hari terakhir', days: 7 },
    { value: '30d', label: '30 hari terakhir', days: 30 },
    { value: '90d', label: '3 bulan terakhir', days: 90 },
];

export function ChartAreaSales({ data }: ChartAreaSalesProps) {
    const [selectedDay, setSelectedDay] = useState<DailySale | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>('90d');
    const selectedRange = timeRangeOptions.find((option) => option.value === timeRange) ?? timeRangeOptions[2];
    const referenceDate = data.length > 0 ? new Date(data[data.length - 1].date) : new Date();
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - selectedRange.days + 1);
    const filteredData = data.filter((sale) => {
        const saleDate = new Date(sale.date);

        return saleDate >= startDate && saleDate <= referenceDate;
    });

    const handleTimeRangeChange = (value: string) => {
        setTimeRange(value as TimeRange);
        setSelectedDay(null);
    };

    return (
        <Card className="pt-0">
            <CardHeader className="flex flex-col gap-3 border-b py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid gap-1">
                    <CardTitle>Tren Pendapatan Harian</CardTitle>
                    <CardDescription>Pilih titik pada grafik untuk melihat detail penjualan hari itu.</CardDescription>
                </div>
                <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                    <SelectTrigger className="w-full sm:w-[180px]" aria-label="Pilih rentang waktu">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {timeRangeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {filteredData.length === 0 ? (
                    <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">Belum ada data penjualan.</div>
                ) : (
                    <>
                        <ChartContainer config={chartConfig} className="h-[280px] w-full">
                            <AreaChart data={filteredData} onClick={(state) => {
                                const payload = (state as { activePayload?: Array<{ payload?: DailySale }> } | null)?.activePayload?.[0]?.payload;
                                if (payload) setSelectedDay(payload);
                            }}>
                                <defs>
                                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value: string) => value.slice(5)} />
                                <YAxis hide />
                                <ChartTooltip
                                    content={<ChartTooltipContent indicator="dot" formatter={(_value, _name, item) => {
                                        const day = item.payload as DailySale;
                                        return (
                                            <div className="grid gap-1.5">
                                                <span className="font-medium">{formatCurrency(day.revenue)}</span>
                                                <span className="text-muted-foreground">{day.units.toLocaleString('id-ID')} unit terjual</span>
                                                {day.topVariants.length > 0 && (
                                                    <div className="text-muted-foreground">Top 3: {day.topVariants.map((variant) => `${variant.variant} (${variant.units})`).join(', ')}</div>
                                                )}
                                            </div>
                                        );
                                    }} />}
                                />
                                <Area dataKey="revenue" type="monotone" fill="url(#fillRevenue)" stroke="var(--color-revenue)" strokeWidth={2} />
                            </AreaChart>
                        </ChartContainer>
                        {selectedDay && (
                            <div className="mt-4 rounded-lg border bg-muted/20 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="font-medium">Detail {selectedDay.date}</p>
                                        <p className="text-sm text-muted-foreground">{formatCurrency(selectedDay.revenue)} · {selectedDay.units} unit</p>
                                    </div>
                                    <button type="button" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setSelectedDay(null)}>Tutup</button>
                                </div>
                                <ul className="mt-3 space-y-1 text-sm">
                                    {selectedDay.topVariants.map((variant) => <li key={variant.variant} className="flex justify-between"><span>{variant.variant}</span><span>{variant.units} unit</span></li>)}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
