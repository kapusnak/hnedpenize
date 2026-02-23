"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { sendLead } from "@/lib/emailjs"
import { formatPhoneDisplay, parsePhoneDigits, toFullPhone } from "@/lib/phone-420"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building2, Car, TrendingUp, Lock } from "lucide-react"

const REAL_ESTATE_RANGE = { min: 100000, max: 25000000, step: 100000 }
const CAR_RANGE = { min: 50000, max: 5000000, step: 5000 }

/** Car amount scale: 50k–500k (10k steps) so 500k is at 50% position, then 100k steps from 600k to 5M */
const CAR_AMOUNT_VALUES = (() => {
  const low: number[] = []
  for (let v = 50000; v <= 500000; v += 10000) low.push(v) // 46 values, last = 500k
  const high: number[] = []
  for (let v = 600000; v <= 5000000; v += 100000) high.push(v) // 45 values
  return [...low, ...high] // 91 total; index 45 = 500k (middle)
})()

function snapToCarValue(value: number): number {
  if (value <= CAR_AMOUNT_VALUES[0]) return CAR_AMOUNT_VALUES[0]
  if (value >= CAR_AMOUNT_VALUES[CAR_AMOUNT_VALUES.length - 1])
    return CAR_AMOUNT_VALUES[CAR_AMOUNT_VALUES.length - 1]
  let i = 0
  while (i < CAR_AMOUNT_VALUES.length - 1 && CAR_AMOUNT_VALUES[i + 1] < value) i += 1
  const a = CAR_AMOUNT_VALUES[i]
  const b = CAR_AMOUNT_VALUES[i + 1]
  return value - a <= b - value ? a : b
}

function carAmountToIndex(value: number): number {
  const snapped = snapToCarValue(value)
  const idx = CAR_AMOUNT_VALUES.indexOf(snapped)
  return idx >= 0 ? idx : 0
}

/** Progressive real-estate amount scale: 10k steps up to 500k, then 100k steps to 25M */
const REAL_ESTATE_AMOUNT_VALUES = (() => {
  const low: number[] = []
  for (let v = 100000; v <= 500000; v += 10000) low.push(v)
  const high: number[] = []
  for (let v = 600000; v <= 25000000; v += 100000) high.push(v)
  return [...low, ...high]
})()

function snapToRealEstateValue(value: number): number {
  if (value <= REAL_ESTATE_AMOUNT_VALUES[0]) return REAL_ESTATE_AMOUNT_VALUES[0]
  if (value >= REAL_ESTATE_AMOUNT_VALUES[REAL_ESTATE_AMOUNT_VALUES.length - 1])
    return REAL_ESTATE_AMOUNT_VALUES[REAL_ESTATE_AMOUNT_VALUES.length - 1]
  let i = 0
  while (i < REAL_ESTATE_AMOUNT_VALUES.length - 1 && REAL_ESTATE_AMOUNT_VALUES[i + 1] < value) i += 1
  const a = REAL_ESTATE_AMOUNT_VALUES[i]
  const b = REAL_ESTATE_AMOUNT_VALUES[i + 1]
  return value - a <= b - value ? a : b
}

function realEstateAmountToIndex(value: number): number {
  const snapped = snapToRealEstateValue(value)
  const idx = REAL_ESTATE_AMOUNT_VALUES.indexOf(snapped)
  return idx >= 0 ? idx : 0
}

const realEstateServices = [
  { value: "zpetny-leasing", label: "Zpětný leasing" },
  { value: "zastava", label: "Zástava nemovitosti" },
  { value: "primy-vykup", label: "Přímý výkup" },
  { value: "bez-zajisteni", label: "Bez zajištění" },
]

const carServices = [{ value: "penize-ihned", label: "Peníze ihned a jezděte dál" }]

const DEFAULT_REAL_ESTATE_AMOUNT = 2000000
const DEFAULT_CAR_AMOUNT = 100000

/** Random value in [min, max] with one decimal place. Same on each load, varies on reload. */
function randomSocialProofAmount(min: number, max: number): string {
  const value = min + Math.random() * (max - min)
  return value.toFixed(1).replace(/\.0$/, "")
}

function getSocialProofText(): string {
  const amount = randomSocialProofAmount(2.1, 23)
  return `Za posledních 30 dní vyplaceno již ${amount} mil. Kč. Průměrná doba vyřízení: 24h.`
}

const SOCIAL_PROOF_FALLBACK = "Za posledních 30 dní vyplaceno již 3.9 mil. Kč. Průměrná doba vyřízení: 24h."

