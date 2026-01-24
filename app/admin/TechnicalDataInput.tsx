"use client";

import { useState, useEffect, useRef } from "react";

interface TechnicalDataItem {
  label: string;
  value: string;
  icon?: string;
}

interface TechnicalData {
  heading?: string;
  items: TechnicalDataItem[];
}

interface TechnicalDataInputProps {
  initialData?: TechnicalData | TechnicalDataItem[]; // Support both old (array) and new (object) format
  name: string;
  label?: string;
}

export function TechnicalDataInput({ 
  initialData, 
  name, 
  label = "Technische Daten" 
}: TechnicalDataInputProps) {
  // Handle both old format (array) and new format (object with heading and items)
  const getInitialData = (data: TechnicalData | TechnicalDataItem[] | undefined): TechnicalData => {
    if (!data) {
      return {
        heading: "",
        items: [
          { label: "Duration", value: "", icon: "" },
          { label: "Practical performance", value: "", icon: "" },
          { label: "Brush speed", value: "", icon: "" },
        ],
      };
    }
    // If it's an array (old format), convert to new format
    if (Array.isArray(data)) {
      return {
        heading: "",
        items: data as any,
      };
    }
    // Ensure items array exists
    if (!data.items || !Array.isArray(data.items)) {
      return {
        heading: data.heading || "",
        items: [
          { label: "Duration", value: "", icon: "" },
          { label: "Practical performance", value: "", icon: "" },
          { label: "Brush speed", value: "", icon: "" },
        ],
      };
    }
    return data;
  };

  const [data, setData] = useState<TechnicalData>(() => getInitialData(initialData));
  const prevPropsRef = useRef<string | null>(null);
  const isFirstRender = useRef(true);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Create a stable string representation for comparison
    const currentStr = JSON.stringify(initialData);
    
    // Skip on initial mount - state is already initialized, just store the ref
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPropsRef.current = currentStr;
      return;
    }
    
    // Only update if the initialData actually changed (compare stringified versions)
    if (prevPropsRef.current !== currentStr) {
      prevPropsRef.current = currentStr;
      const newData = getInitialData(initialData);
      setData(newData);
    }
  }, [initialData]);

  // Sync hidden input with data changes
  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = JSON.stringify(data);
    }
  }, [data]);

  const updateHeading = (value: string) => {
    const updated = { ...data, heading: value };
    setData(updated);
    // Immediately update hidden input using ref
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = JSON.stringify(updated);
    }
  };

  const updateItem = (index: number, field: keyof TechnicalDataItem, value: string) => {
    const updated = { 
      ...data,
      items: data.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    };
    setData(updated);
    // Immediately update hidden input using ref
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = JSON.stringify(updated);
    }
  };

  // Icon upload component for each item
  const IconUploadInput = ({
    currentIconUrl,
    onUploadComplete,
    label,
    itemIndex,
  }: {
    currentIconUrl: string;
    onUploadComplete: (url: string) => void;
    label: string;
    itemIndex: number;
  }) => {
    const [iconUrl, setIconUrl] = useState(currentIconUrl || "");
    const [imageKey, setImageKey] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Sync with parent prop changes
    useEffect(() => {
      const newUrl = currentIconUrl || "";
      if (newUrl !== iconUrl) {
        setIconUrl(newUrl);
        // Force image reload when URL changes from parent
        setImageKey(prev => prev + 1);
      }
    }, [currentIconUrl]);

    return (
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          {label}
        </label>
        <input
          type="text"
          value={iconUrl}
          onChange={(e) => {
            const newUrl = e.target.value;
            setIconUrl(newUrl);
            // Update parent state immediately
            onUploadComplete(newUrl);
            // Force image reload if URL changed
            if (newUrl !== currentIconUrl) {
              setImageKey(prev => prev + 1);
            }
          }}
          placeholder="/icon.svg oder URL eingeben"
          className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        <div className="mt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              setIsUploading(true);

              const maxSize = 10 * 1024 * 1024; // 10MB
              if (file.size > maxSize) {
                alert(`Dateigröße überschreitet das Limit von 10MB. Aktuelle Größe: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                setIsUploading(false);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
                return;
              }

              const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
              if (!allowedTypes.includes(file.type)) {
                alert("Ungültiger Dateityp. Bitte laden Sie eine Bilddatei hoch (JPEG, PNG, GIF, WebP oder SVG).");
                setIsUploading(false);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
                return;
              }

              try {
                const formData = new FormData();
                formData.append("image", file);

                const response = await fetch("/api/upload-image", {
                  method: "POST",
                  body: formData,
                });

                const result = await response.json();

                if (!response.ok) {
                  throw new Error(result.error || "Upload fehlgeschlagen");
                }

                // Update parent state first - this will trigger re-render with new currentIconUrl
                onUploadComplete(result.url);
                
                // Update local state for immediate UI feedback
                setIconUrl(result.url);
                // Force image reload with new key
                setImageKey(prev => prev + 1);
                
                // Reset file input to allow uploading the same file again
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
                
                setIsUploading(false);
              } catch (error) {
                alert(error instanceof Error ? error.message : "Icon-Upload fehlgeschlagen");
                setIsUploading(false);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }
            }}
            className="hidden"
            id={`tech_icon_file_${name}_${itemIndex}`}
          />
          <label
            htmlFor={`tech_icon_file_${name}_${itemIndex}`}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-brand/25 bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand-surface hover:shadow ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
          >
            <svg className="h-3 w-3 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{isUploading ? 'Wird hochgeladen...' : 'Icon hochladen'}</span>
          </label>
        </div>
        {iconUrl && (
          <div className="mt-2">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-brand/20 bg-gray-50">
              <img
                key={`${iconUrl}-${imageKey}`}
                src={`${iconUrl}${iconUrl.includes('?') ? '&' : '?'}v=${imageKey}`}
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
  };

  const addItem = () => {
    const updated = { ...data };
    if (!updated.items) {
      updated.items = [];
    }
    updated.items.push({ label: "", value: "", icon: "" });
    setData(updated);
    // Immediately update hidden input using ref
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = JSON.stringify(updated);
    }
  };

  const removeItem = (index: number) => {
    const updated = { ...data };
    if (updated.items && updated.items.length > 1) {
      updated.items = updated.items.filter((_, i) => i !== index);
      setData(updated);
      // Immediately update hidden input using ref
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = JSON.stringify(updated);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
          {label}
        </label>
      </div>

      <input 
        ref={hiddenInputRef}
        type="hidden" 
        name={name} 
        value={JSON.stringify(data)}
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
          placeholder="Technische Daten"
          className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      {/* Technical Data Items */}
      <div className="space-y-4">
        <div className="rounded-xl border border-brand/20 bg-brand-surface/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-700">Technische Daten Felder</h4>
            <button
              type="button"
              onClick={addItem}
              className="rounded-full border border-brand/25 bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand-surface hover:shadow"
            >
              + Feld hinzufügen
            </button>
          </div>
          {data.items.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">Feld #{index + 1}</span>
                {data.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-red-700"
                  >
                    Entfernen
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Label *
                  </label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateItem(index, "label", e.target.value)}
                    placeholder="Duration"
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
                    value={item.value}
                    onChange={(e) => updateItem(index, "value", e.target.value)}
                    placeholder="60 minutes"
                    required
                    className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                <div>
                  <IconUploadInput
                    currentIconUrl={item.icon || ""}
                    onUploadComplete={(url) => updateItem(index, "icon", url)}
                    label="Icon (optional)"
                    itemIndex={index}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
