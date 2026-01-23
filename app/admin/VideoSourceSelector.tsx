"use client";

import { useState, useEffect } from "react";
import { VideoUploadInput } from "./VideoUploadInput";

interface VideoSourceSelectorProps {
  currentYoutubeUrl: string;
  currentVideoFileUrl: string;
}

export function VideoSourceSelector({
  currentYoutubeUrl,
  currentVideoFileUrl,
}: VideoSourceSelectorProps) {
  // Determine initial source type based on what's currently set
  const [sourceType, setSourceType] = useState<"youtube" | "file">(
    currentVideoFileUrl ? "file" : "youtube"
  );

  useEffect(() => {
    // Update source type if current values change
    if (currentVideoFileUrl) {
      setSourceType("file");
    } else if (currentYoutubeUrl) {
      setSourceType("youtube");
    }
  }, [currentYoutubeUrl, currentVideoFileUrl]);

  return (
    <div className="space-y-4">
      {/* Source Type Selection */}
      <div className="flex items-center gap-6 rounded-xl border border-brand/10 bg-brand-surface/20 p-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="videoSourceType"
            value="youtube"
            checked={sourceType === "youtube"}
            onChange={(e) => setSourceType(e.target.value as "youtube" | "file")}
            className="h-4 w-4 cursor-pointer text-brand-cta focus:ring-2 focus:ring-brand/30"
          />
          <span className="text-sm font-bold text-ink">YouTube-URL</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="videoSourceType"
            value="file"
            checked={sourceType === "file"}
            onChange={(e) => setSourceType(e.target.value as "youtube" | "file")}
            className="h-4 w-4 cursor-pointer text-brand-cta focus:ring-2 focus:ring-brand/30"
          />
          <span className="text-sm font-bold text-ink">Video-Datei hochladen</span>
        </label>
      </div>

      {/* YouTube URL Input */}
      {sourceType === "youtube" && (
        <div className="rounded-xl border border-brand/10 bg-white p-4">
          <label htmlFor="youtubeUrl" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            YouTube-URL
          </label>
          <input
            id="youtubeUrl"
            name="youtubeUrl"
            type="url"
            defaultValue={currentYoutubeUrl}
            className="mt-2 w-full max-w-2xl rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
            placeholder="https://youtu.be/..."
          />
          <p className="mt-1 text-xs font-semibold text-gray-500">
            Geben Sie eine YouTube-Video-URL zum Einbetten ein
          </p>
          {/* Clear videoFileUrl when using YouTube - only if form is submitted */}
          <input type="hidden" name="clearVideoFile" value="true" />
        </div>
      )}

      {/* File Upload Input */}
      {sourceType === "file" && (
        <div className="rounded-xl border border-brand/10 bg-white p-4">
          <label htmlFor="videoFile" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Video-Datei hochladen
          </label>
          <VideoUploadInput currentVideoUrl={currentVideoFileUrl} />
          <p className="mt-1 text-xs font-semibold text-gray-500">
            Unterstützte Formate: MP4, WebM, OGG, MOV, AVI (max. 100MB)
          </p>
          {/* Clear youtubeUrl when using file upload - only if form is submitted */}
          <input type="hidden" name="clearYoutubeUrl" value="true" />
        </div>
      )}
    </div>
  );
}
