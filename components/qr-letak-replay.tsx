"use client"

import { useEffect } from "react"
import {
  consumePendingQrLetakScan,
  consumePendingQrPostaScan,
  QR_LETAK_PATH,
  QR_POSTA_PATH,
} from "@/lib/track-qr-letak"

/**
 * Replays a flyer QR event once if its landing never handed the event off
 * via gtag. Each landing skips its own replay so a refresh cannot double-count.
 */
export function QrLetakReplay() {
  useEffect(() => {
    const path = window.location.pathname
    // `/qr` owns `qr_letak`. Returning here keeps that page on the proven path.
    if (path === QR_LETAK_PATH) return
    if (path !== QR_POSTA_PATH) consumePendingQrLetakScan()
    // `/qrposta` owns `qr_posta`.
    if (path === QR_POSTA_PATH) return
    consumePendingQrPostaScan()
  }, [])
  return null
}
