import { Head, Link } from '@inertiajs/react';
import { Star, ArrowRight, ArrowUpRight, Compass } from 'lucide-react';
import { detail as productDetail } from '@/routes/products';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type ProductSize = {
    id: number;
    Ukuran: number;
    Harga: number | string;
    Diskon: number | string | null;
    harga_akhir: number | string;
};

type SignatureProduct = {
    id: number;
    nama: string;
    Deskripsi: string;
    Foto: string | null;
    sizes: ProductSize[];
};

type Testimonial = {
    id: number;
    nama: string;
    email: string;
    komentar: string;
    rating: number;
};

type WelcomeProps = {
    testimonials: Testimonial[];
    signatureProducts: SignatureProduct[];
};

const ReviewCard = ({
    testimonial,
}: { testimonial: Testimonial }) => {

    return (
        <figure
            className={cn(
                "relative flex flex-col justify-between gap-4 h-full w-72 overflow-hidden rounded-2xl border p-4",
                "border bg-card hover:bg-muted/50",
            )}
        >
            <div className="space-y-2">
                <div className="flex items-center gap-1" aria-label={`${testimonial.rating} dari 5 bintang`}>
                    <div className="flex items-center gap-0.5">
                        {[...Array(testimonial.rating)].map((_, index) => (
                            <Star key={index} className="size-4 fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">({testimonial.rating}/5)</span>
                </div>
                <blockquote className="text-sm text-left">{testimonial.komentar}</blockquote>
            </div>

            <div className="flex flex-row items-center text-left gap-2">
                <Avatar>
                    <AvatarFallback>{testimonial.nama.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium truncate">
                        {testimonial.nama}
                    </figcaption>
                    <p className="text-xs font-medium text-muted-foreground truncate">
                        {testimonial.email}
                    </p>
                </div>
            </div>
        </figure>
    )
}

const formatPrice = (price: number | string): string =>
    `Rp${Number(price).toLocaleString('id-ID')}`;

const productImage = (foto: string | null): string =>
    foto ? (foto.startsWith('http') || foto.startsWith('/images') ? foto : `/storage/${foto}`) : '/images/FotoEnchancedParfum.svg';

const benefits = [
    {
        number: "01",
        title: "Tahan Lama",
        description:
            "Dirancang untuk menemani aktivitasmu dari pagi hingga malam.",
    },
    {
        number: "02",
        title: "Aroma Berkarakter",
        description:
            "Setiap aroma memiliki karakter unik yang dirancang untuk meninggalkan kesan.",
    },
    {
        number: "03",
        title: "Harga Bersahabat",
        description:
            "Nikmati aroma berkualitas tanpa harus mengeluarkan biaya yang berlebihan.",
    },
    {
        number: "04",
        title: "Dibuat dengan Cermat",
        description:
            "Setiap produk dipersiapkan dengan perhatian pada kualitas dan konsistensi aroma.",
    },
];

export default function Welcome({ testimonials, signatureProducts }: WelcomeProps) {
    return (
        <>
            <Head title="Welcome" />

            <main className="relative -top-16 min-h-screen w-full pt-24 md:pt-0 pb-16 space-y-16">
                {/* Hero Section */}
                <section className="md:h-screen flex flex-col md:flex-row items-center gap-10 w-full h-full max-w-7xl mx-auto px-5">
                    <div className="md:flex-1 space-y-6">
                        <div className="max-w-5xl space-y-3">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight text-balance text-foreground font-medium">
                                Wangi Gak Harus <span className="font-heading italic">Mahal</span>.
                            </h1>
                            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg text-balance">
                                Temukan parfum-mu, formula bersih, dan paduan aroma khas yang dirancang untukmu, tahan dari pagi hingga malam.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button asChild size="lg" className="w-full md:w-fit">
                                <Link href="/products">
                                    Lihat Koleksi Kami
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                            <Button onClick={() => window.open('https://wa.me/6281383415432', '_blank')} variant="outline" size="lg" className="w-full md:w-fit">
                                Chat Via WhatsApp
                                <WhatsAppIcon />
                            </Button>
                        </div>
                    </div>

                    <div className="md:flex-1 w-full h-full flex flex-col items-center justify-center md:py-18">
                        <div className="relative aspect-square w-full rounded-3xl overflow-hidden">
                            <img
                                src="/images/BannerAboutMe.png"
                                alt="Perfume Bottle"
                                className="absolute bg-muted w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                            />
                        </div>
                    </div>
                </section>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                    <Marquee className="[--duration:120s] bg-primary gap-0">
                        <div className="w-full overflow-hidden border-y border-muted-foreground border-dashed bg-primary py-3">
                            <div className="flex whitespace-nowrap text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground/80">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <span key={i} className="mr-6 flex items-center gap-6">
                                        Wangi Gak Harus Mahal
                                        <span className="text-primary-foreground/40">•</span>
                                        Smell Good, Feel Confident
                                        <span className="text-primary-foreground/40">•</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Marquee>
                    <div className="from-background/50 pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r"></div>
                    <div className="from-background/50 pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"></div>
                </div>

                <section className="w-full max-w-7xl mx-auto px-5 space-y-6">
                    <h2 className="text-5xl md:text-6xl lg:text-7xl text-center font-medium tracking-tight leading-[1.1]">
                        Our <span className="font-heading italic">Signature</span> Scent
                    </h2>

                    <div className="space-y-12 md:space-y-6">
                        {signatureProducts.map((product, index) => {
                            const smallestSize = product.sizes[0];
                            const hasDiscount = Number(smallestSize?.Diskon ?? 0) > 0;
                            const productDetails = (
                                <div className="flex flex-col justify-center h-full gap-6">
                                    <div className="space-y-3">
                                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold">{product.nama}</h3>
                                        <p className="text-base text-muted-foreground line-clamp-2">{product.Deskripsi}</p>
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-baseline gap-3 text-2xl md:text-3xl lg:text-4xl font-medium">
                                            {hasDiscount ?
                                                <span>{formatPrice(smallestSize.harga_akhir)}</span> : null}
                                            <span className="text-muted-foreground line-through">{formatPrice(smallestSize.Harga)}</span>
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">Mulai dari {smallestSize.Ukuran} ml</p>
                                    </div>
                                    <Button asChild className="md:w-fit">
                                        <Link href={productDetail(product.id).url}>
                                            Lihat Detail Produk
                                            <ArrowUpRight className="size-4" />
                                        </Link>
                                    </Button>
                                </div>
                            );

                            return (
                                <div key={product.id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {index % 2 === 0 ? (
                                        <>
                                            <img src={productImage(product.Foto)} alt={product.nama} className="bg-muted w-full aspect-square object-cover rounded-3xl" />
                                            {productDetails}
                                        </>
                                    ) : (
                                        <>
                                            <div className="order-last md:order-first">{productDetails}</div>
                                            <img src={productImage(product.Foto)} alt={product.nama} className="bg-muted w-full aspect-square object-cover rounded-3xl" />
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Why us Section */}
                <section className="w-full max-w-7xl mx-auto px-5 space-y-6">
                    <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">

                        {/* Section Heading */}
                        <div>
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight sm:text-6xl">
                                Lebih dari sekadar <span className="font-heading italic">wangi.</span>
                            </h2>

                            <p className="mt-6 max-w-md text-lg text-muted-foreground">
                                Kami percaya parfum bukan hanya tentang aroma,
                                tetapi tentang karakter, kesan, dan momen yang
                                ingin kamu tinggalkan.
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="divide-y border-y">
                            {benefits.map((benefit) => (
                                <div
                                    key={benefit.number}
                                    className="grid gap-3 py-7 sm:grid-cols-[64px_1fr]"
                                >
                                    <span className="text-sm text-muted-foreground">
                                        {benefit.number}
                                    </span>

                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-medium">
                                            {benefit.title}
                                        </h3>

                                        <p className="max-w-lg text-sm leading-6 text-muted-foreground">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="w-full max-w-7xl mx-auto text-center flex flex-col items-center p-5 space-y-6">
                    <div className="space-y-3">
                        <h2 className="text-5xl md:text-6xl lg:text-7xl text-center font-medium tracking-tight">
                            Apa kata mereka?
                        </h2>

                        <p className="text-lg text-muted-foreground">
                            Mereka telah mempercayai kami dalam memberikan wangi terbaik.
                        </p>
                    </div>

                    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                        <Marquee pauseOnHover className="[--duration:030s]">
                            {testimonials.map((testimonial) => (
                                <ReviewCard key={testimonial.id} testimonial={testimonial} />
                            ))}
                        </Marquee>
                        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-linear-to-r"></div>
                        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-linear-to-l"></div>
                    </div>
                </section>

                {/* Purchase Steps & Informations Section */}
                <section className="w-full max-w-7xl mx-auto px-5 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Card className="row-span-2 text-center md:text-left">
                            <CardHeader>
                                <CardTitle className="text-3xl font-medium font-sans">
                                    Langkah Pembelian
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {stepPembelian.map((step) => (
                                        <div key={step.number} className="flex flex-col md:flex-row gap-3 md:gap-6 items-center">
                                            <div className="flex items-center justify-center h-10 w-10 aspect-square bg-muted text-primary font-medium rounded-full">
                                                {step.number}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-lg font-medium">{step.title}</h3>
                                                <p className="text-muted-foreground">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative justify-between min-h-64 bg-primary text-primary-foreground border-muted-foreground">
                            <CardHeader className="z-10">
                                <CardTitle className="text-3xl font-medium font-sans">
                                    Tersedia Refill Parfum
                                </CardTitle>
                                <CardDescription className="max-w-sm text-muted/80">
                                    Ingin mengisi ulang parfum favoritmu? Refill tersedia untuk pembelian langsung di tempat.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="z-10">
                                <Button variant="secondary" className="px-4">
                                    Lihat Refill
                                    <ArrowRight />
                                </Button>
                            </CardContent>
                            <img
                                src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZnJhZ3JhbmNlfGVufDB8fDB8fHww"
                                alt="Perfume Bottle"
                                className="absolute -bottom-42 md:-bottom-32 right-16 md:right-24 w-42 md:w-52 h-64 object-cover object-center -rotate-12 border-6 border-b-24 border-primary-foreground z-2"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJhZ3JhbmNlfGVufDB8fDB8fHww"
                                alt="Perfume Bottle"
                                className="absolute -bottom-34 md:-bottom-20 -right-12 md:-right-6 w-42 md:w-52 h-64 object-cover object-center -rotate-6 border-6 border-b-24 border-primary-foreground"
                            />
                            <div className="absolute inset-0 h-full bg-linear-to-t from-primary via-transparent to-transparent z-5" />
                        </Card>
                        <Card className="relative justify-between min-h-64 bg-secondary text-secondary-foreground">
                            <CardHeader className="z-10">
                                <CardTitle className="text-3xl font-medium font-sans">
                                    Jadi Reseller/Dropshipper
                                </CardTitle>
                                <CardDescription className="max-w-sm">
                                    Ingin menjual produk kami? Dapatkan informasi mengenai harga partner bisnis dan ketentuan kerja sama.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="z-10">
                                <Button onClick={() => window.open('https://wa.me/6281383415432?text=Halo, saya ingin menjadi reseller/dropshipper.', '_blank')} className="px-4">
                                    Hubungi Kami
                                    <WhatsAppIcon />
                                </Button>
                            </CardContent>
                            <img
                                src="/images/RawNoShadow.png"
                                alt="Perfume Bottle"
                                className="absolute top-12 -right-42 md:-right-36 lg:-right-42 w-full h-fit object-cover object-center"
                            />
                            <div className="absolute inset-0 h-full bg-linear-to-t from-secondary md:from-secondary/85 to-transparent z-1" />
                        </Card>
                    </div>
                </section>


                <section className="w-full max-w-7xl mx-auto px-5 space-y-6">
                    <div className="space-y-1 text-center">
                        <h2 className="text-5xl md:text-7xl font-semibold">
                            FAQ
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Pertanyaan yang sering diajukan oleh pelanggan kami.
                        </p>
                    </div>
                    <Accordion
                        type="single"
                        collapsible
                        defaultValue="faq-0"
                    >
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`faq-${index}`}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>

                <section className="w-full max-w-7xl mx-auto px-5 space-y-6">
                    <div className="relative flex flex-col justify-center overflow-hidden rounded-3xl bg-foreground bg-grid-dark p-5 md:p-16 w-full min-h-86">
                        <div className="relative z-10 max-w-xl">

                            <h2 className="text-4xl font-medium tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                                Sudah menemukan{" "} <br />
                                <span className="font-heading italic">
                                    wangi favoritmu?
                                </span>
                            </h2>

                            <p className="mt-6 max-w-lg text-sm text-primary-foreground/90 sm:text-base">
                                Temukan aroma yang cocok menemani
                                setiap momen dan menjadi bagian dari
                                karaktermu.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    asChild
                                    variant="secondary"
                                    size="lg"
                                >
                                    <Link href="/products">
                                        Jelajahi Koleksi Kami
                                        <Compass />
                                    </Link>
                                </Button>

                                <Button onClick={() => window.open('https://wa.me/6281383415432', '_blank')}
                                    variant="outline"
                                    size="lg"
                                    className="bg-transparent text-primary-foreground hover:bg-primary/10 hover:text-primary-foreground"
                                >
                                    Hubungi Kami
                                    <WhatsAppIcon />
                                </Button>
                            </div>
                        </div>
                        <img
                            src="/images/RawNoShadow.png"
                            alt="Perfume Bottle"
                            className="absolute top-0 -right-24 md:-right-42 lg:-right-64 w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 h-full bg-linear-to-t from-primary md:from-primary/85 via-primary/80 md:via-primary/25 to-transparent z-1" />
                    </div>
                </section>
            </main>
        </>
    );
}

const stepPembelian = [
    {
        number: "01",
        title: "Pilih Produk",
        description:
            "Telusuri koleksi parfum kami dan pilih aroma yang paling sesuai dengan preferensimu.",
    },
    {
        number: "02",
        title: "Masukkan ke Keranjang",
        description:
            "Tambahkan parfum yang kamu inginkan ke keranjang dan tentukan jumlah yang ingin dipesan.",
    },
    {
        number: "03",
        title: "Checkout via WhatsApp",
        description:
            "Periksa pesananmu lalu lanjutkan checkout untuk mengirimkan daftar pesanan langsung ke WhatsApp kami.",
    },
    {
        number: "04",
        title: "Konfirmasi Pesanan",
        description:
            "Hubungi admin melalui WhatsApp untuk mengonfirmasi pesanan, ketersediaan produk, total pembayaran, dan detail pengiriman.",
    },
    {
        number: "05",
        title: "Pesanan Diproses",
        description:
            "Setelah pembayaran dikonfirmasi, pesananmu akan segera diproses dan dikirim ke alamat tujuan.",
    },
];

const faqs = [
    {
        question: "Berapa lama waktu pengiriman parfum setelah pemesanan?",
        answer: "Pengiriman biasanya memakan waktu 1-3 hari kerja untuk Jabodetabek dan 3-5 hari kerja untuk luar daerah/pulau. Pengiriman gratis ongkir untuk pemesanan dari dalam Pulau Jawa.",
    },
    {
        question: "Bagaimana jika botol pecah atau spray rusak saat sampai?",
        answer: "Kami memberikan Garansi 100% Ganti Baru. Cukup kirimkan video unboxing tanpa jeda ke customer service kami dalam waktu maksimal 2x24 jam setelah barang diterima.",
    },
    {
        question: "Apakah parfum ini aman untuk kulit sensitif?",
        answer: "Ya, parfum kami diformulasikan dengan bahan yang aman dan telah terdaftar di BPOM. Namun, jika Anda memiliki riwayat kulit sangat sensitif, disarankan melakukan tes patch di pergelangan tangan terlebih dahulu.",
    },
    {
        question: "Apakah parfum ini menggunakan alkohol?",
        answer: "Ya, kami menggunakan alkohol standar kosmetik/perfumer's grade yang aman untuk kulit dan berfungsi menyebarkan aroma secara optimal.",
    },
    {
        question: "Bagaimana cara pakai parfum agar wanginya lebih tahan lama?",
        answer: "Semprotkan pada titik-titik nadi (pergelangan tangan, leher, belakang telinga) dari jarak 15–20 cm. Pastikan kulit dalam kondisi lembap (bisa memakai unscented lotion terlebih dahulu).",
    },
    {
        question: "Bagaimana cara menyimpan parfum yang benar?",
        answer: "Simpan di tempat yang sejuk, kering, dan terhindar dari paparan sinar matahari langsung. Hindari menyimpan parfum di dalam mobil atau kamar mandi karena perubahan suhunya drastis.",
    },
];

function WhatsAppIcon() {
    return (
        <svg role="img" fill="currentcolor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
    )
}