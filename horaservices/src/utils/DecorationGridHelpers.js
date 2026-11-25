import { COMPRESSED_WEBP_IMG_URL } from "./apiconstants";

export const isVideoEntry = (entry) => {
  if (!entry) return false;
  if (typeof entry === "object" && entry.mediaType === "video") return true;
  const name =
    typeof entry === "string" ? entry : entry.fileName || entry.url || "";
  return /\.(mp4|webm|ogg|mov)$/i.test(name);
};

export const resolveMediaUrl = (fileOrObj) => {
  if (!fileOrObj) return null;
  const fileName =
    typeof fileOrObj === "string"
      ? fileOrObj
      : fileOrObj.fileName || fileOrObj.url || fileOrObj.src;

  if (!fileName) return null;
  if (/^https?:\/\//i.test(fileName)) return fileName;

  if (isVideoEntry(fileOrObj)) {
    const baseVideoUrl =
      COMPRESSED_WEBP_IMG_URL ||
      COMPRESSED_WEBP_IMG_URL.replace(
        /compressed_webp\/?$/,
        "compressed_webp/",
      );
    return `${baseVideoUrl}${fileName}`;
  }

  return `${COMPRESSED_WEBP_IMG_URL}${fileName.split(".")[0]}.webp`;
};

export const PRIORITY_DESIGN_TYPES = [
  { label: "Wall", aliases: ["wall", "on wall"] },
  { label: "Ring", aliases: ["ring", "on ring"] },
  { label: "Sequel", aliases: ["sequel", "sequined", "sequins design"] },
  { label: "U Shape", aliases: ["u shape", "u shape stand", "u stand"] },
  {
    label: "Square Stand",
    aliases: ["square stand", "squre stand", "on square stand"],
  },
  { label: "Room Decor", aliases: ["room decor"] },
];
