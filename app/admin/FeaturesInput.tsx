"use client";

import { useState, useEffect, useRef } from "react";

interface Feature {
  number: string;
  title: string;
  description: string;
}

interface FeaturesData {
  heading?: string;
  items: Feature[];
}

interface FeaturesInputProps {
  initialFeatures?: Feature[] | FeaturesData;
  name: string;
  label?: string;
}

export function FeaturesInput({ 
  initialFeatures = [], 
  name, 
  label = "Funktionen" 
}: FeaturesInputProps) {
  // Handle both old format (array) and new format (object with heading and items)
  const getInitialData = (features: Feature[] | FeaturesData | undefined): FeaturesData => {
    if (!features || (Array.isArray(features) && features.length === 0)) {
      return { heading: "", items: [{ number: "", title: "", description: "" }] };
    }
    if (Array.isArray(features)) {
      return { heading: "", items: features };
    }
    return features as FeaturesData;
  };
  
  const [data, setData] = useState<FeaturesData>(() => getInitialData(initialFeatures));
  const prevPropsRef = useRef<string>(JSON.stringify(initialFeatures));
  const isFirstRender = useRef(true);
  
  useEffect(() => {
    const currentPropsStr = JSON.stringify(initialFeatures);
    
    // Skip on first render - state is already initialized
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPropsRef.current = currentPropsStr;
      return;
    }
    
    // Only update if props actually changed (deep comparison via string)
    if (prevPropsRef.current !== currentPropsStr) {
      prevPropsRef.current = currentPropsStr;
      const newData = getInitialData(initialFeatures);
      setData(newData);
    }
  }, [initialFeatures]);

  // Sync hidden input with data changes
  useEffect(() => {
    const hiddenInput = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = JSON.stringify(data);
    }
  }, [data, name]);

  const updateHeading = (value: string) => {
    const updated = { ...data, heading: value };
    setData(updated);
    const hiddenInput = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = JSON.stringify(updated);
    }
  };

  const addFeature = () => {
    const updated = { ...data };
    if (!updated.items) {
      updated.items = [];
    }
    updated.items.push({ number: "", title: "", description: "" });
    setData(updated);
    const hiddenInput = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = JSON.stringify(updated);
    }
  };

  const removeFeature = (index: number) => {
    const updated = { ...data };
    if (updated.items && updated.items.length > 1) {
      updated.items = updated.items.filter((_, i) => i !== index);
      setData(updated);
      const hiddenInput = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
      if (hiddenInput) {
        hiddenInput.value = JSON.stringify(updated);
      }
    }
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const updated = { ...data };
    if (!updated.items) {
      updated.items = [];
    }
    updated.items[index] = { ...updated.items[index], [field]: value };
    setData(updated);
    const hiddenInput = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = JSON.stringify(updated);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
          {label}
        </label>
        <button
          type="button"
          onClick={addFeature}
          className="rounded-full border border-brand/25 bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand-surface hover:shadow"
        >
          + Funktion hinzufügen
        </button>
      </div>

      <input 
        type="hidden" 
        name={name} 
        value={JSON.stringify(data)} 
        key={JSON.stringify(data)} 
      />

      {/* Heading */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Überschrift (optional)
        </label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => updateHeading(e.target.value)}
          placeholder="Funktionen"
          className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div className="space-y-4">
        {data.items.map((feature, index) => (
          <div
            key={index}
            className="rounded-xl border border-brand/20 bg-brand-surface/10 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">Funktion #{index + 1}</span>
              {data.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-red-700"
                >
                  Entfernen
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Seriennummer *
                </label>
                <input
                  type="text"
                  value={feature.number}
                  onChange={(e) => updateFeature(index, "number", e.target.value)}
                  placeholder="01"
                  required
                  className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Titel *
                </label>
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) => updateFeature(index, "title", e.target.value)}
                  placeholder="Ergonomic handle"
                  required
                  className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Beschreibung *
                </label>
                <textarea
                  value={feature.description}
                  onChange={(e) => updateFeature(index, "description", e.target.value)}
                  placeholder="New integrated blue handles..."
                  required
                  rows={3}
                  className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
