import { pgTable, text, serial, boolean, timestamp, integer, decimal, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").unique().notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status").default("draft").notNull(), // 'draft', 'published', 'archived'
  authorId: text("author_id"),
  featuredImage: text("featured_image"),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  status: text("status").default("pending").notNull(), // 'pending', 'processing', 'completed', 'cancelled'
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).default("0").notNull(),
  items: jsonb("items").default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export const siteStats = pgTable("site_stats", {
  id: serial("id").primaryKey(),
  date: date("date").defaultNow().notNull(),
  pageViews: integer("page_views").default(0).notNull(),
  uniqueVisitors: integer("unique_visitors").default(0).notNull(),
  newSignups: integer("new_signups").default(0).notNull(),
  ordersCount: integer("orders_count").default(0).notNull(),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSiteStatsSchema = createInsertSchema(siteStats).omit({
  id: true,
  createdAt: true,
});

export type SiteStats = typeof siteStats.$inferSelect;
export type InsertSiteStats = z.infer<typeof insertSiteStatsSchema>;
