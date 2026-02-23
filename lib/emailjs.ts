import emailjs from "@emailjs/browser"

const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
/** Client confirmation template ("Klientská - potvrzení přijetí poptávky") – used when sending success email to the client */
const CLIENT_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CLIENT_TEMPLATE_ID ?? "template_3t8h00d"

export type LeadParams = {
  source: "calculator" | "popup" | "cta"
  phone: string
  email?: string
  name?: string
  amount?: number
  assetType?: string
  serviceType?: string
}

const CALLBACK_ONLY_SERVICE = "Není relevantní (Callback)"
const CALLBACK_ONLY_AMOUNT = "--- Pouze požadavek na zavolání ---"
const PLACEHOLDER = "---"

/** Format amount for email: "1 800 000,- Kč" */
function formatAmountCzk(value: number): string {
  const integer = Math.round(value)
  const withSpaces = integer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `${withSpaces},- Kč`
}

export async function sendLead(params: LeadParams): Promise<void> {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
    console.warn("EmailJS not configured: set NEXT_PUBLIC_EMAILJS_PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID")
    return
  }
  const isCallbackOnly = params.source === "cta" || params.source === "popup"
  const assetTypeValue = isCallbackOnly ? PLACEHOLDER : (params.assetType ?? "")
  const templateParams = {
    source: params.source,
    phone: params.phone,
    email: params.email ?? "",
    name: isCallbackOnly ? PLACEHOLDER : (params.name ?? ""),
    assetType: assetTypeValue,
    /** Alias for EmailJS templates that show "Typ zajištění" (Nemovitost / Automobil) */
    collateralType: assetTypeValue,
    propertyType: assetTypeValue,
    serviceType: isCallbackOnly ? CALLBACK_ONLY_SERVICE : (params.serviceType ?? ""),
    amount:
      params.amount != null
        ? formatAmountCzk(params.amount)
        : isCallbackOnly
          ? CALLBACK_ONLY_AMOUNT
          : "",
  }
  await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY })

  // Send client success/confirmation email when we have the client's email (e.g. from calculator form).
  // EmailJS template template_3t8h00d uses "To Email" = {{email}}, so we must pass `email`.
  const clientEmail = (params.email ?? "").trim()
  if (clientEmail && PUBLIC_KEY && SERVICE_ID && CLIENT_TEMPLATE_ID) {
    const clientParams = {
      email: clientEmail,
      to_email: clientEmail,
      client_email: clientEmail,
      name: isCallbackOnly ? "" : (params.name ?? ""),
      phone: params.phone,
      amount:
        params.amount != null
          ? formatAmountCzk(params.amount)
          : isCallbackOnly
            ? CALLBACK_ONLY_AMOUNT
            : "",
      assetType: assetTypeValue,
      collateralType: assetTypeValue,
      /** Used in client template as "Typ zajištění" (Nemovitost / Automobil) */
      propertyType: assetTypeValue,
      serviceType: isCallbackOnly ? CALLBACK_ONLY_SERVICE : (params.serviceType ?? ""),
    }
    emailjs
      .send(SERVICE_ID, CLIENT_TEMPLATE_ID, clientParams, { publicKey: PUBLIC_KEY })
      .catch((err) => console.warn("Client confirmation email failed:", err))
  }
}
