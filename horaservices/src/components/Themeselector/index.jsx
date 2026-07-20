"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import "./Themeselector.css";
import budgetfriendly from "@/assets/themeselector/budget-friendly.webp";
import valueformoney from "@/assets/themeselector/value-for-money.webp";
import photogenicdecoration from "@/assets/themeselector/photogenic-decoration.webp";
import stagedecoration from "@/assets/themeselector/stage-decoration.webp";
import budgetfriendlyBg from "@/assets/themeselector/budgetfriendlyBg.webp";
import valueformoneyBg from "@/assets/themeselector/valueformoneyBg.webp";
import photogenicdecorationBg from "@/assets/themeselector/photogenicdecorationBg.webp";
import stagedecorationBg from "@/assets/themeselector/stagedecorationBg.webp";

const themes = [
  {
    id: "budget",
    label: "Budget Friendly",
    image: budgetfriendly,
    bgImage: budgetfriendlyBg,
    width: "clamp(53px, 16.5vw, 79px)",
      height: "clamp(44px, 13.74vw, 64px)",
   gap: "clamp(14px, calc((18 / 393) * 100vw), 22px)",
    priceRange: { min: 0, max: 4000 },
    accentColor: "#C77DBF",
paddingRight: "clamp(44px, calc((50 / 393) * 100vw), 61px)",
gtmEvent: "theme_select_budget_friendly",
  },
  {
    id: "value",
    label: "Value For Money",
    image: valueformoney,
    bgImage: valueformoneyBg,
    width: "clamp(46px, 14.2vw, 68px)",
   height: "clamp(52px, 16.28vw, 76px)",
   gap: "clamp(11px, calc((14 / 393) * 100vw), 14px)",
    priceRange: { min: 4200, max: 7000 },
    accentColor: "#7C6CF2",
paddingRight: "clamp(44px, calc((50 / 393) * 100vw), 61px)",
  gtmEvent: "theme_select_value_for_money",
  },
  {
    id: "photogenic",
    label: "Photogenic Decoration",
    image: photogenicdecoration,
    bgImage: photogenicdecorationBg,
    width: "clamp(64px, 20.1vw, 96px)",
    height: "clamp(43px, 13.5vw, 64px)",
   gap: "clamp(8px, calc((10 / 393) * 100vw), 10px)",
    priceRange: { min: 7001, max: 12000 },
    accentColor: "#D4A93A",
     gtmEvent: "theme_select_photogenic_decoration",
  },
  {
    id: "stage",
    label: "Stage Decoration",
    image: stagedecoration,
    bgImage: stagedecorationBg,
    width: "clamp(106px, 33.08vw, 159px)",
    height: "clamp(41px, 13vw, 62px)",
     gap: "clamp(-8px, calc((-8 / 393) * 100vw), -6px)",
    priceRange: { min: 12001, max: Infinity },
    accentColor: "#E8698A",
       gtmEvent: "theme_select_stage_decoration",
  },
];

function ThemeCard({ theme, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(theme)}
      className={`theme-card ${isActive ? "theme-card-active" : ""}`}
      aria-pressed={isActive}
      style={{ "--card-accent": theme.accentColor }}
    >
      <Image src={theme.bgImage} alt="" fill priority className="theme-card-bg" />
   <div
  className="theme-card-overlay"
  style={{
    "--card-gap": theme.gap,
    "--card-paddingRight": theme.paddingRight,
  }}
>
        <h3 className="theme-card-label">{theme.label}</h3>
        <div className="theme-card-art">
          <Image
            src={theme.image}
            alt={theme.label}
            className="theme-card-img"
            style={{ width: theme.width, height: theme.height }}
          />
        </div>
        <span className="theme-card-chevron">
          <ChevronRight
            className={`theme-card-chevron-icon ${isActive ? "theme-card-chevron-icon-active" : ""}`}
          />
        </span>
      </div>
    </button>
  );
}

export default function ThemeSelector({ onSelectTheme, selectedThemeId }) {
  const handleSelect = (theme) => {
    // GTM push - deselect aur select dono cases handle
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: selectedThemeId === theme.id ? "theme_deselect" : theme.gtmEvent,
        theme_id: theme.id,
        theme_label: theme.label,
      });
    }

    if (selectedThemeId === theme.id) {
      onSelectTheme?.(null);
    } else {
      onSelectTheme?.(theme);
    }
  };

  return (
    <div className="theme-selector-wrapper">
      <div className="theme-grid">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isActive={selectedThemeId === theme.id}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}

export { themes };