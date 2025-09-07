import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import TopImageSection from "@/components/TopImageSection";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import FeatureCarousel from "@/components/FeatureCarousel";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <TopImageSection />
      <HeroSection />
      <FeatureCarousel />
      <Footer />
    </div>
  );
}
