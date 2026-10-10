import "./birthdaymagicalbanner.css";

import Image from "next/image";
import Link from "next/link";
import bgImage from "@/assets/landing-birthday-magical-bg.webp";

/* ---------- 4 line-icons (drawn on a 24x24 grid) ---------- */
const Balloon = () => (
  <>
    <path d="M11 2.8c3 0 5 2.4 5 5.3 0 3.3-2.6 6-5 7-2.4-1-5-3.7-5-7 0-2.9 2-5.3 5-5.3z" />
    <path d="M10 15.3h2l-1 1.3z" />
    <path d="M11 16.6c-1.2 1.4 1.2 2.4 0 4.4" />
    <path d="M19 15v.01M17.5 18.5v.01M20.5 11.5v.01" />
  </>
);
const Bouquet = () => (
  <>
    <circle cx="12" cy="7.2" r="2.3" />
    <circle cx="8" cy="9.5" r="1.9" />
    <circle cx="16" cy="9.5" r="1.9" />
    <circle cx="9.8" cy="5" r="1.3" />
    <circle cx="14.3" cy="4.8" r="1.3" />
    <path d="M8.2 13h7.6l-1 7.8H9.2z" />
    <path d="M12 11.5V13" />
  </>
);
const Camera = () => (
  <>
    <rect x="2.6" y="7" width="18.8" height="13" rx="2.4" />
    <path d="M8 7l1.5-2.6h5L16 7" />
    <circle cx="12" cy="13.5" r="3.8" />
    <circle cx="18" cy="10" r=".5" />
  </>
);
const Popper = () => (
  <>
    <path d="M3 21 8 8l8.2 8.2z" />
    <path d="M6.2 15.6l5 5" />
    <path d="M11.5 4.5 12.3 2" />
    <path d="M14.5 7.5l2.2-1.3" />
    <path d="M16.2 11l3-.6" />
    <path d="M17 4.4v.01M20.2 7.4v.01" />
  </>
);

const FEATURES = [
  { Icon: Balloon, lines: ["Creative", "Themes"] },
  { Icon: Bouquet, lines: ["Premium", "Decor"] },
  { Icon: Camera, lines: ["Picture", "Perfect"] },
  { Icon: Popper, lines: ["Memories", "That Last"] },
];

/* pink "burst" ticks beside "Make Your" */
function Sparkle({ side = "left" }) {
  return (
    <svg
      className={`bm-sparkle bm-sparkle--${side}`}
      viewBox="0 0 22 28"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <path d="M17 3 L10 1" />
        <path d="M19 14 L4 14" />
        <path d="M17 25 L10 27" />
      </g>
    </svg>
  );
}

function Star() {
  return (
    <svg className="bm-divider__star" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 1.5l2.8 6.7 7.2.6-5.5 4.7 1.7 7-6.2-3.8-6.2 3.8 1.7-7L2 8.8l7.2-.6z"
      />
    </svg>
  );
}

function Heart() {
  return (
    <svg className="bm-heart" viewBox="0 0 26 24" aria-hidden="true" focusable="false">
      <path
        d="M13 21.5C5 15.5 2 11.5 2 7.6 2 4.5 4.4 2.3 7.2 2.3c2.3 0 4.3 1.3 5.8 3.7 1.5-2.4 3.5-3.7 5.8-3.7 2.8 0 5.2 2.2 5.2 5.3 0 3.9-3 7.9-11 13.9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BirthdayMagicalBanner({href = "/birthday-decoration"}) {
  return (
    <section className="bm-banner" aria-labelledby="bm-banner-title">
        <Link
      href={href}
      className="bm-banner"
      aria-labelledby="bm-banner-title"
    >
      <div className="bm-frame">
        {/* pink balloon arch + soft cream panel (one image) */}
        <figure className="bm-figure">
          <Image
            className="bm-figure__img"
            src={bgImage}
            alt="Pink and rose gold balloon arch with fairy-light curtain, Happy Birthday neon sign and cake table"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </figure>

        <div className="bm-content">
          <header className="bm-header">
            <h1 id="bm-banner-title" className="bm-title">
              <span className="bm-title__small">
                <Sparkle side="left" />
                Make Your
                <Sparkle side="right" />
              </span>{" "}
              <span className="bm-title__row">
                <span className="bm-title__bold">Birthday</span>{" "}
                <span className="bm-title__script">Magical</span>
                <Heart />
              </span>
            </h1>

            <div className="bm-divider" role="separator" aria-hidden="true">
              <span className="bm-divider__line" />
              <Star />
              <span className="bm-divider__line" />
            </div>

            <p className="bm-subtitle">Beautiful Decorations for Unforgettable Celebrations</p>
          </header>

          <ul className="bm-features">
            {FEATURES.map(({ Icon, lines }) => (
              <li className="bm-feature" key={lines.join(" ")}>
                <span className="bm-feature__icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <Icon />
                  </svg>
                </span>
                <p className="bm-feature__label">
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