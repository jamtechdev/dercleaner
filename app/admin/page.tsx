import Link from "next/link";
import { requireAdmin } from "@/app/lib/adminAuth";
import { getContactSubmissions, getSite } from "@/app/lib/site";
import {
  clearSubmissionsAction,
  logoutAction,
  saveSiteQuickAction,
  saveSiteAction,
} from "@/app/admin/actions";

const SIDEBAR_LINKS = [
  // { id: "dashboard", label: "Dashboard", href: "/admin" },
  { id: "dashboard", label: "Dashboard", href: "/admin?view=contact" },
  { id: "settings", label: "Settings", href: "/admin?view=settings" },
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
    // case "contact":
    //   return (
    //     <svg className={`shrink-0 ${cn}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    //       <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    //       <polyline points="22,6 12,13 2,6" />
    //     </svg>
    //   );
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

type ViewId = (typeof SIDEBAR_LINKS)[number]["id"];

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

  const sp = (await searchParams) ?? {};
  const showSaved = sp.saved === "1";
  const showCleared = sp.cleared === "1";
  const showInvalidJson = sp.error === "invalid_json";
  const viewRaw = sp.view ?? "dashboard";
  const view: ViewId = [
    "dashboard",
    "contact",
    "settings",
    "reports",
  ].includes(viewRaw)
    ? (viewRaw as ViewId)
    : "dashboard";
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
              ? "Invalid JSON. Please fix and try again."
              : showCleared
                ? "Submissions cleared."
                : "Website content saved."}
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
                Admin Dashboard
              </h1>
              <p className="mt-0.5 text-sm font-semibold text-gray-500">
                Manage website content and contact leads.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-full border border-brand/25 bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand-surface hover:shadow"
              >
                View site
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-full bg-brand-cta px-4 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:shadow-lg hover:opacity-95"
                >
                  Logout
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
            Menu
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
            <DashboardView siteName={site.branding?.name ?? "Der Cleaner"} />
          )}
          {view === "settings" && <SettingsView site={site} />}
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

function DashboardView({ siteName }: { siteName: string }) {
  const stats = [
    { label: "Total Visitors", value: "12,847", sub: "Last 30 days", accent: "bg-brand" },
    { label: "Page Views", value: "48,291", sub: "Last 30 days", accent: "bg-brand-cta" },
    { label: "Avg. Session", value: "2m 34s", sub: "Last 30 days", accent: "bg-about" },
  ];
  return (
    <div className="grid grid-cols-1 gap-6">
      <article className="overflow-hidden rounded-3xl border border-brand/10 bg-white p-6 shadow-md transition hover:shadow-lg sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-surface px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
              Dashboard
            </div>
            <h2 className="mt-3 text-xl font-extrabold tracking-tight text-ink">
              Welcome back
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-gray-600">
              Welcome to the {siteName} admin dashboard. Use the sidebar to switch
              between <strong>Dashboard</strong>, <strong>Contact Us</strong>,{" "}
              <strong>Settings</strong>, and <strong>Reports</strong>.
            </p>
          </div>
          {/* <div className="hidden shrink-0 sm:block h-14 w-14 rounded-2xl bg-gradient-to-br from-brand to-brand-cta opacity-90" aria-hidden /> */}
        </div>
      </article>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="group relative overflow-hidden rounded-3xl border border-brand/10 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-brand/20"
          >
            <div className={`absolute top-0 right-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full ${stat.accent} opacity-10`} aria-hidden />
            <p className="text-xs font-bold uppercase tracking-widest text-brand/80">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-semibold text-gray-500">
              {stat.sub}
            </p>
          </article>
        ))}
      </div>

      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-extrabold tracking-tight text-ink">
          Quick overview
        </h2>
        <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-gray-600">
          This is a placeholder overview. You can manage contact form
          submissions from the <strong className="text-ink">Contact Us</strong> menu. Use{" "}
          <strong className="text-ink">Settings</strong> for site configuration and{" "}
          <strong className="text-ink">Reports</strong> for analytics. All data shown here is dummy
          content for layout purposes.
        </p>
      </article>
    </div>
  );
}

