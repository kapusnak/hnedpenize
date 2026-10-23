import assert from "node:assert/strict"
import { test } from "node:test"

import { buildLeadEmails, type LeadPayload } from "./lead-email.ts"

function build(overrides: Partial<LeadPayload> & { ip?: string } = {}) {
  return buildLeadEmails({
    source: "calculator",
    phone: "+420777111222",
    email: "jan@example.cz",
    name: "Jan Novák",
    amount: 50000,
    ip: "37.188.157.84",
    ...overrides,
  })
}

test("real-estate and other asset types keep the address row and skip car rows", () => {
  for (const assetType of ["Nemovitost", "Jiné", undefined]) {
    const mail = build({
      assetType,
      serviceType: "Zpětný leasing",
      propertyAddress: "Hlavní 1, Praha",
      vehicleModel: "should-not-appear",
      vehicleYear: "2006",
      vehicleMileage: "230636",
      vehicleVin: "VF1BG4HBE36060791",
      contractDurationMonths: "36",
    })
    assert.match(mail.notifyText, /Adresa nemovitosti: Hlavní 1, Praha/)
    assert.match(mail.notifyHtml, /Adresa nemovitosti:/)
    assert.match(mail.notifyHtml, /Hlavní 1, Praha/)
    assert.doesNotMatch(mail.notifyText, /Značka a model vozu/)
    assert.doesNotMatch(mail.notifyHtml, /Značka a model vozu/)
    assert.doesNotMatch(mail.notifyHtml, /should-not-appear/)
    assert.doesNotMatch(mail.clientText, /Značka a model vozu/)
    assert.match(mail.notifyText, /Požadovaná služba: Zpětný leasing/)
    assert.match(mail.notifyHtml, /POŽADOVANÁ ČÁSTKA/)
    assert.match(mail.notifySubject, /Jan Novák – Nová poptávka/)
  }
})

test("callback e-mails stay phone-only", () => {
  const mail = build({
    source: "popup",
    pagePath: "/kontakty",
    assetType: "Automobil",
    serviceType: "Peníze ihned a jezděte dál",
    vehicleModel: "Renault",
    amount: undefined,
  })
  assert.match(mail.notifyText, /Adresa nemovitosti: ---/)
  assert.match(mail.notifyText, /Požadovaná služba: Není relevantní \(Callback\)/)
  assert.match(mail.notifyText, /Částka: --- Pouze požadavek na zavolání ---/)
  assert.doesNotMatch(mail.notifyHtml, /Značka a model vozu/)
  assert.doesNotMatch(mail.notifyHtml, /Renault/)
  assert.match(mail.notifySubject, /Callback/)
})

test("automobile lead lists structured car fields and hides the property address", () => {
  const mail = build({
    assetType: "Automobil",
    serviceType: "Peníze ihned a jezděte dál",
    propertyAddress: "Tajná 9, Brno",
    vehicleModel: "Renault <script>",
    vehicleYear: "2006",
    vehicleMileage: "230636",
    vehicleVin: "VF1BG4HBE36060791",
    contractDurationMonths: "36",
  })

  assert.doesNotMatch(mail.notifyText, /Adresa nemovitosti/)
  assert.doesNotMatch(mail.notifyHtml, /Adresa nemovitosti/)
  assert.doesNotMatch(mail.notifyText, /Tajná 9/)
  assert.doesNotMatch(mail.notifyHtml, /Tajná 9/)
  assert.doesNotMatch(mail.notifyHtml, /Kód poptávky/)
  assert.doesNotMatch(mail.notifyText, /Kód poptávky/)

  const expected = [
    "Typ zajištění: Automobil",
    "Požadovaná služba: Peníze ihned a jezděte dál",
    "Značka a model vozu: Renault <script>",
    "Rok výroby: 2006",
    "Najeté km: 230636 km",
    "VIN: VF1BG4HBE36060791",
    "Délka smlouvy: 36 měs.",
    "Částka: 50 000,- Kč",
  ]
  let cursor = 0
  for (const line of expected) {
    const at = mail.notifyText.indexOf(line, cursor)
    assert.notEqual(at, -1, line)
    cursor = at + line.length
  }

  assert.match(mail.notifyHtml, /Požadovaná služba:/)
  assert.match(mail.notifyHtml, /Peníze ihned a jezděte dál/)
  assert.match(mail.notifyHtml, /Renault &lt;script&gt;/)
  assert.doesNotMatch(mail.notifyHtml, /Renault <script>/)
  assert.match(mail.notifyHtml, /230636 km/)
  assert.match(mail.notifyHtml, /36 měs\./)
  assert.match(mail.notifyHtml, /POŽADOVANÁ ČÁSTKA/)
  assert.match(mail.notifyHtml, /50 000,- Kč/)
  assert.match(mail.notifySubject, /\[hnedpenize\.cz\] Jan Novák – Nová poptávka/)

  assert.match(mail.clientText, /Typ služby: Peníze ihned a jezděte dál/)
  assert.match(mail.clientText, /Značka a model vozu: Renault <script>/)
  assert.match(mail.clientText, /Délka smlouvy: 36 měs\./)
  assert.match(mail.clientHtml, /Renault &lt;script&gt;/)
  assert.doesNotMatch(mail.clientHtml, /Kód poptávky/)
  assert.equal(mail.clientSubject, "Potvrzení přijetí poptávky – Hnedpenize.cz")
})

test("missing VIN and contract length render as placeholders", () => {
  const mail = build({
    assetType: "Automobil",
    serviceType: "Peníze ihned a jezděte dál",
    vehicleModel: "Citroën C4",
    vehicleYear: "2009",
    vehicleMileage: "118000 km",
    vehicleVin: "   ",
    contractDurationMonths: "",
  })
  assert.match(mail.notifyText, /Najeté km: 118000 km/)
  assert.doesNotMatch(mail.notifyText, /118000 km km/)
  assert.match(mail.notifyText, /VIN: ---/)
  assert.match(mail.notifyText, /Délka smlouvy: ---/)
  assert.match(mail.notifyHtml, />---</)
})

test("contract length that already includes the unit is not doubled", () => {
  const mail = build({
    assetType: "Automobil",
    serviceType: "Peníze ihned a jezděte dál",
    vehicleModel: "Škoda Fabia",
    vehicleYear: "2019",
    vehicleMileage: "10",
    contractDurationMonths: "24 měs.",
  })
  assert.match(mail.notifyText, /Najeté km: 10 km/)
  assert.match(mail.notifyText, /Délka smlouvy: 24 měs\./)
  assert.doesNotMatch(mail.notifyText, /24 měs\. měs\./)
})
