import Link from "next/link";

interface DashboardViewProps {
    siteName: string;
    totalContacts: number;
    totalProducts: number;
    totalPages?: number; // Estimated
}

export function DashboardView({ siteName, totalContacts, totalProducts, totalPages = 6 }: DashboardViewProps) {
    const stats = [
        { label: "Total Pages", value: totalPages, icon: "FileText", color: "bg-blue-500" },
        { label: "Total Products", value: totalProducts, icon: "Package", color: "bg-purple-500" }, // Using products as sections count proxy or similar
        { label: "Total Leads", value: totalContacts, icon: "Users", color: "bg-green-500" },
        { label: "Last Updated", value: "Today", icon: "Clock", color: "bg-orange-500" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome back to {siteName} admin panel.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <div key={i} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm shadow-slate-200 transition-all hover:shadow-md hover:-translate-y-1 border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{stat.value}</p>
                            </div>
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} bg-opacity-10`}>
                                {/* Simple Icon placeholder */}
                                <div className={`h-6 w-6 rounded-full ${stat.color}`} />
                            </div>
                        </div>
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-slate-50 transition-all group-hover:bg-slate-100" />
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm shadow-slate-200">
                <div className="border-b border-slate-100 px-6 py-4">
                    <h3 className="font-bold text-slate-800">Recent Activity</h3>
                </div>
                <div className="p-6">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="text-xs font-semibold uppercase text-slate-400">
                                <th className="pb-3">Page Name</th>
                                <th className="pb-3">Updated By</th>
                                <th className="pb-3">Last Modified</th>
                                <th className="pb-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="py-3 font-medium text-slate-700">Homepage</td>
                                <td className="py-3 text-slate-500">Admin</td>
                                <td className="py-3 text-slate-500">Just now</td>
                                <td className="py-3 text-right"><span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-600">Published</span></td>
                            </tr>
                            <tr>
                                <td className="py-3 font-medium text-slate-700">Services</td>
                                <td className="py-3 text-slate-500">Admin</td>
                                <td className="py-3 text-slate-500">2 hours ago</td>
                                <td className="py-3 text-right"><span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-600">Published</span></td>
                            </tr>
                            <tr>
                                <td className="py-3 font-medium text-slate-700">About Us</td>
                                <td className="py-3 text-slate-500">Admin</td>
                                <td className="py-3 text-slate-500">Yesterday</td>
                                <td className="py-3 text-right"><span className="inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-600">Draft</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
