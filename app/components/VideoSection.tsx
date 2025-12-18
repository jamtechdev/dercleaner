"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

// Example formats that work:
// - https://www.youtube.com/watch?v=VIDEO_ID
// - https://youtu.be/VIDEO_ID
// - https://www.youtube.com/shorts/VIDEO_ID

function toYouTubeEmbedUrl(input: string): string | null {
  if (!input?.trim()) return null;

  const tryParse = (raw: string) => {
    try {
      return new URL(raw);
    } catch {
      return null;
    }
  };

  const url = tryParse(input) ?? tryParse(`https://${input}`);
  if (!url) return null;

  const host = url.hostname.replace(/^www\./, "");
  let videoId: string | null = null;

  if (host === "youtu.be") {
    videoId = url.pathname.split("/").filter(Boolean)[0] ?? null;
  } else if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com"
  ) {
    if (url.pathname === "/watch") {
      videoId = url.searchParams.get("v");
    } else {
      const parts = url.pathname.split("/").filter(Boolean);
      // /embed/:id or /shorts/:id
      if (parts[0] === "embed" || parts[0] === "shorts") {
        videoId = parts[1] ?? null;
      }
    }
  }

  if (!videoId) return null;

  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function VideoSection({ site }: { site: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = useMemo(
    () => toYouTubeEmbedUrl(site.videoSection.youtubeUrl),
    [],
  );

  return (
    <section className="relative h-[500px] w-full overflow-hidden bg-gray-200 md:h-[600px]">
      {isPlaying && embedUrl ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <>
          {/* Background Image / Placeholder */}
          <Image
            src={site.videoSection.posterImage.src}
            alt={site.videoSection.posterImage.alt}
            fill
            className="object-cover brightness-75"
            priority
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              disabled={!embedUrl}
              className="group relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/20 backdrop-blur transition-transform hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60 disabled:cursor-not-allowed disabled:opacity-60 md:h-24 md:w-24"
              aria-label="Play YouTube video"
            >
              {/* Inner Play Icon */}
              <div className="ml-2 h-0 w-0 border-b-[12px] border-b-transparent border-l-[20px] border-l-white border-t-[12px] border-t-transparent" />
            </button>
          </div>

          {/* Label Tag (Optional) */}
          {/* <div className="absolute bottom-4 left-4 rounded bg-white/90 px-2 py-1 text-[10px] uppercase tracking-wider text-gray-600 shadow-sm">
            Section 2
          </div> */}

          {!embedUrl && (
            <div className="absolute inset-x-4 bottom-4 rounded-md bg-black/60 px-3 py-2 text-xs text-white">
              Set a valid YouTube link in{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-white">
                app/content/site.json → videoSection.youtubeUrl
              </code>
              .
            </div>
          )}
        </>
      )}
    </section>
  );
}