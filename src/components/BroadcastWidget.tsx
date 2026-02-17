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

    return () => {
      // Cleanup when AdminLayout unmounts
      const existingScript = document.getElementById('urb-broadcast-script');
      if (existingScript) existingScript.remove();

      document.querySelectorAll('.urb-bell-btn, .urb-panel').forEach(el => el.remove());

      (window as any).__URB_INITIALIZED = false;

      if ((window as any).__URB_INTERVAL) {
        clearInterval((window as any).__URB_INTERVAL);
        (window as any).__URB_INTERVAL = null;
      }
    };
  }, []);

  return null;
};

export default BroadcastWidget;
