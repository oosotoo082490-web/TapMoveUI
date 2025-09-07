import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";

export default function Products() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16">
        <ProductSection />
      </div>
      <Footer />
    </div>
  );
}