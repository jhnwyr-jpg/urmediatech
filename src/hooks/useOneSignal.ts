import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import "@/styles/onesignal-custom.css";

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => void>;
    OneSignal?: any;
  }
}

export const useOneSignal = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const initOneSignal = async () => {
      try {
        // Fetch App ID from edge function
        const { data } = await supabase.functions.invoke('get-onesignal-config');
        const appId = data?.appId;
        const safariWebId = data?.safariWebId;

        if (!appId) {
          console.log("OneSignal: App ID not configured yet");
          return;
        }

        window.OneSignalDeferred = window.OneSignalDeferred || [];
        
        // Load OneSignal SDK
        if (!document.getElementById("onesignal-sdk")) {
          const script = document.createElement("script");
          script.id = "onesignal-sdk";
          script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
          script.defer = true;
          document.head.appendChild(script);
        }

        window.OneSignalDeferred.push(async (OneSignal: any) => {
          await OneSignal.init({
            appId: appId,
            safari_web_id: safariWebId || undefined,
            notifyButton: {
              enable: false,
            },
            allowLocalhostAsSecureOrigin: true,
            promptOptions: {
              slidedown: {
                prompts: [
                  {
                    type: "push",
                    autoPrompt: true,
                    text: {
                      actionMessage: "🔔 আমাদের latest updates এবং offers পেতে notifications চালু করুন!",
                      acceptButton: "✨ Allow",
                      cancelButton: "পরে",
                    },
                    delay: {
                      pageViews: 1,
                      timeDelay: 3,
                    },
                  },
                ],
              },
            },
          });

          setIsInitialized(true);

          // Check subscription status
          const isPushSupported = OneSignal.Notifications.isPushSupported();
          if (isPushSupported) {
            const permission = await OneSignal.Notifications.permission;
            setIsSubscribed(permission);

            // Listen for subscription changes
            OneSignal.Notifications.addEventListener("permissionChange", (granted: boolean) => {
              setIsSubscribed(granted);
              console.log("OneSignal: Permission changed to", granted);
            });
          }

          console.log("OneSignal: Initialized successfully");
        });
      } catch (error) {
        console.error("OneSignal: Initialization failed", error);
      }
    };

    initOneSignal();

    return () => {
      if (window.OneSignal) {
        window.OneSignal.Notifications?.removeEventListener?.("permissionChange");
      }
    };
  }, []);

  // Manual prompt trigger function
  const showPrompt = async () => {
    if (window.OneSignal && isInitialized) {
      try {
        await window.OneSignal.Slidedown.promptPush();
      } catch (error) {
        console.error("OneSignal: Failed to show prompt", error);
      }
    }
  };

  // Set external user ID for targeting
  const setExternalUserId = async (userId: string) => {
    if (window.OneSignal && isInitialized) {
      try {
        await window.OneSignal.login(userId);
        console.log("OneSignal: External user ID set", userId);
      } catch (error) {
        console.error("OneSignal: Failed to set external user ID", error);
      }
    }
  };

  // Add tags for user segmentation
  const addTags = async (tags: Record<string, string>) => {
    if (window.OneSignal && isInitialized) {
      try {
        await window.OneSignal.User.addTags(tags);
        console.log("OneSignal: Tags added", tags);
      } catch (error) {
        console.error("OneSignal: Failed to add tags", error);
      }
    }
  };

  return {
    isInitialized,
    isSubscribed,
    showPrompt,
    setExternalUserId,
    addTags,
  };
};
