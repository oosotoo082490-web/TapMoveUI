import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ReviewPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewPasscodeModal({ isOpen, onClose }: ReviewPasscodeModalProps) {
  const [step, setStep] = useState<"passcode" | "review">("passcode");
  const [passcode, setPasscode] = useState("");
  const [reviewData, setReviewData] = useState({
    reviewBody: "",
    authorName: "익명",
    rating: 5,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const verifyPasscodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/reviews/verify-passcode", { passcode: code });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "인증 성공", description: "후기를 작성하실 수 있습니다." });
        setStep("review");
      }
    },
    onError: (error: any) => {
      toast({
        title: "인증 실패",
        description: error.message || "올바른 비밀번호를 입력해주세요.",
        variant: "destructive",
      });
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data: typeof reviewData) => {
      const response = await apiRequest("POST", "/api/reviews", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "후기 등록", description: "후기가 접수되었습니다. 검토 후 게시됩니다." });
        queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
        handleClose();
      }
    },
    onError: (error: any) => {
      toast({
        title: "등록 실패",
        description: error.message || "후기 등록 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setStep("passcode");
    setPasscode("");
    setReviewData({ reviewBody: "", authorName: "익명", rating: 5 });
    onClose();
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.length !== 4) {
      toast({
        title: "입력 오류",
        description: "4자리 비밀번호를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    verifyPasscodeMutation.mutate(passcode);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewData.reviewBody.length < 10) {
      toast({
        title: "입력 오류",
        description: "후기는 10자 이상 작성해주세요.",
        variant: "destructive",
      });
      return;
    }
    submitReviewMutation.mutate(reviewData);
  };

  const handlePasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
    setPasscode(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === "passcode" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">후기 작성 권한 확인</DialogTitle>
            </DialogHeader>
            <div className="text-center mb-6">
              <p className="text-gray-600">
                세미나 참석자만 작성 가능합니다.
                <br />
                대표자에게 안내받은 비밀번호 4자리를 입력해주세요.
              </p>
            </div>
            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div>
                <Input
                  data-testid="input-review-passcode"
                  type="text"
                  value={passcode}
                  onChange={handlePasscodeChange}
                  maxLength={4}
                  placeholder="****"
                  className="text-center text-2xl font-bold tracking-widest"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  data-testid="button-cancel-review-passcode"
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  data-testid="button-verify-review-passcode"
                  type="submit"
                  className="flex-1"
                  disabled={verifyPasscodeMutation.isPending}
                >
                  {verifyPasscodeMutation.isPending ? "확인 중..." : "확인"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>후기 작성</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <Label htmlFor="authorName">작성자명</Label>
                <Input
                  data-testid="input-author-name"
                  id="authorName"
                  value={reviewData.authorName}
                  onChange={(e) =>
                    setReviewData((prev) => ({ ...prev, authorName: e.target.value }))
                  }
                  placeholder="익명"
                />
              </div>
              <div>
                <Label htmlFor="reviewBody">후기 내용 *</Label>
                <Textarea
                  data-testid="textarea-review-body"
                  id="reviewBody"
                  value={reviewData.reviewBody}
                  onChange={(e) =>
                    setReviewData((prev) => ({ ...prev, reviewBody: e.target.value }))
                  }
                  rows={6}
                  minLength={10}
                  maxLength={2000}
                  placeholder="세미나 참여 후기를 자유롭게 작성해주세요. (10자 이상 2000자 이하)"
                  className="resize-none"
                />
                <p className="text-sm text-gray-500 mt-2">
                  작성하신 후기는 관리자 검토 후 공개됩니다.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  data-testid="button-cancel-review"
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  data-testid="button-submit-review"
                  type="submit"
                  className="flex-1"
                  disabled={submitReviewMutation.isPending}
                >
                  {submitReviewMutation.isPending ? "등록 중..." : "후기 등록"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
