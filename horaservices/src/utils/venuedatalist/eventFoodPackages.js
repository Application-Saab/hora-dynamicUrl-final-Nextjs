
import { STATIC_FOOD_PACKAGES } from "./Venue1522.js";
import { OAKWOOD_FOOD_PACKAGES } from "./OakwoodResidence.js";
import { ROYAL_ORCHID_PACKAGES } from "./RoyalOrchid.js";
import { SPOT360_FOOD_PACKAGES } from "./Spot360foodpackage.js";
import { ICON_PREMIER_PACKAGES } from "./iconpremer.js";
import { ZURI_PACKAGES } from "./Zuri.js";
import { JW_MARRIOTT } from "./JwMarriott.js";
import { BRAHMA_BREWS } from "./BrahmaBrews.js";
import { VIVANTA_BENGALURU } from "./VivantaBengaluru.js";
import { HITLON_PACKAGES } from "./Hitlon.js";
import { ARBOR_BREWING } from "./ArborBrewing.js";
import { PAUL_PACKAGES } from "./paul.js";
export const EVENT_FOOD_PACKAGES = {

  "69e3619f800de79c9491390d": STATIC_FOOD_PACKAGES, 
  "69e5b0a2800de79c9494fa4d": OAKWOOD_FOOD_PACKAGES,
   "69e9b5da9beae4c61eec82ec":ROYAL_ORCHID_PACKAGES,
   "69e9f7ba9beae4c61eed0db7":SPOT360_FOOD_PACKAGES,
   "69ea076d9beae4c61eed2ece":ICON_PREMIER_PACKAGES,
    "69e9e1d69beae4c61eecde81":ZURI_PACKAGES,
    "69eb18f89beae4c61eeedc4e":JW_MARRIOTT,
    "69eb2bb59beae4c61eef01ee":BRAHMA_BREWS,
    "69eb36839beae4c61eef1a14":VIVANTA_BENGALURU,
    "69eb60e7c45e88294b7279a7":HITLON_PACKAGES,
    "69ec4a69c45e88294b73d34a":ARBOR_BREWING,
    "69ec81b8153fb91792cf4dda":PAUL_PACKAGES,
};

// ─── Helper function ─────────────────────────────────────────────────────────
export const getFoodPackagesByEventId = (eventId) => {
  return EVENT_FOOD_PACKAGES[eventId] || [];
};
