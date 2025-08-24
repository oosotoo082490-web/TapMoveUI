import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ProductsStoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
      <Navigation />
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 메인 타이틀 */}
          <h1 className="text-center text-4xl font-bold text-gray-900 mb-8">
            TAPMOVE 스토리
          </h1>

          {/* 서브 타이틀 */}
          <h2 className="text-center text-2xl font-semibold text-gray-700 mt-8 mb-12">
            개발 배경 / 브랜드 가치
          </h2>

          {/* 스토리 섹션들 */}
          <div className="space-y-12">
            {/* 섹션 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-center text-xl font-semibold text-gray-800 mb-6">
                새로운 운동의 탄생
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                대구에서 10년 넘게 센터를 운영하며 다양한 연령대의 회원들과 함께했습니다. 
                특히 노인복지 수업에서, <strong className="text-gray-800">운동을 원하지만 관절의 부담 때문에 참여하지 못하는 분들</strong>이 많다는 현실을 발견했습니다.
              </p>
            </div>

            {/* 섹션 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-center text-xl font-semibold text-gray-800 mb-6">
                문제의 발견
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                무릎과 발목이 약해 스텝박스조차 오르지 못하는 분들. 
                운동의 필요성은 크지만 <strong className="text-gray-800">마땅한 대안이 없는 상황</strong>이 안타까웠습니다.
              </p>
            </div>

            {/* 섹션 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-center text-xl font-semibold text-gray-800 mb-6">
                해답을 찾다
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                누구나, 어디서든, 안전하게 할 수 있는 운동은 없을까? 
                그 해답을 찾는 과정에서 <strong className="text-gray-800">'탭무브'</strong>가 탄생했습니다.
              </p>
            </div>

            {/* 섹션 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-center text-xl font-semibold text-gray-800 mb-6">
                탭무브의 차별성
              </h3>
              <ul className="space-y-3 text-gray-600 text-lg">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-slate-800 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>단 6mm의 얇은 매트 위에서 <strong className="text-gray-800">안전하고 부담 없는 움직임</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-slate-800 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span><strong className="text-gray-800">밸런스·순발력·유산소 효과</strong>를 동시에 고려한 설계</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-slate-800 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>단순한 대안이 아닌, <strong className="text-gray-800">새로운 카테고리의 시작</strong></span>
                </li>
              </ul>
            </div>

            {/* 섹션 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-center text-xl font-semibold text-gray-800 mb-6">
                함께하는 가치
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                탭무브는 단순한 도구가 아닙니다. 
                <strong className="text-gray-800">운동의 기회를 넓히고, 누구나 자신 있게 움직일 수 있도록 돕는 새로운 문화</strong>입니다.
              </p>
            </div>
          </div>

          {/* 구분선 */}
          <hr className="my-16 border-0 border-t border-gray-200" />

          {/* 법적 안내 */}
          <div className="bg-slate-100 rounded-2xl p-8">
            <h2 className="text-center text-2xl font-semibold text-gray-700 mb-8">
              법적 안내
            </h2>
            
            <div className="mb-6">
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                ⚖️ <strong className="text-gray-800">TAPMOVE는 상표법에 따라 정식 등록된 상표</strong>입니다.
              </p>
            </div>

            <ul className="space-y-3 text-gray-600 text-lg">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-red-600 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                <span>무단 사용·판매 시 민형사상 엄정 대응</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-red-600 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                <span>TAPMOVE 로고가 없는 매트는 지식재산권 침해 상품</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-red-600 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                <span>상업적 수업 활용은 <strong className="text-gray-800">세미나 수료자에 한정</strong></span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}