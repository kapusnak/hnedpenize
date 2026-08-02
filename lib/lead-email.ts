export type LeadSource = "calculator" | "popup" | "cta"

export type LeadPayload = {
  source: LeadSource
  phone: string
  email?: string
  name?: string
  amount?: number
  assetType?: string
  serviceType?: string
  propertyAddress?: string
  pagePath?: string
}

const CALLBACK_ONLY_SERVICE = "Není relevantní (Callback)"
const CALLBACK_ONLY_AMOUNT = "--- Pouze požadavek na zavolání ---"
const PLACEHOLDER = "---"

/**
 * Compact E.164-style number for `tel:` links (no spaces).
 * `+420 728 020 048` → `+420728020048`
 */
export function normalizePhoneForTel(phone: string): string {
  const trimmed = phone.trim()
  if (!trimmed) return ""
  const digits = trimmed.replace(/\D/g, "")
  if (digits.length === 12 && digits.startsWith("420")) return `+${digits}`
  if (digits.length === 9) return `+420${digits}`
  return trimmed.replace(/\s/g, "")
}

/** e.g. `+420728020048` → `+420 728 020 048` for readable e-mail body */
export function formatPhoneDisplayForNotification(phone: string): string {
  const trimmed = phone.trim()
  if (!trimmed) return ""
  let digits = trimmed.replace(/\D/g, "")
  if (digits.length >= 11 && digits.startsWith("420")) digits = digits.slice(3)
  const national = digits.slice(0, 9)
  if (national.length !== 9) return trimmed
  const groups = national.match(/.{1,3}/g)?.join(" ") ?? national
  return `+420 ${groups}`
}

/** Format amount for email: "1 800 000,- Kč" */
export function formatAmountCzk(value: number): string {
  const integer = Math.round(value)
  const withSpaces = integer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `${withSpaces},- Kč`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function leadSourceUrl(): string {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/$/, "")
  const cleaned = (origin || "—").replace(/^Odesláno z:\s*/i, "").trim()
  return cleaned || "—"
}

function isCallbackOnly(source: LeadSource): boolean {
  return source === "cta" || source === "popup"
}

export type BuiltLeadEmails = {
  notifySubject: string
  notifyText: string
  notifyHtml: string
  clientSubject: string
  clientText: string
  clientHtml: string
  clientEmail: string
  phoneTel: string
  phoneDisplay: string
}

/** Operator notification — layout from former EmailJS lead template + IP row. */
function buildNotifyHtml(fields: {
  source: string
  name: string
  phoneTel: string
  phoneDisplay: string
  email: string
  propertyAddress: string
  propertyType: string
  serviceType: string
  amount: string
  ip: string
}): string {
  const emailCell = fields.email
    ? `<a href="mailto:${escapeHtml(fields.email)}" style="color: #1a5a9c; text-decoration: none;">${escapeHtml(fields.email)}</a>`
    : escapeHtml(PLACEHOLDER)
  const phoneCell = fields.phoneTel
    ? `<a href="tel:${escapeHtml(fields.phoneTel)}" style="color: #1a5a9c; text-decoration: none;">${escapeHtml(fields.phoneDisplay)}</a>`
    : escapeHtml(fields.phoneDisplay || PLACEHOLDER)

  return `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333333; max-width: 450px; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #ffffff;">
  <div style="display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #1a5a9c;">
    <div style="padding: 6px 10px; background-color: #e6f0ff; border-radius: 5px; font-size: 20px; line-height: 1;">
      <span style="color: #1a5a9c;">💸</span>
    </div>
    <div style="color: #1a5a9c; font-size: 17px; font-weight: bold; margin-left: 10px;">
      NOVÁ POPTÁVKA K POSOUZENÍ
    </div>
  </div>
  <div style="padding: 10px 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tbody>
        <tr>
          <td style="padding: 5px 0; width: 45%; vertical-align: top;"><strong>Zdroj:</strong></td>
          <td style="padding: 5px 0; text-align: right;">${escapeHtml(fields.source)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; width: 45%;"><strong>Jméno klienta:</strong></td>
          <td style="padding: 5px 0; text-align: right;">${escapeHtml(fields.name)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>Telefon:</strong></td>
          <td style="padding: 5px 0; text-align: right;">${phoneCell}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>E-mail:</strong></td>
          <td style="padding: 5px 0; text-align: right;">${emailCell}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 5px 0; border-top: 1px dashed #cccccc;"></td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>Adresa nemovitosti:</strong></td>
          <td style="padding: 5px 0; text-align: right; font-weight: 500;">${escapeHtml(fields.propertyAddress)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>Typ zajištění:</strong></td>
          <td style="padding: 5px 0; text-align: right; font-weight: 500;">${escapeHtml(fields.propertyType)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>Požadovaná služba:</strong></td>
          <td style="padding: 5px 0; text-align: right; font-weight: 500;">${escapeHtml(fields.serviceType)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>IP adresa:</strong></td>
          <td style="padding: 5px 0; text-align: right; font-weight: 500;">${escapeHtml(fields.ip)}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div style="margin-top: 20px; padding: 12px; background-color: #fff9e6; border: 1px solid #ffcc66; border-radius: 6px; text-align: center;">
    <div style="font-size: 13px; color: #b8860b; margin-bottom: 3px;">POŽADOVANÁ ČÁSTKA</div>
    <div style="font-size: 22px; font-weight: bold; color: #b8860b;">${escapeHtml(fields.amount)}</div>
  </div>
</div>`.trim()
}

