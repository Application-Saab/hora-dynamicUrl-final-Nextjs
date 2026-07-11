import { safeGetItem, safeSetItem } from "./safeStorage";

export function getVisitorId() {
  let id = safeGetItem("VISITOR_ID");
  if (!id) {
    id = crypto.randomUUID();
    safeSetItem("VISITOR_ID", id);
  }
  return id;
}

export function getDeviceInfo() {
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /android|iphone|ipad|ipod/.test(ua);

  let os = "unknown";
  if (/android/.test(ua)) os = "android";
  else if (/iphone|ipad|ipod/.test(ua)) os = "ios";
  else if (/windows/.test(ua)) os = "windows";
  else if (/mac/.test(ua)) os = "mac";

  return {
    device: isMobile ? "mobile" : "desktop",
    os,
  };
}

export function getBrowserInfo() {
  const ua = navigator.userAgent;

  let browser = "unknown";

  if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/opr|opera/i.test(ua)) browser = "Opera";

  return browser;
}