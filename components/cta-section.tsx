"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

import { sendLead } from "@/lib/emailjs"
import { formatPhoneDisplay, parsePhoneDigits, toFullPhone } from "@/lib/phone-420"
import { Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
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
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="tel"
            placeholder="+420 111 111 111"
            value={formatPhoneDisplay(phoneDigits)}
            onChange={(e) => setPhoneDigits(parsePhoneDigits(e.target.value))}
            className="pl-10 h-12 md:h-14 bg-card border-0 text-foreground placeholder:text-muted-foreground"
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
    </div>
  )
}
