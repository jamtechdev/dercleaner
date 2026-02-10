import { getSite } from "./lib/site";
import Contact from "./components/Contact";
import MissionSection from "./components/MissionSection";
import ProductShowcase from "./components/ProductShowcase";
import { VideoSection } from "./components/VideoSection";
import FaqSection from "./components/FaqSection";
import About from "./components/FeaturesAndAbout";
import Features from "./components/Features";
import { BannerSection } from "./components/BannerSection";
import NewsLetter from "./components/NewsLetter";


// Force dynamic rendering to always fetch fresh data
export const dynamic = "force-dynamic";

export default async function Home() {
  const site = await getSite();
  return (
    <main className="min-h-screen">
      <VideoSection site={site} />
      <BannerSection site={site} />
      <ProductShowcase site={site} />

      <Features site={site} />
      <FaqSection site={site} />
      <MissionSection site={site} />
      <About site={site} />
      <Contact site={site} />
      <NewsLetter />
    </main>
  );
}
