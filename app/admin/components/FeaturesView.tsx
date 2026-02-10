"use client";

import { useState } from "react";
import { saveSiteQuickAction } from "@/app/admin/actions";

export function FeaturesView({ site }: { site: any }) {
    const [features, setFeatures] = useState(site.featuresSection?.features || [
        { title: "", icon: "", text: "", colorClass: "" }
    ]);

    const addFeature = () => {
        setFeatures([...features, { title: "", icon: "", text: "", colorClass: "" }]);
    };

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_: any, i: number) => i !== index));
    };

    return (
        <form action={saveSiteQuickAction} className="space-y-6 max-w-4xl">
            <input type="hidden" name="view" value="features" />
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Features Section</h2>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={addFeature}
                        className="rounded-full bg-slate-800 px-6 py-2 text-sm font-bold text-white shadow-md hover:bg-slate-700 transition"
                    >
                        + Add Feature
                    </button>
                    <button type="submit" className="rounded-full bg-brand-cta px-6 py-2 text-sm font-bold text-white shadow-md hover:opacity-90 transition">
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Manage Features</h3>
                <p className="mb-6 text-sm text-slate-500">Edit the key features shown on the homepage. You can now add as many as you need.</p>

                <div className="space-y-8">
                    {features.map((feature: any, i: number) => (
                        <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group">
                            <button
                                type="button"
                                onClick={() => removeFeature(i)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                                title="Remove Feature"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                            </button>

                            <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Feature {i + 1}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Title</label>
                                    <input
                                        name={`featureTitle_${i}`}
                                        defaultValue={feature.title}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Icon URL (SVG path)</label>
                                    <input
                                        name={`featureIcon_${i}`}
                                        defaultValue={feature.icon}
                                        placeholder="/images/icon.svg"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Description</label>
                                <textarea
                                    name={`featureText_${i}`}
                                    rows={2}
                                    defaultValue={feature.text}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                                />
                            </div>
                            <input type="hidden" name={`featureColor_${i}`} value={feature.colorClass ?? ""} />
                        </div>
                    ))}
                </div>

                {features.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-400 text-sm">No features added yet. Click "+ Add Feature" to start.</p>
                    </div>
                )}

                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={addFeature}
                        className="flex items-center gap-2 rounded-full border-2 border-dashed border-slate-200 px-8 py-3 text-sm font-bold text-slate-400 hover:border-brand hover:text-brand transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Add Another Feature
                    </button>
                </div>
            </div>
        </form>
    );
}
