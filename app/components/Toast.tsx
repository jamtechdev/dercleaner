"use client";

import { useEffect, useState } from "react";

export default function Toast({
  message,
  type = "success",
  onClose,
}: {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}) {
  const DURATION_MS = 3200;
  const EXIT_MS = 180;
  const [enter, setEnter] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // trigger enter animation
    const raf = window.requestAnimationFrame(() => setEnter(true));

    const t = window.setTimeout(() => {
      setLeaving(true);
      window.setTimeout(onClose, EXIT_MS);
    }, DURATION_MS);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [message, onClose]);

  const isSuccess = type === "success";
  const icon = isSuccess ? "✓" : "!";
  const title = isSuccess ? "Success" : "Error";

  // Use site brand colors (Tailwind tokens defined in globals.css via @theme inline)
  const accent = "from-brand to-brand-cta";

  const frame = "border-brand/20 bg-white/90 text-ink";

  const iconWrap = isSuccess
    ? "bg-brand-soft text-brand ring-brand/25"
    : "bg-red-500/10 text-red-700 ring-red-400/25";

  return (
    <div
      className={[
        "fixed right-4 top-4 z-[9999] w-[min(420px,calc(100vw-2rem))]",
        "rounded-2xl border shadow-xl shadow-black/10 backdrop-blur",
        "overflow-hidden",
        frame,
        enter && !leaving
          ? "translate-y-0 opacity-100"
          : "translate-y-2 opacity-0",
        "transition-all duration-200 ease-out",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      {/* Accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${accent}`} />

      <div className="flex items-start gap-3 px-4 py-3.5">
        <div
          className={[
            "mt-0.5 grid h-9 w-9 place-items-center rounded-full ring-1",
            "text-base font-black",
            iconWrap,
          ].join(" ")}
          aria-hidden="true"
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p
            className={[
              "text-sm font-extrabold leading-none",
              isSuccess ? "text-brand" : "text-red-700",
            ].join(" ")}
          >
            {title}
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug opacity-90">
            {message}
          </p>
        </div>

        <button
          type="button"
          className="ml-auto rounded-lg px-2 py-1 text-sm font-black opacity-60 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          onClick={() => {
            setLeaving(true);
            window.setTimeout(onClose, EXIT_MS);
          }}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>

      {/* Progress */}
      <div className="h-1 w-full bg-black/5">
        <div
          key={message}
          className={`h-full bg-gradient-to-r ${accent}`}
          style={{
            animation: `toast-progress ${DURATION_MS}ms linear forwards`,
          }}
        />
      </div>

      {/* Local keyframes (no global CSS needed) */}
      <style jsx>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
