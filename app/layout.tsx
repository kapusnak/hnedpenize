import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GoogleAdsGtag } from "@/components/google-ads-gtag"
import { GoogleAnalytics } from "@/components/google-analytics"
import { GoogleTagManager } from "@/components/google-tag-manager"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })

const siteTitle = "Spolehlivé financování: Zajištěné úvěry"
const siteDescription =
  "Získejte finanční prostředky prostřednictvím zpětného leasingu. Rychle, jednoduše a bez zbytečné byrokracie."

// Set NEXT_PUBLIC_SITE_URL (e.g. https://yourdomain.com) for absolute OG image URLs when sharing
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export const metadata: Metadata = {
  ...(siteUrl && { metadataBase: new URL(siteUrl) }),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    images: ["/og-social-share.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-social-share.png"],
  },
  icons: {
    icon: [{ url: "/logo-house-lock.png", type: "image/png", sizes: "88x84" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs">
      <body className="font-sans antialiased">
        <GoogleTagManager />
        <GoogleAdsGtag />
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  )
}
