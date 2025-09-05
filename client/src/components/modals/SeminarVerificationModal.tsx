import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AlertCircle, CheckCircle, CreditCard } from "lucide-react";

interface SeminarVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  totalPrice: number;
}

export default function SeminarVerificationModal({
  isOpen,
  onClose,
  quantity,
  totalPrice,
}: SeminarVerificationModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationStep, setVerificationStep] = useState<"verify" | "payment">("verify");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const verificationMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiRequest("/api/verify-seminar-attendee", "POST", {
        email,
        password,
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        setVerificationStep("payment");
        setError("");
        toast({
          title: "인증 성공",
          description: "세미나 참석자 확인이 완료되었습니다.",
        });
      } else {
        setError("다시 시도하세요");
      }
    },
    onError: () => {
      setError("다시 시도하세요");
    },
  });

  // 주문 생성 뮤테이션
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/orders", "POST", {
        productName: "TAPMOVE 공식 매트",
        quantity,
        unitPrice: 17500, // 세미나 회원가
        shippingFee: 3000,
        totalAmount: totalPrice + 3000,
        customerName: email.split("@")[0], // 임시로 이메일 앞부분을 이름으로 사용
        customerEmail: email,
        customerPhone: "010-0000-0000", // 임시 번호
        shippingAddress: "배송지 미입력", // 실제로는 별도 입력 받아야 함
        orderType: "member",
      });
    },
    onSuccess: (response: any) => {
      const data = response;
      const orderId = data.order?.orderNo || data.orderNo || "test-order-" + Date.now();
      handleClose();
      // 페이지 이동을 위해 window.location 사용
      window.location.href = `/checkout?orderId=${orderId}`;
      toast({
        title: "주문 생성 완료",
        description: "결제 페이지로 이동합니다.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "주문 생성 실패",
        description: error.message || "주문 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleVerify = () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요");
      return;
    }
    setError("");
    verificationMutation.mutate({ email, password });
  };

  const handlePayment = () => {
    createOrderMutation.mutate();
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setVerificationStep("verify");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {verificationStep === "verify" ? "세미나 참석자 인증" : "결제하기"}
          </DialogTitle>
        </DialogHeader>

        {verificationStep === "verify" ? (
          <div className="space-y-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-amber-600 mb-4" />
              <p className="text-gray-600">
                세미나 신청 시 사용한 이메일과 로그인 비밀번호를 입력해주세요
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">세미나 신청 이메일</Label>
                <Input
                  data-testid="input-verification-email"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                  placeholder="seminar@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password">로그인 비밀번호</Label>
                <Input
                  data-testid="input-verification-password"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>

            {error && (
              <div className="text-center">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                data-testid="button-cancel-verification"
                onClick={handleClose}
                variant="outline"
                className="flex-1"
              >
                취소
              </Button>
              <Button
                data-testid="button-verify-attendee"
                onClick={handleVerify}
                disabled={verificationMutation.isPending}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              >
                {verificationMutation.isPending ? "확인 중..." : "인증하기"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
              <p className="text-gray-600">인증이 완료되었습니다!</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">주문 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>TAPMOVE 공식 매트</span>
                  <span>{quantity}개</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>총 결제 금액</span>
                  <span className="text-emerald-700">{totalPrice.toLocaleString()}원</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                data-testid="button-cancel-payment"
                onClick={handleClose}
                variant="outline"
                className="flex-1"
              >
                취소
              </Button>
              <Button
                data-testid="button-proceed-payment"
                onClick={handlePayment}
                disabled={createOrderMutation.isPending}
                className="flex-1 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-amber-100"
              >
                {createOrderMutation.isPending ? (
                  "주문 생성 중..."
                ) : (
                  <>
                    결제하기
                    <CreditCard className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}