import { useEffect, useState, useCallback } from "react";
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
  const [showSubscriberPopup, setShowSubscriberPopup] = useState(false);
  const [playerId, setPlayerId] = useState<string | undefined>();

  // Check if we should show the popup
  const shouldShowPopup = useCallback(() => {
    const alreadySubmitted = localStorage.getItem("subscriber_info_submitted");
    const skipped = localStorage.getItem("subscriber_popup_skipped");
    const lastSkipTime = localStorage.getItem("subscriber_popup_skip_time");
    
    // If already submitted, never show again
    if (alreadySubmitted === "true") return false;
    
    // If skipped, check if 7 days have passed
    if (skipped === "true" && lastSkipTime) {
      const daysSinceSkip = (Date.now() - parseInt(lastSkipTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceSkip < 7) return false;
    }
    
    return true;
  }, []);

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

            // Get player ID if subscribed
            if (permission) {
              try {
                const userId = await OneSignal.User.PushSubscription.id;
                setPlayerId(userId);
              } catch (e) {
                console.log("Could not get player ID");
              }
            }

            // Listen for subscription changes
            OneSignal.Notifications.addEventListener("permissionChange", async (granted: boolean) => {
              setIsSubscribed(granted);
              console.log("OneSignal: Permission changed to", granted);
              
              // When user just subscribed, show popup after 5 seconds
              if (granted && shouldShowPopup()) {
                try {
                  const userId = await OneSignal.User.PushSubscription.id;
                  setPlayerId(userId);
                } catch (e) {
                  console.log("Could not get player ID");
                }
                
                setTimeout(() => {
                  if (shouldShowPopup()) {
                    setShowSubscriberPopup(true);
                  }
                }, 5000); // 5 seconds delay after subscribing
              }
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
  }, [shouldShowPopup]);

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

  // Close the popup
  const closeSubscriberPopup = () => {
    setShowSubscriberPopup(false);
    localStorage.setItem("subscriber_popup_skip_time", Date.now().toString());
  };

  return {
    isInitialized,
    isSubscribed,
    showPrompt,
    setExternalUserId,
    addTags,
    showSubscriberPopup,
    closeSubscriberPopup,
    playerId,
  };
};
