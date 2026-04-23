import { ICON_PREMIUM } from "./iconpremer";
import { OAKWOOD_TERMS } from "./OakwoodResidence";
import { ZURI_TERMS } from "./Zuri";
export const EVENT_TERMS = {
  "69e5b0a2800de79c9494fa4d": OAKWOOD_TERMS,
    "69e9e1d69beae4c61eecde81": ZURI_TERMS,
    "69ea076d9beae4c61eed2ece":ICON_PREMIUM,
};

export const getTermsByEventId = (eventId) => {
  return EVENT_TERMS[eventId] || null;
};