function SettingsView({ site }: { site: any }) {

  return (
    <form action={saveSiteQuickAction} className="grid grid-cols-1 gap-6">
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-surface px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
          Settings
        </div>
        <h2 className="mt-3 text-xl font-extrabold tracking-tight text-ink">
          Website Content Management
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-gray-600">
          Update your website content. Changes will be saved immediately after clicking "Save Changes".
        </p>
      </article>

      {/* SEO & Branding */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          SEO & Branding
        </h3>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="seoTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Site Title (SEO)
            </label>
            <input
              id="seoTitle"
              name="seoTitle"
              type="text"
              defaultValue={site.seo?.title ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="e.g. Der Cleaner – Professional Cleaning"
            />
          </div>
          <div>
            <label htmlFor="seoDescription" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Meta Description
            </label>
            <textarea
              id="seoDescription"
              name="seoDescription"
              rows={3}
              defaultValue={site.seo?.description ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="Brief description for search engines…"
            />
          </div>
          <div>
            <label htmlFor="brandingName" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Brand Name
            </label>
            <input
              id="brandingName"
              name="brandingName"
              type="text"
              defaultValue={site.branding?.name ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="e.g. Der Cleaner"
            />
          </div>
        </div>
      </article>

      {/* Navigation */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          Navigation Links
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
                  URL {i + 1}
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
          Video Section
        </h3>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="youtubeUrl" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              YouTube URL
            </label>
            <input
              id="youtubeUrl"
              name="youtubeUrl"
              type="url"
              defaultValue={site.videoSection?.youtubeUrl ?? ""}
              className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="https://youtu.be/..."
            />
          </div>
        </div>
      </article>

      {/* Contact Section */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          Contact Section
        </h3>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="contactTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Contact Title
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
              Contact Subtitle
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
              First Contact Email
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
              Customer Support Email
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
              Phone Number
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
              Privacy Text
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
          Mission Section
        </h3>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="missionTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Hero Title
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
              Hero Description
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
              CTA Button Label
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
              Industries Section Title
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
              Industries Section Description
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
          About Section
        </h3>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="aboutTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              About Title
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
              About Paragraphs
            </label>
            <p className="mt-1 text-xs font-semibold text-gray-500">
              Add multiple paragraphs. Leave empty to remove.
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
          FAQ Section
        </h3>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="faqTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              FAQ Title
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
              FAQ Subtitle
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
              Contact Button Label
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
              FAQ Items
            </label>
            <p className="mt-1 text-xs font-semibold text-gray-500">
              Add question / answer pairs. Leave question empty to remove.
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
                  placeholder="+ New question (optional)"
                  className="w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
                <textarea
                  name={`faqAnswer_${(site.faqSection?.items ?? []).length}`}
                  rows={2}
                  placeholder="+ New answer (optional)"
                  className="w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Products Section */}
      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          Products Section
        </h3>
        <div className="mt-5 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="productsTechDataLabel" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Tech Data Button Label
              </label>
              <input
                id="productsTechDataLabel"
                name="productsTechDataLabel"
                type="text"
                defaultValue={site.productsSection?.actions?.techDataLabel ?? ""}
                className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
            <div>
              <label htmlFor="productsDemoLabel" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Demo Button Label
              </label>
              <input
                id="productsDemoLabel"
                name="productsDemoLabel"
                type="text"
                defaultValue={site.productsSection?.actions?.demoLabel ?? ""}
                className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Products
            </label>
            <p className="mt-1 text-xs font-semibold text-gray-500">
              Edit name, tab title/desc, description, and savings text per product.
            </p>
            {(site.productsSection?.products ?? []).map((p: any, i: number) => (
              <div key={p.id ?? i} className="mt-4 flex flex-col gap-4 rounded-xl border border-brand/10 bg-brand-surface/20 p-5">
                <p className="text-sm font-bold text-brand">
                  Product {i + 1}: {p.name || p.tabTitle || p.id}
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-500">Name</label>
                    <input
                      name={`product_${i}_name`}
                      type="text"
                      defaultValue={p.name ?? ""}
                      className="mt-1 w-full rounded-xl border border-brand/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500">Tab Title</label>
                    <input
                      name={`product_${i}_tabTitle`}
                      type="text"
                      defaultValue={p.tabTitle ?? ""}
                      className="mt-1 w-full rounded-xl border border-brand/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500">Tab Description</label>
                  <input
                    name={`product_${i}_tabDesc`}
                    type="text"
                    defaultValue={p.tabDesc ?? ""}
                    className="mt-1 w-full rounded-xl border border-brand/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500">Description</label>
                  <textarea
                    name={`product_${i}_description`}
                    rows={3}
                    defaultValue={p.description ?? ""}
                    className="mt-1 w-full rounded-xl border border-brand/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-500">Savings Title</label>
                    <input
                      name={`product_${i}_savingsTitle`}
                      type="text"
                      defaultValue={p.savingsTitle ?? ""}
                      className="mt-1 w-full rounded-xl border border-brand/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500">Savings Subtitle</label>
                    <input
                      name={`product_${i}_savingsSubtitle`}
                      type="text"
                      defaultValue={p.savingsSubtitle ?? ""}
                      className="mt-1 w-full rounded-xl border border-brand/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          className="rounded-full bg-brand-cta px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:shadow-lg hover:opacity-95"
        >
          Save Changes
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
          Reports
        </div>
        <h2 className="mt-3 text-xl font-extrabold tracking-tight text-ink">
          Reports &amp; analytics
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-gray-600">
          View traffic, conversion, and contact lead reports. This section uses
          dummy content for layout.
        </p>
      </article>

      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          Traffic overview
        </h3>
        <div className="mt-5 flex h-44 items-center justify-center rounded-2xl border-2 border-dashed border-brand/20 bg-gradient-to-b from-brand-surface/40 to-brand-surface/10">
          <p className="text-center text-sm font-semibold text-gray-500">
            Chart placeholder – integrate analytics when ready.
          </p>
        </div>
      </article>

      <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-base font-extrabold tracking-tight text-ink">
          Recent activity
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
              Contact Us
            </div>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight text-ink">
              Contact submissions
            </h2>
            <p className="mt-0.5 text-sm font-semibold text-gray-600">
              {submissions.length} total
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/submissions"
              className="rounded-full border border-brand/25 bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand-surface hover:shadow"
            >
              Download JSON
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
                  No submissions yet.
                </p>
                <p className="max-w-sm text-xs font-semibold text-gray-500">
                  Contact form entries will appear here once visitors submit the form.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 z-[1] bg-brand-surface">
                  <tr>
                    <th className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-ink">
                      Date
                    </th>
                    <th className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-ink">
                      Name
                    </th>
                    <th className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-ink">
                      Email
                    </th>
                    <th className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-ink">
                      Phone
                    </th>
                    <th className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-ink">
                      Message
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
              Page {safePage} of {totalPages} · Showing{" "}
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
                Prev
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
                Next
              </Link>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
