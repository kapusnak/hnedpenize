import { Header } from "@/components/header"
import { ProcessSteps, ProcessSelectionProvider } from "@/components/process-steps"
import { FaqSection } from "@/components/faq-section"
import { CtaSection } from "@/components/cta-section"
import { FileText, Cookie } from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Header */}
      <section className="bg-gradient-to-br from-primary via-primary to-accent pt-0 pb-12 md:pb-16">
        <Header />

        <div className="container mx-auto px-4 pt-24 md:pt-28">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 text-balance">
              Váš krok za krokem k penězům
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg leading-relaxed max-w-md mx-auto">
              Jednoduchý a transparentní proces, díky kterému získáte řešení pro vaše potřeby rychle a bezpečně.
            </p>
          </div>
        </div>
      </section>

      <ProcessSelectionProvider>
        {/* Process Steps Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4">
            <ProcessSteps />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pt-12 md:pt-16 lg:pt-20 pb-4 md:pb-6 lg:pb-8 bg-background">
          <div className="container mx-auto px-4">
            <FaqSection />
          </div>
        </section>
      </ProcessSelectionProvider>

      {/* CTA Section */}
      <section className="pt-4 md:pt-6 lg:pt-8 pb-12 md:pb-16 lg:pb-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <CtaSection />
        </div>
      </section>

      <footer className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
            <Link href="/ochrana-osobnich-udaju/nemovitosti" className="hover:text-primary transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Ochrana osobních údajů - Nemovitosti
            </Link>
            <Link href="/ochrana-osobnich-udaju/vozidla" className="hover:text-primary transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Ochrana osobních údajů - Vozidla
            </Link>
            <Link href="/zasady-cookies" className="hover:text-primary transition-colors flex items-center gap-2">
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
