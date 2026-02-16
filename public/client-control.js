(function() {
  'use strict';

  var script = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var ENDPOINT = script.getAttribute('data-endpoint');
  if (!ENDPOINT) {
    console.warn('UR Media Control: Missing data-endpoint');
    return;
  }

  var STORAGE_KEY = 'urc_api_key';
  var siteUrl = window.location.origin;
  var siteName = document.title || siteUrl;

  // Get page info
  function getPageInfo() {
    var sections = [];
    document.querySelectorAll('section[id], div[id]').forEach(function(el) {
      sections.push({ id: el.id, tag: el.tagName.toLowerCase() });
    });
    return {
      title: document.title,
      url: window.location.href,
      sections_count: sections.length,
      sections: sections.slice(0, 50),
      scripts_count: document.scripts.length,
      has_forms: document.querySelectorAll('form').length > 0,
      links_count: document.querySelectorAll('a').length,
      images_count: document.querySelectorAll('img').length
    };
  }

  function getStoredKey() {
    try { return localStorage.getItem(STORAGE_KEY); }
    catch(e) { return null; }
  }

  function storeKey(key) {
    try { localStorage.setItem(STORAGE_KEY, key); }
    catch(e) {}
  }

  // Register or check status
  function init() {
    var storedKey = getStoredKey();

    if (storedKey) {
      // Already registered, just check status silently
      checkStatus(storedKey);
    } else {
      // First time: auto-register
      register();
    }
  }

  function register() {
    fetch(ENDPOINT + '?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_url: siteUrl,
        site_name: siteName,
        page_info: getPageInfo()
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.api_key) {
        storeKey(data.api_key);
      }
    })
    .catch(function() {});
  }

  function checkStatus(apiKey) {
    fetch(ENDPOINT + '?action=status', {
      headers: { 'x-api-key': apiKey }
    })
    .then(function(r) { return r.json(); })
    .then(function() {
      // Silently received - no UI
    })
    .catch(function() {});
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-check every 5 minutes
  setInterval(function() {
    var key = getStoredKey();
    if (key) checkStatus(key);
  }, 300000);
})();
