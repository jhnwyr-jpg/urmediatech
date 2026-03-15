import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const contentKeys = [
  "promo_badge_bn", "promo_badge_en",
  "promo_title_bn", "promo_title_en",
  "promo_price_bn", "promo_price_en",
  "promo_description_bn", "promo_description_en",
  "promo_highlights_bn", "promo_highlights_en",
  "promo_cta_bn", "promo_cta_en",
  "website_title_bn", "website_title_en",
  "website_price_bn", "website_price_en",
  "website_description_bn", "website_description_en",
  "website_features_bn", "website_features_en",
  "website_cta_bn", "website_cta_en",
];

export const useSiteContent = () => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", contentKeys);

      if (data) {
        const map: Record<string, string> = {};
        data.forEach((item) => {
          if (item.value) map[item.key] = item.value;
        });
        setContent(map);
      }
      setIsLoaded(true);
    };
    fetch();
  }, []);

  const get = (key: string, fallback: string) => content[key] || fallback;

  return { content, get, isLoaded };
};