export function LoanCalculator() {
  const [socialProofText, setSocialProofText] = useState(SOCIAL_PROOF_FALLBACK)

  useEffect(() => {
    setSocialProofText(getSocialProofText())
  }, [])

  const [assetType, setAssetType] = useState<"real-estate" | "car">("real-estate")
  const [serviceType, setServiceType] = useState("zpetny-leasing")
  const [amount, setAmount] = useState([snapToRealEstateValue(DEFAULT_REAL_ESTATE_AMOUNT)])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneDigits, setPhoneDigits] = useState("")
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const currentRange = assetType === "real-estate" ? REAL_ESTATE_RANGE : CAR_RANGE
  const currentServices = assetType === "real-estate" ? realEstateServices : carServices

  useEffect(() => {
    if (assetType === "real-estate") {
      setAmount([snapToRealEstateValue(DEFAULT_REAL_ESTATE_AMOUNT)])
      setServiceType("zpetny-leasing")
    } else {
      setAmount([snapToCarValue(DEFAULT_CAR_AMOUNT)])
      setServiceType("penize-ihned")
    }
  }, [assetType])

  const formatAmount = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1).replace(".0", "")} mil. Kč`
    }
    return `${(value / 1000).toFixed(0)} tis. Kč`
  }

  const formatRangeLabel = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)} mil. Kč`
    }
    return `${(value / 1000).toFixed(0)} tis. Kč`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullPhone = toFullPhone(phoneDigits)
    if (!fullPhone) {
      setSubmitStatus("error")
      return
    }
    setSubmitStatus("sending")
    try {
      await sendLead({
        source: "calculator",
        phone: fullPhone,
        email: email.trim() || undefined,
        name,
        amount: amount[0],
        assetType: assetType === "real-estate" ? "Nemovitost" : "Automobil",
        serviceType: currentServices.find((s) => s.value === serviceType)?.label ?? serviceType,
      })
      setSubmitStatus("success")
    } catch {
      setSubmitStatus("error")
    }
  }

  return (
    <Card className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md shadow-2xl border-0 bg-card">
      <CardContent className="px-4 sm:px-5 py-4 sm:py-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Nezávazná žádost o financování</h3>
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 border border-green-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[11px] font-medium text-green-700">Specialisté online • Kapacita volná</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Typ zajištění</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAssetType("real-estate")}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all active:scale-[0.98] ${
                  assetType === "real-estate"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary text-muted-foreground hover:border-primary/50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="font-medium text-sm">Nemovitost</span>
              </button>
              <button
                type="button"
                onClick={() => setAssetType("car")}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all active:scale-[0.98] ${
                  assetType === "car"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary text-muted-foreground hover:border-primary/50"
                }`}
              >
                <Car className="w-4 h-4" />
                <span className="font-medium text-sm">Automobil</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Typ služby</Label>
            {assetType === "car" ? (
              <div className="p-3 rounded-lg bg-primary/10 border-2 border-primary">
                <span className="font-medium text-sm text-primary">{carServices[0].label}</span>
              </div>
            ) : (
              <div className="flex flex-wrap lg:flex-nowrap gap-2 min-w-0" role="radiogroup" aria-label="Typ služby">
                {realEstateServices.map((service) => (
                  <button
                    key={service.value}
                    type="button"
                    role="radio"
                    aria-checked={serviceType === service.value}
                    onClick={() => setServiceType(service.value)}
                    className={`flex items-center justify-center min-w-0 lg:flex-1 px-3 lg:px-1.5 py-2.5 rounded-lg transition-all text-xs font-medium text-center whitespace-normal leading-tight ${
                      serviceType === service.value
                        ? "bg-primary/10 border-2 border-primary text-primary"
                        : "bg-secondary border-2 border-transparent text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {service.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">Požadovaná částka</Label>
              <span className="text-base font-bold text-primary">{formatAmount(amount[0])}</span>
            </div>
            {assetType === "real-estate" ? (
              <>
                <Slider
                  value={[realEstateAmountToIndex(amount[0])]}
                  onValueChange={([i]) => setAmount([REAL_ESTATE_AMOUNT_VALUES[i]])}
                  min={0}
                  max={REAL_ESTATE_AMOUNT_VALUES.length - 1}
                  step={1}
                  className="w-full touch-pan-x"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatRangeLabel(REAL_ESTATE_RANGE.min)}</span>
                  <span>{formatRangeLabel(REAL_ESTATE_RANGE.max)}</span>
                </div>
              </>
            ) : (
              <>
                <Slider
                  value={[carAmountToIndex(amount[0])]}
                  onValueChange={([i]) => setAmount([CAR_AMOUNT_VALUES[i]])}
                  min={0}
                  max={CAR_AMOUNT_VALUES.length - 1}
                  step={1}
                  className="w-full touch-pan-x"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatRangeLabel(CAR_RANGE.min)}</span>
                  <span>{formatRangeLabel(CAR_RANGE.max)}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 py-2 px-3 bg-muted/50 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-[11px] text-muted-foreground">
              {socialProofText}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                Jméno a příjmení
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Jan Novák"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary border-border h-11 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
                Telefon
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+420 111 111 111"
                value={formatPhoneDisplay(phoneDigits)}
                onChange={(e) => setPhoneDigits(parsePhoneDigits(e.target.value))}
                className="bg-secondary border-border h-11 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="zadejte.vas@email.cz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-border h-11 text-sm"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Odesláním poptávky souhlasíte s naším{" "}
            <Link href="/ochrana-osobnich-udaju" className="text-primary hover:underline">
              Prohlášením o ochraně osobních údajů
            </Link>
            .
          </p>

          {submitStatus === "success" && (
            <p className="text-sm font-medium text-green-600 text-center">Děkujeme. Brzy vás budeme kontaktovat.</p>
          )}
          {submitStatus === "error" && (
            <p className="text-sm font-medium text-destructive text-center">
              Odeslání se nepovedlo. Zkuste to znovu nebo nám zavolejte.
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            disabled={submitStatus === "sending"}
            className="w-full text-sm sm:text-base font-semibold h-auto min-h-12 py-3 px-4 bg-gold hover:bg-gold/90 text-gold-foreground rounded-lg active:scale-[0.98] transition-transform text-balance"
          >
            {submitStatus === "sending" ? "Odesílám…" : submitStatus === "success" ? "Odesláno" : (
              <>
                <span className="block sm:hidden">Získat nabídku přednostně</span>
                <span className="hidden sm:block">Získat nezávaznou nabídku</span>
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>Vaše data jsou v bezpečí. 100% diskrétní. Odpovídáme obratem.</span>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
