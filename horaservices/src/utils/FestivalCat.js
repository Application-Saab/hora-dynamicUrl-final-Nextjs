// Images apne assets folder se import karo (path/file name apne hisaab se badlo)
import ganpatiImg from "@/assets/festivals/ganpati.webp";
import janmashtamiImg from "@/assets/festivals/janmashtami.webp";
import diwaliImg from "@/assets/festivals/diwali.webp";
import navratriImg from "@/assets/festivals/navratri.webp";
import christmasImg from "@/assets/festivals/christmas.webp";
import newYearImg from "@/assets/festivals/new-year.webp";
import halloweenImg from "@/assets/festivals/halloween.webp";
import cardPartyImg from "@/assets/festivals/card-party.webp";

export const festivalCat = [
  { id: "1", image: ganpatiImg,      name: "Ganpati",     subCategory: "GanpatiDecoration",   catValue: "ganpati-decoration",    imgAlt: "Ganpati decoration" },
  { id: "2", image: janmashtamiImg,  name: "Janmashtami", subCategory: "JanmastmiDecoration", catValue: "janmastmi-decoration",  imgAlt: "Janmashtami decoration" },
  { id: "3", image: diwaliImg,       name: "Diwali",      subCategory: "DiwaliDecoration",    catValue: "diwali-decoration",     imgAlt: "Diwali decoration" },
  { id: "4", image: navratriImg,     name: "Navratri",    subCategory: "NavratriDecoration",  catValue: "navratri-decoration",   imgAlt: "Navratri decoration" },
  { id: "5", image: christmasImg,    name: "Christmas",   subCategory: "ChristmasDecoration", catValue: "christmas-decoration",  imgAlt: "Christmas decoration" },
  { id: "6", image: newYearImg,      name: "New Year",    subCategory: "NewYearDecoration",   catValue: "new-year-decoration",   imgAlt: "New Year decoration" },
  { id: "7", image: halloweenImg,    name: "Halloween",   subCategory: "HalloweanDecoration", catValue: "hallowean-decoration",  imgAlt: "Halloween decoration" },
  { id: "8", image: cardPartyImg,    name: "Card Party",  subCategory: "CardPartyDecoration", catValue: "card-party-decoration", imgAlt: "Card party decoration" },
];