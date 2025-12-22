"use client";

import { submitContact } from "@/app/actions";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Toast from "./Toast";
import Link from "next/link";

export default function Contact({ site }: { site: any }) {
  const privacyParts = site.contactSection.privacyText.split(
    "Datenschutzvereinbarung",
  );

  const formRef = useRef<HTMLFormElement | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  type Field = "name" | "email" | "tel" | "message";
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const emailRegex = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    [],
  );

  const clearError = (field: Field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const [state, formAction, pending] = useActionState(submitContact, {
    success: false,
  });

  useEffect(() => {
    if (state?.success) {
      setToast({
        message: state.message ?? "Vielen Dank! Ihre Nachricht wurde gesendet.",
        type: "success",
      });
      setErrors({});
      formRef.current?.reset();
      return;
    }

    if (state?.error) {
      setToast({ message: state.error, type: "error" });
    }
  }, [state]);

  const validate = (formData: FormData) => {
    const nextErrors: Partial<Record<Field, string>> = {};

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const tel = String(formData.get("tel") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name) nextErrors.name = "Bitte geben Sie Ihren Namen ein.";
    if (!email) nextErrors.email = "Bitte geben Sie Ihre E-Mail-Adresse ein.";
    else if (!emailRegex.test(email)) nextErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";

    // Optional field, but validate if provided
    if (tel && !/^[0-9+()\-.\s]{6,}$/.test(tel)) {
      nextErrors.tel = "Bitte geben Sie eine gültige Telefonnummer ein.";
    }

    if (!message) nextErrors.message = "Bitte geben Sie Ihre Nachricht ein.";
    else if (message.length < 10) {
      nextErrors.message = "Die Nachricht muss mindestens 10 Zeichen lang sein.";
    }

    return nextErrors;
  };

  return (
    <section id="kontakt" className="scroll-mt-24 bg-white py-12 md:py-26 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 md:mb-2 max-w-xl leading-tight uppercase">
          {site.contactSection.title}
        </h2>
        <div className="max-w-7xl mx-auto text-sm sm:text-base">{site.contactSection.subtitle}</div>
        
        {/* The Container */}
        <div className="bg-brand-surface rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 md:p-12 shadow-sm mt-6">
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}

          <form
            ref={formRef}
            action={formAction as any}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            noValidate
            onSubmit={(e) => {
              if (pending) return;
              const nextErrors = validate(new FormData(e.currentTarget));
              if (Object.keys(nextErrors).length > 0) {
                e.preventDefault();
                setErrors(nextErrors);
                setToast({
                  message: "Bitte korrigieren Sie die hervorgehobenen Felder.",
                  type: "error",
                });
              }
            }}
          >
            <div className="flex flex-col gap-4">
              <div>
                <input
                name="name"
                placeholder={site.contactSection.form.placeholders.name}
                autoComplete="name"
                required
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                onChange={() => clearError("name")}
                className={`w-full rounded-full px-5 sm:px-6 py-3.5 sm:py-4 border-none outline-none focus:ring-2 focus:ring-brand bg-white ${
                  errors.name ? "ring-2 ring-red-400" : ""
                }`}
                />
                {errors.name && (
                  <p
                    id="contact-name-error"
                    role="alert"
                    className="mt-2 text-xs font-semibold text-red-600"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <input
                name="email"
                type="email"
                placeholder={site.contactSection.form.placeholders.email}
                autoComplete="email"
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                onChange={() => clearError("email")}
                className={`w-full rounded-full px-5 sm:px-6 py-3.5 sm:py-4 border-none outline-none focus:ring-2 focus:ring-brand bg-white ${
                  errors.email ? "ring-2 ring-red-400" : ""
                }`}
                />
                {errors.email && (
                  <p
                    id="contact-email-error"
                    role="alert"
                    className="mt-2 text-xs font-semibold text-red-600"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <input
                name="tel"
                placeholder={site.contactSection.form.placeholders.tel}
                inputMode="tel"
                autoComplete="tel"
                aria-invalid={!!errors.tel}
                aria-describedby={errors.tel ? "contact-tel-error" : undefined}
                onChange={() => clearError("tel")}
                className={`w-full rounded-full px-5 sm:px-6 py-3.5 sm:py-4 border-none outline-none focus:ring-2 focus:ring-brand bg-white ${
                  errors.tel ? "ring-2 ring-red-400" : ""
                }`}
                />
                {errors.tel && (
                  <p
                    id="contact-tel-error"
                    role="alert"
                    className="mt-2 text-xs font-semibold text-red-600"
                  >
                    {errors.tel}
                  </p>
                )}
              </div>

              <button
                disabled={pending}
                className="bg-brand-cta text-white font-bold py-4 rounded-full uppercase hover:bg-brand transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pending ? "Wird gesendet..." : site.contactSection.form.submitLabel}
              </button>
            </div>
            
            <div className="flex flex-col">
              <div className="flex flex-col">
                <textarea
                name="message"
                placeholder={site.contactSection.form.placeholders.message}
                required
                minLength={10}
                aria-invalid={!!errors.message}
                aria-describedby={
                  errors.message ? "contact-message-error" : undefined
                }
                onChange={() => clearError("message")}
                className={`h-full min-h-[180px] md:min-h-[200px] rounded-[22px] sm:rounded-[30px] px-5 sm:px-6 py-3.5 sm:py-4 border-none outline-none focus:ring-2 focus:ring-brand resize-none bg-white ${
                  errors.message ? "ring-2 ring-red-400" : ""
                }`}
                />
                {errors.message && (
                  <p
                    id="contact-message-error"
                    role="alert"
                    className="mt-2 text-xs font-semibold text-red-600"
                  >
                    {errors.message}
                  </p>
                )}
              </div>
            </div>
          </form>
          
          <p className="text-[16px] text-gray-500 mt-6 leading-normal">
            {privacyParts.length === 2 ? (
              <>
                {privacyParts[0]}
                <Link href="/datenschutz"><span className="underline cursor-pointer">Datenschutzvereinbarung</span></Link>
                {privacyParts[1]}
              </>
            ) : (
              site.contactSection.privacyText
            )}
          </p>
        </div>
      </div>
    </section>
  );
}