'use client';
import Image from "next/image";

export default function MissionSection({ site }: { site: any }) {
  return (
    <section className="w-full font-sans mission-section">
      {/* <div className="relative w-full min-h-[520px] md:h-[800px] flex items-center justify-center md:justify-end overflow-hidden px-4 md:px-0">

        <div className="absolute inset-0 z-0">

        </div>


        <div className="relative z-10 w-full max-w-xl md:mr-12 lg:mr-24 p-6 sm:p-8 md:p-16 rounded-[28px] sm:rounded-[40px] bg-[var(--secondary-color)]/50  shadow-xl border border-white/20">
          <div className="space-y-10">
            <h2 className="text-3xl sm:text-4xl md:text-[40px] font-extrabold text-gray-900 leading-tight font-36">
              {site.missionSection.hero.title}
            </h2>

            <p className="text-base sm:text-lg md:text-[20px] text-gray-700 leading-relaxed font-medium md:mb-10">
              {site.missionSection.hero.description}
            </p>

            <div className="pt-4 md:mt-30 flex justify-center">
              <button className="bg-ink text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-black transition-all transform hover:scale-105 shadow-lg">
                {site.missionSection.hero.ctaLabel}
              </button>
            </div>
          </div>
        </div>
      </div> */}
      <div className="bg-ink-2 text-white py-12 md:py-30 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-12">
          {/* Header */}
          <div className="md:w-1/3">
            <h2 className="text-2xl font-bold mb-4">{site.missionSection.industriesIntro.title}</h2>
            <p className="text-gray-400">
              {site.missionSection.industriesIntro.description}
            </p>
          </div>

          {/* Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4">
            {(site.missionSection.industries as Array<{ name: string; icon: string }>).map((item, index: number) => (
              <div key={index} className="flex items-center gap-3 border-b border-[var(--primary-color)] pb-2">
                <span className="text-brand text-xl mission-section-icons">
                  {/* Using the client-side image component */}
                  <img
                    src={item.icon || ''}  // Fallback if item.icon is invalid
                    alt={item.name}
                    className="mission-section-icon"
                  />
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}