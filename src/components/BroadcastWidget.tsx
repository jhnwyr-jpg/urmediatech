import { useEffect } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const BroadcastWidget = () => {
  useEffect(() => {
    if (!SUPABASE_URL) return;

    // Prevent duplicate script loading
    if (document.getElementById('urb-broadcast-script')) return;

    const script = document.createElement("script");
    script.id = 'urb-broadcast-script';
    script.src = `${window.location.origin}/broadcast-widget.js`;
    script.setAttribute(
      "data-endpoint",
      `${SUPABASE_URL}/functions/v1/broadcast-notifications`
    );
    script.async = true;
    document.body.appendChild(script);

    // No cleanup - widget should persist across navigations
    // The script itself handles duplicate prevention via window.__URB_INITIALIZED
  }, []);

  return null;
};

export default BroadcastWidget;