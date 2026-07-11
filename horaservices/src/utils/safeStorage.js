export const safeGetItem = (key) => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`localStorage.getItem("${key}") blocked:`, error);
    return null;
  }
};

export const safeSetItem = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`localStorage.setItem("${key}") blocked:`, error);
  }
};

export const safeGetSessionItem = (key) => {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    console.warn(`sessionStorage.getItem("${key}") blocked:`, error);
    return null;
  }
};

export const safeSetSessionItem = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    console.warn(`sessionStorage.setItem("${key}") blocked:`, error);
  }
};
