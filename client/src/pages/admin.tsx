import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, UserCheck, Clock, CheckCircle, Settings, LogOut, Search, Eye } from "lucide-react";
import type { Application, Review, Order, User } from "@shared/schema";

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요"),
  newPassword: z.string().min(8, "새 비밀번호는 8자 이상이어야 합니다"),
  confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

export default function Admin() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Check authentication
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  useEffect(() => {
    console.log("Auth check:", { user, userLoading });
    
    if (!userLoading && (!user || user.role !== "admin")) {
      console.log("Admin access denied - redirecting to login");
      setLocation("/admin/login");
    }
  }, [user, userLoading, setLocation]);

  // Fetch data
  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    enabled: !!user && user.role === "admin",
  });

  const { data: allReviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews/all"],
    enabled: !!user && user.role === "admin",
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user && user.role === "admin",
  });

  // Password change form - hooks must be called before any early returns
  const form = useForm<PasswordChangeData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Mutations
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/applications/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({ title: "성공", description: "신청 상태가 업데이트되었습니다." });
    },
    onError: () => {
      toast({ title: "오류", description: "상태 업데이트에 실패했습니다.", variant: "destructive" });
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/reviews/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/all"] });
      toast({ title: "성공", description: "후기 상태가 업데이트되었습니다." });
    },
    onError: () => {
      toast({ title: "오류", description: "상태 업데이트에 실패했습니다.", variant: "destructive" });
    },
  });

  const passwordChangeMutation = useMutation({
    mutationFn: async (data: PasswordChangeData) => {
      const response = await apiRequest("POST", "/api/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "성공", description: "비밀번호가 변경되었습니다." });
      form.reset();
    },
    onError: (error: any) => {
      toast({ 
        title: "오류", 
        description: error.message || "비밀번호 변경에 실패했습니다.", 
        variant: "destructive" 
      });
    },
  });

  // Early returns after all hooks
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  // Determine current tab based on location
  const currentTab = location.includes('/admin/applications') ? 'applications' : 
                    location.includes('/admin/settings') ? 'settings' : 'applications';

  // Filter applications based on search
  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.phone.includes(searchTerm) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    await apiRequest("POST", "/api/auth/logout", {});
    setLocation("/");
  };

  const onSubmitPasswordChange = (data: PasswordChangeData) => {
    passwordChangeMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">TAPMOVE 관리자</h1>
              <span className="text-gray-500">|</span>
              <span className="text-gray-600">{currentTab === 'applications' ? '신청자 관리' : '설정'}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">안녕하세요, {user.name}님</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>로그아웃</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button 
              className={`py-4 px-2 border-b-2 font-medium ${
                location.includes('/admin/dashboard') 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setLocation("/admin/dashboard")}
            >
              📋 대시보드
            </button>
            <button 
              className={`py-4 px-2 border-b-2 font-medium ${
                currentTab === 'applications' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setLocation("/admin/applications")}
            >
              📁 신청자 관리
            </button>
            <button 
              className={`py-4 px-2 border-b-2 font-medium ${
                currentTab === 'settings' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setLocation("/admin/settings")}
            >
              🛠️ 설정
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{currentTab === 'applications' ? (
          // Applications Management Tab
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">신청자 관리</h2>
              <p className="text-gray-600">세미나 신청자를 관리하고 상태를 업데이트하세요</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="이름, 전화번호, 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Applications Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>신청자 목록</span>
                  <Badge variant="secondary">{filteredApplications.length}명</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <div key={application.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                          <p className="font-medium text-gray-900">{application.name}</p>
                          <p className="text-sm text-gray-500">{application.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{application.email}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(application.createdAt).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                        <div>
                          <Badge 
                            variant={
                              application.status === "confirmed" ? "default" : 
                              application.status === "waiting" ? "secondary" : 
                              "destructive"
                            }
                          >
                            {application.status === "confirmed" ? "최종 확정" : 
                             application.status === "waiting" ? "입금 확인 대기" : 
                             application.status === "rejected" ? "반려" : "대기"}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Select
                            value={application.status}
                            onValueChange={(newStatus) => 
                              updateApplicationMutation.mutate({ id: application.id, status: newStatus })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="waiting">대기중</SelectItem>
                              <SelectItem value="confirmed">최종 확정</SelectItem>
                              <SelectItem value="rejected">반려</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Show application details
                              toast({
                                title: "신청자 정보",
                                description: `${application.name} (${application.phone})의 상세 정보를 확인합니다.`,
                              });
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredApplications.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        {searchTerm ? '검색 결과가 없습니다.' : '아직 신청자가 없습니다.'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Settings Tab
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">관리자 설정</h2>
              <p className="text-gray-600">계정 설정을 관리하세요</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>비밀번호 변경</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitPasswordChange)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>현재 비밀번호</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>새 비밀번호</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>비밀번호 확인</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={passwordChangeMutation.isPending}
                      >
                        {passwordChangeMutation.isPending ? "변경 중..." : "비밀번호 변경"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5" />
                    <span>계정 정보</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">관리자 이름</label>
                    <p className="text-lg font-medium">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">사용자 아이디</label>
                    <p className="text-lg font-medium">{user.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">권한</label>
                    <Badge className="ml-2">관리자</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
