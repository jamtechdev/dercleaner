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
    title: `${site.legalPages.terms.title} | ${site.branding.name}`,
    description: site.legalPages.terms.description,
  };
}

function renderBlock(block: LegalBlock) {
  switch (block.type) {
    case "p":
      return (
        <p className="text-sm leading-7 text-gray-700">{block.text}</p>
      );
    case "note":
      return (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 my-4">
          <p className="text-sm leading-7 text-yellow-800">{block.text}</p>
        </div>
      );
    case "list":
      return (
        <ul className="list-disc list-inside space-y-2 text-sm leading-7 text-gray-700 ml-4">
          {block.items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default async function AGBPage() {
  const site = await getSite();
  const page = site.legalPages.terms as LegalPage;

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
              <h2 className="text-xl font-extrabold text-ink mb-4">{s.title}</h2>

              <div className="mt-4 space-y-4">
                {s.blocks.map((block, idx) => (
                  <div key={idx}>{renderBlock(block)}</div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
