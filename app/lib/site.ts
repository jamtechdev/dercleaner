import { initializeDatabase } from "@/app/database/data-source";
import { ContactSubmissionRepository } from "@/app/database/repositories/ContactSubmissionRepository";
import { SiteConfigRepository } from "@/app/database/repositories/SiteConfigRepository";

// Initialize database connection
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

export async function getSite(): Promise<any> {
  await ensureDbInitialized();
  const repo = new SiteConfigRepository();
  const config = await repo.getConfig();
  
  // If no config exists, return empty structure
  if (!config) {
    return {
      seo: { title: "", description: "" },
      branding: { name: "", logo: { src: "", alt: "" } },
      navigation: { links: [] },
      videoSection: { youtubeUrl: "", videoFileUrl: "" },
      productsSection: { actions: { techDataLabel: "", demoLabel: "" }, products: [] },
      faqSection: { title: "", subtitle: "", contactButtonLabel: "", items: [] },
      missionSection: { hero: { title: "", description: "", ctaLabel: "" }, industriesIntro: { title: "", description: "" }, industries: [] },
      featuresSection: { features: [] },
      aboutSection: { title: "", paragraphs: [] },
      contactSection: { title: "", subtitle: "", contactInfo: { firstContact: { email: "" }, customerSupport: { email: "" }, phone: { number: "" } }, privacyText: "" },
      footer: { information: { title: "", links: [] }, legal: { title: "", links: [] } },
      legalPages: {
        imprint: { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" },
        terms: { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" },
        privacy: { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" },
      },
    };
  }
  
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
