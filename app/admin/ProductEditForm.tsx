"use client";

import { useState, useEffect } from "react";
import { updateProductAction } from "./actions";
import { ImageUploadInput } from "./ImageUploadInput";
import { DeleteProductButton } from "./DeleteProductButton";
import { StatsInput } from "./StatsInput";
import { TechnicalDataInput } from "./TechnicalDataInput";
import { FeaturesInput } from "./FeaturesInput";
import { RichTextEditor } from "./RichTextEditor";

export function ProductEditForm({ product }: { product: any }) {
  const [tabImageUrl, setTabImageUrl] = useState(product.tabImage?.src || "");
  const [heroImageUrl, setHeroImageUrl] = useState(product.heroImage?.src || "");
  const [featuresImageUrl, setFeaturesImageUrl] = useState(product.featuresImage?.src || "");

  useEffect(() => {
    setTabImageUrl(product.tabImage?.src || "");
    setHeroImageUrl(product.heroImage?.src || "");
    setFeaturesImageUrl(product.featuresImage?.src || "");
  }, [product]);

  return (
    <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
      <form action={updateProductAction} className="space-y-6">
        <input type="hidden" name="id" value={product.id} />

        <div className="flex items-center justify-between border-b border-brand/10 pb-4">
          <h3 className="text-lg font-extrabold text-ink">
            {product.name || "Unbenanntes Produkt"}
          </h3>
          <DeleteProductButton productId={product.id} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`name_${product.id}`} className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Produktname *
            </label>
            <input
              id={`name_${product.id}`}
              name="name"
              type="text"
              defaultValue={product.name ?? ""}
              required
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor={`tabTitle_${product.id}`} className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Tab-Titel *
            </label>
            <input
              id={`tabTitle_${product.id}`}
              name="tabTitle"
              type="text"
              defaultValue={product.tabTitle ?? ""}
              required
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </div>

        <div>
          <label htmlFor={`tabDesc_${product.id}`} className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Tab-Beschreibung
          </label>
          <input
            id={`tabDesc_${product.id}`}
            name="tabDesc"
            type="text"
            defaultValue={product.tabDesc ?? ""}
            className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        <div>
          <label htmlFor={`description_${product.id}`} className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Beschreibung
          </label>
          <div className="mt-2">
            <RichTextEditor
              name="description"
              defaultValue={product.description ?? ""}
              placeholder="Produktbeschreibung..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`savingsTitle_${product.id}`} className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Ersparnistitel *
            </label>
            <input
              id={`savingsTitle_${product.id}`}
              name="savingsTitle"
              type="text"
              defaultValue={product.savingsTitle ?? ""}
              required
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor={`savingsSubtitle_${product.id}`} className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Ersparnisuntertitel *
            </label>
            <input
              id={`savingsSubtitle_${product.id}`}
              name="savingsSubtitle"
              type="text"
              defaultValue={product.savingsSubtitle ?? ""}
              required
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </div>

        <StatsInput
          name="stats"
          label="Einsparungen (Stats)"
          initialStats={product.stats || []}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <ImageUploadInput
              currentImageUrl={tabImageUrl}
              onUploadComplete={(url) => {
                setTabImageUrl(url);
              }}
              label="Tab-Bild *"
              name="tabImageSrc"
            />
          </div>
          <div>
            <label htmlFor={`tabImageAlt_${product.id}`} className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Tab-Bild Alt-Text
            </label>
            <input
              id={`tabImageAlt_${product.id}`}
              name="tabImageAlt"
              type="text"
              defaultValue={product.tabImage?.alt ?? ""}
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <ImageUploadInput
              currentImageUrl={heroImageUrl}
              onUploadComplete={(url) => {
                setHeroImageUrl(url);
              }}
              label="Hero-Bild *"
              name="heroImageSrc"
            />
          </div>
          <div>
            <label htmlFor={`heroImageAlt_${product.id}`} className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Hero-Bild Alt-Text
            </label>
            <input
              id={`heroImageAlt_${product.id}`}
              name="heroImageAlt"
              type="text"
              defaultValue={product.heroImage?.alt ?? ""}
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <ImageUploadInput
              currentImageUrl={featuresImageUrl}
              onUploadComplete={(url) => {
                setFeaturesImageUrl(url);
              }}
              label="Features-Bild (optional)"
              name="featuresImageSrc"
            />
          </div>
          <div>
            <label htmlFor={`featuresImageAlt_${product.id}`} className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Features-Bild Alt-Text
            </label>
            <input
              id={`featuresImageAlt_${product.id}`}
              name="featuresImageAlt"
              type="text"
              defaultValue={product.featuresImage?.alt ?? ""}
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </div>

        <div>
          <label htmlFor={`displayOrder_${product.id}`} className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Anzeigereihenfolge
          </label>
          <input
            id={`displayOrder_${product.id}`}
            name="displayOrder"
            type="number"
            defaultValue={product.displayOrder ?? 0}
            className="mt-2 w-full max-w-xs rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        <TechnicalDataInput
          name="technicalData"
          label="Technische Daten"
          initialData={product.technicalSpecs || undefined}
        />

        <FeaturesInput
          name="features"
          label="Funktionen"
          initialFeatures={product.features || []}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand/10">
          <button
            type="submit"
            className="rounded-full bg-brand-cta px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:shadow-lg hover:opacity-95"
          >
            Änderungen speichern
          </button>
        </div>
      </form>
    </article>
  );
}
