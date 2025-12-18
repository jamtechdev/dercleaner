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
                {s.blocks.map((block, idx) => {
                  if (block.type === "p") {
                    return <p key={idx}>{block.text}</p>;
                  }
                  if (block.type === "note") {
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-brand/15 bg-brand-surface px-4 py-3 text-ink"
                      >
                        <p className="text-sm font-semibold">{block.text}</p>
                      </div>
                    );
                  }

                  if (block.type === "list") {
                    return (
                      <ul key={idx} className="list-disc space-y-2 pl-5">
                        {block.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    );
                  }

                  return null;
                })}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
