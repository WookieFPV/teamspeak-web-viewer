import { useEffect, useState } from "react";

const BACKGROUND_REFETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const FOREGROUND_REFETCH_INTERVAL = 5 * 1000; // 5 seconds

export const useRefetchInterval = (): number => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => setIsOnline(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isOnline ? FOREGROUND_REFETCH_INTERVAL : BACKGROUND_REFETCH_INTERVAL;
};
