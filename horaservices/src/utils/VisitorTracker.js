"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getVisitorId, getDeviceInfo  , getBrowserInfo} from "./analytics";
import { BASE_URL, VISITOR_TRACKING } from "./apiconstants";
import { fetchWithError } from "./fetchWithError";

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

    fetchWithError(`${BASE_URL}${VISITOR_TRACKING}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch(err => console.log("Tracking error:", err));

  }, [pathname]);

  return null;
}