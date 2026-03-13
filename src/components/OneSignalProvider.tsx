import { useOneSignal } from "@/hooks/useOneSignal";
import SubscriberInfoPopup from "@/components/ui/SubscriberInfoPopup";

const OneSignalProvider = () => {
  // Initialize OneSignal on mount
  const { showSubscriberPopup, closeSubscriberPopup, playerId } = useOneSignal();
  
  return (
    <SubscriberInfoPopup
      isOpen={showSubscriberPopup}
      onClose={closeSubscriberPopup}
      playerId={playerId}
    />
  );
};

export default OneSignalProvider;
