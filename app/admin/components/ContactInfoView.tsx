import { saveSiteQuickAction } from "@/app/admin/actions";
import { RichTextEditor } from "../RichTextEditor";

export function ContactInfoView({ site }: { site: any }) {
    return (
        <form action={saveSiteQuickAction} className="space-y-6 max-w-4xl">
            <input type="hidden" name="view" value="contact-info" />
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Contact Information</h2>
                <button className="rounded-full bg-brand-cta px-6 py-2 text-sm font-bold text-white shadow-md hover:opacity-90 transition">
                    Save Changes
                </button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Contact Section Details</h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Section Title</label>
                        <input
                            name="contactTitle"
                            defaultValue={site.contactSection?.title ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Subtitle</label>
                        <input
                            name="contactSubtitle"
                            defaultValue={site.contactSection?.subtitle ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Primary Email</label>
                            <input
                                name="contactEmail1"
                                type="email"
                                defaultValue={site.contactSection?.contactInfo?.firstContact?.email ?? ""}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Support Email</label>
                            <input
                                name="contactEmail2"
                                type="email"
                                defaultValue={site.contactSection?.contactInfo?.customerSupport?.email ?? ""}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Phone Number</label>
                            <input
                                name="contactPhone"
                                type="tel"
                                defaultValue={site.contactSection?.contactInfo?.phone?.number ?? ""}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Privacy Notice Text</label>
                        <RichTextEditor
                            name="contactPrivacy"
                            defaultValue={site.contactSection?.privacyText ?? ""}
                            placeholder="Privacy notice text..."
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
