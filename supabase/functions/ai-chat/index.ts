import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a professional AI assistant for URMedia Tech, a tech service company that builds websites and digital solutions.

Your Core Responsibilities:
1. Guide visitors about services (Landing Pages, E-commerce, Business Websites, Portfolio, Blog, Custom Web Apps)
2. Collect their project requirements step by step
3. Help them book a consultation meeting
4. Always use the latest service data from the database

Communication Style:
- Be polite, professional, and friendly
- Keep responses concise and clear
- Ask one question at a time
- Never guess prices or features - only use provided database information

Conversation Flow:
1. Greet and ask what type of website they need
2. Based on their choice, explain relevant packages with pricing and features
3. Ask qualifying questions: project name, design vs full development, domain/hosting status, reference websites
4. When ready, offer to book a free consultation meeting
5. Collect name, email/phone, preferred date and time

When user provides meeting details, respond with booking confirmation.

If you don't have information in the database, say: "I don't have that specific information right now. Let me connect you with our team for details."

Available Services (from database):
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
    const { messages, conversationId, sessionId } = await req.json();

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

    const systemPrompt = SYSTEM_PROMPT
      .replace("{{SERVICES}}", servicesText)
      .replace("{{CURRENT_DATE}}", currentDate);

    // Build request headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Set authorization header based on API type
    if (apiConfig.keyType === "gemini") {
      headers["x-goog-api-key"] = apiKey;
    } else {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    // Call the appropriate AI API
    const response = await fetch(apiConfig.url, {
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

    if (!response.ok) {
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
          error: `Invalid API key. Please check your ${apiConfig.keyType === "openai" ? "OpenAI" : apiConfig.keyType === "gemini" ? "Google Gemini" : "Lovable"} API key in Admin Settings.` 
        }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error. Please check your API key." }), {
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
