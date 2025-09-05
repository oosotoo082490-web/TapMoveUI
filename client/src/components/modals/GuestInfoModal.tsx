import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Package, CreditCard, User } from "lucide-react";
import { z } from "zod";

const guestInfoSchema = z.object({
  customerName: z.string().min(1, "이름을 입력해주세요"),
  customerEmail: z.string().email("올바른 이메일을 입력해주세요"),
  customerPhone: z.string().min(1, "연락처를 입력해주세요"),
  shippingAddress: z.string().min(1, "배송지를 입력해주세요"),
  privacyAgreement: z.boolean().refine(val => val === true, "개인정보 수집 및 이용에 동의해주세요"),
  paymentAgreement: z.boolean().refine(val => val === true, "전자결제 약관에 동의해주세요"),
});

type GuestInfo = z.infer<typeof guestInfoSchema>;

interface GuestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  totalPrice: number;
}

export default function GuestInfoModal({
  isOpen,
  onClose,
  quantity,
  totalPrice,
}: GuestInfoModalProps) {
  const { toast } = useToast();

  const form = useForm<GuestInfo>({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
      privacyAgreement: false,
      paymentAgreement: false,
    },
  });

  // 주문 생성 뮤테이션
  const createOrderMutation = useMutation({
    mutationFn: async (guestInfo: GuestInfo) => {
      return await apiRequest("/api/orders", "POST", {
        productId: "2cf1102518707f8beec5d10446271f7e", // TAPMOVE 매트 ID
        productName: "TAPMOVE 공식 매트",
        quantity,
        unitPrice: 19500, // 정상가
        shippingFee: 3000,
        totalAmount: totalPrice + 3000,
        customerName: guestInfo.customerName,
        customerEmail: guestInfo.customerEmail,
        customerPhone: guestInfo.customerPhone,
        shippingAddress: guestInfo.shippingAddress,
        customerType: "guest",
        orderType: "regular",
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

  const onSubmit = (data: GuestInfo) => {
    createOrderMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            주문자 정보 입력
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 주문 정보 요약 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                주문 내역
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>TAPMOVE 공식 매트</span>
                <span>{quantity}개</span>
              </div>
              <div className="flex justify-between">
                <span>상품 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span>배송비</span>
                <span>3,000원</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>총 결제 금액</span>
                <span className="text-emerald-700">{(totalPrice + 3000).toLocaleString()}원</span>
              </div>
            </CardContent>
          </Card>

          {/* 주문자 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">주문자 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">이름 *</Label>
                <Input
                  data-testid="input-customer-name"
                  id="customerName"
                  {...form.register("customerName")}
                  className="mt-2"
                  placeholder="홍길동"
                />
                {form.formState.errors.customerName && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.customerName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="customerPhone">연락처 *</Label>
                <Input
                  data-testid="input-customer-phone"
                  id="customerPhone"
                  {...form.register("customerPhone")}
                  className="mt-2"
                  placeholder="010-1234-5678"
                />
                {form.formState.errors.customerPhone && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.customerPhone.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="customerEmail">이메일 * (영수증 발송용)</Label>
              <Input
                data-testid="input-customer-email"
                id="customerEmail"
                type="email"
                {...form.register("customerEmail")}
                className="mt-2"
                placeholder="example@email.com"
              />
              {form.formState.errors.customerEmail && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.customerEmail.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="shippingAddress">배송지 주소 *</Label>
              <Input
                data-testid="input-shipping-address"
                id="shippingAddress"
                {...form.register("shippingAddress")}
                className="mt-2"
                placeholder="서울시 강남구 테헤란로 123, 456호"
              />
              {form.formState.errors.shippingAddress && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.shippingAddress.message}
                </p>
              )}
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">약관 동의</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  data-testid="checkbox-privacy-agreement"
                  id="privacyAgreement"
                  checked={form.watch("privacyAgreement")}
                  onCheckedChange={(checked) => 
                    form.setValue("privacyAgreement", checked === true)
                  }
                />
                <Label htmlFor="privacyAgreement" className="text-sm leading-relaxed">
                  [필수] 개인정보 수집 및 이용에 동의합니다.
                  <br />
                  <span className="text-gray-600">
                    주문 처리 및 배송을 위해 개인정보를 수집합니다.
                  </span>
                </Label>
              </div>
              {form.formState.errors.privacyAgreement && (
                <p className="text-sm text-red-600 ml-6">
                  {form.formState.errors.privacyAgreement.message}
                </p>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  data-testid="checkbox-payment-agreement"
                  id="paymentAgreement"
                  checked={form.watch("paymentAgreement")}
                  onCheckedChange={(checked) => 
                    form.setValue("paymentAgreement", checked === true)
                  }
                />
                <Label htmlFor="paymentAgreement" className="text-sm leading-relaxed">
                  [필수] 전자결제 서비스 이용약관에 동의합니다.
                  <br />
                  <span className="text-gray-600">
                    결제 처리를 위해 필요한 약관입니다.
                  </span>
                </Label>
              </div>
              {form.formState.errors.paymentAgreement && (
                <p className="text-sm text-red-600 ml-6">
                  {form.formState.errors.paymentAgreement.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              data-testid="button-cancel-order"
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1"
            >
              취소
            </Button>
            <Button
              data-testid="button-proceed-payment"
              type="submit"
              disabled={createOrderMutation.isPending}
              className="flex-1 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-amber-100"
            >
              {createOrderMutation.isPending ? (
                "주문 생성 중..."
              ) : (
                <>
                  결제 진행하기
                  <CreditCard className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}