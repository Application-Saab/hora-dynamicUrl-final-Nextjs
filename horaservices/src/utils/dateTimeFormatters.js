export function dateFormatter(dateString, caseNo) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const monthNum = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  switch (String(caseNo)) {
    // January 5, 2024
    case "1":
      return `${date.toLocaleDateString("en-US", {
        month: "long",
      })} ${day}, ${year}`;

    // 5 January 2024
    case "2":
      return `${day} ${date.toLocaleDateString("en-GB", { month: "long" })} ${year}`;

    // 5 January
    case "3":
      return `${day} ${date.toLocaleDateString("en-GB", { month: "long" })}`;

    // ✅ 05.12.2024 (NUMERIC MONTH)
   case "4":
      return {
        full: `${day}.${monthNum}.${year}`,
        day,
        month: monthNum,
        year,
      };


    // January 5
    case "5":
      return `${date.toLocaleDateString("en-GB", { month: "long" })} ${day}`;

    // 🔹 Object return (String month)
    case "6":
      return {
        day,
        month: date.toLocaleDateString("en-GB", { month: "long" }),
        year,
      };

    // 🔹 Object return (Short month)
    case "7":
      return {
        day,
        month: date.toLocaleDateString("en-GB", { month: "short" }),
        year,
      };

    default:
      return "";
  }
}

export function timeFormatter(timeString, caseNo) {
  return timeString;
}

