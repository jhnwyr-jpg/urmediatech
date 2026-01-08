import { Express } from "express";
import { storage } from "./storage";
import { insertPostSchema } from "../shared/schema";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(1000),
});

export async function registerRoutes(app: Express) {
  // Contact form endpoint (ported from Supabase Edge Function)
  app.post("/api/contact", async (req, res) => {
    try {
      const parsed = contactSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json(parsed.error);

      const { name, email, message } = parsed.data;

      // Forward to Google Sheets if script URL is available
      const scriptUrl = "https://script.google.com/macros/s/AKfycbx3P-o84AKNPQrWl2YCHxs2EdjibYCl72MO3v-W17qazKeVif84Hn2YnGPgvnTvpSQ/exec";
      
      const form = new URLSearchParams({ name, email, message });
      
      const resp = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: form.toString(),
      });

      if (!resp.ok) {
        console.error("Google Sheets write failed", resp.status);
        // We still return success to user but log the error
      }

      res.json({ ok: true });
    } catch (error) {
      console.error("Contact error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

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

  // Simple login session management
  app.post("/api/login", async (req, res) => {
    const { email, userId, isAdmin, fullName, avatarUrl } = req.body;
    if (!email || !userId) return res.status(400).json({ message: "Email and UserID required" });

    try {
      let profile = await storage.getProfileByUserId(userId);
      if (!profile) {
        profile = await storage.createProfile({ 
          email, 
          userId, 
          isAdmin: !!isAdmin,
          fullName,
          avatarUrl
        });
      }

      if (req.session) {
        req.session.userId = userId;
      }
      res.json(profile);
    } catch (error) {
      console.error("Login error:", error);
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
