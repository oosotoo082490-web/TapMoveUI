import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const navigateToSeminar = () => {
    window.location.href = "/seminar";
  };

  return (
    <section
      id="home"
      className="relative pt-20 pb-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-red-950 to-emerald-900"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(156, 63, 89, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(34, 80, 62, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(127, 29, 29, 0.2) 0%, transparent 50%)
        `,
        backgroundSize: '100% 100%, 80% 80%, 60% 60%',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}
    >
      {/* Main Content */}
      <div className="container mx-auto px-4 text-center max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          <span className="bg-gradient-to-r from-stone-100 to-stone-300 bg-clip-text text-transparent">새로운 피트니스의</span>
          <br />
          <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">기준 탭무브</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 text-stone-200 leading-relaxed max-w-3xl mx-auto">
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
          <div className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-stone-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='20' cy='7' r='1'/%3E%3Ccircle cx='33' cy='7' r='1'/%3E%3Ccircle cx='46' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <h3 className="text-lg font-semibold text-stone-100 mb-2 relative z-10">안전한 운동</h3>
            <p className="text-stone-300 relative z-10">높이 부담 없는 새로운 피트니스 경험</p>
          </div>
          <div className="bg-gradient-to-br from-red-900/80 to-red-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-red-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='20' cy='7' r='1'/%3E%3Ccircle cx='33' cy='7' r='1'/%3E%3Ccircle cx='46' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <h3 className="text-lg font-semibold text-amber-200 mb-2 relative z-10">체계적 교육</h3>
            <p className="text-stone-200 relative z-10">전문가 직접 지도하는 세미나</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/80 to-emerald-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='20' cy='7' r='1'/%3E%3Ccircle cx='33' cy='7' r='1'/%3E%3Ccircle cx='46' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <h3 className="text-lg font-semibold text-emerald-200 mb-2 relative z-10">실용적 제품</h3>
            <p className="text-stone-200 relative z-10">검증된 TAPMOVE 전용 장비</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-red-800/40 to-red-900/40 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-emerald-800/30 to-emerald-900/30 rounded-full opacity-50 animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-gradient-to-br from-amber-700/40 to-amber-800/40 rounded-full opacity-40 animate-pulse delay-500"></div>
      
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px'
      }}></div>
    </section>
  );
}
