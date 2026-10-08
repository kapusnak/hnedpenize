"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"

const CookieChrome = dynamic(
  () => import("@/components/cookie-chrome").then((mod) => mod.CookieChrome),
  { ssr: false },
)

/** QR landings must keep their redirect timing; no cookie bar and no lead popup there. */
const COOKIE_BAR_HIDDEN = new Set(["/qr", "/qrposta"])

/**
 * Mounts the cookie bar on every page except `/qr` and `/qrposta`.
 * The homepage lead popup is lifted above the bar (docasnyvykup bottom-chrome).
 */
export function BottomChrome() {
  const pathname = usePathname()
  if (COOKIE_BAR_HIDDEN.has(pathname ?? "")) return null

  return <CookieChrome showLeadPopup={pathname === "/"} />
}
