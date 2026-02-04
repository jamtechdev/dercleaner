import { requireAdmin } from "@/app/lib/adminAuth";
import { AdminShell } from "@/app/components/AdminShell";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireAdmin();

    return <AdminShell>{children}</AdminShell>;
}
