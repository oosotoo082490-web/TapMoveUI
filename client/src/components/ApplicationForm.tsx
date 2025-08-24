import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertApplicationSchema } from "@shared/schema";
import { Send } from "lucide-react";
import PrivacyModal from "./modals/PrivacyModal";
import type { InsertApplication } from "@shared/schema";

export default function ApplicationForm() {
  const { toast } = useToast();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const form = useForm<InsertApplication>({
    resolver: zodResolver(insertApplicationSchema),
    defaultValues: {
      name: "",
      birthdate: "",
      email: "",
      phone: "",
      address: "",
      depositorName: "",
      uniformSize: undefined,
      classPlan: undefined,
      classTypeInfant: false,
      classTypeElementary: false,
      classTypeMiddleHigh: false,
      classTypeAdult: false,
      classTypeSenior: false,
      classTypeRehab: false,
      privacyAgreement: false,
    },
  });

  const applicationMutation = useMutation({
    mutationFn: async (data: InsertApplication) => {
      const response = await apiRequest("POST", "/api/applications", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "신청 완료", description: "세미나 신청이 접수되었습니다." });
        form.reset();
      }
    },
    onError: (error: any) => {
      toast({
        title: "신청 실패",
        description: error.message || "신청 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertApplication) => {
    applicationMutation.mutate(data);
  };

  return (
    <section id="apply" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">세미나 신청</h2>
          <p className="text-xl text-gray-600">아래 정보를 정확히 입력해주세요</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">개인정보</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">성명 *</Label>
                    <Input
                      data-testid="input-name"
                      id="name"
                      {...form.register("name")}
                      className="mt-2"
                      placeholder="홍길동"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="birthdate">생년월일 *</Label>
                    <Input
                      data-testid="input-birthdate"
                      id="birthdate"
                      type="date"
                      {...form.register("birthdate")}
                      className="mt-2"
                    />
                    {form.formState.errors.birthdate && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.birthdate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">이메일 *</Label>
                    <Input
                      data-testid="input-email"
                      id="email"
                      type="email"
                      {...form.register("email")}
                      className="mt-2"
                      placeholder="example@email.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">연락처 *</Label>
                    <Input
                      data-testid="input-phone"
                      id="phone"
                      type="tel"
                      {...form.register("phone")}
                      className="mt-2"
                      placeholder="010-1234-5678"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <Label htmlFor="address">주소 *</Label>
                  <Input
                    data-testid="input-address"
                    id="address"
                    {...form.register("address")}
                    className="mt-2"
                    placeholder="서울시 강남구 테헤란로 123"
                  />
                  {form.formState.errors.address && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">결제정보</h3>
                <div>
                  <Label htmlFor="depositorName">입금자명 *</Label>
                  <Input
                    data-testid="input-depositor-name"
                    id="depositorName"
                    {...form.register("depositorName")}
                    className="mt-2"
                    placeholder="홍길동"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    계좌: IM뱅크(구 대구은행) 50811-8677704
                  </p>
                  {form.formState.errors.depositorName && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.depositorName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Options */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">선택사항</h3>

                {/* Uniform Size */}
                <div className="mb-6">
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                    유니폼 사이즈
                  </Label>
                  <RadioGroup
                    value={form.watch("uniformSize") || ""}
                    onValueChange={(value) => form.setValue("uniformSize", value as any)}
                    className="flex flex-wrap gap-3"
                  >
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <RadioGroupItem
                          data-testid={`radio-size-${size}`}
                          value={size}
                          id={`size-${size}`}
                        />
                        <Label
                          htmlFor={`size-${size}`}
                          className="px-4 py-2 border border-gray-300 rounded-xl cursor-pointer peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all"
                        >
                          {size}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Class Plan */}
                <div className="mb-6">
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                    수업 진행 여부
                  </Label>
                  <RadioGroup
                    value={form.watch("classPlan") || ""}
                    onValueChange={(value) => form.setValue("classPlan", value as any)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        data-testid="radio-class-plan"
                        value="plan"
                        id="plan"
                      />
                      <Label
                        htmlFor="plan"
                        className="px-6 py-3 border border-gray-300 rounded-xl cursor-pointer peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all"
                      >
                        진행 예정
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        data-testid="radio-class-no"
                        value="no"
                        id="no"
                      />
                      <Label
                        htmlFor="no"
                        className="px-6 py-3 border border-gray-300 rounded-xl cursor-pointer peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all"
                      >
                        하지 않음
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {/* Class Types - Show only when "진행 예정" is selected */}
                  {form.watch("classPlan") === "plan" && (
                    <div className="mt-6 pl-4">
                      <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                        수업 대상 (중복 선택 가능)
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { key: "classTypeInfant", label: "유아" },
                          { key: "classTypeElementary", label: "초등" },
                          { key: "classTypeMiddleHigh", label: "중고등" },
                          { key: "classTypeAdult", label: "성인" },
                          { key: "classTypeSenior", label: "시니어" },
                          { key: "classTypeRehab", label: "재활" },
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                              data-testid={`checkbox-${key}`}
                              id={key}
                              checked={form.watch(key as keyof InsertApplication) as boolean}
                              onCheckedChange={(checked) =>
                                form.setValue(key as keyof InsertApplication, checked as any)
                              }
                            />
                            <Label
                              htmlFor={key}
                              className="text-sm cursor-pointer"
                            >
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Privacy Agreement */}
              <div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    data-testid="checkbox-privacy"
                    id="privacy"
                    checked={form.watch("privacyAgreement")}
                    onCheckedChange={(checked) =>
                      form.setValue("privacyAgreement", checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="text-sm text-gray-700">
                    <Label htmlFor="privacy" className="font-semibold cursor-pointer">
                      개인정보 수집 및 이용에 동의합니다 *
                    </Label>
                    <Button
                      data-testid="button-privacy-modal"
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPrivacyModal(true)}
                      className="text-emerald-600 hover:text-emerald-700 hover:underline ml-2 p-0 h-auto"
                    >
                      약관보기
                    </Button>
                    <p className="text-xs text-gray-600 mt-2">
                      세미나와 관련되지 않은 어떠한 곳에도 수집한 개인정보는 사용되지 않습니다.
                    </p>
                  </div>
                </div>
                {form.formState.errors.privacyAgreement && (
                  <p className="text-sm text-red-600 mt-1">
                    개인정보 처리방침에 동의해주세요.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                data-testid="button-submit-application"
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-4 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-xl"
                disabled={applicationMutation.isPending}
              >
                {applicationMutation.isPending ? (
                  "신청 중..."
                ) : (
                  <>
                    신청 완료하기
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </section>
  );
}
