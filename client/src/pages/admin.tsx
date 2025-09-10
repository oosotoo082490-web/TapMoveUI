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
import { Users, UserCheck, Clock, CheckCircle, Settings, LogOut, Search, Eye, EyeOff, Download, FileText, Calendar, MapPin, User, Shirt } from "lucide-react";
import type { Application, Review, Order } from "@shared/schema";

// User type from schema
type UserType = {
  id: string;
  username: string | null;
  email: string | null;
  name: string;
  role: "admin" | "user";
  createdAt: Date;
};

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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);

  // Check authentication
  const { data: user, isLoading: userLoading } = useQuery<UserType>({
    queryKey: ["/api/auth/me"],
  });

  useEffect(() => {
    console.log("Auth check:", { user, userLoading });
    
    // 로딩이 완료되고 사용자가 없거나 관리자가 아닐 때만 리다이렉트
    if (!userLoading && (!user || user.role !== "admin")) {
      console.log("Admin access denied - redirecting to login");
      // 약간의 지연을 두어 Race condition 방지
      setTimeout(() => {
        setLocation("/admin/login");
      }, 100);
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
  const passwordForm = useForm<PasswordChangeData>({
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
    onSuccess: async () => {
      toast({ 
        title: "성공", 
        description: "비밀번호가 변경되었습니다. 보안을 위해 다시 로그인해주세요.",
        duration: 3000 
      });
      passwordForm.reset();
      
      // 비밀번호 변경 후 자동 로그아웃
      setTimeout(async () => {
        await apiRequest("POST", "/api/auth/logout", {});
        // 모든 쿼리 캐시 무효화
        queryClient.clear();
        setLocation("/admin/login");
      }, 2000);
    },
    onError: (error: any) => {
      toast({ 
        title: "오류", 
        description: error.message || "비밀번호 변경에 실패했습니다.", 
        variant: "destructive",
        duration: 3000
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

  // Excel download function
  const downloadExcel = () => {
    import('xlsx').then((XLSX) => {
      const worksheet = XLSX.utils.json_to_sheet(
        applications.map(app => ({
          '이름': app.name,
          '생년월일': app.birthdate,
          '이메일': app.email,
          '연락처': app.phone,
          '주소': app.address,
          '입금자명': app.depositorName,
          '유니폼 사이즈': app.uniformSize || '미선택',
          '강습 계획': app.classPlan === 'plan' ? '예' : '아니오',
          '유아': app.classTypeInfant ? 'O' : '',
          '초등': app.classTypeElementary ? 'O' : '',
          '중고등': app.classTypeMiddleHigh ? 'O' : '',
          '성인': app.classTypeAdult ? 'O' : '',
          '시니어': app.classTypeSenior ? 'O' : '',
          '재활': app.classTypeRehab ? 'O' : '',
          '신청 상태': getStatusText(app.status),
          '관리자 메모': app.adminMemo || '',
          '신청일시': new Date(app.createdAt).toLocaleString('ko-KR'),
        }))
      );
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '신청자 목록');
      
      const today = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `TAPMOVE_신청자목록_${today}.xlsx`);
      
      toast({
        title: "다운로드 완료",
        description: "엑셀 파일이 다운로드되었습니다.",
        duration: 2000,
      });
    });
  };

  // Helper function for status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return '신청 확인';
      case 'payment_confirmed': return '입금 확인';
      case 'confirmed': return '최종 신청 완료';
      case 'rejected': return '취소됨';
      default: return '대기중';
    }
  };

  // Helper function for status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'waiting': return 'secondary';
      case 'payment_confirmed': return 'outline';
      case 'confirmed': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  // Helper function for class types
  const getClassTypes = (app: any) => {
    const types = [];
    if (app.classTypeInfant) types.push('유아');
    if (app.classTypeElementary) types.push('초등');
    if (app.classTypeMiddleHigh) types.push('중고등');
    if (app.classTypeAdult) types.push('성인');
    if (app.classTypeSenior) types.push('시니어');
    if (app.classTypeRehab) types.push('재활');
    return types.length > 0 ? types.join(', ') : '미선택';
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
                <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                  <span>신청자 목록</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{filteredApplications.length}명</Badge>
                    {applications.length > 0 && (
                      <Button 
                        onClick={downloadExcel}
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>엑셀로 다운로드</span>
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <div key={application.id} className="bg-gray-50 rounded-lg p-4 lg:p-6">
                      {/* Mobile/Desktop Responsive Layout */}
                      <div className="space-y-4">
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <h3 className="font-medium text-gray-900">{application.name}</h3>
                            <Badge variant={getStatusVariant(application.status)}>
                              {getStatusText(application.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Select
                              value={application.status}
                              onValueChange={(newStatus) => 
                                updateApplicationMutation.mutate({ id: application.id, status: newStatus })
                              }
                            >
                              <SelectTrigger className="w-36">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="waiting">신청 확인</SelectItem>
                                <SelectItem value="payment_confirmed">입금 확인</SelectItem>
                                <SelectItem value="confirmed">최종 신청 완료</SelectItem>
                                <SelectItem value="rejected">취소됨</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => 
                                setSelectedApplication(
                                  selectedApplication === application.id ? null : application.id
                                )
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Basic Info Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="space-y-1">
                            <p className="text-gray-500">연락처</p>
                            <p className="font-medium">{application.phone}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-500">이메일</p>
                            <p className="font-medium">{application.email}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-500">신청일시</p>
                            <p className="font-medium">
                              {new Date(application.createdAt).toLocaleString('ko-KR')}
                            </p>
                          </div>
                        </div>

                        {/* Detailed Info (Collapsible) */}
                        {selectedApplication === application.id && (
                          <div className="border-t border-gray-200 pt-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3 text-gray-400" />
                                  <p className="text-gray-500">생년월일</p>
                                </div>
                                <p className="font-medium">{application.birthdate}</p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3 text-gray-400" />
                                  <p className="text-gray-500">주소</p>
                                </div>
                                <p className="font-medium">{application.address}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-gray-500">입금자명</p>
                                <p className="font-medium">{application.depositorName}</p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                  <Shirt className="h-3 w-3 text-gray-400" />
                                  <p className="text-gray-500">유니폼 사이즈</p>
                                </div>
                                <p className="font-medium">{application.uniformSize || '미선택'}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-gray-500">강습 계획</p>
                                <p className="font-medium">
                                  {application.classPlan === 'plan' ? '예' : '아니오'}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-gray-500">대상 연령층</p>
                                <p className="font-medium">{getClassTypes(application)}</p>
                              </div>
                            </div>
                            {application.adminMemo && (
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                  <FileText className="h-3 w-3 text-gray-400" />
                                  <p className="text-gray-500">관리자 메모</p>
                                </div>
                                <p className="font-medium bg-yellow-50 p-2 rounded border">
                                  {application.adminMemo}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
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
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onSubmitPasswordChange)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
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
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>새 비밀번호</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showNewPassword ? "text" : "password"} 
                                  {...field} 
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                  {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>비밀번호 확인</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showConfirmPassword ? "text" : "password"} 
                                  {...field} 
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
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
