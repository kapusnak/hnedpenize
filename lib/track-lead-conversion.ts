const GOOGLE_ADS_LEAD_CONVERSION_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_SEND_TO

/** Matches `LeadParams["source"]` in emailjs — kept local to avoid circular imports. */
export type LeadSource = "calculator" | "popup" | "cta"

/**
 * Fires GA4 `generate_lead` after EmailJS successfully sends the lead.
 * Optionally fires Google Ads `conversion` when NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_SEND_TO is set (avoid duplicating the same goal with GA4 import in Ads).
 */
export function trackLeadGenerated(params: {
  source: LeadSource
  leadValue?: number
  /** e.g. /kontakty — for phone_lead breakdown (popup + CTA sections) */
  pagePath?: string
}): void {
  if (typeof window === "undefined") return
  const gtag = window.gtag
  if (!gtag) return

  const eventParams: Record<string, string | number> = {
    lead_source: params.source,
  }
  if (
    params.leadValue != null &&
    Number.isFinite(params.leadValue)
  ) {
    eventParams.currency = "CZK"
    eventParams.value = params.leadValue
  }

  gtag("event", "generate_lead", eventParams)

  if (params.source === "popup" || params.source === "cta") {
    const phoneLeadParams: Record<string, string> = {
      lead_source: params.source,
    }
    if (params.pagePath) {
      phoneLeadParams.page_path = params.pagePath
    }
    gtag("event", "phone_lead", phoneLeadParams)
  }

  const sendTo = GOOGLE_ADS_LEAD_CONVERSION_SEND_TO?.trim()
  if (sendTo) {
    gtag("event", "conversion", { send_to: sendTo })
  }
}
