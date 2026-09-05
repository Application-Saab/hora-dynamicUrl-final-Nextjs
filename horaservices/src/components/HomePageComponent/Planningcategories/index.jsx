"use client";

import "./planningcategories.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import arrowIcon from "@/assets/arrowicon.svg";
import { planningCategories } from "@/utils/HomePageData";

export default function PlanningCategories({ onSelect }) {
  const pathname = usePathname();

  const { city, locality } = useMemo(() => {
    const segments = pathname?.split("/")?.filter(Boolean) || [];

    return {
      city: segments[0] || null,
      locality: segments[1] || null,
    };
  }, [pathname]);

  const buildHref = (path) => {
    if (city && locality) {
      return `/${city}/${locality}${path}`;
    }

    if (city) {
      return `/${city}${path}`;
    }

    return path;
  };

  return (
    <div className="planning">
      <div className="planning-hero">
        <h1>Planning Celebration?</h1>

        <p>
          Pick a category to explore beautiful ideas and make your event
          unforgettable
        </p>
      </div>

      <div className="planning-grid">
        {planningCategories.map((cat) => (
          <Link
            href={buildHref(cat.path)}
            className="planning-card"
            key={cat.title}
            onClick={() => onSelect && onSelect(cat.title)}
          >
            <div className="planning-image">
              <Image
                src={cat.image}
                alt={cat.title}
              />
            </div>

            <div className="planning-body">
              <h3>{cat.title}</h3>
              <p>{cat.subtitle}</p>
            </div>

            <span
              className="planning-arrow"
              aria-hidden="true"
            >
              <Image
                src={arrowIcon}
                alt=""
                className="arrow-plan"
              />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}