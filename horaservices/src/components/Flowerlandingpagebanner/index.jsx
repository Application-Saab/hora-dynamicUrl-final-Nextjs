import Image from "next/image";
import Link from "next/link";
import "./flowerlandingpagebanner.css";

import bgImg from "@/assets/flowerbanner/flowerbannerbg.webp";
import collageImg from "@/assets/flowerbanner/flowerbannercollage.webp";

export default function FlowerBanner({
  href = "/flower-decoration",
  eyebrow = "Made for beautiful Moments",
  title = "Flower Decoration",
  subtitle = "Decorations that make your bond even more special",
  buttonText = "Explore Now",
  background = bgImg,
  collage = collageImg,
}) {
  return (
    <section className="flower-banner">
        <div className="flower-banner__card">
          <Image
            src={background}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="flower-banner__bg"
            priority
          />

          <div className="flower-banner__content">
            <div className="flower-banner__head">
              <p className="flower-banner__eyebrow">{eyebrow}</p>
              <h2 className="flower-banner__title">{title}</h2>
              <p className="flower-banner__subtitle">{subtitle}</p>
            </div>

            <Image
              src={collage}
              alt="Flower decoration collage – floral arch, haldi stage, mehendi and backdrop setups"
              sizes="(max-width: 768px) 92vw, 560px"
              className="flower-banner__collage"
            />

            <Link href={href} className="flower-banner__btn">
              <span>{buttonText}</span>
              <svg
                className="flower-banner__arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
      </div>
    </section>
  );
}