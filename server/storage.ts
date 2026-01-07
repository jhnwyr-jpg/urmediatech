import { type Profile, type InsertProfile, type Post, type InsertPost } from "../shared/schema";

export interface IStorage {
  getProfileByUserId(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  getPosts(): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
}

export class MemStorage implements IStorage {
  private profiles: Map<number, Profile>;
  private posts: Map<number, Post>;
  private currentId: number;

  constructor() {
    this.profiles = new Map();
    this.posts = new Map();
    this.currentId = 1;
  }

  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find((p) => p.userId === userId);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.currentId++;
    const profile: Profile = { ...insertProfile, id, createdAt: new Date() };
    this.profiles.set(id, profile);
    return profile;
  }

  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentId++;
    const post: Post = { ...insertPost, id, createdAt: new Date() };
    this.posts.set(id, post);
    return post;
  }
}

export const storage = new MemStorage();
