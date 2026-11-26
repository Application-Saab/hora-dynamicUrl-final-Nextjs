"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import fallbackImg from "@/assets/fallback-image.png";
import { COMPRESSED_WEBP_IMG_URL, IMAGE_BASE_URL } from "@/utils/apiconstants";
import "./PhotoPackageGrid.css";

import arrowicon from "@/assets/arrowicon.svg";
import { TAG_RULES } from "@/utils/photoPackageTags";


const replaceExtensionWithWebp = (fileNameOrUrl) => {
  if (!fileNameOrUrl || typeof fileNameOrUrl !== "string") return null;

  const trimmed = fileNameOrUrl.trim();
  const [cleanPath, ...rest] = trimmed.split(/([?#].*)/);
  if (!/\.[a-z0-9]+$/i.test(cleanPath)) return null;

  const webpPath = cleanPath.replace(/\.[a-z0-9]+$/i, ".webp");
  if (webpPath === cleanPath) return null;

  return `${webpPath}${rest.join("")}`;
};

const getImageSources = (item) => {
  let fileName = null;

  if (item?.featured_image && typeof item.featured_image === "string") {
    fileName = item.featured_image.trim();
  } else if (
    Array.isArray(item?.featured_image) &&
    item.featured_image.length > 0
  ) {
    const first = item.featured_image[0];
    fileName = (typeof first === "string" ? first : first?.fileName)?.trim();
  } else if (item?.featured_images?.[0]?.fileName) {
    fileName = String(item.featured_images[0].fileName).trim();
  }

  // Guard against empty strings, "null", "undefined"
  if (!fileName || fileName === "null" || fileName === "undefined") {
    return fallbackImg ? [fallbackImg] : [];
  }

  const webpFileName = replaceExtensionWithWebp(fileName);
  const candidates = [];

  if (/^https?:\/\//i.test(fileName)) {
    candidates.push(fileName);
    if (webpFileName) candidates.push(webpFileName);
  } else {
    if (COMPRESSED_WEBP_IMG_URL) {
      candidates.push(`${COMPRESSED_WEBP_IMG_URL}${fileName}`);
      if (webpFileName) {
        candidates.push(`${COMPRESSED_WEBP_IMG_URL}${webpFileName}`);
      }
    }
    if (IMAGE_BASE_URL) {
      candidates.push(`${IMAGE_BASE_URL}/${fileName}`);
      if (webpFileName) {
        candidates.push(`${IMAGE_BASE_URL}/${webpFileName}`);
      }
    }
  }

  if (fallbackImg) {
    candidates.push(fallbackImg);
  }

  return [...new Set(candidates.filter(Boolean))];
};
// Returns ALL tags that match a given line (a line can contain multiple
// keywords, e.g. "Unlimited Posed & Candid Photos" matches 3 tags at once).
const getTagsForText = (text) => {
  const lower = text.toLowerCase();
  return TAG_RULES.filter(
    (r) =>
      r.words.every((w) => lower.includes(w)) &&
      !(r.exclude || []).some((w) => lower.includes(w)),
  );
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

  // Only keep items that match a known tag — no extra/unknown tags shown.
  // If a single line matches multiple tags, ALL of them are kept.
  const seen = new Set();
  const tags = [];
  rawItems.forEach((text) => {
    const matchedTags = getTagsForText(text);
    const num = extractLeadingNumber(text);

    matchedTags.forEach((tag) => {
      const key = `${tag.title}|${tag.subtitle || ""}`.trim().toLowerCase();
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
    /\d+\s*(?:-\s*\d+\s*)?(?:hours?|hrs?|hr|days?|minutes?|mins?|min)/i,
  );
  return match ? match[0].trim() : text.trim();
};

// Small inline icons for the meta row (duration / crew) — no extra
// asset imports needed, colored via currentColor to match the text.
const ClockIcon = () => (
  <svg
    className="photoPkgMetaIcon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 7v5l3.5 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PersonIcon = () => (
  <svg
    className="photoPkgMetaIcon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
    <path
      d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const VideoIcon = () => (
  <svg
    className="photoPkgMetaIcon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="6"
      width="12"
      height="12"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M15 10l6-3v10l-6-3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const PhotoPackageCard = ({ item, onClick, href }) => {
  const sources = React.useMemo(() => getImageSources(item), [
    item?._id,
    item?.featured_image,
    item?.featured_images,
  ]);

  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
  }, [sources]);

  const imgSrc = sources[sourceIndex] || fallbackImg;

  const handleImageError = () => {
    setSourceIndex((prev) => {
      if (prev < sources.length - 1) {
        return prev + 1;
      }
      return prev; // Hard stop at last fallback — prevents infinite loop
    });
  };

  const inclusionItems = parseInclusions(item.inclusion);

  const totalItems = inclusionItems.length;
  const itemsInLastRow = totalItems % 3 === 0 ? 3 : totalItems % 3;
  const lastRowStartIndex = totalItems - itemsInLastRow;

  const {
    photographers: parsedPhotographers,
    videographers: parsedVideographers,
    assistants: parsedAssistants,
  } = getCrewCounts(item.inclusion);
  const photographerCount = parsedPhotographers ?? item.photographers ?? null;
  const videographerCount = parsedVideographers ?? item.videographers ?? null;
  const assistantCount = parsedAssistants ?? item.assistants ?? null;

  return (
    <a
      href={href || "#"}
      className="photoPkgCard"
      onClick={() => onClick?.(item)}
    >
      <div className="photoPkgCardLeft">
        {imgSrc && (
          <>
            <Image
              src={imgSrc}
              alt=""
              fill
              aria-hidden="true"
              className="photoPkgCardImgBlur"
            />
            <Image
              src={imgSrc}
              alt={item.name || "Photography Package"}
              fill
              className="photoPkgCardImg"
              onError={handleImageError}
            />
          </>
        )}
      </div>

      <div className="photoPkgCardRight">
        <h3 className="photoPkgCardTitle">{item.name}</h3>

        {inclusionItems.length > 0 && (
          <div className="photoPkgGrid">
            {inclusionItems.map((inc, idx) => (
              <div
                className="photoPkgItem"
                key={idx}
                data-last-row={idx >= lastRowStartIndex ? "true" : undefined}
              >
                {inc.icon && (
                  <div className="photoPkgIconWrap">
                    <Image
                      src={inc.icon}
                      alt={inc.title || "Inclusion icon"}
                      fill
                      className="photoPkgIconImg"
                    />
                  </div>
                )}
                <p className="photoPkgText">
                  <span className="photoPkgItemTitle">{inc.title}</span>
                  {inc.subtitle && (
                    <>
                      {" "}
                      <span className="photoPkgItemSubtitle">{inc.subtitle}</span>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="photoPkgMeta">
          <span className="photoPkgMetaItem">
            <ClockIcon />
            Duration: {getDurationText(item.event_duration || item.duration)}
          </span>
          {photographerCount && (
            <span className="photoPkgMetaItem">
              <PersonIcon />
              {photographerCount} Photographer
              {Number(photographerCount) > 1 ? "s" : ""}
            </span>
          )}
          {videographerCount && (
            <span className="photoPkgMetaItem">
              <VideoIcon />
              {videographerCount} Videographer
              {Number(videographerCount) > 1 ? "s" : ""}
            </span>
          )}
          {assistantCount && (
            <span className="photoPkgMetaItem">
              <PersonIcon />
              {assistantCount} Assistant{Number(assistantCount) > 1 ? "s" : ""}
            </span>
          )}
        </p>

        <div className="photoPkgPriceRow">
          <span className="photoPkgFinalPrice">₹{item.price}/-</span>
          <span className="photoPkgOldPrice">
            ₹{Math.floor(item.discountedPrice)}/-
          </span>
          <span className="photoPkgDiscountBadge">
            ₹{item.discountDifference?.toFixed(0)} off
          </span>
        </div>

        <span className="photoPkgViewBtn">
          View Full Package
          {arrowicon && (
            <Image className="photoPkgArrow" src={arrowicon} alt="Arrow" />
          )}
        </span>
      </div>
    </a>
  );
};

const PhotoPackageGrid = ({ data = [], onCardClick, getHref }) => {
  return (
    <div className="photoPkgContainer">
      {data.map((item) => (
        <PhotoPackageCard
          key={item._id}
          item={item}
          onClick={onCardClick}
          href={getHref?.(item) || "#"}
        />
      ))}
    </div>
  );
};

export default PhotoPackageGrid;