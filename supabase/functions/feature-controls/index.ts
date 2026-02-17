import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const ALL_FEATURES = [
  { key: "notifications", name: "Push Notifications" },
  { key: "client_notifications", name: "Client Notifications" },
  { key: "broadcast", name: "Broadcast Notifications" },
  { key: "chat_support", name: "Chat Support" },
  { key: "ai_chatbot", name: "AI Chatbot" },
  { key: "analytics", name: "Analytics & Reports" },
  { key: "tracking_pixels", name: "Tracking Pixels" },
  { key: "marketing_scripts", name: "Marketing Scripts" },
  { key: "conversion_tracking", name: "Conversion Tracking" },
  { key: "meetings", name: "Meeting Booking" },
  { key: "services", name: "Services Management" },
  { key: "orders", name: "Orders Management" },
  { key: "coupons", name: "Coupons System" },
  { key: "pricing", name: "Pricing Plans" },
];

function getClientScript(endpoint: string): string {
  return `(function(){
'use strict';
if(window.__URC_INITIALIZED)return;
window.__URC_INITIALIZED=true;
var E='${endpoint}';
var SK='urc_api_key';
var siteUrl=window.location.origin;
var siteName=document.title||siteUrl;
var apiKey=null;

function gs(){try{return localStorage.getItem(SK)}catch(e){return null}}
function ss(k){try{localStorage.setItem(SK,k)}catch(e){}}

function init(){
  apiKey=gs();
  if(apiKey){checkStatus()}else{register()}
}
function getPageInfo(){
  var s=[];document.querySelectorAll('section[id],div[id]').forEach(function(el){s.push({id:el.id,tag:el.tagName.toLowerCase()})});
  return{title:document.title,url:window.location.href,sections_count:s.length,sections:s.slice(0,50),scripts_count:document.scripts.length,has_forms:document.querySelectorAll('form').length>0,links_count:document.querySelectorAll('a').length,images_count:document.querySelectorAll('img').length};
}
function register(){
  fetch(E+'?action=register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site_url:siteUrl,site_name:siteName,page_info:getPageInfo()})})
  .then(function(r){return r.json()}).then(function(d){if(d.api_key){ss(d.api_key);apiKey=d.api_key}}).catch(function(){});
}
function checkStatus(){fetch(E+'?action=status',{headers:{'x-api-key':gs()}}).then(function(r){return r.json()}).then(function(){}).catch(function(){})}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}else{init()}
})();`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    console.log(`[feature-controls] action=${action}, method=${req.method}`);

    // No action = serve the unified client JS
    if (!action && req.method === "GET") {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const baseUrl = `${supabaseUrl}/functions/v1/feature-controls`;
      return new Response(getClientScript(baseUrl), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/javascript; charset=utf-8",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // === REGISTER ===
    if (action === "register" && req.method === "POST") {
      const body = await req.json();
      const { site_url, site_name } = body;
      console.log(`[register] site_url=${site_url}, site_name=${site_name}`);
      if (!site_url) {
        return new Response(JSON.stringify({ error: "Missing site_url" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { data: existing } = await supabase
        .from("client_api_keys")
        .select("id, client_id, api_key, site_name")
        .eq("site_url", site_url)
        .eq("is_active", true)
        .limit(1);

      let clientId: string, apiKey: string;

      if (existing && existing.length > 0) {
        clientId = existing[0].client_id;
        apiKey = existing[0].api_key;
      } else {
        const newClientId = crypto.randomUUID();
        const { data: newKey, error: insertErr } = await supabase
          .from("client_api_keys")
          .insert({ client_id: newClientId, site_name: site_name || site_url, site_url, is_active: true })
          .select("id, client_id, api_key, site_name")
          .single();

        if (insertErr || !newKey) {
          return new Response(JSON.stringify({ error: "Failed to register" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        clientId = newKey.client_id;
        apiKey = newKey.api_key;

        const feats = ALL_FEATURES.map((f) => ({
          client_id: clientId, feature_key: f.key, feature_name: f.name, is_enabled: true,
        }));
        await supabase.from("client_feature_controls").insert(feats);
      }

      return new Response(JSON.stringify({ api_key: apiKey }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // === STATUS ===
    if (action === "status") {
      const apiKey = req.headers.get("x-api-key");
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "Missing API key" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { data: keyData } = await supabase
        .from("client_api_keys").select("client_id, site_name, site_url")
        .eq("api_key", apiKey).eq("is_active", true).single();

      if (!keyData) {
        return new Response(JSON.stringify({ error: "Invalid API key" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { data: features } = await supabase
        .from("client_feature_controls").select("feature_key, feature_name, is_enabled")
        .eq("client_id", keyData.client_id);

      return new Response(JSON.stringify({ client: keyData, features: features || [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // === BROADCAST LIST (public, no auth needed) ===
    if (action === "broadcast_list") {
      const { data, error } = await supabase
        .from("broadcast_notifications")
        .select("id, title, message, url, image_url, created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) throw error;
      return new Response(JSON.stringify({ notifications: data || [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
