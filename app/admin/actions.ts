"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearAdminSessionAsync,
  requireAdmin,
  setAdminSessionAsync,
} from "@/app/lib/adminAuth";
import {
  clearContactSubmissions,
  getContactSubmissions,
  getSite,
  saveSite,
  saveSiteFromString,
} from "@/app/lib/site";
import { ProductRepository } from "@/app/database/repositories/ProductRepository";
import { initializeDatabase } from "@/app/database/data-source";

function adminUser(): string {
  return process.env.ADMIN_USERNAME || "admin";
}

function adminPass(): string {
  return process.env.ADMIN_PASSWORD || "admin";
}

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (username !== adminUser() || password !== adminPass()) {
    redirect("/admin-login?error=1");
  }

  await setAdminSessionAsync();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSessionAsync();
  redirect("/admin-login");
}

export async function saveSiteAction(formData: FormData) {
  await requireAdmin();

  const json = String(formData.get("siteJson") ?? "");
  try {
    await saveSiteFromString(json);
    redirect("/admin?saved=1");
  } catch {
    redirect("/admin?error=invalid_json");
  }
}

export async function saveSiteQuickAction(formData: FormData) {
  await requireAdmin();

  const site = await getSite();

  // SEO
  if (formData.get("seoTitle") !== null) {
    site.seo.title = String(formData.get("seoTitle") ?? "");
  }
  if (formData.get("seoDescription") !== null) {
    site.seo.description = String(formData.get("seoDescription") ?? "");
  }

  // Branding
  if (formData.get("brandingName") !== null) {
    site.branding.name = String(formData.get("brandingName") ?? "");
  }

  // Video Section - handle both YouTube URL and file upload (mutually exclusive)
  const youtubeUrl = formData.get("youtubeUrl");
  const videoFileUrl = formData.get("videoFileUrl");
  const clearVideoFile = formData.get("clearVideoFile");
  const clearYoutubeUrl = formData.get("clearYoutubeUrl");
  
  // Handle YouTube URL
  if (youtubeUrl !== null) {
    const urlValue = String(youtubeUrl ?? "").trim();
    site.videoSection.youtubeUrl = urlValue;
  }
  
  // Handle video file URL
  if (videoFileUrl !== null) {
    const fileUrlValue = String(videoFileUrl ?? "").trim();
    site.videoSection.videoFileUrl = fileUrlValue;
  }
  
  // Clear fields based on source selection
  if (clearVideoFile === "true") {
    site.videoSection.videoFileUrl = "";
  }
  
  if (clearYoutubeUrl === "true") {
    site.videoSection.youtubeUrl = "";
  }

  // Contact Section
  if (formData.get("contactTitle") !== null) {
    site.contactSection.title = String(formData.get("contactTitle") ?? "");
  }
  if (formData.get("contactSubtitle") !== null) {
    site.contactSection.subtitle = String(formData.get("contactSubtitle") ?? "");
  }
  if (formData.get("contactPrivacy") !== null) {
    site.contactSection.privacyText = String(formData.get("contactPrivacy") ?? "");
  }
  if (formData.get("contactEmail1") !== null) {
    site.contactSection.contactInfo.firstContact.email = String(formData.get("contactEmail1") ?? "");
  }
  if (formData.get("contactEmail2") !== null) {
    site.contactSection.contactInfo.customerSupport.email = String(formData.get("contactEmail2") ?? "");
  }
  if (formData.get("contactPhone") !== null) {
    site.contactSection.contactInfo.phone.number = String(formData.get("contactPhone") ?? "");
  }

  // Mission Section
  if (formData.get("missionTitle") !== null) {
    site.missionSection.hero.title = String(formData.get("missionTitle") ?? "");
  }
  if (formData.get("missionDescription") !== null) {
    site.missionSection.hero.description = String(formData.get("missionDescription") ?? "");
  }
  if (formData.get("missionCtaLabel") !== null) {
    site.missionSection.hero.ctaLabel = String(formData.get("missionCtaLabel") ?? "");
  }
  if (formData.get("missionIndustriesTitle") !== null) {
    site.missionSection.industriesIntro.title = String(formData.get("missionIndustriesTitle") ?? "");
  }
  if (formData.get("missionIndustriesDescription") !== null) {
    site.missionSection.industriesIntro.description = String(formData.get("missionIndustriesDescription") ?? "");
  }

  // About Section
  if (formData.get("aboutTitle") !== null) {
    site.aboutSection.title = String(formData.get("aboutTitle") ?? "");
  }
  const aboutParagraphs: string[] = [];
  for (let i = 0; i < 10; i++) {
    const para = formData.get(`aboutParagraph_${i}`);
    if (para && String(para).trim()) {
      aboutParagraphs.push(String(para));
    }
  }
  if (aboutParagraphs.length > 0) {
    site.aboutSection.paragraphs = aboutParagraphs;
  }

  // Navigation links (edit existing)
  const nav = site.navigation?.links;
  if (Array.isArray(nav)) {
    for (let i = 0; i < nav.length; i++) {
      const label = formData.get(`navLabel_${i}`);
      const href = formData.get(`navHref_${i}`);
      if (label !== null) nav[i].label = String(label);
      if (href !== null) nav[i].href = String(href);
    }
  }

  // FAQ Section
  if (formData.get("faqTitle") !== null) {
    if (!site.faqSection) site.faqSection = { title: "", subtitle: "", contactButtonLabel: "", items: [] };
    site.faqSection.title = String(formData.get("faqTitle") ?? "");
  }
  if (formData.get("faqSubtitle") !== null) {
    if (!site.faqSection) site.faqSection = { title: "", subtitle: "", contactButtonLabel: "", items: [] };
    site.faqSection.subtitle = String(formData.get("faqSubtitle") ?? "");
  }
  if (formData.get("faqContactLabel") !== null) {
    if (!site.faqSection) site.faqSection = { title: "", subtitle: "", contactButtonLabel: "", items: [] };
    site.faqSection.contactButtonLabel = String(formData.get("faqContactLabel") ?? "");
  }
  const faqItems: { id: number; question: string; answer: string; icon?: string }[] = [];
  for (let i = 0; i < 20; i++) {
    const q = formData.get(`faqQuestion_${i}`);
    const a = formData.get(`faqAnswer_${i}`);
    if (q && String(q).trim()) {
      faqItems.push({
        id: i + 1,
        question: String(q).trim(),
        answer: (a && String(a).trim()) ? String(a).trim() : "",
      });
    }
  }
  if (formData.get("faqTitle") !== null || formData.get("faqSubtitle") !== null || formData.get("faqContactLabel") !== null) {
    if (!site.faqSection) site.faqSection = { title: "", subtitle: "", contactButtonLabel: "", items: [] };
    site.faqSection.items = faqItems;
  }

  // Legal Pages Section - only process when saving from legal view
  const view = formData.get("view");
  if (view === "legal") {
    if (!site.legalPages) site.legalPages = {};
    
    // Impressum
    if (formData.get("impressumTitle") !== null) {
      if (!site.legalPages.imprint) site.legalPages.imprint = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.imprint.title = String(formData.get("impressumTitle") ?? "");
    }
    if (formData.get("impressumDescription") !== null) {
      if (!site.legalPages.imprint) site.legalPages.imprint = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.imprint.description = String(formData.get("impressumDescription") ?? "");
    }
    if (formData.get("impressumLastUpdated") !== null) {
      if (!site.legalPages.imprint) site.legalPages.imprint = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.imprint.lastUpdated = String(formData.get("impressumLastUpdated") ?? "");
    }
    if (formData.get("impressumBackLabel") !== null) {
      if (!site.legalPages.imprint) site.legalPages.imprint = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.imprint.backToHomeLabel = String(formData.get("impressumBackLabel") ?? "");
    }
    if (formData.get("impressumContent") !== null) {
      if (!site.legalPages.imprint) site.legalPages.imprint = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.imprint.content = String(formData.get("impressumContent") ?? "");
    }

    // AGB
    if (formData.get("agbTitle") !== null) {
      if (!site.legalPages.terms) site.legalPages.terms = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.terms.title = String(formData.get("agbTitle") ?? "");
    }
    if (formData.get("agbDescription") !== null) {
      if (!site.legalPages.terms) site.legalPages.terms = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.terms.description = String(formData.get("agbDescription") ?? "");
    }
    if (formData.get("agbLastUpdated") !== null) {
      if (!site.legalPages.terms) site.legalPages.terms = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.terms.lastUpdated = String(formData.get("agbLastUpdated") ?? "");
    }
    if (formData.get("agbBackLabel") !== null) {
      if (!site.legalPages.terms) site.legalPages.terms = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.terms.backToHomeLabel = String(formData.get("agbBackLabel") ?? "");
    }
    if (formData.get("agbContent") !== null) {
      if (!site.legalPages.terms) site.legalPages.terms = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.terms.content = String(formData.get("agbContent") ?? "");
    }

    // Datenschutz
    if (formData.get("datenschutzTitle") !== null) {
      if (!site.legalPages.privacy) site.legalPages.privacy = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.privacy.title = String(formData.get("datenschutzTitle") ?? "");
    }
    if (formData.get("datenschutzDescription") !== null) {
      if (!site.legalPages.privacy) site.legalPages.privacy = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.privacy.description = String(formData.get("datenschutzDescription") ?? "");
    }
    if (formData.get("datenschutzLastUpdated") !== null) {
      if (!site.legalPages.privacy) site.legalPages.privacy = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.privacy.lastUpdated = String(formData.get("datenschutzLastUpdated") ?? "");
    }
    if (formData.get("datenschutzBackLabel") !== null) {
      if (!site.legalPages.privacy) site.legalPages.privacy = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.privacy.backToHomeLabel = String(formData.get("datenschutzBackLabel") ?? "");
    }
    if (formData.get("datenschutzContent") !== null) {
      if (!site.legalPages.privacy) site.legalPages.privacy = { title: "", description: "", lastUpdated: "", backToHomeLabel: "", content: "" };
      site.legalPages.privacy.content = String(formData.get("datenschutzContent") ?? "");
    }
  }

  await saveSite(site);
  
  // Redirect based on which view we're saving from
  if (view === "legal") {
    redirect("/admin?view=legal&saved=1");
  }
  redirect("/admin?view=settings&saved=1");
}

