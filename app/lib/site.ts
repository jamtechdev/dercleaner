import { initializeDatabase } from "@/app/database/data-source";
import { ContactSubmissionRepository } from "@/app/database/repositories/ContactSubmissionRepository";
import { SiteConfigRepository } from "@/app/database/repositories/SiteConfigRepository";
import { ProductRepository } from "@/app/database/repositories/ProductRepository";

// Initialize database connection
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

// Helper function to convert Product entity to plain object
function productToPlainObject(product: any): any {
  return {
    id: product.id,
    name: product.name,
    tabTitle: product.tabTitle,
    tabDesc: product.tabDesc,
    tabImage: product.tabImage,
    heroImage: product.heroImage,
    video: product.video,
    featuresImage: product.featuresImage,
    savingsTitle: product.savingsTitle,
    savingsSubtitle: product.savingsSubtitle,
    stats: product.stats,
    description: product.description,
    technicalSpecs: product.technicalSpecs,
    features: product.features,
    displayOrder: product.displayOrder,
    createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : product.createdAt,
    updatedAt: product.updatedAt instanceof Date ? product.updatedAt.toISOString() : product.updatedAt,
  };
}

export async function getSite(): Promise<any> {
  await ensureDbInitialized();
  const repo = new SiteConfigRepository();
  const config = await repo.getConfig();

  // Get products from database and convert to plain objects
  const productRepo = new ProductRepository();
  const products = await productRepo.findAll();
  const plainProducts = products.map(productToPlainObject);

  // If no config exists, return empty structure
  if (!config) {
    return {
      seo: { title: "", description: "" },
      branding: { name: "", logo: { src: "", alt: "" } },
      navigation: { links: [] },
      videoSection: { youtubeUrl: "", videoFileUrl: "" },
      bannerSection: { title: "Höchste Effizienz für Ihre Reinigung", subtitle: "Entdecken Sie die Zukunft der professionellen Bodenreinigung mit unseren innovativen Lösungen.", ctaLabel: "Produkte ansehen", ctaLink: "#produkte", backgroundImage: "/banner-bg.png" },
      productsSection: { actions: { techDataLabel: "", demoLabel: "" }, products: plainProducts },
      faqSection: { title: "", subtitle: "", contactButtonLabel: "", items: [] },
      missionSection: { hero: { title: "", description: "", ctaLabel: "" }, industriesIntro: { title: "", description: "" }, industries: [] },
      featuresSection: { features: [] },
      aboutSection: { title: "", content: "", image: { src: "", alt: "" } },
      contactSection: { title: "", subtitle: "", contactInfo: { firstContact: { email: "" }, customerSupport: { email: "" }, phone: { number: "" } }, privacyText: "" },
      footer: { information: { title: "", links: [] }, legal: { title: "", links: [] } },
      legalPages: {
        imprint: { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" },
        terms: { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" },
        privacy: { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" },
      },
    };
  }

  // Merge products from database into config (as plain objects)
  config.productsSection = config.productsSection || { actions: { techDataLabel: "", demoLabel: "" }, products: [] };
  config.productsSection.products = plainProducts;

  return config;
}

export async function saveSite(nextSite: unknown): Promise<void> {
  await ensureDbInitialized();
  const repo = new SiteConfigRepository();
  await repo.saveConfig(nextSite);
}

export async function saveSiteFromString(jsonString: string): Promise<any> {
  const parsed = JSON.parse(jsonString);
  await saveSite(parsed);
  return parsed;
}

export async function getContactSubmissions(): Promise<any[]> {
  await ensureDbInitialized();
  const repo = new ContactSubmissionRepository();
  const submissions = await repo.findAll();

  // Convert to format expected by existing code
  return submissions.map((s) => ({
    id: s.id,
    createdAt: s.createdAt.toISOString(),
    name: s.name,
    email: s.email,
    tel: s.tel || "",
    message: s.message,
  }));
}

export async function clearContactSubmissions(): Promise<void> {
  await ensureDbInitialized();
  const repo = new ContactSubmissionRepository();
  await repo.deleteAll();
}
