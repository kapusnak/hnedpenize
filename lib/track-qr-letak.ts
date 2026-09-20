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

/**
 * Records exactly one flyer QR scan:
 * - GTM configured → `dataLayer.push({ event: 'qr_letak' })` only (GTM CE tag sends GA4)
 * - otherwise, if gtag exists → `gtag('event', 'qr_letak')`
 *
 * Do not send both: GTM + gtag was double-counting in GA4 Realtime.
 */
export function trackQrLetakScan(onDone?: () => void, timeoutMs = EVENT_HANDOFF_MS): void {
  if (typeof window === "undefined") {
    onDone?.()
    return
  }

  const liveCollector = HAS_GTM ? isGtmReady() : isGtagReady()
  const go = finishOnce(onDone)
  const succeed = () => {
    clearQrLetakPending()
    go()
  }

  const timer = window.setTimeout(() => {
    // GTM/gtag was live when we queued the event — the handoff window elapsed,
    // so do not let the homepage replay a second hit.
    if (liveCollector) clearQrLetakPending()
    go()
  }, timeoutMs)

  if (HAS_GTM) {
    window.dataLayer = window.dataLayer ?? []
    window.dataLayer.push({
      event: GA_EVENT_QR_LETAK,
      ...QR_LETAK_CAMPAIGN,
      eventCallback: () => {
        window.clearTimeout(timer)
        succeed()
      },
      eventTimeout: timeoutMs,
    })
    return
  }

  const gtag = window.gtag
  if (typeof gtag === "function") {
    gtag("set", { campaign: gtagCampaign() })
    gtag("event", GA_EVENT_QR_LETAK, {
      ...QR_LETAK_CAMPAIGN,
      event_callback: () => {
        window.clearTimeout(timer)
        succeed()
      },
      event_timeout: timeoutMs,
    })
    return
  }

  window.clearTimeout(timer)
  go()
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

/** Homepage safety net: only if `/qr` never successfully handed off the event. */
export function consumePendingQrLetakScan(): void {
  if (typeof window === "undefined") return
  if (!hasQrLetakPending()) return
  clearQrLetakPending()
  trackQrLetakScan()
}
