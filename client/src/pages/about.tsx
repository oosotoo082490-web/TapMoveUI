import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import LocationSection from "@/components/LocationSection";
import PolicySection from "@/components/PolicySection";
import Footer from "@/components/Footer";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16">
        <LocationSection />
        <PolicySection />
      </div>
      <Footer />
    </div>
  );
}