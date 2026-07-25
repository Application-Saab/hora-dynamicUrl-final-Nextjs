// import { getVisitorId, getDeviceInfo, getBrowserInfo } from "@/utils/analytics";
// import { safeGetItem } from "@/utils/safeStorage";
// import { BASE_URL, SAVE_ERROR_LOGS } from "./apiconstants";

// export const reportError = async (error, errorInfo = {}, context = {}) => {
//   try {
//     const visitorId = getVisitorId();
//     const { device, os } = getDeviceInfo();
//     const browser = getBrowserInfo();
//     const userId = safeGetItem("userID") || null;
//     const currentUrl = typeof window !== "undefined" ? window.location.href : "";

//     const payload = {
//       type: context.type || 'frontend',
//       message: error?.message || 'Unknown error',
//       stack: error?.stack,
//       component: context.component || errorInfo.componentStack,
//       url: currentUrl,
//       userId,
//       visitorId,
//       browser,
//       device: `${device} ${os}`,
//       payload: {
//         ...context.payload,
//         reactErrorInfo: errorInfo
//       },
//       statusCode: context.statusCode,
//       endpoint: context.endpoint,
//     };

//     await fetch(`${BASE_URL}${SAVE_ERROR_LOGS}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });
//   } catch (e) {
//     console.error('Failed to report error:', e);
//   }
// };

import { getVisitorId, getDeviceInfo, getBrowserInfo } from "@/utils/analytics";
import { safeGetItem } from "@/utils/safeStorage";
import { BASE_URL, SAVE_ERROR_LOGS } from "./apiconstants";
const BASE_ERROR_URL = `${BASE_URL}${SAVE_ERROR_LOGS}`;

const sendWithBeacon = (payload) => {
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    navigator.sendBeacon(BASE_ERROR_URL, blob);
    return true;
  }
  return false;
};

const sendWithFetch = async (payload) => {
  try {
    await fetch(BASE_ERROR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true, // Important for background send
    });
  } catch (e) {
    console.error("Fetch error reporting failed", e);
  }
};

const extractComponentName = (componentStack) => {
  if (!componentStack) return "UnknownComponent";

  const lines = componentStack.split("\n");
  for (let line of lines) {
    const match = line.match(/at (\w+)/);
    if (
      match &&
      match[1] &&
      ![
        "ErrorBoundary",
        "renderWithHooks",
        "updateFunctionComponent",
        "beginWork",
        "performUnitOfWork",
      ].includes(match[1])
    ) {
      return match[1];
    }
  }
  return "UnknownComponent";
};

const extractPageFromStack = (componentStack, url) => {
  if (componentStack) {
    const pageMatch =
      componentStack.match(/pages\/([^:\s]+)/) ||
      componentStack.match(/src\/pages\/([^:\s]+)/);
    if (pageMatch && pageMatch[1]) return pageMatch[1].replace(/\\/g, "/");
  }
  if (url) return url.replace(/^https?:\/\/[^/]+/, "") || "Unknown";
  return "Unknown";
};

export const reportError = async (error, errorInfo = {}, context = {}) => {
  try {
    const visitorId = getVisitorId();
    const { device, os } = getDeviceInfo();
    const browser = getBrowserInfo();
    const userId = safeGetItem("userID") || null;
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";

    const componentName =
      context.component ||
      extractComponentName(errorInfo?.componentStack) ||
      "UnknownComponent";

    const pagePath = extractPageFromStack(
      errorInfo?.componentStack,
      currentUrl,
    );

    const payload = {
      type: context.type || "frontend",
      message: error?.message || "Unknown error",
      stack: error?.stack?.substring(0, 2000),
      component: componentName,
      page: pagePath,
      url: currentUrl,
      userId,
      visitorId,
      browser,
      device: `${device} ${os}`,
      payload: {
        reactErrorInfo: errorInfo,
        ...context.payload,
      },
      statusCode: context.statusCode,
      endpoint: context.endpoint,
    };

    // await fetch(`${BASE_URL}${SAVE_ERROR_LOGS}`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // Try Beacon first (best for unload/crash)
    const beaconSent = sendWithBeacon(payload);

    // If beacon failed or we have time, also try fetch
    if (!beaconSent) {
      await sendWithFetch(payload);
    }
  } catch (e) {
    console.error("Failed to report error:", e);
  }
};

// Global Error Handlers
export const setupGlobalErrorHandlers = () => {
  if (typeof window === "undefined") return;

  // Catch all uncaught JS errors
  window.onerror = (message, source, lineno, colno, error) => {
    reportError(
      error || new Error(message),
      {},
      {
        type: "frontend",
        component: "GlobalWindowError",
        page: window.location.pathname,
        payload: { source, lineno, colno },
      },
    );
    return false;
  };

  // Catch unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    reportError(
      event.reason,
      {},
      {
        type: "frontend",
        component: "UnhandledPromiseRejection",
        page: window.location.pathname,
      },
    );
  });
};

export const startMemoryMonitoring = () => {
  if (typeof window === "undefined" || !performance?.memory) return;

  let lastReported = Date.now();

  const monitor = setInterval(() => {
    try {
      const mem = performance.memory;
      const usedMB = Math.round(mem.usedJSHeapSize / 1024 / 1024);
      const limitMB = Math.round(mem.jsHeapSizeLimit / 1024 / 1024);
      const percent = Math.round((usedMB / limitMB) * 100);

      if (percent > 65 && Date.now() - lastReported > 25000) {
        reportError(
          new Error(
            `High Memory Usage: ${usedMB}MB/${limitMB}MB (${percent}%)`,
          ),
          {},
          {
            type: "performance",
            component: "MemoryMonitor",
            payload: {
              usedJSHeapSize: mem.usedJSHeapSize,
              jsHeapSizeLimit: mem.jsHeapSizeLimit,
              percentUsed: percent,
              isCritical: percent > 85,
            },
          },
        );
        lastReported = Date.now();
      }
    } catch (e) {
      clearInterval(monitor);
    }
  }, 8000); // Check every 8 seconds

  // Before unload / memory critical
  const handleBeforeUnload = () => {
    const mem = performance?.memory;
    if (mem) {
      const payload = {
        type: "performance",
        message: "Page unload with high memory",
        component: "BeforeUnload",
        payload: {
          usedJSHeapSize: mem.usedJSHeapSize,
          percentUsed: Math.round(
            (mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100,
          ),
        },
      };
      sendWithBeacon(payload); // direct beacon
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("pagehide", handleBeforeUnload); // iOS Safari ke liye better

  return () => clearInterval(monitor);
};
