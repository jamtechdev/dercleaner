import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const SITE_JSON_PATH = path.join(
  process.cwd(),
  "app",
  "content",
  "site.json",
);

export const SUBMISSIONS_JSON_PATH = path.join(
  process.cwd(),
  "data",
  "contact-submissions.json",
);

export async function getSite(): Promise<any> {
  const raw = await readFile(SITE_JSON_PATH, "utf8");
  return JSON.parse(raw);
}

export async function saveSite(nextSite: unknown): Promise<void> {
  const json = JSON.stringify(nextSite, null, 2);
  await writeFile(SITE_JSON_PATH, json + "\n", "utf8");
}

export async function saveSiteFromString(jsonString: string): Promise<any> {
  const parsed = JSON.parse(jsonString);
  await saveSite(parsed);
  return parsed;
}

export async function getContactSubmissions(): Promise<any[]> {
  try {
    const raw = await readFile(SUBMISSIONS_JSON_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function clearContactSubmissions(): Promise<void> {
  await mkdir(path.dirname(SUBMISSIONS_JSON_PATH), { recursive: true });
  await writeFile(SUBMISSIONS_JSON_PATH, "[]\n", "utf8");
}
