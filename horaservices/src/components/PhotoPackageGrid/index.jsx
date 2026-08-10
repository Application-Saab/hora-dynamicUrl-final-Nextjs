import Image from "next/image";
import fallbackImg from "@/assets/fallback-image.png";
import { COMPRESSED_WEBP_IMG_URL } from "@/utils/apiconstants";
import "./PhotoPackageGrid.css";

// icon images
import editedTeaser from "@/assets/inclusionIcons/editedTeaser.svg";
import unlimitedPhotos from "@/assets/inclusionIcons/unlimitedPhotos.svg";
import editedPhotos from "@/assets/inclusionIcons/editedPhotos.svg";
import candidShots from "@/assets/inclusionIcons/candidShots.svg";
import traditionalVideo from "@/assets/inclusionIcons/traditionalVideo.svg";
import saveTheDateReel from "@/assets/inclusionIcons/traditionalVideo.svg";
import posedShots from "@/assets/inclusionIcons/posedShots.svg";
import umbrellaLight from "@/assets/inclusionIcons/umbrellaLight.svg";
import colorCorrection from "@/assets/inclusionIcons/colorCorrection.svg";
import album from "@/assets/inclusionIcons/album.svg";
import basicProps from "@/assets/inclusionIcons/basicProps.svg";
import uniqueThemes from "@/assets/inclusionIcons/uniqueThemes.svg";
import heavyProps from "@/assets/inclusionIcons/heavyProps.svg";
import digitalTheme from "@/assets/inclusionIcons/digitalTheme.svg";
import themeBackdrop from "@/assets/inclusionIcons/themeBackdrop.svg";
import premiumGrows from "@/assets/inclusionIcons/premiumProp.svg";
import premiumProp from "@/assets/inclusionIcons/premiumProp.svg";
import maternityProp from "@/assets/inclusionIcons/maternityProp.svg";
import arrowicon from "@/assets/arrowicon.svg";
const getImageUrl = (item) => {
  let fileName = null;

  if (item.featured_image && typeof item.featured_image === "string") {
    fileName = item.featured_image;
  } else if (Array.isArray(item.featured_image) && item.featured_image.length > 0) {
    fileName = item.featured_image[0]?.fileName || item.featured_image[0];
  } else if (item.featured_images?.[0]?.fileName) {
    fileName = item.featured_images[0].fileName;
  }

  if (!fileName) return fallbackImg;
  if (/^https?:\/\//i.test(fileName)) return fileName;

  return `${COMPRESSED_WEBP_IMG_URL}${fileName.split(".")[0]}.webp`;
};

// EXACTLY these 17 tags. "words" = ALL of these must appear (as substrings) in the
// inclusion line for it to match. A single line can match MULTIPLE tags now.
const TAG_RULES = [
  { words: ["unlimited"], title: "Unlimited", subtitle: "Photos", icon: unlimitedPhotos },
  { words: ["traditional", "video"], title: "Traditional", subtitle: "Video", icon: traditionalVideo },
  { words: ["teaser"], title: "Edited", subtitle: "Teaser", icon: editedTeaser },
  { words: ["edited", "photo"], title: "Edited", subtitle: "Photos", icon: editedPhotos },
  { words: ["candid"], title: "Candid", subtitle: "Shots", icon: candidShots},
  { words: ["posed"], title: "Posed", subtitle: "Shots", icon: posedShots },
  { words: ["umbrella"], title: "Umbrella", subtitle: "Light", icon: umbrellaLight },
  { words: ["color"], title: "Color", subtitle: "Correction", icon: colorCorrection},
  { words: ["colour"], title: "Color", subtitle: "Correction", icon: colorCorrection },
  { words: ["album"], title: "Album", subtitle: "", icon: album },
  { words: ["basic", "prop"], title: "Basic", subtitle: "Props", icon: basicProps },
  { words: ["unique", "theme"], title: "Unique", subtitle: "Themes", icon: uniqueThemes },
  { words: ["heavy", "prop"], title: "Heavy", subtitle: "Props", icon: heavyProps },
  { words: ["digital", "theme"], title: "Digital", subtitle: "Theme", icon: digitalTheme },
  { words: ["theme", "backdrop"], title: "Theme", subtitle: "Backdrop", icon: themeBackdrop },
  { words: ["premium", "gowns"], title: "Premium", subtitle: "Grows", icon: premiumGrows},
  { words: ["premium", "prop"], title: "Premium", subtitle: "Prop", icon: premiumProp},
  { words: ["maternity", "prop"], title: "Maternity", subtitle: "Prop", icon: maternityProp },
  { words: ["save the date"], title: "Save the Date", subtitle: "Reel", icon: saveTheDateReel },
    { words: ["twin", "collage"], title: "Twin Mega Collage", subtitle: "Prints", icon: album },
{ words: ["cinematic"], title: "Cinematic", subtitle: "Video", icon: traditionalVideo },
];

// Returns ALL tags that match a given line (a line can contain multiple
// keywords, e.g. "Unlimited Posed & Candid Photos" matches 3 tags at once).
const getTagsForText = (text) => {
  const lower = text.toLowerCase();
  return TAG_RULES.filter((r) => r.words.every((w) => lower.includes(w)));
};

// Extracts a leading number/range from the start of a line, e.g.
// "20 Edited photos" -> "20", "1 Edited teaser..." -> "1"
// Only matches if the number is at the very start (avoids grabbing
// unrelated numbers later in the same line, e.g. "150 to 200 clicks").
const extractLeadingNumber = (text) => {
  const match = text.trim().match(/^\d+(?:\s*(?:to|-)\s*\d+)?/i);
  return match ? match[0].trim() : null;
};

// Splits the raw `inclusion` HTML-ish array into clean, individual line
// strings, e.g. "1 Professional photographer with Camera, Premium lenses...".
// Shared by parseInclusions() (icon tags) and getCrewCounts() (photographer /
// videographer counts) so both read off the exact same lines.
const getInclusionLines = (inclusion) => {
  if (!Array.isArray(inclusion) || inclusion.length === 0) return [];

  const htmlString = inclusion[0];
  const withoutTags = htmlString.replace(/<[^>]*>/g, "");
  const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, " ");
  const statements = withoutSpecialChars.split("<div>");

  return statements
    .flatMap((statement) => statement.split("-"))
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s !== "");
};

