"use client"

import Script from "next/script"

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export function GoogleAnalytics() {
  // Hybrid: GTM owns page_view. NEXT_PUBLIC_GA_MEASUREMENT_ID is still read
  // by track-qr-letak as send_to — do not load a second gtag.js / config.
  if (!GA_MEASUREMENT_ID || GTM_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
