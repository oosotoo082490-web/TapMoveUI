import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, ExternalLink } from "lucide-react";

export default function LocationSection() {
  return (
    <section id="location" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">센터 위치</h2>
          <p className="text-xl text-gray-600">운동하는코끼리</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Address Information */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">오시는 길</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="text-primary text-xl mt-1 mr-4 h-6 w-6" />
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">주소</p>
                      <p className="text-gray-700">대구시 북구 침산남로 172 3층</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="text-primary text-xl mt-1 mr-4 h-6 w-6" />
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">문의전화</p>
                      <p className="text-gray-700">0507-1403-3006</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map or Additional Info */}
              <div>
                <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="mx-auto h-16 w-16 mb-4" />
                    <p className="font-semibold">지도 영역</p>
                    <p className="text-sm mt-2">
                      실제 구현 시 OpenStreetMap
                      <br />
                      또는 카카오맵 연동
                    </p>
                  </div>
                </div>
                <Button
                  data-testid="button-open-map"
                  variant="outline"
                  className="w-full mt-4 border border-gray-300 hover:border-primary text-gray-700 hover:text-primary py-3 rounded-xl"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  지도에서 보기
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </section>
  );
}
