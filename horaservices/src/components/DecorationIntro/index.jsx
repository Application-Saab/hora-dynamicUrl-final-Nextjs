/**
 * DecorationIntro
 * ---------------
 * A short, keyword-rich intro paragraph rendered immediately below the hero
 * banner on both /balloon-decoration and /[city]/balloon-decoration.
 *
 * SEO purpose:
 *  - Places the primary keyword "balloon decoration" in the first 100 words
 *    of visible page text (Google's thin-content signal).
 *  - On city pages, includes "[City] balloon decoration" and "[City]" naturally
 *    so the city-keyed page has unique, non-duplicate content.
 *  - Keeps copy concise so it doesn't push products below the fold.
 */

const DecorationIntro = ({ city = "" }) => {
  const cityLabel = city ? city.charAt(0).toUpperCase() + city.slice(1) : "";

  const text = cityLabel
    ? `Book balloon decoration at home in ${cityLabel} — starting at Rs 1,499, with same-day and midnight slots available. HORA sends a verified decorator to your door in ${cityLabel}, sets the room up in about an hour, and clears everything away after the party. Birthday, anniversary, baby shower, welcome baby or a surprise — every setup is sized to your room and priced upfront with no day-of extras.`
    : `Book balloon decoration at home — starting at Rs 1,499, with same-day and midnight slots available across 8 cities. HORA sends a verified decorator to your door, sets the room up in about an hour, and clears everything away after the party. Birthday, anniversary, baby shower, welcome baby or a surprise — every balloon decoration setup is sized to your room and priced upfront with nothing added on the day.`;

  return (
    <div
      style={{
        maxWidth: "96%",
        margin: "0 auto",
        padding: "14px 16px 4px",
        fontSize: "14px",
        lineHeight: "1.65",
        color: "#444",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <p style={{ margin: 0 }}>{text}</p>
    </div>
  );
};

export default DecorationIntro;
