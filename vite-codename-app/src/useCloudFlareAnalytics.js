import { useCallback } from "react";

export function useCloudflareAnalytics() {
  const trackEvent = useCallback((eventName, data) => {
    const consent = localStorage.getItem("consent");
    if (consent !== "true") return;

    if (!window._cfq) {
      window._cfq = [];
    }

    window._cfq.push([
      "trackEvent",
      {
        name: eventName,
        ...data,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  return { trackEvent };
}