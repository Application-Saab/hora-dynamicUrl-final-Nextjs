import "./birthdaybanner.css";

import Image from "next/image";
import Link from "next/link";
import bgImage from "@/assets/landing-birthday-banner-bg.webp";

/* ---------- 4 line-icons (white, drawn on a 24x24 grid) ---------- */
const Balloon = () => (
  <>
    <path d="M12 2.6c3.3 0 5.6 2.6 5.6 5.9 0 3.7-2.9 6.7-5.6 7.9-2.7-1.2-5.6-4.2-5.6-7.9 0-3.3 2.3-5.9 5.6-5.9z" />
    <path d="M11 16.6h2l-1 1.4z" />
    <path d="M12 18c-1.2 1.4 1.2 2.4 0 4" />
    <path d="M9.3 6.3c.5-1 1.3-1.6 2.2-1.8" />
  </>
);
const Diamond = () => (
  <>
    <path d="M6.6 4h10.8l4.1 5.4L12 20.8 2.5 9.4z" />
    <path d="M2.5 9.4h19" />
    <path d="M9.2 4 7.2 9.4 12 20.8l4.8-11.4L14.8 4" />
    <path d="M9.2 4 12 9.4 14.8 4" />
  </>
);
const Camera = () => (
  <>
    <rect x="2.4" y="7" width="19.2" height="13" rx="2.6" />
    <path d="M8 7l1.5-2.6h5L16 7" />
    <circle cx="12" cy="13.5" r="3.9" />
    <circle cx="18.2" cy="10" r=".6" />
  </>
);
const Popper = () => (
  <>
    <path d="M3 21.2 8 8l8.2 8.2z" />
    <path d="M6.2 15.6l5 5" />
    <path d="M11.5 4.5 12.3 2" />
    <path d="M14.5 7.5l2.2-1.3" />
    <path d="M16.2 11l3-.6" />
    <path d="M17 4.4v.01M20.2 7.4v.01M13 1.2v.01" />
  </>
);

const FEATURES = [
  { Icon: Balloon, color: "#f5559b", lines: ["Creative", "Themes"] },
  { Icon: Diamond, color: "#a46bd9", lines: ["Premium", "Decor"] },
  { Icon: Camera, color: "#20c4c0", lines: ["Picture", "Perfect"] },
  { Icon: Popper, color: "#f5559b", lines: ["Memories", "That Last"] },
];

/* pink "burst" ticks beside the first heading line */
function Sparkle({ side = "left" }) {
  return (
    <svg
      className={`bb-sparkle bb-sparkle--${side}`}
      viewBox="0 0 22 28"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
        <path d="M17 3 L10 1" />
        <path d="M19 14 L4 14" />
        <path d="M17 25 L10 27" />
      </g>
    </svg>
  );
}

export default function BirthdayBanner({ href = "/birthday-decoration" }) {
  return (
    <section className="birthday-banner" aria-labelledby="birthday-banner-title">
      <Link
      href={href}
      className="birthday-banner"
      aria-labelledby="birthday-banner-title"
    >
      <div className="bb-frame">
        {/* balloons + rainbow backdrop + gradient curve (all in one image) */}
        <figure className="bb-figure">
          <Image
            className="bb-figure__img"
            src={bgImage}
            alt="Rainbow foil curtain backdrop with pastel balloon garland, cake table and Happy Birthday neon sign"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </figure>

        <div className="bb-content">
          <header className="bb-header">
            <h1 id="birthday-banner-title" className="bb-title">
              <span className="bb-title__script">
                <Sparkle side="left" />
                Make Every Birthday
                <Sparkle side="right" />
              </span>{" "}
              <span className="bb-title__big">Unforgettable</span>
            </h1>

            <div className="bb-dots" role="separator" aria-hidden="true">
              <svg className="bb-dots__heart" viewBox="0 0 24 22" focusable="false">
                <path
                  d="M12 21C4 15 1.5 11 1.5 7.4 1.5 4.3 3.9 2 6.8 2c2.3 0 4.2 1.3 5.2 3.4C13 3.3 14.9 2 17.2 2c2.9 0 5.3 2.3 5.3 5.4C22.5 11 20 15 12 21z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <p className="bb-subtitle">Beautiful Decorations for a Perfect Celebration!</p>
          </header>

          <ul className="bb-features">
            {FEATURES.map(({ Icon, color, lines }) => (
              <li className="bb-feature" key={lines.join(" ")}>
                <span className="bb-feature__icon" style={{ background: color }}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <Icon />
                  </svg>
                </span>
                <p className="bb-feature__label">
                  <span>{lines[0]}</span>
                  <span>{lines[1]}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </Link>
    </section>
  );
}