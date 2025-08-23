import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play } from "lucide-react";

export default function VideoSection() {
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

  return (
    <section className="relative h-screen w-full overflow-hidden">
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
        className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20"
        size="sm"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        <span className="sr-only">소리 켜기/끄기</span>
      </Button>

      {/* Optional overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>
    </section>
  );
}