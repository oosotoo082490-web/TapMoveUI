import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Calendar, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const savedMuteState = sessionStorage.getItem("videoMuted");
    if (savedMuteState !== null) {
      setIsMuted(savedMuteState === "true");
    }
  }, []);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    sessionStorage.setItem("videoMuted", newMutedState.toString());
    // TODO: Implement actual video mute toggle when video element is added
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="home"
      className="relative pt-16 min-h-screen flex items-center justify-center overflow-hidden bg-gray-50"
    >
      {/* Video Background Container */}
      <div className="absolute inset-0 w-full h-full">
        {/* Placeholder for vertical video - would be implemented with actual video element */}
        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
          <div className="text-white text-center">
            <Play className="mx-auto text-8xl mb-4 opacity-70" />
            <p className="text-xl font-medium opacity-80">세로 비디오 플레이스홀더</p>
            <p className="text-sm opacity-60 mt-2">실제 구현시 video 엘리먼트 사용</p>
          </div>
        </div>
        {/* Video element would be here in actual implementation */}
        {/* <video autoPlay muted={isMuted} loop className="w-full h-full object-cover">
          <source src="tapmove-hero-video.mp4" type="video/mp4" />
        </video> */}
      </div>

      {/* Mute Toggle Button */}
      <Button
        data-testid="button-mute-toggle"
        onClick={toggleMute}
        className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
        size="sm"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        <span className="sr-only">소리 켜기/끄기</span>
      </Button>

      {/* Content Overlay */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          새로운 피트니스의
          <br />
          <span className="text-yellow-300">혁신을 경험하세요</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          스텝박스가 부담스러운 분들까지 안전하게
          <br />
          단순 대안이 아닌, '높이'를 없앤 새로운 카테고리
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            data-testid="button-apply-seminar"
            onClick={() => scrollToSection("apply")}
            className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            size="lg"
          >
            세미나 신청하기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            data-testid="button-view-schedule"
            onClick={() => scrollToSection("seminar")}
            variant="outline"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/30 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300"
            size="lg"
          >
            세미나 일정 보기
            <Calendar className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
