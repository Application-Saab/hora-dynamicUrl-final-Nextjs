import ganpati from "@/assets/festivals/ganpati.webp";
import janmashtami from "@/assets/festivals/janmashtami.webp";
import diwali from "@/assets/festivals/diwali.webp";
import navratri from "@/assets/festivals/navratri.webp";
import christmas from "@/assets/festivals/christmas.webp";
import newYear from "@/assets/festivals/new-year.webp";
import halloween from "@/assets/festivals/halloween.webp";
import cardParty from "@/assets/festivals/card-party.webp";

// Icons (flower ki tarah alag icons folder me)
import ganpatiIcon from "@/assets/festivals/icons/ganpati.webp";
import janmashtamiIcon from "@/assets/festivals/icons/janmashtami.webp";
import diwaliIcon from "@/assets/festivals/icons/diwali.webp";
import navratriIcon from "@/assets/festivals/icons/navratri.webp";
import christmasIcon from "@/assets/festivals/icons/christmas.webp";
import newYearIcon from "@/assets/festivals/icons/new-year.webp";
import halloweenIcon from "@/assets/festivals/icons/halloween.webp";
import cardPartyIcon from "@/assets/festivals/icons/card-party.webp";

export const FESTIVAL_CATEGORY_SLUG = "festivals-decoration";

export const festivalThemes = [
  { id: 1, title: "Ganpati", catValue: "ganpati-decoration", subCategory: "GanpatiDecoration", image: ganpati, icon: ganpatiIcon, imgAlt: "Ganpati decoration" },
  { id: 2, title: "Janmashtami", catValue: "janmastmi-decoration", subCategory: "JanmastmiDecoration", image: janmashtami, icon: janmashtamiIcon, imgAlt: "Janmashtami decoration" },
  { id: 3, title: "Diwali", catValue: "diwali-decoration", subCategory: "DiwaliDecoration", image: diwali, icon: diwaliIcon, imgAlt: "Diwali decoration" },
  { id: 4, title: "Navratri", catValue: "navratri-decoration", subCategory: "NavratriDecoration", image: navratri, icon: navratriIcon, imgAlt: "Navratri decoration" },
  { id: 5, title: "Christmas", catValue: "christmas-decoration", subCategory: "ChristmasDecoration", image: christmas, icon: christmasIcon, imgAlt: "Christmas decoration" },
  { id: 6, title: "New Year", catValue: "new-year-decoration", subCategory: "NewYearDecoration", image: newYear, icon: newYearIcon, imgAlt: "New Year decoration" },
  { id: 7, title: "Halloween", catValue: "hallowean-decoration", subCategory: "HalloweanDecoration", image: halloween, icon: halloweenIcon, imgAlt: "Halloween decoration" },
  { id: 8, title: "Card Party", catValue: "card-party-decoration", subCategory: "CardPartyDecoration", image: cardParty, icon: cardPartyIcon, imgAlt: "Card party decoration" },
];