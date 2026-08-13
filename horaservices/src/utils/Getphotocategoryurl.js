const folderToSubCategory = {
  "Wedding":                    "Wedding-Photography",
  "maternity poses":            "Maternity-Photography",
  "Candid":                     "Birthday-Photography",
  "pre wedding":                "Engagement-Photography",
  "HaldiandMehendi":            "Wedding-Photography",
  "baby shower":                "Baby-Shower-Photography",
  "naming ceremony weblink":    "Naming-ceremony-Photography",
  "new born ":                  "New-Born-Baby-Photography",
  "engagement weblink":         "Engagement-Photography",
  "anniversary poses web link": "Anniversary-Photography",
  "House warming weblink":      "House-warming-Photography",
  "bacherrolerate":             "Bachelorette-Photography",
};

// ✅ folderName pass karo — photography page ka URL milega
export const getPhotoCategoryUrl = (folderName) => {
  const subCategory = folderToSubCategory[folderName];
  if (!subCategory) return "/photography"; // fallback
  return `/photography-page/${subCategory}`;
};