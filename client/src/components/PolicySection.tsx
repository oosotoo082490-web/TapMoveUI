import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Tag, ShieldCheck, X, CheckCircle } from "lucide-react";

export default function PolicySection() {
  return (
    <section id="policy" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">정책 안내</h2>
          <p className="text-xl text-gray-600">TAPMOVE 상표 및 사용 정책을 확인해주세요</p>
        </div>

        {/* Warning Box */}
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-2xl p-8 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="text-amber-400 text-2xl mt-1 mr-4 h-8 w-8" />
            <div>
              <h3 className="text-xl font-bold text-amber-800 mb-4">상표 사용 정책</h3>
              <p className="text-amber-700 text-lg leading-relaxed">
                ✅ TAPMOVE는 상표등록된 지식재산입니다. 정식 매트 외 유사 제품·수업·명칭 도용은 민·형사상 책임 대상이며, 정식 세미나 참석자만 공식 사용 가능합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Policy Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gray-50">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                <Tag className="text-primary mr-3 h-6 w-6 inline" />
                정식 수료자 권한
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0 h-5 w-5" />
                  <span>SNS 및 홈트레이닝에서 'TAPMOVE' 명칭 사용</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0 h-5 w-5" />
                  <span>정식 수료증 및 상표 사용 권한 획득</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0 h-5 w-5" />
                  <span>대량구매 할인 혜택</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-50">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                <ShieldCheck className="text-red-500 mr-3 h-6 w-6 inline" />
                금지사항
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <X className="text-red-500 mt-1 mr-3 flex-shrink-0 h-5 w-5" />
                  <span>무단 상표 및 명칭 사용</span>
                </li>
                <li className="flex items-start">
                  <X className="text-red-500 mt-1 mr-3 flex-shrink-0 h-5 w-5" />
                  <span>유사 제품 제작 및 판매</span>
                </li>
                <li className="flex items-start">
                  <X className="text-red-500 mt-1 mr-3 flex-shrink-0 h-5 w-5" />
                  <span>미승인 수업 및 강의 진행</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
