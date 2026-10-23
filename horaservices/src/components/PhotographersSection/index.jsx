import Image from "next/image";
import Link from "next/link";
import "./photographerssection.css";
import React from "react";
import arrowImg from "@/assets/arrowicon.svg"
// Abhi static data, baad me API se aayega
const STATIC_PHOTOGRAPHERS = [
  { id: 1, name: "Yash Parmar", rating: 4.9, image: "/images/photographers/yash.jpg", slug: "yash-parmar" },
  { id: 2, name: "Vijay Mehta", rating: 4.9, image: "/images/photographers/vijay.jpg", slug: "vijay-mehta" },
  { id: 3, name: "Arjun Thakur", rating: 4.9, image: "/images/photographers/arjun.jpg", slug: "arjun-thakur" },
  { id: 4, name: "Kish Jain", rating: 4.8, image: "/images/photographers/kish.jpg", slug: "kish-jain" },
  { id: 5, name: "Rohit Sharma", rating: 4.7, image: "/images/photographers/rohit.jpg", slug: "rohit-sharma" },
];

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  return (
    <div className="ph-rating" aria-label={`Rating ${rating} out of 5`}>
      <span className="ph-stars" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < full ? "ph-star ph-star--on" : "ph-star"}>
            ★
          </span>
        ))}
      </span>
      <span className="ph-ratingNum">{rating}</span>
    </div>
  );
};

const PhotographerCard = ({ name, rating, image, slug }) => (
  <div className="ph-card">
    <div className="ph-avatar">
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 768px) 25vw, 120px"
        className="ph-avatarImg"
      />
    </div>

    <h3 className="ph-name">{name}</h3>
    <Stars rating={rating} />

    <Link href={`/photographer/${slug}`} className="ph-btn">
      View Profile
      <Image
        src={arrowImg}
        alt=""
        width={14}
        height={14}
        className="ph-arrowImg"
        aria-hidden="true"
      />
    </Link>
  </div>
);

const PhotographersSection = ({ photographers = STATIC_PHOTOGRAPHERS }) => {
  return (
    <section className="ph-section">
      <h2 className="ph-heading">
        <span className="ph-headingIcon" aria-hidden="true">📷</span>
        Photographers
      </h2>

      <div className="ph-list">
        {photographers.map((p) => (
          <PhotographerCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
};

export default React.memo(PhotographersSection);