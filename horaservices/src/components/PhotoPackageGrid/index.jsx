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
  { words: ["premium", "grow"], title: "Premium", subtitle: "Grows", icon: premiumGrows},
  { words: ["premium", "prop"], title: "Premium", subtitle: "Prop", icon: premiumProp},
  { words: ["maternity", "prop"], title: "Maternity", subtitle: "Prop", icon: maternityProp },
];

// Returns ALL tags that match a given line (a line can contain multiple
// keywords, e.g. "Unlimited Posed & Candid Photos" matches 3 tags at once).
const getTagsForText = (text) => {
  const lower = text.toLowerCase();
  return TAG_RULES.filter((r) => r.words.every((w) => lower.includes(w)));
};

// same parsing logic as ProductDetails.js getItemInclusion — real backend data
const parseInclusions = (inclusion) => {
  if (!Array.isArray(inclusion) || inclusion.length === 0) return [];

  const htmlString = inclusion[0];
  const withoutTags = htmlString.replace(/<[^>]*>/g, "");
  const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, " ");
  const statements = withoutSpecialChars.split("<div>");

  const rawItems = statements
    .flatMap((statement) => statement.split("-"))
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s !== "");

  // only keep items that match one of the 17 known tags — no extra/unknown tags shown
  // if a single line matches multiple tags (e.g. "Unlimited Posed & Candid Photos"),
  // ALL of them are kept, not just the first
  const seen = new Set();
  const tags = [];
  rawItems.forEach((text) => {
    const matchedTags = getTagsForText(text);
    matchedTags.forEach((tag) => {
      const key = tag.title + tag.subtitle;
      if (!seen.has(key)) {
        seen.add(key);
        tags.push(tag);
      }
    });
  });
  return tags;
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

  return (
    <div className="photoPkgCard" onClick={() => onClick?.(item)}>
      <div className="photoPkgCardLeft">
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
            {inclusionItems.slice(0, 6).map((inc, idx) => (
              <div className="photoPkgItem" key={idx}>
               <div className="photoPkgIconWrap">
  <Image
    src={inc.icon}
    alt={inc.title}
    width={30}
    height={30}
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
          {item.photographers ? `  |  ${item.photographers} Photographers` : ""}
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
          View Full Package <span className="photoPkgArrow">→</span>
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