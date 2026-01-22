/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Payload = {
  sessionId: string;
  visitorName: string;
  visitorPhone: string;
};

function badRequest(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return badRequest("Server is not configured", 500);
    }

    const body = (await req.json()) as Partial<Payload>;
    const sessionId = (body.sessionId ?? "").trim();
    const visitorName = (body.visitorName ?? "").trim();
    const visitorPhone = (body.visitorPhone ?? "").trim();

    if (sessionId.length < 8 || sessionId.length > 200) {
      return badRequest("Invalid session");
    }
    if (visitorName.length < 1 || visitorName.length > 100) {
      return badRequest("Invalid name");
    }
    if (visitorPhone.length < 6 || visitorPhone.length > 30) {
      return badRequest("Invalid phone");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({
        session_id: sessionId,
        status: "active",
        visitor_name: visitorName,
        visitor_phone: visitorPhone,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("support-chat-init insert error", error);
      return badRequest("Failed to start chat", 500);
    }

    return new Response(JSON.stringify({ conversationId: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("support-chat-init error", e);
    return badRequest(e instanceof Error ? e.message : "Unknown error", 500);
  }
});
