"use client";

import { useEffect, useRef } from "react";
import HomeContent from "@/components/HomeContent";
import { reportError } from "@/utils/errorReporter";

export default function NotFound() {
  const reported = useRef(false);

  useEffect(() => {
    if (reported.current) return;
    reported.current = true;

    const error = new Error("404 - Page Not Found");

    reportError(error, null, {
      type: "frontend",
      component: "NotFoundPage",
      extra: {
        path: window.location.pathname,
        fullUrl: window.location.href,
        referrer: document.referrer,
        isNotFound: true,
      },
    });
  }, []);

  return <HomeContent isNotFound={true} />;
}