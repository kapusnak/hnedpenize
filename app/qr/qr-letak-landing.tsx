"use client"

import { useEffect } from "react"
import { isCrawlerUserAgent } from "@/lib/crawler-user-agent"
import {
  markQrLetakPending,
  trackQrLetakScan,
  whenAnalyticsReady,
} from "@/lib/track-qr-letak"

const HOME_PATH = "/"

export function QrLetakLanding() {
  useEffect(() => {
    let cancelled = false

    const goHome = () => {
      if (!cancelled) window.location.replace(HOME_PATH)
    }

    if (isCrawlerUserAgent(navigator.userAgent)) {
      goHome()
      return
    }

    markQrLetakPending()
    whenAnalyticsReady(() => {
      if (cancelled) return
      trackQrLetakScan(goHome)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="min-h-dvh bg-gradient-to-b from-blue-400 via-primary to-blue-700 flex flex-col items-center justify-center px-4">
      <p className="text-white text-lg font-medium">Načítání…</p>
      <noscript>
        <p className="text-white/80 mt-4 text-center text-sm">
          <a href={HOME_PATH} className="underline">
            Pokračovat na hlavní stránku
          </a>
        </p>
      </noscript>
    </main>
  )
}
