import { Express } from "express";
import { storage } from "./storage";
import { insertPostSchema } from "../shared/schema";

export async function registerRoutes(app: Express) {
  // Public API to get posts
  app.get("/api/posts", async (_req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Admin API to create posts
  app.post("/api/posts", async (req, res) => {
    if (!req.session?.userId) return res.status(401).json({ message: "Unauthorized" });
    
    const profile = await storage.getProfileByUserId(req.session.userId);
    if (!profile?.isAdmin) return res.status(403).json({ message: "Forbidden: Admin access required" });

    const parsed = insertPostSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    
    try {
      const post = await storage.createPost(parsed.data);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Simple one-click login for admin setup (demonstration purposes)
  app.post("/api/login", async (req, res) => {
    const { email, userId, isAdmin } = req.body;
    if (!email || !userId) return res.status(400).json({ message: "Email and UserID required" });

    try {
      let profile = await storage.getProfileByUserId(userId);
      if (!profile) {
        profile = await storage.createProfile({ 
          email, 
          userId, 
          isAdmin: !!isAdmin 
        });
      }

      if (req.session) {
        req.session.userId = userId;
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/me", async (req, res) => {
    if (!req.session?.userId) return res.status(401).json({ message: "Not logged in" });
    try {
      const profile = await storage.getProfileByUserId(req.session.userId);
      if (!profile) return res.status(404).json({ message: "Profile not found" });
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(200);
    }
  });
}
