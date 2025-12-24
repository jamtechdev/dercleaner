"use client";

import { useRef, useEffect } from "react";

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

  return (
    <section className="relative h-[500px] w-full overflow-hidden bg-gray-200 md:h-[92vh]">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/cleaning_video.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-label="Cleaning video"
      />
    </section>
  );
}