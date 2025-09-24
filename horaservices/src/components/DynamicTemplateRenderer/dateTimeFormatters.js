export function dateFormatter(dateString, caseNo) {
  if (!dateString) return "";

  if (caseNo === 1 || caseNo === "1") {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    // Output: "December 31, 2023"
  }

  if (caseNo === 2 || caseNo === "2") {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    // Output: "31 December 2023"
  }

  if (caseNo === 3 || caseNo === "3") {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
    });
    // Output: "31 December"
  }

  if (caseNo === 4 || caseNo === "4") {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
    // Output: "02.05.2030"
  }

  if (caseNo === 5 || caseNo === "5") {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      month: "long",
      day: "numeric",
    });
    // Output: "December 31"
  }

  if (caseNo === 6 || caseNo === "6") {
    if (!dateString) return "";
    const date = new Date(dateString);
    let dateObject = {
      day: "",
      month: "",
    };
    let day = String(date.getDate()).padStart(2, "0");
    let month = date.toLocaleDateString("en-GB", {
      month: "long",
    });
    dateObject.day = day;
    dateObject.month = month;
    return dateObject;
    // Output: {day: "31", month: "12"}
    // return date.toLocaleDateString("en-GB", {
    //   month: "long",
    //   day: "numeric",
    // });
    // Output: {day: "31", month: "December"}
  }
}

export function timeFormatter(timeString, caseNo) {
  switch (caseNo) {
    case "1":
      break;

    default:
      break;
  }
}
