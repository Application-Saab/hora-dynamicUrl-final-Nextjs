import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import "./babycelebrationcard.css"
/**
 * BabyCelebrationCard
 * Styles: Decoration.css ke andar "baby-card" classes (baby-celebrations.css)
 *
 * props:
 *  image    - decoration photo (static import)
 *  icon     - gol coloured icon image (static import)
 *  title    - "Baby Shower"
 *  subtitle - "Celebrate the upcoming arrival"
 *  color    - arrow button ka colour, e.g. "#9b59c4"
 *  href     - click link
 */
export default function BabyCelebrationCard({
  image,
  icon,
  title,
  subtitle,
  color = "#9b59c4",
  href = "#",
}) {
  return (
    <Link
      href={href}
      className="baby-card"
      style={{ "--baby-color": color }}
      aria-label={title}
    >
      <div className="baby-card__photo">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 600px) 46vw, 270px"
            className="baby-card__img"
          />
        )}
      </div>

      <div className="baby-card__body">
        <span className="baby-card__icon">
          {icon && (
            <Image
              src={icon}
              alt=""
              fill
              sizes="80px"
              className="baby-card__icon-img"
            />
          )}
        </span>

        <div className="baby-card__row">
          <div className="baby-card__text">
            <h3 className="baby-card__title">{title}</h3>
            <p className="baby-card__subtitle">{subtitle}</p>
          </div>

          <span className="baby-card__arrow" aria-hidden="true">
            <ChevronRight size="100%" strokeWidth={2.4} />
          </span>
        </div>
      </div>
    </Link>
  );
}