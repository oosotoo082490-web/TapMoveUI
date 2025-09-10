import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  username: text("username").unique(),
  email: text("email").unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["admin", "user"] }).default("user").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// Seminar applications table
export const applications = sqliteTable("applications", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  birthdate: text("birthdate").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  depositorName: text("depositor_name").notNull(),
  uniformSize: text("uniform_size", { enum: ["S", "M", "L", "XL", "XXL"] }),
  classPlan: text("class_plan", { enum: ["plan", "no"] }),
  classTypeInfant: integer("class_type_infant", { mode: "boolean" }).default(false),
  classTypeElementary: integer("class_type_elementary", { mode: "boolean" }).default(false),
  classTypeMiddleHigh: integer("class_type_middle_high", { mode: "boolean" }).default(false),
  classTypeAdult: integer("class_type_adult", { mode: "boolean" }).default(false),
  classTypeSenior: integer("class_type_senior", { mode: "boolean" }).default(false),
  classTypeRehab: integer("class_type_rehab", { mode: "boolean" }).default(false),
  privacyAgreement: integer("privacy_agreement", { mode: "boolean" }).notNull().default(true),
  status: text("status", { enum: ["waiting", "payment_confirmed", "confirmed", "rejected"] }).default("waiting").notNull(),
  // paymentStatus: text("payment_status", { enum: ["unpaid", "paid", "failed"] }).default("unpaid").notNull(),
  adminMemo: text("admin_memo"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// Reviews table
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  reviewBody: text("review_body").notNull(),
  authorName: text("author_name").notNull().default("익명"),
  rating: integer("rating").notNull().default(5),
  status: text("status", { enum: ["pending", "approved", "hidden_by_filter"] }).default("pending").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// Products table
export const products = sqliteTable("products", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  imageUrl: text("image_url"),
  inStock: integer("in_stock", { mode: "boolean" }).default(true).notNull(),
});

// Orders table
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  orderNo: text("order_no").notNull().unique(),
  productId: text("product_id").notNull().references(() => products.id),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  shippingFee: real("shipping_fee").notNull().default(0),
  totalAmount: real("total_amount").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  customerType: text("customer_type", { enum: ["guest", "member"] }).default("guest").notNull(),
  orderType: text("order_type", { enum: ["regular", "member", "bulk"] }).default("regular").notNull(),
  paymentStatus: text("payment_status", { enum: ["waiting", "success", "failed"] }).default("waiting").notNull(),
  shippingStatus: text("shipping_status", { enum: ["preparing", "shipped"] }).default("preparing").notNull(),
  trackingNo: text("tracking_no"),
  tossPaymentKey: text("toss_payment_key"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// Settings table for passcodes and configurations
export const settings = sqliteTable("settings", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  reviewPasscode: text("review_passcode").notNull(),
  bulkPurchasePasscode: text("bulk_purchase_passcode").notNull(),
  memberDiscountCode: text("member_discount_code").notNull(),
  seminarDate: text("seminar_date").notNull().default("2025-11-08(토) 14:00~18:00"),
  seminarLocation: text("seminar_location").notNull().default("대구시 북구 침산남로 172, 3층 운동하는코끼리"),
  seminarContact: text("seminar_contact").notNull().default("0507-1403-3006"),
  seminarCapacity: integer("seminar_capacity").notNull().default(20),
  seminarDeadline: text("seminar_deadline").notNull().default("2025-10-31"),
  seminarPrice: real("seminar_price").notNull().default(300000),
  productRegularPrice: real("product_regular_price").notNull().default(19500),
  productMemberPrice: real("product_member_price").notNull().default(17500),
  shippingFeePerUnit: real("shipping_fee_per_unit").notNull().default(320),
  smsEnabled: integer("sms_enabled", { mode: "boolean" }).notNull().default(true),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// SMS logs table
export const smsLogs = sqliteTable("sms_logs", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  phoneNumber: text("phone_number").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ["success", "failed"] }).notNull(),
  provider: text("provider").notNull().default("coolsms"),
  errorMessage: text("error_message"),
  eventType: text("event_type").notNull(),
  relatedId: text("related_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// Audit logs table
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  oldValues: text("old_values"),
  newValues: text("new_values"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  status: true,
  // paymentStatus: true,
  adminMemo: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  status: true,
  createdAt: true,
}).extend({
  reviewBody: z.string().min(10).max(2000),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNo: true,
  paymentStatus: true,
  shippingStatus: true,
  tossPaymentKey: true,
  trackingNo: true,
  createdAt: true,
});

export const insertSmsLogSchema = createInsertSchema(smsLogs).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type SmsLog = typeof smsLogs.$inferSelect;
export type InsertSmsLog = z.infer<typeof insertSmsLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
