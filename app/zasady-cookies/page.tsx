import { Header } from "@/components/header"
import { Metadata } from "next"
import Link from "next/link"
import { FileText, Cookie } from "lucide-react"

export const metadata: Metadata = {
  title: "Zásady cookies | Hnedpeníze.cz",
  description: "Zásady cookies – Dočasný výkup s.r.o., hnedpenize.cz",
}

export default function ZasadyCookiesPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://hnedpenize.cz").replace(/\/$/, "")

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="bg-primary pt-28 pb-12 lg:pt-32 lg:pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">Zásady cookies</h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            Tyto Zásady cookies byly naposledy aktualizovány 8. 10. 2026 a vztahují se na občany a osoby s trvalým
            pobytem v Evropském hospodářském prostoru.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <article className="legal-content text-foreground">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4 first:mt-0">1. Úvod</h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Naše webové stránky{" "}
              <a href={siteUrl} className="text-primary no-underline hover:underline">
                {siteUrl}
              </a>{" "}
              (dále jen „web“) používají cookies a další související technologie. Níže popisujeme, co web skutečně
              používá a jak funguje informační lišta v dolní části stránky.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4">2. Co jsou soubory cookies?</h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Soubor cookie je malý soubor, který je odeslán spolu se stránkami webu a uložen prohlížečem na vašem
              zařízení. Informace v něm uložené mohou být vráceny našim serverům nebo serverům třetích stran.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4">3. Typy cookies</h2>

            <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">3.1 Nezbytné</h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Zajišťují základní provoz webu, včetně zobrazení stránek a odeslání poptávky. Informaci, že jste zavřeli
              informační lištu, si prohlížeč pamatuje v localStorage (klíč hnedpenize-cookie-consent), aby se lišta při
              další návštěvě nezobrazila. Nejde o souhlas s jednotlivými kategoriemi.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">3.2 Analytické</h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Web používá Google Tag Manager a Google Analytics 4 ke statistikám návštěvnosti a k měření událostí na
              webu, například odeslání poptávky. Google Tag Manager se načítá, když je v nasazení nastavený. Přímý
              měřicí snippet Google Analytics 4 se v kódu použije jen tehdy, když Google Tag Manager nastavený není;
              jinak zobrazení stránek měří Tag Manager.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">3.3 Marketingové</h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Web používá Google Ads k měření reklam a konverzí z odeslaných poptávek. Značka Google Ads je v kódu webu
              zapojená přímo.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4">4. Souhlas</h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Při první návštěvě zobrazíme v dolní části stránky lištu s nadpisem „Cookies a soukromí“, s odkazy na tyto
              zásady a na ochranu osobních údajů a s jedním tlačítkem „Rozumím“. Kliknutím na „Rozumím“ potvrzujete, že
              jste se s informací seznámili. Lišta nenabízí přepínače kategorií a měřicí nástroje nespouští ani
              neblokuje — ty se načítají nezávisle na ní. Na stránkách přesměrování z QR kódů (/qr a /qrposta) se lišta
              nezobrazuje. Používání cookies můžete omezit nebo smazat v nastavení prohlížeče; některé části webu pak
              nemusí fungovat správně.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4">5. Kontakt</h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Správcem webu je Dočasný výkup s.r.o., IČ 23626836, Podvesná VII/6192, 760 01 Zlín. Dotazy k cookies
              směřujte na{" "}
              <a href="mailto:info@hnedpenize.cz" className="text-primary no-underline hover:underline">
                info@hnedpenize.cz
              </a>
              . Více o zpracování osobních údajů najdete v{" "}
              <Link href="/ochrana-osobnich-udaju" className="text-primary no-underline hover:underline">
                Prohlášení o ochraně osobních údajů
              </Link>
              .
            </p>
          </article>
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
              className="hover:text-primary transition-colors flex items-center gap-2 font-medium text-foreground"
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
