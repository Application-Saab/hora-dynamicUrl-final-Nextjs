import { reportError } from "./errorReporter";

export const safeGetItem = (key) => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`localStorage.getItem("${key}") blocked:`, error);
    reportError(
      error,
      {},
      {
        type: "frontend",
        component: "localStorage",
        payload: { operation: "getItem", key },
      },
    );
    return null;
  }
};

export const safeSetItem = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    reportError(
      error,
      {},
      {
        type: "frontend",
        component: "localStorage",
        payload: { operation: "setItem", key },
      },
    );
    console.warn(`localStorage.setItem("${key}") blocked:`, error);
  }
};

export const safeGetSessionItem = (key) => {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    reportError(
      error,
      {},
      {
        type: "frontend",
        component: "sessionStorage",
        payload: { operation: "getItem", key },
      },
    );
    console.warn(`sessionStorage.getItem("${key}") blocked:`, error);
    return null;
  }
};

export const safeSetSessionItem = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    reportError(
      error,
      {},
      {
        type: "frontend",
        component: "sessionStorage",
        payload: { operation: "setItem", key },
      },
    );
    console.warn(`sessionStorage.setItem("${key}") blocked:`, error);
  }
};
