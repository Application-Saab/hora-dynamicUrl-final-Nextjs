import Image from "next/image";
import { useState } from "react";
import "./Chooseyourmoment.css";

const isWeddingCategory = (category) => {
  if (typeof category !== "string") return false;

  const val = category.trim();

  return (
    /(^|-)wedding(-|$)/i.test(val) &&
    !/(^|-)pre-wedding(-|$)/i.test(val)
  );
};

const DEFAULT_MOMENTS = [
  {
    key: "pre-wedding",
    label: "Pre Wedding",
    image: "/images/pre-wedding.jpg",
    accent: "purple",
  },
  {
    key: "haldi-mahandi",
    label: "Haldi & Mahandi",
    image: "/images/haldi-mahandi.jpg",
    accent: "amber",
  },
  {
    key: "wedding",
    label: "Wedding",
    image: "/images/wedding.jpg",
    accent: "rose",
  },
];

const CameraIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M4 8.5C4 7.4 4.9 6.5 6 6.5H8L9.2 4.7C9.4 4.3 9.8 4 10.3 4H13.7C14.2 4 14.6 4.3 14.8 4.7L16 6.5H18C19.1 6.5 20 7.4 20 8.5V17C20 18.1 19.1 19 18 19H6C4.9 19 4 18.1 4 17V8.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12.5"
      r="3.2"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>
);

const MomentCard = ({ moment, isActive, onSelect }) => {
  return (
  <div
  className={`momentCard momentCard--${moment.accent}${isActive ? " momentCard--active" : ""}`}
  onClick={() => onSelect?.(moment)}
>
  <span className="momentCard__imageWrap">
    <Image
      src={moment.image}
      alt={moment.label}
      fill
      sizes="(max-width: 640px) 33vw, 220px"
      className="momentCard__image"
    />
    <span className="momentCard__gradient" aria-hidden="true" />
  </span>

  <span className="momentCard__badge">
    <CameraIcon />
  </span>

  <span className="momentCard__label">{moment.label}</span>
</div>
  );
};

const ChooseYourMoment = ({
  category,
  moments = DEFAULT_MOMENTS,
  activeMoment,
  onSelectMoment,
  title = "Choose Your Moment",
}) => {

  const [internalActive, setInternalActive] = useState(null);
  const isControlled = activeMoment !== undefined && onSelectMoment !== undefined;
  const currentActive = isControlled ? activeMoment : internalActive;

  const handleSelect = (moment) => {
    if (isControlled) {
      onSelectMoment(moment.key);
    } else {
      setInternalActive(moment.key);
    }
  };

  if (!isWeddingCategory(category)) return null;

  return (
    <section className="chooseMoment">
      <div className="chooseMoment__row">
        {moments.map((moment) => (
          <MomentCard
            key={moment.key}
            moment={moment}
            isActive={currentActive === moment.key}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </section>
  );
};

export default ChooseYourMoment;