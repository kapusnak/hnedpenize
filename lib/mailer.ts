import nodemailer from "nodemailer"
import type { Transporter } from "nodemailer"

let transporter: Transporter | null = null

function requireEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Chybí proměnná prostředí ${name}.`)
  }
  return value
}

/** Lazy Nodemailer transport — created on first send, not at import/build time. */
export function getMailer(): Transporter {
  if (transporter) return transporter

  const host = requireEnv("SMTP_HOST")
  const port = Number(process.env.SMTP_PORT ?? "465")
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error("SMTP_PORT musí být platné číslo (např. 465 nebo 587).")
  }
  const user = requireEnv("SMTP_USER")
  const pass = requireEnv("SMTP_PASS")
  const secure = port === 465

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })

  return transporter
}

export function mailFromAddress(): string {
  const from = process.env.MAIL_FROM?.trim()
  if (from) return from
  return requireEnv("SMTP_USER")
}

export function leadNotifyTo(): string {
  return requireEnv("LEAD_NOTIFY_TO")
}
