import { Header } from "@/components/header"
import { Phone, Mail, Clock, MapPin, Building2, FileText, Cookie } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CtaSection } from "@/components/cta-section"
import Link from "next/link"

export default function KontaktyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary pt-28 pb-16 lg:pt-32 lg:pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Jsme tu pro vás</h1>
          <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            Potřebujete poradit?
            <br />
            Zavolejte nám nebo napište. Odpovídáme obratem.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Left Column - Direct Contact */}
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-xl font-bold text-foreground mb-6">Přímý kontakt</h2>

                {/* Phone */}
                <a
                  href="tel:+420776075150"
                  className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors mb-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Zavolejte nám</p>
                    <p className="text-xl lg:text-2xl font-bold text-primary group-hover:underline">+420 776 075 150</p>
                  </div>
                </a>

                <a
                  href="tel:+420777400256"
                  className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors mb-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Zavolejte nám</p>
                    <p className="text-xl lg:text-2xl font-bold text-primary group-hover:underline">+420 777 400 256</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:info@docasnyvykup.cz"
                  className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors mb-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Napište nám</p>
                    <p className="text-lg font-semibold text-primary group-hover:underline">info@docasnyvykup.cz</p>
                  </div>
                </a>

                {/* Availability */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <Clock className="w-5 h-5 text-primary" />
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Po-Pá:</span> 8:00 - 18:00
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Company Details */}
            <Card className="border border-border shadow-lg">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-xl font-bold text-foreground mb-6">Fakturační údaje</h2>

                <div className="space-y-4">
                  {/* Company Name */}
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Název společnosti</p>
                      <p className="font-semibold text-foreground">Dočasný výkup s.r.o.</p>
                    </div>
                  </div>

                  {/* IČ */}
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">IČ</p>
                      <p className="font-semibold text-foreground">23626836</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Adresa</p>
                      <p className="font-semibold text-foreground">Podvesná VII/6192, 760 01 Zlín</p>
                    </div>
                  </div>
                </div>

                {/* Map - Podvesná VII/6192, 760 01 Zlín */}
                <div className="mt-6 h-48 sm:h-56 rounded-xl overflow-hidden border border-border">
                  <iframe
                    title="Mapa sídla společnosti - Podvesná VII/6192, Zlín"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=17.648%2C49.218%2C17.678%2C49.232&layer=mapnik&marker=49.225%2C17.663"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    sandbox="allow-scripts"
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  <a
                    href="https://www.openstreetmap.org/?mlat=49.225&mlon=17.663#map=16/49.225/17.663"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Zobrazit větší mapu
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Same as Jak to funguje page */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <CtaSection />
        </div>
      </section>

      {/* Footer Links */}
      <footer className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
            <Link href="/ochrana-osobnich-udaju" className="hover:text-primary transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Ochrana osobních údajů
            </Link>
            <Link href="/zasady-cookies" className="hover:text-primary transition-colors flex items-center gap-2">
              <Cookie className="w-4 h-4" />
              Zásady cookies
            </Link>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            © 2025 Dočasný výkup s.r.o. Všechna práva vyhrazena.
          </p>
        </div>
      </footer>
    </main>
  )
}
