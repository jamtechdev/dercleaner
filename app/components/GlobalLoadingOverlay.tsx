"use client";

import { useEffect, useState } from "react";

export default function GlobalLoadingOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = () => setVisible(false);

    // If the page is already fully loaded (e.g. fast refresh), don't flash the overlay.
    if (document.readyState === "complete") {
      hide();
      return;
    }

    window.addEventListener("load", hide);
    return () => window.removeEventListener("load", hide);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
        <p className="text-sm font-semibold text-brand">Loading…</p>
      </div>
    </div>
  );
}
