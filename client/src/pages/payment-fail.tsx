import React from 'react';
import { useLocation, useRouter } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RotateCcw, Home } from 'lucide-react';

export default function PaymentFailPage() {
  const [, navigate] = useRouter();
  const [location] = useLocation();
  const queryParams = new URLSearchParams(location.split('?')[1]);
  
  const orderId = queryParams.get('orderId');
  const code = queryParams.get('code');
  const message = queryParams.get('message');

  const getFailureMessage = (code: string | null) => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '사용자가 결제를 취소했습니다.';
      case 'PAY_PROCESS_ABORTED':
        return '결제 진행 중 오류로 인해 결제가 중단되었습니다.';
      case 'REJECT_CARD_COMPANY':
        return '카드사에서 결제를 거부했습니다. 다른 카드를 이용해주세요.';
      default:
        return message || '알 수 없는 오류로 결제에 실패했습니다.';
    }
  };

  const retryPayment = () => {
    if (orderId) {
      navigate(`/checkout?orderId=${orderId}`);
    } else {
      navigate('/products/story');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 text-center">
          <div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제에 실패했습니다</h1>
          <p className="text-gray-600 mb-8">결제 처리 중 문제가 발생했습니다.</p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-red-900 mb-2">실패 원인</h3>
            <p className="text-sm text-red-700">
              {getFailureMessage(code)}
            </p>
            {orderId && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-xs text-red-600">
                  주문번호: {orderId}
                </p>
                {code && (
                  <p className="text-xs text-red-600">
                    오류 코드: {code}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h4 className="font-medium text-blue-900 mb-2">해결 방법</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 다른 결제 수단을 사용해보세요</li>
                <li>• 카드 한도 및 잔액을 확인해보세요</li>
                <li>• 잠시 후 다시 시도해보세요</li>
                <li>• 문제가 지속되면 고객센터로 연락해주세요</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="font-medium text-gray-900 mb-2">고객센터</h4>
              <p className="text-sm text-gray-700">
                📞 0507-1403-3006<br />
                📧 support@tapmove.com<br />
                🕒 평일 09:00 - 18:00
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button onClick={retryPayment} className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              다시 결제하기
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