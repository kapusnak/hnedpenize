/** Field-leaflet QR. Do not rename — `/qr` and GA4 depend on this exact name. */
export const GA_EVENT_QR_LETAK = "qr_letak"

/** Postal-leaflet QR. Must stay distinct from `qr_letak`. */
export const GA_EVENT_QR_POSTA = "qr_posta"

export const QR_LETAK_CAMPAIGN = {
  campaign_source: "letak",
  campaign_medium: "qr",
  campaign_name: "letak_print",
} as const

export const QR_POSTA_CAMPAIGN = {
  campaign_source: "posta",
  campaign_medium: "qr",
  campaign_name: "posta_print",
} as const

export const QR_LETAK_PENDING_KEY = "qr_letak_pending"
export const QR_POSTA_PENDING_KEY = "qr_posta_pending"

export const QR_LETAK_PATH = "/qr"
export const QR_POSTA_PATH = "/qrposta"

type QrFlyerCampaign = {
  campaign_source: string
  campaign_medium: string
  campaign_name: string
}

type QrFlyerSpec = {
  eventName: string
  campaign: QrFlyerCampaign
  pendingKey: string
}

const QR_LETAK_SPEC: QrFlyerSpec = {
  eventName: GA_EVENT_QR_LETAK,
  campaign: QR_LETAK_CAMPAIGN,
  pendingKey: QR_LETAK_PENDING_KEY,
}

const QR_POSTA_SPEC: QrFlyerSpec = {
  eventName: GA_EVENT_QR_POSTA,
  campaign: QR_POSTA_CAMPAIGN,
  pendingKey: QR_POSTA_PENDING_KEY,
}

export type QrFlyerVariant = "letak" | "posta"

/**
 * Wait until the event can be queued behind a real GTM container — not
 * Ads-only `window.gtag` / `google_tag_manager`. Hybrid pages load Google
 * Ads (`AW-…`) first; that object exists before GTM configures GA4.
 */
export const GTAG_READY_MS = 2000
/** Fallback if the GA4 `event_callback` never runs after `gtag('event', ...)`. */
export const EVENT_HANDOFF_MS = 2000

function finishOnce(fn: (() => void) | undefined): () => void {
  let done = false
  return () => {
    if (done) return
    done = true
    fn?.()
  }
}

function dataLayerHasGtmLoad(): boolean {
  const dataLayer = window.dataLayer
  if (!Array.isArray(dataLayer)) return false
  return dataLayer.some((entry) => {
    if (entry === "gtm.load") return true
    if (!entry || typeof entry !== "object") return false
    const record = entry as Record<string, unknown>
    return "gtm.load" in record || record.event === "gtm.load"
  })
}

const TAG_CONTAINER_ID = /^(?:G|GT|GTM|AW|DC|UA)-/i
const ADS_CONTAINER_ID = /^(?:AW|DC)-/i

function tagManagerRecord(): Record<string, unknown> | undefined {
  const gtm = window.google_tag_manager
  if (gtm == null || typeof gtm !== "object") return undefined
  return gtm as Record<string, unknown>
}

function containerIds(gtm: Record<string, unknown>): string[] {
  return Object.keys(gtm).filter((key) => TAG_CONTAINER_ID.test(key))
}

/** Ads gtag creates `google_tag_manager` with only `AW-…` / `DC-…` keys. */
function isAdsOnlyTagManager(gtm: Record<string, unknown>): boolean {
  const ids = containerIds(gtm)
  return ids.length > 0 && ids.every((id) => ADS_CONTAINER_ID.test(id))
}

/**
 * Ready when a non-Ads container is present, or GTM has reached `gtm.load`.
 * An Ads-only `google_tag_manager` (`AW-…`) is not enough.
 *
 * Do not wait for the GA4 measurement id to already be a key. Calling
 * `gtag('event')` only after `G-…` is registered makes that container
 * answer `event_callback` immediately with `{tags:[]}` and drop the hit.
 * Queuing while the destination is still loading lets GA4 send it, then
 * the later `send_to` callback confirms.
 */
function isGtmContainerReady(): boolean {
  const gtm = tagManagerRecord()
  if (gtm && !isAdsOnlyTagManager(gtm)) return true
  return dataLayerHasGtmLoad()
}

/** Ads `gtag` can exist before the GA4 destination is configured. */
function isGtagReady(): boolean {
  return typeof window.gtag === "function" && isGtmContainerReady()
}

function gaMeasurementId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
  return id || undefined
}

/**
 * `send_to` only delivers after the measurement ID is registered with
 * `gtag('config')`. Ads `AW-…` config is not enough. GTM still owns
 * page_view — this call is destination-only.
 */
function ensureGa4Configured(gtag: (...args: unknown[]) => void): string | undefined {
  const sendTo = gaMeasurementId()
  if (!sendTo) return undefined

  const page = window as typeof window & { __hnedpenizeGa4QrConfigured?: boolean }
  if (!page.__hnedpenizeGa4QrConfigured) {
    page.__hnedpenizeGa4QrConfigured = true
    gtag("config", sendTo, { send_page_view: false })
  }
  return sendTo
}

