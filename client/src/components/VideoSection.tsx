export default function VideoSection() {

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-stone-900">
      {/* Video Background Container */}
      <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg h-full">
        {/* 탭무브 세로 영상 */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover rounded-2xl shadow-2xl"
        >
          <source src="/tapmove-video.mp4" type="video/mp4" />
          브라우저가 비디오 재생을 지원하지 않습니다.
        </video>
      </div>


      {/* Optional overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-10 rounded-2xl"></div>
    </section>
  );
}