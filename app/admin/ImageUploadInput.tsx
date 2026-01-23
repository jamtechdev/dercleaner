"use client";

import { useState, useRef, useEffect } from "react";

interface ImageUploadInputProps {
  currentImageUrl?: string;
  onUploadComplete: (url: string) => void;
  label: string;
  name: string;
  accept?: string;
}

export function ImageUploadInput({
  currentImageUrl,
  onUploadComplete,
  label,
  name,
  accept = "image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml",
}: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(currentImageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with currentImageUrl prop
  useEffect(() => {
    if (currentImageUrl !== undefined) {
      setUploadedUrl(currentImageUrl);
      const hiddenInput = document.getElementById(name) as HTMLInputElement;
      if (hiddenInput) hiddenInput.value = currentImageUrl;
    }
  }, [currentImageUrl, name]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError(`Dateigröße überschreitet das Limit von 10MB. Aktuelle Größe: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Ungültiger Dateityp. Bitte laden Sie eine Bilddatei hoch (JPEG, PNG, GIF, WebP oder SVG).");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

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

      setUploadedUrl(data.url);
      setUploadSuccess(true);
      // Update hidden input
      const hiddenInput = document.getElementById(name) as HTMLInputElement;
      if (hiddenInput) hiddenInput.value = data.url;
      onUploadComplete(data.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Bild-Upload fehlgeschlagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={`${name}_text`} className="block text-xs font-bold uppercase tracking-wider text-gray-500">
        {label}
      </label>
      
      {/* Hidden input to store the URL for form submission */}
      <input type="hidden" name={name} id={name} value={uploadedUrl} />
      
      {/* URL input for manual entry or display */}
      <input
        type="text"
        id={`${name}_text`}
        value={uploadedUrl}
        onChange={(e) => {
          const newUrl = e.target.value;
          setUploadedUrl(newUrl);
          onUploadComplete(newUrl);
          // Update hidden input
          const hiddenInput = document.getElementById(name) as HTMLInputElement;
          if (hiddenInput) hiddenInput.value = newUrl;
        }}
        placeholder="/images/products/product_123.jpg oder URL eingeben"
        className="mt-2 w-full rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
      />

      {/* File upload input */}
      <div className="mt-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={`${name}_file`}
        />
        <label
          htmlFor={`${name}_file`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-brand/25 bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand-surface hover:shadow"
        >
          {uploading ? (
            <>
              <svg className="h-4 w-4 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Wird hochgeladen...</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Bild hochladen</span>
            </>
          )}
        </label>
      </div>

      {/* Preview */}
      {uploadedUrl && (
        <div className="mt-2">
          <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-brand/20 bg-gray-50">
            <img
              src={uploadedUrl}
              alt="Preview"
              className="h-full w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      )}

      {/* Success message */}
      {uploadSuccess && (
        <p className="text-xs font-semibold text-green-600">
          Bild erfolgreich hochgeladen!
        </p>
      )}

      {/* Error message */}
      {uploadError && (
        <p className="text-xs font-semibold text-red-600">
          {uploadError}
        </p>
      )}
    </div>
  );
}
