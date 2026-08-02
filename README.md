# Půjčka formulář — hnedpenize

Marketingový web pro **Dočasný výkup s.r.o.** (zpětný leasing, zajištěné financování). Next.js na **Railway** se Spacemail SMTP pro poptávky.

## Overview

- **Stack:** Next.js 16 (App Router), React 19, Tailwind CSS
- **Deployment:** Railway (Nixpacks) — `npm run build` + `next start`
- **Analytics:** Google Tag Manager + Google Analytics (volitelně přes env)
- **Forms:** `POST /api/lead` → Nodemailer / Spacemail (notifikace včetně IP)

## Build a deploy

1. Zkopírujte `.env.example` do `.env.local` a nastavte SMTP + `NEXT_PUBLIC_*`.
2. `npm install` a `npm run build` / `npm start`.
3. Na Railway nastavte Variables podle `.env.example`.

Viz **DEPLOY.md** (Node 20, Spacemail, DNS ALIAS, smoke test).
