"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

import { sendLead } from "@/lib/emailjs"
import { toFullPhone } from "@/lib/phone-420"
import { PhoneDigitsInput } from "@/components/phone-digits-input"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  const pathname = usePathname()
  const [phoneDigits, setPhoneDigits] = useState("")
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullPhone = toFullPhone(phoneDigits)
    if (!fullPhone) {
      toast.error("Zadejte platné telefonní číslo (9 číslic).", {
        id: "lead-phone-invalid",
        duration: 6500,
      })
      return
    }
    setSubmitStatus("sending")
    try {
      await sendLead({ source: "cta", phone: fullPhone, pagePath: pathname })
      setSubmitStatus("success")
      toast.success("Děkujeme za poptávku", {
        id: "lead-cta-success",
        description: "Brzy vás budeme kontaktovat. Zkontrolujte prosím i složku s nevyžádanou poštou.",
        duration: 5000,
      })
    } catch (e) {
      setSubmitStatus("error")
      const hint = e instanceof Error ? e.message.trim() : ""
      const description =
        hint.length > 0 && hint.length <= 220
          ? hint
          : "Zkuste to prosím znovu nebo nás kontaktujte telefonicky. Podrobnosti jsou v konzoli prohlížeče (F12)."
      toast.error("Odeslání se nepovedlo", {
        id: "lead-cta-error",
        description,
        duration: 9000,
      })
    }
  }

  return (
    <div className="bg-primary rounded-2xl md:rounded-3xl p-6 md:p-10 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">Potřebujete poradit?</h2>
      <p className="text-primary-foreground/80 mb-6 md:mb-8 max-w-md mx-auto">
        Nechte nám kontakt, obratem se Vám ozveme a nezávazně vše prokonzultujeme.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <div className="flex flex-1 min-w-0 h-12 md:h-14 items-center gap-2 rounded-md bg-card pl-3 pr-4 text-foreground focus-within:ring-2 focus-within:ring-ring/50 focus-within:ring-offset-2 focus-within:ring-offset-background">
          <Phone className="w-5 h-5 shrink-0 text-muted-foreground" aria-hidden />
          <PhoneDigitsInput
            className="min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none h-full"
            inputClassName="text-foreground placeholder:text-muted-foreground"
            prefixClassName="text-muted-foreground"
            value={phoneDigits}
            onChange={setPhoneDigits}
            autoComplete="off"
            name="phone"
            aria-label="Telefonní číslo (9 číslic bez předvolby)"
          />
        </div>
        <Button
          type="submit"
          disabled={submitStatus === "sending"}
          className="h-12 md:h-14 px-6 md:px-8 bg-gold hover:bg-gold/90 text-gold-foreground font-semibold text-base shadow-lg"
        >
          {submitStatus === "sending" ? "Odesílám…" : submitStatus === "success" ? "Odesláno" : "Zavolejte mi zdarma"}
        </Button>
      </form>
      <p className="text-sm text-primary-foreground/80 mt-4 max-w-md mx-auto">
        Zadáním svého telefonního čísla souhlasíte s naším{" "}
        <Link href="/ochrana-osobnich-udaju" className="text-primary-foreground underline underline-offset-2 hover:opacity-90">
          Prohlášením o ochraně osobních údajů
        </Link>
        .
      </p>
    </div>
  )
}
