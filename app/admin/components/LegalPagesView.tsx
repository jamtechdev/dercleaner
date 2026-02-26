"use client";

import { useState } from "react";
import { saveSiteQuickAction } from "@/app/admin/actions";
import { RichTextEditor } from "../RichTextEditor";

type LegalPageKey = "imprint" | "terms" | "privacy";

export function LegalPagesView({ site }: { site: any }) {
    const [editingPage, setEditingPage] = useState<LegalPageKey | null>(null);

    const pages = [
        { key: "imprint" as LegalPageKey, label: "Imprint (Impressum)", data: site.legalPages?.imprint },
        { key: "terms" as LegalPageKey, label: "Terms & Conditions (AGB)", data: site.legalPages?.terms },
        { key: "privacy" as LegalPageKey, label: "Privacy Policy (Datenschutz)", data: site.legalPages?.privacy },
    ];

    if (!editingPage) {
        return (
            <div className="space-y-6 max-w-5xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Rechtliche Seiten</h2>
                </div>

                <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Seite</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Titel</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Zuletzt aktualisiert</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pages.map((page) => (
                                <tr key={page.key} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-700">{page.label}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{page.data?.title || "—"}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{page.data?.lastUpdated || "—"}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setEditingPage(page.key)}
                                            className="inline-flex items-center gap-2 rounded-lg bg-brand-soft px-4 py-2 text-sm font-bold text-brand hover:bg-brand hover:text-white transition-all shadow-sm shadow-brand/10"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            Inhalt bearbeiten
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    const currentPageObject = pages.find(p => p.key === editingPage)!;
    const pageData = currentPageObject.data || { title: "", lastUpdated: "", content: "" };

    return (
        <form action={saveSiteQuickAction} className="space-y-6 max-w-5xl">
            <input type="hidden" name="view" value="legal" />
            <input type="hidden" name="editingPage" value={editingPage} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setEditingPage(null)}
                        className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Bearbeiten: {currentPageObject.label}</h2>
                        <p className="text-xs text-slate-500">Datenschutz und rechtliche Angaben aktualisieren.</p>
                    </div>
                </div>
                <button type="submit" className="rounded-full bg-brand-cta px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-cta/20 hover:opacity-90 transition transform hover:-translate-y-0.5 active:translate-y-0">
                    Änderungen speichern
                </button>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Interner Titel</label>
                        <input
                            name={`${editingPage}Title`}
                            defaultValue={pageData.title}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Datum der letzten Aktualisierung</label>
                        <input
                            name={`${editingPage}LastUpdated`}
                            defaultValue={pageData.lastUpdated}
                            placeholder="z. B. Januar 2026"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Seiteninhalt (HTML/Fließtext)</label>
                    <RichTextEditor
                        name={`${editingPage}Content`}
                        defaultValue={pageData.content}
                        placeholder="Inhalt hier eingeben..."
                    />
                </div>
            </div>
        </form>
    );
}
