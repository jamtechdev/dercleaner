import { saveSiteQuickAction } from "@/app/admin/actions";

export function AboutView({ site }: { site: any }) {
    const paragraphs = site.aboutSection?.paragraphs || [];
    // Ensure at least one empty textarea if none
    const renderParagraphs = paragraphs.length > 0 ? paragraphs : [""];

    return (
        <form action={saveSiteQuickAction} className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">About Us Content</h2>
                <button className="rounded-full bg-[--brand-cta] px-6 py-2 text-sm font-bold text-white shadow-md hover:opacity-90 transition">
                    Save Changes
                </button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">About Section</h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Title</label>
                        <input
                            name="aboutTitle"
                            defaultValue={site.aboutSection?.title ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Paragraphs</label>
                        <p className="mb-2 text-xs text-slate-500">Add content blocks. Leave empty to remove.</p>
                        <div className="space-y-3">
                            {renderParagraphs.map((para: string, i: number) => (
                                <textarea
                                    key={i}
                                    name={`aboutParagraph_${i}`}
                                    rows={3}
                                    defaultValue={para}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                                    placeholder={`Paragraph ${i + 1}`}
                                />
                            ))}
                            {/* Add an extra empty one for new input if less than 10 */}
                            {renderParagraphs.length < 10 && (
                                <textarea
                                    name={`aboutParagraph_${renderParagraphs.length}`}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                                    placeholder="New Paragraph..."
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
