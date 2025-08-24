import Navigation from "@/components/Navigation";
import SeminarSchedule from "@/components/SeminarSchedule";
import Footer from "@/components/Footer";

export default function SeminarSchedulePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16">
        <SeminarSchedule />
      </div>
      <Footer />
    </div>
  );
}