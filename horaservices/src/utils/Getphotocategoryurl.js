const folderToSubCategory = {
  "Wedding":                    "wedding-photography",
  "maternity poses":            "maternity-photography",
  "Candid":                     "birthday-photography",
  "pre wedding":                "engagement-photography",
  "HaldiandMehendi":            "wedding-photography",
  "baby shower":                "baby-shower-photography",
  "naming ceremony weblink":    "naming-ceremony-photography",
  "new born ":                  "new-born-baby-photography",
  "engagement weblink":         "engagement-photography",
  "anniversary poses web link": "anniversary-photography",
  "House warming weblink":      "house-warming-photography",
  "bacherrolerate":             "bachelorette-photography",
};

const getSubCategory = (folderName) => {
  if (!folderName || typeof folderName !== "string") return null;
  return folderToSubCategory[folderName.trim()] || null;
};

// true  -> is folder ka apna category page hai
// false -> nahi hai (Welcome Baby, Corporate etc.) -> WhatsApp par bhejna hai
export const hasWeblinkCategory = (folderName) => !!getSubCategory(folderName);

export const getWeblinkPhotosUrl = (folderName) => {
  const subCategory = getSubCategory(folderName);
  if (!subCategory) return "/photography-page"; // fallback (baaki jagah ke liye as it is)
  return `/photography-page/${subCategory}`;
};