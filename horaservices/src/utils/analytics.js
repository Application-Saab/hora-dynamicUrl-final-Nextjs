// src/utils/analytics.js

export function getVisitorId() {
  let id = localStorage.getItem("VISITOR_ID");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("VISITOR_ID", id);
  }
  return id;
}

export function getDeviceInfo() {
  const ua = navigator.userAgent.toLowerCase();

  if (/android/.test(ua)) return { device: "mobile", os: "android" };
  if (/iphone|ipad|ipod/.test(ua)) return { device: "mobile", os: "ios" };

  return { device: "desktop", os: "desktop" };
}

export function trackDailyUniqueVisit() {
  console.log('visiti')
  const today = new Date().toISOString().slice(0, 10);
  const visitorId = getVisitorId();
  const { os } = getDeviceInfo();

  const raw = localStorage.getItem("DAILY_UNIQUE_VISITORS");
  let data = raw ? JSON.parse(raw) : {};

  // 🔒 normalize day object
  if (typeof data[today] !== "object" || data[today] === null) {
    data[today] = {};
  }

  // 🔒 normalize OS buckets
  if (!data[today].android) data[today].android = {};
  if (!data[today].ios) data[today].ios = {};
  if (!data[today].desktop) data[today].desktop = {};

  // 🔒 count unique visitor
  if (!data[today][os][visitorId]) {
    data[today][os][visitorId] = true;
  }

  localStorage.setItem(
    "DAILY_UNIQUE_VISITORS",
    JSON.stringify(data)
  );
}
