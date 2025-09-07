import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import SeminarSchedule from "@/components/SeminarSchedule";
import ApplicationForm from "@/components/ApplicationForm";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

export default function Seminar() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16">
        <SeminarSchedule />
        <ApplicationForm />
        <ReviewsSection />
      </div>
      <Footer />
    </div>
  );
}