// same parsing logic as ProductDetails.js getItemInclusion — real backend data
const parseInclusions = (inclusion) => {
  const rawItems = getInclusionLines(inclusion);

  // only keep items that match one of the known tags — no extra/unknown tags shown
  // if a single line matches multiple tags (e.g. "Unlimited Posed & Candid Photos"),
  // ALL of them are kept, not just the first
  const seen = new Set();
  const tags = [];
  rawItems.forEach((text) => {
    const matchedTags = getTagsForText(text);
    const num = extractLeadingNumber(text);

    matchedTags.forEach((tag) => {
      const key = tag.title + tag.subtitle;
      if (!seen.has(key)) {
        seen.add(key);
        tags.push({
          ...tag,
          title: num ? `${num} ${tag.title}` : tag.title,
        });
      }
    });
  });
  return tags;
};

// Pulls the photographer / videographer counts straight out of the
// inclusion lines themselves, e.g.
// "1 Professional photographer with Camera, Premium lenses..." -> 1
// "1 Professional Videographer with camera, lens, Lighting Kit..." -> 1
// "2 Professional photographer with camera, lens..." -> 2
// Falls back to null (not shown) if no such line exists.
const getCrewCounts = (inclusion) => {
  const rawItems = getInclusionLines(inclusion);

  let photographers = null;
  let videographers = null;
  let assistants = null;

  rawItems.forEach((text) => {
    const lower = text.toLowerCase();
    const num = extractLeadingNumber(text);
    if (!num) return;

    if (
      videographers === null &&
      (/videographer/.test(lower) || /cinematographer/.test(lower))
    ) {
      videographers = num;
    } else if (photographers === null && /photographer/.test(lower)) {
      photographers = num;
    } else if (assistants === null && /assistant/.test(lower)) {
      assistants = num;
    }
  });

  return { photographers, videographers, assistants };
};

