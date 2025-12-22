import Link from "next/link";
import { loginAction } from "@/app/admin/actions";
import { getSite } from "@/app/lib/site";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const site = await getSite();
  const sp = (await searchParams) ?? {};
  const error = sp.error;

  return (
    <main className="min-h-[70svh] bg-white grid place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-brand/10 bg-white shadow-sm">
        <div className="rounded-3xl bg-brand-surface p-6 border-b border-brand/10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand/80">
            {site.branding.name}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-ink">
            Admin-Anmeldung
          </h1>
          <p className="mt-1 text-sm font-semibold text-gray-600">
            Melden Sie sich an, um Website-Inhalte zu verwalten.
          </p>
        </div>

        <div className="p-6">
          {error ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              Falscher Benutzername oder Passwort.
            </div>
          ) : null}

          <form action={loginAction} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-ink mb-1">
                Benutzername
              </label>
              <input
                name="username"
                className="w-full rounded-xl border border-brand/15 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-brand"
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink mb-1">
                Passwort
              </label>
              <input
                name="password"
                type="password"
                className="w-full rounded-xl border border-brand/15 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-brand"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button className="w-full rounded-full bg-brand-cta px-5 py-3 text-sm font-extrabold text-white shadow-sm transition-opacity hover:opacity-90">
              Anmelden
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between">
            <Link
              href="/"
              className="text-sm font-bold text-brand hover:opacity-80"
            >
              ← Zurück zur Website
            </Link>
            <Link
              href="/impressum"
              className="text-sm font-semibold text-gray-500 hover:text-gray-700"
            >
              Rechtliches
            </Link>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-gray-500">
            Setzen Sie <code className="font-mono">ADMIN_USERNAME</code> und{" "}
            <code className="font-mono">ADMIN_PASSWORD</code> in Ihrer Umgebung
            für die Produktion.
          </p>
        </div>
      </div>
    </main>
  );
}
