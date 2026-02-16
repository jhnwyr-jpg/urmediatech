(function() {
  'use strict';

  var script = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var ENDPOINT = script.getAttribute('data-endpoint');
  if (!ENDPOINT) {
    console.error('UR Media Broadcast Widget: Missing data-endpoint');
    return;
  }

  var notifications = [];
  var isOpen = false;
  var lastFetchTime = null;

  // Styles
  var styles = document.createElement('style');
  styles.textContent = [
    '.urb-bell-btn{position:fixed;bottom:24px;right:24px;z-index:99999;width:52px;height:52px;border-radius:50%;background:#7B5FFF;color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(123,95,255,0.4);transition:transform 0.2s,box-shadow 0.2s}',
    '.urb-bell-btn:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(123,95,255,0.5)}',
    '.urb-bell-badge{position:absolute;top:-2px;right:-2px;background:#ef4444;color:#fff;font-size:11px;font-weight:700;min-width:20px;height:20px;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:0 5px}',
    '.urb-panel{position:fixed;bottom:86px;right:24px;z-index:99998;width:360px;max-height:480px;background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.15);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
    '.urb-panel.open{display:flex}',
    '.urb-panel-header{padding:16px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between}',
    '.urb-panel-header h3{margin:0;font-size:16px;font-weight:600;color:#1a1a1a}',
    '.urb-panel-header button{background:none;border:none;color:#7B5FFF;font-size:13px;cursor:pointer;padding:4px 8px;border-radius:6px}',
    '.urb-panel-header button:hover{background:#f0ecff}',
    '.urb-panel-body{overflow-y:auto;flex:1;padding:8px}',
    '.urb-notif{padding:12px;border-radius:10px;margin-bottom:4px;cursor:pointer;transition:background 0.2s}',
    '.urb-notif:hover{background:#f7f5ff}',
    '.urb-notif.unread{background:#f0ecff}',
    '.urb-notif-title{font-size:14px;font-weight:600;color:#1a1a1a;margin:0 0 4px}',
    '.urb-notif-msg{font-size:13px;color:#666;margin:0 0 6px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
    '.urb-notif-msg.expanded{display:block;-webkit-line-clamp:unset}',
    '.urb-notif-time{font-size:11px;color:#999}',
    '.urb-notif-img{width:100%;border-radius:8px;margin-top:8px;max-height:120px;object-fit:cover}',
    '.urb-notif-detail{display:none;margin-top:8px;padding-top:8px;border-top:1px solid #eee}',
    '.urb-notif-detail.open{display:block}',
    '.urb-notif-detail-msg{font-size:13px;color:#444;line-height:1.6;margin:0 0 8px;white-space:pre-wrap}',
    '.urb-notif-link{display:inline-block;font-size:12px;color:#7B5FFF;text-decoration:none;font-weight:600;margin-top:4px}',
    '.urb-notif-link:hover{text-decoration:underline}',
    '.urb-empty{padding:40px 20px;text-align:center;color:#999;font-size:14px}',
    '@media(max-width:420px){.urb-panel{right:12px;left:12px;width:auto;bottom:80px}}'
  ].join('\n');
  document.head.appendChild(styles);

  // Storage key for read notifications
  var STORAGE_KEY = 'urb_read_ids';
  function getReadIds() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch(e) { return []; }
  }
  function markAsRead(id) {
    var ids = getReadIds();
    if (ids.indexOf(id) === -1) { ids.push(id); }
    // Keep max 200
    if (ids.length > 200) ids = ids.slice(-200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
  function markAllRead() {
    var ids = notifications.map(function(n) { return n.id; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
  function isRead(id) {
    return getReadIds().indexOf(id) !== -1;
  }

  // Notification sound
  var audioCtx = null;
  function playNotifSound() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.1);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.4);
    } catch(e) {}
  }

  // Bell SVG
  var bellSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>';

  // Create bell
  var bellBtn = document.createElement('button');
  bellBtn.className = 'urb-bell-btn';
  bellBtn.innerHTML = bellSvg;
  bellBtn.setAttribute('aria-label', 'Notifications');
  document.body.appendChild(bellBtn);

  var badge = document.createElement('span');
  badge.className = 'urb-bell-badge';
  badge.style.display = 'none';
  bellBtn.appendChild(badge);

  // Panel
  var panel = document.createElement('div');
  panel.className = 'urb-panel';
  panel.innerHTML = '<div class="urb-panel-header"><h3>📢 Updates</h3><button id="urb-mark-all">Mark all read</button></div><div class="urb-panel-body" id="urb-list"></div>';
  document.body.appendChild(panel);

  bellBtn.addEventListener('click', function() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen) renderNotifications();
  });

  document.getElementById('urb-mark-all').addEventListener('click', function() {
    markAllRead();
    updateBadge();
    renderNotifications();
  });

  function fetchNotifications() {
    var url = ENDPOINT + '?action=list';
    fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var oldUnread = getUnreadCount();
        notifications = data.notifications || [];
        var newUnread = getUnreadCount();
        updateBadge();
        if (isOpen) renderNotifications();
        if (newUnread > oldUnread && notifications.length > 0) {
          // Find first unread
          for (var i = 0; i < notifications.length; i++) {
            if (!isRead(notifications[i].id)) {
              playNotifSound();
              showToast(notifications[i]);
              break;
            }
          }
        }
      })
      .catch(function(err) { console.error('UR Media Widget:', err); });
  }

  function getUnreadCount() {
    return notifications.filter(function(n) { return !isRead(n.id); }).length;
  }

  function updateBadge() {
    var count = getUnreadCount();
    badge.textContent = count > 9 ? '9+' : count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  function renderNotifications() {
    var list = document.getElementById('urb-list');
    if (notifications.length === 0) {
      list.innerHTML = '<div class="urb-empty">No updates yet</div>';
      return;
    }
    list.innerHTML = notifications.map(function(n) {
      var date = new Date(n.created_at).toLocaleDateString();
      var unread = !isRead(n.id);
      var img = n.image_url ? '<img class="urb-notif-img" src="' + escapeAttr(n.image_url) + '" alt="" onerror="this.style.display=\'none\'">' : '';
      var rawUrl = n.url && n.url.trim() ? n.url.trim() : '';
      if (rawUrl && !/^https?:\/\//i.test(rawUrl)) rawUrl = 'https://' + rawUrl;
      var link = rawUrl ? '<a class="urb-notif-link" href="' + escapeAttr(rawUrl) + '" target="_blank" rel="noopener">🔗 বিস্তারিত দেখুন</a>' : '';
      return '<div class="urb-notif ' + (unread ? 'unread' : '') + '" data-id="' + n.id + '">'
        + '<p class="urb-notif-title">' + escapeHtml(n.title) + '</p>'
        + '<p class="urb-notif-msg">' + escapeHtml(n.message) + '</p>'
        + '<span class="urb-notif-time">' + date + '</span>'
        + '<div class="urb-notif-detail" data-detail="' + n.id + '">'
        + '<p class="urb-notif-detail-msg">' + escapeHtml(n.message) + '</p>'
        + img
        + link
        + '</div>'
        + '</div>';
    }).join('');

    list.querySelectorAll('.urb-notif').forEach(function(el) {
      el.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') return; // let links work normally
        var id = el.getAttribute('data-id');
        markAsRead(id);
        el.classList.remove('unread');
        updateBadge();
        // Toggle detail section
        var detail = el.querySelector('.urb-notif-detail');
        if (detail) {
          detail.classList.toggle('open');
        }
      });
    });
  }

  function showToast(notif) {
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:24px;right:24px;z-index:100000;background:#fff;border-radius:12px;padding:16px;box-shadow:0 8px 30px rgba(0,0,0,0.12);max-width:340px;animation:urb-slide 0.3s ease;border-left:4px solid #7B5FFF;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer';
    toast.innerHTML = '<p style="margin:0 0 4px;font-weight:600;font-size:14px;color:#1a1a1a">' + escapeHtml(notif.title) + '</p><p style="margin:0;font-size:13px;color:#666">' + escapeHtml(notif.message) + '</p>';
    if (notif.url) {
      toast.addEventListener('click', function() { window.open(notif.url, '_blank'); });
    }
    document.body.appendChild(toast);

    var anim = document.createElement('style');
    anim.textContent = '@keyframes urb-slide{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}';
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
  function escapeAttr(text) {
    return text.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  fetchNotifications();
  setInterval(fetchNotifications, 20000);

  document.addEventListener('click', function(e) {
    if (isOpen && !panel.contains(e.target) && !bellBtn.contains(e.target)) {
      isOpen = false;
      panel.classList.remove('open');
    }
  });
})();
