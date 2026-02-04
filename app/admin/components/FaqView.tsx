import { saveSiteQuickAction } from "@/app/admin/actions";

export function FaqView({ site }: { site: any }) {
    const items = site.faqSection?.items || [];

    return (
        <form action={saveSiteQuickAction} className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">FAQ / Testimonials</h2>
                <button className="rounded-full bg-[--brand-cta] px-6 py-2 text-sm font-bold text-white shadow-md hover:opacity-90 transition">
                    Save Changes
                </button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Section Header</h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Title</label>
                        <input
                            name="faqTitle"
                            defaultValue={site.faqSection?.title ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Subtitle</label>
                        <input
                            name="faqSubtitle"
                            defaultValue={site.faqSection?.subtitle ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Contact Button Label</label>
                        <input
                            name="faqContactLabel"
                            defaultValue={site.faqSection?.contactButtonLabel ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Items (Questions or Testimonials)</h3>
                <div className="space-y-4">
                    {items.map((item: any, i: number) => (
                        <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <input
                                name={`faqQuestion_${i}`}
                                defaultValue={item.question ?? ""}
                                placeholder="Question / Name"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                            />
                            <textarea
                                name={`faqAnswer_${i}`}
                                rows={2}
                                defaultValue={item.answer ?? ""}
                                placeholder="Answer / Content"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                            />
                        </div>
                    ))}
                    {/* Add New Slot */}
                    <div className="flex flex-col gap-2 p-4 bg-white border border-dashed border-slate-300 rounded-xl">
                        <p className="text-xs font-bold text-slate-400 uppercase">Add New Item</p>
                        <input
                            name={`faqQuestion_${items.length}`}
                            placeholder="Question / Name"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                        />
                        <textarea
                            name={`faqAnswer_${items.length}`}
                            rows={2}
                            placeholder="Answer / Content"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
