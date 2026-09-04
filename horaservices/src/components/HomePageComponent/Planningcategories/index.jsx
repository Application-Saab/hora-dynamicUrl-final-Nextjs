"use client";
import "./planningcategories.css";
import venueImg from "@/assets/Homepageimages/cat-venue.webp";
import decorationImg from "@/assets/Homepageimages/cat-decoration.webp";
import photographyImg from "@/assets/Homepageimages/cat-photography.webp";
import foodDeliveryImg from "@/assets/Homepageimages/cat-food-delivery.webp";
import chefImg from "@/assets/Homepageimages/cat-chef.webp";
import cateringImg from "@/assets/Homepageimages/cat-catering.webp";
import fireworksImg from "@/assets/Homepageimages/cat-fireworks.webp";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import arrowIcon from "@/assets/arrowicon.svg";

const categories = [
  {
    title: "Venue",
    subtitle: "Banquet Halls, Farmhouse & more.",
    image: venueImg,
    path: "/venue-list",
  },
  {
    title: "Decoration",
    subtitle: "Balloons, Light & beautiful setups",
    image: decorationImg,
    path: "/balloon-decoration",
  },
  {
    title: "Photography",
    subtitle: "Capture moments, cherish forever",
    image: photographyImg,
    path: "/photography-page",
  },
  {
    title: "Food Delivery",
    subtitle: "Delicious food, delivered to you",
    image: foodDeliveryImg,
    path: "/party-food-delivery-live-catering-buffet?type=bulkFood",
  },
  {
    title: "Chef for Party",
    subtitle: "Hire expert chefs for your special menu",
    image: chefImg,
    path: "/book-chef-cook-for-party",
  },
  {
    title: "Food Catering",
    subtitle: "Catering service for any size of event",
    image: cateringImg,
    path: "/party-food-delivery-live-catering-buffet?type=liveCatering",
  },
  {
    title: "Celebration Boosters",
    subtitle: "Balloons, Light & beautiful setups",
    image: fireworksImg,
    path: "/celebration-boosters",
  },
];

export default function PlanningCategories({ onSelect }) {
  const pathname = usePathname();

  // HomeContent / VenueFinder jaisa hi city/locality nikaalne ka logic
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
    <div className="planning">
      <div className="planning-hero">
        <h1>Planning Celebration?</h1>
        <p>Pick a category to explore beautiful ideas and make your event unforgettable</p>
      </div>

      <div className="planning-grid">
        {categories.map((cat) => (
          <Link
            href={buildHref(cat.path)}
            className="planning-card"
            key={cat.title}
            onClick={() => onSelect && onSelect(cat.title)}
          >
            <div className="planning-image">
              <Image src={cat.image} alt={cat.title} />
            </div>
            <div className="planning-body">
              <h3>{cat.title}</h3>
              <p>{cat.subtitle}</p>
            </div>
            <span className="planning-arrow" aria-hidden="true">
              <Image src={arrowIcon} alt="" className="arrow-plan" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}