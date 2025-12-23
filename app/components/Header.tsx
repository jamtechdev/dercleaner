"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Header({ site }: { site: any }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="max-w-7xl mx-auto flex items-center justify-between  px-4 sm:px-6 md:px-12">

        {/* Logo Section */}
        <Link href="/" className="flex items-center">
          <div className="relative w-28 h-12 sm:w-32 sm:h-16 md:w-40 md:h-26">
            <Image
              src={site.branding.logo.src}
              alt={site.branding.logo.alt}
              fill
              className="object-contain"
              priority // High priority for SSR LCP performance
            />
          </div>
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-900 shadow-sm hover:bg-gray-50"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <img
            src="/hamburger.svg"
            alt=""
            aria-hidden="true"
            className="h-5 w-5"
          />
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-8 text-sm md:text-base font-semibold text-brand">
            {(site.navigation.links as Array<{ href: string; label: string }>).map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <Link
                  href={link.href}
                  className="hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
              <div className="relative h-12 w-28">
                <Image
                  src={site.branding.logo.src}
                  alt={site.branding.logo.alt}
                  fill
                  className="object-contain"
                  priority // High priority for SSR LCP performance
                />
              </div>
              <button
                type="button"
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-base font-semibold leading-none text-gray-900 shadow-sm hover:bg-gray-50"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <nav className="px-4 py-3 bg-white">
              <ul className="flex flex-col gap-2">
                {(site.navigation.links as Array<{ href: string; label: string }>).map((link) => (
                  <li key={`mobile-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="block rounded-xl px-3 py-3 text-base font-semibold text-brand hover:bg-brand-soft/60"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}


