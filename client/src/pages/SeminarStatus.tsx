import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const statusFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z.string().min(1, "전화번호를 입력해주세요"),
});

type StatusFormData = z.infer<typeof statusFormSchema>;

export default function SeminarStatus() {
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const onSubmit = async (data: StatusFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/applications/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setApplicationStatus(result.status);
      } else {
        if (result.message === "신청 정보를 찾을 수 없습니다.") {
          setApplicationStatus("not_found");
        } else {
          toast({
            title: "오류 발생",
            description: result.message || "신청 현황을 조회할 수 없습니다.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "신청 현황을 조회할 수 없습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDisplay = () => {
    switch (applicationStatus) {
      case "confirmed":
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-700 mb-2">
              세미나 신청이 완료됐습니다.
            </h3>
            <p className="text-gray-600">
              입금이 확인되어 세미나 참석이 최종 확정되었습니다.
            </p>
          </div>
        );
      case "waiting":
        return (
          <div className="text-center py-8">
            <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-orange-700 mb-2">
              관리자가 입금확인중입니다.
            </h3>
            <p className="text-gray-600">
              입금 확인 후 세미나 참석이 최종 확정됩니다.
            </p>
          </div>
        );
      case "rejected":
        return (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-700 mb-2">
              신청이 반려되었습니다.
            </h3>
            <p className="text-gray-600">
              자세한 사항은 관리자에게 문의해주세요.
            </p>
          </div>
        );
      case "not_found":
        return (
          <div className="text-center py-8">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              세미나 신청을 진행해주세요.
            </h3>
            <p className="text-gray-600">
              입력하신 정보로 등록된 신청이 없습니다.
            </p>
            <Button
              onClick={() => window.location.href = "/seminar/apply"}
              className="mt-4 bg-primary hover:bg-primary/90"
            >
              세미나 신청하러 가기
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">세미나 신청현황</CardTitle>
            <CardDescription className="text-emerald-100">
              신청 시 작성한 이름과 전화번호를 입력하여 현황을 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {!applicationStatus ? (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-base font-semibold">
                    이름 *
                  </Label>
                  <Input
                    data-testid="input-status-name"
                    id="name"
                    {...form.register("name")}
                    className="mt-2 h-12"
                    placeholder="신청 시 작성한 이름을 입력하세요"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-base font-semibold">
                    전화번호 *
                  </Label>
                  <Input
                    data-testid="input-status-phone"
                    id="phone"
                    type="tel"
                    {...form.register("phone")}
                    className="mt-2 h-12"
                    placeholder="신청 시 작성한 전화번호를 입력하세요"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <Button
                  data-testid="button-check-status"
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "현황 확인중..."
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      현황보기
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div>
                {getStatusDisplay()}
                <Button
                  data-testid="button-check-again"
                  onClick={() => {
                    setApplicationStatus(null);
                    form.reset();
                  }}
                  variant="outline"
                  className="w-full mt-6"
                >
                  다시 조회하기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}