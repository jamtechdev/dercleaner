"use client";

import { useState, useRef } from "react";

interface VideoUploadInputProps {
  currentVideoUrl: string;
}

export function VideoUploadInput({ currentVideoUrl }: VideoUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(currentVideoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setUploadError(`Dateigröße überschreitet das Limit von 100MB. Aktuelle Größe: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    // Validate file type
    const allowedTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Ungültiger Dateityp. Bitte laden Sie eine Videodatei hoch (MP4, WebM, OGG, MOV oder AVI).");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload fehlgeschlagen");
      }

      setUploadedUrl(data.url);
      setUploadSuccess(true);
      
      // Store the URL in a hidden input for form submission
      const hiddenInput = document.getElementById("videoFileUrl") as HTMLInputElement;
      if (hiddenInput) {
        hiddenInput.value = data.url;
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Video-Upload fehlgeschlagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <input
        type="hidden"
        id="videoFileUrl"
        name="videoFileUrl"
        value={uploadedUrl}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            ref={fileInputRef}
            id="videoFile"
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full cursor-pointer rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink transition file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-cta file:px-4 file:py-2 file:text-sm file:font-extrabold file:text-white file:transition hover:border-brand/40 hover:file:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        {uploadedUrl && (
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full border border-brand/25 bg-white px-4 py-2.5 text-xs font-bold text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand-surface hover:shadow"
          >
            Aktuelles anzeigen
          </a>
        )}
      </div>
      {uploading && (
        <p className="text-xs font-semibold text-brand">Video wird hochgeladen...</p>
      )}
      {uploadError && (
        <p className="text-xs font-semibold text-red-600">{uploadError}</p>
      )}
      {uploadSuccess && (
        <p className="text-xs font-semibold text-green-600">
          Video erfolgreich hochgeladen! Vergessen Sie nicht, auf &quot;Änderungen speichern&quot; zu klicken.
        </p>
      )}
      {uploadedUrl && !uploadSuccess && (
        <p className="text-xs font-semibold text-gray-500">
          Aktuelles Video: {uploadedUrl}
        </p>
      )}
    </div>
  );
}
