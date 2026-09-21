/** Exact event name shared with sibling flyer QR landings — do not rename. */
export const GA_EVENT_QR_LETAK = "qr_letak"

export const QR_LETAK_CAMPAIGN = {
  campaign_source: "letak",
  campaign_medium: "qr",
  campaign_name: "letak_print",
} as const

export const QR_LETAK_PENDING_KEY = "qr_letak_pending"

/** Wait for `window.gtag` (GTM Google tag or the direct GA snippet). */
export const GTAG_READY_MS = 4000
/** Fallback if `event_callback` never runs after `gtag('event', ...)`. */
export const EVENT_HANDOFF_MS = 4000

function finishOnce(fn: (() => void) | undefined): () => void {
  let done = false
  return () => {
    if (done) return
    done = true
    fn?.()
  }
}

function isGtagReady(): boolean {
  return typeof window.gtag === "function"
}

function gtagCampaign(): {
  source: string
  medium: string
  name: string
} {
  return {
    source: QR_LETAK_CAMPAIGN.campaign_source,
    medium: QR_LETAK_CAMPAIGN.campaign_medium,
    name: QR_LETAK_CAMPAIGN.campaign_name,
  }
}

export function markQrLetakPending(): void {
  try {
    sessionStorage.setItem(QR_LETAK_PENDING_KEY, "1")
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearQrLetakPending(): void {
  try {
    sessionStorage.removeItem(QR_LETAK_PENDING_KEY)
  } catch {
    /* ignore */
  }
}

function hasQrLetakPending(): boolean {
  try {
    return sessionStorage.getItem(QR_LETAK_PENDING_KEY) === "1"
  } catch {
    return false
  }
}

/**
 * Records exactly one flyer QR scan via `gtag('event', 'qr_letak')`.
 * Does not push a GTM Custom Event on dataLayer (avoids a second GA4 hit
 * while the container tag `GA4 - qr_letak` is still live / being paused).
 */
export function trackQrLetakScan(onDone?: () => void, timeoutMs = EVENT_HANDOFF_MS): void {
  if (typeof window === "undefined") {
    onDone?.()
    return
  }

  const go = finishOnce(onDone)
  const succeed = () => {
    clearQrLetakPending()
    go()
  }

  const gtag = window.gtag
  if (typeof gtag !== "function") {
    go()
    return
  }

  const timer = window.setTimeout(succeed, timeoutMs)

  gtag("set", { campaign: gtagCampaign() })
  gtag("event", GA_EVENT_QR_LETAK, {
    ...QR_LETAK_CAMPAIGN,
    transport_type: "beacon",
    event_callback: () => {
      window.clearTimeout(timer)
      succeed()
    },
    event_timeout: timeoutMs,
  })
}

/**
 * Wait until `window.gtag` is a function (GTM Google tag or direct gtag.js).
 * Still invokes `onReady` after `waitMs` so `/qr` is never stuck on loading.
 */
export function whenGtagReady(onReady: () => void, waitMs = GTAG_READY_MS): void {
  if (typeof window === "undefined") {
    onReady()
    return
  }
  if (isGtagReady()) {
    onReady()
    return
  }
  const started = Date.now()
  const id = window.setInterval(() => {
    if (isGtagReady() || Date.now() - started >= waitMs) {
      window.clearInterval(id)
      onReady()
    }
  }, 50)
}

/** Homepage safety net: only if `/qr` never successfully handed off via gtag. */
export function consumePendingQrLetakScan(): void {
  if (typeof window === "undefined") return
  if (!hasQrLetakPending()) return
  whenGtagReady(() => {
    if (!hasQrLetakPending()) return
    trackQrLetakScan()
  })
}
