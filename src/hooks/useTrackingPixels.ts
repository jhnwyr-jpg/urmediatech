import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TrackingPixel {
  id: string;
  pixel_type: string;
  pixel_id: string;
  is_enabled: boolean;
  enabled_on_home: boolean;
  enabled_on_product: boolean;
  enabled_on_contact: boolean;
  enabled_on_checkout: boolean;
}

type PageType = "home" | "product" | "contact" | "checkout";

export const useTrackingPixels = (currentPage: PageType) => {
  const [pixels, setPixels] = useState<TrackingPixel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPixels = async () => {
      try {
        const { data, error } = await supabase
          .from("tracking_pixels")
          .select("*")
          .eq("is_enabled", true);

        if (error) throw error;

        // Filter pixels based on current page
        const pageKeyMap: Record<PageType, keyof TrackingPixel> = {
          home: "enabled_on_home",
          product: "enabled_on_product",
          contact: "enabled_on_contact",
          checkout: "enabled_on_checkout",
        };

        const pageKey = pageKeyMap[currentPage];
        const filteredPixels = (data || []).filter((pixel) => pixel[pageKey]);
        setPixels(filteredPixels);
      } catch (error) {
        console.error("Error fetching tracking pixels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPixels();
  }, [currentPage]);

  return { pixels, isLoading };
};
