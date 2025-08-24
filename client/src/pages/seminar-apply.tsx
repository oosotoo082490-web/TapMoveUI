import Navigation from "@/components/Navigation";
import ApplicationForm from "@/components/ApplicationForm";
import Footer from "@/components/Footer";

export default function SeminarApplyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16">
        <ApplicationForm />
      </div>
      <Footer />
    </div>
  );
}