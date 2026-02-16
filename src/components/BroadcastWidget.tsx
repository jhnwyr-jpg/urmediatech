import { useEffect } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const BroadcastWidget = () => {
  useEffect(() => {
    if (!SUPABASE_URL) return;

    const script = document.createElement("script");
    script.src = `${window.location.origin}/broadcast-widget.js`;
    script.setAttribute(
      "data-endpoint",
      `${SUPABASE_URL}/functions/v1/broadcast-notifications`
    );
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
      // Clean up widget elements
      document.querySelectorAll(".urb-bell-btn, .urb-panel").forEach((el) => el.remove());
    };
  }, []);

  return null;
};

export default BroadcastWidget;
