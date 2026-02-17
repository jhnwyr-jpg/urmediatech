import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key",
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

// The inline JS that gets served to client websites
function getClientScript(endpoint: string): string {
  return `(function(){
  'use strict';
  var ENDPOINT='${endpoint}';
  var STORAGE_KEY='urc_api_key';
  var siteUrl=window.location.origin;
  var siteName=document.title||siteUrl;
  function getPageInfo(){
    var sections=[];
    document.querySelectorAll('section[id],div[id]').forEach(function(el){
      sections.push({id:el.id,tag:el.tagName.toLowerCase()});
    });
    return{title:document.title,url:window.location.href,sections_count:sections.length,sections:sections.slice(0,50),scripts_count:document.scripts.length,has_forms:document.querySelectorAll('form').length>0,links_count:document.querySelectorAll('a').length,images_count:document.querySelectorAll('img').length};
  }
  function getStoredKey(){try{return localStorage.getItem(STORAGE_KEY)}catch(e){return null}}
  function storeKey(key){try{localStorage.setItem(STORAGE_KEY,key)}catch(e){}}
  function init(){
    var storedKey=getStoredKey();
    if(storedKey){checkStatus(storedKey)}else{register()}
  }
  function register(){
    fetch(ENDPOINT+'?action=register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site_url:siteUrl,site_name:siteName,page_info:getPageInfo()})})
    .then(function(r){return r.json()})
    .then(function(data){if(data.api_key){storeKey(data.api_key)}})
    .catch(function(){});
  }
  function checkStatus(apiKey){
    fetch(ENDPOINT+'?action=status',{headers:{'x-api-key':apiKey}})
    .then(function(r){return r.json()})
    .then(function(){})
    .catch(function(){});
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}else{init()}
  setInterval(function(){var key=getStoredKey();if(key)checkStatus(key)},300000);
})();`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // No action = serve the client JS file directly
    if (!action && req.method === "GET") {
      const baseUrl = url.origin + url.pathname;
      const jsCode = getClientScript(baseUrl);
      return new Response(jsCode, {
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

    // Action: register - auto-register a new site
    if (action === "register" && req.method === "POST") {
      const { site_url, site_name, page_info } = await req.json();

      if (!site_url) {
        return new Response(
          JSON.stringify({ error: "Missing site_url" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if site already registered by URL
      const { data: existing } = await supabase
        .from("client_api_keys")
        .select("id, client_id, api_key, site_name")
        .eq("site_url", site_url)
        .eq("is_active", true)
        .limit(1);

      let clientId: string;
      let apiKey: string;
      let siteName: string;

      if (existing && existing.length > 0) {
        clientId = existing[0].client_id;
        apiKey = existing[0].api_key;
        siteName = existing[0].site_name;
      } else {
        const newClientId = crypto.randomUUID();
        const { data: newKey, error: insertErr } = await supabase
          .from("client_api_keys")
          .insert({
            client_id: newClientId,
            site_name: site_name || site_url,
            site_url: site_url,
            is_active: true,
          })
          .select("id, client_id, api_key, site_name")
          .single();

        if (insertErr || !newKey) {
          return new Response(
            JSON.stringify({ error: "Failed to register site" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        clientId = newKey.client_id;
        apiKey = newKey.api_key;
        siteName = newKey.site_name;

        const featuresToInsert = ALL_FEATURES.map((f) => ({
          client_id: clientId,
          feature_key: f.key,
          feature_name: f.name,
          is_enabled: true,
        }));

        await supabase.from("client_feature_controls").insert(featuresToInsert);
      }

      const { data: features } = await supabase
        .from("client_feature_controls")
        .select("feature_key, feature_name, is_enabled")
        .eq("client_id", clientId);

      return new Response(
        JSON.stringify({
          api_key: apiKey,
          client: { site_name: siteName, site_url: site_url },
          features: features || [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: status - check features with stored api_key
    if (action === "status") {
      const apiKey = req.headers.get("x-api-key") || url.searchParams.get("key");
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "Missing API key" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: keyData } = await supabase
        .from("client_api_keys")
        .select("client_id, site_name, site_url")
        .eq("api_key", apiKey)
        .eq("is_active", true)
        .single();

      if (!keyData) {
        return new Response(
          JSON.stringify({ error: "Invalid API key" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: features } = await supabase
        .from("client_feature_controls")
        .select("feature_key, feature_name, is_enabled")
        .eq("client_id", keyData.client_id);

      return new Response(
        JSON.stringify({
          client: { site_name: keyData.site_name, site_url: keyData.site_url },
          features: features || [],
          total: (features || []).length,
          enabled: (features || []).filter((f: any) => f.is_enabled).length,
          disabled: (features || []).filter((f: any) => !f.is_enabled).length,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use ?action=register or ?action=status" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
