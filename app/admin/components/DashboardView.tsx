"use client";

import Link from "next/link";

interface DashboardViewProps {
    siteName: string;
    totalContacts: number;
    totalProducts: number;
    recentLeads: any[];
    leadsLast24h: number;
    growthPercentage: number;
    optimizationScore: number;
}

export function DashboardView({
    siteName,
    totalContacts,
    totalProducts,
    recentLeads,
    leadsLast24h,
    growthPercentage,
    optimizationScore
}: DashboardViewProps) {
    const stats = [
        { label: "Leads gesamt", value: totalContacts, icon: "Users", color: "text-emerald-600", bg: "bg-emerald-50", desc: "Leads gesamt" },
        { label: "Neue Leads (24h)", value: leadsLast24h, icon: "TrendingUp", color: "text-blue-600", bg: "bg-blue-50", desc: "Seit gestern" },
        { label: "Aktive Dienstleistungen", value: totalProducts, icon: "Package", color: "text-purple-600", bg: "bg-purple-50", desc: "Produkte live" },
        { label: "Status", value: "Online", icon: "Globe", color: "text-brand-cta", bg: "bg-orange-50", desc: "System in Ordnung" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Willkommen, Admin! 👋</h1>
                    <p className="text-slate-500 font-medium italic">Sie verwalten gerade <span className="text-brand font-black not-italic">{siteName}</span></p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                                <Icon name="Users" className="w-5 h-5 text-slate-400 opacity-50" />
                            </div>
                        ))}
                    </div>
                    <div className="text-xs font-bold text-slate-400">System live und sicher</div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-[32px] bg-white p-7 shadow-sm border border-slate-100 transition-all hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1">
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{stat.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
                                    <span className="text-[10px] font-bold text-slate-400">{stat.desc}</span>
                                </div>
                            </div>
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm`}>
                                <Icon name={stat.icon} className="h-8 w-8" />
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-slate-50 group-hover:bg-slate-100 transition-colors" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Leads Table */}
                <div className="lg:col-span-2 rounded-[32px] bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                    <div className="flex items-center justify-between border-b border-slate-50 px-8 py-7 bg-slate-50/20">
                        <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse ring-4 ring-blue-50" />
                            <h3 className="font-black text-slate-800 tracking-tight text-lg">Letzte Anfragen</h3>
                        </div>
                        <Link href="/admin?view=contact-info" className="group flex items-center gap-2 text-xs font-black text-brand hover:text-brand-cta transition-all uppercase tracking-widest bg-brand-soft px-4 py-2 rounded-xl">
                            Alle Berichte
                            <Icon name="ChevronRight" className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="flex-1">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        <th className="px-8 py-5">Kunde</th>
                                        <th className="px-8 py-5">Kontakt</th>
                                        <th className="px-8 py-5">Eingang</th>
                                        <th className="px-8 py-5 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentLeads.length > 0 ? recentLeads.map((lead, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-all group cursor-default">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-500 group-hover:from-brand group-hover:to-brand-cta group-hover:text-white transition-all duration-300 shadow-sm">
                                                        {(lead.name || "C")[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-800 tracking-tight text-base">{lead.name || "Kunde"}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Geschäftskontakt</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-slate-600 text-sm">{lead.email}</div>
                                                <div className="text-[11px] text-slate-400 font-bold mt-1 inline-flex items-center gap-1">
                                                    <Icon name="Phone" className="w-3 h-3" />
                                                    {lead.tel || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-slate-500 text-xs font-black">
                                                {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('de-DE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Gerade eben'}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="inline-flex items-center rounded-xl bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">Neu</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-32 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-20">
                                                    <Icon name="Users" className="h-16 w-16 text-slate-400" />
                                                    <p className="font-black uppercase text-sm tracking-[0.3em] text-slate-600">Keine eingehenden Leads</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Performance & Shortcuts Column */}
                <div className="space-y-8">
                    {/* Setup Card */}
                    <div className="rounded-[32px] bg-indigo-600 p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                        <div className="relative z-10">
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                                <Icon name="TrendingUp" className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight mb-3">Website-Status 📈</h3>
                            <p className="text-indigo-100 text-sm mb-8 leading-relaxed font-medium">Ihre Website liegt {growthPercentage >= 0 ? '+' : ''}{growthPercentage}% {growthPercentage >= 0 ? 'besser' : 'schlechter'} als letzte Woche.</p>

                            <div className="space-y-4">
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-1000" style={{ width: `${optimizationScore}%` }} />
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-200">
                                    <span>Optimierung</span>
                                    <span>{optimizationScore}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
                    </div>

                    {/* Quick Shortcuts */}
                    <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-300 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black tracking-tight mb-6 uppercase tracking-[0.1em] text-slate-400 text-xs">Schnellzugriff</h3>

                            <div className="space-y-4">
                                <Link href="/admin?view=homepage" className="flex items-center justify-between p-5 rounded-[24px] bg-white/[0.03] hover:bg-white/[0.08] transition-all border border-white/10 group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                            <Icon name="Globe" className="w-5 h-5" />
                                        </div>
                                        <span className="font-black text-sm tracking-tight text-slate-200">Startseite</span>
                                    </div>
                                    <Icon name="ChevronRight" className="w-4 h-4 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </Link>
                                <Link href="/admin?view=products" className="flex items-center justify-between p-5 rounded-[24px] bg-white/[0.03] hover:bg-white/[0.08] transition-all border border-white/10 group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                            <Icon name="Package" className="w-5 h-5" />
                                        </div>
                                        <span className="font-black text-sm tracking-tight text-slate-200">Dienstleistungen</span>
                                    </div>
                                    <Icon name="ChevronRight" className="w-4 h-4 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </Link>
                                <Link href="/admin?view=contact-info" className="flex items-center justify-between p-5 rounded-[24px] bg-white/[0.03] hover:bg-white/[0.08] transition-all border border-white/10 group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                            <Icon name="Phone" className="w-5 h-5" />
                                        </div>
                                        <span className="font-black text-sm tracking-tight text-slate-200">Einstellungen</span>
                                    </div>
                                    <Icon name="ChevronRight" className="w-4 h-4 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </Link>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand/10 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Icon({ name, className }: { name: string; className?: string }) {
    const cn = className ?? "w-5 h-5";
    switch (name) {
        case "Users":
            return <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
        case "TrendingUp":
            return <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
        case "Package":
            return <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
        case "Globe":
            return <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>;
        case "ChevronRight":
            return <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;
        case "Phone":
            return <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
        default:
            return null;
    }
}
