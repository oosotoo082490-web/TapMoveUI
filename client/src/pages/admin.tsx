import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { Application, Review, Order } from "@shared/schema";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  useEffect(() => {
    if (!userLoading && (!user || user.role !== "admin")) {
      setLocation("/login");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TAPMOVE 관리자</h1>
              <p className="text-gray-600">안녕하세요, {user.name}님</p>
            </div>
            <Button
              data-testid="button-logout"
              onClick={async () => {
                await apiRequest("POST", "/api/auth/logout");
                setLocation("/");
              }}
              variant="outline"
            >
              로그아웃
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="applications" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="applications">세미나 신청</TabsTrigger>
            <TabsTrigger value="reviews">후기 관리</TabsTrigger>
            <TabsTrigger value="orders">주문 관리</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>세미나 신청 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-gray-50 rounded-2xl p-6 flex justify-between items-start"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{app.name}</h3>
                          <Badge
                            variant={
                              app.status === "approved"
                                ? "default"
                                : app.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {app.status === "approved" ? "승인됨" : app.status === "rejected" ? "거부됨" : "대기중"}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{app.email} • {app.phone}</p>
                        <p className="text-gray-600">주소: {app.address}</p>
                        <p className="text-gray-600">입금자: {app.depositorName}</p>
                        {app.uniformSize && (
                          <p className="text-gray-600">유니폼 사이즈: {app.uniformSize}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          신청일: {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          data-testid={`button-approve-${app.id}`}
                          size="sm"
                          onClick={() =>
                            updateApplicationMutation.mutate({ id: app.id, status: "approved" })
                          }
                          disabled={updateApplicationMutation.isPending}
                        >
                          승인
                        </Button>
                        <Button
                          data-testid={`button-reject-${app.id}`}
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateApplicationMutation.mutate({ id: app.id, status: "rejected" })
                          }
                          disabled={updateApplicationMutation.isPending}
                        >
                          거부
                        </Button>
                      </div>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      아직 신청이 없습니다.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>후기 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-50 rounded-2xl p-6 flex justify-between items-start"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{review.authorName}</h3>
                          <Badge
                            variant={
                              review.status === "approved"
                                ? "default"
                                : review.status === "hidden_by_filter"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {review.status === "approved"
                              ? "승인됨"
                              : review.status === "hidden_by_filter"
                              ? "필터됨"
                              : "대기중"}
                          </Badge>
                          <div className="flex">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <span key={i} className="text-yellow-400">★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed max-w-2xl">
                          {review.reviewBody}
                        </p>
                        <p className="text-sm text-gray-500">
                          작성일: {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          data-testid={`button-approve-review-${review.id}`}
                          size="sm"
                          onClick={() =>
                            updateReviewMutation.mutate({ id: review.id, status: "approved" })
                          }
                          disabled={updateReviewMutation.isPending}
                        >
                          승인
                        </Button>
                        <Button
                          data-testid={`button-hide-review-${review.id}`}
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateReviewMutation.mutate({ id: review.id, status: "hidden_by_filter" })
                          }
                          disabled={updateReviewMutation.isPending}
                        >
                          숨김
                        </Button>
                      </div>
                    </div>
                  ))}
                  {allReviews.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      아직 후기가 없습니다.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>주문 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-gray-50 rounded-2xl p-6 flex justify-between items-start"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{order.customerName}</h3>
                          <Badge
                            variant={order.orderType === "bulk" ? "secondary" : "outline"}
                          >
                            {order.orderType === "bulk" ? "대량구매" : "일반구매"}
                          </Badge>
                          <Badge
                            variant={
                              order.paymentStatus === "paid"
                                ? "default"
                                : order.paymentStatus === "failed"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {order.paymentStatus === "paid"
                              ? "결제완료"
                              : order.paymentStatus === "failed"
                              ? "결제실패"
                              : "결제대기"}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{order.customerEmail} • {order.customerPhone}</p>
                        <p className="text-gray-600">배송지: {order.shippingAddress}</p>
                        <p className="text-gray-600">
                          수량: {order.quantity}개 • 총액: {order.totalAmount.toLocaleString()}원
                        </p>
                        <p className="text-sm text-gray-500">
                          주문일: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      아직 주문이 없습니다.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>시스템 설정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    비밀번호 변경 및 기타 설정은 추후 구현됩니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
