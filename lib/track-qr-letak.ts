/** Exact event name shared with sibling flyer QR landings — do not rename. */
export const GA_EVENT_QR_LETAK = "qr_letak"

export const QR_LETAK_CAMPAIGN = {
  campaign_source: "letak",
  campaign_medium: "qr",
  campaign_name: "letak_print",
} as const

function finishOnce(fn: (() => void) | undefined): () => void {
  let done = false
  return () => {
    if (done) return
    done = true
    fn?.()
  }
}

/**
 * Records a flyer QR scan via the existing GTM dataLayer and/or gtag, then
 * invokes `onDone` after the hit is handed off (or after a short timeout).
 */
export function trackQrLetakScan(onDone?: () => void, timeoutMs = 2000): void {
  if (typeof window === "undefined") {
    onDone?.()
    return
  }

  const done = finishOnce(onDone)
  const timer = window.setTimeout(done, timeoutMs)

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({
    event: GA_EVENT_QR_LETAK,
    ...QR_LETAK_CAMPAIGN,
  })

  const gtag = window.gtag
  if (!gtag) return

  gtag("set", {
    campaign: {
      source: QR_LETAK_CAMPAIGN.campaign_source,
      medium: QR_LETAK_CAMPAIGN.campaign_medium,
      name: QR_LETAK_CAMPAIGN.campaign_name,
    },
  })

  gtag("event", GA_EVENT_QR_LETAK, {
    ...QR_LETAK_CAMPAIGN,
    event_callback: () => {
      window.clearTimeout(timer)
      done()
    },
    event_timeout: timeoutMs,
  })
}

/** Wait until `window.gtag` exists (GA / Ads snippets are afterInteractive). */
export function whenGtagReady(onReady: () => void, waitMs = 1500): void {
  if (typeof window === "undefined") {
    onReady()
    return
  }
  if (typeof window.gtag === "function") {
    onReady()
    return
  }
  const started = Date.now()
  const id = window.setInterval(() => {
    if (typeof window.gtag === "function" || Date.now() - started >= waitMs) {
      window.clearInterval(id)
      onReady()
    }
  }, 50)
}
