"use client";

import { useState } from "react";
import { saveSiteQuickAction } from "@/app/admin/actions";
import { RichTextEditor } from "../RichTextEditor";

export function FaqView({ site }: { site: any }) {
    const [items, setItems] = useState(site.faqSection?.items || [
        { question: "", answer: "" }
    ]);

    const addItem = () => {
        setItems([...items, { question: "", answer: "" }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_: any, i: number) => i !== index));
    };

    return (
        <form action={saveSiteQuickAction} className="space-y-6 max-w-4xl">
            <input type="hidden" name="view" value="faq" />
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">FAQ / Testimonials</h2>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={addItem}
                        className="rounded-full bg-slate-800 px-6 py-2 text-sm font-bold text-white shadow-md hover:bg-slate-700 transition"
                    >
                        + Add Item
                    </button>
                    <button type="submit" className="rounded-full bg-brand-cta px-6 py-2 text-sm font-bold text-white shadow-md hover:opacity-90 transition">
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Section Header</h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Title</label>
                        <input
                            name="faqTitle"
                            defaultValue={site.faqSection?.title ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Subtitle</label>
                        <input
                            name="faqSubtitle"
                            defaultValue={site.faqSection?.subtitle ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Contact Button Label</label>
                        <input
                            name="faqContactLabel"
                            defaultValue={site.faqSection?.contactButtonLabel ?? ""}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-4 text-base font-bold text-slate-800">Items (Questions or Testimonials)</h3>
                <div className="space-y-6">
                    {items.map((item: any, i: number) => (
                        <div key={i} className="flex flex-col gap-4 p-6 bg-slate-50 rounded-xl border border-slate-100 relative group">
                            <button
                                type="button"
                                onClick={() => removeItem(i)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                                title="Remove Item"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                            </button>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Question / Name</label>
                                <input
                                    name={`faqQuestion_${i}`}
                                    defaultValue={item.question ?? ""}
                                    placeholder="Question / Name"
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium focus:border-brand focus:ring-1 focus:ring-brand"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase text-slate-400">Answer / Content</label>
                                <RichTextEditor
                                    name={`faqAnswer_${i}`}
                                    defaultValue={item.answer ?? ""}
                                    placeholder="Answer / Content"
                                />
                            </div>
                        </div>
                    ))}

                    {items.length === 0 && (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-400 text-sm">No items added yet. Click "+ Add Item" to start.</p>
                        </div>
                    )}

                    <div className="mt-4 flex justify-center">
                        <button
                            type="button"
                            onClick={addItem}
                            className="flex items-center gap-2 rounded-full border-2 border-dashed border-slate-200 px-8 py-3 text-sm font-bold text-slate-400 hover:border-brand hover:text-brand transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Add Another Item
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
