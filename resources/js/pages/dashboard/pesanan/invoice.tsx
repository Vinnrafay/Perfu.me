import { Link } from '@inertiajs/react';
import { downloadInvoice } from '@/actions/App/Http/Controllers/PesananController';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import type { Pesanan } from './index';

interface Props {
    pesanan: Pesanan;
    appName: string;
}

const metodeLabel: Record<Pesanan['metode_pembayaran'], string> = {
    transfer: 'Transfer Bank',
    'e-wallet': 'E-Wallet',
    qris: 'QRIS',
    cod: 'COD',
};

const formatPrice = (val: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(val);

const formatDate = (val: string) =>
    new Date(val).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

export default function PesananInvoice({ pesanan, appName }: Props) {
    return (
        <div className="flex flex-col items-center gap-4 p-5 w-full">
            {/* Toolbar atas, di luar "kertas struk" */}
            <div className="w-full max-w-md flex items-center justify-between">
                <Button variant="outline" size="sm" asChild className="rounded-lg gap-1.5">
                    <Link href="/dashboard/pesanan">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Kembali
                    </Link>
                </Button>

                <Button asChild size="sm" className="rounded-lg gap-1.5 bg-black hover:bg-black/90 text-white">
                    {/*
                      Ini bukan navigasi Inertia — dia beneran nge-trigger
                      download file dari server, jadi pakai <a> biasa, bukan
                      <Link>. target="_blank" biar SPA-nya gak keganggu.
                    */}
                    <a href={downloadInvoice(pesanan.id).url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-3.5 w-3.5" />
                        Download PDF
                    </a>
                </Button>
            </div>

            {/* "Kertas" struk — dibikin sempit & monospace biar kesan struk kasir */}
            <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-sm font-mono text-sm">
                <div className="p-6">
                    {/* Header toko */}
                    <div className="text-center pb-4 border-b-2 border-dashed border-border">
                        <h1 className="text-base font-heading tracking-wide uppercase">
                            {appName}
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1">Invoice Pesanan</p>
                    </div>

                    {/* Meta transaksi */}
                    <div className="py-4 space-y-1 border-b-2 border-dashed border-border text-xs">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">No. Invoice</span>
                            <span>#{String(pesanan.id).padStart(6, '0')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Metode Bayar</span>
                            <span>{metodeLabel[pesanan.metode_pembayaran]}</span>
                        </div>
                    </div>

                    {/* Data pembeli */}
                    <div className="py-4 space-y-1 border-b-2 border-dashed border-border text-xs">
                        <p className="font-semibold">{pesanan.nama_pembeli}</p>
                        <p className="text-muted-foreground">{pesanan.no_wa}</p>
                        <p className="text-muted-foreground leading-relaxed">{pesanan.alamat}</p>
                        {pesanan.catatan && (
                            <p className="text-muted-foreground italic pt-1">"{pesanan.catatan}"</p>
                        )}
                    </div>

                    {/* Item */}
                    <div className="py-4 border-b-2 border-dashed border-border text-xs space-y-2">
                        <div>
                            <p>{pesanan.product_size.product.nama} ({pesanan.product_size.Ukuran}ml)</p>
                            <div className="flex justify-between text-muted-foreground mt-0.5">
                                <span>
                                    {pesanan.jumlah} x {formatPrice(pesanan.product_size.harga_akhir)}
                                </span>
                                <span>{formatPrice(pesanan.total_harga)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="py-4 flex justify-between items-baseline">
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">Total</span>
                        <span className="text-lg font-bold">{formatPrice(pesanan.total_harga)}</span>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t-2 border-dashed border-border text-center">
                        <p className="text-[10px] text-muted-foreground">
                            Terima kasih atas pesanan Anda
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

PesananInvoice.layout = {
    breadcrumbs: [
        { title: 'Pesanan', href: '/dashboard/pesanan' },
        { title: 'Invoice', href: '#' },
    ],
};