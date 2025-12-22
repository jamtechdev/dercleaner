'use server'

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type ContactSubmission = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  tel: string;
  message: string;
};

export type ContactFormState = {
  success: boolean;
  id?: string;
  message?: string;
  error?: string;
};

async function persistContactSubmission(formData: FormData): Promise<string> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const tel = String(formData.get("tel") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const createdAt = new Date().toISOString();
  const id =
    typeof crypto?.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const submission: ContactSubmission = {
    id,
    createdAt,
    name,
    email,
    tel,
    message,
  };

  // NOTE: This writes to the server filesystem (works in local/dev or Node servers).
  // It will NOT be persistent on most serverless hosts (e.g. Vercel).
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "contact-submissions.json");

  await mkdir(dataDir, { recursive: true });

  let existing: ContactSubmission[] = [];
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) existing = parsed as ContactSubmission[];
  } catch {
    // first write: file doesn't exist yet OR JSON is invalid -> start fresh
    existing = [];
  }

  existing.push(submission);
  await writeFile(filePath, JSON.stringify(existing, null, 2), "utf8");

  return id;
}

// Use with <form action={formAction}> + useActionState in a client component
export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  try {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name) {
      return { success: false, error: "Bitte geben Sie Ihren Namen ein." };
    }
    if (!email) {
      return { success: false, error: "Bitte geben Sie Ihre E-Mail-Adresse ein." };
    }
    if (!message || message.length < 10) {
      return { success: false, error: "Bitte geben Sie eine längere Nachricht ein." };
    }

    const id = await persistContactSubmission(formData);
    return {
      success: true,
      id,
      message: "Vielen Dank! Ihre Nachricht wurde gesendet.",
    };
  } catch {
    return {
      success: false,
      error: "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",
    };
  }
}

// Backwards-compatible server action signature (if you want to keep using it directly)
export async function handleContactForm(formData: FormData) {
  return submitContact({ success: false }, formData);
}