import React from 'react';
import { useLocation, useRouter } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Home } from 'lucide-react';

export default function PaymentSuccessPage() {
  const [, navigate] = useRouter();
  const [location] = useLocation();
  const queryParams = new URLSearchParams(location.split('?')[1]);
  const orderId = queryParams.get('orderId');

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">결제 정보가 없습니다</h2>
            <p className="text-gray-600 mb-6">올바른 결제 완료 링크를 통해 접근해주세요.</p>
            <Button onClick={() => navigate('/')} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 text-center">
          <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h1>
          <p className="text-gray-600 mb-8">주문이 정상적으로 처리되었습니다.</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">주문 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">주문번호</span>
                <span className="font-medium">{orderId}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h4 className="font-medium text-blue-900 mb-2">배송 안내</h4>
              <p className="text-sm text-blue-700">
                주문하신 상품은 영업일 기준 2-3일 내에 배송될 예정입니다.
                배송 관련 문의는 고객센터(0507-1403-3006)로 연락해주세요.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button onClick={() => navigate('/products/story')} className="flex-1">
              <Package className="mr-2 h-4 w-4" />
              제품 더 보기
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
              <Home className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}