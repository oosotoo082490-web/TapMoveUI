import Navigation from "@/components/Navigation";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";

export default function Products() {
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