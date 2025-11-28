// Convert current system time to 12h format → "hh:mm AM/PM"
export function getCurrentTimeAMPM() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
}

// Convert any "HH:mm" or "hh:mmam/pm" to "hh:mm AM/PM"
export function formatToAMPM(timeString) {
  if (!timeString) return "";

  if (/am|pm/i.test(timeString)) {
    const [time, ampm] = timeString.split(/(am|pm)/i);
    let [h, m] = time.trim().split(":");
    h = parseInt(h, 10) % 12 || 12;
    return `${String(h).padStart(2, "0")}:${m} ${ampm.toUpperCase()}`;
  }

  const [hour, minute] = timeString.split(":");
  let h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${minute} ${ampm}`;
}
