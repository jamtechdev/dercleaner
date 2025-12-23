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
  video?: { src: string; alt: string };
  featuresImage?: { src: string; alt: string };
  savingsTitle: string;
  savingsSubtitle: string;
  stats: { icon: string; label: string; value: string; sub: string }[];
  description?: string;
  technicalSpecs?: { label: string; value: string }[];
  features?: { number: string; title: string; description: string }[];
};

export default function ProductShowcase({ site }: { site: any }) {
  const products = site.productsSection.products as Product[];
  const [activeId, setActiveId] = useState<string>(products[0]?.id ?? "");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeProduct = products.find((p) => p.id === activeId) ?? products[0];
  if (!activeProduct) return null;

  return (
    <section
      id="produkte"
      className="scroll-mt-24 flex flex-col md:flex-row min-h-[600px] w-full bg-white font-sans"
    >

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-1/3 flex flex-col gap-4 md:ml-6 bg-[var(--tertiary-color)] py-8 md:pt-20 md:pb-12 imop-buttons">
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
          <div className="relative w-full md:w-1/2 h-[280px] sm:h-[360px] md:h-[550px]">
            <Image
              key={activeProduct.heroImage.src}
              src={activeProduct.heroImage.src}
              alt={activeProduct.heroImage.alt}
              fill
              className="object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 space-y-5 md:space-y-10">
            <header className="dc-animate-fade-up md:mb-15">
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
            <div className="space-y-4 md:space-y-10 einsparungen-boxes ">
              {activeProduct.stats.map((s,index) => (
                <StatCard
                  key={s.label}
                  icon={s.icon}
                  label={s.label}
                  value={s.value}
                  sub={s.sub}
                  index={index}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-4 md:space-y-14 technishe-daten">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-start text-gray-800 font-bold pb-1 flex-col hover:opacity-80 transition-opacity cursor-pointer"
              >
                {site.productsSection.actions.techDataLabel}{" "}

                <span className="">
                  <svg width="150" height="15" viewBox="0 0 195 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M194.707 8.07112C195.098 7.6806 195.098 7.04743 194.707 6.65691L188.343 0.292946C187.953 -0.0975785 187.319 -0.0975785 186.929 0.292946C186.538 0.68347 186.538 1.31664 186.929 1.70716L192.586 7.36401L186.929 13.0209C186.538 13.4114 186.538 14.0446 186.929 14.4351C187.319 14.8256 187.953 14.8256 188.343 14.4351L194.707 8.07112ZM0 7.36401V8.36401H194V7.36401V6.36401H0V7.36401Z" fill="black" />
                  </svg>
                </span>

              </button>
              <button className="bg-ink text-white w-full sm:w-auto px-10 py-3 rounded-full font-bold hover:bg-black hover:scale-105 transition-all duration-300 demo-buchen">
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

      {/* Product Details Modal */}
      {isModalOpen && (
        <ProductDetailsModal
          product={activeProduct}
          onClose={() => setIsModalOpen(false)}
        />
      )}
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
      className={`p-4 sm:p-6 text-left transition-colors md:py-10 md:my-5 ${isActive
        ? "bg-[var(--primary-color)] text-white active-product"
        : "bg-[var(--secondary-color)]  text-[var(--primary-color)]"
        }`}
      aria-pressed={isActive}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 sm:w-16 sm:h-16 relative flex-shrink-0">
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
            <p className="text-xs mt-1 leading-tight ">
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
  index
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  index: number;
}) {
  return (
    <div className="flex items-center p-4 rounded-2xl w-full max-w-sm bg-[var(--tertiary-color)]">
    <div className={`w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white text-xl mr-4 imop-img stack-card-${label}`} >
        <img
          src={icon} // Path to the SVG file
          alt={label} // Alternative text for accessibility
          className={`w-6 h-6`} // Styling
        />
      </div>
      <div>
        <p className="text-brand font-bold text-[18px] leading-none mb-1">{label}</p>
        <p className="text-[16px] md:text-xl font-medium text-gray-800 leading-none">{value}</p>
        <p className="text-[14px] md:text-[18px] font-medium text-gray-800">{sub}</p>
      </div>
    </div>
  );
}

// Product Details Modal
function ProductDetailsModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Modal Content */}
        <div className="p-6 md:p-10">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-brand text-3xl md:text-4xl font-bold italic mb-2">
              {product.name}
            </h2>
            {product.description && (
              <p className="text-gray-600 text-lg mb-4">{product.description}</p>
            )}
            {product.tabDesc && !product.description && (
              <p className="text-gray-600 text-lg">{product.tabDesc}</p>
            )}
          </div>

          {/* Product Image or Video */}
          <div className={`relative w-full h-[300px] md:h-[490px] mb-8 bg-gray-50 rounded-xl overflow-hidden imop-pop-box ${product.id}`}>
            {product.featuresImage && product.featuresImage.src ? (
              <Image
                src={product.featuresImage.src}
                alt={product.featuresImage.alt}
                fill
                className="object-contain p-4"
              />
            ) : product.video && product.video.src ? (
              <video
                src={product.video.src}
                controls
                className="w-full h-full object-contain"
                aria-label={product.video.alt}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={product.heroImage.src}
                alt={product.heroImage.alt}
                fill
                className="object-contain p-4"
              />
            )}
          </div>

          {/* Savings Info */}
          <div className="mb-8 p-6 bg-[var(--tertiary-color)] rounded-2xl">
            <h3 className="text-gray-700 text-xl font-semibold mb-2">
              {product.savingsTitle}
            </h3>
            <p className="text-gray-500 text-lg">
              {product.savingsSubtitle}
            </p>
          </div>

          {/* Stats Grid - Savings */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Einsparungen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center p-5 rounded-2xl bg-[var(--tertiary-color)]"
                >
                  <div className="w-14 h-14 bg-brand rounded-full flex items-center justify-center text-white text-2xl mr-4 flex-shrink-0 pop-up-icons">
                    {/* {stat.icon} */}
                    <img
                      src={stat.icon}
                      alt={stat.label}
                    // className="w-full h-auto"
                    />
                  </div>
                  <div>
                    <p className="text-brand font-bold text-lg leading-none mb-1">
                      {stat.label}
                    </p>
                    <p className="text-xl font-medium text-gray-800 leading-none mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 pop-up-date">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          {product.technicalSpecs && product.technicalSpecs.length > 0 && (
            <div className="mb-8 border-t pt-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Technische Daten</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.technicalSpecs.map((spec, index) => (
                  <div
                    key={index}
                    className=" justify-between p-5 rounded-2xl bg-[var(--tertiary-color)] pop-up-technische-box"
                  >
                    <span className="daten-icons">
                      <img
                        src={spec.icon}
                        alt={spec.label}
                      // className="w-full h-auto"
                      />
                    </span>

                    <p className="text-brand font-bold text-lg">
                      {spec.label}:
                    </p>
                    <p className="text-xl font-medium text-gray-800 pop-up-date">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Features</h3>
              <div className="space-y-6">
                {product.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-5 rounded-2xl bg-[var(--tertiary-color)]"
                  >
                    <div className="flex-shrink-0">
                      <span className="text-brand font-bold text-2xl">
                        {feature.number}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}