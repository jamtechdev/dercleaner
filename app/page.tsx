import { getSite } from "./lib/site";
import Contact from "./components/Contact";
import FeaturesAndAbout from "./components/FeaturesAndAbout";
import MissionSection from "./components/MissionSection";
import ProductShowcase from "./components/ProductShowcase";
import { VideoSection } from "./components/VideoSection";

export default async function Home() {
  const site = await getSite();
  return (
    <main className="min-h-screen">
      <VideoSection site={site} />
      <ProductShowcase site={site} />
      <MissionSection site={site} />
      <FeaturesAndAbout site={site} />
      <Contact site={site} />
    </main>
  );
}
