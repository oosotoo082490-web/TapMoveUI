import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";

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
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">오시는 길</h3>
              <div className="space-y-4 max-w-md mx-auto">
                <div className="flex items-center justify-center">
                  <MapPin className="text-primary text-xl mr-4 h-6 w-6" />
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">주소</p>
                    <p className="text-gray-700">대구시 북구 침산남로 172 3층 운동하는코끼리</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <Phone className="text-primary text-xl mr-4 h-6 w-6" />
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">문의전화</p>
                    <p className="text-gray-700">0507-1403-3006</p>
                  </div>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </section>
  );
}
