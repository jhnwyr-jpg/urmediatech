(function() {
  'use strict';

  var script = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var API_KEY = script.getAttribute('data-api-key');
  var ENDPOINT = script.getAttribute('data-endpoint');

  if (!API_KEY || !ENDPOINT) {
    console.error('UR Media Client Control: Missing data-api-key or data-endpoint');
    return;
  }

  var features = [];
  var clientInfo = null;

  // Styles
  var styles = document.createElement('style');
  styles.textContent = [
    '.urc-badge{position:fixed;bottom:24px;left:24px;z-index:99997;background:#1a1a2e;color:#fff;border-radius:12px;padding:8px 14px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:12px;display:flex;align-items:center;gap:8px;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.3);transition:transform 0.2s}',
    '.urc-badge:hover{transform:scale(1.05)}',
    '.urc-badge-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;animation:urc-pulse 2s infinite}',
    '.urc-badge.has-locked .urc-badge-dot{background:#ef4444}',
    '@keyframes urc-pulse{0%,100%{opacity:1}50%{opacity:0.5}}',
    '.urc-panel{position:fixed;bottom:64px;left:24px;z-index:99998;width:320px;background:#1a1a2e;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.3);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#fff}',
    '.urc-panel.open{display:flex}',
    '.urc-panel-header{padding:16px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;gap:10px}',
    '.urc-panel-header-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#7B5FFF,#5B3FDF);display:flex;align-items:center;justify-content:center}',
    '.urc-panel-header h3{margin:0;font-size:14px;font-weight:600}',
    '.urc-panel-header p{margin:2px 0 0;font-size:11px;color:rgba(255,255,255,0.5)}',
    '.urc-panel-stats{display:flex;gap:8px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.1)}',
    '.urc-stat{flex:1;text-align:center;padding:8px;border-radius:8px;background:rgba(255,255,255,0.05)}',
    '.urc-stat-num{font-size:18px;font-weight:700}',
    '.urc-stat-label{font-size:10px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.5px}',
    '.urc-panel-body{max-height:300px;overflow-y:auto;padding:8px}',
    '.urc-feature{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:8px;margin-bottom:2px;transition:background 0.2s}',
    '.urc-feature:hover{background:rgba(255,255,255,0.05)}',
    '.urc-feature-name{font-size:13px;font-weight:500}',
    '.urc-feature-status{font-size:11px;padding:3px 10px;border-radius:20px;font-weight:600}',
    '.urc-feature-status.enabled{background:rgba(34,197,94,0.15);color:#22c55e}',
    '.urc-feature-status.disabled{background:rgba(239,68,68,0.15);color:#ef4444}',
    '.urc-panel-footer{padding:12px 16px;border-top:1px solid rgba(255,255,255,0.1);text-align:center}',
    '.urc-panel-footer a{color:#7B5FFF;font-size:11px;text-decoration:none;font-weight:600}',
    '.urc-panel-footer a:hover{text-decoration:underline}',
    '@media(max-width:420px){.urc-panel{left:12px;right:12px;width:auto}}'
  ].join('\n');
  document.head.appendChild(styles);

  // Shield SVG
  var shieldSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';

  // Badge
  var badge = document.createElement('div');
  badge.className = 'urc-badge';
  badge.innerHTML = '<span class="urc-badge-dot"></span><span class="urc-badge-text">UR Media</span>';
  document.body.appendChild(badge);

  // Panel
  var panel = document.createElement('div');
  panel.className = 'urc-panel';
  document.body.appendChild(panel);

  var isOpen = false;
  badge.addEventListener('click', function() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
  });

  document.addEventListener('click', function(e) {
    if (isOpen && !panel.contains(e.target) && !badge.contains(e.target)) {
      isOpen = false;
      panel.classList.remove('open');
    }
  });

  function fetchFeatures() {
    fetch(ENDPOINT, {
      headers: { 'x-api-key': API_KEY }
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.error) {
        console.error('UR Media Client Control:', data.error);
        return;
      }
      clientInfo = data.client;
      features = data.features || [];
      renderPanel(data);
      
      // Update badge
      if (data.disabled > 0) {
        badge.classList.add('has-locked');
      } else {
        badge.classList.remove('has-locked');
      }
    })
    .catch(function(err) {
      console.error('UR Media Client Control:', err);
    });
  }

  function renderPanel(data) {
    var enabledCount = data.enabled || 0;
    var disabledCount = data.disabled || 0;
    var total = data.total || 0;

    panel.innerHTML = ''
      + '<div class="urc-panel-header">'
      + '<div class="urc-panel-header-icon">' + shieldSvg + '</div>'
      + '<div>'
      + '<h3>' + escapeHtml(clientInfo.site_name || 'My Site') + '</h3>'
      + '<p>Managed by UR Media</p>'
      + '</div>'
      + '</div>'
      + '<div class="urc-panel-stats">'
      + '<div class="urc-stat"><div class="urc-stat-num">' + total + '</div><div class="urc-stat-label">Total</div></div>'
      + '<div class="urc-stat"><div class="urc-stat-num" style="color:#22c55e">' + enabledCount + '</div><div class="urc-stat-label">Active</div></div>'
      + '<div class="urc-stat"><div class="urc-stat-num" style="color:#ef4444">' + disabledCount + '</div><div class="urc-stat-label">Locked</div></div>'
      + '</div>'
      + '<div class="urc-panel-body">'
      + features.map(function(f) {
          return '<div class="urc-feature">'
            + '<span class="urc-feature-name">' + escapeHtml(f.feature_name) + '</span>'
            + '<span class="urc-feature-status ' + (f.is_enabled ? 'enabled' : 'disabled') + '">'
            + (f.is_enabled ? '✓ Active' : '🔒 Locked')
            + '</span>'
            + '</div>';
        }).join('')
      + '</div>'
      + '<div class="urc-panel-footer">'
      + '<a href="https://urmedia.tech" target="_blank">Powered by UR Media Tech</a>'
      + '</div>';
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text || ''));
    return div.innerHTML;
  }

  // Initial fetch
  fetchFeatures();
  // Poll every 60s
  setInterval(fetchFeatures, 60000);
})();
