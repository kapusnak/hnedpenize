import { Header } from "@/components/header"
import { LoanCalculator } from "@/components/loan-calculator"
import { LeadPopup } from "@/components/lead-popup"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, CheckCircle, MapPin, HomeIcon, Phone, Mail, Clock } from "lucide-react"

export default function Home() {
  const benefits = [
    {
      icon: Zap,
      title: "Peníze do 24 hodin",
      description: "Díky vlastnímu kapitálu vyplácíme okamžitě po podpisu.",
    },
    {
      icon: HomeIcon,
      title: "Bydlíte i jezdíte dál",
      description: "Formou zpětného leasingu majetek zůstává k užívání.",
    },
    {
      icon: CheckCircle,
      title: "Vysoké % schválení",
      description: "Nenahlížíme do registrů tak přísně jako banky.",
    },
    {
      icon: MapPin,
      title: "Celá ČR",
      description: "Působíme po celé republice. Přijedeme za vámi.",
    },
  ]

  return (
    <main className="min-h-dvh lg:h-dvh flex flex-col">
      <LeadPopup />

      {/* Hero Section - Full viewport on desktop */}
      <section className="relative flex-1 bg-gradient-to-b from-blue-400 via-primary to-blue-700 flex flex-col">
        <Header />

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-card blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-card blur-3xl" />
        </div>

        <div className="container mx-auto px-4 pt-28 pb-6 lg:py-8 lg:pt-24 flex-1 flex flex-col relative z-10">
          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
            {/* Left Content - Now order-1 on mobile so text appears first */}
            <div className="text-card space-y-3 text-center lg:text-left order-1 lg:order-1 lg:flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-balance">
                Okamžité finance jištěné
                <span className="block text-card/90">nemovitostí nebo vozem</span>
              </h1>
              <p className="hidden sm:block text-sm lg:text-base text-card/80 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Získejte potřebnou hotovost do 24 hodin a svůj majetek využívejte dál bez omezení. Diskrétní řešení pro
                podnikatele i soukromé osoby s vysokou průchodností schválení.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-5 pt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-card" />
                  <span className="text-card/90 text-sm">Peníze do 24h</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-card" />
                  <span className="text-card/90 text-sm">Majetek užíváte dál</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-card" />
                  <span className="text-card/90 text-sm">Celá ČR</span>
                </div>
              </div>
            </div>

            {/* Right Content - Calculator - Now order-2 on mobile so it appears second */}
            <div className="flex justify-center lg:justify-end order-2 lg:order-2 lg:flex-1">
              <LoanCalculator />
            </div>
          </div>

          <div className="pt-4 lg:pt-6 border-t border-card/20 mt-4 lg:mt-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {benefits.map((benefit) => {
                const IconComponent = benefit.icon
                return (
                  <div key={benefit.title} className="flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-card/20 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 lg:w-6 lg:h-6 text-card" />
                    </div>
                    <span className="text-card font-medium text-xs sm:text-sm">{benefit.title}</span>
                    <span className="text-card/70 text-[10px] sm:text-xs hidden lg:block max-w-[180px]">
                      {benefit.description}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Přímý kontakt - mobile only */}
            <div className="mt-6 md:hidden">
              <Card className="border-2 border-card/30 shadow-lg bg-card/95">
                <CardContent className="p-4">
                  <h2 className="text-lg font-bold text-foreground mb-4">Přímý kontakt</h2>

                  <a
                    href="tel:+420776075150"
                    className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors mb-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Zavolejte nám</p>
                      <p className="text-base font-bold text-primary group-hover:underline">+420 776 075 150</p>
                    </div>
                  </a>

                  <a
                    href="tel:+420777400256"
                    className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors mb-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Zavolejte nám</p>
                      <p className="text-base font-bold text-primary group-hover:underline">+420 777 400 256</p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@docasnyvykup.cz"
                    className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors mb-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Napište nám</p>
                      <p className="text-sm font-semibold text-primary group-hover:underline">info@docasnyvykup.cz</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <Clock className="w-5 h-5 text-primary shrink-0" />
                    <p className="text-muted-foreground text-sm">
                      <span className="font-medium text-foreground">Po-Pá:</span> 8:00 - 18:00
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
