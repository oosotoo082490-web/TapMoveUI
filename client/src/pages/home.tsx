import Navigation from "@/components/Navigation";
import TopImageSection from "@/components/TopImageSection";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import FeatureCarousel from "@/components/FeatureCarousel";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <TopImageSection />
      <HeroSection />
      <VideoSection />
      <FeatureCarousel />
      <Footer />
    </div>
  );
}
