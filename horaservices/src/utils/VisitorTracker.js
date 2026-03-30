"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getVisitorId, getDeviceInfo  , getBrowserInfo} from "./analytics";

export default function VisitorTracker() {

  const pathname = usePathname();

  useEffect(() => {

    const visitorId = getVisitorId();
    const { device, os } = getDeviceInfo();
    const browser = getBrowserInfo();

    const payload = {
      visitorId,
      device,
      os,
      browser,
      page: pathname,
    };

    console.log("Tracking visit:", payload);

    fetch("http://localhost:5000/api/analytics/track-daily-visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch(err => console.log("Tracking error:", err));

  }, [pathname]);

  return null;
}