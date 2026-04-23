import { OAKWOOD_TERMS } from "./OakwoodResidence";
import { ZURI_TERMS } from "./Zuri";
export const EVENT_TERMS = {
  "69e5b0a2800de79c9494fa4d": OAKWOOD_TERMS,
    "69e9e1d69beae4c61eecde81": ZURI_TERMS
};

export const getTermsByEventId = (eventId) => {
  return EVENT_TERMS[eventId] || null;
};