/** Client confirmation — layout from former EmailJS client template. */
function buildClientHtml(fields: {
  name: string
  propertyType: string
  serviceType: string
  amount: string
}): string {
  return `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #ffffff;">
  <div style="color: #1a5a9c; font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #1a5a9c; padding-bottom: 10px;">Dobrý den, děkujeme za Vaši poptávku!</div>
  <div style="margin-bottom: 25px;">Potvrzujeme, že Vaše žádost byla úspěšně přijata do našeho systému.</div>
  <div style="padding: 15px; background-color: #f7f7f7; border-radius: 6px; border: 1px solid #e6f0ff;">
    <div style="color: #2c3e50; font-size: 16px; font-weight: bold; margin-bottom: 10px;">SHRNUTÍ VAŠÍ ŽÁDOSTI</div>
    <table style="width: 100%; border-collapse: collapse;" role="presentation">
      <tbody>
        <tr>
          <td style="padding: 5px 0; width: 50%;"><strong>Jméno:</strong></td>
          <td style="padding: 5px 0; text-align: right;">${escapeHtml(fields.name)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>Typ zajištění:</strong></td>
          <td style="padding: 5px 0; text-align: right;">${escapeHtml(fields.propertyType)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>Typ služby:</strong></td>
          <td style="padding: 5px 0; text-align: right;">${escapeHtml(fields.serviceType)}</td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top: 15px; padding: 10px; background-color: #fff9e6; border: 1px solid #ffcc66; border-radius: 6px; text-align: center;">
      <div style="font-size: 13px; color: #b8860b; margin-bottom: 3px;">POŽADOVANÁ ČÁSTKA</div>
      <div style="font-size: 20px; font-weight: bold; color: #b8860b;">${escapeHtml(fields.amount)}</div>
    </div>
  </div>
  <div style="margin-top: 30px; padding: 15px; border-left: 4px solid #1a5a9c; background-color: #f0f8ff; border-radius: 4px;">
    <h3 style="color: #1a5a9c; margin-top: 0; font-size: 17px;">JAK POSTUPOVAT DÁL?</h3>
    <p>Pokud jste žádali o <span style="text-decoration: underline;"><strong>financování zajištěné nemovitostí</strong></span>, Vaši poptávku jsme již předali našemu specialistovi, který se s Vámi v nejbližší době spojí.</p>
    <p>V případě <span style="text-decoration: underline;"><strong>financování zajištěného vozidlem</strong></span> Vás pro urychlení procesu prosíme o zaslání následujících fotografií (podklady stačí jednoduše připojit jako odpověď na tento e-mail):</p>
    <ul style="margin-top: 0; margin-bottom: 15px; line-height: 1.5;">
      <li><strong>Vozidla ze všech stran</strong></li>
      <li><strong>Interiéru</strong> (včetně nastartovaného auta – prosíme o detail palubní desky se stavem najetých kilometrů)</li>
      <li><strong>Malého technického průkazu</strong> (vyfoceného z obou stran)</li>
    </ul>
    <p>Jakmile budeme mít všechny potřebné informace, náš specialista Vaši žádost posoudí a co nejdříve Vás bude telefonicky kontaktovat.</p>
    <p style="margin: 10px 0 0 0; line-height: 1.5; font-weight: normal;">Obvykle se Vám ozveme do 30 minut v pracovní době (Po–Pá: 8:00 – 18:00).</p>
  </div>
  <div style="margin-top: 30px; padding-top: 15px; border-top: 1px dashed #cccccc;">
    <h4 style="margin-bottom: 10px; font-size: 15px; color: #1a5a9c;">Spěcháte, nebo máte dotazy?</h4>
    <p style="margin: 5px 0;">📞 Telefon:<br>
      <a style="color: #1a5a9c; text-decoration: none;" href="tel:+420776075150">+420 776 075 150</a><br>
      <a style="color: #1a5a9c; text-decoration: none;" href="tel:+420777400256">+420 777 400 256</a>
    </p>
    <p style="margin: 5px 0;">📧 E-mail: <a style="color: #1a5a9c; text-decoration: none;" href="mailto:info@hnedpenize.cz">info@hnedpenize.cz</a></p>
  </div>
  <div style="margin-top: 30px;">
    <p style="margin: 0;">Těšíme se na spolupráci!</p>
    <p style="margin: 5px 0 0 0;">S pozdravem,</p>
    <p style="margin: 0; font-weight: bold; color: #1a5a9c;">Váš tým Dočasný výkup s.r.o. (Hnedpenize.cz)</p>
  </div>
</div>`.trim()
}

