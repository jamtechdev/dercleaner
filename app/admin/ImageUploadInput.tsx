"use client";

import { ChangeEvent, useRef, useState } from "react";

interface ImageUploadInputProps {
  currentImageUrl?: string;
  onUploadComplete: (url: string) => void;
  label: string;
  name: string;
  accept?: string;
}

export function ImageUploadInput({
  currentImageUrl = "",
  onUploadComplete,
  label,
  name,
  accept = "image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml",
}: ImageUploadInputProps) {
  const [uploadedUrl, setUploadedUrl] = useState(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUploadedUrl(value);
    onUploadComplete(value);
    setUploadError(null);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image size must be under 10MB");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      setUploadedUrl(data.url);
      onUploadComplete(data.url);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-white/60 p-4 shadow-sm">
      <div className="space-y-1.5">
        <label
          className="block text-xs font-semibold tracking-wide text-gray-700"
          htmlFor={name}
        >
          {label}
        </label>
        <p className="text-[11px] text-gray-500">
          Füge eine Bild-URL ein oder lade eine Datei hoch (max. 10 MB).
        </p>
      </div>

      <div className="space-y-2">
        <input
          id={name}
          name={name}
          type="text"
          value={uploadedUrl}
          onChange={handleUrlChange}
          placeholder="https://... oder über die Schaltfläche unten hochladen"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={uploading}
              // id={`${name}_file`}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "Lade hoch ..." : "Bild auswählen"}
            </button>
            <span className="text-[11px] text-gray-500">
              {uploadedUrl && !uploadError
                ? "Vorschau unten aktualisiert."
                : "Noch kein Bild ausgewählt."}
            </span>
          </div>

          {uploading && (
            <span className="text-[11px] font-medium text-gray-600">
              Wird hochgeladen ...
            </span>
          )}
        </div>
      </div>

      {uploadedUrl && !uploadError && (
        <div className="mt-1 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-2">
          <p className="mb-1 text-[11px] font-medium text-gray-600">
            Vorschau
          </p>
          <div className="flex items-center justify-center rounded-md bg-white p-2">
            <img
              src={uploadedUrl}
              alt={label}
              className="max-h-40 w-auto rounded-md object-contain"
            />
          </div>
        </div>
      )}

      {uploadError && (
        <p className="text-xs font-medium text-red-600">{uploadError}</p>
      )}
    </div>
  );
}
