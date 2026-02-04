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
    const backgroundImage = site.bannerSection?.backgroundImage || "/images/uploads/img_1770202317899.png";

    return (
        <section className="relative h-[400px] w-full overflow-hidden sm:h-[500px] md:h-[600px] lg:h-[850px] ">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={backgroundImage}
                    alt="Cleaning Banner"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent sm:via-black/30" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-6 text-left text-white sm:px-10 lg:px-12">
                <h2 className="dc-animate-fade-up max-w-3xl text-4xl font-extrabold tracking-tight drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.1]">
                    {title}
                </h2>
                <p className="dc-animate-fade-up mt-6 max-w-xl text-lg font-medium text-gray-100 opacity-90 drop-shadow-md delay-100 sm:text-xl lg:mt-8">
                    {subtitle}
                </p>
                <div className="dc-animate-fade-up mt-10 delay-200">
                    <a
                        href={ctaLink}
                        className="group inline-flex items-center rounded-full bg-gradient-to-r from-brand to-brand-cta px-8 py-4 text-lg font-bold text-white shadow-xl ring-2 ring-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:ring-white/30 active:scale-95"
                    >
                        {ctaLabel}
                        <svg
                            className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};
