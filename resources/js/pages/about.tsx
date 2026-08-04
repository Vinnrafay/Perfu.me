import Navbar from "@/components/blocks/navbar";

export default function AboutUs() {
  return (
    <>
      <Navbar />

      <main className="flex min-h-screen flex-col items-center bg-background text-foreground overflow-hidden">
        
        {/* Hero Section - Sempurna sejajar & Foto dijamin muncul */}
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

            {/* Bagian Kanan: Foto Kotak (Aman & Tidak Collapse) */}
            <div className="w-full lg:w-[400px] flex-shrink-0 flex justify-center">
              <div className="w-full rounded-2xl overflow-hidden border border-border shadow-lg group">
                <img 
                  src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800" 
                  alt="Perfu.me Elegance" 
                  className="w-full h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Signature ticker — slogan brand sendiri, terus berjalan */}
        <div className="w-full overflow-hidden border-y border-border bg-primary py-3">
          <div className="marquee flex whitespace-nowrap text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground/80">
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

        {/* Story Section */}
        <section className="grid w-full max-w-7xl grid-cols-1 gap-12 border-t border-border px-5 py-20 sm:grid-cols-2 items-center">
          
          {/* Kotak Foto Story */}
          <div className="relative w-full h-[400px] overflow-hidden rounded-2xl border border-border group">
            <img 
              src="https://images.unsplash.com/photo-1615397323164-964fa07b4685?auto=format&fit=crop&q=80&w=800" 
              alt="Dua Karakter Perfu.me" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient hitam di bawah supaya teks putihnya terbaca */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="absolute bottom-8 left-8 z-10 text-xs font-semibold uppercase tracking-[0.3em] text-white">
              Dua Karakter, Satu Keyakinan
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Kami memulai perjalanan ini dengan dua signature scent
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Dirancang untuk mewakili dua karakter berbeda — satu untuk mereka
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

        {/* Two scents, split panel */}
        <section className="grid w-full grid-cols-1 border-t border-border sm:grid-cols-2">
          {/* Dynamyst — gelap, energik */}
          <div className="flex flex-col justify-between gap-8 bg-primary p-10 text-primary-foreground sm:p-16">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground/60">
              For the energetic
            </span>
            <div className="flex flex-col gap-4">
              <h3 className="font-heading text-5xl italic">Dynamyst</h3>
              <p className="max-w-md leading-relaxed text-primary-foreground/70">
                Hadir untuk mereka yang aktif, percaya diri, dan penuh
                semangat. Perpaduan aroma fresh, sporty, clean, dengan
                sentuhan hangat dan manis — maskulin, modern, dan mudah
                diingat.
              </p>
            </div>
            <div className="h-px w-24 bg-primary-foreground/40" />
          </div>

          {/* Vannessence — terang, lembut */}
          <div className="flex flex-col justify-between gap-8 bg-secondary p-10 text-secondary-foreground sm:p-16">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              For the calm
            </span>
            <div className="flex flex-col gap-4">
              <h3 className="font-heading text-5xl italic">Vannessence</h3>
              <p className="max-w-md leading-relaxed text-muted-foreground">
                Diciptakan bagi mereka yang menyukai kelembutan dan
                ketenangan. Aroma vanilla yang creamy berpadu dengan nuansa
                segar dan elegan — hangat, nyaman, manis, dan menenangkan.
              </p>
            </div>
            <div className="h-px w-24 bg-border" />
          </div>
        </section>

        {/* Philosophy quote */}
        <section className="flex w-full max-w-4xl flex-col items-center gap-6 px-5 py-24 text-center">
          <p className="font-heading text-3xl italic leading-relaxed sm:text-4xl">
            &ldquo;Bagi kami, parfum bukan sekadar wangi, tetapi juga cara
            seseorang mengekspresikan dirinya.&rdquo;
          </p>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
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
            terjangkau — siapa pun bisa tampil harum dan percaya diri setiap
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