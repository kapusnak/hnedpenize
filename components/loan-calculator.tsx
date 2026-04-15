"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import Link from "next/link"

import { sendLead } from "@/lib/emailjs"
import { toFullPhone } from "@/lib/phone-420"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PhoneDigitsInput } from "@/components/phone-digits-input"
import { cn } from "@/lib/utils"
import { Building2, Car, Check, Loader2, Lock, TrendingUp } from "lucide-react"

const LOCK_THRESHOLD_PX = 10

/**
 * Wraps the amount slider so that on touch devices:
 * - Vertical drag scrolls the page (no conflict).
 * - Horizontal drag moves the slider (axis lock after threshold).
 * Mouse interaction is unchanged (overlay is disabled on non-touch).
 */
function SliderTouchLock({
  minIndex,
  maxIndex,
  valueIndex,
  onValueChange,
  children,
}: {
  minIndex: number
  maxIndex: number
  valueIndex: number
  onValueChange: (index: number) => void
  children: React.ReactNode
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const lockedRef = useRef<"horizontal" | "vertical" | null>(null)

  const clampIndex = useCallback(
    (i: number) => Math.max(minIndex, Math.min(maxIndex, Math.round(i))),
    [minIndex, maxIndex],
  )

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]
    if (!t) return
    startRef.current = { x: t.clientX, y: t.clientY }
    lockedRef.current = null
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const t = e.touches[0]
      const track = trackRef.current
      if (!t || !track) return

      const dx = t.clientX - (startRef.current?.x ?? t.clientX)
      const dy = t.clientY - (startRef.current?.y ?? t.clientY)

      if (lockedRef.current === null) {
        const adx = Math.abs(dx)
        const ady = Math.abs(dy)
        if (adx + ady < LOCK_THRESHOLD_PX) return
        lockedRef.current = adx >= ady ? "horizontal" : "vertical"
      }

      if (lockedRef.current === "vertical") return

      e.preventDefault()
      const rect = track.getBoundingClientRect()
      const ratio = (t.clientX - rect.left) / rect.width
      const index = clampIndex(ratio * (maxIndex - minIndex) + minIndex)
      onValueChange(index)
    },
    [minIndex, maxIndex, clampIndex, onValueChange],
  )

  const handleTouchEnd = useCallback(() => {
    startRef.current = null
    lockedRef.current = null
  }, [])

  return (
    <div
      ref={trackRef}
      className="relative w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ touchAction: "pan-y" }}
    >
      {children}
      <div
        className="absolute inset-0 z-10 pointer-events-none [@media(hover:none)]:pointer-events-auto"
        aria-hidden
      />
    </div>
  )
}

const REAL_ESTATE_RANGE = { min: 100000, max: 25000000, step: 100000 }
const CAR_RANGE = { min: 50000, max: 5000000, step: 5000 }

