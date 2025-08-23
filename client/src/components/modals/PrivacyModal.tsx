import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>개인정보 수집 및 이용 약관</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-semibold text-lg text-gray-900 mb-2">1. 개인정보 수집 목적</h4>
              <p>세미나 신청 접수 및 관리, 교육 서비스 제공, 결제 처리</p>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-gray-900 mb-2">2. 수집하는 개인정보 항목</h4>
              <p>성명, 생년월일, 이메일, 연락처, 주소, 입금자명</p>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-gray-900 mb-2">3. 개인정보 보유 및 이용기간</h4>
              <p>서비스 이용 완료 후 3년간 보관 (관련 법령에 따라)</p>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-gray-900 mb-2">4. 개인정보 제3자 제공</h4>
              <p>원칙적으로 개인정보를 외부에 제공하지 않으며, 제공이 필요한 경우 별도 동의를 받습니다.</p>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-gray-900 mb-2">5. 개인정보의 처리 위탁</h4>
              <p>
                회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>결제 처리: 토스페이먼츠 (결제 승인 및 처리)</li>
                <li>SMS 발송: 네이버 클라우드 플랫폼 (신청 확인 및 안내)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-gray-900 mb-2">6. 개인정보 보호책임자</h4>
              <p>
                개인정보 보호책임자: TAPMOVE 대표
                <br />
                연락처: info@tapmove.co.kr
                <br />
                전화: 053-XXX-XXXX
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-gray-900 mb-2">7. 개인정보 처리방침 변경</h4>
              <p>
                이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-gray-900 mb-2">8. 개인정보의 권리</h4>
              <p>
                정보주체는 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>개인정보 처리현황 통지요구</li>
                <li>개인정보 처리정지 요구</li>
                <li>개인정보의 정정·삭제 요구</li>
                <li>손해배상 청구</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4 border-t">
          <Button data-testid="button-close-privacy" onClick={onClose}>
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
