import { useState, useEffect } from "react";
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
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import Navigation from "@/components/Navigation";

const loginSchema = z.object({
  username: z.string().min(1, "아이디를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 페이지 로드 시 저장된 정보 불러오기
  useEffect(() => {
    // 이전 캐시 정리
    localStorage.removeItem('tapmove_admin_username');
    localStorage.removeItem('tapmove_admin_remember');
    
    const savedUsername = localStorage.getItem('tapmove_admin_username');
    const savedRememberMe = localStorage.getItem('tapmove_admin_remember') === 'true';
    
    if (savedUsername && savedRememberMe) {
      form.setValue('username', savedUsername);
      setRememberMe(true);
    }
  }, [form]);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
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
        description: error.message || "아이디 또는 비밀번호가 올바르지 않습니다.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    // 기억하기 설정에 따라 로컬스토리지에 저장
    if (rememberMe) {
      localStorage.setItem('tapmove_admin_username', data.username);
      localStorage.setItem('tapmove_admin_remember', 'true');
    } else {
      localStorage.removeItem('tapmove_admin_username');
      localStorage.removeItem('tapmove_admin_remember');
    }
    
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-24 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">관리자페이지입니다.</h2>
          <p className="mt-2 text-gray-600">관리자 계정으로 로그인하세요</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">관리자 로그인</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="username">아이디</Label>
                <Input
                  data-testid="input-admin-username"
                  id="username"
                  {...form.register("username")}
                  className="mt-2"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.username.message}
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                  아이디 기억하기
                </Label>
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

        </div>
      </div>
    </div>
  );
}