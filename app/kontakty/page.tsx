import { Header } from "@/components/header"
import { WhatsAppCard } from "@/components/whatsapp-card"
import { Phone, Mail, Clock, MapPin, Building2, FileText, Cookie, Facebook, Instagram, Home, Car } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CtaSection } from "@/components/cta-section"
import { ZivefirmyBadge } from "@/components/zivefirmy-badge"
import Link from "next/link"

const SOCIAL = {
  facebook: "https://www.facebook.com/share/159JsQe6Qg/",
  instagram: "https://www.instagram.com/docasnyvykup.cz/",
} as const

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
      <section className="pt-12 lg:pt-16 pb-4 lg:pb-6">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8">
            {/* Row 1 — category contacts */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Výkup nemovitostí</h2>
                  </div>

                  <a
                    href="tel:+420776722175"
                    className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors mb-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Výkup nemovitostí</p>
                      <p className="text-xl lg:text-2xl font-bold text-primary group-hover:underline">+420 776 722 175</p>
                    </div>
                  </a>

                  <WhatsAppCard phone="420776722175" />
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 shadow-lg">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Výkup vozidel</h2>
                  </div>

                  <a
                    href="tel:+420777400256"
                    className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors mb-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Výkup vozidel</p>
                      <p className="text-xl lg:text-2xl font-bold text-primary group-hover:underline">+420 777 400 256</p>
                    </div>
                  </a>

                  <WhatsAppCard phone="420777400256" />
                </CardContent>
              </Card>
            </div>

            {/* Row 2 — general info + billing */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <Card className="border border-border shadow-lg">
                <CardContent className="p-6 lg:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-6">Obecné informace</h2>

                  <a
                    href="mailto:info@hnedpenize.cz"
                    className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors mb-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Napište nám</p>
                      <p className="text-lg font-semibold text-primary group-hover:underline">info@hnedpenize.cz</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Pracovní doba</p>
                      <p className="text-lg font-semibold text-foreground">
                        Po–Pá: 8:00 – 18:00
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={SOCIAL.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-primary group-hover:underline">Instagram</p>
                    </a>

                    <a
                      href={SOCIAL.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Facebook className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-primary group-hover:underline">Facebook</p>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border shadow-lg">
                <CardContent className="p-6 lg:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-6">Fakturační údaje</h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Název společnosti</p>
                        <p className="font-semibold text-foreground">Dočasný výkup s.r.o.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">IČ</p>
                        <p className="font-semibold text-foreground">23626836</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Adresa</p>
                        <p className="font-semibold text-foreground">Podvesná VII/6192, 760 01 Zlín</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <ZivefirmyBadge variant="light" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Same as Jak to funguje page */}
      <section className="pt-4 lg:pt-6 pb-12 lg:pb-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <CtaSection />
        </div>
      </section>

      {/* Footer Links */}
      <footer className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
            <Link href="/ochrana-osobnich-udaju/nemovitosti" className="hover:text-primary transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Ochrana osobních údajů - Nemovitosti
            </Link>
            <Link href="/ochrana-osobnich-udaju/vozidla" className="hover:text-primary transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Ochrana osobních údajů - Vozidla
            </Link>
            <Link href="/zasady-cookies" className="hover:text-primary transition-colors flex items-center gap-2">
              <Cookie className="w-4 h-4" />
              Zásady cookies
            </Link>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            © 2026 Dočasný výkup s.r.o. Všechna práva vyhrazena.
          </p>
        </div>
      </footer>
    </main>
  )
}
