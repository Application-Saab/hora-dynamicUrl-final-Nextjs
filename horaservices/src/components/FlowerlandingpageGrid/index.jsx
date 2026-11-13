import Image from "next/image";
import Link from "next/link";
import "./flowerlandingpagegrid.css";

export default function FlowerGrid({
  title,
  subtitle,
  themes = [],
  city = "",
  locality = "",
  categorySlug = "flower-decoration",
}) {
  // /{city}/{locality}/flower-decoration/{catValue}  (city/locality ho to hi lagta hai)
  const buildPath = (item) => {
    let path = "";
    if (city) path += `/${String(city).toLowerCase()}`;
    if (locality) path += `/${String(locality).toLowerCase()}`;
    return `${path}/${categorySlug}/${item.catValue.replace(/\s+/g, "-")}`;
  };

  const handleClick = (item) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "flower_decoration_card_clicked",
      title: item.title,
      catValue: item.catValue,
      city: city || "default",
      locality: locality || "default",
    });
  };

  return (
    <>
      {title && <h2 className="fd-heading">{title}</h2>}
      {subtitle && <p className="fd-sub">{subtitle}</p>}

      <div className="fd-grid">
        {themes.map((t) => (
          <Link
            key={t.id}
            href={buildPath(t)}
            className="fd-card"
            aria-label={`${t.title} Decoration`}
            onClick={() => handleClick(t)}
          >
            <Image
              className="fd-card-img"
              src={t.image}
              alt={`${t.title} decoration`}
              fill
              sizes="(max-width: 480px) 50vw, 240px"
            />

            <div className="fd-card-info">
              <Image className="fd-icon" src={t.icon} alt="" width={64} height={64} />

              <div className="fd-text">
                <strong>{t.title}</strong>
                <span>Decoration</span>
              </div>

              <span className="fd-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}