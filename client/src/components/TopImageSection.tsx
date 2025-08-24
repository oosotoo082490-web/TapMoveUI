export default function TopImageSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* 탭무브 고화질 이미지 배경 */}
      <div className="absolute inset-0">
        {/* 실제 탭무브 이미지 - client/public/tapmove.jpg 파일 넣으면 자동 적용 */}
        <div 
          className="w-full h-full bg-gradient-to-br from-stone-900 via-red-900 to-amber-900 flex items-center justify-center"
          style={{
            backgroundImage: 'url(/tapmove.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* 이미지가 없을 때만 보이는 안내 */}
          <div className="text-center text-white/70">
            <div className="text-6xl mb-4">🏋️‍♂️</div>
            <p className="text-lg font-light">TAPMOVE 이미지를</p>
            <p className="text-lg font-light">client/public/tapmove.jpg</p>
            <p className="text-lg font-light">파일로 저장하세요</p>
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