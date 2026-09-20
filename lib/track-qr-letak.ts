/** Exact event name shared with sibling flyer QR landings — do not rename. */
export const GA_EVENT_QR_LETAK = "qr_letak"

export const QR_LETAK_CAMPAIGN = {
  campaign_source: "letak",
  campaign_medium: "qr",
  campaign_name: "letak_print",
} as const

export const QR_LETAK_PENDING_KEY = "qr_letak_pending"

const HAS_GTM = Boolean(process.env.NEXT_PUBLIC_GTM_ID?.trim())
const HAS_GA = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim())

/** Wait for GTM/gtag to boot before pushing `qr_letak`. */
export const ANALYTICS_READY_MS = 2000
/** Time for GTM tags / gtag to send after the event is queued. */
export const EVENT_HANDOFF_MS = 2000

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

function isGtmReady(): boolean {
  return (
    typeof window.google_tag_manager === "object" &&
    window.google_tag_manager != null
  )
}

/**
 * GTM-only properties must wait for the container, not Ads/gtag.
 * Ads `gtag` can exist while GA4 still lives only inside GTM.
 */
function isAnalyticsReady(): boolean {
  if (HAS_GTM) return isGtmReady()
  if (HAS_GA) return isGtagReady()
  return isGtagReady() || isGtmReady()
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
 * Records a flyer QR scan via GTM dataLayer and/or gtag, then invokes `onDone`
 * after GTM/gtag handoff (or after EVENT_HANDOFF_MS — never a sub-second cut).
 */
export function trackQrLetakScan(onDone?: () => void, timeoutMs = EVENT_HANDOFF_MS): void {
  if (typeof window === "undefined") {
    onDone?.()
    return
  }

  const done = finishOnce(onDone)
  const delivered = () => {
    clearQrLetakPending()
    done()
  }

  const timer = window.setTimeout(done, timeoutMs)

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({
    event: GA_EVENT_QR_LETAK,
    ...QR_LETAK_CAMPAIGN,
    eventCallback: () => {
      window.clearTimeout(timer)
      delivered()
    },
    eventTimeout: timeoutMs,
  })

  const gtag = window.gtag
  if (typeof gtag !== "function") return

  gtag("set", {
    campaign: {
      source: QR_LETAK_CAMPAIGN.campaign_source,
      medium: QR_LETAK_CAMPAIGN.campaign_medium,
      name: QR_LETAK_CAMPAIGN.campaign_name,
    },
  })

  const eventParams: Record<string, unknown> = {
    ...QR_LETAK_CAMPAIGN,
    event_timeout: timeoutMs,
  }
  // Ads gtag callback is not proof GTM sent GA4 — don't cut the GTM handoff short.
  if (!HAS_GTM) {
    eventParams.event_callback = () => {
      window.clearTimeout(timer)
      delivered()
    }
  }
  gtag("event", GA_EVENT_QR_LETAK, eventParams)
}

/**
 * Wait until GTM (`google_tag_manager`) and/or `window.gtag` is present.
 * Does not resolve immediately just because GA measurement ID is unset.
 */
export function whenAnalyticsReady(
  onReady: () => void,
  waitMs = ANALYTICS_READY_MS,
): void {
  if (typeof window === "undefined") {
    onReady()
    return
  }
  if (isAnalyticsReady()) {
    onReady()
    return
  }
  const started = Date.now()
  const id = window.setInterval(() => {
    if (isAnalyticsReady() || Date.now() - started >= waitMs) {
      window.clearInterval(id)
      onReady()
    }
  }, 50)
}

/** Homepage safety net: if `/qr` navigated away before GTM acknowledged the hit. */
export function consumePendingQrLetakScan(): void {
  if (typeof window === "undefined") return
  if (!hasQrLetakPending()) return
  clearQrLetakPending()
  trackQrLetakScan()
}
