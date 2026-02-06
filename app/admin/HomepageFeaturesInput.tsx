"use client";

import { useState, useEffect } from "react";

interface HomepageFeature {
    title: string;
    colorClass: string;
    icon: string;
    text: string;
}

interface HomepageFeaturesInputProps {
    initialFeatures?: HomepageFeature[];
    name: string;
}

export function HomepageFeaturesInput({
    initialFeatures = [],
    name,
}: HomepageFeaturesInputProps) {
    const [features, setFeatures] = useState<HomepageFeature[]>(() =>
        initialFeatures.length > 0 ? initialFeatures : [
            { title: "", colorClass: "text-gray-600", icon: "/faster.svg", text: "" }
        ]
    );

    // Sync hidden input with features changes
    useEffect(() => {
        const hiddenInput = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
        if (hiddenInput) {
            hiddenInput.value = JSON.stringify(features);
        }
    }, [features, name]);

    const addFeature = () => {
        setFeatures([
            ...features,
            { title: "", colorClass: "text-gray-600", icon: "", text: "" }
        ]);
    };

    const removeFeature = (index: number) => {
        if (features.length > 1) {
            setFeatures(features.filter((_, i) => i !== index));
        }
    };

    const updateFeature = (index: number, field: keyof HomepageFeature, value: string) => {
        const updated = [...features];
        updated[index] = { ...updated[index], [field]: value };
        setFeatures(updated);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Homepage Features
                </label>
                <button
                    type="button"
                    onClick={addFeature}
                    className="rounded-full border border-brand/25 bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand-surface hover:shadow"
                >
                    + Feature hinzufügen
                </button>
            </div>

            <input type="hidden" name={name} value={JSON.stringify(features)} />

            <div className="grid grid-cols-1 gap-4">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-brand/20 bg-brand-surface/10 p-4 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-600">Feature #{index + 1}</span>
                            {features.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-red-700"
                                >
                                    Entfernen
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Titel
                                </label>
                                <input
                                    type="text"
                                    value={feature.title}
                                    onChange={(e) => updateFeature(index, "title", e.target.value)}
                                    placeholder="z.B. schneller"
                                    className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Icon Pfad
                                </label>
                                <input
                                    type="text"
                                    value={feature.icon}
                                    onChange={(e) => updateFeature(index, "icon", e.target.value)}
                                    placeholder="z.B. /faster.svg"
                                    className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Farbe (Tailwind Class)
                                </label>
                                <input
                                    type="text"
                                    value={feature.colorClass}
                                    onChange={(e) => updateFeature(index, "colorClass", e.target.value)}
                                    placeholder="z.B. text-gray-600"
                                    className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Beschreibung
                                </label>
                                <textarea
                                    value={feature.text}
                                    onChange={(e) => updateFeature(index, "text", e.target.value)}
                                    rows={2}
                                    placeholder="Feature Beschreibung..."
                                    className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
