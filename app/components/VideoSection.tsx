"use client";

import { useRef, useEffect } from "react";

// Helper function to extract YouTube video ID from URL
function extractYouTubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
}

export function VideoSection({ site }: { site: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Autoplay video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        // Handle autoplay errors (browser may block autoplay)
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);

  // Determine video source: prefer uploaded file, fallback to YouTube embed, then default
  const videoSrc = site.videoSection?.videoFileUrl
    ? site.videoSection.videoFileUrl
    : site.videoSection?.youtubeUrl
      ? null // YouTube will be handled via iframe
      : "/latest_video.MOV"; // Default fallback

  const isYouTube = site.videoSection?.youtubeUrl && !site.videoSection?.videoFileUrl;
  const hasPosterImage = site.videoSection?.posterImage?.src;

  return (
    <section className="relative w-full overflow-hidden bg-gray-200 pt-[56.2%]">
      {isYouTube ? (
        // YouTube embed
        <iframe
          className="absolute inset-0 h-full w-full pointer-events-none"
          src={`https://www.youtube.com/embed/${extractYouTubeId(site.videoSection.youtubeUrl)}?autoplay=1&mute=1&loop=1&playlist=${extractYouTubeId(site.videoSection.youtubeUrl)}&controls=0&modestbranding=0`}
          allow="autoplay;"
          allowFullScreen
          title="Cleaning video"
        />
      ) : (
        // Local video file
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
            poster={hasPosterImage ? site.videoSection.posterImage.src : undefined}
            autoPlay
            muted
            loop
            playsInline
            controls
            aria-label="Cleaning video"
          />
        </>
      )}
    </section>
  );
}