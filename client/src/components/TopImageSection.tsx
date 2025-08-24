import { useState, useEffect } from 'react';

export default function TopImageSection() {
  const [displayedText, setDisplayedText] = useState('');
  const [showEnglishSubtitle, setShowEnglishSubtitle] = useState(false);
  const [showKoreanSubtitle, setShowKoreanSubtitle] = useState(false);
  const targetText = '탭무브';

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (displayedText.length < targetText.length) {
      timeoutId = setTimeout(() => {
        setDisplayedText(targetText.slice(0, displayedText.length + 1));
      }, 150); // 0.15초 간격으로 한 글자씩 타이핑
    } else if (displayedText.length === targetText.length && !showEnglishSubtitle) {
      // 타이핑 완료 후 0.3초 뒤에 영어 문구 슬라이드
      timeoutId = setTimeout(() => {
        setShowEnglishSubtitle(true);
        // 영어 문구 나타난 후 0.8초 뒤에 한국어 문구 슬며시 나타남
        setTimeout(() => {
          setShowKoreanSubtitle(true);
        }, 800);
      }, 300);
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, showEnglishSubtitle, targetText]);

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
          {/* 타자기 효과 탭무브 텍스트 (커서 없음) */}
          <h2 
            className="text-5xl md:text-7xl mb-6 drop-shadow-2xl min-h-[1.2em] flex items-center justify-center"
            style={{
              fontFamily: '"Noto Sans KR", "Inter", "Helvetica Neue", "Arial Black", sans-serif',
              fontWeight: 900,
              letterSpacing: '0.05em'
            }}
          >
            <span className="inline-block">
              {displayedText}
            </span>
          </h2>
          
          {/* 왼쪽에서 오른쪽으로 스윽 나타나는 영어 문구 */}
          <div 
            className={`transition-all duration-700 ease-out mb-2 ${
              showEnglishSubtitle 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-8'
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
          
          {/* 갑자기 슬며시 나타나는 한국어 문구 */}
          <div 
            className={`transition-all duration-1000 ease-in-out ${
              showKoreanSubtitle 
                ? 'opacity-100' 
                : 'opacity-0'
            }`}
          >
            <p 
              className="text-lg md:text-xl drop-shadow-lg text-white/90"
              style={{
                fontFamily: '"Noto Sans KR", "Inter", sans-serif',
                fontWeight: 300,
                letterSpacing: '0.05em'
              }}
            >
              움직임의 미래
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}