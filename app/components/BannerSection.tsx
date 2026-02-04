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
            <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-12 px-6 py-16 sm:px-10 md:flex-row md:py-24 lg:px-12 lg:py-32">

                <div className="flex flex-1 flex-col items-start gap-4 text-left md:w-1/2">
                    {/* Top Tagline (Light Blue/Cyan) */}
                    <h3 className="dc-animate-fade-up text-3xl font-bold text-[#67B5D1] sm:text-4xl">
                        Besuchen Sie uns auf der Messe!
                    </h3>

                    {/* Event Section */}
                    <div className="dc-animate-fade-up flex flex-col gap-1">
                        <div className="flex items-center gap-4">
                            {/* Replace with your actual Logo component or <img> */}
                            <img src="/banner_icon.png" alt="Intergastra Logo" className="h-12 w-auto" />

                            <h2 className="text-5xl font-black uppercase tracking-tight text-black sm:text-6xl">
                                INTERGASTRA
                            </h2>
                        </div>

                        {/* Subtitle / Description */}
                        <p className="text-xl font-semibold text-black/90 sm:text-2xl">
                            Leitmesse für Hotellerie & Gastronomie
                        </p>

                        {/* Date and Location */}
                        <p className="text-2xl font-black text-black sm:text-3xl">
                            7.–11.2.2026 | <span className="font-bold">Messe Stuttgart</span>
                        </p>
                        <p className="font-black text-black">
                            Halle 5, Stand 5A32 <br />
                            <span className="font-bold">(I-team Germany)</span>
                        </p>
                    </div>
                </div>

                {/* Image - Right Side */}
                <div className="relative flex flex-1 justify-center md:h-[550px] md:w-1/2 md:justify-end">
                    <div className="relative h-[300px] w-full overflow-hidden rounded-2xl shadow-2xl sm:h-[400px] md:h-full md:w-[90%]">
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
