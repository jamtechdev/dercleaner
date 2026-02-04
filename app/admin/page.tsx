import { requireAdmin } from "@/app/lib/adminAuth";
import { getContactSubmissions, getSite } from "@/app/lib/site";
import { initializeDatabase } from "@/app/database/data-source";
import { ProductRepository } from "@/app/database/repositories/ProductRepository"; // Direct import
import { DashboardView } from "@/app/admin/components/DashboardView";
import { SeoView } from "@/app/admin/components/SeoView";
import { MediaView } from "@/app/admin/components/MediaView";
import { HomepageView } from "@/app/admin/components/HomepageView";
import { AboutView } from "@/app/admin/components/AboutView";
import { FaqView } from "@/app/admin/components/FaqView";
import { NavigationView } from "@/app/admin/components/NavigationView";
import { ContactInfoView } from "@/app/admin/components/ContactInfoView";
import { ContactSubmissionsView } from "@/app/admin/components/ContactSubmissionsView";
import { ProductsView } from "@/app/admin/components/ProductsView";
import { LegalPagesView } from "@/app/admin/components/LegalPagesView";

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{
    saved?: string;
    cleared?: string;
    error?: string;
    page?: string;
    view?: string;
  }>;
}) {
  await requireAdmin();

  const site = await getSite();
  const submissions = await getContactSubmissions();

  // Get products count for dashboard
  let totalProducts = 0;
  try {
    await initializeDatabase();
    // Using simple count if repository supports it, else finding all
    const productRepo = new ProductRepository();
    // Assuming we can get length easily
    const allProducts = await productRepo.findAll();
    totalProducts = allProducts.length;
  } catch (error) {
    console.error("Error fetching products count:", error);
  }

  const sp = (await searchParams) ?? {};
  const view = sp.view ?? "dashboard";
  const showSaved = sp.saved === "1";
  const showCleared = sp.cleared === "1";
  const showInvalidJson = sp.error === "invalid_json";

  // Pagination logic for submissions
  const currentPage = Math.max(1, Number(sp.page ?? "1") || 1);
  const pageSize = 10;
  const total = submissions.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const reversed = submissions.slice().reverse(); // Show newest first
  const pageItems = reversed.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Toast / Notification Area */}
      {(showSaved || showCleared || showInvalidJson) && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-2">
          <div
            className={[
              "rounded-xl px-4 py-3 text-sm font-bold shadow-lg border",
              showInvalidJson
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-[--brand]/20 bg-[#f1faff] text-[--brand]",
            ].join(" ")}
          >
            {showInvalidJson
              ? "Invalid JSON Data."
              : showCleared
                ? "Data cleared successfully."
                : "Changes saved successfully!"}
          </div>
        </div>
      )}

      {/* Main Content Render */}
      {view === "dashboard" && (
        <DashboardView
          siteName={site.branding?.name ?? "Admin Panel"}
          totalContacts={submissions.length}
          totalProducts={totalProducts}
        />
      )}

      {/* Website Content */}
      {view === "homepage" && <HomepageView site={site} />}
      {view === "about" && <AboutView site={site} />}
      {view === "products" && <ProductsView />}
      {view === "faq" && <FaqView site={site} />}
      {view === "media" && <MediaView site={site} />}
      {view === "contact-info" && (
        // This view can handle both the info settings AND the submissions, or we separate them.
        // User request implied "Contact Info" as separate from "Lead Submissions"?
        // Sidebar had "Contact Info" in "Website Content", so likely Settings.
        // But let's show both or tabs?
        // Let's assume "contact-info" view shows the settings form.
        <div className="space-y-12">
          <ContactInfoView site={site} />
          <ContactSubmissionsView
            submissions={submissions}
            pageItems={pageItems}
            safePage={safePage}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
          />
        </div>
      )}

      {/* System Settings */}
      {view === "navigation" && <NavigationView site={site} />}
      {view === "seo" && <SeoView site={site} />}
      {view === "settings" && (
        // General settings or redirect to SEO?
        // For now, let's reuse SEO view or create a general one later.
        // The sidebar has "Settings" at the bottom.
        // Let's show SEO + general site info there.
        <SeoView site={site} />
      )}

      {/* Fallback or Extra Views */}
      {view === "legal" && <LegalPagesView site={site} />}

    </div>
  );
}
