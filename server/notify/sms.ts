import fetch from 'node-fetch';
import { storage } from '../storage';
import type { InsertSmsLog } from '@shared/schema';

interface CoolSMSConfig {
  apiKey: string;
  apiSecret: string;
  senderNumber: string;
}

interface SMSMessage {
  to: string;
  from: string;
  text: string;
}

interface CoolSMSResponse {
  success_count: number;
  error_count: number;
  result_data: Array<{
    recipient: string;
    result_code: string;
    result_message: string;
  }>;
}

class SMSService {
  private config: CoolSMSConfig;
  private adminPhone: string;
  private emailFallback: string;
  private isEnabled: boolean;

  constructor() {
    this.config = {
      apiKey: process.env.SMS_API_KEY || '',
      apiSecret: process.env.SMS_API_SECRET || '',
      senderNumber: process.env.SMS_SENDER_NUMBER || '',
    };
    this.adminPhone = process.env.ADMIN_PHONE || '';
    this.emailFallback = process.env.EMAIL_FALLBACK || '';
    this.isEnabled = process.env.SMS_PROVIDER === 'coolsms' && !!this.config.apiKey;
  }

  /**
   * 개별 SMS 발송
   */
  async sendSMS(to: string, text: string, eventType: string = 'manual', relatedId?: string): Promise<boolean> {
    if (!this.isEnabled) {
      console.warn('SMS service is disabled');
      await this.logSMS(to, text, 'failed', 'SMS service disabled', eventType, relatedId);
      return false;
    }

    try {
      const success = await this.sendViaCoolSMS(to, text);
      await this.logSMS(to, text, success ? 'success' : 'failed', success ? undefined : 'API call failed', eventType, relatedId);
      
      if (!success) {
        // 재시도 1회
        const retrySuccess = await this.sendViaCoolSMS(to, text);
        await this.logSMS(to, text, retrySuccess ? 'success' : 'failed', retrySuccess ? undefined : 'Retry failed', eventType, relatedId);
        
        if (!retrySuccess) {
          await this.sendFailureNotification(eventType, to);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('SMS send error:', error);
      await this.logSMS(to, text, 'failed', error instanceof Error ? error.message : 'Unknown error', eventType, relatedId);
      await this.sendFailureNotification(eventType, to);
      return false;
    }
  }

  /**
   * 관리자에게 SMS 발송
   */
  async sendToAdmin(text: string, eventType: string = 'admin_notification', relatedId?: string): Promise<boolean> {
    if (!this.adminPhone) {
      console.warn('Admin phone number not configured');
      return false;
    }
    
    return this.sendSMS(this.adminPhone, text, eventType, relatedId);
  }

  /**
   * 쿨에스엠에스 API 호출
   */
  private async sendViaCoolSMS(to: string, text: string): Promise<boolean> {
    try {
      const authHeader = this.createAuthHeader();
      
      const message: SMSMessage = {
        to: to.replace(/[^0-9]/g, ''), // 숫자만 추출
        from: this.config.senderNumber,
        text: text
      };

      const response = await fetch('https://api.coolsms.co.kr/sms/2/send', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        console.error('CoolSMS API error:', response.status, response.statusText);
        return false;
      }

      const result: CoolSMSResponse = await response.json() as CoolSMSResponse;
      
      return result.success_count > 0 && result.error_count === 0;
    } catch (error) {
      console.error('CoolSMS request error:', error);
      return false;
    }
  }

  /**
   * HMAC-SHA256 인증 헤더 생성
   */
  private createAuthHeader(): string {
    const crypto = require('crypto');
    const date = new Date().toISOString();
    const salt = crypto.randomUUID();
    const data = date + salt;
    
    const signature = crypto
      .createHmac('sha256', this.config.apiSecret)
      .update(data)
      .digest('hex');

    return `HMAC-SHA256 apikey=${this.config.apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
  }

  /**
   * SMS 로그 저장
   */
  private async logSMS(phoneNumber: string, message: string, status: 'success' | 'failed', errorMessage?: string, eventType: string = 'manual', relatedId?: string): Promise<void> {
    try {
      const logData: InsertSmsLog = {
        phoneNumber,
        message,
        status,
        provider: 'coolsms',
        errorMessage,
        eventType,
        relatedId
      };
      
      await storage.createSmsLog(logData);
    } catch (error) {
      console.error('Failed to log SMS:', error);
    }
  }

  /**
   * SMS 발송 실패 시 관리자에게 알림
   */
  private async sendFailureNotification(eventName: string, targetPhone: string): Promise<void> {
    try {
      // 관리자에게 SMS 실패 알림 (재귀 호출 방지를 위해 직접 API 호출)
      const failureText = `[TAPMOVE] 문자 발송 실패: ${eventName}/${targetPhone.slice(-4)}. 대시보드 확인 필요.`;
      console.error('SMS Failure:', failureText);
      
      // 이메일 대체 발송은 실제 환경에서 구현
      // 여기서는 로그만 남김
      console.log(`Email fallback would be sent to: ${this.emailFallback}`);
    } catch (error) {
      console.error('Failed to send failure notification:', error);
    }
  }

  /**
   * 숫자에 천단위 콤마 추가
   */
  static numberWithCommas(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

// SMS 텍스트 생성 함수들
export class SMSTemplates {
  /**
   * 관리자용 세미나 신청 접수 알림
   */
  static adminSeminarApplication(applicant: { name: string; phone: string; uniformSize?: string }, stats: { total: number; remaining: number }): string {
    const size = applicant.uniformSize || 'M';
    return `[TAPMOVE] 신규 세미나 신청: ${applicant.name}/${applicant.phone.slice(-4)}, 사이즈 ${size}. 현재 ${stats.total}명(잔여 ${stats.remaining}).`;
  }

  /**
   * 관리자용 세미나 결제 확정 알림
   */
  static adminSeminarPayment(applicant: { name: string; phone: string }): string {
    return `[TAPMOVE] 결제확정: ${applicant.name}/${applicant.phone.slice(-4)} — 세미나 결제 완료.`;
  }

  /**
   * 관리자용 제품 주문 접수 알림
   */
  static adminProductOrder(order: { orderNo: string; productName: string; qty: number; total: number; shippingFee: number }): string {
    return `[TAPMOVE] 신규 주문 ${order.orderNo}: ${order.productName}/${order.qty}개, 합계 ${SMSService.numberWithCommas(order.total)}원(배송비 ${SMSService.numberWithCommas(order.shippingFee)}원).`;
  }

  /**
   * 신청자용 세미나 신청 접수 안내
   */
  static customerSeminarApplication(applicant: { name: string }, seminar: { dateText: string; place: string; contact: string }): string {
    return `[TAPMOVE] ${applicant.name}님 신청이 접수되었습니다. 교육일 ${seminar.dateText}, 장소: ${seminar.place}. 준비물: 실내운동화·수건. 문의 ${seminar.contact}`;
  }

  /**
   * 신청자용 세미나 결제 확정 안내
   */
  static customerSeminarPayment(): string {
    return `[TAPMOVE] 결제 확인 완료! 세미나에서 뵙겠습니다. 오시는 길/공지: 홈페이지 공지 확인 부탁드립니다.`;
  }

  /**
   * 고객용 제품 주문 접수 안내
   */
  static customerProductOrder(order: { orderNo: string; productName: string; qty: number }): string {
    return `[TAPMOVE] 주문 접수(${order.orderNo}) — ${order.productName}/${order.qty}개, 결제확인 후 발송 예정입니다.`;
  }

  /**
   * 고객용 제품 출고 안내
   */
  static customerProductShipping(order: { trackingNo: string }): string {
    return `[TAPMOVE] 출고 완료 — 운송장 ${order.trackingNo}로 조회 가능합니다. 감사합니다.`;
  }
}

// 싱글톤 인스턴스
export const smsService = new SMSService();

// 편의 함수들
export async function sendSMS(params: {
  phoneNumber: string;
  message: string;
  eventType: string;
  relatedId?: string;
}): Promise<boolean> {
  return await smsService.sendSMS(params.phoneNumber, params.message, params.eventType, params.relatedId);
}