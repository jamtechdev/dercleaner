import type { Metadata } from "next";
import Link from "next/link";
import { getSite } from "@/app/lib/site";

type LegalBlock =
  | { type: "p"; text: string }
  | { type: "note"; text: string }
  | { type: "list"; items: string[] };

type LegalSection = { title: string; blocks: LegalBlock[] };

type LegalPage = {
  title: string;
  description: string;
  lastUpdated: string;
  backToHomeLabel: string;
  sections: LegalSection[];
};

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    title: `${site.legalPages.imprint.title} | ${site.branding.name}`,
    description: site.legalPages.imprint.description,
  };
}

export default async function ImpressumPage() {
  const site = await getSite();
  const page = site.legalPages.imprint as LegalPage;

  return (
    <main className="w-full bg-white">
      {/* Hero */}
      <section className="bg-brand-surface border-b border-brand/10">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:px-12">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold uppercase tracking-widest text-brand/80">
              {site.branding.name}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {page.title}
            </h1>
            <p className="text-sm font-semibold text-gray-600">
              Stand: {page.lastUpdated}
            </p>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-brand-cta px-5 py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                {page.backToHomeLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 gap-6">
          {page.sections.map((s) => (
            <article
              key={s.title}
              className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-xl font-extrabold text-ink">{s.title}</h2>

              <div className="mt-4 space-y-4 text-sm leading-7 text-gray-700">
              Angaben gemäß § 5 DDG
‍
Firma: Wolf Dieter Müller
Anschrift: Neckarhäde 15
Eberbach
‍

Telefon: 01726334344
Email: Support@imop.de

Umsatzsteuer-ID
Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
folgt
‍

EU-Streitschlichtung
Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr.
Unsere E-Mail-Adresse finden Sie oben im Impressum.

Verbraucher­streit­beilegung/Universal­schlichtungs­stelle
Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

⸻
Hinweis zur Markeninhaberschaft und Herstellerrolle
Wir sind autorisierter Fachhändler für die Produkte der Marke I-Mop.Die Marke „I-Mop“ ist eine eingetragene Marke der Firma i-Team Global B.V., Niederlande.Wir sind nicht der Hersteller, sondern vertreiben ausschließlich Originalprodukte des genannten Herstellers.
Alle genannten Marken- und Produktbezeichnungen sind Eigentum der jeweiligen Rechteinhaber und werden ausschließlich zur eindeutigen Identifikation der angebotenen Waren genutzt.
⸻

Haftung für Inhalte
Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.

Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.

Haftung für Links
Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.

Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.

Urheberrecht
Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.

Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
