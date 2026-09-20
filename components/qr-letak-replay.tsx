"use client"

import { useEffect } from "react"
import { consumePendingQrLetakScan } from "@/lib/track-qr-letak"

/** Replays `qr_letak` once if `/qr` left before GTM acknowledged the event. */
export function QrLetakReplay() {
  useEffect(() => {
    if (window.location.pathname === "/qr") return
    consumePendingQrLetakScan()
  }, [])
  return null
}
