import Image from "next/image";
import "./Banner.css";

const Banner = ({
  image,
  alt = "Banner",
  href = "",
  border = "none", // jaise "1px solid #97538C"
  width = 2048,
  height = 712,
}) => {
  if (!image) return null;

  const isStatic = typeof image !== "string";

  const img = (
    <Image
      src={image}
      alt={alt}
      {...(isStatic ? {} : { width, height })}
      priority
      sizes="(max-width: 768px) 100vw, 1200px"
      className="hora-banner__img"
      style={{ border }}
    />
  );

  return (
    <div className="hora-banner-outer">
      <div className="page-width">
        {href ? (
          <a href={href} className="hora-banner">
            {img}
          </a>
        ) : (
          <div className="hora-banner">{img}</div>
        )}
      </div>
    </div>
  );
};

export default Banner;