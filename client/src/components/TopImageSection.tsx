export default function TopImageSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* 강력한 이미지 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-amber-800 to-stone-900">
        {/* 이미지 플레이스홀더 - 실제 구현시 img 또는 background-image 사용 */}
        <div className="w-full h-full bg-gradient-to-br from-stone-800 via-amber-900 to-red-900 flex items-center justify-center">
          <div className="text-center text-white/80">
            <div className="text-8xl mb-6">📸</div>
            <p className="text-2xl font-light tracking-wider opacity-70">프리미엄 이미지 공간</p>
            <p className="text-sm opacity-50 mt-2">명품 브랜드 이미지 배치 예정</p>
          </div>
        </div>
      </div>
      
      {/* 어두운 오버레이로 텍스트 가독성 향상 */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* 선택적 컨텐츠 오버레이 */}
      <div className="absolute inset-0 flex items-end justify-center pb-16 z-10">
        <div className="text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-wide">TAPMOVE</h2>
          <p className="text-lg md:text-xl font-light tracking-wider opacity-90">Premium Fitness Experience</p>
        </div>
      </div>
    </section>
  );
}