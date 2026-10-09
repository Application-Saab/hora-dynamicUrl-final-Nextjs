import "./decorationlandingtopbanner.css";

import bgImage from "@/assets/landing-top-banner-bg.webp";
import iconDesigns from "@/assets/icon-designs.svg";
import iconSetup from "@/assets/icon-setup.svg";
import iconCelebrations from "@/assets/icon-celebrations.svg";
import iconWhatsapp from "@/assets/icon-whatsapp.svg";
import Image from "next/image";

const FEATURES = [
  { icon: iconDesigns, strong: "2000+", text: "Designs" },
  { icon: iconSetup, strong: "Setup in", text: "2 Hours" },
  { icon: iconCelebrations, strong: "10000+", text: "Celebrations" },
  { icon: iconWhatsapp, strong: "WhatsApp &", text: "Call Support" },
];

/* Small "burst" ticks that sit beside the heading / icons */
function Sparkle({ side = "left", className = "" }) {
  return (
    <svg
      className={`hb-sparkle hb-sparkle--${side} ${className}`}
      viewBox="0 0 20 26"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round">
        <path d="M15 4 L6 1.5" />
        <path d="M17 13 L4 13" />
        <path d="M15 22 L6 24.5" />
      </g>
    </svg>
  );
}

function Divider({ className = "" }) {
  return (
    <div className={`hb-divider ${className}`} role="separator" aria-hidden="true">
      <span className="hb-divider__line" />
      <svg className="hb-divider__heart" viewBox="0 0 24 22" focusable="false">
        <path
          d="M12 20.5 C4 14.5 2 10.5 2 7.5 C2 4.5 4.3 2.5 6.8 2.5 C9 2.5 10.9 3.8 12 5.8 C13.1 3.8 15 2.5 17.2 2.5 C19.7 2.5 22 4.5 22 7.5 C22 10.5 20 14.5 12 20.5 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <span className="hb-divider__line" />
    </div>
  );
}

export default function HoraBanner() {
  return (
    <section className="hora-banner" aria-labelledby="hora-banner-title">
      <div className="hb-frame">
        {/* Decor photo + purple curve + lavender panel */}
        <figure className="hb-figure">
          <Image
            className="hb-figure__img"
            src={bgImage}
            alt="Round floral arch with white drapes, fairy lights and a tufted bench"
            width="2048"
            height="712"
            fetchpriority="high"
          />
        </figure>

        <div className="hb-content">
          <header className="hb-header">
            <Sparkle side="left" className="hb-header__spark hb-header__spark--l" />
            <h1 id="hora-banner-title" className="hb-title">
              <span className="hb-title__line1">Your Celebrations,</span>
              <span className="hb-title__line2">Our Commitment</span>
            </h1>
            <Sparkle side="right" className="hb-header__spark hb-header__spark--r" />
          </header>

          <Divider />

          <ul className="hb-features">
            {FEATURES.map(({ icon, strong, text }) => (
              <li className="hb-feature" key={strong}>
                <span className="hb-feature__icon">
                  <Sparkle side="left" />
                  <Image src={icon} alt="" width="39" height="39" />
                  <Sparkle side="right" />
                </span>
                <p className="hb-feature__label">
                  <strong>{strong}</strong>
                  <span>{text}</span>
                </p>
              </li>
            ))}
          </ul>

          <footer className="hb-footer">
            <Divider className="hb-divider--footer" />
            <p className="hb-tagline">
              <Sparkle side="left" />
              <em>Let&rsquo;s Plan Your Special Day</em>
              <Sparkle side="right" />
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
}