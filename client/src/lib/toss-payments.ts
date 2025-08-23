declare global {
  interface Window {
    TossPayments: any;
  }
}

export interface PaymentData {
  amount: number;
  orderId: string;
  orderName: string;
  customerName: string;
  customerEmail: string;
  customerMobilePhone?: string;
  successUrl: string;
  failUrl: string;
}

export class TossPaymentsService {
  private tossPayments: any;
  private clientKey: string;

  constructor() {
    this.clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY || process.env.TOSS_CLIENT_KEY || "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
    
    if (typeof window !== "undefined" && window.TossPayments) {
      this.tossPayments = window.TossPayments(this.clientKey);
    }
  }

  async loadTossPayments() {
    if (this.tossPayments) return this.tossPayments;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js.tosspayments.com/v1/payment";
      script.onload = () => {
        if (window.TossPayments) {
          this.tossPayments = window.TossPayments(this.clientKey);
          resolve(this.tossPayments);
        } else {
          reject(new Error("토스페이먼츠를 로드할 수 없습니다."));
        }
      };
      script.onerror = () => reject(new Error("토스페이먼츠 스크립트 로드 실패"));
      document.head.appendChild(script);
    });
  }

  async requestPayment(paymentData: PaymentData) {
    try {
      if (!this.tossPayments) {
        await this.loadTossPayments();
      }

      const payment = this.tossPayments.payment({
        amount: paymentData.amount,
        currency: "KRW",
      });

      await payment.requestPayment({
        method: "CARD", // 카드 결제
        amount: {
          currency: "KRW",
          value: paymentData.amount,
        },
        orderId: paymentData.orderId,
        orderName: paymentData.orderName,
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
        customerMobilePhone: paymentData.customerMobilePhone,
        successUrl: paymentData.successUrl,
        failUrl: paymentData.failUrl,
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
      throw error;
    }
  }

  async requestVirtualAccountPayment(paymentData: PaymentData) {
    try {
      if (!this.tossPayments) {
        await this.loadTossPayments();
      }

      const payment = this.tossPayments.payment({
        amount: paymentData.amount,
        currency: "KRW",
      });

      await payment.requestPayment({
        method: "VIRTUAL_ACCOUNT", // 가상계좌 결제
        amount: {
          currency: "KRW",
          value: paymentData.amount,
        },
        orderId: paymentData.orderId,
        orderName: paymentData.orderName,
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
        customerMobilePhone: paymentData.customerMobilePhone,
        successUrl: paymentData.successUrl,
        failUrl: paymentData.failUrl,
        virtualAccount: {
          cashReceipt: {
            type: "소득공제",
          },
          validHours: 24, // 24시간 유효
        },
      });
    } catch (error) {
      console.error("가상계좌 결제 요청 실패:", error);
      throw error;
    }
  }

  generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `TAPMOVE_${timestamp}_${random}`;
  }
}

export const tossPayments = new TossPaymentsService();
