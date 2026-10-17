import Image from "next/image";
import "./WeddingBanner.css";

const WeddingBanner = ({
  image,                                      // static import ya URL string
  alt = "Wedding Decorations",
  href = "",                                  // optional: dena ho to banner clickable ho jayega
  border = "none",                            // jaise "1px solid #97538C"
  title = "Wedding",
  script = "Decorations",
  count = "650+",
  countLabel = "Stunning Designs",
  tagline = "Make your special day unforgettable",
}) => {
  if (!image) return null;

  const isStatic = typeof image !== "string";

  const card = (
    <div className="wed-banner" style={{ border }}>
      <Image
        src={image}
        alt={alt}
        fill
        {...(isStatic ? {} : { unoptimized: false })}
        sizes="(max-width: 768px) 100vw, 600px"
        className="wed-banner__img"
      />

      {/* left side ka purple gradient */}
      <div className="wed-banner__overlay" />

      <div className="wed-banner__content">
        <h2 className="wed-banner__title">{title}</h2>
        <span className="wed-banner__script">{script}</span>
        <p className="wed-banner__count">
          <b>{count}</b> {countLabel}
        </p>
        <p className="wed-banner__tagline">{tagline}</p>
      </div>
    </div>
  );

  return (
    <div className="wed-banner-outer">
      <div className="page-width">
        <div className="wed-banner-wrap">
          {href ? (
            <a href={href} className="wed-banner-link">
              {card}
            </a>
          ) : (
            card
          )}
        </div>
      </div>
    </div>
  );
};

export default WeddingBanner;