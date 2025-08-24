export default function TopImageSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* 탭무브 고화질 이미지 배경 - 실제 이미지 준비 완료 */}
      <div className="absolute inset-0">
        {/* 임시 고급스러운 배경 - 실제 탭무브 이미지로 교체 예정 */}
        <div 
          className="w-full h-full bg-gradient-to-br from-stone-900 via-red-900 to-amber-900"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 20%, rgba(185, 28, 28, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(120, 53, 15, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(15, 23, 42, 0.6) 0%, transparent 50%)
            `
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="text-8xl mb-6">🏋️‍♂️</div>
              <p className="text-xl font-light tracking-wider">TAPMOVE 이미지 배치 예정</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 어두운 오버레이로 텍스트 가독성 향상 */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* 브랜드 텍스트 오버레이 */}
      <div className="absolute inset-0 flex items-end justify-center pb-16 z-10">
        <div className="text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-wide drop-shadow-2xl">TAPMOVE</h2>
          <p className="text-lg md:text-xl font-light tracking-wider opacity-90 drop-shadow-lg">Premium Fitness Experience</p>
        </div>
      </div>
    </section>
  );
}