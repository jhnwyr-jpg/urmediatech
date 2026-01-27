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
    }

    if (!apiKey) {
      throw new Error("No API key configured. Please set LOVABLE_API_KEY or configure a custom key in admin settings.");
    }

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

    // Check if user is booking a meeting
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    const bookingKeywords = ["book", "schedule", "meeting", "consultation", "appointment"];
    const dateTimeRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{1,2}:\d{2})|(\d{1,2}\s*(am|pm))/i;
    
    // Parse meeting booking if detected
    if (bookingKeywords.some(k => lastUserMessage.includes(k)) && dateTimeRegex.test(lastUserMessage)) {
      // Extract and save meeting info (simplified - the AI will confirm)
      console.log("Potential meeting booking detected");
    }

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
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
