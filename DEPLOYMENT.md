# Static build and FTP deployment (Wedos)

This app is configured for **static export**. You can build once and upload the output via FTP to Wedos (or any static host). No Node.js or special server is required.

## Using .env for static FTP – does it work?

**Yes.** You use a `.env` or `.env.local` file **only on your machine (or CI) when you run `npm run build`**. Next.js inlines `NEXT_PUBLIC_*` variables into the built JavaScript at **build time**. The generated `out/` folder contains plain HTML/CSS/JS with those values already inside; there is no `.env` on the server and no runtime env reading. So:

1. Create `.env.local` (copy from `.env.example` and fill in values).
2. Run `npm run build` — values from `.env.local` are baked into the client bundle.
3. Upload the **contents of `out/`** via FTP to Wedos. Do **not** upload the `.env` file; the server does not need it.

The site will work fully (forms via EmailJS, analytics via GTM/GA) with no server-side code.

## 1. Environment variables (build time)

Create `.env.local` (copy from `.env.example`) **before** building. These are baked into the client bundle at build time, so the same `out/` folder works on any host.

See `.env.example` for the full list. Variables (all optional except EmailJS for working forms):

- **NEXT_PUBLIC_GTM_ID:** Google Tag Manager container ID (e.g. `GTM-MJBCTMVT`). If set, GTM is loaded (beforeInteractive). You can use this instead of or alongside GA4.
- **NEXT_PUBLIC_GA_MEASUREMENT_ID:** Google Analytics 4 Measurement ID (e.g. `G-XXXXXXXXXX`). If set, gtag.js is loaded for GA4. After a successful lead email via EmailJS, the app sends **`generate_lead`** (all leads: `lead_source` = `calculator` | `cta` | `popup`; optional `value`/`currency` for calculator). For **phone-only** flows (popup + CTA blocks on Kontakty + Jak to funguje), it also sends **`phone_lead`** with `lead_source` (`popup` or `cta`) and `page_path` (e.g. `/`, `/kontakty`, `/jak-to-funguje`). Mark **`generate_lead`** as a key event for overall leads; optionally mark **`phone_lead`** as a separate key event for callback-only campaigns. In Google Ads, link this GA4 property and **import** the conversion you care about—do not also set **NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_SEND_TO** for the same goal, or you risk double counting.
- **NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_SEND_TO:** Optional. Full Google Ads conversion `send_to` string (`AW-XXXXXXXXX/label`). If set, the app fires a **`conversion`** event in addition to **`generate_lead`**. Use only if you are **not** importing the GA4 `generate_lead` event into Google Ads for the same lead action.
- **NEXT_PUBLIC_EMAILJS_***:** Required for contact forms. Public key, service ID, and template ID from [emailjs.com](https://www.emailjs.com/). Template variables: `{{source}}`, `{{phone}}`, `{{name}}`, `{{amount}}`, `{{assetType}}` / `{{collateralType}}` (Typ zajištění: Nemovitost / Automobil), `{{serviceType}}`. For CTA/popup (phone-only “callback”) the app sends: name/assetType `---`, serviceType `Není relevantní (Callback)`, amount `--- Pouze požadavek na zavolání ---`; use these in one template to get the “NOVÁ POPTÁVKA K POSOUZENÍ” callback email format.

The `.env.example` in this repo is pre-filled with the same values as your other static build (`hnedpenize`), so you can copy it to `.env.local` and run `npm run build` to get a working static site (forms + GTM) without changing anything.

## 2. Build static export

```bash
npm install
npm run build
```

This produces the **`out/`** directory with:

- `index.html` (home)
- `jak-to-funguje.html`, `kontakty.html`
- `_next/` (JS, CSS)
- Copies of `public/` (favicons, etc.)

## 3. Upload to Wedos via FTP

1. Connect to your Wedos hosting via FTP (FileZilla, VS Code FTP extension, or your preferred client).
2. Upload the **contents** of `out/` into the target folder (often `www` or `public_html`).
   - So that the site root contains `index.html`, `_next/`, and other files directly (not a nested `out` folder).
3. Ensure the server is configured to serve `index.html` for `/` and to serve `.html` files for clean URLs if needed (see below).

### URL rewriting (optional)

If your host supports it, you can add rules so that:

- `/` → `index.html`
- `/jak-to-funguje` → `jak-to-funguje.html`
- `/kontakty` → `kontakty.html`

Next.js static export with default settings emits `index.html`, `jak-to-funguje.html`, `kontakty.html`. So either:

- Users open `https://yourdomain.cz/jak-to-funguje.html`, or
- You add a rewrite rule: request to `/jak-to-funguje` → serve `jak-to-funguje.html`.

On Wedos (Apache), you can use an `.htaccess` in the same folder as `index.html`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.+)$ $1.html [L,QSA]
```

That makes `/jak-to-funguje` serve `jak-to-funguje.html`. Adjust if your host uses a different doc root or engine.

## 4. No server required

- **Pages:** All HTML/JS/CSS are static; the browser runs the React app.
- **Forms:** Handled by **EmailJS** in the browser; no backend on your side.
- **Analytics:** **Google Analytics** only, loaded via script; no server needed.

No Node.js runtime or third-party PaaS is required on Wedos.

## GA4 lead conversion and Google Ads

1. Set **`NEXT_PUBLIC_GA_MEASUREMENT_ID`**, rebuild, and deploy. Submit test leads; in GA4 use **Realtime** or **DebugView** to confirm **`generate_lead`** (all forms) and **`phone_lead`** (popup + Kontakty/Jak to funguje CTA only).
2. In GA4 **Admin**, open **Events** (or **Key events**), find **`generate_lead`** (and optionally **`phone_lead`**), and mark the ones you need as **key events** (conversions).
3. In Google Ads, under **Linked accounts**, link the **same** GA4 property. Under **Conversions**, create an **Import** from **Google Analytics 4** and select **`generate_lead`** and/or **`phone_lead`** (avoid importing both for the same bidding goal if they double-count the same user action).
4. Prefer **either** GA4 import **or** **`NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_SEND_TO`**, not both, for the same lead goal.
