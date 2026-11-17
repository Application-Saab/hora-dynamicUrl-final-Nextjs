import { birthdayDecoration } from "./cityCategory/birthday-decoration";
import { kidsBirthdayDecoration } from "./cityCategory/kids-birthday-decoration";
import { babyShowerDecoration } from "./cityCategory/baby-shower-decoration";
import { premiumDecoration } from "./cityCategory/premium-decoration";
import { welcomeBabyDecoration } from "./cityCategory/welcome-baby-decoration";
import { namingCeremonyDecoration } from "./cityCategory/naming-ceremony-decoration";
import { anniversaryDecoration } from "./cityCategory/anniversary-decoration";
import { houseWarmingDecoration } from "./cityCategory/house-warming-decoration";
import { firstNightDecoration } from "./cityCategory/first-night-decoration";
import { corporateShowroomsDecoration } from "./cityCategory/corporate-showrooms-decoration";
import { carDecoration } from "./cityCategory/car-decoration";
import { petAnimalsDecoration } from "./cityCategory/pet-animals-decoration";
import { festivalsDecoration } from "./cityCategory/festivals-decoration";
import { nationPrideDecoration } from "./cityCategory/nation-pride-decoration";
import { haldiMehendiDecoration } from "./cityCategory/haldi-mehendi-decoration";
import { weddingDecoration } from "./cityCategory/wedding-decoration";
import { bacheloretteDecoration } from "./cityCategory/bachelorette-decoration";
import { proposalDecorations } from "./cityCategory/proposal-decorations";
import { engagementDecoration } from "./cityCategory/engagement-decoration";
import { receptionDecoration } from "./cityCategory/reception-decoration";
import { sangeetDecoration } from "./cityCategory/sangeet-decoration";
import { mandapDecoration } from "./cityCategory/mandap-decoration";
import { weddingCarDecoration } from "./cityCategory/wedding-car-decoration";
import { mehendiDecoration } from "./cityCategory/mehendi-decoration";
import { haldiDecoration } from "./cityCategory/haldi-decoration";
import { annaprashanDecoration } from "./cityCategory/annaprashan-decoration";
import { nameRevealDecoration } from "./cityCategory/name-reveal-decoration";
import { baptismDecoration } from "./cityCategory/baptism-decoration";

export const CityCategoryDecorationlandingPage = {
  ...birthdayDecoration,
  ...kidsBirthdayDecoration,
  ...babyShowerDecoration,
  ...premiumDecoration,
  ...welcomeBabyDecoration,
  ...namingCeremonyDecoration,
  // "Naming-ceremony-decoration" (capital N) — alias pointing to same data
  "Naming-ceremony-decoration": namingCeremonyDecoration["naming-ceremony-decoration"],
  ...anniversaryDecoration,
  ...houseWarmingDecoration,
  ...firstNightDecoration,
  ...corporateShowroomsDecoration,
  ...carDecoration,
  ...petAnimalsDecoration,
  ...festivalsDecoration,
  ...nationPrideDecoration,
  ...haldiMehendiDecoration,
  ...weddingDecoration,
  ...bacheloretteDecoration,
  ...proposalDecorations,
  ...engagementDecoration,
  ...receptionDecoration,
  ...sangeetDecoration,
  ...mandapDecoration,
  ...weddingCarDecoration,
  ...mehendiDecoration,
  ...haldiDecoration,
  ...annaprashanDecoration,
  ...nameRevealDecoration,
  ...baptismDecoration,
};

// Helper: catValue aur city dono kisi bhi case/format mein aa sakte hain
export function getCityCategoryLanding(catValue, city) {
  if (!catValue || !city) return null;

  // Preserve original casing for keys that use capitals (e.g. "Proposal-Decorations", "Naming-ceremony-decoration")
  const catKeyLower = String(catValue).toLowerCase().trim().replace(/\s+/g, "-");
  const cityKey = String(city).toLowerCase().trim();

  // Try exact match first (for capital-letter catValues like "Proposal-Decorations")
  const exactMatch = CityCategoryDecorationlandingPage[catValue];
  if (exactMatch) {
    return exactMatch[cityKey] || null;
  }

  // Fall back to lowercase lookup
  return CityCategoryDecorationlandingPage[catKeyLower]?.[cityKey] || null;
}

export default CityCategoryDecorationlandingPage;
