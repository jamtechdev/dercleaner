import { saveSiteQuickAction } from "@/app/admin/actions";
import { RichTextEditor } from "../RichTextEditor";

export function HomepageView({ site }: { site: any }) {
    return (
        <form action={saveSiteQuickAction} className="space-y-6 max-w-4xl">
            <input type="hidden" name="view" value="homepage" />
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Homepage Content</h2>
                <button className="rounded-full bg-brand-cta px-6 py-2 text-sm font-bold text-white shadow-md hover:opacity-90 transition">
                    Save Changes
                </button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Mission Section (Hero)</h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Hero Title</label>
                        <input
                            name="missionTitle"
                            defaultValue={site.missionSection?.hero?.title ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Hero Description</label>
                        <RichTextEditor
                            name="missionDescription"
                            defaultValue={site.missionSection?.hero?.description ?? ""}
                            placeholder="Hero description..."
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">CTA Label</label>
                        <input
                            name="missionCtaLabel"
                            defaultValue={site.missionSection?.hero?.ctaLabel ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Industries Intro</h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Title</label>
                        <input
                            name="missionIndustriesTitle"
                            defaultValue={site.missionSection?.industriesIntro?.title ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Description</label>
                        <RichTextEditor
                            name="missionIndustriesDescription"
                            defaultValue={site.missionSection?.industriesIntro?.description ?? ""}
                            placeholder="Industries description..."
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
