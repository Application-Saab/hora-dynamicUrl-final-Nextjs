import { OAKWOOD_TERMS } from "./OakwoodResidence";

export const EVENT_TERMS = {
  "69e5b0a2800de79c9494fa4d": OAKWOOD_TERMS,
};

export const getTermsByEventId = (eventId) => {
  return EVENT_TERMS[eventId] || null;
};