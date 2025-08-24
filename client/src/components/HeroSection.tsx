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
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
          새로운 피트니스의 기준, 탭무브
        </h1>
        
        <p className="text-2xl md:text-3xl mb-4 text-white/80 leading-relaxed max-w-3xl mx-auto drop-shadow-md font-medium">
          '높이'를 없앤 저충격 운동.
        </p>
        
        <p className="text-lg md:text-xl mb-12 text-white/70 leading-relaxed max-w-3xl mx-auto">
          초등부터 실버 재활까지,<br />
          수업에 바로 적용할 수 있습니다.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button
            data-testid="button-apply-seminar"
            onClick={navigateToSeminar}
            className="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-700 hover:to-red-600 text-white px-10 py-5 rounded-2xl text-xl font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-2xl shadow-xl border border-red-700"
            size="lg"
          >
            세미나 신청하기
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          <Button
            data-testid="button-view-schedule"
            onClick={navigateToSeminar}
            variant="outline"
            className="bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-white border-2 border-emerald-600 hover:border-emerald-500 px-10 py-5 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-lg"
            size="lg"
          >
            세미나 일정 보기
            <Calendar className="ml-3 h-6 w-6" />
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-stone-900/80 rounded-2xl p-8 shadow-xl border border-stone-700 text-center">
            <div className="text-4xl mb-4">🧘‍♀️</div>
            <h3 className="text-lg font-semibold text-white mb-3">안전한 운동</h3>
            <p className="text-stone-300 text-sm leading-relaxed">관절 부담 없이,<br />누구나 안전하게</p>
          </div>
          <div className="bg-stone-900/80 rounded-2xl p-8 shadow-xl border border-stone-700 text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-lg font-semibold text-red-400 mb-3">체계적 교육</h3>
            <p className="text-stone-300 text-sm leading-relaxed">탭무브 개발자가 직접 지도하는<br />세미나</p>
          </div>
          <div className="bg-stone-900/80 rounded-2xl p-8 shadow-xl border border-stone-700 text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-lg font-semibold text-emerald-400 mb-3">브랜드 공식 사용 권한</h3>
            <p className="text-stone-300 text-sm leading-relaxed">세미나 수료자만 'TAPMOVE' 브랜드를<br />공식적으로 사용할 수 있습니다</p>
          </div>
        </div>
      </div>

    </section>
  );
}
