"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

import { sendLead } from "@/lib/emailjs"
import { toFullPhone } from "@/lib/phone-420"
import { PhoneDigitsInput } from "@/components/phone-digits-input"
import { X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LeadPopup() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [isClosed, setIsClosed] = useState(false)
  const [shouldShake, setShouldShake] = useState(false)
  const [phoneDigits, setPhoneDigits] = useState("")
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  // Show popup after 12 seconds
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 12000)

    return () => clearTimeout(showTimer)
  }, [])

  // Shake animation every 8 seconds
  useEffect(() => {
    if (!isVisible || isClosed) return

    const shakeInterval = setInterval(() => {
      setShouldShake(true)
      setTimeout(() => setShouldShake(false), 500)
    }, 8000)

    return () => clearInterval(shakeInterval)
  }, [isVisible, isClosed])

  const handleClose = () => {
    setIsClosed(true)
    setIsVisible(false)
  }

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
      await sendLead({ source: "popup", phone: fullPhone, pagePath: pathname })
      setSubmitStatus("success")
      toast.success("Děkujeme za poptávku", {
        id: "lead-popup-success",
        description: "Brzy vás budeme kontaktovat. Zkontrolujte prosím i složku s nevyžádanou poštou.",
        duration: 5000,
      })
      setTimeout(() => handleClose(), 1500)
    } catch (e) {
      setSubmitStatus("error")
      const hint = e instanceof Error ? e.message.trim() : ""
      const description =
        hint.length > 0 && hint.length <= 220
          ? hint
          : "Zkuste to prosím znovu nebo nás kontaktujte telefonicky. Podrobnosti jsou v konzoli prohlížeče (F12)."
      toast.error("Odeslání se nepovedlo", {
        id: "lead-popup-error",
        description,
        duration: 9000,
      })
    }
  }

  if (!isVisible || isClosed) return null

  return (
    <>
      {/* Backdrop for mobile - subtle overlay */}
      <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={handleClose} />

      {/* Popup */}
      <div
        className={`
          fixed z-50
          /* Mobile: bottom sheet, slide in from bottom */
          bottom-0 left-0 right-0 max-h-[33vh] animate-slide-in-bottom
          /* Desktop: floating card bottom-right, no slide animation */
          lg:bottom-6 lg:right-6 lg:left-auto lg:max-h-none lg:w-[380px] lg:animate-none
          bg-primary rounded-t-2xl lg:rounded-2xl shadow-2xl
          transition-all duration-300 ease-out
          ${shouldShake ? "animate-shake" : ""}
        `}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Zavřít"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-4 pb-6 lg:p-6">
          {/* Title */}
          <h3 className="text-lg lg:text-2xl font-bold text-white pr-8">Potřebujete poradit?</h3>

          {/* Subtitle */}
          <p className="text-white/80 text-xs lg:text-sm mt-1 mb-3 lg:mb-4">
            Nechte nám kontakt, obratem se Vám ozveme a nezávazně vše prokonzultujeme.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 lg:gap-3">
            {/* National digits only; +420 is fixed — avoids caret-before-prefix and stray 420 digits in state */}
            <div className="flex h-10 lg:h-12 w-full items-center gap-2 rounded-lg bg-white pl-3 pr-4 text-foreground focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-0 focus-within:ring-offset-transparent">
              <Phone className="w-4 h-4 shrink-0 text-muted-foreground" aria-hidden />
              <PhoneDigitsInput
                className="min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none h-full"
                inputClassName="text-foreground placeholder:text-muted-foreground"
                prefixClassName="text-muted-foreground"
                value={phoneDigits}
                onChange={setPhoneDigits}
                autoComplete="off"
                name="phone"
                placeholder="111 111 111"
                aria-label="Telefonní číslo (9 číslic bez předvolby)"
              />
            </div>

            <Button
              type="submit"
              disabled={submitStatus === "sending"}
              className="w-full h-10 lg:h-12 px-5 lg:px-6 bg-gold hover:bg-gold/90 text-gold-foreground font-semibold rounded-lg whitespace-nowrap text-sm lg:text-base"
            >
              {submitStatus === "sending" ? "Odesílám…" : submitStatus === "success" ? "Odesláno" : "Zavolejte mi zdarma"}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
