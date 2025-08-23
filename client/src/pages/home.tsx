import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import FeatureCarousel from "@/components/FeatureCarousel";
import SeminarSchedule from "@/components/SeminarSchedule";
import ApplicationForm from "@/components/ApplicationForm";
import ReviewsSection from "@/components/ReviewsSection";
import ProductSection from "@/components/ProductSection";
import LocationSection from "@/components/LocationSection";
import PolicySection from "@/components/PolicySection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <VideoSection />
      <FeatureCarousel />
      <SeminarSchedule />
      <ApplicationForm />
      <ReviewsSection />
      <ProductSection />
      <LocationSection />
      <PolicySection />
      <Footer />
    </div>
  );
}
