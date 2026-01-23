'use server'

import { initializeDatabase } from "@/app/database/data-source";
import { ContactSubmissionRepository } from "@/app/database/repositories/ContactSubmissionRepository";

export type ContactFormState = {
  success: boolean;
  id?: string;
  message?: string;
  error?: string;
};

async function persistContactSubmission(formData: FormData): Promise<string> {
  await initializeDatabase();
  
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const tel = String(formData.get("tel") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const repo = new ContactSubmissionRepository();
  const submission = await repo.create({
    name,
    email,
    tel: tel || undefined,
    message,
  });

  return submission.id;
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