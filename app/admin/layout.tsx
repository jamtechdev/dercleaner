import { requireAdmin } from "@/app/lib/adminAuth";
import { AdminShell } from "@/app/components/AdminShell";
import { ToastListener } from "@/app/admin/components/ToastListener";
import { Suspense } from "react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireAdmin();

    return (
        <AdminShell>
            <Suspense fallback={null}>
                <ToastListener />
            </Suspense>
            {children}
        </AdminShell>
    );
}
