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
var E='${endpoint}';
var SK='urc_api_key';
var siteUrl=window.location.origin;
var siteName=document.title||siteUrl;
var apiKey=null;
var notifications=[];
var isOpen=false;

function gs(){try{return localStorage.getItem(SK)}catch(e){return null}}
function ss(k){try{localStorage.setItem(SK,k)}catch(e){}}

// ===== AUTO-REGISTER =====
function init(){
  apiKey=gs();
  if(apiKey){checkStatus()}else{register()}
  initBroadcastUI();
  fetchBroadcast();
  setInterval(fetchBroadcast,20000);
  setInterval(function(){var k=gs();if(k)checkStatus()},300000);
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

// ===== BROADCAST NOTIFICATION UI =====
var RK='urb_read_ids';
function getReadIds(){try{return JSON.parse(localStorage.getItem(RK)||'[]')}catch(e){return[]}}
function markAsRead(id){var ids=getReadIds();if(ids.indexOf(id)===-1)ids.push(id);if(ids.length>200)ids=ids.slice(-200);localStorage.setItem(RK,JSON.stringify(ids))}
function markAllRead(){localStorage.setItem(RK,JSON.stringify(notifications.map(function(n){return n.id})))}
function isRead(id){return getReadIds().indexOf(id)!==-1}

function initBroadcastUI(){
  var st=document.createElement('style');
  st.textContent='.urb-bell-btn{position:fixed;bottom:24px;right:24px;z-index:99999;width:52px;height:52px;border-radius:50%;background:#7B5FFF;color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(123,95,255,0.4);transition:transform 0.2s,box-shadow 0.2s}.urb-bell-btn:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(123,95,255,0.5)}.urb-bell-badge{position:absolute;top:-2px;right:-2px;background:#ef4444;color:#fff;font-size:11px;font-weight:700;min-width:20px;height:20px;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:0 5px}.urb-panel{position:fixed;bottom:86px;right:24px;z-index:99998;width:360px;max-height:480px;background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.15);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}.urb-panel.open{display:flex}.urb-panel-header{padding:16px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between}.urb-panel-header h3{margin:0;font-size:16px;font-weight:600;color:#1a1a1a}.urb-panel-header button{background:none;border:none;color:#7B5FFF;font-size:13px;cursor:pointer;padding:4px 8px;border-radius:6px}.urb-panel-header button:hover{background:#f0ecff}.urb-panel-body{overflow-y:auto;flex:1;padding:8px}.urb-notif{padding:12px;border-radius:10px;margin-bottom:4px;cursor:pointer;transition:background 0.2s}.urb-notif:hover{background:#f7f5ff}.urb-notif.unread{background:#f0ecff}.urb-notif-title{font-size:14px;font-weight:600;color:#1a1a1a;margin:0 0 4px}.urb-notif-msg{font-size:13px;color:#666;margin:0 0 6px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.urb-notif-time{font-size:11px;color:#999}.urb-notif-img{width:100%;border-radius:8px;margin-top:8px;max-height:120px;object-fit:cover}.urb-notif-detail{display:none;margin-top:8px;padding-top:8px;border-top:1px solid #eee}.urb-notif-detail.open{display:block}.urb-notif-detail-msg{font-size:13px;color:#444;line-height:1.6;margin:0 0 8px;white-space:pre-wrap}.urb-notif-link{display:inline-block;font-size:12px;color:#7B5FFF;text-decoration:none;font-weight:600;margin-top:4px}.urb-notif-link:hover{text-decoration:underline}.urb-empty{padding:40px 20px;text-align:center;color:#999;font-size:14px}@media(max-width:420px){.urb-panel{right:12px;left:12px;width:auto;bottom:80px}}';
  document.head.appendChild(st);

  var bellSvg='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>';
  var btn=document.createElement('button');btn.className='urb-bell-btn';btn.innerHTML=bellSvg;btn.setAttribute('aria-label','Notifications');document.body.appendChild(btn);
  var bdg=document.createElement('span');bdg.className='urb-bell-badge';bdg.style.display='none';btn.appendChild(bdg);
  window._urbBadge=bdg;window._urbBtn=btn;

  var pnl=document.createElement('div');pnl.className='urb-panel';
  pnl.innerHTML='<div class="urb-panel-header"><h3>\\u{1F4E2} Updates</h3><button id="urb-mark-all">Mark all read</button></div><div class="urb-panel-body" id="urb-list"></div>';
  document.body.appendChild(pnl);window._urbPanel=pnl;

  btn.addEventListener('click',function(){isOpen=!isOpen;pnl.classList.toggle('open',isOpen);if(isOpen)renderList()});
  document.getElementById('urb-mark-all').addEventListener('click',function(){markAllRead();updateBadge();renderList()});
  document.addEventListener('click',function(e){if(isOpen&&!pnl.contains(e.target)&&!btn.contains(e.target)){isOpen=false;pnl.classList.remove('open')}});
}

function fetchBroadcast(){
  fetch(E+'?action=broadcast_list').then(function(r){return r.json()}).then(function(d){
    var oldUn=notifications.filter(function(n){return!isRead(n.id)}).length;
    notifications=d.notifications||[];
    var newUn=notifications.filter(function(n){return!isRead(n.id)}).length;
    updateBadge();
    if(isOpen)renderList();
    if(newUn>oldUn&&notifications.length>0){
      for(var i=0;i<notifications.length;i++){if(!isRead(notifications[i].id)){playSound();showToast(notifications[i]);break}}
    }
  }).catch(function(){});
}

function updateBadge(){var c=notifications.filter(function(n){return!isRead(n.id)}).length;window._urbBadge.textContent=c>9?'9+':c;window._urbBadge.style.display=c>0?'flex':'none'}

function renderList(){
  var list=document.getElementById('urb-list');
  if(!notifications.length){list.innerHTML='<div class="urb-empty">No updates yet</div>';return}
  list.innerHTML=notifications.map(function(n){
    var d=new Date(n.created_at).toLocaleDateString();var un=!isRead(n.id);
    var img=n.image_url?'<img class="urb-notif-img" src="'+ea(n.image_url)+'" alt="" onerror="this.style.display=\\'none\\'">':'';
    var rawUrl=n.url&&n.url.trim()?n.url.trim():'';if(rawUrl&&!/^https?:\\/\\//i.test(rawUrl))rawUrl='https://'+rawUrl;
    var link=rawUrl?'<a class="urb-notif-link" href="'+ea(rawUrl)+'" target="_blank" rel="noopener">\\u{1F517} বিস্তারিত দেখুন</a>':'';
    return'<div class="urb-notif '+(un?'unread':'')+'" data-id="'+n.id+'"><p class="urb-notif-title">'+eh(n.title)+'</p><p class="urb-notif-msg">'+eh(n.message)+'</p><span class="urb-notif-time">'+d+'</span><div class="urb-notif-detail" data-detail="'+n.id+'"><p class="urb-notif-detail-msg">'+eh(n.message)+'</p>'+img+link+'</div></div>';
  }).join('');
  list.querySelectorAll('.urb-notif').forEach(function(el){
    el.addEventListener('click',function(e){if(e.target.tagName==='A')return;var id=el.getAttribute('data-id');markAsRead(id);el.classList.remove('unread');updateBadge();var dt=el.querySelector('.urb-notif-detail');if(dt)dt.classList.toggle('open')});
  });
}

function showToast(n){
  var t=document.createElement('div');
  t.style.cssText='position:fixed;top:24px;right:24px;z-index:100000;background:#fff;border-radius:12px;padding:16px;box-shadow:0 8px 30px rgba(0,0,0,0.12);max-width:340px;border-left:4px solid #7B5FFF;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer;animation:urb-sl 0.3s ease';
  t.innerHTML='<p style="margin:0 0 4px;font-weight:600;font-size:14px;color:#1a1a1a">'+eh(n.title)+'</p><p style="margin:0;font-size:13px;color:#666">'+eh(n.message)+'</p>';
  if(n.url)t.addEventListener('click',function(){window.open(n.url,'_blank')});
  document.body.appendChild(t);
  var a=document.createElement('style');a.textContent='@keyframes urb-sl{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}';document.head.appendChild(a);
  setTimeout(function(){t.style.transition='opacity 0.3s';t.style.opacity='0';setTimeout(function(){t.remove()},300)},5000);
}

function playSound(){try{var c=new(window.AudioContext||window.webkitAudioContext)();var o=c.createOscillator();var g=c.createGain();o.connect(g);g.connect(c.destination);o.type='sine';o.frequency.setValueAtTime(880,c.currentTime);o.frequency.setValueAtTime(1100,c.currentTime+0.1);g.gain.setValueAtTime(0.3,c.currentTime);g.gain.exponentialRampToValueAtTime(0.01,c.currentTime+0.4);o.start(c.currentTime);o.stop(c.currentTime+0.4)}catch(e){}}

function eh(t){var d=document.createElement('div');d.appendChild(document.createTextNode(t));return d.innerHTML}
function ea(t){return t.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

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