function gtagCampaign(campaign: QrFlyerCampaign): {
  source: string
  medium: string
  name: string
} {
  return {
    source: campaign.campaign_source,
    medium: campaign.campaign_medium,
    name: campaign.campaign_name,
  }
}

function markPending(key: string): void {
  try {
    sessionStorage.setItem(key, "1")
  } catch {
    /* ignore quota / private mode */
  }
}

function clearPending(key: string): void {
  try {
    sessionStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

function hasPending(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === "1"
  } catch {
    return false
  }
}

export function markQrLetakPending(): void {
  markPending(QR_LETAK_SPEC.pendingKey)
}

export function clearQrLetakPending(): void {
  clearPending(QR_LETAK_SPEC.pendingKey)
}

export function markQrPostaPending(): void {
  markPending(QR_POSTA_SPEC.pendingKey)
}

export function clearQrPostaPending(): void {
  clearPending(QR_POSTA_SPEC.pendingKey)
}

/**
 * Records exactly one flyer QR scan via `gtag('event', eventName)`.
 * Does not push a GTM Custom Event on dataLayer (avoids a second GA4 hit
 * while a container tag for that event is still live / being paused).
 * When `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set, registers that destination
 * once with `gtag('config', id, { send_page_view: false })` then fires
 * the event with `send_to`. GTM still owns page_view.
 */
function trackQrFlyerScan(
  spec: QrFlyerSpec,
  onDone?: () => void,
  timeoutMs = EVENT_HANDOFF_MS,
): void {
  if (typeof window === "undefined") {
    onDone?.()
    return
  }

  const go = finishOnce(onDone)
  const succeed = () => {
    clearPending(spec.pendingKey)
    go()
  }

  const gtag = window.gtag
  if (typeof gtag !== "function") {
    go()
    return
  }

  // Redirect on timeout, but leave the pending flag so the homepage replay
  // can send. A later matching callback still clears it (no double count).
  const timer = window.setTimeout(go, timeoutMs)

  gtag("set", { campaign: gtagCampaign(spec.campaign) })
  const sendTo = ensureGa4Configured(gtag)
  gtag("event", spec.eventName, {
    ...spec.campaign,
    ...(sendTo ? { send_to: sendTo } : {}),
    // gtag calls this once per loaded container, Ads (`AW-…`) and GTM first.
    // Only the GA4 destination confirms the hit when `send_to` is set.
    event_callback: (...args: unknown[]) => {
      if (sendTo && args[0] !== sendTo) return
      window.clearTimeout(timer)
      succeed()
    },
    event_timeout: timeoutMs,
  })
}

/** Records exactly one field-leaflet scan (`qr_letak`). */
export function trackQrLetakScan(onDone?: () => void, timeoutMs = EVENT_HANDOFF_MS): void {
  trackQrFlyerScan(QR_LETAK_SPEC, onDone, timeoutMs)
}

/** Records exactly one postal-leaflet scan (`qr_posta`). */
export function trackQrPostaScan(onDone?: () => void, timeoutMs = EVENT_HANDOFF_MS): void {
  trackQrFlyerScan(QR_POSTA_SPEC, onDone, timeoutMs)
}

export function trackQrFlyerVariant(
  variant: QrFlyerVariant,
  onDone?: () => void,
  timeoutMs = EVENT_HANDOFF_MS,
): void {
  if (variant === "posta") trackQrPostaScan(onDone, timeoutMs)
  else trackQrLetakScan(onDone, timeoutMs)
}

export function markQrFlyerPending(variant: QrFlyerVariant): void {
  if (variant === "posta") markQrPostaPending()
  else markQrLetakPending()
}

/**
 * Wait until `window.gtag` is a function and a non-Ads container is present
 * (`GTM-…` / `G-…`, or a `gtm.load` dataLayer entry). Ads-only
 * `google_tag_manager` is not sufficient. Still invokes `onReady` after
 * `waitMs` so the landing is never stuck on loading.
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
  }, 10)
}

function consumePendingQrFlyerScan(spec: QrFlyerSpec): void {
  if (typeof window === "undefined") return
  if (!hasPending(spec.pendingKey)) return
  whenGtagReady(() => {
    if (!hasPending(spec.pendingKey)) return
    trackQrFlyerScan(spec)
  })
}

/** Homepage safety net: only if `/qr` never successfully handed off via gtag. */
export function consumePendingQrLetakScan(): void {
  consumePendingQrFlyerScan(QR_LETAK_SPEC)
}

/** Homepage safety net: only if `/qrposta` never successfully handed off via gtag. */
export function consumePendingQrPostaScan(): void {
  consumePendingQrFlyerScan(QR_POSTA_SPEC)
}
