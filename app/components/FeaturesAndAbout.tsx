import Image from "next/image";

export default function FeaturesAndAbout({ site }: { site: any }) {
  return (
    <div id="ueber-uns" className="scroll-mt-1 w-full bg-white">
      {/* Top Section: Features Grid */}
      <div className="max-w-7xl mx-auto py-20  md:py-50">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-5 schneller-boxes">
          {(site.featuresSection.features as Array<{ title: string; colorClass: string; icon: string; text: string }>).map((f, i: number) => (
            <div key={i} className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                {/* If the icon is an image path (e.g., /images/better.svg) */}
                <span className={`icon-${i + 1}`}>
                  <img
                    src={f.icon} // Path to the SVG file
                    alt={f.title} // Alternative text for accessibility
                    className={`w-6 h-6 ${f.colorClass}`} // Styling
                  />
                </span>
                <h3 className="font-bold text-lg">{f.title}</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {f.text}
              </p>
            </div>
          ))}


        </div>
      </div>

      {/* Bottom Section: About Us */}
      <div className="bg-surface-alt">
        <div className="flex flex-col md:w-[80%] mx-auto md:flex-row min-h-[600px] md:gap-20 uber-uns-img">
          {/* Left: Image with Background Color */}
          <div className="md:w-1/2 relative bg-about flex items-end justify-center overflow-hidden">
            <div className="relative w-full h-full min-h-[400px]">
              <Image
                src={site.aboutSection.image.src}
                alt={site.aboutSection.image.alt}
                fill
                className="object-cover w-full h-full grayscale object-top"
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="md:w-1/2 bg-surface-alt p-12 lg:p-24 flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-brand mb-8">{site.aboutSection.title}</h2>
            <div className="space-y-6 text-gray-700 leading-relaxed text-sm uber-uns">
              {(site.aboutSection.paragraphs as string[]).map((text: string, idx: number) => (
                <p key={idx}>{text}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}