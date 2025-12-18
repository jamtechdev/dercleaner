"use client";

import { submitContact } from "@/app/actions";
import site from "@/app/content/site.json";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Toast from "./Toast";

export default function Contact() {
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
        message: state.message ?? "Thanks! Your message has been sent.",
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

    if (!name) nextErrors.name = "Please enter your name.";
    if (!email) nextErrors.email = "Please enter your email.";
    else if (!emailRegex.test(email)) nextErrors.email = "Enter a valid email.";

    // Optional field, but validate if provided
    if (tel && !/^[0-9+()\-.\s]{6,}$/.test(tel)) {
      nextErrors.tel = "Enter a valid phone number.";
    }

    if (!message) nextErrors.message = "Please enter your message.";
    else if (message.length < 10) {
      nextErrors.message = "Message should be at least 10 characters.";
    }

    return nextErrors;
  };

  return (
    <section id="kontakt" className="scroll-mt-24 bg-white py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 md:mb-8 max-w-lg leading-tight uppercase">
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
                  message: "Please fix the highlighted fields.",
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
                className={`w-full rounded-full px-5 sm:px-6 py-3.5 sm:py-4 border-none outline-none focus:ring-2 focus:ring-brand ${
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
                className={`w-full rounded-full px-5 sm:px-6 py-3.5 sm:py-4 border-none outline-none focus:ring-2 focus:ring-brand ${
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
                className={`w-full rounded-full px-5 sm:px-6 py-3.5 sm:py-4 border-none outline-none focus:ring-2 focus:ring-brand ${
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
                {pending ? "Sending..." : site.contactSection.form.submitLabel}
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
                className={`h-full min-h-[180px] md:min-h-[200px] rounded-[22px] sm:rounded-[30px] px-5 sm:px-6 py-3.5 sm:py-4 border-none outline-none focus:ring-2 focus:ring-brand resize-none ${
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
          
          <p className="text-[10px] text-gray-500 mt-6 leading-normal">
            {privacyParts.length === 2 ? (
              <>
                {privacyParts[0]}
                <span className="underline cursor-pointer">Datenschutzvereinbarung</span>
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