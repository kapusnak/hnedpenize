import { Header } from "@/components/header"
import { Metadata } from "next"
import Link from "next/link"
import { FileText, Cookie } from "lucide-react"

export const metadata: Metadata = {
  title: "Zásady cookies | Dočasný výkup",
  description: "Zásady cookies – Dočasný výkup s.r.o., hnedpenize.cz",
}

export default function ZasadyCookiesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="bg-primary pt-28 pb-12 lg:pt-32 lg:pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">Zásady cookies</h1>
          <p className="text-white/80 text-sm md:text-base">
            Tyto Zásady cookies byly naposledy aktualizovány 10/04/2025 a vztahují se na občany a osoby s trvalým
            pobytem v Evropském hospodářském prostoru.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <article className="legal-content text-foreground">
            <h2 id="uvod" className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4 first:mt-0">
              1. Úvod
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Naše webové stránky{" "}
              <a href="https://hnedpenize.cz" target="_blank" rel="noopener noreferrer" className="text-primary no-underline hover:underline">
                https://hnedpenize.cz
              </a>{" "}
              (dále jen „web") používají cookies a další související technologie (pro usnadnění jsou všechny technologie
              označovány jako „cookies"). Cookies také vkládají třetí strany, které jsme zapojili. V níže uvedeném
              dokumentu vás informujeme o používání cookies na našem webu.
            </p>

            <h2 id="co-jsou-cookies" className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4">
              2. Co jsou soubory cookies?
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Soubor cookie je malý jednoduchý soubor, který je odeslán spolu se stránkami tohoto webu a uložen
              prohlížečem na pevný disk počítače nebo jiného zařízení. Informace v nich uložené mohou být vráceny našim
              serverům nebo serverům příslušných třetích stran během následné návštěvy.
            </p>

            <h2 id="skripty" className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4">
              3. Co jsou skripty?
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Skript je část programového kódu, který slouží k tomu, aby naše webové stránky fungovaly správně a
              interaktivně. Tento kód je spuštěn na našem serveru nebo na vašem zařízení.
            </p>

            <h2 id="webovy-majak" className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4">
              4. Co je to webový maják?
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Webový maják (nebo pixelová značka) je malý, neviditelný kus textu nebo obrázku na webu, který se používá
              ke sledování provozu na webu. Za tímto účelem jsou různá data o vás ukládána pomocí webových majáků.
            </p>

            <h2 id="cookies-typy" className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4">
              5. Cookies
            </h2>

            <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">5.1 Technické nebo funkční soubory cookies</h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Některé soubory cookies zajišťují, že určité části webu fungují správně a že vaše uživatelské preference
              zůstávají známé. Umístěním funkčních souborů cookies usnadňujeme návštěvu našich webových stránek. Tímto
              způsobem nemusíte při návštěvě našich webových stránek opakovaně zadávat stejné informace a například
              položky zůstanou v nákupním košíku, dokud nezaplatíte. Tyto cookies můžeme umístit bez vašeho souhlasu.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">5.2 Statistické cookies</h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Statistické soubory cookies využíváme k optimalizaci webových stránek pro naše uživatele. Díky těmto
              statistickým cookies získáváme přehled o používání našich webových stránek. Žádáme vás o povolení k
              ukládání statistických souborů cookies.
            </p>

            <h2 id="umistene-cookies" className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4">
              6. Umístěné cookies
            </h2>
            <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">Ostatní</h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">Účel čekající na zjištění.</p>
            <div className="overflow-x-auto my-6 rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left font-semibold text-foreground p-3">Název</th>
                    <th className="text-left font-semibold text-foreground p-3">Expirace</th>
                    <th className="text-left font-semibold text-foreground p-3">Funkce</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border last:border-0">
                    <td className="p-3 text-muted-foreground">ostatní</td>
                    <td className="p-3 text-muted-foreground">—</td>
                    <td className="p-3 text-muted-foreground">Účel čekající na zjištění</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Consent to service ostatní</p>

            <h2 id="souhlas" className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4">
              7. Souhlas
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Když poprvé navštívíte náš web, ukážeme vám vyskakovací okno s vysvětlením o cookies. Jakmile kliknete na
              „Příjmout", vyjadřujete svůj souhlas s používáním všech souborů cookies a doplňků popsaných ve
              vyskakovacím okně a v těchto Zásadách cookies. Používání cookies můžete zakázat pomocí svého prohlížeče,
              ale mějte na paměti, že naše webové stránky již nemusí fungovat správně.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">7.1 Správa nastavení souhlasu</h3>
            <p className="font-medium text-foreground mb-2">Funkční – Vždy aktivní.</p>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Technické uložení nebo přístup je nezbytně nutný pro legitimní účel umožnění použití konkrétní služby,
              kterou si odběratel nebo uživatel výslovně vyžádal, nebo pouze za účelem provedení přenosu sdělení
              prostřednictvím sítě elektronických komunikací.
            </p>
            <p className="font-medium text-foreground mb-2 mt-6">Statistiky</p>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Technické uložení nebo přístup, který se používá výhradně pro anonymní statistické účely. Bez předvolání,
              dobrovolného plnění ze strany vašeho Poskytovatele internetových služeb nebo dalších záznamů od třetí
              strany nelze informace, uložené nebo získané pouze pro tento účel, obvykle použít k vaší identifikaci.
            </p>

            <h2 id="povolení" className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4">
              8. Povolení/zakázání a odstranění cookies
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Pomocí internetového prohlížeče můžete automaticky nebo ručně mazat soubory cookies. Můžete také určit,
              že některé soubory cookies nemusí být umístěny. Další možností je změnit nastavení internetového
              prohlížeče tak, aby se vám při každém uložení souboru cookies zobrazila zpráva. Další informace o těchto
              možnostech naleznete v Nápovědě vašeho prohlížeče.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Vezměte prosím na vědomí, že náš web nemusí fungovat správně, pokud jsou deaktivovány všechny cookies.
              Pokud cookies smažete ve svém prohlížeči, budou znovu umístěny po vašem souhlasu, když znovu navštívíte
              naše webové stránky.
            </p>

            <h2 id="práva" className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4">
              9. Vaše práva týkající se osobních údajů
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">Pokud jde o vaše osobní údaje, máte následující práva:</p>
            <ul className="list-disc pl-6 text-base text-muted-foreground leading-relaxed space-y-2 mb-6">
              <li>
                Máte právo vědět, proč jsou vaše osobní údaje potřebné, co se s nimi stane a jak dlouho budou
                uchovány.
              </li>
              <li>
                <strong className="text-foreground">Právo na přístup:</strong> Máte právo na přístup k vašim osobním údajům, které jsou nám známy.
              </li>
              <li>
                <strong className="text-foreground">Právo na opravu:</strong> Máte právo doplnit, opravit, odstranit nebo zablokovat vaše osobní
                údaje, kdykoli budete chtít.
              </li>
              <li>
                Pokud nám udělíte souhlas se zpracováním vašich údajů, máte právo tento souhlas odvolat a nechat vaše
                osobní údaje smazat.
              </li>
              <li>
                <strong className="text-foreground">Právo na přenos vašich údajů:</strong> Máte právo vyžádat si od správce všechny vaše osobní
                údaje a v celém rozsahu je předat jinému správci.
              </li>
              <li>
                <strong className="text-foreground">Právo na námitku:</strong> proti zpracování vašich údajů můžete namítat. Řídíme se tím, pokud
                neexistují oprávněné důvody ke zpracování.
              </li>
            </ul>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Pro uplatnění těchto práv nás prosím kontaktujte. Kontaktní údaje najdete ve spodní části těchto Zásad
              používání souborů cookies. Máte-li stížnost na to, jak nakládáme s vašimi údaji, rádi bychom se o tom
              dozvěděli, ale máte také právo podat stížnost kontrolnímu orgánu (Úřadu pro ochranu osobních údajů).
              Více informací o zpracování osobních údajů naleznete v prohlášeních{" "}
              <Link href="/ochrana-osobnich-udaju/nemovitosti" className="text-primary no-underline hover:underline">Ochrana osobních údajů - Nemovitosti</Link>{" "}
              a{" "}
              <Link href="/ochrana-osobnich-udaju/vozidla" className="text-primary no-underline hover:underline">Ochrana osobních údajů - Vozidla</Link>.
            </p>

            <h2 id="kontakt" className="text-xl md:text-2xl font-bold text-foreground mt-12 mb-4">
              10. Kontaktní údaje
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              V případě dotazů nebo komentářů ohledně našich zásad týkajících se souborů cookies a tohoto prohlášení nás
              prosím kontaktujte pomocí následujících kontaktních údajů:
            </p>
            <ul className="list-none pl-0 text-base text-muted-foreground leading-relaxed space-y-2 mb-6">
              <li className="font-semibold text-foreground">Zdeněk Kapušňák</li>
              <li>Podvesná VII/2046, 760 01 Zlín</li>
              <li>Česká republika</li>
              <li>
                Web:{" "}
                <a href="https://hnedpenize.cz" target="_blank" rel="noopener noreferrer" className="text-primary no-underline hover:underline">
                  https://hnedpenize.cz
                </a>
              </li>
              <li>
                E-mail: <a href="mailto:info@docasnyvykup.cz" className="text-primary no-underline hover:underline">info@docasnyvykup.cz</a>
              </li>
              <li>Phone: +420 777 400 256</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Tyto Zásady cookies byly synchronizovány s cookiedatabase.org dne 23/05/2025
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