// Extracts just the time part from a duration string, e.g.
// "8 Hours (Full Day Coverage)" -> "8 Hours"
// "Approx. 2-3 Hrs" -> "2-3 Hrs"
// "1 Day" -> "1 Day"
// Falls back to the original text if no time pattern is found.
const getDurationText = (durationRaw) => {
  if (!durationRaw) return "N/A";
  const text = String(durationRaw);
  const match = text.match(
    /\d+\s*(?:-\s*\d+\s*)?(?:hours?|hrs?|hr|days?|minutes?|mins?|min)/i
  );
  return match ? match[0].trim() : text.trim();
};

const PhotoPackageCard = ({ item, onClick }) => {
  const inclusionItems = parseInclusions(item.inclusion);

  // Prefer counts parsed from the inclusion text; fall back to explicit
  // item.photographers / item.videographers fields if the backend ever
  // sends those directly and the inclusion text doesn't mention a count.
 const { photographers: parsedPhotographers, videographers: parsedVideographers, assistants: parsedAssistants } =
    getCrewCounts(item.inclusion);
const photographerCount = parsedPhotographers ?? item.photographers ?? null;
const videographerCount = parsedVideographers ?? item.videographers ?? null;
const assistantCount = parsedAssistants ?? item.assistants ?? null;
  return (
    <div className="photoPkgCard" onClick={() => onClick?.(item)}>
    <div className="photoPkgCardLeft">
  {/* Blurred background fill */}
  <Image
    src={getImageUrl(item)}
    alt=""
    fill
    aria-hidden="true"
    className="photoPkgCardImgBlur"
  />
  {/* Actual image, fully visible, no crop */}
  <Image
    src={getImageUrl(item)}
    alt={item.name}
    fill
    className="photoPkgCardImg"
  />
</div>

      <div className="photoPkgCardRight">
        <h3 className="photoPkgCardTitle">{item.name}</h3>

        {inclusionItems.length > 0 && (
          <div className="photoPkgGrid">
            {inclusionItems.map((inc, idx) => (
              <div className="photoPkgItem" key={idx}>
              <div className="photoPkgIconWrap">
  <Image
    src={inc.icon}
    alt={inc.title}
    fill
    className="photoPkgIconImg"
  />
</div>
                <p className="photoPkgText">
                  <span className="photoPkgItemTitle">{inc.title}</span>
                  {inc.subtitle && (
                    <>
                      <br />
                      <span className="photoPkgItemSubtitle">{inc.subtitle}</span>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="photoPkgMeta">
  Duration: {getDurationText(item.event_duration || item.duration)}
  {photographerCount ? `  |  ${photographerCount} Photographer${photographerCount > 1 ? "s" : ""}` : ""}
  {videographerCount ? `  |  ${videographerCount} Videographer${videographerCount > 1 ? "s" : ""}` : ""}
  {assistantCount ? `  |  ${assistantCount} Assistant${assistantCount > 1 ? "s" : ""}` : ""}
</p>

        <div className="photoPkgPriceRow">
          <span className="photoPkgFinalPrice">₹{item.price}/-</span>
          <span className="photoPkgOldPrice">₹{Math.floor(item.discountedPrice)}/-</span>
          <span className="photoPkgDiscountBadge">₹{item.discountDifference?.toFixed(0)} off</span>
        </div>

        <button
          className="photoPkgViewBtn"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(item);
          }}
        >
          View Full Package 
         <Image
    className="photoPkgArrow"
    src={arrowicon}
    alt="Arrow"
  />
        </button>
      </div>
    </div>
  );
};

const PhotoPackageGrid = ({ data = [], onCardClick }) => {
  return (
    <div className="photoPkgContainer">
      {data.map((item) => (
        <PhotoPackageCard key={item._id} item={item} onClick={onCardClick} />
      ))}
    </div>
  );
};

export default PhotoPackageGrid;