export async function clearSubmissionsAction(formData: FormData) {
  await requireAdmin();
  await clearContactSubmissions();
  const view = formData.get("view");
  if (view === "contact") {
    redirect("/admin?view=contact&cleared=1");
  }
  redirect("/admin?cleared=1");
}

export async function downloadSubmissionsAction() {
  // This is not used by a form; left for future.
  await requireAdmin();
  const submissions = await getContactSubmissions();
  return submissions;
}

// Product Actions
async function ensureDbInitialized() {
  await initializeDatabase();
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  await ensureDbInitialized();

  const repo = new ProductRepository();
  
  const tabImageSrc = String(formData.get("tabImageSrc") ?? "").trim();
  const tabImageAlt = String(formData.get("tabImageAlt") ?? "").trim();
  const heroImageSrc = String(formData.get("heroImageSrc") ?? "").trim();
  const heroImageAlt = String(formData.get("heroImageAlt") ?? "").trim();
  const videoSrc = String(formData.get("videoSrc") ?? "").trim();
  const videoAlt = String(formData.get("videoAlt") ?? "").trim();
  const featuresImageSrc = String(formData.get("featuresImageSrc") ?? "").trim();
  const featuresImageAlt = String(formData.get("featuresImageAlt") ?? "").trim();

  // Parse stats from JSON string
  let stats: { icon: string; label: string; value: string; sub: string }[] | undefined;
  const statsJson = formData.get("stats");
  if (statsJson && typeof statsJson === "string") {
    try {
      const parsed = JSON.parse(statsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out empty stats (all fields empty)
        stats = parsed.filter((stat: any) => 
          stat.label?.trim() || stat.value?.trim() || stat.icon?.trim() || stat.sub?.trim()
        );
        if (stats.length === 0) stats = undefined;
      }
    } catch (e) {
      console.error("Error parsing stats:", e);
    }
  }

  // Parse technical data from JSON string
  let technicalSpecs: {
    heading?: string;
    items?: { icon?: string; label: string; value: string }[];
  } | undefined;
  const technicalDataJson = formData.get("technicalData");
  if (technicalDataJson && typeof technicalDataJson === "string") {
    try {
      const parsed = JSON.parse(technicalDataJson);
      if (parsed && parsed.items?.length > 0) {
        technicalSpecs = parsed;
      }
    } catch (e) {
      console.error("Error parsing technical data:", e);
    }
  }

  // Parse features from JSON string
  let features: {
    heading?: string;
    items?: { number: string; title: string; description: string }[];
  } | undefined;
  const featuresJson = formData.get("features");
  if (featuresJson && typeof featuresJson === "string") {
    try {
      const parsed = JSON.parse(featuresJson);
      // Handle both old format (array) and new format (object with heading and items)
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Old format - convert to new format
        const filtered = parsed.filter((feature: any) => 
          feature.number?.trim() || feature.title?.trim() || feature.description?.trim()
        );
        if (filtered.length > 0) {
          features = { heading: "", items: filtered };
        }
      } else if (parsed && parsed.items && Array.isArray(parsed.items) && parsed.items.length > 0) {
        // New format
        const filtered = parsed.items.filter((feature: any) => 
          feature.number?.trim() || feature.title?.trim() || feature.description?.trim()
        );
        if (filtered.length > 0) {
          features = { heading: parsed.heading || "", items: filtered };
        }
      }
    } catch (e) {
      console.error("Error parsing features:", e);
    }
  }

  await repo.create({
    name: String(formData.get("name") ?? ""),
    tabTitle: String(formData.get("tabTitle") ?? ""),
    tabDesc: String(formData.get("tabDesc") ?? "").trim() || undefined,
    tabImage: { src: tabImageSrc, alt: tabImageAlt || tabImageSrc },
    heroImage: { src: heroImageSrc, alt: heroImageAlt || heroImageSrc },
    video: videoSrc ? { src: videoSrc, alt: videoAlt || videoSrc } : undefined,
    featuresImage: featuresImageSrc ? { src: featuresImageSrc, alt: featuresImageAlt || featuresImageSrc } : undefined,
    savingsTitle: String(formData.get("savingsTitle") ?? ""),
    savingsSubtitle: String(formData.get("savingsSubtitle") ?? ""),
    stats: stats,
    description: String(formData.get("description") ?? "").trim() || undefined,
    technicalSpecs: technicalSpecs,
    features: features,
    displayOrder: Number(formData.get("displayOrder") ?? "0") || 0,
  });

  // Revalidate homepage to show updated products
  revalidatePath("/");
  redirect("/admin?view=products&saved=1");
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();
  await ensureDbInitialized();

  const repo = new ProductRepository();
  const id = String(formData.get("id") ?? "");
  
  if (!id) {
    redirect("/admin?view=products&error=missing_id");
    return;
  }

  const tabImageSrc = String(formData.get("tabImageSrc") ?? "").trim();
  const tabImageAlt = String(formData.get("tabImageAlt") ?? "").trim();
  const heroImageSrc = String(formData.get("heroImageSrc") ?? "").trim();
  const heroImageAlt = String(formData.get("heroImageAlt") ?? "").trim();
  const videoSrc = String(formData.get("videoSrc") ?? "").trim();
  const videoAlt = String(formData.get("videoAlt") ?? "").trim();
  const featuresImageSrc = String(formData.get("featuresImageSrc") ?? "").trim();
  const featuresImageAlt = String(formData.get("featuresImageAlt") ?? "").trim();

  // Parse stats from JSON string
  let stats: { icon: string; label: string; value: string; sub: string }[] | undefined;
  const statsJson = formData.get("stats");
  if (statsJson && typeof statsJson === "string") {
    try {
      const parsed = JSON.parse(statsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out empty stats (all fields empty)
        stats = parsed.filter((stat: any) => 
          stat.label?.trim() || stat.value?.trim() || stat.icon?.trim() || stat.sub?.trim()
        );
        if (stats.length === 0) stats = undefined;
      }
    } catch (e) {
      console.error("Error parsing stats:", e);
    }
  }

  // Parse technical data from JSON string
  let technicalSpecs: {
    heading?: string;
    items?: { icon?: string; label: string; value: string }[];
  } | undefined;
  const technicalDataJson = formData.get("technicalData");
  if (technicalDataJson && typeof technicalDataJson === "string") {
    try {
      const parsed = JSON.parse(technicalDataJson);
      if (parsed && parsed.items?.length > 0) {
        technicalSpecs = parsed;
      }
    } catch (e) {
      console.error("Error parsing technical data:", e);
    }
  }

  // Parse features from JSON string
  let features: {
    heading?: string;
    items?: { number: string; title: string; description: string }[];
  } | undefined;
  const featuresJson = formData.get("features");
  if (featuresJson && typeof featuresJson === "string") {
    try {
      const parsed = JSON.parse(featuresJson);
      // Handle both old format (array) and new format (object with heading and items)
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Old format - convert to new format
        const filtered = parsed.filter((feature: any) => 
          feature.number?.trim() || feature.title?.trim() || feature.description?.trim()
        );
        if (filtered.length > 0) {
          features = { heading: "", items: filtered };
        }
      } else if (parsed && parsed.items && Array.isArray(parsed.items) && parsed.items.length > 0) {
        // New format
        const filtered = parsed.items.filter((feature: any) => 
          feature.number?.trim() || feature.title?.trim() || feature.description?.trim()
        );
        if (filtered.length > 0) {
          features = { heading: parsed.heading || "", items: filtered };
        }
      }
    } catch (e) {
      console.error("Error parsing features:", e);
    }
  }

  await repo.update(id, {
    name: String(formData.get("name") ?? ""),
    tabTitle: String(formData.get("tabTitle") ?? ""),
    tabDesc: String(formData.get("tabDesc") ?? "").trim() || undefined,
    tabImage: { src: tabImageSrc, alt: tabImageAlt || tabImageSrc },
    heroImage: { src: heroImageSrc, alt: heroImageAlt || heroImageSrc },
    video: videoSrc ? { src: videoSrc, alt: videoAlt || videoSrc } : undefined,
    featuresImage: featuresImageSrc ? { src: featuresImageSrc, alt: featuresImageAlt || featuresImageSrc } : undefined,
    savingsTitle: String(formData.get("savingsTitle") ?? ""),
    savingsSubtitle: String(formData.get("savingsSubtitle") ?? ""),
    stats: stats,
    description: String(formData.get("description") ?? "").trim() || undefined,
    technicalSpecs: technicalSpecs,
    features: features,
    displayOrder: Number(formData.get("displayOrder") ?? "0") || 0,
  } as any);

  // Revalidate homepage to show updated products
  revalidatePath("/");
  redirect("/admin?view=products&saved=1");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  await ensureDbInitialized();

  const repo = new ProductRepository();
  const id = String(formData.get("id") ?? "");
  
  if (!id) {
    redirect("/admin?view=products&error=missing_id");
    return;
  }

  await repo.delete(id);
  
  // Revalidate homepage to show updated products
  revalidatePath("/");
  redirect("/admin?view=products&deleted=1");
}
