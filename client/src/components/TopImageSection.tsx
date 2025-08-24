import { useState, useEffect } from 'react';

export default function TopImageSection() {
  const [displayedText, setDisplayedText] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);
  const targetText = 'TAPMOVE';

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (displayedText.length < targetText.length) {
      timeoutId = setTimeout(() => {
        setDisplayedText(targetText.slice(0, displayedText.length + 1));
      }, 150); // 0.15초 간격으로 한 글자씩 타이핑
    } else if (displayedText.length === targetText.length && !showSubtitle) {
      // 타이핑 완료 후 0.5초 뒤에 부제목 페이드인
      timeoutId = setTimeout(() => {
        setShowSubtitle(true);
      }, 500);
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, showSubtitle, targetText]);

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
      
      {/* 메인 타자기 애니메이션 텍스트 */}
      <div className="absolute inset-0 flex items-end justify-center pb-16 z-10">
        <div className="text-center text-white">
          {/* 타자기 효과 TAPMOVE 텍스트 */}
          <h2 
            className="text-5xl md:text-7xl mb-6 drop-shadow-2xl min-h-[1.2em] flex items-center justify-center"
            style={{
              fontFamily: '"Inter", "Helvetica Neue", "Arial Black", sans-serif',
              fontWeight: 900,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            <span className="inline-block">
              {displayedText}
              {displayedText.length < targetText.length && (
                <span className="animate-pulse text-white/80">|</span>
              )}
            </span>
          </h2>
          
          {/* 페이드인 부제목 */}
          <div 
            className={`transition-all duration-1000 ${
              showSubtitle 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}
          >
            <p 
              className="text-xl md:text-2xl drop-shadow-lg text-white/95"
              style={{
                fontFamily: '"Inter", "Helvetica Neue", sans-serif',
                fontWeight: 300,
                letterSpacing: '0.1em'
              }}
            >
              The Future of Movement
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}