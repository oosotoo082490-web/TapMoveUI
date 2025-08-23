import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BulkPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitPrice: number;
}

export default function BulkPurchaseModal({ isOpen, onClose, unitPrice }: BulkPurchaseModalProps) {
  const [step, setStep] = useState<"passcode" | "order">("passcode");
  const [passcode, setPasscode] = useState("");
  const [orderData, setOrderData] = useState({
    quantity: 20,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
  });
  const { toast } = useToast();

  const verifyPasscodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/orders/verify-bulk-passcode", { passcode: code });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "인증 성공", description: "대량구매를 진행하실 수 있습니다." });
        setStep("order");
      }
    },
    onError: (error: any) => {
      toast({
        title: "인증 실패",
        description: error.message || "올바른 비밀번호를 입력해주세요.",
        variant: "destructive",
      });
    },
  });

  const submitOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/orders", {
        ...data,
        orderType: "bulk",
        totalAmount: data.quantity * unitPrice,
        productId: "default", // This would be dynamic in a real app
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "주문 접수", description: "대량구매 주문이 접수되었습니다." });
        handleClose();
      }
    },
    onError: (error: any) => {
      toast({
        title: "주문 실패",
        description: error.message || "주문 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setStep("passcode");
    setPasscode("");
    setOrderData({
      quantity: 20,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
    });
    onClose();
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.length !== 4) {
      toast({
        title: "입력 오류",
        description: "4자리 비밀번호를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    verifyPasscodeMutation.mutate(passcode);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderData.customerName || !orderData.customerEmail || !orderData.customerPhone || !orderData.shippingAddress) {
      toast({
        title: "입력 오류",
        description: "모든 필수 정보를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    submitOrderMutation.mutate(orderData);
  };

  const handlePasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
    setPasscode(value);
  };

  const totalPrice = orderData.quantity * unitPrice;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === "passcode" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">대량구매 권한 확인</DialogTitle>
            </DialogHeader>
            <div className="text-center mb-6">
              <p className="text-gray-600">
                세미나 수료자만 이용 가능합니다.
                <br />
                대표자에게 안내받은 비밀번호 4자리를 입력해주세요.
              </p>
            </div>
            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div>
                <Input
                  data-testid="input-bulk-passcode"
                  type="text"
                  value={passcode}
                  onChange={handlePasscodeChange}
                  maxLength={4}
                  placeholder="****"
                  className="text-center text-2xl font-bold tracking-widest"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  data-testid="button-cancel-bulk-passcode"
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  data-testid="button-verify-bulk-passcode"
                  type="submit"
                  className="flex-1"
                  disabled={verifyPasscodeMutation.isPending}
                >
                  {verifyPasscodeMutation.isPending ? "확인 중..." : "확인"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>대량구매 주문</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <Label htmlFor="quantity">주문 수량</Label>
                <Select
                  value={orderData.quantity.toString()}
                  onValueChange={(value) =>
                    setOrderData((prev) => ({ ...prev, quantity: parseInt(value) }))
                  }
                >
                  <SelectTrigger data-testid="select-bulk-quantity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[20, 30, 40, 50, 60, 70, 80, 90, 100].map((qty) => (
                      <SelectItem key={qty} value={qty.toString()}>
                        {qty}개
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between mb-2">
                  <span>단가</span>
                  <span>{unitPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>수량</span>
                  <span data-testid="text-bulk-quantity">{orderData.quantity}개</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary border-t border-gray-200 pt-2">
                  <span>총 금액</span>
                  <span data-testid="text-bulk-total">{totalPrice.toLocaleString()}원</span>
                </div>
              </div>

              <div>
                <Label htmlFor="customerName">주문자명 *</Label>
                <Input
                  data-testid="input-bulk-customer-name"
                  id="customerName"
                  value={orderData.customerName}
                  onChange={(e) =>
                    setOrderData((prev) => ({ ...prev, customerName: e.target.value }))
                  }
                  placeholder="홍길동"
                />
              </div>

              <div>
                <Label htmlFor="customerEmail">이메일 *</Label>
                <Input
                  data-testid="input-bulk-customer-email"
                  id="customerEmail"
                  type="email"
                  value={orderData.customerEmail}
                  onChange={(e) =>
                    setOrderData((prev) => ({ ...prev, customerEmail: e.target.value }))
                  }
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <Label htmlFor="customerPhone">연락처 *</Label>
                <Input
                  data-testid="input-bulk-customer-phone"
                  id="customerPhone"
                  type="tel"
                  value={orderData.customerPhone}
                  onChange={(e) =>
                    setOrderData((prev) => ({ ...prev, customerPhone: e.target.value }))
                  }
                  placeholder="010-1234-5678"
                />
              </div>

              <div>
                <Label htmlFor="shippingAddress">배송지 *</Label>
                <Input
                  data-testid="input-bulk-shipping-address"
                  id="shippingAddress"
                  value={orderData.shippingAddress}
                  onChange={(e) =>
                    setOrderData((prev) => ({ ...prev, shippingAddress: e.target.value }))
                  }
                  placeholder="서울시 강남구 테헤란로 123"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  data-testid="button-cancel-bulk-order"
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  data-testid="button-submit-bulk-order"
                  type="submit"
                  className="flex-1"
                  disabled={submitOrderMutation.isPending}
                >
                  {submitOrderMutation.isPending ? "주문 중..." : "주문하기"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
