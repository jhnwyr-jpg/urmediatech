import { useEffect, useState } from "react";

// Replace with your OneSignal App ID when ready
const ONESIGNAL_APP_ID = "YOUR_ONESIGNAL_APP_ID";

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
    // Skip if no valid App ID or already initialized
    if (ONESIGNAL_APP_ID === "YOUR_ONESIGNAL_APP_ID") {
      console.log("OneSignal: App ID not configured yet");
      return;
    }

    // Initialize OneSignal
    const initOneSignal = async () => {
      try {
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
            appId: ONESIGNAL_APP_ID,
            safari_web_id: undefined, // Add Safari Web ID if needed
            notifyButton: {
              enable: false, // We'll use native prompt instead
            },
            allowLocalhostAsSecureOrigin: true, // For development
            promptOptions: {
              slidedown: {
                prompts: [
                  {
                    type: "push",
                    autoPrompt: true,
                    text: {
                      actionMessage: "Get notified about our latest updates and offers!",
                      acceptButton: "Allow",
                      cancelButton: "Maybe Later",
                    },
                    delay: {
                      pageViews: 1,
                      timeDelay: 3, // Show after 3 seconds
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
      // Cleanup if needed
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

  // Set external user ID for targeting (useful for logged-in users)
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
