"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { sendLead } from "@/lib/emailjs"
import { formatPhoneDisplay, parsePhoneDigits, toFullPhone } from "@/lib/phone-420"
import { X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LeadPopup() {
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
      setSubmitStatus("error")
      return
    }
    setSubmitStatus("sending")
    try {
      await sendLead({ source: "popup", phone: fullPhone })
      setSubmitStatus("success")
      setTimeout(() => handleClose(), 1500)
    } catch {
      setSubmitStatus("error")
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
            {/* Phone input */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                placeholder="+420 111 111 111"
                value={formatPhoneDisplay(phoneDigits)}
                onChange={(e) => setPhoneDigits(parsePhoneDigits(e.target.value))}
                className="w-full h-10 lg:h-12 pl-10 pr-4 rounded-lg bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>

            {submitStatus === "error" && (
              <p className="text-xs text-red-200">Odeslání se nepovedlo. Zkuste to znovu.</p>
            )}
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
