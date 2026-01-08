import { db } from "./db";
import { eq } from "drizzle-orm";
import { 
  type Profile, type InsertProfile, 
  type Post, type InsertPost,
  type Order, type InsertOrder,
  type SiteStats, type InsertSiteStats,
  profiles, posts, orders, siteStats 
} from "../shared/schema";

export interface IStorage {
  getProfileByUserId(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  getPosts(): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  getOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  getSiteStats(): Promise<SiteStats[]>;
}

export class DatabaseStorage implements IStorage {
  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile).returning();
    return profile;
  }

  async getPosts(): Promise<Post[]> {
    return await db.select().from(posts);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db.insert(posts).values(insertPost).returning();
    return post;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async getSiteStats(): Promise<SiteStats[]> {
    return await db.select().from(siteStats);
  }
}

export const storage = new DatabaseStorage();
