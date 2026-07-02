"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cms } from "../lib/cms";

export default function VisitorTracker() {
  const pathname = usePathname();
  const visitorIdRef = useRef(null);

  async function trackPageview(visitorId) {
    try {
      const deviceInfo = typeof navigator !== "undefined" ? navigator.userAgent : "Unknown";
      const trafficSource = typeof document !== "undefined" ? document.referrer : "";
      
      await cms.pingVisitor({
        visitorId,
        pageViewed: pathname || "/",
        deviceInfo,
        trafficSource,
        location: "Local Session",
      });
    } catch (err) {
      console.error("Failed to track visitor pageview:", err);
    }
  }

  useEffect(() => {
    let visitorId = localStorage.getItem("visitor_id");
    if (!visitorId) {
      visitorId = `visitor_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem("visitor_id", visitorId);
    }
    visitorIdRef.current = visitorId;

    // Track initial page load immediately once visitorId is set
    trackPageview(visitorId);
  }, []);

  // Track pageview on route/pathname change
  useEffect(() => {
    if (visitorIdRef.current) {
      trackPageview(visitorIdRef.current);
    }
  }, [pathname]);

  return null;
}
