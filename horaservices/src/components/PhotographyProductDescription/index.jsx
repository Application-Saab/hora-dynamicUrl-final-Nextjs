import styles from "./PhotographyProductDescription.module.css";

/**
 * Maps common inclusion keywords to plain-language explanations.
 * Each matched item gets a short explanatory line shown below the bullet.
 */
const INCLUSION_EXPLANATIONS = {
  "edited photo": "Professional colour correction and basic retouching applied to your best shots. Ready to print or share as-is.",
  "color correct": "Every photo gets a colour grade — white balance, exposure and contrast adjusted so the images look consistent and natural.",
  "colour correct": "Every photo gets a colour grade — white balance, exposure and contrast adjusted so the images look consistent and natural.",
  "web gallery": "Your photos are uploaded to a permanent, shareable web gallery — no drive links that expire, no files to download and organise.",
  "online gallery": "Delivered via a permanent online link. Access your gallery from any device, share it with family in any city.",
  "24 hours": "You receive your gallery within 24 hours of the shoot — before most people have even returned all the decoration pieces.",
  "camera man": "A dedicated video operator captures footage separately from the still photographer, so you get both without either one compromising.",
  "videographer": "A dedicated videographer creates a video record of your event alongside the still photographs.",
  "highlight reel": "A short edited video (typically 2–4 minutes) set to music, capturing the best moments of the event. Shareable immediately.",
  "reel": "A short vertical-format edit (typically 60–90 seconds) optimised for Instagram, WhatsApp and social sharing.",
  "female photographer": "A verified female photographer is assigned to your booking — important for comfort during maternity, baby and intimate celebrations.",
  "candid": "The photographer moves through the event capturing natural, unposed moments — the real emotions rather than the arranged ones.",
  "drone": "Aerial photography and/or video using a drone — gives you overhead shots that ground-level cameras simply cannot replicate.",
  "studio": "Session held at a dedicated photography studio with professional backdrops, lighting rigs and props.",
  "outdoor": "Session held at an outdoor location — park, heritage site, garden or any spot you choose. Natural light and open space.",
  "smash cake": "A dedicated setup where the birthday child is photographed interacting with a decorated smash cake — one of the most memorable sequences from any first birthday.",
  "prop": "Small themed objects (frames, signs, balloons, baskets) used to add visual interest to posed shots.",
  "backdrop": "A painted, printed or fabric background used in studio or home setups to create a consistent, styled look.",
  "baby safe": "All materials, props and posing techniques are baby-safe. Every setup is tested to ensure comfort and safety.",
  "maternity": "Gentle posing guidance that is comfortable for expecting mothers. Sessions are paced to allow rest.",
  "raw photo": "Unedited original image files delivered alongside edited versions — useful if you want to do your own post-processing.",
  "4 hours": "A 4-hour session provides enough time to cover the setup, the full event and a round of group portraits at the end.",
  "8 hours": "Full-day coverage spanning all functions, setup and wind-down. Ideal for weddings and large all-day events.",
  "photo album": "A physical printed album made from your edited images — a tangible keepsake beyond the digital gallery.",
  "pre-wedding": "A dedicated couple session before the wedding day, used for invitation photos, social announcements and styled portraits.",
  "venue": "The photographer covers the decorated venue and location before guests arrive, documenting the full setup.",
  "headshot": "Individual professional portraits shot against a consistent background — standard for LinkedIn, company websites and press kits.",
  "team photo": "Group portrait of the full team or department, typically with a consistent background and uniform lighting.",
};

/**
 * Parse inclusions HTML string into an array of clean string items.
 * Mirrors the parsing logic in getItemInclusion on the product page.
 */
const parseInclusions = (inclusion) => {
  if (!Array.isArray(inclusion) || inclusion.length === 0) return [];
  const htmlString = inclusion[0];
  const withoutTags = htmlString.replace(/<[^>]*>/g, "");
  const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, " ");
  const statements = withoutSpecialChars.split("<div>");
  return statements
    .flatMap((statement) =>
      statement.split("-").filter((item) => item.trim() !== ""),
    )
    .map((item) => item.trim())
    .filter(Boolean);
};

/**
 * Find the best matching explanation for an inclusion item.
 */
const findExplanation = (item) => {
  const lower = item.toLowerCase();
  for (const [keyword, explanation] of Object.entries(INCLUSION_EXPLANATIONS)) {
    if (lower.includes(keyword)) return explanation;
  }
  return null;
};

/**
 * PhotographyProductDescription
 *
 * Renders below the inclusions section on the product page.
 * Shows each inclusion with a plain-language explanation of what it means.
 *
 * Props:
 *   work: the photography product object (needs work.inclusion, work.name)
 *   city: string | null
 *   catValue: string | null
 */
const PhotographyProductDescription = ({ work, city, catValue }) => {
  if (!work) return null;

  const inclusions = parseInclusions(work.inclusion);
  const explainedItems = inclusions
    .map((item) => ({ item, explanation: findExplanation(item) }))
    .filter(({ explanation }) => explanation !== null);

  if (explainedItems.length === 0) return null;

  const cityLabel = city
    ? ` in ${String(city).replace(/\b\w/g, (c) => c.toUpperCase())}`
    : "";
  const packageName = work.name || "This Package";

  return (
    <section className={styles.wrapper} aria-label={`What's included in ${packageName}`}>
      <h2 className={styles.title}>
        What&apos;s included{cityLabel} — explained
      </h2>
      <p className={styles.subtitle}>
        Here&apos;s what each item in this package actually means for your shoot.
      </p>

      <div className={styles.list}>
        {explainedItems.map(({ item, explanation }, idx) => (
          <div key={idx} className={styles.item}>
            <div className={styles.itemLabel}>{item}</div>
            <div className={styles.itemExplanation}>{explanation}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotographyProductDescription;
