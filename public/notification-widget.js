(function() {
  'use strict';

  var script = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var API_KEY = script.getAttribute('data-api-key');
  var ENDPOINT = script.getAttribute('data-endpoint');

  if (!API_KEY || !ENDPOINT) {
    console.error('UR Media Notification Widget: Missing data-api-key or data-endpoint');
    return;
  }

  var notifications = [];
  var isOpen = false;
  var pollInterval = null;

  // Styles
  var styles = document.createElement('style');
  styles.textContent = [
    '.urm-bell-btn{position:fixed;bottom:24px;right:24px;z-index:99999;width:52px;height:52px;border-radius:50%;background:#7B5FFF;color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(123,95,255,0.4);transition:transform 0.2s,box-shadow 0.2s}',
    '.urm-bell-btn:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(123,95,255,0.5)}',
    '.urm-bell-badge{position:absolute;top:-2px;right:-2px;background:#ef4444;color:#fff;font-size:11px;font-weight:700;min-width:20px;height:20px;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:0 5px}',
    '.urm-panel{position:fixed;bottom:86px;right:24px;z-index:99998;width:360px;max-height:480px;background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.15);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
    '.urm-panel.open{display:flex}',
    '.urm-panel-header{padding:16px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between}',
    '.urm-panel-header h3{margin:0;font-size:16px;font-weight:600;color:#1a1a1a}',
    '.urm-panel-header button{background:none;border:none;color:#7B5FFF;font-size:13px;cursor:pointer}',
    '.urm-panel-body{overflow-y:auto;flex:1;padding:8px}',
    '.urm-notif{padding:12px;border-radius:10px;margin-bottom:4px;cursor:pointer;transition:background 0.2s}',
    '.urm-notif:hover{background:#f7f5ff}',
    '.urm-notif.unread{background:#f0ecff}',
    '.urm-notif-title{font-size:14px;font-weight:600;color:#1a1a1a;margin:0 0 4px}',
    '.urm-notif-msg{font-size:13px;color:#666;margin:0 0 6px;line-height:1.4}',
    '.urm-notif-time{font-size:11px;color:#999}',
    '.urm-empty{padding:40px 20px;text-align:center;color:#999;font-size:14px}',
    '@media(max-width:420px){.urm-panel{right:12px;left:12px;width:auto;bottom:80px}}'
  ].join('\n');
  document.head.appendChild(styles);

  // Bell SVG
  var bellSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>';

  // Create bell button
  var bellBtn = document.createElement('button');
  bellBtn.className = 'urm-bell-btn';
  bellBtn.innerHTML = bellSvg;
  bellBtn.setAttribute('aria-label', 'Notifications');
  document.body.appendChild(bellBtn);

  // Badge
  var badge = document.createElement('span');
  badge.className = 'urm-bell-badge';
  badge.style.display = 'none';
  bellBtn.appendChild(badge);

  // Panel
  var panel = document.createElement('div');
  panel.className = 'urm-panel';
  panel.innerHTML = '<div class="urm-panel-header"><h3>Notifications</h3><button id="urm-mark-all">Mark all read</button></div><div class="urm-panel-body" id="urm-list"></div>';
  document.body.appendChild(panel);

  bellBtn.addEventListener('click', function() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen) renderNotifications();
  });

  document.getElementById('urm-mark-all').addEventListener('click', function() {
    fetch(ENDPOINT + '?action=mark_all_read', {
      method: 'POST',
      headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
      body: '{}'
    }).then(function() {
      notifications.forEach(function(n) { n.is_read = true; });
      updateBadge();
      renderNotifications();
    });
  });

  function fetchNotifications() {
    fetch(ENDPOINT + '?action=list', {
      headers: { 'x-api-key': API_KEY }
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var oldUnread = notifications.filter(function(n) { return !n.is_read; }).length;
      notifications = data.notifications || [];
      var newUnread = notifications.filter(function(n) { return !n.is_read; }).length;
      updateBadge();
      if (isOpen) renderNotifications();
      if (newUnread > oldUnread && notifications.length > 0) {
        showToast(notifications[0]);
      }
    })
    .catch(function(err) { console.error('UR Media Widget:', err); });
  }

  function updateBadge() {
    var count = notifications.filter(function(n) { return !n.is_read; }).length;
    badge.textContent = count > 9 ? '9+' : count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  function renderNotifications() {
    var list = document.getElementById('urm-list');
    if (notifications.length === 0) {
      list.innerHTML = '<div class="urm-empty">No notifications yet</div>';
      return;
    }
    list.innerHTML = notifications.map(function(n) {
      var date = new Date(n.created_at).toLocaleDateString();
      return '<div class="urm-notif ' + (n.is_read ? '' : 'unread') + '" data-id="' + n.id + '">'
        + '<p class="urm-notif-title">' + escapeHtml(n.title) + '</p>'
        + '<p class="urm-notif-msg">' + escapeHtml(n.message) + '</p>'
        + '<span class="urm-notif-time">' + date + '</span>'
        + '</div>';
    }).join('');

    list.querySelectorAll('.urm-notif.unread').forEach(function(el) {
      el.addEventListener('click', function() {
        var id = el.getAttribute('data-id');
        markRead(id);
        el.classList.remove('unread');
      });
    });
  }

  function markRead(id) {
    fetch(ENDPOINT + '?action=mark_read', {
      method: 'POST',
      headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    }).then(function() {
      var n = notifications.find(function(x) { return x.id === id; });
      if (n) n.is_read = true;
      updateBadge();
    });
  }

  function showToast(notif) {
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:24px;right:24px;z-index:100000;background:#fff;border-radius:12px;padding:16px;box-shadow:0 8px 30px rgba(0,0,0,0.12);max-width:340px;animation:urm-slide-in 0.3s ease;border-left:4px solid #7B5FFF;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif';
    toast.innerHTML = '<p style="margin:0 0 4px;font-weight:600;font-size:14px;color:#1a1a1a">' + escapeHtml(notif.title) + '</p><p style="margin:0;font-size:13px;color:#666">' + escapeHtml(notif.message) + '</p>';
    document.body.appendChild(toast);

    var anim = document.createElement('style');
    anim.textContent = '@keyframes urm-slide-in{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}';
    document.head.appendChild(anim);

    setTimeout(function() {
      toast.style.transition = 'opacity 0.3s';
      toast.style.opacity = '0';
      setTimeout(function() { toast.remove(); }, 300);
    }, 5000);
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  // Initial fetch and polling
  fetchNotifications();
  pollInterval = setInterval(fetchNotifications, 15000);

  // Close panel on outside click
  document.addEventListener('click', function(e) {
    if (isOpen && !panel.contains(e.target) && !bellBtn.contains(e.target)) {
      isOpen = false;
      panel.classList.remove('open');
    }
  });
})();
