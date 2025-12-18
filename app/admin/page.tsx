import Link from "next/link";
import { requireAdmin } from "@/app/lib/adminAuth";
import { getContactSubmissions, getSite } from "@/app/lib/site";
import {
  clearSubmissionsAction,
  logoutAction,
  saveSiteQuickAction,
  saveSiteAction,
} from "@/app/admin/actions";

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{
    saved?: string;
    cleared?: string;
    error?: string;
    page?: string;
  }>;
}) {
  await requireAdmin();

  const site = await getSite();
  const submissions = await getContactSubmissions();

  const sp = (await searchParams) ?? {};
  const showSaved = sp.saved === "1";
  const showCleared = sp.cleared === "1";
  const showInvalidJson = sp.error === "invalid_json";
  const currentPage = Math.max(1, Number(sp.page ?? "1") || 1);
  const pageSize = 10;
  const total = submissions.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const reversed = submissions.slice().reverse();
  const pageItems = reversed.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <main className="min-h-screen bg-white">
      {(showSaved || showCleared || showInvalidJson) && (
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 md:px-12">
          <div
            className={[
              "rounded-2xl border px-4 py-3 text-sm font-semibold",
              showInvalidJson
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-brand/15 bg-brand-surface text-ink",
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

      <header className="border-b border-brand/10 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 md:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand/80">
                {site.branding.name}
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-ink">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm font-semibold text-gray-600">
                Manage website content and contact leads.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-brand-surface"
              >
                View site
              </Link>
              <form action={logoutAction}>
                <button className="rounded-full bg-brand-cta px-4 py-2 text-sm font-extrabold text-white shadow-sm hover:opacity-90">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 gap-6">
          {/* Quick editor (form-based) */}
          <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <h2 className="text-xl font-extrabold text-ink">Quick editor</h2>
              <p className="mt-1 text-sm font-semibold text-gray-600">
                Edit common content using a form (brand-safe). For advanced edits,
                use the JSON editor below.
              </p>
            </div>

            <form action={saveSiteQuickAction} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-extrabold text-ink mb-1">
                    SEO title
                  </label>
                  <input
                    name="seoTitle"
                    defaultValue={site.seo?.title ?? ""}
                    className="w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-ink mb-1">
                    SEO description
                  </label>
                  <input
                    name="seoDescription"
                    defaultValue={site.seo?.description ?? ""}
                    className="w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-ink mb-1">
                  YouTube URL
                </label>
                <input
                  name="youtubeUrl"
                  defaultValue={site.videoSection?.youtubeUrl ?? ""}
                  className="w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="rounded-3xl border border-brand/10 bg-brand-surface p-5">
                <h3 className="text-sm font-extrabold text-ink">Navigation</h3>
                <p className="mt-1 text-xs font-semibold text-gray-600">
                  Edit existing links (label + href).
                </p>

                <div className="mt-4 space-y-3">
                  {(site.navigation?.links as Array<{ label: string; href: string }>).map(
                    (l, i) => (
                      <div
                        key={`${l.href}-${l.label}-${i}`}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                      >
                        <input
                          name={`navLabel_${i}`}
                          defaultValue={l.label}
                          className="w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-brand"
                          placeholder="Label"
                        />
                        <input
                          name={`navHref_${i}`}
                          defaultValue={l.href}
                          className="w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-brand"
                          placeholder="/#kontakt"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-extrabold text-ink mb-1">
                    Contact title
                  </label>
                  <input
                    name="contactTitle"
                    defaultValue={site.contactSection?.title ?? ""}
                    className="w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-ink mb-1">
                    Contact subtitle
                  </label>
                  <input
                    name="contactSubtitle"
                    defaultValue={site.contactSection?.subtitle ?? ""}
                    className="w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-ink mb-1">
                  Contact privacy text
                </label>
                <textarea
                  name="contactPrivacy"
                  defaultValue={site.contactSection?.privacyText ?? ""}
                  className="h-28 w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="flex items-center justify-end">
                <button className="rounded-full bg-brand-cta px-6 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-90">
                  Save quick changes
                </button>
              </div>
            </form>
          </article>

          {/* Content editor */}
          <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-ink">Website content</h2>
                <p className="mt-1 text-sm font-semibold text-gray-600">
                  Edit <code className="font-mono">site.json</code> (JSON). Save
                  applies immediately.
                </p>
              </div>

              <form action={saveSiteAction} className="hidden" id="saveSiteForm" />
            </div>

            <form action={saveSiteAction} className="mt-5">
              <textarea
                name="siteJson"
                defaultValue={JSON.stringify(site, null, 2)}
                spellCheck={false}
                className="h-[420px] w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 font-mono text-xs leading-5 text-ink outline-none focus:ring-2 focus:ring-brand"
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold text-gray-500">
                  Tip: Keep valid JSON. If invalid, you’ll see an error toast.
                </p>
                <button className="rounded-full bg-brand-cta px-6 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-90">
                  Save changes
                </button>
              </div>
            </form>
          </article>

          {/* Submissions */}
          <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-ink">
                  Contact submissions
                </h2>
                <p className="mt-1 text-sm font-semibold text-gray-600">
                  {submissions.length} total
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin/submissions"
                  className="rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-brand-surface"
                >
                  Download JSON
                </Link>
                <form action={clearSubmissionsAction}>
                  <button className="rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-white hover:bg-black">
                    Clear
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-brand/10">
              <div className="max-h-[520px] overflow-auto bg-white">
                {submissions.length === 0 ? (
                  <div className="p-6 text-sm font-semibold text-gray-600">
                    No submissions yet.
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-brand-surface">
                      <tr>
                        <th className="px-4 py-3 text-xs font-extrabold text-ink">
                          Date
                        </th>
                        <th className="px-4 py-3 text-xs font-extrabold text-ink">
                          Name
                        </th>
                        <th className="px-4 py-3 text-xs font-extrabold text-ink">
                          Email
                        </th>
                        <th className="px-4 py-3 text-xs font-extrabold text-ink">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-xs font-extrabold text-ink">
                          Message
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((s: any) => (
                          <tr
                            key={s.id}
                            className="border-t border-brand/10"
                          >
                            <td className="px-4 py-3 text-xs font-semibold text-gray-600 whitespace-nowrap">
                              {s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}
                            </td>
                            <td className="px-4 py-3 font-semibold text-ink whitespace-nowrap">
                              {s.name || "—"}
                            </td>
                            <td className="px-4 py-3 font-semibold text-brand whitespace-nowrap">
                              {s.email || "—"}
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                              {s.tel || "—"}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              <div className="max-w-[520px] whitespace-pre-wrap break-words">
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
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold text-gray-500">
                  Page {safePage} of {totalPages} • Showing {(safePage - 1) * pageSize + 1}–
                  {Math.min(safePage * pageSize, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin?page=${Math.max(1, safePage - 1)}`}
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      safePage <= 1
                        ? "pointer-events-none opacity-50 border border-brand/20 bg-white text-ink"
                        : "border border-brand/20 bg-white text-ink hover:bg-brand-surface"
                    }`}
                  >
                    Prev
                  </Link>
                  <Link
                    href={`/admin?page=${Math.min(totalPages, safePage + 1)}`}
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      safePage >= totalPages
                        ? "pointer-events-none opacity-50 border border-brand/20 bg-white text-ink"
                        : "border border-brand/20 bg-white text-ink hover:bg-brand-surface"
                    }`}
                  >
                    Next
                  </Link>
                </div>
              </div>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
