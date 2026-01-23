import Link from "next/link";
import { requireAdmin } from "@/app/lib/adminAuth";
import { getContactSubmissions, getSite } from "@/app/lib/site";
import {
  clearSubmissionsAction,
  logoutAction,
  saveSiteQuickAction,
  saveSiteAction,
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/app/admin/actions";
import { VideoSourceSelector } from "@/app/admin/VideoSourceSelector";
import { RichTextEditor } from "@/app/admin/RichTextEditor";
import { ProductRepository } from "@/app/database/repositories/ProductRepository";
import { initializeDatabase } from "@/app/database/data-source";
import { ProductCreateForm } from "@/app/admin/ProductCreateForm";
import { ProductEditForm } from "@/app/admin/ProductEditForm";
import { ProductsListView } from "@/app/admin/ProductsListView";

const SIDEBAR_LINKS = [
  { id: "dashboard", label: "Armaturenbrett", href: "/admin?view=dashboard" },
  { id: "contact", label: "Kontakt", href: "/admin?view=contact" },
  { id: "products", label: "Produkte", href: "/admin?view=products" },
  { id: "legal", label: "Rechtliches", href: "/admin?view=legal" },
  { id: "settings", label: "Einstellungen", href: "/admin?view=settings" },
  // { id: "reports", label: "Reports", href: "/admin?view=reports" },
] as const;

function NavIcon({ id, active }: { id: ViewId; active: boolean }) {
  const cn = active ? "text-white" : "text-brand opacity-80 group-hover:opacity-100";
  const size = 20;
  switch (id) {
    case "dashboard":
      return (
        <svg className={`shrink-0 ${cn}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      );
    case "contact":
      return (
        <svg className={`shrink-0 ${cn}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case "legal":
      return (
        <svg className={`shrink-0 ${cn}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "products":
      return (
        <svg className={`shrink-0 ${cn}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "settings":
      return (
        <svg className={`shrink-0 ${cn}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    // case "reports":
    //   return (
    //     <svg className={`shrink-0 ${cn}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    //       <line x1="18" y1="20" x2="18" y2="10" />
    //       <line x1="12" y1="20" x2="12" y2="4" />
    //       <line x1="6" y1="20" x2="6" y2="14" />
    //     </svg>
    //   );
    default:
      return null;
  }
}

type ViewId = "dashboard" | "contact" | "products" | "settings" | "reports" | "legal";

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{
    saved?: string;
    cleared?: string;
    error?: string;
    page?: string;
    view?: string;
  }>;
}) {
  await requireAdmin();

  const site = await getSite();
  const submissions = await getContactSubmissions();
  
  // Get products count for dashboard
  let totalProducts = 0;
  try {
    await initializeDatabase();
    const productRepo = new ProductRepository();
    totalProducts = await productRepo.count();
  } catch (error) {
    console.error("Error fetching products count:", error);
  }

  const sp = (await searchParams) ?? {};
  const showSaved = sp.saved === "1";
  const showCleared = sp.cleared === "1";
  const showInvalidJson = sp.error === "invalid_json";
  const viewRaw = sp.view ?? "dashboard";
  const validViews = ["dashboard", "contact", "products", "settings", "reports", "legal"] as const;
  const view: ViewId = (validViews.includes(viewRaw as any) ? viewRaw : "dashboard") as ViewId;
  const currentPage = Math.max(1, Number(sp.page ?? "1") || 1);
  const pageSize = 10;
  const total = submissions.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const reversed = submissions.slice().reverse();
  const pageItems = reversed.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  return (
    <main className="min-h-screen bg-surface-alt/40">
      {(showSaved || showCleared || showInvalidJson) && (
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 md:px-12">
          <div
            className={[
              "rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm",
              showInvalidJson
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-brand/20 bg-brand-surface text-ink",
            ].join(" ")}
          >
            {showInvalidJson
              ? "Ungültiges JSON. Bitte korrigieren Sie den Fehler und versuchen Sie es erneut."
              : showCleared
                ? "Eingereichte Unterlagen freigegeben."
                : "Website-Inhalte gespeichert."}
          </div>
        </div>
      )}

      <header className="sticky top-0 z-10 border-b border-brand/10 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 md:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand/80">
                {site.branding.name}
              </p>
              <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight text-ink">
                Admin Armaturenbrett
              </h1>
              <p className="mt-0.5 text-sm font-semibold text-gray-500">
                Website-Inhalte verwalten und Leads kontaktieren.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-full border border-brand/25 bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand-surface hover:shadow"
              >Website ansehen
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-full bg-brand-cta px-4 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:shadow-lg hover:opacity-95"
                >
                  Abmelden
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Left sidebar */}
        <aside className="sticky top-[4.5rem] h-[calc(100vh-4.5rem)] w-60 shrink-0 border-r border-brand/10 bg-white py-6 pl-4 pr-3 shadow-[2px_0_16px_-4px_rgba(0,163,204,0.1)]">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
          Speisekarte
          </p>
          <nav className="flex flex-col gap-1">
            {SIDEBAR_LINKS.map((item) => {
              const isActive = view === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-brand-cta text-white shadow-md"
                      : "text-ink hover:bg-brand-soft hover:text-ink"
                  }`}
                >
                  <NavIcon id={item.id} active={isActive} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-8 sm:px-6 md:px-10 lg:px-12">
          {view === "dashboard" && (
            <DashboardView 
              siteName={site.branding?.name ?? "Der Cleaner"} 
              totalContacts={submissions.length}
              totalProducts={totalProducts}
            />
          )}
          {view === "settings" && <SettingsView site={site} />}
          {view === "products" && <ProductsView />}
          {view === "legal" && <LegalPagesView site={site} />}
          {view === "reports" && <ReportsView />}
          {view === "contact" && (
            <ContactView
              submissions={submissions}
              pageItems={pageItems}
              safePage={safePage}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
            />
          )}
        </section>
      </div>
    </main>
  );
}

function DashboardView({ siteName, totalContacts, totalProducts }: { siteName: string; totalContacts: number; totalProducts: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <article className="overflow-hidden rounded-3xl border border-brand/10 bg-white p-6 shadow-md transition hover:shadow-lg sm:p-8 sm:col-span-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-surface px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
            Armaturenbrett
            </div>
            <h2 className="mt-3 text-xl font-extrabold tracking-tight text-ink">
              Willkommen zurück
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-gray-600">
              Willkommen im Admin-Armaturenbrett von {siteName}.
            </p>
          </div>
        </div>
      </article>

      <Link
        href="/admin?view=contact"
        className="group relative overflow-hidden rounded-3xl border border-brand/10 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-brand/20 cursor-pointer"
      >
        <div className="absolute top-0 right-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-brand opacity-10" aria-hidden />
        <p className="text-xs font-bold uppercase tracking-widest text-brand/80">
          Gesamt Kontakte
        </p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
          {totalContacts}
        </p>
      </Link>

      <Link
        href="/admin?view=products"
        className="group relative overflow-hidden rounded-3xl border border-brand/10 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-brand/20 cursor-pointer"
      >
        <div className="absolute top-0 right-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-brand opacity-10" aria-hidden />
        <p className="text-xs font-bold uppercase tracking-widest text-brand/80">
          Gesamt Produkte
        </p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
          {totalProducts}
        </p>
      </Link>
    </div>
  );
}

function SettingsView({ site }: { site: any }) {

  return (
    <form action={saveSiteQuickAction} className="grid grid-cols-1 gap-6">
      <input type="hidden" name="view" value="settings" />
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-surface px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
          Einstellungen
        </div>
        <h2 className="mt-3 text-xl font-extrabold tracking-tight text-ink">
          Website-Inhalte verwalten
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-gray-600">
          Aktualisieren Sie Ihre Website-Inhalte. Änderungen werden sofort nach dem Klicken auf „Änderungen speichern“ gespeichert.
        </p>
      </article>

      {/* SEO & Branding */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          SEO und Branding
        </h3>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="seoTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Website-Titel (SEO)
            </label>
            <input
              id="seoTitle"
              name="seoTitle"
              type="text"
              defaultValue={site.seo?.title ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="z.B. Der Cleaner – Professionelle Reinigung"
            />
          </div>
          <div>
            <label htmlFor="seoDescription" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Meta-Beschreibung
            </label>
            <textarea
              id="seoDescription"
              name="seoDescription"
              rows={3}
              defaultValue={site.seo?.description ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="Kurzbeschreibung für Suchmaschinen…"
            />
          </div>
          <div>
            <label htmlFor="brandingName" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Markenname
            </label>
            <input
              id="brandingName"
              name="brandingName"
              type="text"
              defaultValue={site.branding?.name ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="z.B. Der Cleaner"
            />
          </div>
        </div>
      </article>

      {/* Navigation */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          Navigationslinks
        </h3>
        <div className="mt-5 space-y-4">
          {site.navigation?.links?.map((link: any, i: number) => (
            <div key={i} className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="flex-1">
                <label htmlFor={`navLabel_${i}`} className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Label {i + 1}
                </label>
                <input
                  id={`navLabel_${i}`}
                  name={`navLabel_${i}`}
                  type="text"
                  defaultValue={link.label ?? ""}
                  className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`navHref_${i}`} className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Link-URL {i + 1}
                </label>
                <input
                  id={`navHref_${i}`}
                  name={`navHref_${i}`}
                  type="text"
                  defaultValue={link.href ?? ""}
                  className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                  placeholder="/#section"
                />
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* Video Section */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          Video-Bereich
        </h3>
        <div className="mt-5 space-y-4">
          <VideoSourceSelector
            currentYoutubeUrl={site.videoSection?.youtubeUrl ?? ""}
            currentVideoFileUrl={site.videoSection?.videoFileUrl ?? ""}
          />
        </div>
      </article>

      {/* Contact Section */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          Kontakt-Bereich
        </h3>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="contactTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Kontakt-Titel
            </label>
            <input
              id="contactTitle"
              name="contactTitle"
              type="text"
              defaultValue={site.contactSection?.title ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor="contactSubtitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Kontakt-Untertitel
            </label>
            <input
              id="contactSubtitle"
              name="contactSubtitle"
              type="text"
              defaultValue={site.contactSection?.subtitle ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor="contactEmail1" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Erste Kontakt-E-Mail
            </label>
            <input
              id="contactEmail1"
              name="contactEmail1"
              type="email"
              defaultValue={site.contactSection?.contactInfo?.firstContact?.email ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor="contactEmail2" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Kundensupport-E-Mail
            </label>
            <input
              id="contactEmail2"
              name="contactEmail2"
              type="email"
              defaultValue={site.contactSection?.contactInfo?.customerSupport?.email ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Telefonnummer
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="tel"
              defaultValue={site.contactSection?.contactInfo?.phone?.number ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor="contactPrivacy" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Datenschutztext
            </label>
            <textarea
              id="contactPrivacy"
              name="contactPrivacy"
              rows={3}
              defaultValue={site.contactSection?.privacyText ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </div>
      </article>

      {/* Mission Section */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          Mission-Bereich
        </h3>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="missionTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Hero-Titel
            </label>
            <input
              id="missionTitle"
              name="missionTitle"
              type="text"
              defaultValue={site.missionSection?.hero?.title ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor="missionDescription" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Hero-Beschreibung
            </label>
            <textarea
              id="missionDescription"
              name="missionDescription"
              rows={3}
              defaultValue={site.missionSection?.hero?.description ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor="missionCtaLabel" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            CTA-Button-Beschriftung
            </label>
            <input
              id="missionCtaLabel"
              name="missionCtaLabel"
              type="text"
              defaultValue={site.missionSection?.hero?.ctaLabel ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor="missionIndustriesTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Titel des Abschnitts „Branchen“
            </label>
            <input
              id="missionIndustriesTitle"
              name="missionIndustriesTitle"
              type="text"
              defaultValue={site.missionSection?.industriesIntro?.title ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor="missionIndustriesDescription" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Beschreibung des Abschnitts „Branchen“
            </label>
            <textarea
              id="missionIndustriesDescription"
              name="missionIndustriesDescription"
              rows={2}
              defaultValue={site.missionSection?.industriesIntro?.description ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </div>
      </article>

      {/* About Section */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          Über-Bereich
        </h3>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="aboutTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Über-Titel
            </label>
            <input
              id="aboutTitle"
              name="aboutTitle"
              type="text"
              defaultValue={site.aboutSection?.title ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Über-Absätze
            </label>
            <p className="mt-1 text-xs font-semibold text-gray-500">
              Fügen Sie mehrere Absätze hinzu. Lassen Sie leer, um zu entfernen.
            </p>
            {site.aboutSection?.paragraphs?.map((para: string, i: number) => (
              <textarea
                key={i}
                id={`aboutParagraph_${i}`}
                name={`aboutParagraph_${i}`}
                rows={2}
                defaultValue={para}
                className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            ))}
            {(!site.aboutSection?.paragraphs || site.aboutSection.paragraphs.length === 0) && (
              <textarea
                id="aboutParagraph_0"
                name="aboutParagraph_0"
                rows={2}
                className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="Add first paragraph..."
              />
            )}
          </div>
        </div>
      </article>

      {/* FAQ Section */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          FAQ-Bereich
        </h3>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="faqTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              FAQ-Titel
            </label>
            <input
              id="faqTitle"
              name="faqTitle"
              type="text"
              defaultValue={site.faqSection?.title ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor="faqSubtitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              FAQ-Untertitel
            </label>
            <input
              id="faqSubtitle"
              name="faqSubtitle"
              type="text"
              defaultValue={site.faqSection?.subtitle ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor="faqContactLabel" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Kontakt-Button-Label
            </label>
            <input
              id="faqContactLabel"
              name="faqContactLabel"
              type="text"
              defaultValue={site.faqSection?.contactButtonLabel ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              FAQ-Elemente
            </label>
            <p className="mt-1 text-xs font-semibold text-gray-500">
              Fügen Sie Frage / Antwort-Paare hinzu. Lassen Sie die Frage leer, um zu entfernen.
            </p>
            {(site.faqSection?.items ?? []).map((item: any, i: number) => (
              <div key={i} className="mt-4 flex flex-col gap-2 rounded-xl border border-brand/10 bg-brand-surface/20 p-4">
                <input
                  name={`faqQuestion_${i}`}
                  type="text"
                  defaultValue={item.question ?? ""}
                  placeholder="Question"
                  className="w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
                <textarea
                  name={`faqAnswer_${i}`}
                  rows={2}
                  defaultValue={item.answer ?? ""}
                  placeholder="Answer"
                  className="w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
            ))}
            {(!site.faqSection?.items || site.faqSection.items.length === 0) && (
              <div className="mt-4 flex flex-col gap-2 rounded-xl border border-brand/10 bg-brand-surface/20 p-4">
                <input
                  name="faqQuestion_0"
                  type="text"
                  placeholder="Question"
                  className="w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
                <textarea
                  name="faqAnswer_0"
                  rows={2}
                  placeholder="Answer"
                  className="w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
            )}
            {(site.faqSection?.items?.length ?? 0) > 0 && (
              <div className="mt-4 flex flex-col gap-2 rounded-xl border border-dashed border-brand/20 bg-white p-4">
                <input
                  name={`faqQuestion_${(site.faqSection?.items ?? []).length}`}
                  type="text"
                  placeholder="+ Neue Frage (optional)"
                  className="w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
                <textarea
                  name={`faqAnswer_${(site.faqSection?.items ?? []).length}`}
                  rows={2}
                  placeholder="+ Neue Antwort (optional)"
                  className="w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          className="rounded-full bg-brand-cta px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:shadow-lg hover:opacity-95"
        >
          Änderungen speichern
        </button>
      </div>
    </form>
  );
}

function LegalPagesView({ site }: { site: any }) {
  const impressum = site.legalPages?.imprint ?? { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
  const agb = site.legalPages?.terms ?? { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
  const datenschutz = site.legalPages?.privacy ?? { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };

  return (
    <form action={saveSiteQuickAction} className="grid grid-cols-1 gap-6">
      <input type="hidden" name="view" value="legal" />
      
      {/* Header */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-surface px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
              Rechtliches
            </div>
            <h2 className="mt-3 text-xl font-extrabold tracking-tight text-ink">
              Rechtliche Seiten verwalten
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-gray-600">
              Verwalten Sie die Inhalte für Impressum, AGB und Datenschutzerklärung. HTML-Tags werden unterstützt.
            </p>
          </div>
        </div>
      </article>
      {/* Impressum Section */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          Impressum
        </h3>
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="impressumTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Titel
              </label>
              <input
                id="impressumTitle"
                name="impressumTitle"
                type="text"
                defaultValue={impressum.title ?? ""}
                className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="Impressum"
              />
            </div>
            <div>
              <label htmlFor="impressumLastUpdated" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Letzte Aktualisierung
              </label>
              <input
                id="impressumLastUpdated"
                name="impressumLastUpdated"
                type="text"
                defaultValue={impressum.lastUpdated ?? ""}
                className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="18.12.2025"
              />
            </div>
          </div>
          <div>
            <label htmlFor="impressumDescription" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Beschreibung (SEO)
            </label>
            <input
              id="impressumDescription"
              name="impressumDescription"
              type="text"
              defaultValue={impressum.description ?? ""}
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="Kurzbeschreibung für Suchmaschinen"
            />
          </div>
          <div>
            <label htmlFor="impressumBackLabel" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Beschriftung der Schaltfläche „Zurück“.
            </label>
            <input
              id="impressumBackLabel"
              name="impressumBackLabel"
              type="text"
              defaultValue={impressum.backToHomeLabel ?? ""}
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="Zurück zur Startseite"
            />
          </div>
          <div>
            <label htmlFor="impressumContent" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Inhalt
            </label>
            <div className="mt-2">
              <RichTextEditor
                name="impressumContent"
                defaultValue={impressum.content ?? ""}
                placeholder="Geben Sie hier den Inhalt für das Impressum ein..."
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-gray-500">
              Verwenden Sie die Toolbar zum Formatieren des Textes. Der Inhalt wird als HTML gespeichert.
            </p>
          </div>
        </div>
      </article>

      {/* AGB Section */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          AGB (Allgemeine Geschäftsbedingungen)
        </h3>
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="agbTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Titel
              </label>
              <input
                id="agbTitle"
                name="agbTitle"
                type="text"
                defaultValue={agb.title ?? ""}
                className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="AGB"
              />
            </div>
            <div>
              <label htmlFor="agbLastUpdated" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Letzte Aktualisierung
              </label>
              <input
                id="agbLastUpdated"
                name="agbLastUpdated"
                type="text"
                defaultValue={agb.lastUpdated ?? ""}
                className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="18.12.2025"
              />
            </div>
          </div>
          <div>
            <label htmlFor="agbDescription" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Beschreibung (SEO)
            </label>
            <input
              id="agbDescription"
              name="agbDescription"
              type="text"
              defaultValue={agb.description ?? ""}
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="Kurzbeschreibung für Suchmaschinen"
            />
          </div>
          <div>
            <label htmlFor="agbBackLabel" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Beschriftung der Schaltfläche „Zurück“.
            </label>
            <input
              id="agbBackLabel"
              name="agbBackLabel"
              type="text"
              defaultValue={agb.backToHomeLabel ?? ""}
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="Zurück zur Startseite"
            />
          </div>
          <div>
            <label htmlFor="agbContent" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Inhalt
            </label>
            <div className="mt-2">
              <RichTextEditor
                name="agbContent"
                defaultValue={agb.content ?? ""}
                placeholder="Geben Sie hier den Inhalt für die AGB ein..."
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-gray-500">
              Verwenden Sie die Toolbar zum Formatieren des Textes. Der Inhalt wird als HTML gespeichert.
            </p>
          </div>
        </div>
      </article>

      {/* Datenschutz Section */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          Datenschutzerklärung
        </h3>
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="datenschutzTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Titel
              </label>
              <input
                id="datenschutzTitle"
                name="datenschutzTitle"
                type="text"
                defaultValue={datenschutz.title ?? ""}
                className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="Datenschutzerklärung"
              />
            </div>
            <div>
              <label htmlFor="datenschutzLastUpdated" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Letzte Aktualisierung
              </label>
              <input
                id="datenschutzLastUpdated"
                name="datenschutzLastUpdated"
                type="text"
                defaultValue={datenschutz.lastUpdated ?? ""}
                className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="18.12.2025"
              />
            </div>
          </div>
          <div>
            <label htmlFor="datenschutzDescription" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Beschreibung (SEO)
            </label>
            <input
              id="datenschutzDescription"
              name="datenschutzDescription"
              type="text"
              defaultValue={datenschutz.description ?? ""}
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="Kurzbeschreibung für Suchmaschinen"
            />
          </div>
          <div>
            <label htmlFor="datenschutzBackLabel" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Beschriftung der Schaltfläche „Zurück“.
            </label>
            <input
              id="datenschutzBackLabel"
              name="datenschutzBackLabel"
              type="text"
              defaultValue={datenschutz.backToHomeLabel ?? ""}
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="Zurück zur Startseite"
            />
          </div>
          <div>
            <label htmlFor="datenschutzContent" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Inhalt
            </label>
            <div className="mt-2">
              <RichTextEditor
                name="datenschutzContent"
                defaultValue={datenschutz.content ?? ""}
                placeholder="Geben Sie hier den Inhalt für die Datenschutzerklärung ein..."
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-gray-500">
              Verwenden Sie die Toolbar zum Formatieren des Textes. Der Inhalt wird als HTML gespeichert.
            </p>
          </div>
        </div>
      </article>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          className="rounded-full bg-brand-cta px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:shadow-lg hover:opacity-95"
        >
          Änderungen speichern
        </button>
      </div>
    </form>
  );
}

function ReportsView() {
  const activities = [
    { label: "Page view – Home", date: "Dec 1, 2024" },
    { label: "Page view – Contact", date: "Nov 30, 2024" },
    { label: "New contact submission", date: "Nov 29, 2024" },
  ];
  return (
    <div className="grid grid-cols-1 gap-6">
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-surface px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
          Berichte
        </div>
        <h2 className="mt-3 text-xl font-extrabold tracking-tight text-ink">
          Berichte &amp; Analysen 
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-gray-600">
          Sehen Sie sich den Traffic, die Konversion und die Kontakt-Lead-Berichte an. Dieser Bereich verwendet
          Platzhalter-Inhalte für das Layout.
        </p>
      </article>

      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          Traffic-Übersicht
        </h3>
        <div className="mt-5 flex h-44 items-center justify-center rounded-2xl border-2 border-dashed border-brand/20 bg-gradient-to-b from-brand-surface/40 to-brand-surface/10">
          <p className="text-center text-sm font-semibold text-gray-500">
            Diagramm-Platzhalter – integrieren Sie Analysen, wenn Sie bereit sind.
          </p>
        </div>
      </article>

      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          Letzte Aktivität
        </h3>
        <ul className="mt-5 space-y-2">
          {activities.map((a, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-4 rounded-xl border border-brand/10 bg-brand-surface/30 px-4 py-3 transition hover:bg-brand-surface/50"
            >
              <span className="text-sm font-semibold text-gray-700">{a.label}</span>
              <span className="text-xs font-semibold text-gray-500 tabular-nums">
                {a.date}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

// Helper function to convert Product entity to plain object
function productToPlainObject(product: any): any {
  return {
    id: product.id,
    name: product.name,
    tabTitle: product.tabTitle,
    tabDesc: product.tabDesc,
    tabImage: product.tabImage,
    heroImage: product.heroImage,
    video: product.video,
    featuresImage: product.featuresImage,
    savingsTitle: product.savingsTitle,
    savingsSubtitle: product.savingsSubtitle,
    stats: product.stats,
    description: product.description,
    technicalSpecs: product.technicalSpecs,
    features: product.features,
    displayOrder: product.displayOrder,
    createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : product.createdAt,
    updatedAt: product.updatedAt instanceof Date ? product.updatedAt.toISOString() : product.updatedAt,
  };
}

async function ProductsView() {
  await initializeDatabase();
  const repo = new ProductRepository();
  const products = await repo.findAll();
  const plainProducts = products.map(productToPlainObject);
  const totalProducts = plainProducts.length;

  return (
    <div className="grid grid-cols-1 gap-6">
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-surface px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
              Produkte
            </div>
            <h2 className="mt-3 text-xl font-extrabold tracking-tight text-ink">
              Produkte verwalten
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-gray-600">
              {totalProducts} total
            </p>
          </div>
        </div>
      </article>

      <ProductCreateForm />

      {plainProducts.length === 0 ? (
        <article className="rounded-3xl border border-brand/10 bg-white p-12 shadow-sm text-center">
          <p className="text-sm font-semibold text-gray-600">
            Noch keine Produkte vorhanden. Erstellen Sie Ihr erstes Produkt.
          </p>
        </article>
      ) : (
        <ProductsListView products={plainProducts} />
      )}
    </div>
  );
}

function ProductEditFormWrapper({ product }: { product: any }) {
  return <ProductEditForm product={product} />;
}

function ContactView({
  submissions,
  pageItems,
  safePage,
  totalPages,
  total,
  pageSize,
}: {
  submissions: any[];
  pageItems: any[];
  safePage: number;
  totalPages: number;
  total: number;
  pageSize: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-surface px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
              Kontaktiere uns
            </div>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight text-ink">
              Kontakt-Eingaben
            </h2>
            <p className="mt-0.5 text-sm font-semibold text-gray-600">
              {submissions.length} Gesamt
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/submissions"
              className="rounded-full border border-brand/25 bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand-surface hover:shadow"
            >
              JSON herunterladen
            </Link>
            <form action={clearSubmissionsAction}>
              <input type="hidden" name="view" value="contact" />
              <button
                type="submit"
                className="rounded-full bg-ink px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-black hover:shadow"
              >
                Clear
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-brand/10 shadow-inner">
          <div className="max-h-[520px] overflow-auto bg-brand-surface/20">
            {submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-surface">
                  <svg className="h-7 w-7 text-brand/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-600">
                  Noch keine Eingaben.
                </p>
                <p className="max-w-sm text-xs font-semibold text-gray-500">
                  Kontaktformulareingaben erscheinen hier, wenn Besucher das Formular absenden.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 z-[1] bg-brand-surface">
                  <tr>
                    <th className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-ink">
                      Datum
                    </th>
                    <th className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-ink">
                      Vorname
                    </th>
                    <th className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-ink">
                      E-Mail
                    </th>
                    <th className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-ink">
                      Telefon
                    </th>
                    <th className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-ink">
                      Nachricht
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((s: any, i) => (
                    <tr
                      key={s.id}
                      className={`border-t border-brand/10 transition hover:bg-brand-surface/50 ${
                        i % 2 === 1 ? "bg-white/50" : ""
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold tabular-nums text-gray-600">
                        {s.createdAt
                          ? new Date(s.createdAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink">
                        {s.name || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-brand">
                        {s.email || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-700">
                        {s.tel || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <div className="max-w-[520px] whitespace-pre-wrap break-words text-sm">
                          {s.message || "—"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {submissions.length > 0 && (
          <div className="mt-5 flex flex-col gap-4 rounded-xl border border-brand/10 bg-brand-surface/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold tabular-nums text-gray-600">
              Seite {safePage} von {totalPages} · Anzeigen{" "}
              {(safePage - 1) * pageSize + 1}–
              {Math.min(safePage * pageSize, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin?view=contact&page=${Math.max(1, safePage - 1)}`}
                className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  safePage <= 1
                    ? "pointer-events-none cursor-default border border-brand/20 bg-white text-ink opacity-50"
                    : "border border-brand/25 bg-white text-ink shadow-sm hover:border-brand/40 hover:bg-brand-surface hover:shadow"
                }`}
              >
                Vorherige
              </Link>
              <Link
                href={`/admin?view=contact&page=${Math.min(
                  totalPages,
                  safePage + 1
                )}`}
                className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  safePage >= totalPages
                    ? "pointer-events-none cursor-default border border-brand/20 bg-white text-ink opacity-50"
                    : "border border-brand/25 bg-white text-ink shadow-sm hover:border-brand/40 hover:bg-brand-surface hover:shadow"
                }`}
              >
                Nächste
              </Link>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
