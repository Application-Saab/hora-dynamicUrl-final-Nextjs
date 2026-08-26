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
import premiumGrows from "@/assets/inclusionIcons/Premiumgown.svg";
import premiumProp from "@/assets/inclusionIcons/premiumProp.svg";
import maternityProp from "@/assets/inclusionIcons/maternityProp.svg";
import cinematic from "@/assets/inclusionIcons/CinematicVideo.svg";
import twin from "@/assets/inclusionIcons/Twinmegacollageprints.svg";
import Magazine from "@/assets/inclusionIcons/Magazine.svg";

const saveTheDateReel = traditionalVideo;

export const TAG_RULES = [
  { words: ["unlimited"], title: "Unlimited", subtitle: "Photos", icon: unlimitedPhotos },

  { words: ["traditional", "video"], title: "Traditional", subtitle: "Video", icon: traditionalVideo },

  // specific combo rules pehle (order zaroori nahi kyunki exclude ka use ho raha hai,
  // lekin readability ke liye upar rakha hai)
  { words: ["traditional", "teaser"], title: "Traditional", subtitle: "Teaser", icon: editedTeaser },
  { words: ["cinematic", "teaser"], title: "Cinematic", subtitle: "Teaser", icon: cinematic },

  // generic "teaser" — agar traditional/cinematic teaser already match ho gaya hai to skip
  {
    words: ["teaser"],
    exclude: ["traditional", "cinematic"],
    title: "Edited",
    subtitle: "Teaser",
    icon: editedTeaser,
  },

  // generic "reel" — agar "save the date" wali reel hai to skip
  {
    words: ["reel"],
    exclude: ["save the date"],
    title: "Edited",
    subtitle: "Reel",
    icon: editedTeaser,
  },

  { words: ["edited", "photo"], title: "Edited", subtitle: "Photos", icon: editedPhotos },
  { words: ["candid"], title: "Candid", subtitle: "Shots", icon: candidShots },
  { words: ["posed"], title: "Posed", subtitle: "Shots", icon: posedShots },
  { words: ["umbrella"], title: "Umbrella", subtitle: "Light", icon: umbrellaLight },
  { words: ["color"], title: "Color", subtitle: "Correction", icon: colorCorrection },
  { words: ["colour"], title: "Color", subtitle: "Correction", icon: colorCorrection },
  { words: ["album"], title: "Album", subtitle: "", icon: album },
  { words: ["basic", "prop"], title: "Basic", subtitle: "Props", icon: basicProps },
  { words: ["unique", "theme"], title: "Unique", subtitle: "Themes", icon: uniqueThemes },
  { words: ["heavy", "prop"], title: "Heavy", subtitle: "Props", icon: heavyProps },
  { words: ["digital", "theme"], title: "Digital", subtitle: "Backdrop", icon: digitalTheme },
  { words: ["theme", "backdrop"], title: "Theme", subtitle: "Backdrop", icon: themeBackdrop },
  { words: ["premium", "gowns"], title: "Premium", subtitle: "Grows", icon: premiumGrows },
  { words: ["premium", "prop"], title: "Premium", subtitle: "Prop", icon: premiumProp },
  { words: ["maternity", "prop"], title: "Maternity", subtitle: "Prop", icon: maternityProp },
  { words: ["save the date"], title: "Save the Date", subtitle: "Reel", icon: saveTheDateReel },
  { words: ["twin", "collage"], title: "Twin Mega Collage", subtitle: "Prints", icon: twin },

  // generic "cinematic" — agar cinematic teaser already match ho gaya hai to skip
  {
    words: ["cinematic"],
    exclude: ["teaser"],
    title: "Cinematic",
    subtitle: "Video",
    icon: cinematic,
  },

  { words: ["magazine"], title: "Magazine", icon: Magazine },
];