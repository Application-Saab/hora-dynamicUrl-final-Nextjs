import angryImg from "@/assets/review/angry.svg";
import neutralImg from "@/assets/review/neutral.svg";
import loveImg from "@/assets/review/love.svg";


export const ratingConfig = [
  {
    key: "low",
    label: "1 - 6",
    value: ["1-6"],
    emoji: angryImg,
  },
  {
    key: "mid",
    label: "7 - 8",
    value: ["7-8"],
    emoji: neutralImg,
  },
  {
    key: "high",
    label: "9 - 10",
    value: ["9-10"],
    emoji: loveImg,
  },
];