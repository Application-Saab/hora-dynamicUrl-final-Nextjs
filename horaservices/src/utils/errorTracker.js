export function sendError() {
  console.log("1111");

  const url =
    typeof window !== "undefined"
      ? window.location.pathname
      : "server";

  fetch("http://localhost:5000/api/error-logs/track-error", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });
}