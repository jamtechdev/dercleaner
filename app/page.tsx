import Contact from "./components/Contact";
import FeaturesAndAbout from "./components/FeaturesAndAbout";
import MissionSection from "./components/MissionSection";
import ProductShowcase from "./components/ProductShowcase";
import { VideoSection } from "./components/VideoSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <VideoSection />
      <ProductShowcase />
      <MissionSection />
      <FeaturesAndAbout />
      <Contact />
    </main>
  );
}
