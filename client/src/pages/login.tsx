import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/Navigation";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "로그인 성공", description: `환영합니다, ${data.user.name}님!` });
        if (data.user.role === "admin") {
          setLocation("/admin");
        } else {
          setLocation("/");
        }
      }
    },
    onError: (error: any) => {
      toast({
        title: "로그인 실패",
        description: error.message || "로그인에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: "입력 오류",
        description: "이메일과 비밀번호를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 flex items-center justify-center px-4 min-h-screen">
        <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">TAPMOVE 로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">이메일</Label>
              <Input
                data-testid="input-email"
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                data-testid="input-password"
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
              />
            </div>
            <Button
              data-testid="button-login"
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "로그인 중..." : "로그인"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button
              data-testid="button-home"
              variant="ghost"
              onClick={() => setLocation("/")}
            >
              홈으로 돌아가기
            </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
