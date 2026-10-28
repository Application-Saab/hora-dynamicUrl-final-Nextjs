import React from "react";
import { getCityCategoryLongContent } from "../utils/photographyCityLongContent";

/**
 * CityLongContent
 * Renders 600+ word unique long-form content below FAQSection on
 * /[city]/photography/[catValue] pages.
 *
 * Props:
 *   city      — e.g. "bangalore", "mumbai"
 *   catValue  — e.g. "wedding-photography", "birthday-photography"
 */
export default function CityLongContent({ city, catValue }) {
  const content = getCityCategoryLongContent(city, catValue);
  if (!content || !content.sections || content.sections.length === 0) return null;

  const cityLabel = city
    ? city.charAt(0).toUpperCase() + city.slice(1)
    : "";

  return (
    <section
      className="city-long-content"
      style={{
        maxWidth: "800px",
        margin: "40px auto 0",
        padding: "0 16px 40px",
        fontFamily: "inherit",
        color: "inherit",
      }}
    >
      {content.sections.map((section, idx) => (
        <div key={idx} style={{ marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              lineHeight: 1.35,
              marginBottom: "10px",
              color: "inherit",
            }}
          >
            {section.heading}
          </h2>
          <p
            style={{
              fontSize: "0.97rem",
              lineHeight: 1.75,
              margin: 0,
              color: "inherit",
              opacity: 0.9,
            }}
          >
            {section.body}
          </p>
        </div>
      ))}
    </section>
  );
}
