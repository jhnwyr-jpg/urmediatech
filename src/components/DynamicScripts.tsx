import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MarketingScript {
  id: string;
  script_name: string;
  script_type: "header" | "footer";
  script_content: string;
  is_enabled: boolean;
}

interface ConversionSetting {
  platform: string;
  pixel_id: string | null;
  access_token: string | null;
  conversion_id: string | null;
  conversion_label: string | null;
  is_enabled: boolean;
}

// Track UTM parameters
const trackUtmVisit = async () => {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const utmCampaign = params.get("utm_campaign");
  const utmTerm = params.get("utm_term");
  const utmContent = params.get("utm_content");

  // Only track if there are UTM parameters
  if (utmSource || utmMedium || utmCampaign) {
    const sessionId = sessionStorage.getItem("utm_session_id") || crypto.randomUUID();
    sessionStorage.setItem("utm_session_id", sessionId);

    try {
      await supabase.from("utm_visits").insert({
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_term: utmTerm,
        utm_content: utmContent,
        page_path: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        session_id: sessionId,
      });
    } catch (error) {
      console.error("Error tracking UTM visit:", error);
    }
  }
};

// Initialize conversion pixels
const initializePixels = (settings: ConversionSetting[]) => {
  settings.forEach((setting) => {
    if (!setting.is_enabled || !setting.pixel_id) return;

    switch (setting.platform) {
      case "meta":
        if (!(window as any).fbq) {
          const script = document.createElement("script");
          script.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${setting.pixel_id}');
            fbq('track', 'PageView');
          `;
          document.head.appendChild(script);
        }
        break;

      case "google_ads":
        if (setting.conversion_id && !document.getElementById("gads-script")) {
          const script1 = document.createElement("script");
          script1.id = "gads-script";
          script1.async = true;
          script1.src = `https://www.googletagmanager.com/gtag/js?id=${setting.conversion_id}`;
          document.head.appendChild(script1);

          const script2 = document.createElement("script");
          script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${setting.conversion_id}');
          `;
          document.head.appendChild(script2);
        }
        break;

      case "tiktok":
        if (!(window as any).ttq) {
          const script = document.createElement("script");
          script.innerHTML = `
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${setting.pixel_id}');
              ttq.page();
            }(window, document, 'ttq');
          `;
          document.head.appendChild(script);
        }
        break;
    }
  });
};

const DynamicScripts = () => {
  const injectedScripts = useRef<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    const loadScriptsAndPixels = async () => {
      try {
        // Track UTM visit
        trackUtmVisit();

        // Fetch marketing scripts
        const { data: scripts } = await supabase
          .from("marketing_scripts")
          .select("*")
          .eq("is_enabled", true);

        // Inject custom scripts
        (scripts as MarketingScript[] | null)?.forEach((script) => {
          if (injectedScripts.current.has(script.id)) return;

          const container = script.script_type === "header" ? document.head : document.body;
          const wrapper = document.createElement("div");
          wrapper.innerHTML = script.script_content;
          
          // Extract and execute scripts
          const scriptElements = wrapper.querySelectorAll("script");
          scriptElements.forEach((oldScript) => {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes).forEach((attr) => {
              newScript.setAttribute(attr.name, attr.value);
            });
            newScript.innerHTML = oldScript.innerHTML;
            container.appendChild(newScript);
          });

          // Append non-script elements
          wrapper.querySelectorAll(":not(script)").forEach((el) => {
            container.appendChild(el.cloneNode(true));
          });

          injectedScripts.current.add(script.id);
        });

        // Fetch and initialize conversion pixels
        const { data: conversionSettings } = await supabase
          .from("conversion_settings")
          .select("*");

        if (conversionSettings) {
          initializePixels(conversionSettings as ConversionSetting[]);
        }

        setInitialized(true);
      } catch (error) {
        console.error("Error loading dynamic scripts:", error);
      }
    };

    loadScriptsAndPixels();
  }, [initialized]);

  return null;
};

// Export utility function to track conversion events
export const trackConversionEvent = async (
  eventType: "PageView" | "Lead" | "Purchase" | "AddToCart" | "InitiateCheckout" | "Contact" | "ButtonClick",
  value?: number,
  contentName?: string,
  metadata?: Record<string, any>
) => {
  try {
    // Get UTM session
    const sessionId = sessionStorage.getItem("utm_session_id");
    
    // Get UTM visit ID if exists
    let utmVisitId = null;
    if (sessionId) {
      const { data } = await supabase
        .from("utm_visits")
        .select("id")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      utmVisitId = data?.id || null;

      // Mark as converted if it's a Purchase or Lead
      if (utmVisitId && (eventType === "Purchase" || eventType === "Lead")) {
        await supabase
          .from("utm_visits")
          .update({ converted: true, conversion_value: value })
          .eq("id", utmVisitId);
      }
    }

    // Record conversion event
    await supabase.from("conversion_events").insert({
      event_type: eventType,
      event_value: value || null,
      content_name: contentName || null,
      utm_visit_id: utmVisitId,
      metadata: metadata || null,
    });

    // Fire browser pixel events
    if ((window as any).fbq) {
      (window as any).fbq("track", eventType, {
        value: value,
        currency: "BDT",
        content_name: contentName,
      });
    }

    if ((window as any).gtag && eventType === "Purchase") {
      (window as any).gtag("event", "conversion", {
        send_to: "AW-CONVERSION_ID/CONVERSION_LABEL", // Will be replaced dynamically
        value: value,
        currency: "BDT",
      });
    }

    if ((window as any).ttq) {
      (window as any).ttq.track(eventType, {
        value: value,
        currency: "BDT",
        content_name: contentName,
      });
    }

    // Push to dataLayer for GTM
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: eventType.toLowerCase(),
      value: value,
      currency: "BDT",
      content_name: contentName,
      ...metadata,
    });
  } catch (error) {
    console.error("Error tracking conversion event:", error);
  }
};

export default DynamicScripts;
