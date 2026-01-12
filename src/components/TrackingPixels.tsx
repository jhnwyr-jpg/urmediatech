import { useEffect, useRef } from "react";
import { useTrackingPixels } from "@/hooks/useTrackingPixels";

type PageType = "home" | "product" | "contact" | "checkout";

interface TrackingPixelsProps {
  currentPage: PageType;
}

const TrackingPixels = ({ currentPage }: TrackingPixelsProps) => {
  const { pixels } = useTrackingPixels(currentPage);
  const injectedPixels = useRef<Set<string>>(new Set());

  useEffect(() => {
    pixels.forEach((pixel) => {
      const pixelKey = `${pixel.pixel_type}-${pixel.pixel_id}`;
      
      // Skip if already injected
      if (injectedPixels.current.has(pixelKey)) return;

      switch (pixel.pixel_type) {
        case "facebook":
          injectFacebookPixel(pixel.pixel_id);
          break;
        case "google_analytics":
          injectGoogleAnalytics(pixel.pixel_id);
          break;
        case "google_ads":
          injectGoogleAds(pixel.pixel_id);
          break;
        case "tiktok":
          injectTikTokPixel(pixel.pixel_id);
          break;
        case "linkedin":
          injectLinkedInPixel(pixel.pixel_id);
          break;
        case "twitter":
          injectTwitterPixel(pixel.pixel_id);
          break;
        default:
          console.warn(`Unknown pixel type: ${pixel.pixel_type}`);
      }

      injectedPixels.current.add(pixelKey);
    });
  }, [pixels]);

  return null;
};

// Facebook Pixel
const injectFacebookPixel = (pixelId: string) => {
  if (typeof window === "undefined" || (window as any).fbq) return;

  const script = document.createElement("script");
  script.id = `fb-pixel-${pixelId}`;
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);

  // Add noscript fallback
  const noscript = document.createElement("noscript");
  const img = document.createElement("img");
  img.height = 1;
  img.width = 1;
  img.style.display = "none";
  img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.body.appendChild(noscript);
};

// Google Analytics (GA4)
const injectGoogleAnalytics = (measurementId: string) => {
  if (typeof window === "undefined" || document.getElementById(`ga-${measurementId}`)) return;

  const script1 = document.createElement("script");
  script1.id = `ga-${measurementId}`;
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement("script");
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
};

// Google Ads
const injectGoogleAds = (conversionId: string) => {
  if (typeof window === "undefined" || document.getElementById(`gads-${conversionId}`)) return;

  const script1 = document.createElement("script");
  script1.id = `gads-${conversionId}`;
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${conversionId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement("script");
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${conversionId}');
  `;
  document.head.appendChild(script2);
};

// TikTok Pixel
const injectTikTokPixel = (pixelId: string) => {
  if (typeof window === "undefined" || (window as any).ttq) return;

  const script = document.createElement("script");
  script.id = `tt-pixel-${pixelId}`;
  script.innerHTML = `
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load('${pixelId}');
      ttq.page();
    }(window, document, 'ttq');
  `;
  document.head.appendChild(script);
};

// LinkedIn Insight Tag
const injectLinkedInPixel = (partnerId: string) => {
  if (typeof window === "undefined" || document.getElementById(`li-pixel-${partnerId}`)) return;

  const script = document.createElement("script");
  script.id = `li-pixel-${partnerId}`;
  script.innerHTML = `
    _linkedin_partner_id = "${partnerId}";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(_linkedin_partner_id);
    (function(l) {
      if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
      window.lintrk.q=[]}
      var s = document.getElementsByTagName("script")[0];
      var b = document.createElement("script");
      b.type = "text/javascript";b.async = true;
      b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
      s.parentNode.insertBefore(b, s);})(window.lintrk);
  `;
  document.head.appendChild(script);

  // Add noscript fallback
  const noscript = document.createElement("noscript");
  const img = document.createElement("img");
  img.height = 1;
  img.width = 1;
  img.style.display = "none";
  img.alt = "";
  img.src = `https://px.ads.linkedin.com/collect/?pid=${partnerId}&fmt=gif`;
  noscript.appendChild(img);
  document.body.appendChild(noscript);
};

// Twitter Pixel
const injectTwitterPixel = (pixelId: string) => {
  if (typeof window === "undefined" || (window as any).twq) return;

  const script = document.createElement("script");
  script.id = `tw-pixel-${pixelId}`;
  script.innerHTML = `
    !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
    },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
    a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
    twq('config','${pixelId}');
  `;
  document.head.appendChild(script);
};

export default TrackingPixels;
