import { trackLeadGenerated } from "@/lib/track-lead-conversion"

export type LeadParams = {
  source: "calculator" | "popup" | "cta"
  phone: string
  email?: string
  name?: string
  amount?: number
  assetType?: string
  serviceType?: string
  /** Adresa nemovitosti – pouze u poptávek na nemovitost */
  propertyAddress?: string
  /** Current path for GA (e.g. /kontakty); set for popup/cta phone leads */
  pagePath?: string
  /** Structured car fields for assetType Automobil. */
  vehicleModel?: string
  vehicleYear?: string
  vehicleMileage?: string
  vehicleVin?: string
  contractDurationMonths?: string
}

export async function sendLead(params: LeadParams): Promise<void> {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: params.source,
      phone: params.phone,
      ...(params.email != null ? { email: params.email } : {}),
      ...(params.name != null ? { name: params.name } : {}),
      ...(params.amount != null ? { amount: params.amount } : {}),
      ...(params.assetType != null ? { assetType: params.assetType } : {}),
      ...(params.serviceType != null ? { serviceType: params.serviceType } : {}),
      ...(params.propertyAddress != null ? { propertyAddress: params.propertyAddress } : {}),
      ...(params.pagePath != null ? { pagePath: params.pagePath } : {}),
      ...(params.vehicleModel != null ? { vehicleModel: params.vehicleModel } : {}),
      ...(params.vehicleYear != null ? { vehicleYear: params.vehicleYear } : {}),
      ...(params.vehicleMileage != null ? { vehicleMileage: params.vehicleMileage } : {}),
      ...(params.vehicleVin != null ? { vehicleVin: params.vehicleVin } : {}),
      ...(params.contractDurationMonths != null
        ? { contractDurationMonths: params.contractDurationMonths }
        : {}),
    }),
  })

  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const data = (await res.json()) as { error?: string }
      if (data.error?.trim()) detail = data.error.trim()
    } catch {
      /* ignore */
    }
    console.error("[lead]", detail)
    throw new Error(`Odeslání poptávky selhalo: ${detail}`)
  }

  trackLeadGenerated({
    source: params.source,
    ...(params.pagePath != null && params.pagePath !== ""
      ? { pagePath: params.pagePath }
      : {}),
    ...(params.amount != null && Number.isFinite(params.amount)
      ? { leadValue: params.amount }
      : {}),
  })
}

/** Rohový popup – pouze telefon. */
export async function sendPopupPhone(phone: string, pagePath?: string): Promise<void> {
  await sendLead({ source: "popup", phone, pagePath })
}
