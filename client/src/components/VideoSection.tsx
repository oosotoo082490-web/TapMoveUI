import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

export default function VideoSection() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    
    if (videoRef.current) {
      videoRef.current.muted = newMutedState;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-stone-900">
      {/* Video Background Container */}
      <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg h-full">
        {/* 탭무브 세로 영상 */}
        <video 
          ref={videoRef}
          autoPlay 
          muted={isMuted} 
          loop 
          playsInline
          className="w-full h-full object-cover rounded-2xl shadow-2xl"
        >
          <source src="/tapmove-video.mp4" type="video/mp4" />
          브라우저가 비디오 재생을 지원하지 않습니다.
        </video>
      </div>

      {/* Mute Toggle Button */}
      <Button
        data-testid="button-mute-toggle"
        onClick={toggleMute}
        className="absolute bottom-6 right-6 bg-slate-800/40 backdrop-blur-sm text-amber-100 p-3 rounded-full hover:bg-slate-800/60 transition-all duration-300 z-20 border border-amber-300/30"
        size="sm"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        <span className="sr-only">소리 켜기/끄기</span>
      </Button>

      {/* Optional overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-10 rounded-2xl"></div>
    </section>
  );
}