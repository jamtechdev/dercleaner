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
import { FeaturesView } from "@/app/admin/components/FeaturesView";

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
      {/* Main Content Render */}
      {view === "dashboard" && (() => {
        // Growth Calculation (Current week vs Last week)
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const thisWeekLeads = submissions.filter(s => s.createdAt && new Date(s.createdAt) > oneWeekAgo).length;
        const lastWeekLeads = submissions.filter(s => s.createdAt && new Date(s.createdAt) <= oneWeekAgo && new Date(s.createdAt) > twoWeeksAgo).length;

        let growth = 0;
        if (lastWeekLeads === 0) {
          growth = thisWeekLeads > 0 ? 100 : 0;
        } else {
          growth = Math.round(((thisWeekLeads - lastWeekLeads) / lastWeekLeads) * 100);
        }

        // Optimization Score Calculation (0-100)
        const sections = [
          site.branding?.name,
          site.seo?.metaTitle,
          site.homepage?.hero?.title,
          site.featuresSection?.features?.length > 0,
          site.aboutSection?.title,
          totalProducts > 0, // Products count as a section being used
          site.faqSection?.items?.length > 0,
          site.contactSection?.email,
          site.legalPages?.imprint?.content,
          site.legalPages?.privacy?.content
        ];
        const fulfilled = sections.filter(Boolean).length;
        const score = Math.round((fulfilled / sections.length) * 100);

        return (
          <DashboardView
            siteName={site.branding?.name ?? "Admin Panel"}
            totalContacts={submissions.length}
            totalProducts={totalProducts}
            recentLeads={submissions.slice(-5).reverse()}
            leadsLast24h={submissions.filter(s => {
              if (!s.createdAt) return false;
              const d = new Date(s.createdAt);
              return (now.getTime() - d.getTime()) < 24 * 60 * 60 * 1000;
            }).length}
            growthPercentage={growth}
            optimizationScore={score}
          />
        );
      })()}

      {/* Website Content */}
      {view === "homepage" && <HomepageView site={site} />}
      {view === "features" && <FeaturesView site={site} />}
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
