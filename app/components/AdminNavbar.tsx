"use client";

export function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-4 backdrop-blur-md lg:px-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Search Bar (Hidden on small mobile) */}
                <div className="hidden sm:block relative w-64">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 pl-10 text-black placeholder:text-slate-500 pr-4 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>

                {/* Profile Dropdown (Simplified as Avatar) */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm text-brand-cta font-bold">Admin</p>
                        <p className="text-xs text-slate-500">Super Admin</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-brand-soft border border-brand/20 flex items-center justify-center text-brand font-bold">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
}
