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

const extractComponentName = (componentStack) => {
  if (!componentStack) return "UnknownComponent";

  const lines = componentStack.split("\n");

  // Find the first component that caused the error (topmost in user code)
  for (let line of lines) {
    const match = line.match(/at (\w+)/); // e.g., "at Decoration"
    if (match && match[1] && 
        !["ErrorBoundary", "renderWithHooks", "updateFunctionComponent", "beginWork"].includes(match[1])) {
      return match[1];
    }
  }

  return "UnknownComponent";
};

const extractPageFromStack = (componentStack, url) => {
  if (!componentStack) return url || "Unknown";

  const pageMatch = componentStack.match(/pages\/([^:\s]+)/) || 
                    componentStack.match(/src\/pages\/([^:\s]+)/);
  
  if (pageMatch && pageMatch[1]) {
    return pageMatch[1].replace(/\\/g, '/');
  }

  // Fallback: extract from URL
  if (url) {
    const path = url.replace(/^https?:\/\/[^/]+/, "");
    return path || "Unknown";
  }

  return "Unknown";
};

export const reportError = async (error, errorInfo = {}, context = {}) => {
  try {
    const visitorId = getVisitorId();
    const { device, os } = getDeviceInfo();
    const browser = getBrowserInfo();
    const userId = safeGetItem("userID") || null;
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";

    const componentName = context.component || 
                         extractComponentName(errorInfo?.componentStack) || 
                         "UnknownComponent";

    const pagePath = extractPageFromStack(errorInfo?.componentStack, currentUrl);

    const payload = {
      type: context.type || 'frontend',
      message: error?.message || 'Unknown error',
      stack: error?.stack?.substring(0, 2000), // Limit size
      component: componentName,
      page: pagePath,                    // ← New field: better page info
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

    await fetch(`${BASE_URL}${SAVE_ERROR_LOGS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error('Failed to report error to backend:', e);
  }
};