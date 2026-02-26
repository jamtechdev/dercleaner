import { saveSiteQuickAction } from "@/app/admin/actions";

export function NavigationView({ site }: { site: any }) {
    const links = site.navigation?.links || [];

    return (
        <form action={saveSiteQuickAction} className="space-y-6 max-w-4xl">
            <input type="hidden" name="view" value="navigation" />
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Navigationsmenü</h2>
                <button className="rounded-full bg-brand-cta px-6 py-2 text-sm font-bold text-white shadow-md hover:opacity-90 transition">
                    Änderungen speichern
                </button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Menülinks</h3>
                <p className="mb-4 text-sm text-slate-500">Bearbeiten Sie die Links in der Kopfzeile der Website.</p>

                <div className="space-y-4">
                    {links.map((link: any, i: number) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 items-center">
                            <div className="flex-1 w-full">
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Bezeichnung {i + 1}</label>
                                <input
                                    name={`navLabel_${i}`}
                                    defaultValue={link.label ?? ""}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-400">URL {i + 1}</label>
                                <input
                                    name={`navHref_${i}`}
                                    defaultValue={link.href ?? ""}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                                    placeholder="/#section"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </form>
    );
}
