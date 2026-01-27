"use client";

import { useState, useEffect, useRef } from "react";
import { ImageUploadInput } from "./ImageUploadInput";

// Component for uploading stat icons
function StatIconUploadInput({
  currentIconUrl,
  onUploadComplete,
  label,
  statIndex,
}: {
  currentIconUrl: string;
  onUploadComplete: (url: string) => void;
  label: string;
  statIndex: number;
}) {
  const [iconUrl, setIconUrl] = useState(currentIconUrl || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIconUrl(currentIconUrl || "");
  }, [currentIconUrl]);

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
      </label>

      <input type="hidden" id={`stat_icon_${statIndex}`} value={iconUrl} />

      <input
        type="text"
        value={iconUrl}
        onChange={(e) => {
          const newUrl = e.target.value;
          setIconUrl(newUrl);
          onUploadComplete(newUrl);
          const hiddenInput = document.getElementById(
            `stat_icon_${statIndex}`
          ) as HTMLInputElement;
          if (hiddenInput) hiddenInput.value = newUrl;
        }}
        placeholder="/cleaner.svg oder URL eingeben"
        className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
      />

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
              alert(
                `Dateigröße überschreitet das Limit von 10MB. Aktuelle Größe: ${(
                  file.size /
                  (1024 * 1024)
                ).toFixed(2)}MB`
              );
              return;
            }

            const allowedTypes = [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/gif",
              "image/webp",
              "image/svg+xml",
            ];
            if (!allowedTypes.includes(file.type)) {
              alert(
                "Ungültiger Dateityp. Bitte laden Sie eine Bilddatei hoch (JPEG, PNG, GIF, WebP oder SVG)."
              );
              return;
            }

            try {
              const formData = new FormData();
              formData.append("image", file);

              const response = await fetch("/api/upload-image", {
                method: "POST",
                body: formData,
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || "Upload fehlgeschlagen");
              }

              setIconUrl(data.url);
              onUploadComplete(data.url);
              const hiddenInput = document.getElementById(
                `stat_icon_${statIndex}`
              ) as HTMLInputElement;
              if (hiddenInput) hiddenInput.value = data.url;
            } catch (error) {
              alert(
                error instanceof Error
                  ? error.message
                  : "Bild-Upload fehlgeschlagen"
              );
            } finally {
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }
          }}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center rounded-lg border border-brand/25 bg-white px-3 py-1.5 text-xs font-medium text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand-surface hover:shadow"
        >
          Icon auswählen
        </button>
        <span className="text-[11px] text-gray-500">
          PNG/SVG, max. 10MB
        </span>
      </div>
      {iconUrl && (
        <div className="mt-2">
          <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-brand/20 bg-gray-50">
            <img
              src={iconUrl}
              alt="Icon preview"
              className="h-full w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface Stat {
  icon: string;
  label: string;
  value: string;
  sub: string;
}

interface StatsInputProps {
  initialStats?: Stat[];
  name: string;
  label?: string;
}

export function StatsInput({ initialStats = [], name, label = "Einsparungen (Stats)" }: StatsInputProps) {
  const [stats, setStats] = useState<Stat[]>(initialStats.length > 0 ? initialStats : [{ icon: "", label: "", value: "", sub: "" }]);

  useEffect(() => {
    if (initialStats && initialStats.length > 0) {
      setStats(initialStats);
    } else if (stats.length === 0) {
      setStats([{ icon: "", label: "", value: "", sub: "" }]);
    }
  }, [initialStats]);

  // Sync hidden input with stats changes
  useEffect(() => {
    const hiddenInput = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = JSON.stringify(stats);
    }
  }, [stats, name]);

  const addStat = () => {
    setStats([...stats, { icon: "", label: "", value: "", sub: "" }]);
  };

  const removeStat = (index: number) => {
    if (stats.length > 1) {
      setStats(stats.filter((_, i) => i !== index));
    }
  };

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    setStats(updated);
    // Update hidden input
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
          onClick={addStat}
          className="rounded-full border border-brand/25 bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand-surface hover:shadow"
        >
          + Stat hinzufügen
        </button>
      </div>

      <input 
        type="hidden" 
        name={name} 
        value={JSON.stringify(stats)} 
        key={JSON.stringify(stats)} 
      />

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl border border-brand/20 bg-brand-surface/10 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">Stat #{index + 1}</span>
              {stats.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStat(index)}
                  className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-red-700"
                >
                  Entfernen
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <StatIconUploadInput
                  currentIconUrl={stat.icon}
                  onUploadComplete={(url) => updateStat(index, "icon", url)}
                  label="Icon"
                  statIndex={index}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Label *
                </label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(index, "label", e.target.value)}
                  placeholder="Wasser"
                  required
                  className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Value *
                </label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(index, "value", e.target.value)}
                  placeholder="15.2 L"
                  required
                  className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Sub (optional)
                </label>
                <input
                  type="text"
                  value={stat.sub}
                  onChange={(e) => updateStat(index, "sub", e.target.value)}
                  placeholder="*ECO - Modus"
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
