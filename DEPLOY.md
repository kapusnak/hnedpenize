# Nasazení na Railway (Next.js server)

Web běží jako Node.js aplikace (`next start`), ne jako statický export.

## 1. Build a start

Railway (Nixpacks) obvykle spustí:

```bash
npm install
npm run build
npm start
```

`npm start` = `next start -p ${PORT:-3000}` (Railway nastaví `PORT`).

Next.js 16 vyžaduje **Node ≥ 20.9**. V repu je `.nvmrc` / `nixpacks.toml` / `engines.node`, aby Nixpacks nepoužil výchozí Node 18.

## 2. Proměnné prostředí (Railway Variables)

Nastavte hodnoty podle `.env.example`:

**Server (SMTP / Spacemail)** — nutné pro formuláře:

- `SMTP_HOST` — např. `mail.spacemail.com`
- `SMTP_PORT` — `465` (SSL) nebo `587` (STARTTLS)
- `SMTP_USER` — `info@hnedpenize.cz`
- `SMTP_PASS` — heslo schránky
- `LEAD_NOTIFY_TO` — kam chodí notifikace o poptávkách (typicky `info@hnedpenize.cz`)
- volitelně `MAIL_FROM` (např. `Hnedpenize <info@hnedpenize.cz>`)

**Veřejné (klient):**

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GTM_ID`
- volitelně GA4 / Google Ads proměnné

`NEXT_PUBLIC_*` musí být dostupné i při **buildu**.

## 3. Doména

V Railway přidejte custom domain. U DNS poskytovatele (např. Vedos):

- kořen: **ALIAS** na `….up.railway.app` (ne CNAME — Vedos CNAME na `@` nepovolí)
- `TXT` `_railway-verify` dle Railway
- volitelně `www` jako CNAME

## 4. Kontrola

- Otevřete web na vlastní doméně
- Odešlete popup (telefon) a lead formulář — notifikace musí dorazit na `LEAD_NOTIFY_TO` včetně **IP adresy**
- Při vyplněném e-mailu klienta přijde i potvrzovací zpráva
