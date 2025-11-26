export function dateFormatter(dateString, caseNo) {
  if (!dateString) return "";

  const formatCase = String(caseNo);
  const date = new Date(dateString);

  switch (formatCase) {
    case "1":
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    case "2":
      return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    case "3":
      return date.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

    case "4": {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }

    case "5":
      return date.toLocaleDateString("en-GB", { month: "long", day: "numeric" });

    case "6":
    case "7": {
      const dateObject = {
        day: String(date.getDate()).padStart(2, "0"),
        month:
          formatCase === "6"
            ? date.toLocaleDateString("en-GB", { month: "long" })
            : date.toLocaleDateString("en-GB", { month: "short" }),
        year: date.getFullYear(),
      };
      return dateObject;
    }

    default:
      return "";
  }
}

export function timeFormatter(timeString, caseNo) {
  return timeString;
}

