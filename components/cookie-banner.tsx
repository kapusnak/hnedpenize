"use client"

import { startTransition, useEffect, useState } from "react"
import Link from "next/link"

import { COOKIE_CONSENT_STORAGE_KEY, persistCookieConsentAccepted } from "@/lib/cookie-consent"

type CookieBannerProps = {
  /** Fires when the bar is shown or hidden (e.g. to offset the lead popup above it). */
  onVisibleChange?: (visible: boolean) => void
}

export function CookieBanner({ onVisibleChange }: CookieBannerProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    startTransition(() => {
      try {
        if (!localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)) {
          setShow(true)
        }
      } catch {
        setShow(true)
      }
    })
  }, [])

  useEffect(() => {
    onVisibleChange?.(show)
  }, [show, onVisibleChange])

  function accept() {
    persistCookieConsentAccepted()
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      id="cookie-banner"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:px-8 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pt-4"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="text-sm leading-relaxed text-muted-foreground">
          <p id="cookie-banner-title" className="font-semibold text-foreground">
            Cookies a soukromí
          </p>
          <p className="mt-1.5">
            Používáme cookies nezbytné pro fungování webu a (po vašem souhlasu) analytické nástroje. Více v{" "}
            <Link href="/zasady-cookies" className="text-primary underline-offset-2 hover:underline">
              Zásadách cookies
            </Link>{" "}
            a{" "}
            <Link
              href="/ochrana-osobnich-udaju"
              className="text-primary underline-offset-2 hover:underline"
            >
              ochraně osobních údajů
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={accept}
          className="h-12 min-h-12 shrink-0 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Rozumím
        </button>
      </div>
    </div>
  )
}
