import { useOneSignal } from "@/hooks/useOneSignal";

const OneSignalProvider = () => {
  // Initialize OneSignal on mount
  useOneSignal();
  
  return null; // This component only handles initialization
};

export default OneSignalProvider;
