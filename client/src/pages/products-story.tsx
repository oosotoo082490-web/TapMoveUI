import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ProductsStoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900">
      <Navigation />
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 메인 타이틀 */}
          <h1 className="text-center text-5xl md:text-6xl font-black text-white mb-8 drop-shadow-2xl" 
              style={{ fontFamily: '"Noto Sans KR", sans-serif', letterSpacing: '0.02em' }}>
            TAPMOVE 스토리
          </h1>

          {/* 서브 타이틀 */}
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-white mt-8 mb-12 drop-shadow-lg">
            개발 배경 / 브랜드 가치
          </h2>

          {/* 스토리 섹션들 */}
          <div className="space-y-12">
            {/* 섹션 1 */}
            <div className="bg-gradient-to-br from-stone-800/90 to-stone-700/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-amber-500/20 hover:border-amber-400/30 transition-all duration-300">
              <h3 className="text-center text-2xl font-bold text-white mb-8 drop-shadow-lg">
                새로운 운동의 탄생
              </h3>
              <p className="text-white leading-relaxed text-lg font-medium">
                대구에서 10년 넘게 센터를 운영하며<br />
                다양한 연령대의 회원들과 함께했습니다.<br /><br />
                특히 노인복지 수업에서,<br />
                <strong className="text-white font-bold">운동을 원하지만 관절의 부담 때문에<br />
                참여하지 못하는 분들</strong>이 많다는 현실을 발견했습니다.
              </p>
            </div>

            {/* 섹션 2 */}
            <div className="bg-gradient-to-br from-stone-800/90 to-stone-700/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-amber-500/20 hover:border-amber-400/30 transition-all duration-300">
              <h3 className="text-center text-2xl font-bold text-white mb-8 drop-shadow-lg">
                문제의 발견
              </h3>
              <p className="text-white leading-relaxed text-lg font-medium">
                무릎과 발목이 약해<br />
                스텝박스조차 오르지 못하는 분들.<br /><br />
                운동의 필요성은 크지만<br />
                <strong className="text-white font-bold">마땅한 대안이 없는 상황</strong>이 안타까웠습니다.
              </p>
            </div>

            {/* 섹션 3 */}
            <div className="bg-gradient-to-br from-stone-800/90 to-stone-700/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-amber-500/20 hover:border-amber-400/30 transition-all duration-300">
              <h3 className="text-center text-2xl font-bold text-white mb-8 drop-shadow-lg">
                해답을 찾다
              </h3>
              <p className="text-white leading-relaxed text-lg font-medium">
                누구나, 어디서든, 안전하게<br />
                할 수 있는 운동은 없을까?<br /><br />
                그 해답을 찾는 과정에서<br />
                <strong className="text-white font-bold">'탭무브'</strong>가 탄생했습니다.
              </p>
            </div>

            {/* 섹션 4 */}
            <div className="bg-gradient-to-br from-stone-800/90 to-stone-700/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-amber-500/20 hover:border-amber-400/30 transition-all duration-300">
              <h3 className="text-center text-2xl font-bold text-white mb-8 drop-shadow-lg">
                탭무브의 차별성
              </h3>
              <ul className="space-y-4 text-white text-lg">
                <li className="flex items-start">
                  <span className="inline-block w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mt-2.5 mr-5 flex-shrink-0 shadow-lg"></span>
                  <span className="font-medium">단 6mm의 얇은 매트 위에서<br />
                  <strong className="text-white font-bold">안전하고 부담 없는 움직임</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mt-2.5 mr-5 flex-shrink-0 shadow-lg"></span>
                  <span className="font-medium"><strong className="text-white font-bold">밸런스·순발력·유산소 효과</strong>를<br />
                  동시에 고려한 설계</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mt-2.5 mr-5 flex-shrink-0 shadow-lg"></span>
                  <span className="font-medium">단순한 대안이 아닌,<br />
                  <strong className="text-white font-bold">새로운 카테고리의 시작</strong></span>
                </li>
              </ul>
            </div>

            {/* 섹션 5 */}
            <div className="bg-gradient-to-br from-stone-800/90 to-stone-700/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-amber-500/20 hover:border-amber-400/30 transition-all duration-300">
              <h3 className="text-center text-2xl font-bold text-white mb-8 drop-shadow-lg">
                함께하는 가치
              </h3>
              <p className="text-white leading-relaxed text-lg font-medium">
                탭무브는 단순한 도구가 아닙니다.<br /><br />
                <strong className="text-white font-bold">운동의 기회를 넓히고,<br />
                누구나 자신 있게 움직일 수 있도록 돕는<br />
                새로운 문화</strong>입니다.
              </p>
            </div>
          </div>

          {/* 구분선 */}
          <div className="my-20 flex justify-center">
            <div className="w-64 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          </div>

          {/* 법적 안내 */}
          <div className="bg-gradient-to-br from-stone-900/60 to-stone-800/60 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-stone-500/30">
            <h2 className="text-center text-3xl font-bold text-white mb-10 drop-shadow-lg">
              법적 안내
            </h2>
            
            <div className="mb-8">
              <p className="text-white text-xl leading-relaxed mb-6 text-center font-medium">
                ⚖️ <strong className="text-white font-bold">TAPMOVE는 상표법에 따라<br />
                정식 등록된 상표</strong>입니다.
              </p>
            </div>

            <ul className="space-y-5 text-white text-lg">
              <li className="flex items-start">
                <span className="inline-block w-3 h-3 bg-gradient-to-r from-stone-500 to-stone-600 rounded-full mt-2.5 mr-5 flex-shrink-0 shadow-lg"></span>
                <span className="font-medium">무단 사용·판매 시 민형사상 엄정 대응</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-3 h-3 bg-gradient-to-r from-stone-500 to-stone-600 rounded-full mt-2.5 mr-5 flex-shrink-0 shadow-lg"></span>
                <span className="font-medium">TAPMOVE 로고가 없는 매트는 지식재산권 침해 상품</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-3 h-3 bg-gradient-to-r from-stone-500 to-stone-600 rounded-full mt-2.5 mr-5 flex-shrink-0 shadow-lg"></span>
                <span className="font-medium">상업적 수업 활용은 <strong className="text-white font-bold">세미나 수료자에 한정</strong></span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}