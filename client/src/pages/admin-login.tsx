import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("/api/auth/login", "POST", data);
      return response;
    },
    onSuccess: (data: any) => {
      if (data.success && data.user?.role === "admin") {
        toast({
          title: "로그인 성공",
          description: "관리자 대시보드로 이동합니다.",
        });
        setLocation("/admin");
      } else {
        toast({
          title: "접근 권한 없음",
          description: "관리자 계정이 아닙니다.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "로그인 실패",
        description: error.message || "이메일 또는 비밀번호를 확인해주세요.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-slate-700" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">TAPMOVE 관리자</h2>
          <p className="mt-2 text-gray-600">관리자 계정으로 로그인하세요</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">관리자 로그인</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="email">이메일 주소</Label>
                <Input
                  data-testid="input-admin-email"
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="mt-2"
                  placeholder="admin@tapmove.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative mt-2">
                  <Input
                    data-testid="input-admin-password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    placeholder="비밀번호를 입력하세요"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  data-testid="button-back-home"
                  type="button"
                  onClick={() => setLocation("/")}
                  variant="outline"
                  className="flex-1"
                >
                  홈으로 돌아가기
                </Button>
                <Button
                  data-testid="button-admin-login"
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-amber-100"
                >
                  {loginMutation.isPending ? "로그인 중..." : "로그인"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            일반 사용자는 로그인 없이{" "}
            <button
              onClick={() => setLocation("/")}
              className="text-primary hover:underline"
            >
              홈페이지
            </button>
            에서 세미나 신청 및 제품 구매가 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}