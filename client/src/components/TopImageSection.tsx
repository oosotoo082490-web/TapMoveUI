export default function TopImageSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* 탭무브 고화질 이미지 배경 */}
      <div className="absolute inset-0">
        <img 
          src="/tapmove.jpg"
          alt="TAPMOVE 피트니스 센터"
          className="w-full h-full object-cover object-center"
        />
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