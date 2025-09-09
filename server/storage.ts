import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq, desc, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import {
  users, applications, reviews, products, orders, settings, smsLogs, auditLogs,
  type User, type InsertUser, type Application, type InsertApplication,
  type Review, type InsertReview, type Product, type InsertProduct,
  type Order, type InsertOrder, type Settings, type InsertSettings,
  type SmsLog, type InsertSmsLog, type AuditLog, type InsertAuditLog
} from "@shared/schema";

const sqlite = new Database("tapmove.db");
export const db = drizzle(sqlite);

// Initialize database with default data
export function initializeDatabase() {
  // Create tables
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('admin', 'user')),
      created_at INTEGER DEFAULT (unixepoch()) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      name TEXT NOT NULL,
      birthdate TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      depositor_name TEXT NOT NULL,
      uniform_size TEXT CHECK (uniform_size IN ('S', 'M', 'L', 'XL', 'XXL')),
      class_plan TEXT CHECK (class_plan IN ('plan', 'no')),
      class_type_infant INTEGER DEFAULT 0,
      class_type_elementary INTEGER DEFAULT 0,
      class_type_middle_high INTEGER DEFAULT 0,
      class_type_adult INTEGER DEFAULT 0,
      class_type_senior INTEGER DEFAULT 0,
      class_type_rehab INTEGER DEFAULT 0,
      privacy_agreement INTEGER DEFAULT 1 NOT NULL,
      status TEXT DEFAULT 'waiting' NOT NULL CHECK (status IN ('waiting', 'confirmed', 'rejected')),
      payment_status TEXT DEFAULT 'unpaid' NOT NULL CHECK (payment_status IN ('unpaid', 'paid', 'failed')),
      admin_memo TEXT,
      created_at INTEGER DEFAULT (unixepoch()) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      review_body TEXT NOT NULL,
      author_name TEXT DEFAULT '익명' NOT NULL,
      rating INTEGER DEFAULT 5 NOT NULL,
      status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'hidden_by_filter')),
      created_at INTEGER DEFAULT (unixepoch()) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image_url TEXT,
      in_stock INTEGER DEFAULT 1 NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      order_no TEXT NOT NULL UNIQUE,
      product_id TEXT NOT NULL REFERENCES products(id),
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      shipping_fee REAL DEFAULT 0 NOT NULL,
      total_amount REAL NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      customer_type TEXT DEFAULT 'guest' NOT NULL CHECK (customer_type IN ('guest', 'member')),
      order_type TEXT DEFAULT 'regular' NOT NULL CHECK (order_type IN ('regular', 'member', 'bulk')),
      payment_status TEXT DEFAULT 'waiting' NOT NULL CHECK (payment_status IN ('waiting', 'success', 'failed')),
      shipping_status TEXT DEFAULT 'preparing' NOT NULL CHECK (shipping_status IN ('preparing', 'shipped')),
      tracking_no TEXT,
      toss_payment_key TEXT,
      created_at INTEGER DEFAULT (unixepoch()) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      review_passcode TEXT NOT NULL,
      bulk_purchase_passcode TEXT NOT NULL,
      member_discount_code TEXT NOT NULL,
      seminar_date TEXT DEFAULT '2025-11-08(토) 14:00~18:00' NOT NULL,
      seminar_location TEXT DEFAULT '대구시 북구 침산남로 172, 3층 운동하는코끼리' NOT NULL,
      seminar_contact TEXT DEFAULT '0507-1403-3006' NOT NULL,
      seminar_capacity INTEGER DEFAULT 20 NOT NULL,
      seminar_deadline TEXT DEFAULT '2025-10-31' NOT NULL,
      seminar_price REAL DEFAULT 300000 NOT NULL,
      product_regular_price REAL DEFAULT 19500 NOT NULL,
      product_member_price REAL DEFAULT 17500 NOT NULL,
      shipping_fee_per_unit REAL DEFAULT 320 NOT NULL,
      sms_enabled INTEGER DEFAULT 1 NOT NULL,
      updated_at INTEGER DEFAULT (unixepoch()) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS sms_logs (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      phone_number TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
      provider TEXT DEFAULT 'coolsms' NOT NULL,
      error_message TEXT,
      event_type TEXT NOT NULL,
      related_id TEXT,
      created_at INTEGER DEFAULT (unixepoch()) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      old_values TEXT,
      new_values TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at INTEGER DEFAULT (unixepoch()) NOT NULL
    );
  `);

  // Insert default admin user if not exists
  const adminExists = sqlite.prepare("SELECT * FROM users WHERE email = 'admin@tapmove.com'").get();
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123!', 10);
    sqlite.prepare(`
      INSERT INTO users (email, password, name, role)
      VALUES ('admin@tapmove.com', ?, 'TAPMOVE 관리자', 'admin')
    `).run(hashedPassword);
    console.log('Default admin user created: admin@tapmove.com / admin123!');
  }

  // Insert default settings if not exists
  const settingsExists = sqlite.prepare("SELECT * FROM settings LIMIT 1").get();
  if (!settingsExists) {
    const reviewPasscode = bcrypt.hashSync('1234', 10);
    const bulkPasscode = bcrypt.hashSync('5678', 10);
    const memberCode = bcrypt.hashSync('MEMBER2024', 10);
    
    sqlite.prepare(`
      INSERT INTO settings (review_passcode, bulk_purchase_passcode, member_discount_code)
      VALUES (?, ?, ?)
    `).run(reviewPasscode, bulkPasscode, memberCode);
    console.log('Default settings created with passcodes: 1234 (review), 5678 (bulk), MEMBER2024 (member)');
  }

  // Insert sample product if not exists
  const productExists = sqlite.prepare("SELECT * FROM products LIMIT 1").get();
  if (!productExists) {
    sqlite.prepare(`
      INSERT INTO products (name, description, price, in_stock)
      VALUES ('TAPMOVE 매트', 'TAPMOVE 공식 매트입니다. 고품질 재료로 제작되었으며 다양한 운동에 활용할 수 있습니다.', 19500, 1)
    `).run();
    console.log('Sample product created');
  }
}

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyUser(email: string, password: string): Promise<User | null>;

  // Applications
  createApplication(application: InsertApplication): Promise<Application>;
  getApplications(): Promise<Application[]>;
  getApplicationById(id: string): Promise<Application | undefined>;
  getApplicationByEmail(email: string): Promise<Application | undefined>;
  getApplicationByNameAndPhone(name: string, phone: string): Promise<Application | undefined>;
  updateApplicationStatus(id: string, status: 'waiting' | 'confirmed' | 'rejected'): Promise<void>;
  updateApplicationPaymentStatus(id: string, paymentStatus: 'unpaid' | 'paid' | 'failed'): Promise<void>;
  updateApplicationName(id: string, newName: string): Promise<void>;

  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getReviews(): Promise<Review[]>;
  getApprovedReviews(): Promise<Review[]>;
  updateReviewStatus(id: string, status: 'pending' | 'approved' | 'hidden_by_filter'): Promise<void>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrderByOrderNo(orderNo: string): Promise<Order | undefined>;
  updateOrderPaymentStatus(id: string, status: 'waiting' | 'success' | 'failed', tossPaymentKey?: string): Promise<void>;
  updateOrderShippingStatus(id: string, status: 'preparing' | 'shipped', trackingNo?: string): Promise<void>;

  // Settings
  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: Partial<InsertSettings>): Promise<void>;
  verifyPasscode(type: 'review' | 'bulk' | 'member', passcode: string): Promise<boolean>;

  // SMS Logs
  createSmsLog(smsLog: InsertSmsLog): Promise<SmsLog>;
  getSmsLogs(): Promise<SmsLog[]>;
  getFailedSmsCount(): Promise<number>;

  // Audit Logs
  createAuditLog(auditLog: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(): Promise<AuditLog[]>;
}

export class SqliteStorage implements IStorage {
  constructor() {
    initializeDatabase();
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = db.select().from(users).where(eq(users.id, id)).get();
    return result || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = db.select().from(users).where(eq(users.email, email)).get();
    return result || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = bcrypt.hashSync(insertUser.password, 10);
    const id = randomUUID();
    
    const user: User = {
      id,
      ...insertUser,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
    };

    db.insert(users).values(user).run();
    return user;
  }

  async verifyUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = bcrypt.compareSync(password, user.password);
    return isValid ? user : null;
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const application = {
      id,
      ...insertApplication,
      uniformSize: insertApplication.uniformSize || null,
      status: "waiting" as const,
      adminMemo: null,
      createdAt: new Date(),
    };

    db.insert(applications).values(application).run();
    return application as Application;
  }

  async getApplications(): Promise<Application[]> {
    return db.select().from(applications).orderBy(desc(applications.createdAt)).all();
  }

  async getApplicationById(id: string): Promise<Application | undefined> {
    const result = db.select().from(applications).where(eq(applications.id, id)).get();
    return result || undefined;
  }

  async getApplicationByEmail(email: string): Promise<Application | undefined> {
    const result = db.select().from(applications).where(eq(applications.email, email)).get();
    return result || undefined;
  }

  async getApplicationByNameAndPhone(name: string, phone: string): Promise<Application | undefined> {
    // 전화번호에서 숫자만 추출하여 비교
    const normalizePhone = (phone: string) => phone.replace(/[^0-9]/g, '');
    const searchPhone = normalizePhone(phone);
    
    // 모든 신청을 가져와서 이름과 정규화된 전화번호로 비교
    const allApplications = db.select().from(applications).all();
    const result = allApplications.find(app => 
      app.name === name && normalizePhone(app.phone) === searchPhone
    );
    
    return result || undefined;
  }

  async updateApplicationStatus(id: string, status: 'waiting' | 'confirmed' | 'rejected'): Promise<void> {
    db.update(applications).set({ status }).where(eq(applications.id, id)).run();
  }

  async updateApplicationName(id: string, newName: string): Promise<void> {
    db.update(applications).set({ name: newName }).where(eq(applications.id, id)).run();
  }

  // Commented out until paymentStatus column is available
  // async updateApplicationPaymentStatus(id: string, paymentStatus: 'unpaid' | 'paid' | 'failed'): Promise<void> {
  //   db.update(applications).set({ paymentStatus }).where(eq(applications.id, id)).run();
  // }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      id,
      ...insertReview,
      authorName: insertReview.authorName || '익명',
      rating: insertReview.rating || 5,
      status: 'pending',
      createdAt: new Date(),
    };

    db.insert(reviews).values(review).run();
    return review;
  }

  async getReviews(): Promise<Review[]> {
    return db.select().from(reviews).orderBy(desc(reviews.createdAt)).all();
  }

  async getApprovedReviews(): Promise<Review[]> {
    return db.select().from(reviews)
      .where(eq(reviews.status, 'approved'))
      .orderBy(desc(reviews.createdAt))
      .all();
  }

  async updateReviewStatus(id: string, status: 'pending' | 'approved' | 'hidden_by_filter'): Promise<void> {
    db.update(reviews).set({ status }).where(eq(reviews.id, id)).run();
  }

  async getProducts(): Promise<Product[]> {
    return db.select().from(products).all();
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = db.select().from(products).where(eq(products.id, id)).get();
    return result || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const orderNo = `TM${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const order: Order = {
      id,
      orderNo,
      ...insertOrder,
      customerType: insertOrder.customerType || "guest",
      shippingFee: insertOrder.shippingFee || 0,
      paymentStatus: "waiting",
      shippingStatus: "preparing",
      trackingNo: null,
      tossPaymentKey: null,
      createdAt: new Date(),
    };

    db.insert(orders).values(order).run();
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt)).all();
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const result = db.select().from(orders).where(eq(orders.id, id)).get();
    return result || undefined;
  }

  async getOrderByOrderNo(orderNo: string): Promise<Order | undefined> {
    const result = db.select().from(orders).where(eq(orders.orderNo, orderNo)).get();
    return result || undefined;
  }

  async updateOrderPaymentStatus(id: string, status: 'waiting' | 'success' | 'failed', tossPaymentKey?: string): Promise<void> {
    const updateData: any = { paymentStatus: status };
    if (tossPaymentKey) {
      updateData.tossPaymentKey = tossPaymentKey;
    }
    db.update(orders).set(updateData).where(eq(orders.id, id)).run();
  }

  async updateOrderShippingStatus(id: string, status: 'preparing' | 'shipped', trackingNo?: string): Promise<void> {
    const updateData: any = { shippingStatus: status };
    if (trackingNo) {
      updateData.trackingNo = trackingNo;
    }
    db.update(orders).set(updateData).where(eq(orders.id, id)).run();
  }

  async getSettings(): Promise<Settings | undefined> {
    const result = db.select().from(settings).get();
    return result || undefined;
  }

  async updateSettings(settingsUpdate: Partial<InsertSettings>): Promise<void> {
    const existing = await this.getSettings();
    if (existing) {
      db.update(settings).set({
        ...settingsUpdate,
        updatedAt: new Date(),
      }).where(eq(settings.id, existing.id)).run();
    }
  }

  async verifyPasscode(type: 'review' | 'bulk' | 'member', passcode: string): Promise<boolean> {
    const settingsData = await this.getSettings();
    if (!settingsData) return false;

    const hashedPasscode = type === 'review' 
      ? settingsData.reviewPasscode 
      : type === 'bulk'
      ? settingsData.bulkPurchasePasscode
      : settingsData.memberDiscountCode;
    
    return bcrypt.compareSync(passcode, hashedPasscode);
  }

  // SMS Log methods
  async createSmsLog(insertSmsLog: InsertSmsLog): Promise<SmsLog> {
    const id = randomUUID();
    const smsLog: SmsLog = {
      id,
      ...insertSmsLog,
      provider: insertSmsLog.provider || 'coolsms',
      errorMessage: insertSmsLog.errorMessage || null,
      relatedId: insertSmsLog.relatedId || null,
      createdAt: new Date()
    };
    db.insert(smsLogs).values(smsLog).run();
    return smsLog;
  }

  async getSmsLogs(): Promise<SmsLog[]> {
    return db.select().from(smsLogs).orderBy(desc(smsLogs.createdAt)).all();
  }

  async getFailedSmsCount(): Promise<number> {
    const result = db.select().from(smsLogs)
      .where(eq(smsLogs.status, 'failed')).all();
    return result.length;
  }

  // Audit Log methods
  async createAuditLog(insertAuditLog: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const auditLog: AuditLog = {
      id,
      ...insertAuditLog,
      userId: insertAuditLog.userId || null,
      oldValues: insertAuditLog.oldValues || null,
      newValues: insertAuditLog.newValues || null,
      ipAddress: insertAuditLog.ipAddress || null,
      userAgent: insertAuditLog.userAgent || null,
      createdAt: new Date()
    };
    db.insert(auditLogs).values(auditLog).run();
    return auditLog;
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).all();
  }
}

export const storage = new SqliteStorage();