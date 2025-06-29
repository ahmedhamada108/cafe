import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  decimal,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for authentication)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoles = ["administrator", "moderator"] as const;

// Users table (required for authentication)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username", { length: 50 }).unique(),
  email: varchar("email").unique(),
  password: varchar("password", { length: 255 }), // Hashed password for local auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: userRoles }).default("moderator"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }).notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  image: text("image"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }).notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  image: text("image"),
  stock: integer("stock").default(0),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  isAvailable: boolean("is_available").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// About Us content table
export const aboutUs = pgTable("about_us", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleAr: varchar("title_ar", { length: 255 }).notNull(),
  contentEn: text("content_en").notNull(),
  contentAr: text("content_ar").notNull(),
  features: jsonb("features").default([]), // Array of feature cards with icon, titleEn, titleAr, descEn, descAr
  missionEn: text("mission_en"), // Our Mission section
  missionAr: text("mission_ar"),
  image: text("image"),
  mapUrl: text("map_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact Us information table
export const contactUs = pgTable("contact_us", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  phone: varchar("phone", { length: 50 }),
  whatsapp: varchar("whatsapp", { length: 50 }), // Separate WhatsApp number
  email: varchar("email", { length: 255 }),
  address: text("address"),
  addressAr: text("address_ar"),
  workingHours: varchar("working_hours", { length: 255 }),
  workingHoursAr: varchar("working_hours_ar", { length: 255 }),
  socialMediaLinks: jsonb("social_media_links"), // Store as JSON: {facebook, instagram, twitter, etc.}
  googleMapsUrl: text("google_maps_url"), // Google Maps link for location
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SMTP Settings table
export const smtpSettings = pgTable("smtp_settings", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  host: varchar("host", { length: 255 }).notNull(),
  port: integer("port").notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  secure: boolean("secure").default(true), // Use SSL/TLS
  fromName: varchar("from_name", { length: 255 }).notNull(),
  fromEmail: varchar("from_email", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Footer content table
export const footerContent = pgTable("footer_content", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  companyNameEn: varchar("company_name_en", { length: 255 }).notNull(),
  companyNameAr: varchar("company_name_ar", { length: 255 }).notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  copyrightText: varchar("copyright_text", { length: 255 }),
  quickLinks: jsonb("quick_links"), // Store as JSON array of links
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Widget settings table (for Tawk.to and other widgets)
export const widgetSettings = pgTable("widget_settings", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleAr: varchar("title_ar", { length: 255 }).notNull(),
  settings: jsonb("settings").notNull(), // Store widget configuration as JSON
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Privacy Policy content table
export const privacyPolicy = pgTable("privacy_policy", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleAr: varchar("title_ar", { length: 255 }).notNull(),
  contentEn: text("content_en").notNull(),
  contentAr: text("content_ar").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Terms of Service content table
export const termsOfService = pgTable("terms_of_service", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleAr: varchar("title_ar", { length: 255 }).notNull(),
  contentEn: text("content_en").notNull(),
  contentAr: text("content_ar").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAboutUsSchema = createInsertSchema(aboutUs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactUsSchema = createInsertSchema(contactUs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFooterContentSchema = createInsertSchema(footerContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWidgetSettingsSchema = createInsertSchema(widgetSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPrivacyPolicySchema = createInsertSchema(privacyPolicy).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTermsOfServiceSchema = createInsertSchema(termsOfService).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSmtpSettingsSchema = createInsertSchema(smtpSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createUserSchema = insertUserSchema.extend({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string().email(),
});

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type AboutUs = typeof aboutUs.$inferSelect;
export type ContactUs = typeof contactUs.$inferSelect;
export type FooterContent = typeof footerContent.$inferSelect;
export type WidgetSettings = typeof widgetSettings.$inferSelect;
export type PrivacyPolicy = typeof privacyPolicy.$inferSelect;
export type TermsOfService = typeof termsOfService.$inferSelect;
export type SmtpSettings = typeof smtpSettings.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertAboutUs = z.infer<typeof insertAboutUsSchema>;
export type InsertContactUs = z.infer<typeof insertContactUsSchema>;
export type InsertFooterContent = z.infer<typeof insertFooterContentSchema>;
export type InsertWidgetSettings = z.infer<typeof insertWidgetSettingsSchema>;
export type InsertPrivacyPolicy = z.infer<typeof insertPrivacyPolicySchema>;
export type InsertTermsOfService = z.infer<typeof insertTermsOfServiceSchema>;
export type InsertSmtpSettings = z.infer<typeof insertSmtpSettingsSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;