
import { STATIC_FOOD_PACKAGES } from "./Venue1522.js";
import {BIG_PITCHER_FOOD_PACKAGES} from "./BigPitcher.js";
import { OAKWOOD_FOOD_PACKAGES } from "./OakwoodResidence.js";
export const EVENT_FOOD_PACKAGES = {

  "69e3619f800de79c9491390d": STATIC_FOOD_PACKAGES, 
  "69e0a5b6859a94719f86cba2": OAKWOOD_FOOD_PACKAGES,
 
};

// ─── Helper function ─────────────────────────────────────────────────────────
export const getFoodPackagesByEventId = (eventId) => {
  return EVENT_FOOD_PACKAGES[eventId] || [];
};
