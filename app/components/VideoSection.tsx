"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";

export function VideoSection({ site }: { site: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Autoplay video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        // Handle autoplay errors (browser may block autoplay)
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPaused(false);
    const handlePause = () => setIsPaused(true);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    // Check initial state
    setIsPaused(video.paused);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <section className="relative h-[500px] w-full overflow-hidden bg-gray-200 md:h-[92vh] hero-section">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/cleaning_video.mp4"
        poster={site.videoSection.posterImage.src}
        autoPlay
        muted
        loop
        playsInline
        controls
        aria-label="Cleaning video"
      />
      
      {/* Thumbnail overlay when paused */}
      {isPaused && (
        <div className="pointer-events-none absolute inset-0 z-10">
          <Image
            src={site.videoSection.posterImage.src}
            alt={site.videoSection.posterImage.alt}
            fill
            className="object-cover"
            priority
          />
          
          {/* Play Button Overlay */}
          <div className="pointer-events-auto absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.play();
                }
              }}
              className="group relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/20 backdrop-blur transition-transform hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60 md:h-24 md:w-24"
              aria-label="Play video"
            >
              {/* Inner Play Icon */}
              <div className="ml-2 h-0 w-0 border-b-[12px] border-b-transparent border-l-[20px] border-l-white border-t-[12px] border-t-transparent md:border-b-[14px] md:border-l-[24px] md:border-t-[14px]" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}