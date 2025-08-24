import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { eq, desc, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import {
  users, applications, reviews, products, orders, settings,
  type User, type InsertUser, type Application, type InsertApplication,
  type Review, type InsertReview, type Product, type InsertProduct,
  type Order, type InsertOrder, type Settings, type InsertSettings
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
      status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
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
      product_id TEXT NOT NULL REFERENCES products(id),
      quantity INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      order_type TEXT DEFAULT 'regular' NOT NULL CHECK (order_type IN ('regular', 'bulk')),
      payment_status TEXT DEFAULT 'pending' NOT NULL CHECK (payment_status IN ('pending', 'paid', 'failed')),
      toss_payment_key TEXT,
      created_at INTEGER DEFAULT (unixepoch()) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      review_passcode TEXT NOT NULL,
      bulk_purchase_passcode TEXT NOT NULL,
      seminar_date TEXT NOT NULL,
      seminar_price REAL DEFAULT 300000 NOT NULL,
      product_price REAL DEFAULT 19500 NOT NULL,
      updated_at INTEGER DEFAULT (unixepoch()) NOT NULL
    );
  `);

  // Insert default admin user and settings if they don't exist
  const existingAdmin = sqlite.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync("admin123", 10);
    sqlite.prepare(`
      INSERT INTO users (email, password, name, role) 
      VALUES ('admin@tapmove.kr', ?, 'TAPMOVE 관리자', 'admin')
    `).run(hashedPassword);
  }

  const existingSettings = sqlite.prepare("SELECT id FROM settings LIMIT 1").get();
  if (!existingSettings) {
    const reviewPasscode = bcrypt.hashSync("1234", 10);
    const bulkPasscode = bcrypt.hashSync("5678", 10);
    sqlite.prepare(`
      INSERT INTO settings (review_passcode, bulk_purchase_passcode, seminar_date) 
      VALUES (?, ?, '2025-11-08')
    `).run(reviewPasscode, bulkPasscode);
  }

  // Insert default product if it doesn't exist
  const existingProduct = sqlite.prepare("SELECT id FROM products LIMIT 1").get();
  if (!existingProduct) {
    sqlite.prepare(`
      INSERT INTO products (name, description, price, image_url) 
      VALUES ('TAPMOVE 공식 매트', '정식 로고가 새겨진 6mm 매트로 최적의 운동 경험을 제공합니다.', 19500, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b')
    `).run();
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
  updateApplicationStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<void>;

  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getApprovedReviews(): Promise<Review[]>;
  getAllReviews(): Promise<Review[]>;
  updateReviewStatus(id: string, status: 'pending' | 'approved' | 'hidden_by_filter'): Promise<void>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;
  updateOrderPaymentStatus(id: string, status: 'pending' | 'paid' | 'failed', tossPaymentKey?: string): Promise<void>;

  // Settings
  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: Partial<InsertSettings>): Promise<void>;
  verifyPasscode(type: 'review' | 'bulk', passcode: string): Promise<boolean>;
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
    const application: Application = {
      id,
      ...insertApplication,
      status: "pending",
      createdAt: new Date(),
    };

    db.insert(applications).values(application).run();
    return application;
  }

  async getApplications(): Promise<Application[]> {
    return db.select().from(applications).orderBy(desc(applications.createdAt)).all();
  }

  async updateApplicationStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> {
    db.update(applications).set({ status }).where(eq(applications.id, id)).run();
  }

  async getApplicationByEmail(email: string): Promise<Application | undefined> {
    const result = db.select().from(applications).where(eq(applications.email, email)).get();
    return result || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = db.select().from(users).where(eq(users.email, email)).get();
    return result || undefined;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      id,
      ...insertReview,
      status: "pending",
      createdAt: new Date(),
    };

    db.insert(reviews).values(review).run();
    return review;
  }

  async getApprovedReviews(): Promise<Review[]> {
    return db.select().from(reviews)
      .where(eq(reviews.status, "approved"))
      .orderBy(desc(reviews.createdAt))
      .all();
  }

  async getAllReviews(): Promise<Review[]> {
    return db.select().from(reviews).orderBy(desc(reviews.createdAt)).all();
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
    const order: Order = {
      id,
      ...insertOrder,
      paymentStatus: "pending",
      tossPaymentKey: null,
      createdAt: new Date(),
    };

    db.insert(orders).values(order).run();
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt)).all();
  }

  async updateOrderPaymentStatus(id: string, status: 'pending' | 'paid' | 'failed', tossPaymentKey?: string): Promise<void> {
    const updateData: any = { paymentStatus: status };
    if (tossPaymentKey) {
      updateData.tossPaymentKey = tossPaymentKey;
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

  async verifyPasscode(type: 'review' | 'bulk', passcode: string): Promise<boolean> {
    const settingsData = await this.getSettings();
    if (!settingsData) return false;

    const hashedPasscode = type === 'review' 
      ? settingsData.reviewPasscode 
      : settingsData.bulkPurchasePasscode;
    
    return bcrypt.compareSync(passcode, hashedPasscode);
  }
}

export const storage = new SqliteStorage();
