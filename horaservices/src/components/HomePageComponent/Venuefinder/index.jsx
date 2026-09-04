"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import "./VenueFinder.css";
import { venueData } from "@/utils/venueCircleData"; // apna actual path daal dena
import arrowIcon from "@/assets/arrowicon.svg";

// "all" ko scroller me nahi dikhana, baaki sab venues dikhayenge
const venues = venueData.filter((v) => v.id !== "all");

export default function VenueFinder({ onSelectVenue }) {
  const pathname = usePathname();

  const { city, locality } = useMemo(() => {
    const segments = pathname?.split("/")?.filter(Boolean) || [];
    return {
      city: segments[0] || null,
      locality: segments[1] || null,
    };
  }, [pathname]);

  const buildHref = (path) => {
    if (city && locality) return `/${city}/${locality}${path}`;
    if (city) return `/${city}${path}`;
    return path;
  };

  return (
    <div className="venue-finder">
      <div className="venue-hero">
        <h1>Find the Perfect Venue For Your Event</h1>
        <p>Book the Best Venues for your unforgettable events</p>
      </div>

      <div className="venue-scroll">
        {venues.map((v) => (
          <Link
            href={buildHref(v.path || `/venue-list?category=${v.id}`)}
            className="venue-card"
            key={v.id}
            onClick={() => onSelectVenue && onSelectVenue(v.id)}
          >
            <Image className="venue-image" src={v.img} alt={v.label} />
            <div className="venue-label">
              <span>{v.label}</span>
              <span className="venue-arrow" aria-hidden="true">
                <Image
                  src={arrowIcon}
                  alt=""
                  width={24}
                  height={24}
                  className="arrow-venue"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link href={buildHref("/venue-list")} className="venue-cta">
        View All Venues
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}