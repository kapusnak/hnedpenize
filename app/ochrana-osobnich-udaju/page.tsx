import { Header } from "@/components/header"
import { Metadata } from "next"
import Link from "next/link"
import { FileText, Cookie } from "lucide-react"

export const metadata: Metadata = {
  title: "Ochrana osobních údajů | Hnedpenize.cz",
  description: "Vyberte prohlášení o ochraně osobních údajů pro nemovitosti nebo vozidla.",
}

export default function OchranaOsobnichUdajuPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="bg-primary pt-28 pb-12 lg:pt-32 lg:pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            Prohlášení o ochraně osobních údajů
          </h1>
          <p className="text-white/80 text-sm md:text-base">Vyberte oblast, které se vaše poptávka týká.</p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <Link
              href="/ochrana-osobnich-udaju/nemovitosti"
              className="rounded-xl border border-border bg-card p-6 md:p-8 hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Nemovitosti</h2>
              <p className="text-muted-foreground mb-4">
                Prohlášení o ochraně osobních údajů pro poptávky zajištěné nemovitostí.
              </p>
              <span className="text-primary font-medium">Zobrazit prohlášení</span>
            </Link>

            <Link
              href="/ochrana-osobnich-udaju/vozidla"
              className="rounded-xl border border-border bg-card p-6 md:p-8 hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Vozidla</h2>
              <p className="text-muted-foreground mb-4">
                Prohlášení o ochraně osobních údajů pro poptávky zajištěné vozidlem.
              </p>
              <span className="text-primary font-medium">Zobrazit prohlášení</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
            <Link
              href="/ochrana-osobnich-udaju/nemovitosti"
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Ochrana osobních údajů - Nemovitosti
            </Link>
            <Link
              href="/ochrana-osobnich-udaju/vozidla"
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Ochrana osobních údajů - Vozidla
            </Link>
            <Link
              href="/zasady-cookies"
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              <Cookie className="w-4 h-4" />
              Zásady cookies
            </Link>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            © 2026 Dočasný výkup s.r.o. Všechna práva vyhrazena.
          </p>
        </div>
      </footer>
    </main>
  )
}
