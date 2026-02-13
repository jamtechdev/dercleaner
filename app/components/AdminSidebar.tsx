"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";

const MENU_ITEMS = [
    {
        category: "Dashboard",
        items: [
            { id: "dashboard", label: "Dashboard", href: "/admin?view=dashboard", icon: "LayoutDashboard" },
        ],
    },
    {
        category: "Webseiten-Inhalte",
        items: [
            { id: "homepage", label: "Startseite", href: "/admin?view=homepage", icon: "Home" },
            { id: "features", label: "Funktionen", href: "/admin?view=features", icon: "Layout" },
            { id: "about", label: "Über uns", href: "/admin?view=about", icon: "Info" },
            { id: "products", label: "Dienstleistungen / Produkte", href: "/admin?view=products", icon: "Package" },
            { id: "testimonials", label: "Kundenstimmen (FAQ)", href: "/admin?view=faq", icon: "MessageSquareQuote" },
            { id: "media", label: "Banner & Medien", href: "/admin?view=media", icon: "Image" },
            { id: "contact", label: "Kontaktinformationen", href: "/admin?view=contact-info", icon: "Phone" },
        ],
    },
    {
        category: "Seiten",
        items: [
            { id: "legal", label: "Rechtliche Seiten", href: "/admin?view=legal", icon: "FileText" },
        ],
    },
    {
        category: "System",
        items: [
            { id: "navigation", label: "Navigationsmenü", href: "/admin?view=navigation", icon: "Menu" },
            { id: "settings", label: "Einstellungen", href: "/admin?view=settings", icon: "Settings" },
        ],
    },
];

export function AdminSidebar({ isOpen, mobileClose }: { isOpen: boolean; mobileClose: () => void }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentView = searchParams.get("view") || "dashboard";

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={mobileClose}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-30 w-64 transform bg-white border-r border-slate-100 transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 border-b border-slate-100 px-6">
                        <span className="text-xl font-bold text-cyan-500">
                            Adminbereich
                        </span>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 py-6 px-3 space-y-8">
                        {MENU_ITEMS.map((group, idx) => (
                            <div key={idx}>
                                <p className="px-3 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {group.category}
                                </p>
                                <div className="space-y-1">
                                    {group.items.map((item) => {
                                        const isActive = currentView === item.id || (item.id === "dashboard" && !searchParams.get("view"));

                                        return (
                                            <Link
                                                key={item.id}
                                                href={item.href}
                                                onClick={mobileClose}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                                    ? "bg-brand text-white shadow-md shadow-brand/20"
                                                    : "text-slate-600 hover:bg-brand-soft hover:text-brand"
                                                    }`}
                                            >
                                                <Icon name={item.icon} className={isActive ? "text-white" : "text-slate-400 group-hover:text-brand"} />
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Logout (Bottom) */}
                    <div className="p-4 border-t border-slate-100">
                        <form action={logoutAction}>
                            <button type="submit" className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                                <Icon name="LogOut" className="text-slate-400 group-hover:text-red-600" />
                                Abmelden
                            </button>
                        </form>
                    </div>
                </div>
            </aside>
        </>
    );
}

// Simple Icon Component to avoid large dependencies if not present
function Icon({ name, className }: { name: string; className?: string }) {
    const cn = `w-5 h-5 ${className ?? ""}`;

    switch (name) {
        case "LayoutDashboard":
            return (
                <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="9" rx="1" />
                    <rect x="14" y="3" width="7" height="5" rx="1" />
                    <rect x="14" y="12" width="7" height="9" rx="1" />
                    <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
            );
        case "Layout":
            return (
                <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
            );
        case "Home":
            return (
                <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            );
        case "Info":
            return (
                <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
                </svg>
            );
        case "Package":
            return (
                <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            );
        case "MessageSquareQuote":
            return (
                <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            );
        case "Image":
            return (
                <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
            );
        case "Phone":
            return (
                <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            );
        case "FileText":
            return (
                <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
        case "Menu":
            return (
                <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            );
        case "Search":
            return (
                <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            );
        case "Settings":
            return (
                <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
            );
        case "LogOut":
            return (
                <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            );
        default:
            return null;
    }
}
