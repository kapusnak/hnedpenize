import Image from "next/image"
import { Zap, CheckCircle, MapPin, HomeIcon } from "lucide-react"

import { LoanCalculator } from "@/components/loan-calculator"

const chips = ["Peníze do 24h", "Majetek užíváte dál", "Celá ČR"] as const

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
      <div className="grid flex-1 items-stretch gap-6 lg:min-h-[calc(100dvh-6.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)] lg:gap-0 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,30rem)]">
        <div className="relative isolate h-full min-h-[22rem] overflow-hidden rounded-3xl sm:min-h-[26rem]">
          <Image
            src="/hero-house.webp"
            alt="Moderní rodinný dům"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 60vw"
            className="object-cover object-[46%_50%] saturate-[1.12] contrast-[1.04] sm:object-[48%_48%] lg:object-[42%_46%]"
          />

          {/* Left-weighted darkening so copy is readable — house stays sharp and saturated. */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/35 via-[40%] to-transparent to-[72%]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20"
            aria-hidden
          />

          {/* Soft white fade ONLY on the edge that meets the form — not a whole-image wash. */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[18%] bg-gradient-to-r from-transparent via-background/35 to-background lg:block"
            aria-hidden
          />

          <div className="relative z-10 flex h-full min-h-[22rem] flex-col justify-between gap-5 p-5 sm:min-h-[26rem] sm:p-7 lg:gap-8 lg:p-8 xl:px-10 xl:pt-8 xl:pb-8">
            <div className="max-w-2xl space-y-3 text-white [text-shadow:0_1px_16px_rgba(0,0,0,0.35)]">
              <h1 className="text-2xl font-bold leading-[1.15] sm:text-3xl lg:text-4xl xl:text-[2.6rem] 2xl:text-5xl">
                Okamžité finance jištěné
                <span className="mt-1 block text-white/90">nemovitostí nebo vozem</span>
              </h1>
              <p className="hidden max-w-lg text-sm leading-relaxed text-white/80 sm:block lg:text-base">
                Získejte potřebnou hotovost do 24 hodin a svůj majetek využívejte dál bez omezení. Diskrétní řešení pro
                podnikatele i soukromé osoby s vysokou průchodností schválení.
              </p>
              <div className="flex flex-wrap gap-3 pt-1 sm:gap-5">
                {chips.map((label) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="text-sm text-white/90">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full max-w-md rounded-2xl border border-white/15 bg-slate-950/50 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-md sm:p-4">
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

        <div className="relative z-20 flex justify-center lg:-ml-6 lg:items-start lg:justify-end xl:-ml-8">
          <LoanCalculator />
        </div>
      </div>
    </div>
  )
}
