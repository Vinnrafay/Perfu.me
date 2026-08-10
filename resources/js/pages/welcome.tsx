import { Head, Link } from '@inertiajs/react';
import { Star, CheckCircle2, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const reviews = [
    {
        name: "Bagas",
        username: "@bagas_pratama",
        body: "Wanginya enak banget dan tahan lama seharian. Parfum lokal terfavorit!",
        img: "https://avatar.vercel.sh/bagas",
    },
    {
        name: "Siti",
        username: "@sitinur",
        body: "Kualitasnya juara padahal harganya terjangkau. Auto reorder lagi sih ini.",
        img: "https://avatar.vercel.sh/siti",
    },
    {
        name: "Dimas",
        username: "@dimas_a",
        body: "Baru pertama coba langsung suka. Banyak yang nanyain pakenya parfum apa.",
        img: "https://avatar.vercel.sh/dimas",
    },
    {
        name: "Clara",
        username: "@clara_sella",
        body: "Aromanya mewah dan pas banget buat dipake harian. Keren banget brand lokal satu ini!",
        img: "https://avatar.vercel.sh/clara",
    },
    {
        name: "Rian",
        username: "@rian_feb",
        body: "Blend-nya rapi dan gak nyengat di hidung. Luar biasa mantap!",
        img: "https://avatar.vercel.sh/rian",
    },
    {
        name: "Nabila",
        username: "@nabilart",
        body: "Packaging rapi, spray-nya halus, dan aromanya tahan lama. Rekomended!",
        img: "https://avatar.vercel.sh/nabila",
    },
];

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)
const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string
    name: string
    username: string
    body: string
}) => {
    return (
        <figure
            className={cn(
                "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border bg-card hover:bg-muted/50",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm line-clamp-2">{body}</blockquote>
        </figure>
    )
}

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />

            <main className="min-h-screen w-full bg-background text-foreground pb-16 space-y-16">
                {/* Hero Section */}
                <section className="min-h-screen 2xl:min-h-fit flex flex-col items-center justify-center gap-16 w-full max-w-7xl mx-auto px-5 pt-16 2xl:pt-24">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div className="space-y-8">
                            <div className="max-w-5xl space-y-3">
                                <h1 className="text-5xl leading-none tracking-tight text-balance text-foreground md:text-7xl font-semibold">
                                    Wangi Gak Harus <span className="font-heading italic">Mahal</span>.
                                </h1>
                                <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                                    Temukan parfum-mu, formula bersih, dan paduan aroma khas yang dirancang untukmu, tahan dari pagi hingga malam.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <Button asChild size="lg">
                                    <Link href="/products">
                                        Lihat Koleksi Kami
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                                <Button onClick={() => window.open('https://wa.me/6281383415432', '_blank')} variant="outline" size="lg">
                                    Chat Via WhatsApp
                                    <WhatsAppIcon />
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
                            <div className="relative aspect-square w-full rounded-tl-[2rem] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJhZ3JhbmNlfGVufDB8fDB8fHww"
                                    alt="Perfume Bottle"
                                    className="absolute inset-0 bg-muted w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                                />
                            </div>
                            <div className="relative aspect-square w-full rounded-tr-[2rem] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZnJhZ3JhbmNlfGVufDB8fDB8fHww"
                                    alt="Perfume Bottle"
                                    className="absolute inset-0 bg-muted w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                                />
                            </div>
                            <div className="relative aspect-square w-full rounded-bl-[2rem] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJhZ3JhbmNlfGVufDB8fDB8fHww"
                                    alt="Perfume Bottle"
                                    className="absolute inset-0 bg-muted w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                                />
                            </div>
                            <div className="relative aspect-square w-full rounded-br-[2rem] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1595425959632-34f2822322ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZyYWdyYW5jZXxlbnwwfHwwfHx8MA%3D%3D"
                                    alt="Perfume Bottle"
                                    className="absolute inset-0 bg-muted w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full max-w-7xl mx-auto px-5 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <img src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJhZ3JhbmNlfGVufDB8fDB8fHww"
                            alt="" className="w-full aspect-square object-cover rounded-3xl" />

                        <div className="flex flex-col justify-center gap-6">
                            <div className="space-y-3">
                                <h3 className="text-5xl font-semibold">Evanessence</h3>
                                <p className="text-base text-muted-foreground">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi ducimus labore nostrum. Quas beatae possimus, sunt dolore ad inventore velit iste animi delectus, facilis atque minima a nobis, nemo laboriosam non explicabo autem quod.
                                </p>
                            </div>

                            <p className="text-4xl font-medium">Rp199.000</p>

                            <Button className="w-fit">
                                Lihat Detail
                                <ArrowUpRight className="size-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col justify-center gap-6 order-last md:order-first">
                            <div className="space-y-3">
                                <h3 className="text-5xl font-semibold">Dynamyst</h3>
                                <p className="text-base text-muted-foreground">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi ducimus labore nostrum. Quas beatae possimus, sunt dolore ad inventore velit iste animi delectus, facilis atque minima a nobis, nemo laboriosam non explicabo autem quod.
                                </p>
                            </div>

                            <p className="text-4xl font-medium">Rp199.000</p>

                            <Button className="w-fit">
                                Lihat Detail
                                <ArrowUpRight className="size-4" />
                            </Button>
                        </div>

                        <img src="https://images.unsplash.com/photo-1595425959632-34f2822322ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZyYWdyYW5jZXxlbnwwfHwwfHx8MA%3D%3D"
                            alt="" className="w-full aspect-square object-cover rounded-3xl" />
                    </div>
                </section>

                <section className="w-full max-w-4xl mx-auto text-center flex flex-col items-center">
                    <div className="bg-background w-14 h-14 rounded-full rotate-3 my-6 border border-border overflow-hidden">
                        <img
                            src="https://i.pravatar.cc/100?img=8"
                            alt="Mini"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl leading-tight font-medium mb-8 max-w-3xl">
                        "Saya menjadi lebih percaya diri dari sebelumnya. Rasanya saya memakai aroma yang benar-benar mencerminkan diri saya!"
                    </h2>

                    <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                    <p className="font-semibold text-sm">Bang Aris</p>
                    <p className="text-xs text-muted-foreground">Verified Buyer</p>
                </section>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                    <Marquee pauseOnHover className="[--duration:30s]">
                        {firstRow.map((review) => (
                            <ReviewCard key={review.username} {...review} />
                        ))}
                    </Marquee>
                    <Marquee reverse pauseOnHover className="[--duration:30s]">
                        {secondRow.map((review) => (
                            <ReviewCard key={review.username} {...review} />
                        ))}
                    </Marquee>
                    <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
                    <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
                </div>

                {/* PRODUCT SHOWCASE */}
                <section className="w-full max-w-7xl mx-auto px-5 space-y-6">
                    {/* Header */}
                    <h2 className="text-5xl md:text-7xl text-center font-semibold tracking-tight leading-[1.1]">
                        Wangi yang <span className="font-heading italic">Berkarakter</span>
                    </h2>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

                        {/* Left Large Card */}
                        <div className="relative h-[450px] sm:h-[600px] rounded-3xl overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&q=80&w=1000"
                                alt="Elegance"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            {/* Floating Badge */}
                            <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-background/95 backdrop-blur-md p-5 rounded-2xl shadow-lg max-w-xs">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    <span className="font-semibold text-sm">Tahan lama pagi sampai malam</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Setiap aroma diracik dengan cermat menggunakan bahan-bahan premium dengan kualitas tertinggi.
                                </p>
                            </div>
                        </div>

                        {/* Right Stacked Cards */}
                        <div className="flex flex-col gap-3">

                            {/* Top Small Card - Light */}
                            <div className="flex-1 bg-secondary rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center min-h-[280px]">
                                <div className="relative z-10 max-w-[50%]">
                                    <h3 className="text-2xl font-medium mb-3">Evanessence</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, a.
                                    </p>
                                </div>
                                {/* Bottle Image Absolute */}
                                <img
                                    src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400"
                                    alt="Bottle"
                                    className="absolute right-0 w-1/2 h-auto object-cover"
                                />
                            </div>

                            {/* Bottom Small Card - Dark */}
                            <div className="flex-1 bg-primary rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center min-h-[280px]">
                                <div className="relative z-10 max-w-[50%]">
                                    <h3 className="text-2xl text-primary-foreground font-medium mb-3">Dynamyst</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, a.
                                    </p>
                                </div>
                                {/* Bottle Image Absolute */}
                                <img
                                    src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400"
                                    alt="Bottle"
                                    className="absolute right-0 w-1/2 h-auto object-cover"
                                />
                            </div>

                        </div>
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

            </main>
        </>
    );
}

const faqs = [
    {
        question: "Berapa lama waktu pengiriman parfum setelah pemesanan?",
        answer: "Pengiriman biasanya memakan waktu 1-3 hari kerja untuk Jabodetabek dan 3-5 hari kerja untuk luar daerah/pulau. Pengiriman gratis ongkir untuk pemesanan dari dalam Pulau Jawa.",
    },
    {
        question: "Berapa lama daya tahan (longevity) parfum ini?",
        answer: "Rata-rata parfum kami bertahan 6-8 jam di kulit dan hingga 12 jam jika disemprotkan ke pakaian, tergantung pada jenis aktivitas dan tempat penyimpanan.",
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