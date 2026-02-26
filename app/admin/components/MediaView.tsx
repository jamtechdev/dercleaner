import { saveSiteQuickAction } from "@/app/admin/actions";
import { VideoSourceSelector } from "../VideoSourceSelector";
import { SettingsImageInput } from "../SettingsImageInput";

export function MediaView({ site }: { site: any }) {
    return (
        <form action={saveSiteQuickAction} className="space-y-6 max-w-4xl">
            <input type="hidden" name="view" value="media" />
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Medien & Banner</h2>
                <button className="rounded-full bg-brand-cta px-6 py-2 text-sm font-bold text-white shadow-md hover:opacity-90 transition">
                    Änderungen speichern
                </button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Banner (oben)</h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Titel</label>
                        <input
                            name="bannerTitle"
                            defaultValue={site.bannerSection?.title ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Untertitel</label>
                        <textarea
                            name="bannerSubtitle"
                            rows={2}
                            defaultValue={site.bannerSection?.subtitle ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Button-Text</label>
                            <input
                                name="bannerCtaLabel"
                                defaultValue={site.bannerSection?.ctaLabel ?? ""}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Button-Link</label>
                            <input
                                name="bannerCtaLink"
                                defaultValue={site.bannerSection?.ctaLink ?? ""}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[--brand] focus:ring-1 focus:ring-[--brand]"
                            />
                        </div>
                    </div>
                    <SettingsImageInput
                        label="Hintergrundbild"
                        name="bannerBackgroundImage"
                        initialValue={site.bannerSection?.backgroundImage ?? ""}
                    />
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Video-Bereich</h3>
                <VideoSourceSelector
                    currentYoutubeUrl={site.videoSection?.youtubeUrl ?? ""}
                    currentVideoFileUrl={site.videoSection?.videoFileUrl ?? ""}
                />
            </div>
        </form>
    );
}
