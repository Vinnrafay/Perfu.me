import { Card } from "@/components/ui/card";
import WhatsAppIcon from "@/components/whatsapp-icon";
import { Mail, Instagram, Clock, MapPin } from "lucide-react";

export default function Contact() {
  const contactItems = [
    {
      icon: WhatsAppIcon,
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

  const address = "Jl. Lingkar Dramaga RT 03/04, Desa Dramaga, Kec. Dramaga, Kabupaten Bogor, Jawa Barat";
  const mapsEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-12 bg-background text-foreground py-12">
        {/* Hero */}
        <section className="flex w-full max-w-7xl flex-col gap-3 px-5">
          <h1 className="text-6xl font-medium capitalize leading-[1.05] sm:text-7xl">
            Contact <span className="font-heading italic">Perfu.me</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Ada pertanyaan soal produk, kolaborasi, atau butuh bantuan
            sebelum checkout? Kami siap bantu dan pilih cara termudah buat
            kamu.
          </p>
        </section>

        {/* Contact info + map */}
        <section className="grid w-full max-w-7xl grid-cols-1 gap-6 px-5 sm:grid-cols-2">
          {/* Left: contact channels */}
          <div className="flex flex-col gap-4">
            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className="group flex-row items-center gap-4 px-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-muted-foreground">
                      {label}
                    </span>
                    <span className="text-lg font-medium">{value}</span>
                  </div>
                </Card>
              </a>
            ))}

            <Card className="flex-row items-start gap-4 px-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                <Clock className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Jam Operasional
                </span>
                <span className="text-lg font-medium text-foreground">
                  Setiap hari, 09.00 – 21.00 WIB
                </span>
              </div>
            </Card>
          </div>

          {/* Right: location / map */}
          <Card className="px-6">
            <h2 className="text-xl font-medium">Kunjungi Kami Secara Langsung</h2>

            <div className="overflow-hidden rounded-lg border border-border">
              <iframe
                title="Lokasi Perfu.me"
                src={mapsEmbedSrc}
                width="100%"
                height="280"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Jl. Lingkar Dramaga RT 03/04, Desa Dramaga, Kec. Dramaga,
                Kabupaten Bogor, Jawa Barat
              </p>
            </div>
          </Card>
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