const CAR_AMOUNT_VALUES = (() => {
  const low: number[] = []
  for (let v = 50000; v <= 500000; v += 10000) low.push(v)
  const high: number[] = []
  for (let v = 600000; v <= 5000000; v += 100000) high.push(v)
  return [...low, ...high]
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

const DEFAULT_REAL_ESTATE_AMOUNT = 2000000
const DEFAULT_CAR_AMOUNT = 100000

function randomSocialProofAmount(min: number, max: number): string {
  const value = min + Math.random() * (max - min)
  return value.toFixed(1).replace(/\.0$/, "")
}

function getSocialProofText(): string {
  const amount = randomSocialProofAmount(2.1, 23)
  return `Za posledních 30 dní vyplaceno již ${amount} mil. Kč. Průměrná doba vyřízení: 24h.`
}

const SOCIAL_PROOF_FALLBACK = "Za posledních 30 dní vyplaceno již 3.9 mil. Kč. Průměrná doba vyřízení: 24h."

const serviceTypeEnum = z.enum(["zpetny-leasing", "zastava", "primy-vykup", "bez-zajisteni"])

const calculatorSchema = z
  .object({
    assetMode: z.enum(["real-estate", "car"]),
    name: z.string(),
    email: z.string(),
    phoneDigits: z.string(),
    serviceType: serviceTypeEnum,
    amountCzk: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    vehicleModel: z.string(),
    year: z.string(),
    mileage: z.string(),
    vin: z.string(),
    contractDurationMonths: z.string(),
    vehicleAmountCzk: z.number(),
  })
  .superRefine((data, ctx) => {
    if (!z.string().email().safeParse(data.email.trim()).success) {
      ctx.addIssue({ code: "custom", message: "Zadejte platný e-mail.", path: ["email"] })
    }
    if (toFullPhone(data.phoneDigits) === "") {
      ctx.addIssue({
        code: "custom",
        message: "Zadejte platné telefonní číslo (9 číslic).",
        path: ["phoneDigits"],
      })
    }

    if (data.assetMode === "real-estate") {
      if (data.name.trim().length < 2) {
        ctx.addIssue({ code: "custom", message: "Zadejte jméno.", path: ["name"] })
      }
      if (data.amountCzk < REAL_ESTATE_RANGE.min || data.amountCzk > REAL_ESTATE_RANGE.max) {
        ctx.addIssue({ code: "custom", message: "Neplatná částka.", path: ["amountCzk"] })
      }
    } else {
      if (data.firstName.trim().length < 1) {
        ctx.addIssue({ code: "custom", message: "Zadejte jméno.", path: ["firstName"] })
      }
      if (data.lastName.trim().length < 1) {
        ctx.addIssue({ code: "custom", message: "Zadejte příjmení.", path: ["lastName"] })
      }
      if (data.vehicleModel.trim().length < 1) {
        ctx.addIssue({ code: "custom", message: "Zadejte značku a model.", path: ["vehicleModel"] })
      }
      if (data.year.trim().length < 2) {
        ctx.addIssue({ code: "custom", message: "Zadejte rok výroby.", path: ["year"] })
      }
      if (data.mileage.trim().length < 1) {
        ctx.addIssue({ code: "custom", message: "Zadejte počet kilometrů.", path: ["mileage"] })
      }
      if (data.vehicleAmountCzk < CAR_RANGE.min || data.vehicleAmountCzk > CAR_RANGE.max) {
        ctx.addIssue({ code: "custom", message: "Neplatná částka.", path: ["vehicleAmountCzk"] })
      }
      const contractMonths = data.contractDurationMonths.trim()
      if (contractMonths.length > 0) {
        if (!/^\d+$/.test(contractMonths)) {
          ctx.addIssue({
            code: "custom",
            message: "Zadejte počet měsíců jako celé číslo.",
            path: ["contractDurationMonths"],
          })
        } else {
          const n = Number.parseInt(contractMonths, 10)
          if (n < 1 || n > 360) {
            ctx.addIssue({
              code: "custom",
              message: "Zadejte počet měsíců v rozmezí 1–360.",
              path: ["contractDurationMonths"],
            })
          }
        }
      }
    }
  })

type CalculatorFormValues = z.infer<typeof calculatorSchema>

function emptyCarFields(): Pick<
  CalculatorFormValues,
  | "firstName"
  | "lastName"
  | "vehicleModel"
  | "year"
  | "mileage"
  | "vin"
  | "contractDurationMonths"
  | "vehicleAmountCzk"
> {
  return {
    firstName: "",
    lastName: "",
    vehicleModel: "",
    year: "",
    mileage: "",
    vin: "",
    contractDurationMonths: "",
    vehicleAmountCzk: snapToCarValue(DEFAULT_CAR_AMOUNT),
  }
}

function emptyRealEstateFields(): Pick<CalculatorFormValues, "name" | "serviceType" | "amountCzk"> {
  return {
    name: "",
    serviceType: "zpetny-leasing",
    amountCzk: snapToRealEstateValue(DEFAULT_REAL_ESTATE_AMOUNT),
  }
}

const phoneInputWrapperClass =
  "flex h-11 w-full items-center rounded-md border border-border bg-secondary px-3 text-sm shadow-sm outline-none transition-[color,box-shadow] focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:border-ring"

const requiredStar = <span className="text-red-600">*</span>

export function LoanCalculator() {
  const [socialProofText, setSocialProofText] = useState(SOCIAL_PROOF_FALLBACK)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  useEffect(() => {
    setSocialProofText(getSocialProofText())
  }, [])

  const defaultValues: CalculatorFormValues = {
    assetMode: "real-estate",
    ...emptyRealEstateFields(),
    email: "",
    phoneDigits: "",
    ...emptyCarFields(),
  }

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues,
    mode: "onSubmit",
    /** Avoid re-running full Zod superRefine on every keystroke / slider move (default is onChange). */
    reValidateMode: "onSubmit",
  })

  const assetMode = form.watch("assetMode")
  const amountCzk = form.watch("amountCzk")
  const vehicleAmountCzk = form.watch("vehicleAmountCzk")
  const privacyPolicyHref =
    assetMode === "real-estate"
      ? "/ochrana-osobnich-udaju/nemovitosti"
      : "/ochrana-osobnich-udaju/vozidla"

  const switchAssetMode = useCallback(
    (mode: "real-estate" | "car") => {
      const email = form.getValues("email")
      const phoneDigits = form.getValues("phoneDigits")
      if (mode === "car") {
        form.reset({
          assetMode: "car",
          email,
          phoneDigits,
          ...emptyRealEstateFields(),
          name: "",
          ...emptyCarFields(),
        })
      } else {
        form.reset({
          assetMode: "real-estate",
          email,
          phoneDigits,
          ...emptyRealEstateFields(),
          ...emptyCarFields(),
        })
      }
      setSubmitStatus("idle")
    },
    [form],
  )

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

  const maxIdxRe = REAL_ESTATE_AMOUNT_VALUES.length - 1
  const valueIndexRe = realEstateAmountToIndex(amountCzk)
  const maxIdxCar = CAR_AMOUNT_VALUES.length - 1
  const valueIndexCar = carAmountToIndex(vehicleAmountCzk)

  const onSubmit = async (values: CalculatorFormValues) => {
    if (submitStatus === "success") return
    const phone = toFullPhone(values.phoneDigits)
    if (!phone) return
    setSubmitStatus("sending")
    try {
      let name: string
      let amount: number
      let assetType: string
      let serviceType: string
      if (values.assetMode === "real-estate") {
        name = values.name.trim()
        amount = snapToRealEstateValue(values.amountCzk)
        assetType = "Nemovitost"
        serviceType =
          realEstateServices.find((s) => s.value === values.serviceType)?.label ?? values.serviceType
      } else {
        name = `${values.firstName.trim()} ${values.lastName.trim()}`.trim()
        amount = snapToCarValue(values.vehicleAmountCzk)
        assetType = "Automobil"
        const vinPart = values.vin.trim() ? `, VIN ${values.vin.trim()}` : ""
        const contractPart = values.contractDurationMonths.trim()
          ? `, trvání smlouvy ${values.contractDurationMonths.trim()} měs.`
          : ""
        serviceType = `Peníze ihned a jezděte dál — ${values.vehicleModel.trim()}, r.v. ${values.year.trim()}, ${values.mileage.trim()} km${vinPart}${contractPart}`
      }
      await sendLead({
        source: "calculator",
        phone,
        email: values.email.trim(),
        name,
        amount,
        assetType,
        serviceType,
      })
      setSubmitStatus("success")
      toast.success("Děkujeme za poptávku", {
        id: "lead-calculator-success",
        description: "Brzy vás budeme kontaktovat. Zkontrolujte prosím i složku s nevyžádanou poštou.",
        duration: 5000,
      })
      const emailKeep = values.email
      const phoneKeep = values.phoneDigits
      if (values.assetMode === "real-estate") {
        form.reset({
          assetMode: "real-estate",
          email: emailKeep,
          phoneDigits: phoneKeep,
          ...emptyRealEstateFields(),
          ...emptyCarFields(),
        })
      } else {
        form.reset({
          assetMode: "car",
          email: emailKeep,
          phoneDigits: phoneKeep,
          ...emptyRealEstateFields(),
          name: "",
          ...emptyCarFields(),
        })
      }
    } catch (e) {
      setSubmitStatus("error")
      const hint = e instanceof Error ? e.message.trim() : ""
      const description =
        hint.length > 0 && hint.length <= 220
          ? hint
          : "Zkuste to prosím znovu nebo nás kontaktujte telefonicky. Podrobnosti jsou v konzoli prohlížeče (F12)."
      toast.error("Odeslání se nepovedlo", {
        id: "lead-calculator-error",
        description,
        duration: 9000,
      })
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

        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Typ zajištění</Label>
            <Tabs
              value={assetMode}
              onValueChange={(v) => switchAssetMode(v as "real-estate" | "car")}
              className="gap-3"
            >
              <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="real-estate"
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-lg border-2 px-3 py-3 text-sm font-semibold shadow-none transition-all data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=inactive]:border-border data-[state=inactive]:bg-secondary data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:border-primary/50"
                >
                  <Building2 className="h-4 w-4 shrink-0" aria-hidden />
                  Nemovitost
                </TabsTrigger>
                <TabsTrigger
                  value="car"
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-lg border-2 px-3 py-3 text-sm font-semibold shadow-none transition-all data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=inactive]:border-border data-[state=inactive]:bg-secondary data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:border-primary/50"
                >
                  <Car className="h-4 w-4 shrink-0" aria-hidden />
                  Vozidlo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="real-estate" className="mt-0 space-y-4 outline-none">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Typ služby</Label>
                  <div className="flex flex-wrap lg:flex-nowrap gap-2 min-w-0" role="radiogroup" aria-label="Typ služby">
                    {realEstateServices.map((service) => (
                      <button
                        key={service.value}
                        type="button"
                        role="radio"
                        aria-checked={form.watch("serviceType") === service.value}
                        onClick={() =>
                          form.setValue("serviceType", service.value as CalculatorFormValues["serviceType"])
                        }
                        className={`flex items-center justify-center min-w-0 lg:flex-1 px-3 lg:px-1.5 py-2.5 rounded-lg transition-all text-xs font-medium text-center whitespace-normal leading-tight ${
                          form.watch("serviceType") === service.value
                            ? "bg-primary/10 border-2 border-primary text-primary"
                            : "bg-secondary border-2 border-transparent text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {service.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-muted-foreground">Požadovaná částka</Label>
                    <span className="text-base font-bold text-primary">{formatAmount(snapToRealEstateValue(amountCzk))}</span>
                  </div>
                  <SliderTouchLock
                    minIndex={0}
                    maxIndex={maxIdxRe}
                    valueIndex={valueIndexRe}
                    onValueChange={(i) =>
                      form.setValue("amountCzk", REAL_ESTATE_AMOUNT_VALUES[i])
                    }
                  >
                    <Slider
                      value={[valueIndexRe]}
                      onValueChange={([i]) =>
                        form.setValue("amountCzk", REAL_ESTATE_AMOUNT_VALUES[i])
                      }
                      min={0}
                      max={maxIdxRe}
                      step={1}
                      className="w-full"
                    />
                  </SliderTouchLock>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatRangeLabel(REAL_ESTATE_RANGE.min)}</span>
                    <span>{formatRangeLabel(REAL_ESTATE_RANGE.max)}</span>
                  </div>
                  <Controller
                    name="amountCzk"
                    control={form.control}
                    render={({ field }) => <input type="hidden" {...field} value={field.value} readOnly />}
                  />
                </div>

                <div className="flex items-center gap-2 py-2 px-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-[11px] text-muted-foreground">{socialProofText}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                      Jméno a příjmení {requiredStar}
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      className="bg-secondary border-border h-11 text-sm"
                      aria-invalid={Boolean(form.formState.errors.name)}
                      aria-describedby={form.formState.errors.name ? "name-error" : undefined}
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-600">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone-nem" className="text-sm font-medium text-muted-foreground">
                      Telefon {requiredStar}
                    </Label>
                    <PhoneDigitsInput
                      id="phone-nem"
                      className={phoneInputWrapperClass}
                      inputClassName="placeholder:text-muted-foreground"
                      value={form.watch("phoneDigits")}
                      onChange={(v) => form.setValue("phoneDigits", v)}
                      aria-invalid={Boolean(form.formState.errors.phoneDigits)}
                      aria-describedby={form.formState.errors.phoneDigits ? "phone-nem-error" : undefined}
                    />
                    {form.formState.errors.phoneDigits && (
                      <p id="phone-nem-error" className="mt-1 text-sm text-red-600">
                        {form.formState.errors.phoneDigits.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email-nem" className="text-sm font-medium text-muted-foreground">
                    E-mail {requiredStar}
                  </Label>
                  <Input
                    id="email-nem"
                    type="email"
                    autoComplete="email"
                    className="bg-secondary border-border h-11 text-sm"
                    aria-invalid={Boolean(form.formState.errors.email)}
                    aria-describedby={form.formState.errors.email ? "email-nem-error" : undefined}
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p id="email-nem-error" className="mt-1 text-sm text-red-600">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="car" className="mt-0 space-y-4 outline-none">
                <div className="space-y-1">
                  <Label htmlFor="vehicle-model" className="text-sm font-medium text-muted-foreground">
                    Značka a model vozu {requiredStar}
                  </Label>
                  <Input
                    id="vehicle-model"
                    className="bg-secondary border-border h-11 text-sm"
                    aria-invalid={Boolean(form.formState.errors.vehicleModel)}
                    aria-describedby={form.formState.errors.vehicleModel ? "vehicle-model-error" : undefined}
                    {...form.register("vehicleModel")}
                  />
                  <p className="text-xs text-muted-foreground">Např. Škoda Fabia</p>
                  {form.formState.errors.vehicleModel && (
                    <p id="vehicle-model-error" className="mt-1 text-sm text-red-600">
                      {form.formState.errors.vehicleModel.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="vehicle-year" className="text-sm font-medium text-muted-foreground">
                      Rok výroby {requiredStar}
                    </Label>
                    <Input
                      id="vehicle-year"
                      inputMode="numeric"
                      className="bg-secondary border-border h-11 text-sm"
                      aria-invalid={Boolean(form.formState.errors.year)}
                      aria-describedby={form.formState.errors.year ? "vehicle-year-error" : undefined}
                      {...form.register("year")}
                    />
                    <p className="text-xs text-muted-foreground">Např. 2019</p>
                    {form.formState.errors.year && (
                      <p id="vehicle-year-error" className="mt-1 text-sm text-red-600">
                        {form.formState.errors.year.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="vehicle-km" className="text-sm font-medium text-muted-foreground">
                      Počet najetých kilometrů {requiredStar}
                    </Label>
                    <Input
                      id="vehicle-km"
                      inputMode="numeric"
                      className="bg-secondary border-border h-11 text-sm"
                      aria-invalid={Boolean(form.formState.errors.mileage)}
                      aria-describedby={form.formState.errors.mileage ? "vehicle-km-error" : undefined}
                      {...form.register("mileage")}
                    />
                    <p className="text-xs text-muted-foreground">Např. 142 000 km</p>
                    {form.formState.errors.mileage && (
                      <p id="vehicle-km-error" className="mt-1 text-sm text-red-600">
                        {form.formState.errors.mileage.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="vehicle-vin" className="text-sm font-medium text-muted-foreground">
                    VIN (nepovinné)
                  </Label>
                  <Input id="vehicle-vin" className="bg-secondary border-border h-11 text-sm" {...form.register("vin")} />
                  <p className="text-xs text-muted-foreground">Např. TMBJF7CN0S123456</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-muted-foreground">Požadovaná částka</Label>
                    <span className="text-base font-bold text-primary">
                      {formatAmount(snapToCarValue(vehicleAmountCzk))}
                    </span>
                  </div>
                  <SliderTouchLock
                    minIndex={0}
                    maxIndex={maxIdxCar}
                    valueIndex={valueIndexCar}
                    onValueChange={(i) =>
                      form.setValue("vehicleAmountCzk", CAR_AMOUNT_VALUES[i])
                    }
                  >
                    <Slider
                      value={[valueIndexCar]}
                      onValueChange={([i]) =>
                        form.setValue("vehicleAmountCzk", CAR_AMOUNT_VALUES[i])
                      }
                      min={0}
                      max={maxIdxCar}
                      step={1}
                      className="w-full"
                    />
                  </SliderTouchLock>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatRangeLabel(CAR_RANGE.min)}</span>
                    <span>{formatRangeLabel(CAR_RANGE.max)}</span>
                  </div>
                  <Controller
                    name="vehicleAmountCzk"
                    control={form.control}
                    render={({ field }) => <input type="hidden" {...field} value={field.value} readOnly />}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="contract-duration-months" className="text-sm font-medium text-muted-foreground">
                    Trvání smlouvy (měsíce)
                  </Label>
                  <Input
                    id="contract-duration-months"
                    inputMode="numeric"
                    autoComplete="off"
                    className="bg-secondary border-border h-11 text-sm"
                    aria-invalid={Boolean(form.formState.errors.contractDurationMonths)}
                    aria-describedby={
                      form.formState.errors.contractDurationMonths ? "contract-duration-months-error" : undefined
                    }
                    {...form.register("contractDurationMonths")}
                  />
                  <p className="text-xs text-muted-foreground">Např. 24</p>
                  {form.formState.errors.contractDurationMonths && (
                    <p id="contract-duration-months-error" className="mt-1 text-sm text-red-600">
                      {form.formState.errors.contractDurationMonths.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 py-2 px-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-[11px] text-muted-foreground">{socialProofText}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="first-name" className="text-sm font-medium text-muted-foreground">
                      Jméno {requiredStar}
                    </Label>
                    <Input
                      id="first-name"
                      autoComplete="given-name"
                      className="bg-secondary border-border h-11 text-sm"
                      aria-invalid={Boolean(form.formState.errors.firstName)}
                      aria-describedby={form.formState.errors.firstName ? "first-name-error" : undefined}
                      {...form.register("firstName")}
                    />
                    {form.formState.errors.firstName && (
                      <p id="first-name-error" className="mt-1 text-sm text-red-600">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="last-name" className="text-sm font-medium text-muted-foreground">
                      Příjmení {requiredStar}
                    </Label>
                    <Input
                      id="last-name"
                      autoComplete="family-name"
                      className="bg-secondary border-border h-11 text-sm"
                      aria-invalid={Boolean(form.formState.errors.lastName)}
                      aria-describedby={form.formState.errors.lastName ? "last-name-error" : undefined}
                      {...form.register("lastName")}
                    />
                    {form.formState.errors.lastName && (
                      <p id="last-name-error" className="mt-1 text-sm text-red-600">
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone-voz" className="text-sm font-medium text-muted-foreground">
                    Telefonní číslo {requiredStar}
                  </Label>
                  <PhoneDigitsInput
                    id="phone-voz"
                    className={phoneInputWrapperClass}
                    inputClassName="placeholder:text-muted-foreground"
                    value={form.watch("phoneDigits")}
                    onChange={(v) => form.setValue("phoneDigits", v)}
                    aria-invalid={Boolean(form.formState.errors.phoneDigits)}
                    aria-describedby={form.formState.errors.phoneDigits ? "phone-voz-error" : undefined}
                  />
                  {form.formState.errors.phoneDigits && (
                    <p id="phone-voz-error" className="mt-1 text-sm text-red-600">
                      {form.formState.errors.phoneDigits.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email-voz" className="text-sm font-medium text-muted-foreground">
                    E-mail {requiredStar}
                  </Label>
                  <Input
                    id="email-voz"
                    type="email"
                    autoComplete="email"
                    className="bg-secondary border-border h-11 text-sm"
                    aria-invalid={Boolean(form.formState.errors.email)}
                    aria-describedby={form.formState.errors.email ? "email-voz-error" : undefined}
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p id="email-voz-error" className="mt-1 text-sm text-red-600">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <p className="text-xs text-muted-foreground">
            Odesláním poptávky souhlasíte s naším{" "}
            <Link href={privacyPolicyHref} className="text-primary hover:underline">
              Prohlášením o ochraně osobních údajů
            </Link>
            .
          </p>

          <Button
            type="submit"
            size="lg"
            disabled={submitStatus === "sending" || submitStatus === "success"}
            aria-busy={submitStatus === "sending"}
            className={cn(
              "w-full text-sm sm:text-base font-semibold h-auto min-h-12 py-3 px-4 rounded-lg text-balance transition-all disabled:pointer-events-none flex items-center justify-center gap-2",
              submitStatus === "success"
                ? "border-2 border-primary/20 bg-primary/10 text-primary shadow-none hover:bg-primary/10"
                : "bg-gold hover:bg-gold/90 text-gold-foreground active:scale-[0.98] disabled:opacity-65",
            )}
          >
            {submitStatus === "sending" ? (
              <>
                <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
                Odesílám…
              </>
            ) : submitStatus === "success" ? (
              <>
                <Check className="h-5 w-5 shrink-0 stroke-[2.5]" aria-hidden />
                Poptávka odeslána
              </>
            ) : (
              "Odeslat nezávaznou poptávku"
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
