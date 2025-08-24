import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AlertCircle, CheckCircle } from "lucide-react";

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
      const response = await apiRequest("POST", "/api/verify-seminar-attendee", {
        email,
        password,
      });
      return response.json();
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

  const handleVerify = () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요");
      return;
    }
    setError("");
    verificationMutation.mutate({ email, password });
  };

  const handlePayment = () => {
    // TODO: 실제 결제 연동 구현
    toast({
      title: "결제 준비",
      description: "결제 시스템이 곧 연동될 예정입니다.",
    });
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
                  <span className="text-emerald-700">
                    {totalPrice.toLocaleString()}원
                  </span>
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
                className="flex-1 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-amber-100"
              >
                결제하기
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}