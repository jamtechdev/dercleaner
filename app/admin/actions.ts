"use server";

import { redirect } from "next/navigation";
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
  if (formData.get("brandingLogoSrc") !== null) {
    if (!site.branding.logo) site.branding.logo = { src: "", alt: "" };
    site.branding.logo.src = String(formData.get("brandingLogoSrc") ?? "");
  }
  if (formData.get("brandingLogoAlt") !== null) {
    if (!site.branding.logo) site.branding.logo = { src: "", alt: "" };
    site.branding.logo.alt = String(formData.get("brandingLogoAlt") ?? "");
  }

  // Video Section
  if (formData.get("youtubeUrl") !== null) {
    site.videoSection.youtubeUrl = String(formData.get("youtubeUrl") ?? "");
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

  // Banner Section
  if (formData.get("bannerTitle") !== null) {
    if (!site.bannerSection) site.bannerSection = { title: "", subtitle: "", ctaLabel: "", ctaLink: "", backgroundImage: "" };
    site.bannerSection.title = String(formData.get("bannerTitle") ?? "");
  }
  if (formData.get("bannerSubtitle") !== null) {
    if (!site.bannerSection) site.bannerSection = { title: "", subtitle: "", ctaLabel: "", ctaLink: "", backgroundImage: "" };
    site.bannerSection.subtitle = String(formData.get("bannerSubtitle") ?? "");
  }
  if (formData.get("bannerCtaLabel") !== null) {
    if (!site.bannerSection) site.bannerSection = { title: "", subtitle: "", ctaLabel: "", ctaLink: "", backgroundImage: "" };
    site.bannerSection.ctaLabel = String(formData.get("bannerCtaLabel") ?? "");
  }
  if (formData.get("bannerCtaLink") !== null) {
    if (!site.bannerSection) site.bannerSection = { title: "", subtitle: "", ctaLabel: "", ctaLink: "", backgroundImage: "" };
    site.bannerSection.ctaLink = String(formData.get("bannerCtaLink") ?? "");
  }
  if (formData.get("bannerBackgroundImage") !== null) {
    if (!site.bannerSection) site.bannerSection = { title: "", subtitle: "", ctaLabel: "", ctaLink: "", backgroundImage: "" };
    site.bannerSection.backgroundImage = String(formData.get("bannerBackgroundImage") ?? "");
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

  // Products Section – actions
  if (formData.get("productsTechDataLabel") !== null) {
    if (!site.productsSection?.actions) site.productsSection.actions = { techDataLabel: "", demoLabel: "" };
    site.productsSection.actions.techDataLabel = String(formData.get("productsTechDataLabel") ?? "");
  }
  if (formData.get("productsDemoLabel") !== null) {
    if (!site.productsSection?.actions) site.productsSection.actions = { techDataLabel: "", demoLabel: "" };
    site.productsSection.actions.demoLabel = String(formData.get("productsDemoLabel") ?? "");
  }

  // Products Section – per product (name, tabTitle, tabDesc, description, savingsTitle, savingsSubtitle)
  const products = site.productsSection?.products;
  if (Array.isArray(products)) {
    for (let i = 0; i < products.length; i++) {
      const name = formData.get(`product_${i}_name`);
      const tabTitle = formData.get(`product_${i}_tabTitle`);
      const tabDesc = formData.get(`product_${i}_tabDesc`);
      const description = formData.get(`product_${i}_description`);
      const savingsTitle = formData.get(`product_${i}_savingsTitle`);
      const savingsSubtitle = formData.get(`product_${i}_savingsSubtitle`);
      if (name !== null) products[i].name = String(name ?? "");
      if (tabTitle !== null) products[i].tabTitle = String(tabTitle ?? "");
      if (tabDesc !== null) products[i].tabDesc = String(tabDesc ?? "");
      if (description !== null) products[i].description = String(description ?? "");
      if (savingsTitle !== null) products[i].savingsTitle = String(savingsTitle ?? "");
      if (savingsSubtitle !== null) products[i].savingsSubtitle = String(savingsSubtitle ?? "");
    }
  }

  // Homepage Features
  const homepageFeaturesJson = formData.get("homepageFeatures");
  if (homepageFeaturesJson) {
    try {
      if (!site.featuresSection) site.featuresSection = { features: [] };
      site.featuresSection.features = JSON.parse(String(homepageFeaturesJson));
    } catch (e) {
      console.error("Error parsing homepage features JSON:", e);
    }
  }

  await saveSite(site);
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

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const repo = new ProductRepository();

  const statsJson = String(formData.get("stats") ?? "[]");
  const technicalDataJson = String(formData.get("technicalData") ?? "{}");
  const featuresJson = String(formData.get("features") ?? "{}");

  await repo.create({
    name: String(formData.get("name") ?? ""),
    tabTitle: String(formData.get("tabTitle") ?? ""),
    tabDesc: String(formData.get("tabDesc") ?? ""),
    tabImage: {
      src: String(formData.get("tabImageSrc") ?? ""),
      alt: String(formData.get("tabImageAlt") ?? ""),
    },
    heroImage: {
      src: String(formData.get("heroImageSrc") ?? ""),
      alt: String(formData.get("heroImageAlt") ?? ""),
    },
    featuresImage: {
      src: String(formData.get("featuresImageSrc") ?? ""),
      alt: String(formData.get("featuresImageAlt") ?? ""),
    },
    savingsTitle: String(formData.get("savingsTitle") ?? ""),
    savingsSubtitle: String(formData.get("savingsSubtitle") ?? ""),
    stats: JSON.parse(statsJson),
    description: String(formData.get("description") ?? ""),
    technicalSpecs: JSON.parse(technicalDataJson),
    features: JSON.parse(featuresJson),
    displayOrder: Number(formData.get("displayOrder") ?? 0),
  });

  redirect("/admin?view=products&saved=1");
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const repo = new ProductRepository();

  const statsJson = String(formData.get("stats") ?? "[]");
  const technicalDataJson = String(formData.get("technicalData") ?? "{}");
  const featuresJson = String(formData.get("features") ?? "{}");

  await repo.update(id, {
    name: String(formData.get("name") ?? ""),
    tabTitle: String(formData.get("tabTitle") ?? ""),
    tabDesc: String(formData.get("tabDesc") ?? ""),
    tabImage: {
      src: String(formData.get("tabImageSrc") ?? ""),
      alt: String(formData.get("tabImageAlt") ?? ""),
    },
    heroImage: {
      src: String(formData.get("heroImageSrc") ?? ""),
      alt: String(formData.get("heroImageAlt") ?? ""),
    },
    featuresImage: {
      src: String(formData.get("featuresImageSrc") ?? ""),
      alt: String(formData.get("featuresImageAlt") ?? ""),
    },
    savingsTitle: String(formData.get("savingsTitle") ?? ""),
    savingsSubtitle: String(formData.get("savingsSubtitle") ?? ""),
    stats: JSON.parse(statsJson),
    description: String(formData.get("description") ?? ""),
    technicalSpecs: JSON.parse(technicalDataJson),
    features: JSON.parse(featuresJson),
    displayOrder: Number(formData.get("displayOrder") ?? 0),
  });

  redirect("/admin?view=products&saved=1");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const repo = new ProductRepository();
  await repo.delete(id);
  // Note: Caller might need to handle redirection or refresh
}
