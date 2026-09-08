<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ str_pad($pesanan->id, 6, '0', STR_PAD_LEFT) }}</title>
    <style>
        * {
            box-sizing: border-box;
        }
        @page {
            margin: 0;
        }
        body {
            font-family: 'Courier New', 'DejaVu Sans Mono', monospace;
            font-size: 11px;
            color: #111;
            margin: 0;
            padding: 0;
            /* Latar abu-abu di luar "kertas struk" biar struknya keliatan
               ngambang di tengah, sama kayak halaman preview di React. */
            background-color: #f2f2f2;
        }

        .page {
            width: 100%;
            padding: 24px 0;
        }

        /* "Kertas" struk itu sendiri — sempit & rata tengah */
        .receipt {
            width: 300px;
            margin: 0 auto;
            background: #fff;
            border: 1px solid #ddd;
            padding: 20px 18px;
        }

        .section {
            padding: 12px 0;
            border-bottom: 1px dashed #999;
        }
        .section:first-child {
            padding-top: 0;
        }
        .section:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }

        .center {
            text-align: center;
        }

        .brand-name {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0;
        }
        .brand-sub {
            font-size: 10px;
            color: #666;
            margin: 4px 0 0;
        }

        .row {
            width: 100%;
        }
        .row td {
            padding: 1px 0;
            vertical-align: top;
        }
        .row .label {
            color: #666;
        }
        .row .value {
            text-align: right;
        }

        .buyer-name {
            font-weight: bold;
            margin: 0 0 2px;
        }
        .buyer-line {
            color: #444;
            margin: 0 0 2px;
            line-height: 1.5;
        }
        .buyer-note {
            color: #666;
            font-style: italic;
            margin: 6px 0 0;
        }

        .item-name {
            margin: 0 0 4px;
        }
        .item-sub {
            color: #666;
        }
        .item-sub .value {
            color: #111;
        }

        .total-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #666;
        }
        .total-value {
            font-size: 16px;
            font-weight: bold;
            text-align: right;
        }

        .footer-note {
            font-size: 9px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="receipt">

            {{-- Header toko --}}
            <div class="section center">
                <p class="brand-name">{{ config('app.name') }}</p>
                <p class="brand-sub">Invoice Pesanan</p>
            </div>

            {{-- Meta transaksi (TANPA status, sesuai versi preview) --}}
            <div class="section">
                <table class="row">
                    <tr>
                        <td class="label">No. Invoice</td>
                        <td class="value">#{{ str_pad($pesanan->id, 6, '0', STR_PAD_LEFT) }}</td>
                    </tr>
                    <tr>
                        <td class="label">Metode Bayar</td>
                        <td class="value">
                            @php
                                $metodeLabel = [
                                    'transfer' => 'Transfer Bank',
                                    'e-wallet' => 'E-Wallet',
                                    'qris' => 'QRIS',
                                    'cod' => 'COD',
                                ];
                            @endphp
                            {{ $metodeLabel[$pesanan->metode_pembayaran] ?? ucfirst($pesanan->metode_pembayaran) }}
                        </td>
                    </tr>
                </table>
            </div>

            {{-- Data pembeli --}}
            <div class="section">
                <p class="buyer-name">{{ $pesanan->nama_pembeli }}</p>
                <p class="buyer-line">{{ $pesanan->no_wa }}</p>
                <p class="buyer-line">{{ $pesanan->alamat }}</p>
                @if($pesanan->catatan)
                    <p class="buyer-note">&ldquo;{{ $pesanan->catatan }}&rdquo;</p>
                @endif
            </div>

            {{-- Item --}}
            <div class="section">
                <p class="item-name">
                    {{ $pesanan->productSize->product->nama }} ({{ $pesanan->productSize->Ukuran }}ml)
                </p>
                <table class="row item-sub">
                    <tr>
                        <td class="label">
                            {{ $pesanan->jumlah }} x Rp {{ number_format($pesanan->productSize->harga_akhir, 0, ',', '.') }}
                        </td>
                        <td class="value">
                            Rp {{ number_format($pesanan->total_harga, 0, ',', '.') }}
                        </td>
                    </tr>
                </table>
            </div>

            {{-- Total --}}
            <div class="section">
                <table class="row">
                    <tr>
                        <td class="total-label">Total</td>
                        <td class="total-value">Rp {{ number_format($pesanan->total_harga, 0, ',', '.') }}</td>
                    </tr>
                </table>
            </div>

            {{-- Footer --}}
            <div class="section center">
                <p class="footer-note">Terima kasih atas pesanan Anda</p>
            </div>

        </div>
    </div>
</body>
</html>