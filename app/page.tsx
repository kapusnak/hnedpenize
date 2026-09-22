import { Header } from "@/components/header"
import { HomeHero } from "@/components/home-hero"
import { LeadPopup } from "@/components/lead-popup"
import { WhatsAppCard } from "@/components/whatsapp-card"
import { ZivefirmyBadge } from "@/components/zivefirmy-badge"
import { Card, CardContent } from "@/components/ui/card"
import { HomeIcon, Phone, Mail, Clock, Facebook, Instagram, Car } from "lucide-react"

const SOCIAL = {
  facebook: "https://www.facebook.com/share/159JsQe6Qg/",
  instagram: "https://www.instagram.com/docasnyvykup.cz/",
} as const

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <LeadPopup />
      <Header />

      <section className="relative flex flex-1 flex-col">
        <HomeHero />

        {/* Kontakty - mobile only, stejná struktura jako /kontakty */}
        <div className="container mx-auto mt-2 space-y-4 px-4 pb-8 md:hidden">
          <Card className="border-2 border-primary/20 bg-card shadow-lg">
            <CardContent className="p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                  <HomeIcon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Nemovitosti</h2>
              </div>

              <a
                href="tel:+420776722175"
                className="group mb-3 flex items-center gap-3 rounded-xl bg-primary/10 p-3 transition-colors hover:bg-primary/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-base font-bold text-primary group-hover:underline">+420 776 722 175</p>
                </div>
              </a>

              <WhatsAppCard compact phone="420776722175" />
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-card shadow-lg">
            <CardContent className="p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Car className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Vozidla</h2>
              </div>

              <a
                href="tel:+420777400256"
                className="group mb-3 flex items-center gap-3 rounded-xl bg-primary/10 p-3 transition-colors hover:bg-primary/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-base font-bold text-primary group-hover:underline">+420 777 400 256</p>
                </div>
              </a>

              <WhatsAppCard compact phone="420777400256" />
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-card shadow-lg">
            <CardContent className="p-4">
              <h2 className="mb-4 text-lg font-bold text-foreground">Kontaktujte nás</h2>

              <div className="mb-3 flex items-center gap-3 rounded-xl bg-primary/10 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pracovní doba</p>
                  <p className="text-sm font-semibold text-foreground">Po–Pá: 8:00 – 18:00</p>
                </div>
              </div>

              <a
                href="mailto:info@hnedpenize.cz"
                className="group mb-3 flex items-center gap-3 rounded-xl bg-primary/10 p-3 transition-colors hover:bg-primary/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary group-hover:underline">info@hnedpenize.cz</p>
                </div>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl bg-primary/10 p-3 transition-colors hover:bg-primary/20"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Instagram className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-primary group-hover:underline">Instagram</p>
                </a>

                <a
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl bg-primary/10 p-3 transition-colors hover:bg-primary/20"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Facebook className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-primary group-hover:underline">Facebook</p>
                </a>
              </div>

              <div className="mt-4">
                <ZivefirmyBadge variant="light" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
