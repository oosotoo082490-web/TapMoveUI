import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const navigateToSeminar = () => {
    window.location.href = "/seminar";
  };

  return (
    <section
      id="home"
      className="relative pt-20 pb-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50 to-emerald-50"
    >
      {/* Main Content */}
      <div className="container mx-auto px-4 text-center max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent">
          새로운 피트니스의
          <br />
          <span className="text-amber-600">기준 탭무브</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 text-gray-700 leading-relaxed max-w-3xl mx-auto">
          <strong>'높이'를 없앤 저충격 탭무브 운동.</strong>
          <br />
          초중고 부터 성인 실버 재활까지 폭 넓게 수업에 바로 적용할 수 있습니다.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button
            data-testid="button-apply-seminar"
            onClick={navigateToSeminar}
            className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-amber-100 px-10 py-5 rounded-2xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
            size="lg"
          >
            세미나 신청하기
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          <Button
            data-testid="button-view-schedule"
            onClick={navigateToSeminar}
            variant="outline"
            className="bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-slate-800 border-2 border-amber-600 hover:border-amber-700 px-10 py-5 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-lg"
            size="lg"
          >
            세미나 일정 보기
            <Calendar className="ml-3 h-6 w-6" />
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">안전한 운동</h3>
            <p className="text-slate-600">높이 부담 없는 새로운 피트니스 경험</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">체계적 교육</h3>
            <p className="text-amber-700">전문가 직접 지도하는 세미나</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-200">
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">실용적 제품</h3>
            <p className="text-emerald-700">검증된 TAPMOVE 전용 장비</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-gradient-to-br from-amber-300 to-amber-400 rounded-full opacity-25 animate-pulse delay-500"></div>
    </section>
  );
}
