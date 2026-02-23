import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT_BN = `তুমি URMedia Tech এর AI সহকারী। URMedia Tech ওয়েবসাইট ও ডিজিটাল সলিউশন তৈরি করে।

তোমার কাজ:
1. ভিজিটরদের সার্ভিস সম্পর্কে জানানো (Landing Page, E-commerce, Business Website, Portfolio, Blog, Custom Web App)
2. প্রজেক্টের চাহিদা ধাপে ধাপে জানা
3. ফ্রি কনসালটেশন মিটিং বুক করতে সাহায্য করা

কথা বলার নিয়ম:
- বাংলায় কথা বলো, ছোট ছোট বাক্যে
- একবারে একটাই প্রশ্ন করো
- গুরুত্বপূর্ণ তথ্য আগে বলো
- ডাটাবেসে নেই এমন দাম বা ফিচার নিজে বানিও না
- ২-৩ লাইনে উত্তর দাও, দরকার হলে বুলেট পয়েন্ট ব্যবহার করো

কথোপকথনের ধাপ:
1. অভিনন্দন → কোন ধরনের ওয়েবসাইট লাগবে জিজ্ঞেস করো
2. প্যাকেজ ও দাম জানাও
3. প্রজেক্টের নাম, ডিজাইন নাকি ফুল ডেভেলপমেন্ট, ডোমেইন/হোস্টিং আছে কিনা জানো
4. মিটিং বুক করতে চাইলে নাম, ফোন/ইমেইল, তারিখ ও সময় নাও

তথ্য না থাকলে বলো: "এই বিষয়ে বিস্তারিত জানতে আমাদের টিমের সাথে কথা বলুন।"

সার্ভিস তালিকা:
{{SERVICES}}

আজকের তারিখ: {{CURRENT_DATE}}`;

const SYSTEM_PROMPT_EN = `You are URMedia Tech's AI assistant. URMedia Tech builds websites and digital solutions.

Your job:
1. Guide visitors about services (Landing Pages, E-commerce, Business Websites, Portfolio, Blog, Custom Web Apps)
2. Collect project requirements step by step
3. Help book free consultation meetings

Communication rules:
- Respond in English, keep it short and punchy
- Ask one question at a time
- Lead with the most important info
- Never guess prices or features — only use database info
- Keep answers to 2-3 lines, use bullet points when needed

Conversation flow:
1. Greet → Ask what type of website they need
2. Share relevant packages with pricing
3. Ask: project name, design vs full dev, domain/hosting status
4. For meetings: collect name, email/phone, preferred date & time

If info isn't available: "Let me connect you with our team for details."

Available Services:
{{SERVICES}}

Current Date: {{CURRENT_DATE}}`;

// Detect API key type and get the appropriate endpoint
function getApiConfig(apiKey: string): { url: string; model: string; keyType: string } {
  if (apiKey.startsWith("sk-")) {
    // OpenAI API key
    return {
      url: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4o-mini",
      keyType: "openai"
    };
  } else if (apiKey.startsWith("AIza")) {
    // Google Gemini API key
    return {
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      model: "gemini-2.0-flash",
      keyType: "gemini"
    };
  } else {
    // Default to Lovable Gateway
    return {
      url: "https://ai.gateway.lovable.dev/v1/chat/completions",
      model: "google/gemini-3-flash-preview",
      keyType: "lovable"
    };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId, sessionId, language } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for custom API key in database settings
    let apiKey = Deno.env.get("LOVABLE_API_KEY");
    let useCustomKey = false;
    
    const { data: settingsData } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["ai_use_custom_key", "ai_custom_api_key", "ai_chat_enabled"]);

    const settingsMap = settingsData?.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string | null>) || {};

    // Check if AI chat is disabled
    if (settingsMap.ai_chat_enabled === "false") {
      return new Response(JSON.stringify({ error: "AI Chat is currently disabled" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use custom API key if enabled and available
    if (settingsMap.ai_use_custom_key === "true" && settingsMap.ai_custom_api_key) {
      apiKey = settingsMap.ai_custom_api_key;
      useCustomKey = true;
      console.log("Using custom API key from admin settings");
    }

    if (!apiKey) {
      throw new Error("No API key configured. Please set LOVABLE_API_KEY or configure a custom key in admin settings.");
    }

    // Get the appropriate API configuration based on key type
    const apiConfig = getApiConfig(apiKey);
    console.log(`Using ${apiConfig.keyType} API with model: ${apiConfig.model}`);

    // Fetch active services from database
    const { data: services, error: servicesError } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true);

    if (servicesError) {
      console.error("Error fetching services:", servicesError);
    }

    // Format services for the prompt
    const servicesText = services?.map(s => 
      `- ${s.name} (${s.category}): $${s.price} - ${s.delivery_days} days
   Description: ${s.description}
   Features: ${Array.isArray(s.features) ? s.features.join(", ") : s.features}`
    ).join("\n") || "No services available";

    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const promptTemplate = language === "en" ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_BN;
    const systemPrompt = promptTemplate
      .replace("{{SERVICES}}", servicesText)
      .replace("{{CURRENT_DATE}}", currentDate);

    // Build request headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    };

    // Call the AI API with fallback
    let response = await fetch(apiConfig.url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: apiConfig.model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    // If custom key fails (rate limit, auth error), fallback to Lovable gateway
    if (!response.ok && useCustomKey) {
      const errorStatus = response.status;
      const errorText = await response.text();
      console.error(`Custom ${apiConfig.keyType} API error (${errorStatus}):`, errorText);
      console.log("Falling back to Lovable Gateway...");

      const fallbackKey = Deno.env.get("LOVABLE_API_KEY");
      if (fallbackKey) {
        const fallbackConfig = {
          url: "https://ai.gateway.lovable.dev/v1/chat/completions",
          model: "google/gemini-3-flash-preview",
        };

        response = await fetch(fallbackConfig.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${fallbackKey}`,
          },
          body: JSON.stringify({
            model: fallbackConfig.model,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
            ],
            stream: true,
          }),
        });

        if (!response.ok) {
          const fallbackError = await response.text();
          console.error("Lovable Gateway fallback also failed:", response.status, fallbackError);
          return new Response(JSON.stringify({ error: "AI service temporarily unavailable. Please try again later." }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    } else if (!response.ok) {
      const errorText = await response.text();
      console.error(`${apiConfig.keyType} API error:`, response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 401 || response.status === 403) {
        return new Response(JSON.stringify({ 
          error: `Invalid API key. Please check your API key in Admin Settings.` 
        }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
