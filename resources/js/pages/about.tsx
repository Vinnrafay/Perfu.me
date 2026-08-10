import Navbar from "@/components/blocks/navbar";
import { Marquee } from "@/components/ui/marquee"

export default function AboutUs() {
  return (
    <>
      <Navbar />

      <main className="flex min-h-screen flex-col items-center bg-background text-foreground overflow-hidden">
        
        {/* Hero Section — Simpel & Sejajar */}
        <section className="mx-auto w-full max-w-7xl px-5 pt-16 pb-20 lg:py-28">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            {/* Bagian Kiri: Teks */}
            <div className="flex-1 flex flex-col justify-center gap-6 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                Smell Good. Feel Confident.
              </p>
              <h1 className="text-5xl font-semibold capitalize leading-[1.1] sm:text-6xl md:text-7xl">
                About <span className="font-heading italic">Perfu.Me</span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                Perfu.me lahir dari sebuah keyakinan sederhana: setiap orang berhak
                tampil harum tanpa harus mengeluarkan biaya yang mahal. Kami
                menghadirkan parfum dengan kualitas aroma premium, karakter yang
                khas, dan harga yang tetap ramah di kantong.
              </p>
            </div>

            <div className="w-full lg:w-[400px] flex-shrink-0 flex justify-center">
              <div className="w-full rounded-2xl overflow-hidden group">
                <img 
                  src="/images/RawNoShadow.png" 
                  alt="Perfu.me Elegance" 
                  className="w-full h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Running Text Marquee */}
           <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                        <Marquee className="[--duration:60s] bg-primary gap-0">
                            <div className="w-full overflow-hidden border-y border-muted-foreground border-dashed bg-primary py-3">
                                <div className="flex whitespace-nowrap text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground/80">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <span key={i} className="mx-6 flex items-center gap-6">
                                            Wangi Gak Harus Mahal
                                            <span className="text-primary-foreground/40">•</span>
                                            Smell Good. Feel Confident
                                            <span className="text-primary-foreground/40">•</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Marquee>
                        <div className="from-background/50 pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
                        <div className="from-background/50 pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
                    </div>

        {/* Story Section */}
        <section className="grid w-full max-w-7xl grid-cols-1 gap-12 border-t border-border px-5 py-20 sm:grid-cols-2 items-center">
          
          {/* Foto Story */}
          <div className="relative w-full h-[400px] overflow-hidden rounded-2xl border border-border group">
            <img 
              src="/images/BannerAboutMe.png" 
              alt="Dua Karakter Perfu.me" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Kami memulai perjalanan ini dengan dua signature scent
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Dirancang untuk mewakili dua karakter berbeda, satu untuk mereka
              yang aktif dan penuh semangat, satu lagi untuk mereka yang
              menyukai kelembutan dan ketenangan.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Di Perfu.me, kami tidak ingin menghadirkan puluhan aroma tanpa
              karakter. Kami ingin setiap parfum memiliki identitas yang
              kuat, mudah dikenali, dan mampu menjadi bagian dari kepercayaan
              diri penggunanya.
            </p>
          </div>
        </section>

    {/* Two Scents Section — Botol PNG Transparan Extra Large */}
    <section className="w-full border-t border-border">
      <div className="grid w-full grid-cols-1 lg:grid-cols-2">
        
        {/* Card Dynamyst (Gelap) */}
        <div className="group relative flex min-h-[500px] flex-col justify-center overflow-hidden bg-primary p-8 sm:p-12 lg:p-16 text-primary-foreground">
          
          {/* Container Konten Side-by-Side */}
          <div className="my-auto flex flex-col items-center justify-between gap-8 sm:flex-row">
            
            {/* Teks Deskripsi */}
            <div className="z-10 flex w-full flex-col gap-3 sm:w-[48%]">
              <h3 className="font-heading text-5xl italic sm:text-6xl">Dynamyst</h3>
              <p className="text-sm leading-relaxed text-primary-foreground/70 sm:text-base">
                Hadir untuk mereka yang aktif, percaya diri, dan penuh
                semangat. Perpaduan aroma fresh, sporty, clean, dengan
                sentuhan hangat dan manis. maskulin, modern, dan mudah
                diingat.
              </p>
            </div>

            {/* Botol Dynamyst — Ekstra Besar, Miring KIRI (-rotate-12) */}
            <div className="z-10 flex w-full flex-shrink-0 items-center justify-center py-4 sm:w-[50%] sm:py-0">
              <img
                src="/images/Dynamist.svg"
                alt="Dynamyst Perfume"
                className="h-80 w-auto -rotate-12 object-contain transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] drop-shadow-[0_25px_30px_rgba(0,0,0,0.65)] group-hover:rotate-0 group-hover:-translate-y-5 group-hover:scale-105 group-hover:drop-shadow-[0_40px_40px_rgba(0,0,0,0.85)] sm:h-96 lg:h-[420px]"
              />
            </div>

          </div>
        </div>

        {/* Card Vannessence (Terang) */}
        <div className="group relative flex min-h-[500px] flex-col justify-center overflow-hidden border-t border-border bg-secondary p-8 text-secondary-foreground sm:p-12 lg:border-l lg:border-t-0 lg:p-16">
          
          {/* Container Konten Side-by-Side */}
          <div className="my-auto flex flex-col items-center justify-between gap-8 sm:flex-row">
            
            {/* Teks Deskripsi */}
            <div className="z-10 flex w-full flex-col gap-3 sm:w-[48%]">
              <h3 className="font-heading text-5xl italic sm:text-6xl">Vannessence</h3>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Diciptakan untuk mereka yang menyukai kelembutan dan
                ketenangan. Aroma vanilla yang creamy berpadu dengan nuansa
                segar dan elegan. hangat, nyaman, manis, dan menenangkan.
              </p>
            </div>

            {/* Botol Vannessence — Ekstra Besar, Miring KANAN (rotate-12) */}
            <div className="z-10 flex w-full flex-shrink-0 items-center justify-center py-4 sm:w-[50%] sm:py-0">
              <img
                src="/images/Vannessence.svg"
                alt="Vannessence Perfume"
                className="h-80 w-auto rotate-12 object-contain transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] drop-shadow-[0_25px_30px_rgba(0,0,0,0.2)] group-hover:rotate-0 group-hover:-translate-y-5 group-hover:scale-105 group-hover:drop-shadow-[0_40px_40px_rgba(0,0,0,0.38)] sm:h-96 lg:h-[420px]"
              />
            </div>

          </div>
        </div>

      </div>
    </section>

{/* Philosophy Quote */}
<section className="flex w-full max-w-3xl flex-col items-center gap-3 px-5 py-12 text-center">
  <p className="text-2xl font-medium leading-tight sm:text-3xl md:text-4xl">
    &ldquo;Bagi kami, parfum <span className="font-heading italic font-normal">bukan sekadar wangi</span>, tetapi juga cara seseorang <span className="font-heading italic font-normal">mengekspresikan dirinya.</span>&rdquo;
  </p>
  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mt-1">
    Perfu.me
  </span>
</section>

        {/* Closing CTA */}
        <section className="flex w-full flex-col items-center gap-6 border-t border-border px-5 py-20 text-center">
          <h2 className="text-4xl font-semibold sm:text-5xl">
            Smell Good. <span className="font-heading italic">Feel Confident.</span>
          </h2>
          <p className="max-w-xl leading-relaxed text-muted-foreground">
            Aroma berkarakter, kualitas terasa premium, harga tetap
            terjangkau. siapa pun bisa tampil harum dan percaya diri setiap
            hari.
          </p>
          <a
            href="/products"
            className="mt-2 rounded-md border border-border px-8 py-3 text-xs font-semibold uppercase tracking-[0.3em] transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Shop All Products
          </a>
        </section>
      </main>

      <style>{`
        .marquee {
          animation: marquee 22s linear infinite;
          width: max-content;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee { animation: none; }
        }
      `}</style>
    </>
  );
}