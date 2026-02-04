import { saveSiteQuickAction } from "@/app/admin/actions";
import { SettingsImageInput } from "../SettingsImageInput";

export function SeoView({ site }: { site: any }) {
    return (
        <form action={saveSiteQuickAction} className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">SEO & Branding Settings</h2>
                <button className="rounded-full bg-[--brand-cta] px-6 py-2 text-sm font-bold text-white shadow-md hover:opacity-90 transition">
                    Save Changes
                </button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Global SEO</h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Website Title</label>
                        <input
                            name="seoTitle"
                            defaultValue={site.seo?.title ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                            placeholder="e.g. Der Cleaner"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Meta Description</label>
                        <textarea
                            name="seoDescription"
                            rows={3}
                            defaultValue={site.seo?.description ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                            placeholder="Brief description for search engines..."
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Branding</h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Brand Name</label>
                        <input
                            name="brandingName"
                            defaultValue={site.branding?.name ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <SettingsImageInput
                            label="Brand Logo"
                            name="brandingLogoSrc"
                            initialValue={site.branding?.logo?.src ?? ""}
                        />
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Logo Alt Text</label>
                            <input
                                name="brandingLogoAlt"
                                defaultValue={site.branding?.logo?.alt ?? ""}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
