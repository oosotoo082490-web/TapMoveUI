import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, CreditCard, Loader2 } from 'lucide-react';

// 테스트용 토스페이먼츠 클라이언트 키
const TOSS_CLIENT_KEY = 'test_ck_docs_Ovk5rk1EwkEbP0W43n07xlzm';

interface Order {
  id: string;
  orderNo: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  shippingFee: number;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  orderType: 'regular' | 'member' | 'bulk';
  paymentStatus: 'waiting' | 'success' | 'failed';
  shippingStatus: 'preparing' | 'shipped';
}

export default function CheckoutPage() {
  const navigate = (path: string) => window.location.href = path;
  const [location] = useLocation();
  const queryParams = new URLSearchParams(location.split('?')[1]);
  const orderId = queryParams.get('orderId');
  
  const [isLoading, setIsLoading] = useState(false);

  // 주문 정보 조회
  const { data: order, isLoading: orderLoading } = useQuery<Order>({
    queryKey: ['/api/orders', orderId],
    enabled: !!orderId
  });

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">주문 정보가 없습니다</h2>
            <p className="text-gray-600 mb-4">올바른 주문 링크를 통해 접근해주세요.</p>
            <Button onClick={() => navigate('/products/story')} className="w-full">
              제품 페이지로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orderLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-red-600 mb-4" />
          <p className="text-gray-600">주문 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">주문을 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-4">주문 번호를 확인하고 다시 시도해주세요.</p>
            <Button onClick={() => navigate('/products/story')} className="w-full">
              제품 페이지로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 이미 결제가 완료된 경우
  if (order.paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">이미 결제 완료된 주문입니다</h2>
            <p className="text-gray-600 mb-4">주문번호: {order.orderNo}</p>
            <Button onClick={() => navigate('/products/story')} className="w-full">
              제품 페이지로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePayment = () => {
    setIsLoading(true);
    // 실제 토스페이먼츠 SDK 구현은 복잡하므로, 테스트용으로 성공 페이지로 바로 이동
    setTimeout(() => {
      navigate(`/payment-success?orderId=${order.orderNo}&paymentKey=test_payment_key&amount=${order.totalAmount}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">결제하기</h1>
          <p className="text-gray-600">주문 정보를 확인하고 결제를 진행해주세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 주문 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                주문 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{order.productName}</h3>
                  <p className="text-sm text-gray-600">수량: {order.quantity}개</p>
                </div>
                <p className="font-semibold text-lg">
                  {order.unitPrice.toLocaleString()}원
                </p>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>상품 금액</span>
                  <span>{(order.unitPrice * order.quantity).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>배송비</span>
                  <span>{order.shippingFee.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>총 결제 금액</span>
                  <span className="text-red-600">{order.totalAmount.toLocaleString()}원</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">주문자:</span> {order.customerName}</p>
                <p><span className="font-medium">연락처:</span> {order.customerPhone}</p>
                <p><span className="font-medium">이메일:</span> {order.customerEmail}</p>
                <p><span className="font-medium">배송지:</span> {order.shippingAddress}</p>
                <p><span className="font-medium">주문번호:</span> {order.orderNo}</p>
              </div>
            </CardContent>
          </Card>

          {/* 결제 영역 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                결제 수단
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">테스트 결제 안내</h4>
                <p className="text-sm text-blue-700">
                  현재 테스트 환경에서는 실제 결제가 진행되지 않습니다.
                  결제 프로세스를 시뮬레이션하여 성공 페이지로 이동합니다.
                </p>
              </div>
              
              <Button 
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    결제 처리 중...
                  </>
                ) : (
                  `${order.totalAmount.toLocaleString()}원 결제하기 (테스트)`
                )}
              </Button>

              <div className="text-xs text-gray-500 text-center">
                * 테스트 환경에서는 실제 결제가 진행되지 않습니다
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}