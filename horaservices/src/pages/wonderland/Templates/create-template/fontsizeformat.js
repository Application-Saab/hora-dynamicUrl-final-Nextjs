// applyCase() → text formatting helper
// --------------------------------------
// INPUT  text:     "lakshya jain from bhanpura"
// CASES / EXAMPLES
//
// "uppercase" / "upper"
//   → "LAKSHYA JAIN FROM BHANPURA"
//
// "lowercase" / "lower"
//   → "lakshya jain from bhanpura"
//
// "capitalize"
//   → "Lakshya jain from bhanpura"
//
// "titlecase" / "title"
//   → "Lakshya Jain From Bhanpura"
//
// "sentence"
//   → "Lakshya jain from bhanpura"
//
// DEFAULT → same text return

export function applyCase(text, type) {
  if (!text || typeof text !== "string") return "";

  switch (String(type).toLowerCase()) {

    // ALL UPPERCASE
    case "uppercase":
    case "upper":
      return text.toUpperCase();

    // all lowercase
    case "lowercase":
    case "lower":
      return text.toLowerCase();

    // First letter only capital
    case "capitalize": 
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

    // Every Word Capital
    case "titlecase":
    case "title":
      return text
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");

    // Sentence Case
    case "sentence":
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

    default:
      return text;
  }
}
