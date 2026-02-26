import { saveSiteQuickAction } from "@/app/admin/actions";
import { RichTextEditor } from "../RichTextEditor";
import { SettingsImageInput } from "../SettingsImageInput";

export function AboutView({ site }: { site: any }) {
    return (
        <form action={saveSiteQuickAction} className="space-y-6 max-w-4xl">
            <input type="hidden" name="view" value="about" />
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Über-uns-Inhalte</h2>
                <button className="rounded-full bg-brand-cta px-6 py-2 text-sm font-bold text-white shadow-md hover:opacity-90 transition">
                    Änderungen speichern
                </button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Überschrift Bereich Über uns</h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Titel</label>
                        <input
                            name="aboutTitle"
                            defaultValue={site.aboutSection?.title ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Inhalt Über uns</h3>
                <RichTextEditor
                    name="aboutContent"
                    defaultValue={site.aboutSection?.content || (site.aboutSection?.paragraphs || []).join("\n\n")}
                />
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Bild Über uns</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingsImageInput
                        label="Bild Über uns"
                        name="aboutImageSrc"
                        initialValue={site.aboutSection?.image?.src ?? ""}
                    />
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Bild Alt-Text</label>
                        <input
                            name="aboutImageAlt"
                            defaultValue={site.aboutSection?.image?.alt ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
