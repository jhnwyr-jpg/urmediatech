import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const FacebookPixel = () => {
  const [pixelId, setPixelId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPixelId = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "facebook_pixel_id")
        .maybeSingle();

      if (!error && data?.value) {
        setPixelId(data.value);
      }
    };

    fetchPixelId();
  }, []);

  useEffect(() => {
    if (!pixelId) return;

    // Initialize Facebook Pixel
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

    return () => {
      // Cleanup on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (noscript.parentNode) {
        noscript.parentNode.removeChild(noscript);
      }
    };
  }, [pixelId]);

  return null;
};

export default FacebookPixel;
