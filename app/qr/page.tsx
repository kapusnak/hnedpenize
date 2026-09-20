import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { isCrawlerUserAgent } from "@/lib/crawler-user-agent"
import { QrLetakLanding } from "./qr-letak-landing"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Přesměrování",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default async function QrPage() {
  const userAgent = (await headers()).get("user-agent")
  if (isCrawlerUserAgent(userAgent)) {
    redirect("/")
  }

  return (
    <>
      <noscript>
        <meta httpEquiv="refresh" content="0;url=/" />
      </noscript>
      <QrLetakLanding />
    </>
  )
}
