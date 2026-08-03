import Navbar from "@/components/blocks/navbar";
import { Phone, Mail, Instagram, Clock } from "lucide-react";

export default function Contact() {
  const contactItems = [
    {
      icon: Phone,
      label: "WhatsApp",
      value: "0813-8341-5432",
      href: "https://wa.me/6281383415432",
    },
    {
      icon: Mail,
      label: "Email",
      value: "perfumeofficial30@gmail.com",
      href: "mailto:perfumeofficial30@gmail.com",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@perfu.mefragrance",
      href: "https://instagram.com/perfu.mefragrance",
    },
  ];

  const faqs = [
    {
      q: "Berapa lama proses pengiriman?",
      a: "1–3 hari kerja untuk area Jabodetabek, 2–5 hari untuk luar kota.",
    },
    {
      q: "Bisa custom ukuran botol?",
      a: "Bisa, chat kami di WhatsApp untuk request ukuran khusus.",
    },
    {
      q: "Apakah ada garansi produk?",
      a: "Ya, kami ganti produk baru kalau ada kerusakan saat pengiriman.",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="flex min-h-screen flex-col items-center bg-background text-foreground">
        {/* Hero */}
        <section className="flex w-full max-w-7xl flex-col gap-6 px-5 py-24 sm:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            We&apos;d love to hear from you
          </p>
          <h1 className="text-6xl font-semibold capitalize leading-[1.05] sm:text-7xl">
            Contact <span className="font-heading italic">Perfu.me</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Ada pertanyaan soal produk, kolaborasi, atau butuh bantuan
            sebelum checkout? Tim kami siap bantu — pilih cara termudah buat
            kamu.
          </p>
        </section>

      {/* Signature ticker — full-bleed, jadi HARUS di luar <main> dan pakai w-full */}
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

        {/* Contact info + info panel */}
        <section className="grid w-full max-w-7xl grid-cols-1 gap-12 border-t border-border px-5 py-20 sm:grid-cols-2">
          {/* Left: contact channels */}
          <div className="flex flex-col gap-4">
            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-lg border border-border bg-muted p-6 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    {label}
                  </span>
                  <span className="text-lg font-medium">{value}</span>
                </div>
              </a>
            ))}

            <div className="mt-4 flex items-start gap-4 rounded-lg border border-border bg-background p-6">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Jam Operasional
                </span>
                <span className="text-sm text-foreground">
                  Setiap hari, 09.00 – 21.00 WIB
                </span>
              </div>
            </div>
          </div>

          {/* Right: FAQ panel */}
          <div className="flex flex-col gap-6 rounded-lg border border-border bg-muted p-8">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Sebelum Tanya
              </span>
              <h2 className="font-heading text-2xl italic">
                Pertanyaan yang Sering Ditanya
              </h2>
            </div>

            <div className="flex flex-col divide-y divide-border">
              {faqs.map((faq) => (
                <div key={faq.q} className="flex flex-col gap-1.5 py-4">
                  <span className="font-medium">{faq.q}</span>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing note */}
        <section className="flex w-full flex-col items-center gap-4 border-t border-border px-5 py-20 text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Masih ragu pilih wangi yang cocok?
          </h2>
          <p className="max-w-xl leading-relaxed text-muted-foreground">
            Chat kami langsung di WhatsApp, tim Perfu.me bantu rekomendasikan
            aroma yang paling pas buat kamu.
          </p>
          <a
            href="https://wa.me/6281383415432"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-md border border-border px-8 py-3 text-xs font-semibold uppercase tracking-[0.3em] transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Chat via WhatsApp
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