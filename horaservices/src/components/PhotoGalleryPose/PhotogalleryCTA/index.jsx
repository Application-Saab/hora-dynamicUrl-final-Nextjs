import Image from "next/image";

const PhotogalleryCTA = ({
  image1,
  image2,
  title = "Found poses you like ?",
  description = "Book now & let our photographers capture these beautiful moments.",
  buttonText = "Book Now",
  rating = "4.9 (1200+ Reviews)",
  weddings = "2500+ Weddings",
  photographers = "100+ Expert Photographers",
  onBookNow,
}) => {
  return (
    <div className="photo-cta-card">
      <div className="photo-cta-top">
        <div className="photo-cta-images">
          <div className="photo-thumb">
            <Image src={image1} alt="Pose 1" fill />
          </div>

          <div className="photo-thumb">
            <Image src={image2} alt="Pose 2" fill />
          </div>
        </div>

        <div className="photo-cta-content">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <button className="photo-book-btn" onClick={onBookNow}>
          {buttonText} <span>›</span>
        </button>
      </div>

      <div className="photo-divider" />

      <div className="photo-stats">
        <span>⭐ {rating}</span>
        <span>📸 {weddings}</span>
        <span>👤 {photographers}</span>
      </div>
    </div>
  );
};

export default PhotogalleryCTA;