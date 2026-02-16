import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "list";
    const since = url.searchParams.get("since"); // ISO timestamp for polling

    if (action === "list") {
      let query = supabase
        .from("broadcast_notifications")
        .select("id, title, message, url, image_url, created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(30);

      if (since) {
        query = query.gt("created_at", since);
      }

      const { data, error } = await query;

      if (error) throw error;

      return new Response(
        JSON.stringify({ notifications: data || [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
