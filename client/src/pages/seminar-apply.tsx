import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import ApplicationForm from "@/components/ApplicationForm";
import Footer from "@/components/Footer";

export default function SeminarApplyPage() {
  useEffect(() => {
    // 페이지 로드 시 스크롤을 맨 위로 올리기
    window.scrollTo(0, 0);
  }, []);

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