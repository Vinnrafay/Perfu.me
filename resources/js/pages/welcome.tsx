import { Head, Link } from '@inertiajs/react';
import Navbar from '@/components/blocks/navbar';
import { Star, CheckCircle2, Recycle, ArrowRight, BadgeCheck, Truck, Sparkles, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"

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
            <Navbar />

            <main className="min-h-screen w-full bg-background text-foreground pb-24 space-y-16">
                <section className="flex flex-col gap-16 w-full max-w-7xl mx-auto px-5 py-16">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div className="space-y-8">
                            <div className="max-w-5xl space-y-3">
                                <h1 className="text-5xl leading-none tracking-tight text-balance text-foreground md:text-7xl font-semibold">
                                    Smell <span className="font-heading italic">Good</span>, Feel <span className="font-heading italic">Confident</span>.
                                </h1>
                                <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                                    Temukan parfum-mu, formula bersih, dan paduan aroma khas yang dirancang untukmu, tahan dari pagi hingga malam.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <Button asChild size="lg" className="gap-2 rounded-full px-5">
                                    <Link href="/products">
                                        Eksplor Katalog Kami
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="rounded-full px-5">
                                    <Link href="/contact">
                                        Hubungi WhatsApp Owner
                                        <WhatsAppIcon />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
                            <div className="relative aspect-square w-full rounded-t-[2rem] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJhZ3JhbmNlfGVufDB8fDB8fHww"
                                    alt="Perfume Bottle"
                                    className="absolute inset-0 bg-red-500 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                                />
                            </div>
                            <div className="relative aspect-square w-full rounded-r-[2rem] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZnJhZ3JhbmNlfGVufDB8fDB8fHww"
                                    alt="Perfume Bottle"
                                    className="absolute inset-0 bg-green-500 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                                />
                            </div>
                            <div className="relative aspect-square w-full rounded-l-[2rem] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJhZ3JhbmNlfGVufDB8fDB8fHww"
                                    alt="Perfume Bottle"
                                    className="absolute inset-0 bg-indigo-500 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                                />
                            </div>
                            <div className="relative aspect-square w-full rounded-b-[2rem] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1595425959632-34f2822322ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZyYWdyYW5jZXxlbnwwfHwwfHx8MA%3D%3D"
                                    alt="Perfume Bottle"
                                    className="absolute inset-0 bg-yellow-500 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
                                Wangi Khas yang <span className="font-heading italic">Berkarakter</span>
                            </h2>

                            {/* Rating Summary */}
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                    ))}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium">4.9 (100 reviews)</span>
                                    <div className="flex -space-x-2">
                                        <img src="https://i.pravatar.cc/100?img=1" alt="user" className="w-7 h-7 rounded-full border-2 border-background" />
                                        <img src="https://i.pravatar.cc/100?img=5" alt="user" className="w-7 h-7 rounded-full border-2 border-background" />
                                        <img src="https://i.pravatar.cc/100?img=9" alt="user" className="w-7 h-7 rounded-full border-2 border-background" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

                            {/* Left Large Card */}
                            <div className="lg:col-span-7 relative h-[450px] sm:h-[600px] rounded-3xl overflow-hidden group">
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
                            <div className="lg:col-span-5 flex flex-col gap-3">

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
                    </div>
                </section>

                <section className="w-full max-w-4xl mx-auto text-center flex flex-col items-center">
                    {/* Polaroid Icon */}
                    <div className="bg-background w-14 h-14 shadow-xl rounded-full rotate-3 mb-8 border border-border overflow-hidden">
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

                {/* 4. PRODUCT SHOWCASE (Floating Tooltips) */}
                <section className="w-full max-w-7xl mx-auto px-5">
                    <div className="relative w-full aspect-square sm:aspect-video bg-secondary/50 rounded-3xl flex items-center justify-center overflow-hidden">

                        {/* Main Center Image */}
                        <img
                            src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=1200"
                            alt="Product Collection"
                            className="w-full h-full object-cover"
                        />

                        {/* Tooltip 1 (Left) */}
                        <div className="absolute top-[60%] sm:top-[70%] left-[10%] sm:left-[20%] group cursor-pointer">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg absolute -top-1 -left-1 z-10" />
                            <div className="bg-background/95 backdrop-blur-sm border border-border p-2 pr-4 rounded-xl shadow-2xl flex items-center gap-4 transition-transform group-hover:-translate-y-1">
                                <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 object-cover rounded-md" alt="Thumb" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Unisex</p>
                                    <p className="text-sm font-medium">Vannessence EDP</p>
                                    <p className="text-xs text-muted-foreground">Rp 135.000</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>

                        {/* Tooltip 2 (Right) */}
                        <div className="absolute top-[35%] right-[5%] sm:right-[15%] group cursor-pointer">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg absolute -top-1 -left-1 z-10" />
                            <div className="bg-background/95 backdrop-blur-sm border border-border p-2 pr-4 rounded-xl shadow-2xl flex items-center gap-4 transition-transform group-hover:-translate-y-1">
                                <img src="https://images.unsplash.com/photo-1523293115678-02462479650b?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 object-cover rounded-md" alt="Thumb" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Men</p>
                                    <p className="text-sm font-medium">Dynamyst EDP</p>
                                    <p className="text-xs text-muted-foreground">Rp 125.000</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>

                    </div>
                </section>

            </main>
        </>
    );
}

function WhatsAppIcon() {
    return (
        <svg role="img" fill="currentcolor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
    )
}