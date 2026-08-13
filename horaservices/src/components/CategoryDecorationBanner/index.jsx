// DecorationBanner.jsx
"use client";

import Image from "next/image";
import starSparkle from "@/assets/star-sparkle.svg";
import heartStarGroup from "@/assets/heart-star-group.svg";
import "./CategoryDecorationBanner.css";

const categoryTitleMap = {
  "birthday-decoration": "Birthday Decoration",
  "premium-decoration": "Premium Decoration",
  "kids-birthday-decoration": "Kids Birthday Decoration",
  "welcome-baby-decoration": "Welcome Baby Decoration",
  "baby-shower-decoration": "Baby Shower Decoration",
  "anniversary-decoration": "Anniversary Decoration",
  "first-night-decoration": "First Night Decoration",
  "haldi-mehendi-decoration": "Haldi Mehendi Decoration",
  "Wedding": "Wedding Decoration",
  "bachelorette-decoration": "Bachelorette Decoration",
  "naming-ceremony-decoration": "Naming Ceremony Decoration",
  "Nation-Pride-decoration": "Nation Pride Decoration",
  "House-Warming-decoration": "House Warming Decoration",
  "coorporate-showrooms-decoration": "Corporate Showroom Decoration",
  "festivals-decoration": "Festival Decoration",
  "car-decoration": "Car Decoration",
  "pet-animals-decoration": "Pet & Animal Decoration",
  "engagement-decoration": "Engagement Decoration",
};

export default function DecorationBanner({ category }) {
  const title = categoryTitleMap[category] || "Decoration";

  return (
    <section className="decorationBanner">
      <span className="decorationBanner-star">
        <Image src={starSparkle} alt="" priority />
      </span>

      <h1 className="decorationBanner-text">{title}</h1>

      <span className="decorationBanner-heart">
        <Image src={heartStarGroup} alt="" priority />
      </span>
    </section>
  );
}