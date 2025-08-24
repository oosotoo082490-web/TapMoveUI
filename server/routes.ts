import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { insertApplicationSchema, insertReviewSchema, insertOrderSchema } from "@shared/schema";
import { filterProfanity } from "../client/src/lib/profanity-filter";

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for sensitive endpoints
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(limiter);

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'tapmove-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Authentication middleware
  function requireAuth(req: any, res: any, next: any) {
    if (!req.session?.user) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    next();
  }

  function requireAdmin(req: any, res: any, next: any) {
    if (!req.session?.user || req.session.user.role !== 'admin') {
      return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
    }
    next();
  }

  // Auth routes
  app.post('/api/auth/login', strictLimiter, async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
      }

      const user = await storage.verifyUser(email, password);
      if (!user) {
        return res.status(401).json({ message: '잘못된 이메일 또는 비밀번호입니다.' });
      }

      req.session.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };

      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
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

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get('/api/auth/me', (req, res) => {
    if (req.session?.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ message: '로그인되지 않음' });
    }
  });

  // Application routes
  app.post('/api/applications', strictLimiter, async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      
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
      
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: '잘못된 상태값입니다.' });
      }

      await storage.updateApplicationStatus(id, status);
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
      const reviews = await storage.getAllReviews();
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
      if (!application || application.status !== 'approved') {
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

  app.patch('/api/orders/:id/payment', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, tossPaymentKey } = req.body;
      
      if (!['pending', 'paid', 'failed'].includes(status)) {
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
      const { reviewPasscode, bulkPurchasePasscode, ...safeSettings } = settings;
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
