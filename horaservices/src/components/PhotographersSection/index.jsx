import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import "./photographerssection.css";
import arrowImg from "@/assets/arrowicon.svg";

const API_URL = "https://horaservices.com/api/users/get-suppliers";
const S3_PROFILE_BASE =
  "https://photography-hora.s3.eu-north-1.amazonaws.com/user-profile";
const FALLBACK_AVATAR = "/images/photographers/default.jpg"; // public folder me rakhna
const DEFAULT_CITY = "bangalore";

const toCitySlug = (city) =>
  (city || DEFAULT_CITY).toString().trim().toLowerCase().replace(/\s+/g, "-");

const getAvatarUrl = (id) =>
  id ? `${S3_PROFILE_BASE}/${id}/${id}/avatar.webp` : FALLBACK_AVATAR;

const getDisplayName = (s) =>
  (s?.name || `${s?.firstName || ""} ${s?.lastName || ""}`).trim() ||
  "Photographer";

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

const PhotographerCard = ({ name, rating, image, href }) => {
  const [src, setSrc] = useState(image);

  return (
    <div className="ph-card">
      <div className="ph-avatar">
        <img
          src={src}
          alt={name}
          loading="lazy"
          className="ph-avatarImg"
          onError={() => {
            if (src !== FALLBACK_AVATAR) setSrc(FALLBACK_AVATAR);
          }}
        />
      </div>

      <h3 className="ph-name">{name}</h3>
      {rating ? <Stars rating={rating} /> : null}

      <Link href={href} className="ph-btn">
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
};

const CardSkeleton = () => (
  <div className="ph-card ph-card--skeleton" aria-hidden="true">
    <div className="ph-avatar" />
    <div className="ph-name">&nbsp;</div>
  </div>
);

const PhotographersSection = ({ city = null }) => {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        // Sirf wahi hataye jinki _id nahi hai (link nahi ban sakta). Baaki sab dikhenge.
        const list = (json?.data || []).filter((s) => s?._id);
        setPhotographers(list);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Photographers fetch failed:", err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const citySlug = toCitySlug(city);

  if (!loading && photographers.length === 0) return null;

  return (
    <section className="ph-section">
      <h2 className="ph-heading">
        <span className="ph-headingIcon" aria-hidden="true">📷</span>
        Photographers
      </h2>

      <div className="ph-list">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : photographers.map((p) => (
              <PhotographerCard
                key={p._id}
                name={getDisplayName(p)}
                rating={p.rating}
                image={getAvatarUrl(p._id)}
                href={`/${citySlug}/photographerprofile/${p._id}`}
              />
            ))}
      </div>
    </section>
  );
};

export default React.memo(PhotographersSection);