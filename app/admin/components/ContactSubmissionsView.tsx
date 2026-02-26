import Link from "next/link";
import { clearSubmissionsAction } from "@/app/admin/actions";

export function ContactSubmissionsView({
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
            <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
                            Kontakt
                        </div>
                        <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">
                            Formular-Eingaben
                        </h2>
                        <p className="mt-0.5 text-sm font-semibold text-slate-500">
                            {total} Leads gesamt
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/admin/submissions?format=csv"
                            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-brand hover:text-brand"
                        >
                            CSV exportieren
                        </Link>
                        <form action={clearSubmissionsAction}>
                            <input type="hidden" name="view" value="contact" />
                            <button
                                type="submit"
                                className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-black"
                            >
                                Alle löschen
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
                    <div className="max-h-[600px] overflow-auto">
                        {submissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                                <p className="text-slate-400 font-medium">Noch keine Eingaben.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 z-[1] bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Datum</th>
                                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">E-Mail</th>
                                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Telefon</th>
                                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Nachricht</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pageItems.map((s: any, i) => (
                                        <tr
                                            key={s.id}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-600">
                                                {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-900">
                                                {s.name || "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-brand-cta">
                                                {s.email || "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                                                {s.tel || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 max-w-xs break-words">
                                                {s.message || "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {total > pageSize && (
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400">Seite {safePage} von {totalPages}</p>
                        <div className="flex gap-2">
                            <Link
                                href={`/admin?view=contact-info&page=${Math.max(1, safePage - 1)}`}
                                className={`px-3 py-1 rounded border text-xs font-bold ${safePage <= 1 ? "opacity-50 pointer-events-none bg-slate-100" : "bg-white hover:border-[--brand]"}`}
                            >
                                Zurück
                            </Link>
                            <Link
                                href={`/admin?view=contact-info&page=${Math.min(totalPages, safePage + 1)}`}
                                className={`px-3 py-1 rounded border text-xs font-bold ${safePage >= totalPages ? "opacity-50 pointer-events-none bg-slate-100" : "bg-white hover:border-[--brand]"}`}
                            >
                                Weiter
                            </Link>
                        </div>
                    </div>
                )}

            </article>
        </div>
    );
}
