import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { insertApplicationSchema, insertReviewSchema, insertOrderSchema } from "@shared/schema";
import { filterProfanity } from "../client/src/lib/profanity-filter";
import { tossPayments } from "./toss-payments";
import { sendEmail, getApplicationNotificationEmail, getApplicationApprovalEmail } from "./sendgrid.js";

// Extend express-session types
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
      username: string | null;
    };
    reviewAccess?: boolean;
    bulkAccess?: boolean;
  }
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // 개발환경에서는 더 관대하게
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 100 : 5, // 개발환경에서는 더 관대하게
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(limiter);

  // Session configuration - Enhanced for better persistence
  app.use(session({
    secret: process.env.SESSION_SECRET || 'tapmove-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset expiration on each request
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for better persistence
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Better CSRF protection
    }
  }));

  // Authentication middleware - Enhanced error messages
  function requireAuth(req: any, res: any, next: any) {
    if (!req.session?.user) {
      return res.status(401).json({ 
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
        error: 'SESSION_EXPIRED'
      });
    }
    next();
  }

  function requireAdmin(req: any, res: any, next: any) {
    if (!req.session?.user) {
      return res.status(401).json({ 
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
        error: 'SESSION_EXPIRED'
      });
    }
    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ 
        message: '관리자 권한이 필요합니다.',
        error: 'ADMIN_REQUIRED'
      });
    }
    next();
  }

  // Auth routes - Enhanced with session cleanup
  app.post('/api/auth/login', strictLimiter, async (req, res) => {
    try {
      console.log('Login attempt:', { username: req.body.username, sessionID: req.sessionID });
      
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
      }

      const user = await storage.verifyUserByUsername(username, password);
      if (!user) {
        console.log('Login failed: Invalid credentials for username:', username);
        
        // 더 구체적인 실패 원인 분석
        const userExists = await storage.getUserByUsername(username);
        if (!userExists) {
          console.log('Login failure reason: User not found');
          return res.status(401).json({ 
            message: '존재하지 않는 사용자입니다.',
            error: 'USER_NOT_FOUND'
          });
        } else {
          console.log('Login failure reason: Invalid password');
          return res.status(401).json({ 
            message: '비밀번호가 올바르지 않습니다. 최근에 비밀번호를 변경했다면 새 비밀번호를 사용해주세요.',
            error: 'INVALID_PASSWORD'
          });
        }
      }

      console.log('User verified successfully:', { userId: user.id, username: user.username });

      // 세션에 사용자 정보 저장 (간단한 방식으로 변경)
      req.session.user = {
        id: user.id,
        email: user.email || '',
        name: user.name,
        role: user.role,
        username: user.username
      };

      console.log('Login successful:', { 
        userId: user.id, 
        sessionID: req.sessionID,
        username: user.username 
      });

      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          username: user.username,
          email: user.email, 
          name: user.name, 
          role: user.role 
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  });

  app.post('/api/auth/change-password', requireAuth, strictLimiter, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      console.log('Password change attempt:', { 
        userId: req.session.user!.id, 
        username: req.session.user!.username,
        sessionID: req.sessionID 
      });
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: '현재 비밀번호와 새 비밀번호를 입력해주세요.' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: '새 비밀번호는 8자 이상이어야 합니다.' });
      }

      const userId = req.session.user!.id;
      const username = req.session.user!.username;

      // 현재 비밀번호 확인
      if (!username) {
        return res.status(400).json({ message: '사용자 정보가 올바르지 않습니다.' });
      }
      const user = await storage.verifyUserByUsername(username, currentPassword);
      if (!user) {
        console.log('Current password verification failed for user:', username);
        return res.status(401).json({ message: '현재 비밀번호가 올바르지 않습니다.' });
      }

      // 비밀번호 변경
      await storage.updateUserPassword(userId, newPassword);
      console.log('Password updated successfully for user:', username);

      // 🔥 CRITICAL: 비밀번호 변경 후 즉시 세션 무효화
      // 보안상 모든 세션을 무효화하고 재로그인을 요구해야 함
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error after password change:', err);
          return res.status(500).json({ message: '비밀번호는 변경되었으나 세션 처리 중 오류가 발생했습니다. 다시 로그인해주세요.' });
        }
        
        console.log('Session destroyed after password change, forcing re-login');
        res.clearCookie('connect.sid');
        res.json({ 
          success: true, 
          message: '비밀번호가 성공적으로 변경되었습니다. 보안을 위해 다시 로그인해주세요.',
          requireReLogin: true // 클라이언트에 재로그인 필요함을 알림
        });
      });
    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    console.log('Logout request:', { sessionID: req.sessionID, user: req.session?.user?.username });
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout session destroy error:', err);
        return res.status(500).json({ message: '로그아웃 처리 중 오류가 발생했습니다.' });
      }
      console.log('Logout successful');
      res.clearCookie('connect.sid'); // 세션 쿠키 명시적 삭제
      res.json({ success: true });
    });
  });

  app.get('/api/auth/me', (req, res) => {
    console.log('Auth check:', { 
      sessionID: req.sessionID, 
      hasSession: !!req.session, 
      hasUser: !!req.session?.user,
      username: req.session?.user?.username 
    });
    
    if (req.session?.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ 
        message: '로그인되지 않음',
        error: 'NOT_AUTHENTICATED' 
      });
    }
  });

  // Application routes
  app.post('/api/applications', strictLimiter, async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      
      // 관리자에게 이메일 알림 발송
      try {
        const emailContent = getApplicationNotificationEmail(validatedData);
        
        const emailSent = await sendEmail({
          to: 'oosotoo@naver.com',
          from: 'oosotoo@naver.com', // 검증된 이메일 주소 사용
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });
        
        if (emailSent) {
          console.log('✅ Admin notification email sent successfully to oosotoo@naver.com');
        } else {
          console.error('❌ Failed to send admin notification email');
        }
      } catch (emailError) {
        console.error('Failed to send admin notification email:', emailError);
        // 이메일 실패해도 신청은 정상 처리
      }
      
      res.json({ 
        success: true, 
        message: '세미나 신청이 접수되었습니다.', 
        application 
      });
    } catch (error: any) {
      console.error('Application creation error:', error);
      if (error.issues) {
        return res.status(400).json({ 
          message: '입력 정보를 확인해주세요.', 
          errors: error.issues 
        });
      }
      res.status(500).json({ message: '신청 처리 중 오류가 발생했습니다.' });
    }
  });

  // 신청현황 조회 API (이름과 전화번호로 조회)
  app.post('/api/applications/status', strictLimiter, async (req, res) => {
    try {
      const { name, phone } = req.body;
      
      if (!name || !phone) {
        return res.status(400).json({ message: '이름과 전화번호를 모두 입력해주세요.' });
      }

      const application = await storage.getApplicationByNameAndPhone(name, phone);
      
      if (!application) {
        return res.status(404).json({ message: '신청 정보를 찾을 수 없습니다.' });
      }

      res.json({ 
        status: application.status,
        name: application.name,
        id: application.id
      });
    } catch (error) {
      console.error('Get application status error:', error);
      res.status(500).json({ message: '신청 현황을 조회할 수 없습니다.' });
    }
  });

  // 신청자 이름 수정 API
  app.patch('/api/applications/:id/name', strictLimiter, async (req, res) => {
    try {
      const { id } = req.params;
      const { newName, phone } = req.body;
      
      if (!newName || !phone) {
        return res.status(400).json({ message: '새 이름과 전화번호를 모두 입력해주세요.' });
      }

      // 신청자 확인 (ID와 전화번호로 본인 확인)
      const application = await storage.getApplicationById(id);
      if (!application) {
        return res.status(404).json({ message: '신청 정보를 찾을 수 없습니다.' });
      }

      // 전화번호 일치 확인
      const normalizePhone = (phone: string) => phone.replace(/[^0-9]/g, '');
      if (normalizePhone(application.phone) !== normalizePhone(phone)) {
        return res.status(403).json({ message: '전화번호가 일치하지 않습니다.' });
      }

      await storage.updateApplicationName(id, newName);
      
      res.json({ 
        success: true, 
        message: '이름이 성공적으로 수정되었습니다.',
        newName 
      });
    } catch (error) {
      console.error('Update application name error:', error);
      res.status(500).json({ message: '이름 수정 중 오류가 발생했습니다.' });
    }
  });

  app.get('/api/applications', requireAdmin, async (req, res) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      console.error('Get applications error:', error);
      res.status(500).json({ message: '신청 목록을 불러올 수 없습니다.' });
    }
  });

  app.patch('/api/applications/:id/status', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['waiting', 'confirmed', 'rejected'].includes(status)) {
        return res.status(400).json({ message: '잘못된 상태값입니다.' });
      }

      // 신청자 정보 조회 (승인 이메일 발송용)
      const application = await storage.getApplicationById(id);
      if (!application) {
        return res.status(404).json({ message: '신청을 찾을 수 없습니다.' });
      }

      await storage.updateApplicationStatus(id, status);
      
      // 관리자가 승인해도 신청자에게는 별도 이메일 발송하지 않음
      
      res.json({ success: true, message: '신청 상태가 업데이트되었습니다.' });
    } catch (error) {
      console.error('Update application status error:', error);
      res.status(500).json({ message: '상태 업데이트 중 오류가 발생했습니다.' });
    }
  });

  // Review routes
  app.post('/api/reviews/verify-passcode', strictLimiter, async (req, res) => {
    try {
      const { passcode } = req.body;
      
      if (!passcode || passcode.length !== 4) {
        return res.status(400).json({ message: '4자리 비밀번호를 입력해주세요.' });
      }

      const isValid = await storage.verifyPasscode('review', passcode);
      if (!isValid) {
        return res.status(401).json({ message: '올바른 비밀번호를 입력해주세요.' });
      }

      req.session.reviewAccess = true;
      res.json({ success: true, message: '인증되었습니다.' });
    } catch (error) {
      console.error('Passcode verification error:', error);
      res.status(500).json({ message: '인증 처리 중 오류가 발생했습니다.' });
    }
  });

  app.post('/api/reviews', strictLimiter, async (req, res) => {
    try {
      if (!req.session?.reviewAccess) {
        return res.status(403).json({ message: '후기 작성 권한이 없습니다.' });
      }

      const validatedData = insertReviewSchema.parse(req.body);
      
      // Apply profanity filter
      const filteredBody = filterProfanity(validatedData.reviewBody);
      const hasFilteredContent = filteredBody !== validatedData.reviewBody;
      
      const reviewData = {
        ...validatedData,
        reviewBody: filteredBody,
      };

      const review = await storage.createReview(reviewData);
      
      // If content was filtered, mark as hidden
      if (hasFilteredContent) {
        await storage.updateReviewStatus(review.id, 'hidden_by_filter');
      }

      // Clear review access after use
      delete req.session.reviewAccess;
      
      res.json({ 
        success: true, 
        message: '후기가 등록되었습니다. 검토 후 게시됩니다.', 
        review 
      });
    } catch (error: any) {
      console.error('Review creation error:', error);
      if (error.issues) {
        return res.status(400).json({ 
          message: '후기 내용을 확인해주세요.', 
          errors: error.issues 
        });
      }
      res.status(500).json({ message: '후기 등록 중 오류가 발생했습니다.' });
    }
  });

  app.get('/api/reviews', async (req, res) => {
    try {
      const reviews = await storage.getApprovedReviews();
      res.json(reviews);
    } catch (error) {
      console.error('Get reviews error:', error);
      res.status(500).json({ message: '후기를 불러올 수 없습니다.' });
    }
  });

  app.get('/api/reviews/all', requireAdmin, async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      console.error('Get all reviews error:', error);
      res.status(500).json({ message: '후기 목록을 불러올 수 없습니다.' });
    }
  });

  app.patch('/api/reviews/:id/status', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['pending', 'approved', 'hidden_by_filter'].includes(status)) {
        return res.status(400).json({ message: '잘못된 상태값입니다.' });
      }

      await storage.updateReviewStatus(id, status);
      res.json({ success: true, message: '후기 상태가 업데이트되었습니다.' });
    } catch (error) {
      console.error('Update review status error:', error);
      res.status(500).json({ message: '상태 업데이트 중 오류가 발생했습니다.' });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ message: '제품 정보를 불러올 수 없습니다.' });
    }
  });

  // Order routes
  app.post('/api/orders/verify-bulk-passcode', strictLimiter, async (req, res) => {
    try {
      const { passcode } = req.body;
      
      if (!passcode || passcode.length !== 4) {
        return res.status(400).json({ message: '4자리 비밀번호를 입력해주세요.' });
      }

      const isValid = await storage.verifyPasscode('bulk', passcode);
      if (!isValid) {
        return res.status(401).json({ message: '올바른 비밀번호를 입력해주세요.' });
      }

      req.session.bulkAccess = true;
      res.json({ success: true, message: '인증되었습니다.' });
    } catch (error) {
      console.error('Bulk passcode verification error:', error);
      res.status(500).json({ message: '인증 처리 중 오류가 발생했습니다.' });
    }
  });

  app.post('/api/orders', strictLimiter, async (req, res) => {
    try {
      const orderData = req.body;
      
      // Check if bulk order requires authentication
      if (orderData.orderType === 'bulk' && !req.session?.bulkAccess) {
        return res.status(403).json({ message: '대량구매 권한이 없습니다.' });
      }

      const validatedData = insertOrderSchema.parse(orderData);
      const order = await storage.createOrder(validatedData);
      
      // Clear bulk access after use
      if (orderData.orderType === 'bulk') {
        delete req.session.bulkAccess;
      }
      
      res.json({ 
        success: true, 
        message: '주문이 접수되었습니다.', 
        order 
      });
    } catch (error: any) {
      console.error('Order creation error:', error);
      if (error.issues) {
        return res.status(400).json({ 
          message: '주문 정보를 확인해주세요.', 
          errors: error.issues 
        });
      }
      res.status(500).json({ message: '주문 처리 중 오류가 발생했습니다.' });
    }
  });

  // Verify seminar attendee endpoint
  app.post('/api/verify-seminar-attendee', strictLimiter, async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
      }

      // Check if user has an approved seminar application with this email
      const application = await storage.getApplicationByEmail(email);
      if (!application || application.status !== 'confirmed') {
        return res.status(401).json({ success: false, message: '세미나 참석자가 아닙니다.' });
      }

      // Verify user password (check if user with this email exists and password matches)
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
      }

      const bcrypt = require('bcryptjs');
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return res.status(401).json({ success: false, message: '비밀번호가 올바르지 않습니다.' });
      }

      res.json({ success: true, message: '세미나 참석자 인증이 완료되었습니다.' });
    } catch (error) {
      console.error('Seminar attendee verification error:', error);
      res.status(500).json({ success: false, message: '인증 처리 중 오류가 발생했습니다.' });
    }
  });

  app.get('/api/orders', requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ message: '주문 목록을 불러올 수 없습니다.' });
    }
  });

  // Toss Payments routes
  app.post('/api/payments/confirm', async (req, res) => {
    try {
      const { paymentKey, orderId, amount } = req.body;
      
      if (!paymentKey || !orderId || !amount) {
        return res.status(400).json({ message: '필수 결제 정보가 누락되었습니다.' });
      }

      // 주문 확인
      const order = await storage.getOrderByOrderNo(orderId);
      if (!order) {
        return res.status(404).json({ message: '주문을 찾을 수 없습니다.' });
      }

      // 금액 검증
      if (order.totalAmount !== amount) {
        return res.status(400).json({ message: '결제 금액이 일치하지 않습니다.' });
      }

      // Toss 결제 승인 요청
      const paymentResult = await tossPayments.confirmPayment({
        paymentKey,
        orderId,
        amount
      });

      // 결제 성공 시 주문 상태 업데이트
      if (paymentResult.status === 'DONE') {
        await storage.updateOrderPaymentStatus(order.id, 'success', paymentKey);
      }

      res.json({ 
        success: true, 
        payment: paymentResult,
        message: '결제가 완료되었습니다.' 
      });
    } catch (error) {
      console.error('Payment confirmation error:', error);
      res.status(400).json({ 
        message: '결제 승인 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // 결제 웹훅 처리
  app.post('/api/payments/webhook', async (req, res) => {
    try {
      await tossPayments.handleWebhook(req.body);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Payment webhook error:', error);
      res.status(500).json({ message: '웹훅 처리 중 오류가 발생했습니다.' });
    }
  });

  // 결제 조회
  app.get('/api/payments/:paymentKey', async (req, res) => {
    try {
      const { paymentKey } = req.params;
      const payment = await tossPayments.getPayment(paymentKey);
      res.json(payment);
    } catch (error) {
      console.error('Payment lookup error:', error);
      res.status(404).json({ message: '결제 정보를 찾을 수 없습니다.' });
    }
  });

  app.patch('/api/orders/:id/payment', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, tossPaymentKey } = req.body;
      
      if (!['waiting', 'success', 'failed'].includes(status)) {
        return res.status(400).json({ message: '잘못된 결제 상태값입니다.' });
      }

      await storage.updateOrderPaymentStatus(id, status, tossPaymentKey);
      res.json({ success: true, message: '결제 상태가 업데이트되었습니다.' });
    } catch (error) {
      console.error('Update payment status error:', error);
      res.status(500).json({ message: '결제 상태 업데이트 중 오류가 발생했습니다.' });
    }
  });

  // Settings routes
  app.get('/api/settings', requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getSettings();
      if (!settings) {
        return res.status(404).json({ message: '설정을 찾을 수 없습니다.' });
      }
      
      // Don't send passcodes to client
      const { reviewPasscode, bulkPurchasePasscode, memberDiscountCode, ...safeSettings } = settings;
      res.json(safeSettings);
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({ message: '설정을 불러올 수 없습니다.' });
    }
  });

  app.patch('/api/settings', requireAdmin, async (req, res) => {
    try {
      await storage.updateSettings(req.body);
      res.json({ success: true, message: '설정이 업데이트되었습니다.' });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ message: '설정 업데이트 중 오류가 발생했습니다.' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
