import Image from "next/image"
import { Zap, CheckCircle, MapPin, HomeIcon } from "lucide-react"

import { LoanCalculator } from "@/components/loan-calculator"

const benefits = [
  {
    icon: Zap,
    title: "Peníze do 24 hodin",
    description: "Finance vyplácíme okamžitě po podpisu.",
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
] as const

export function HomeHero() {
  return (
    <div className="container mx-auto flex flex-1 flex-col px-4 pb-6 pt-28 lg:pb-8 lg:pt-24">
      <div className="overflow-hidden rounded-2xl bg-card shadow-xl sm:rounded-3xl lg:grid lg:min-h-[calc(100dvh-6.5rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,28rem)] lg:items-stretch">
        <div className="relative isolate min-h-[32rem] overflow-hidden sm:min-h-[36rem] lg:min-h-full">
          <Image
            src="/hero-house.webp"
            alt="Moderní rodinný dům"
            fill
            priority
            quality={90}
            sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 62vw, min(58vw, 1100px)"
            className="hero-house-blend object-cover object-[46%_50%] saturate-[1.08] contrast-[1.02] sm:object-[48%_48%] lg:object-[42%_46%]"
          />

          {/* Contrast only where copy sits — the house stays saturated. */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/25 lg:bg-gradient-to-r lg:from-black/55 lg:via-black/22 lg:via-[34%] lg:to-transparent lg:to-[70%]"
            aria-hidden
          />
          {/* Autocash-style soft wash into the form — long ramp, no hard white band. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-card/30 to-card sm:h-40 lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-40 lg:bg-gradient-to-r lg:from-transparent lg:via-card/35 lg:to-card xl:w-48"
            aria-hidden
          />

          <div className="relative z-10 flex h-full min-h-[32rem] flex-col justify-between gap-10 px-5 py-6 sm:min-h-[36rem] sm:gap-12 sm:px-8 sm:py-8 lg:min-h-[42rem] lg:gap-16 lg:px-10 lg:py-9 lg:pr-14 xl:px-12">
            <div className="max-w-2xl space-y-3 text-white [text-shadow:0_1px_16px_rgba(0,0,0,0.35)]">
              <h1 className="text-2xl font-bold leading-[1.15] sm:text-3xl lg:text-4xl xl:text-[2.6rem] 2xl:text-5xl">
                Okamžité finance jištěné
                <span className="mt-1 block text-[oklch(0.8_0.14_250)]">nemovitostí nebo vozem</span>
              </h1>
              <p className="max-w-lg text-sm leading-relaxed text-white/80 lg:text-base">
                Získejte potřebnou hotovost do 24 hodin a svůj majetek využívejte dál bez omezení. Diskrétní řešení pro
                podnikatele i soukromé osoby s vysokou průchodností schválení.
              </p>
            </div>

            <div className="mt-2 w-full max-w-md rounded-2xl border border-white/15 bg-slate-950/50 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-md sm:mt-4 sm:p-4">
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1 lg:gap-3.5">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon
                  return (
                    <li key={benefit.title} className="flex items-start gap-2.5">
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold leading-snug text-white">{benefit.title}</span>
                        <span className="mt-0.5 hidden text-xs leading-snug text-white/70 lg:block">
                          {benefit.description}
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-center bg-card px-2 py-3 sm:px-3 sm:py-5 lg:px-4 lg:py-7">
          <LoanCalculator embedded />
        </div>
      </div>
    </div>
  )
}
