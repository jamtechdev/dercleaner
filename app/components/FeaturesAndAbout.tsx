import Image from "next/image";

export default function About({ site }: { site: any }) {
  return (
    <div className="w-full bg-white">
      {/* Top Section: Features Grid */}


      {/* Bottom Section: About Us */}
      <div id="ueber-uns" className="bg-surface-alt scroll-mt-8">
        <div className="flex flex-col md:w-[80%] mx-auto lg:flex-row min-h-[750px] lg:gap-20 uber-uns-img">
          {/* Left: Image with Background Color */}
          <div className="lg:w-1/2 relative bg-about flex items-end justify-center overflow-hidden">
            <div className="relative w-full h-full min-h-[400px] owner-img">
              <Image
                src={site.aboutSection.image.src}
                alt={site.aboutSection.image.alt}
                fill
                className="object-cover w-full h-full grayscale object-top"
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="lg:w-1/2 bg-surface-alt p-12 lg:p-24 flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-brand mb-8">
              {site.aboutSection.title}
            </h2>
            <div
              className="space-y-6 text-gray-700 leading-relaxed text-sm uber-uns prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: site.aboutSection?.content || (site.aboutSection?.paragraphs || []).map((p: string) => `<p>${p}</p>`).join("") }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}