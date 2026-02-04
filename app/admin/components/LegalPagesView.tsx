import { saveSiteQuickAction } from "@/app/admin/actions";
import { RichTextEditor } from "../RichTextEditor";

export function LegalPagesView({ site }: { site: any }) {
    const impressum = site.legalPages?.imprint ?? { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
    const agb = site.legalPages?.terms ?? { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
    const datenschutz = site.legalPages?.privacy ?? { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };

    return (
        <form action={saveSiteQuickAction} className="grid grid-cols-1 gap-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Legal Pages</h2>
                <button className="rounded-full bg-[--brand-cta] px-6 py-2 text-sm font-bold text-white shadow-md hover:opacity-90 transition">
                    Save Changes
                </button>
            </div>

            <input type="hidden" name="view" value="legal" />

            {/* Impressum Section */}
            <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-base font-extrabold tracking-tight text-slate-900 border-b border-slate-100 pb-4 mb-4">
                    Imprint (Impressum)
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Title</label>
                            <input
                                name="impressumTitle"
                                defaultValue={impressum.title ?? ""}
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Last Updated</label>
                            <input
                                name="impressumLastUpdated"
                                defaultValue={impressum.lastUpdated ?? ""}
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Content</label>
                        <div className="mt-2">
                            <RichTextEditor
                                name="impressumContent"
                                defaultValue={impressum.content ?? ""}
                                placeholder="Enter imprint content here..."
                            />
                        </div>
                    </div>
                </div>
            </article>

            {/* AGB Section */}
            <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-base font-extrabold tracking-tight text-slate-900 border-b border-slate-100 pb-4 mb-4">
                    Terms & Conditions (AGB)
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Title</label>
                            <input
                                name="agbTitle"
                                defaultValue={agb.title ?? ""}
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Last Updated</label>
                            <input
                                name="agbLastUpdated"
                                defaultValue={agb.lastUpdated ?? ""}
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Content</label>
                        <div className="mt-2">
                            <RichTextEditor
                                name="agbContent"
                                defaultValue={agb.content ?? ""}
                                placeholder="Enter terms content here..."
                            />
                        </div>
                    </div>
                </div>
            </article>

            {/* Datenschutz Section */}
            <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-base font-extrabold tracking-tight text-slate-900 border-b border-slate-100 pb-4 mb-4">
                    Privacy Policy (Datenschutz)
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Title</label>
                            <input
                                name="datenschutzTitle"
                                defaultValue={datenschutz.title ?? ""}
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Last Updated</label>
                            <input
                                name="datenschutzLastUpdated"
                                defaultValue={datenschutz.lastUpdated ?? ""}
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Content</label>
                        <div className="mt-2">
                            <RichTextEditor
                                name="datenschutzContent"
                                defaultValue={datenschutz.content ?? ""}
                                placeholder="Enter privacy content here..."
                            />
                        </div>
                    </div>
                </div>
            </article>
        </form>
    );
}