export function buildLeadEmails(params: LeadPayload & { ip: string }): BuiltLeadEmails {
  const callback = isCallbackOnly(params.source)
  const propertyType = callback ? PLACEHOLDER : (params.assetType ?? PLACEHOLDER)
  const propertyAddress = callback ? PLACEHOLDER : (params.propertyAddress?.trim() || PLACEHOLDER)
  const phoneTel = normalizePhoneForTel(params.phone)
  const phoneDisplay = formatPhoneDisplayForNotification(params.phone) || params.phone.trim()
  const name = callback ? PLACEHOLDER : (params.name?.trim() || PLACEHOLDER)
  const email = (params.email ?? "").trim()
  const serviceType = callback ? CALLBACK_ONLY_SERVICE : (params.serviceType?.trim() || PLACEHOLDER)
  const amount =
    params.amount != null
      ? formatAmountCzk(params.amount)
      : callback
        ? CALLBACK_ONLY_AMOUNT
        : PLACEHOLDER
  const sourceUrl = leadSourceUrl()
  const ip = params.ip.trim() || "neznámá"
  const pagePath = params.pagePath?.trim() || ""
  const sourceDisplay = pagePath ? `${sourceUrl}${pagePath}` : sourceUrl

  const notifySubject = callback
    ? `Callback – ${phoneDisplay}`
    : `Nová poptávka – ${name !== PLACEHOLDER ? name : phoneDisplay}`

  const notifyText = [
    `Zdroj: ${sourceDisplay}`,
    `Jméno klienta: ${name}`,
    `Telefon: ${phoneDisplay}`,
    `E-mail: ${email || PLACEHOLDER}`,
    `Adresa nemovitosti: ${propertyAddress}`,
    `Typ zajištění: ${propertyType}`,
    `Požadovaná služba: ${serviceType}`,
    `Částka: ${amount}`,
    `IP adresa: ${ip}`,
  ].join("\n")

  const notifyHtml = buildNotifyHtml({
    source: sourceDisplay,
    name,
    phoneTel: phoneTel || params.phone.trim(),
    phoneDisplay,
    email,
    propertyAddress,
    propertyType,
    serviceType,
    amount,
    ip,
  })

  const clientNameForBody = callback ? PLACEHOLDER : name
  const clientSubject = "Potvrzení přijetí poptávky – Hnedpenize.cz"
  const clientText = [
    "Dobrý den, děkujeme za Vaši poptávku!",
    "",
    "Potvrzujeme, že Vaše žádost byla úspěšně přijata do našeho systému.",
    "",
    `Jméno: ${clientNameForBody}`,
    `Typ zajištění: ${propertyType}`,
    `Typ služby: ${serviceType}`,
    `Požadovaná částka: ${amount}`,
    "",
    "Obvykle se Vám ozveme do 30 minut v pracovní době (Po–Pá: 8:00 – 18:00).",
    "",
    "Telefon: +420 776 075 150 / +420 777 400 256",
    "E-mail: info@hnedpenize.cz",
    "",
    "S pozdravem,",
    "Váš tým Dočasný výkup s.r.o. (Hnedpenize.cz)",
  ].join("\n")

  const clientHtml = buildClientHtml({
    name: clientNameForBody,
    propertyType,
    serviceType,
    amount,
  })

  return {
    notifySubject,
    notifyText,
    notifyHtml,
    clientSubject,
    clientText,
    clientHtml,
    clientEmail: email,
    phoneTel: phoneTel || params.phone.trim(),
    phoneDisplay,
  }
}
