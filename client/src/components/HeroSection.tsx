import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const navigateToSeminar = () => {
    window.location.href = "/seminar";
  };

  return (
    <section
      id="home"
      className="relative pt-20 pb-20 min-h-screen flex items-center justify-center bg-stone-900"
    >
      {/* Main Content */}
      <div className="container mx-auto px-4 text-center max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-white drop-shadow-lg">
          새로운 피트니스의
          <br />
          <span className="text-amber-400">기준 탭무브</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 text-white leading-relaxed max-w-3xl mx-auto drop-shadow-md">
          <strong className="text-amber-300">'높이'를 없앤 저충격 탭무브 운동.</strong>
          <br />
          초중고 부터 성인 실버 재활까지 폭 넓게 수업에 바로 적용할 수 있습니다.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button
            data-testid="button-apply-seminar"
            onClick={navigateToSeminar}
            className="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-amber-100 px-10 py-5 rounded-2xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl border border-red-700"
            size="lg"
          >
            세미나 신청하기
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          <Button
            data-testid="button-view-schedule"
            onClick={navigateToSeminar}
            variant="outline"
            className="bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-amber-100 border-2 border-emerald-600 hover:border-emerald-500 px-10 py-5 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-lg"
            size="lg"
          >
            세미나 일정 보기
            <Calendar className="ml-3 h-6 w-6" />
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-stone-800 rounded-2xl p-6 shadow-xl border border-stone-600">
            <h3 className="text-lg font-semibold text-white mb-2">안전한 운동</h3>
            <p className="text-stone-300">높이 부담 없는 새로운 피트니스 경험</p>
          </div>
          <div className="bg-red-900 rounded-2xl p-6 shadow-xl border border-red-600">
            <h3 className="text-lg font-semibold text-amber-200 mb-2">체계적 교육</h3>
            <p className="text-white">전문가 직접 지도하는 세미나</p>
          </div>
          <div className="bg-emerald-900 rounded-2xl p-6 shadow-xl border border-emerald-600">
            <h3 className="text-lg font-semibold text-emerald-200 mb-2">실용적 제품</h3>
            <p className="text-white">검증된 TAPMOVE 전용 장비</p>
          </div>
        </div>
      </div>

    </section>
  );
}
