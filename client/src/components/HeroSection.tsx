import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const navigateToSeminar = () => {
    window.location.href = "/seminar";
  };

  return (
    <section
      id="home"
      className="relative pt-20 pb-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-purple-50"
    >
      {/* Main Content */}
      <div className="container mx-auto px-4 text-center max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          새로운 피트니스의
          <br />
          <span className="text-yellow-500">혁신을 경험하세요</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 text-gray-700 leading-relaxed max-w-3xl mx-auto">
          스텝박스가 부담스러운 분들까지 안전하게
          <br />
          단순 대안이 아닌, <strong>'높이'를 없앤 새로운 카테고리</strong>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button
            data-testid="button-apply-seminar"
            onClick={navigateToSeminar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
            size="lg"
          >
            세미나 신청하기
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          <Button
            data-testid="button-view-schedule"
            onClick={navigateToSeminar}
            variant="outline"
            className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 hover:border-blue-700 px-10 py-5 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-lg"
            size="lg"
          >
            세미나 일정 보기
            <Calendar className="ml-3 h-6 w-6" />
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">안전한 운동</h3>
            <p className="text-gray-600">높이 부담 없는 새로운 피트니스 경험</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">체계적 교육</h3>
            <p className="text-gray-600">전문가 직접 지도하는 세미나</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">실용적 제품</h3>
            <p className="text-gray-600">검증된 TAPMOVE 전용 장비</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse delay-500"></div>
    </section>
  );
}
