import fetch from 'node-fetch';
import { storage } from './storage';
import { sendSMS } from './notify/sms';

export interface TossPaymentRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface TossPaymentResponse {
  version: string;
  paymentKey: string;
  type: string;
  orderId: string;
  orderName: string;
  mId: string;
  currency: string;
  method: string;
  totalAmount: number;
  balanceAmount: number;
  status: 'READY' | 'IN_PROGRESS' | 'WAITING_FOR_DEPOSIT' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED';
  requestedAt: string;
  approvedAt?: string;
  useEscrow: boolean;
  lastTransactionKey?: string;
  suppliedAmount: number;
  vat: number;
  cultureExpense: boolean;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  cancels?: any[];
  isPartialCancelable: boolean;
  card?: any;
  virtualAccount?: any;
  secret?: string;
  mobilePhone?: any;
  giftCertificate?: any;
  transfer?: any;
  receipt?: any;
  checkout?: any;
  easyPay?: any;
  country: string;
  failure?: any;
}

export class TossPaymentsService {
  private baseUrl = 'https://api.tosspayments.com/v1';
  private clientKey: string;
  private secretKey: string;

  constructor() {
    // 테스트용 토스페이먼츠 키 (개발용)
    this.clientKey = process.env.TOSS_CLIENT_KEY || 'test_ck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
    this.secretKey = process.env.TOSS_SECRET_KEY || 'test_sk_docs_e92LAa5PVb3ZdNYfJuK4G57mAYX4';
    
    console.log('Toss Payments initialized with test keys');
  }

  // 결제 승인 요청
  async confirmPayment(request: TossPaymentRequest): Promise<TossPaymentResponse> {
    const auth = Buffer.from(`${this.secretKey}:`).toString('base64');
    
    const response = await fetch(`${this.baseUrl}/payments/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json() as any;
      throw new Error(`Payment confirmation failed: ${error.message}`);
    }

    return await response.json() as TossPaymentResponse;
  }

  // 결제 조회
  async getPayment(paymentKey: string): Promise<TossPaymentResponse> {
    const auth = Buffer.from(`${this.secretKey}:`).toString('base64');
    
    const response = await fetch(`${this.baseUrl}/payments/${paymentKey}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json() as any;
      throw new Error(`Payment lookup failed: ${error.message}`);
    }

    return await response.json() as TossPaymentResponse;
  }

  // 결제 취소
  async cancelPayment(paymentKey: string, cancelReason: string, cancelAmount?: number): Promise<TossPaymentResponse> {
    const auth = Buffer.from(`${this.secretKey}:`).toString('base64');
    
    const body: any = { cancelReason };
    if (cancelAmount) {
      body.cancelAmount = cancelAmount;
    }
    
    const response = await fetch(`${this.baseUrl}/payments/${paymentKey}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json() as any;
      throw new Error(`Payment cancellation failed: ${error.message}`);
    }

    return await response.json() as TossPaymentResponse;
  }

  // 웹훅 처리
  async handleWebhook(paymentData: any): Promise<void> {
    try {
      console.log('Processing Toss payment webhook:', paymentData);
      
      const order = await storage.getOrderByOrderNo(paymentData.orderId);
      if (!order) {
        console.error('Order not found for webhook:', paymentData.orderId);
        return;
      }

      // 결제 성공 처리
      if (paymentData.status === 'DONE') {
        await storage.updateOrderPaymentStatus(order.id, 'success', paymentData.paymentKey);
        
        // SMS 발송 (주문 확인)
        const message = `[TAPMOVE] ${order.customerName}님의 주문이 결제완료되었습니다.\n주문번호: ${order.orderNo}\n결제금액: ${order.totalAmount.toLocaleString()}원\n배송지: ${order.shippingAddress}`;
        await sendSMS({
          phoneNumber: order.customerPhone,
          message,
          eventType: 'order_confirmation',
          relatedId: order.id
        });

        console.log(`Payment confirmed for order ${order.orderNo}`);
      }
      // 결제 실패 처리
      else if (paymentData.status === 'CANCELED' || paymentData.status === 'ABORTED' || paymentData.status === 'EXPIRED') {
        await storage.updateOrderPaymentStatus(order.id, 'failed');
        console.log(`Payment failed for order ${order.orderNo}: ${paymentData.status}`);
      }

    } catch (error) {
      console.error('Error processing Toss payment webhook:', error);
      throw error;
    }
  }
}

export const tossPayments = new TossPaymentsService();