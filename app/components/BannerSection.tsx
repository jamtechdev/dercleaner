"use client";

import React from "react";
import Image from "next/image";

interface BannerSectionProps {
    site: any;
}

export const BannerSection: React.FC<BannerSectionProps> = ({ site }) => {
    // Use data from site config if available, otherwise use defaults
    const title = site.bannerSection?.title || "Höchste Effizienz für Ihre Reinigung";
    const subtitle = site.bannerSection?.subtitle || "Entdecken Sie die Zukunft der professionellen Bodenreinigung mit unseren innovativen Lösungen.";
    const ctaLabel = site.bannerSection?.ctaLabel || "Produkte ansehen";
    const ctaLink = site.bannerSection?.ctaLink || "#produkte";
    const bannerImage = site.bannerSection?.backgroundImage || "/images/uploads/img_1770202317899.png";

    return (
        <section className="relative w-full overflow-hidden bg-brand-soft">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 py-12 sm:gap-12 sm:px-10 md:flex-row md:py-24 lg:px-12 lg:py-32">

                <div className="flex w-full flex-1 flex-col items-start gap-4 text-left md:w-1/2">
                    {/* Top Tagline */}
                    <h3 className="dc-animate-fade-up text-xl font-bold text-brand sm:text-2xl md:text-3xl">
                        Besuchen Sie uns auf der Messe!
                    </h3>

                    {/* Event Section */}
                    <div className="dc-animate-fade-up flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            {/* Logo */}
                            <img src="/banner_icon.png" alt="Intergastra Logo" className="h-8 w-auto sm:h-10 md:h-12" />

                            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
                                INTERGASTRA
                            </h2>
                        </div>

                        {/* Subtitle / Description */}
                        <p className="text-base font-medium text-slate-700 sm:text-lg md:text-xl">
                            Leitmesse für Hotellerie & Gastronomie
                        </p>

                        {/* Date and Location */}
                        <div className="mt-2">
                            <p className="text-lg font-bold text-slate-900 sm:text-xl md:text-2xl">
                                7.–11.2.2026 | <span className="text-brand">Messe Stuttgart</span>
                            </p>
                            <p className="text-sm font-semibold text-slate-800 sm:text-base">
                                Halle 5, Stand 5A32 <br />
                                <span className="font-bold text-slate-900">(i-team Germany)</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Image - Right Side (Bottom on Mobile) */}
                <div className="relative hidden w-full flex-1 justify-center md:flex md:h-[550px] md:w-1/2 md:justify-end">
                    <div className="relative h-[250px] w-full overflow-hidden rounded-2xl shadow-xl sm:h-[350px] md:h-full md:w-[90%]">
                        <Image
                            src="/banner_right.png"
                            alt="Banner Image"
                            fill
                            className="object-cover object-center transition-transform duration-700 hover:scale-105"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-brand/10 blur-3xl md:h-96 md:w-96" />
                    <div className="absolute -bottom-10 -left-10 -z-10 h-40 w-40 rounded-full bg-brand-cta/20 blur-2xl md:h-64 md:w-64" />
                </div>
            </div>
        </section >
    );
};
