import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertTriangle, DollarSign, University, MapPin, Backpack, CheckCircle, Hash, Presentation, Tag, Phone } from "lucide-react";

export default function SeminarSchedule() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="seminar" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">세미나 일정</h2>
          <p className="text-xl text-gray-600">다가오는 TAPMOVE 세미나 일정을 확인하고 빠르게 준비하세요</p>
        </div>

        {/* Seminar Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">세미나 정보</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="text-amber-600 mt-1 mr-3 h-5 w-5" />
                  <div>
                    <p className="font-semibold text-gray-900">장소</p>
                    <p className="text-gray-600">대구시 북구 침산남로 172, 3층</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="text-emerald-600 mt-1 mr-3 h-5 w-5" />
                  <div>
                    <p className="font-semibold text-gray-900">일시</p>
                    <p className="text-gray-600">2025-11-08(토) 14:00–18:00</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="text-amber-600 mt-1 mr-3 h-5 w-5" />
                  <div>
                    <p className="font-semibold text-gray-900">접수마감</p>
                    <p className="text-gray-600">2025-10-31(금) 19:00</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <DollarSign className="text-emerald-600 mt-1 mr-3 h-5 w-5" />
                  <div>
                    <p className="font-semibold text-gray-900">교육비</p>
                    <p className="text-gray-600">300,000원</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <University className="text-slate-600 mt-1 mr-3 h-5 w-5" />
                  <div>
                    <p className="font-semibold text-gray-900">입금계좌</p>
                    <p className="text-gray-600">
                      IM뱅크(구 대구은행)
                      <br />
                      50811-8677704
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Backpack className="text-emerald-600 mt-1 mr-3 h-5 w-5" />
                  <div>
                    <p className="font-semibold text-gray-900">준비물</p>
                    <p className="text-gray-600">깨끗한 실내 운동화, 수건, 개인 물통</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="text-slate-600 mt-1 mr-3 h-5 w-5" />
                  <div>
                    <p className="font-semibold text-gray-900">교육시간</p>
                    <p className="text-gray-600">4시간</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">참가 혜택</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <span className="text-2xl mr-4">✅</span>
              <span className="text-lg">탭무브 상표 사용 권한</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-4">🎓</span>
              <span className="text-lg">실제 수업에 최적화된 실용 교육</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-4">✅</span>
              <span className="text-lg">탭무브 공식 수료증 발급</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-4">👕</span>
              <span className="text-lg">세미나 참석자 전원 TAPMOVE T-Shirt 제공</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center space-y-4">
          <Button
            data-testid="button-apply-now"
            onClick={() => scrollToSection("apply")}
            className="bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-amber-50 px-12 py-4 rounded-2xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
            size="lg"
          >
            지금 신청하기
            <Calendar className="ml-3 h-5 w-5" />
          </Button>
          <p className="text-gray-600">
            <Phone className="inline h-4 w-4 mr-1" />
            문의사항이 있으시면 언제든 연락주세요
          </p>
        </div>
      </div>
    </section>
  );
}
