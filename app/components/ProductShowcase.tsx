"use client";

import Image from "next/image";
import { useState } from "react";

type Product = {
  id: string;
  tabTitle: string;
  tabDesc?: string;
  tabImage: { src: string; alt: string };
  name: string;
  heroImage: { src: string; alt: string };
  savingsTitle: string;
  savingsSubtitle: string;
  stats: { icon: string; label: string; value: string; sub: string }[];
};

export default function ProductShowcase({ site }: { site: any }) {
  const products = site.productsSection.products as Product[];
  const [activeId, setActiveId] = useState<string>(products[0]?.id ?? "");

  const activeProduct = products.find((p) => p.id === activeId) ?? products[0];
  if (!activeProduct) return null;

  return (
    <section
      id="produkte"
      className="scroll-mt-24 flex flex-col md:flex-row min-h-[600px] w-full bg-white font-sans"
    >
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-1/4 bg-brand-soft flex flex-col">
        {products.map((p) => (
          <ProductTab
            key={p.id}
            name={p.tabTitle}
            desc={p.tabDesc}
            imageSrc={p.tabImage.src}
            imageAlt={p.tabImage.alt}
            isActive={p.id === activeId}
            onClick={() => setActiveId(p.id)}
          />
        ))}
      </aside>

      {/* Main Content Area */}
      <div className="relative flex-1 flex flex-col md:flex-row items-center gap-8 md:gap-0 p-6 sm:p-8 md:p-16">
        <div
          key={activeProduct.id}
          className="dc-animate-fade-up contents"
        >
          {/* Large Product Image */}
          <div className="relative w-full md:w-1/2 h-[280px] sm:h-[360px] md:h-[400px]">
            <Image
              key={activeProduct.heroImage.src}
              src={activeProduct.heroImage.src}
              alt={activeProduct.heroImage.alt}
              fill
              className="object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 space-y-5 md:space-y-6">
            <header className="dc-animate-fade-up">
              <h2 className="text-brand text-3xl sm:text-4xl font-bold italic">
                {activeProduct.name}
              </h2>
              <p className="text-gray-700 text-lg sm:text-xl font-semibold mt-2">
                {activeProduct.savingsTitle} <br />
                <span className="font-normal text-gray-500">
                  {activeProduct.savingsSubtitle}
                </span>
              </p>
            </header>

            {/* Stats Cards */}
            <div className="space-y-4">
              {activeProduct.stats.map((s) => (
                <StatCard
                  key={s.label}
                  icon={s.icon}
                  label={s.label}
                  value={s.value}
                  sub={s.sub}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-4">
              <button className="flex items-center text-gray-800 font-bold border-b-2 border-black pb-1">
                {site.productsSection.actions.techDataLabel}{" "}
                <span className="ml-2">→</span>
              </button>
              <button className="bg-ink text-white w-full sm:w-auto px-10 py-3 rounded-full font-bold hover:bg-black transition-colors">
                {site.productsSection.actions.demoLabel}
              </button>
            </div>
          </div>
        </div>

        {/* Section Label */}
        {/* <div className="absolute bottom-4 left-4 bg-white border border-gray-200 px-2 py-1 text-[10px] rounded">
          Section 3
        </div> */}
      </div>
    </section>
  );
}

// Helper: Sidebar Tab
function ProductTab({
  name,
  desc,
  imageSrc,
  imageAlt,
  isActive,
  onClick,
}: {
  name: string;
  desc?: string;
  imageSrc: string;
  imageAlt: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 sm:p-6 border-b border-cyan-100 text-left transition-colors ${
        isActive
          ? "bg-brand text-white"
          : "hover:bg-brand-soft/60 text-brand"
      }`}
      aria-pressed={isActive}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex-shrink-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="font-bold text-base sm:text-lg">{name}</h3>
          {desc && (
            <p className="text-xs mt-1 leading-tight opacity-90">
              {desc}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

// Helper: Stat Card
function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex items-center bg-card p-4 rounded-2xl w-full max-w-sm shadow-sm">
      <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white text-xl mr-4">
        {icon}
      </div>
      <div>
        <p className="text-brand font-bold text-sm leading-none">{label}</p>
        <p className="text-xl font-black text-gray-800">{value}</p>
        <p className="text-[10px] text-gray-500 font-bold">{sub}</p>
      </div>
    </div>
  );
}