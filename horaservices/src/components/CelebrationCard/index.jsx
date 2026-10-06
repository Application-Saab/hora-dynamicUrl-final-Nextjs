import Image from "next/image";
import "./CelebrationCard.css";

const HeartOutline = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
    <path
      d="M12 20.5s-7.2-4.4-9.2-8.8C1.5 8.6 3.2 5.5 6.3 5.5c2 0 3.5 1.1 4.3 2.4h2.8c.8-1.3 2.3-2.4 4.3-2.4 3.1 0 4.8 3.1 3.5 6.2-2 4.4-9.2 8.8-9.2 8.8z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const CelebrationCard = ({
  bg,                       // background image (static import)
  photo,                    // card ki main photo
  photoAlt = "",
  imageSide = "left",       // "left" ya "right"
  title,
  titleIcon = null,         // optional: title ke left ka icon (jaise star)
  subtitle,
  features = [],            // [{ icon: <Icon />, label: "..." }]
  featuresBoxed = false,    // true = features white box mein
  accent = "#c4405f",       // divider, heart, icons ka color
  titleColor = "#c4405f",
  href = "",
}) => {
  const Tag = href ? "a" : "div";
  const linkProps = href ? { href } : {};

  return (
    <div className="cel-wrap">
      <Tag
        {...linkProps}
        className={`cel-card cel-card--${imageSide}`}
        style={{ "--accent": accent, "--title": titleColor }}
      >
        {bg && (
          <Image
            src={bg}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="cel-card__bg"
          />
        )}

        <div className="cel-card__photo">
          <Image
            src={photo}
            alt={photoAlt || title}
            fill
            sizes="(max-width: 768px) 50vw, 300px"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="cel-card__body">
          <h3 className="cel-card__title">
            {titleIcon && <span className="cel-card__title-icon">{titleIcon}</span>}
            {title}
          </h3>

          <div className="cel-card__divider" aria-hidden="true">
            <span className="cel-card__line" />
            <span className="cel-card__heart">
              <HeartOutline />
            </span>
            <span className="cel-card__line" />
          </div>

          <p className="cel-card__subtitle">{subtitle}</p>

          <ul className={`cel-card__feats ${featuresBoxed ? "cel-card__feats--boxed" : ""}`}>
            {features.map((f, i) => (
              <li key={i} className="cel-card__feat">
                <span className="cel-card__feat-icon">{f.icon}</span>
                <span className="cel-card__feat-label">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Tag>
    </div>
  );
};

export default CelebrationCard;