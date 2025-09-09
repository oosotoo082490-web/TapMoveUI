import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Users, UserCheck, Clock, CheckCircle, Settings, LogOut, Search } from "lucide-react";
import type { Application, User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  // Check authentication
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  useEffect(() => {
    if (!userLoading && (!user || user.role !== "admin")) {
      setLocation("/admin/login");
    }
  }, [user, userLoading, setLocation]);

  // Fetch applications data
  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    enabled: !!user && user.role === "admin",
  });

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

  // Calculate statistics
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const todayApplications = applications.filter(app => 
    new Date(app.createdAt) >= todayStart
  ).length;
  
  const totalApplications = applications.length;
  const waitingApplications = applications.filter(app => app.status === "waiting").length;
  const confirmedApplications = applications.filter(app => app.status === "confirmed").length;

  const handleLogout = async () => {
    await apiRequest("POST", "/api/auth/logout", {});
    setLocation("/");
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
              <span className="text-gray-600">대시보드</span>
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
              className="py-4 px-2 border-b-2 border-blue-500 text-blue-600 font-medium"
              onClick={() => setLocation("/admin/dashboard")}
            >
              📋 대시보드
            </button>
            <button 
              className="py-4 px-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium"
              onClick={() => setLocation("/admin/applications")}
            >
              📁 신청자 관리
            </button>
            <button 
              className="py-4 px-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium"
              onClick={() => setLocation("/admin/settings")}
            >
              🛠️ 설정
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Dashboard Content */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h2>
          <p className="text-gray-600">세미나 신청 현황을 한눈에 확인하세요</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                오늘 신규 신청
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{todayApplications}</div>
              <p className="text-xs text-gray-500">
                오늘 접수된 신청서
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                전체 신청자
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalApplications}</div>
              <p className="text-xs text-gray-500">
                총 누적 신청자 수
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                입금 확인 대기
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{waitingApplications}</div>
              <p className="text-xs text-gray-500">
                확인이 필요한 신청
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                최종 확정
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{confirmedApplications}</div>
              <p className="text-xs text-gray-500">
                세미나 참석 확정자
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>빠른 작업</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => setLocation("/admin/applications")}
                className="w-full justify-start"
                variant="outline"
              >
                📋 신청자 리스트 보기
              </Button>
              <Button 
                onClick={() => setLocation("/admin/applications")}
                className="w-full justify-start"
                variant="outline"
              >
                ⏳ 대기 중인 신청 처리
              </Button>
              <Button 
                onClick={() => setLocation("/admin/settings")}
                className="w-full justify-start"
                variant="outline"
              >
                🛠️ 관리자 설정
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>최근 신청자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-gray-500">{app.phone}</p>
                    </div>
                    <Badge variant={
                      app.status === "confirmed" ? "default" : 
                      app.status === "waiting" ? "secondary" : 
                      "destructive"
                    }>
                      {app.status === "confirmed" ? "확정" : 
                       app.status === "waiting" ? "대기" : "반려"}
                    </Badge>
                  </div>
                ))}
                {applications.length === 0 && (
                  <p className="text-gray-500 text-center py-4">아직 신청자가 없습니다.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}