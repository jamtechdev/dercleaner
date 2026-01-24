"use client";

import { useState } from "react";
import { createProductAction } from "./actions";
import { ImageUploadInput } from "./ImageUploadInput";
import { StatsInput } from "./StatsInput";
import { TechnicalDataInput } from "./TechnicalDataInput";
import { FeaturesInput } from "./FeaturesInput";

export function ProductCreateForm() {
  const [tabImageUrl, setTabImageUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [featuresImageUrl, setFeaturesImageUrl] = useState("");

  return (
    <article className="rounded-3xl border-2 border-dashed border-brand/20 bg-brand-surface/10 p-6 shadow-sm sm:p-8">
      <form action={createProductAction} className="space-y-6">
        <div className="flex items-center justify-between border-b border-brand/10 pb-4">
          <h3 className="text-lg font-extrabold text-ink">
            Neues Produkt erstellen
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="new_name" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Produktname *
            </label>
            <input
              id="new_name"
              name="name"
              type="text"
              required
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor="new_tabTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Tab-Titel *
            </label>
            <input
              id="new_tabTitle"
              name="tabTitle"
              type="text"
              required
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </div>

        <div>
          <label htmlFor="new_tabDesc" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Tab-Beschreibung
          </label>
          <input
            id="new_tabDesc"
            name="tabDesc"
            type="text"
            className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        <div>
          <label htmlFor="new_description" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Beschreibung
          </label>
          <textarea
            id="new_description"
            name="description"
            rows={3}
            className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="new_savingsTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Ersparnistitel *
            </label>
            <input
              id="new_savingsTitle"
              name="savingsTitle"
              type="text"
              required
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label htmlFor="new_savingsSubtitle" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Ersparnisuntertitel *
            </label>
            <input
              id="new_savingsSubtitle"
              name="savingsSubtitle"
              type="text"
              required
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </div>

        <StatsInput name="stats" label="Einsparungen (Stats)" />

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
            <label htmlFor="new_tabImageAlt" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Tab-Bild Alt-Text
            </label>
            <input
              id="new_tabImageAlt"
              name="tabImageAlt"
              type="text"
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
            <label htmlFor="new_heroImageAlt" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Hero-Bild Alt-Text
            </label>
            <input
              id="new_heroImageAlt"
              name="heroImageAlt"
              type="text"
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
            <label htmlFor="new_featuresImageAlt" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Features-Bild Alt-Text
            </label>
            <input
              id="new_featuresImageAlt"
              name="featuresImageAlt"
              type="text"
              className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </div>

        <div>
          <label htmlFor="new_displayOrder" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Anzeigereihenfolge
          </label>
          <input
            id="new_displayOrder"
            name="displayOrder"
            type="number"
            defaultValue="0"
            className="mt-2 w-full max-w-xs rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        <TechnicalDataInput name="technicalData" label="Technische Daten" />

        <FeaturesInput name="features" label="Funktionen" />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand/10">
          <button
            type="submit"
            className="rounded-full bg-brand-cta px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:shadow-lg hover:opacity-95"
          >
            Produkt erstellen
          </button>
        </div>
      </form>
    </article>
  );
}
