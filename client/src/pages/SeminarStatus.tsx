import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, CheckCircle, Clock, XCircle, Edit2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const statusFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z.string().min(1, "전화번호를 입력해주세요"),
});

const editNameSchema = z.object({
  newName: z.string().min(1, "새 이름을 입력해주세요"),
  phone: z.string().min(1, "전화번호를 입력해주세요"),
});

type StatusFormData = z.infer<typeof statusFormSchema>;
type EditNameData = z.infer<typeof editNameSchema>;

export default function SeminarStatus() {
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const editForm = useForm<EditNameData>({
    resolver: zodResolver(editNameSchema),
    defaultValues: {
      newName: "",
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
        setApplicationData(result);
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

  const onEditSubmit = async (data: EditNameData) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/applications/${applicationData.id}/name`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "이름 수정 완료",
          description: "이름이 성공적으로 수정되었습니다.",
        });
        setApplicationData({ ...applicationData, name: result.newName });
        setIsEditModalOpen(false);
        editForm.reset();
      } else {
        toast({
          title: "수정 실패",
          description: result.message || "이름 수정에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "이름 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
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
            <p className="text-gray-600 mb-4">
              입금이 확인되어 세미나 참석이 최종 확정되었습니다.
            </p>
            {applicationData && (
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">등록된 이름:</p>
                <p className="font-semibold text-lg">{applicationData.name}</p>
              </div>
            )}
          </div>
        );
      case "waiting":
        return (
          <div className="text-center py-8">
            <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-orange-700 mb-2">
              관리자가 입금확인중입니다.
            </h3>
            <p className="text-gray-600 mb-4">
              입금 확인 후 세미나 참석이 최종 확정됩니다.
            </p>
            {applicationData && (
              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">등록된 이름:</p>
                <p className="font-semibold text-lg">{applicationData.name}</p>
              </div>
            )}
          </div>
        );
      case "rejected":
        return (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-700 mb-2">
              신청이 반려되었습니다.
            </h3>
            <p className="text-gray-600 mb-4">
              자세한 사항은 관리자에게 문의해주세요.
            </p>
            {applicationData && (
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">등록된 이름:</p>
                <p className="font-semibold text-lg">{applicationData.name}</p>
              </div>
            )}
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
                
                {/* 이름 수정 기능 */}
                {applicationData && applicationStatus !== "not_found" && (
                  <div className="flex gap-2 mt-6">
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          data-testid="button-edit-name"
                          variant="outline"
                          className="flex-1"
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          이름 수정
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>이름 수정</DialogTitle>
                          <DialogDescription>
                            본인 확인을 위해 전화번호를 다시 입력하고 새로운 이름을 입력해주세요.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                          <div>
                            <Label htmlFor="newName">새 이름</Label>
                            <Input
                              data-testid="input-new-name"
                              id="newName"
                              {...editForm.register("newName")}
                              className="mt-2"
                              placeholder="수정할 이름을 입력하세요"
                            />
                            {editForm.formState.errors.newName && (
                              <p className="text-sm text-red-600 mt-1">
                                {editForm.formState.errors.newName.message}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="editPhone">전화번호 확인</Label>
                            <Input
                              data-testid="input-edit-phone"
                              id="editPhone"
                              type="tel"
                              {...editForm.register("phone")}
                              className="mt-2"
                              placeholder="신청 시 입력한 전화번호"
                            />
                            {editForm.formState.errors.phone && (
                              <p className="text-sm text-red-600 mt-1">
                                {editForm.formState.errors.phone.message}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setIsEditModalOpen(false);
                                editForm.reset();
                              }}
                            >
                              취소
                            </Button>
                            <Button
                              data-testid="button-confirm-edit"
                              type="submit"
                              className="flex-1"
                              disabled={isUpdating}
                            >
                              {isUpdating ? "수정 중..." : "수정 완료"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                <Button
                  data-testid="button-check-again"
                  onClick={() => {
                    setApplicationStatus(null);
                    setApplicationData(null);
                    form.reset();
                  }}
                  variant="outline"
                  className="w-full mt-4"
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