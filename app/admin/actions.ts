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

  // Basic fields
  site.seo.title = String(formData.get("seoTitle") ?? "");
  site.seo.description = String(formData.get("seoDescription") ?? "");

  site.videoSection.youtubeUrl = String(formData.get("youtubeUrl") ?? "");

  site.contactSection.title = String(formData.get("contactTitle") ?? "");
  site.contactSection.subtitle = String(formData.get("contactSubtitle") ?? "");
  site.contactSection.privacyText = String(formData.get("contactPrivacy") ?? "");

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

  await saveSite(site);
  redirect("/admin?saved=1");
}

export async function clearSubmissionsAction() {
  await requireAdmin();
  await clearContactSubmissions();
  redirect("/admin?cleared=1");
}

export async function downloadSubmissionsAction() {
  // This is not used by a form; left for future.
  await requireAdmin();
  const submissions = await getContactSubmissions();
  return submissions;
}
