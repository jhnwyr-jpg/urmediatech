import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const BroadcastWidget = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (!SUPABASE_URL || !isAdmin) return;

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

    return () => {
      // Cleanup when leaving admin
      const existingScript = document.getElementById('urb-broadcast-script');
      if (existingScript) existingScript.remove();

      // Remove bell button and panel from DOM
      document.querySelectorAll('.urb-bell-btn, .urb-panel').forEach(el => el.remove());

      // Reset initialization flag so it can re-init when returning to admin
      (window as any).__URB_INITIALIZED = false;

      // Clear polling interval
      if ((window as any).__URB_INTERVAL) {
        clearInterval((window as any).__URB_INTERVAL);
        (window as any).__URB_INTERVAL = null;
      }
    };
  }, [isAdmin]);

  return null;
};

export default BroadcastWidget;
