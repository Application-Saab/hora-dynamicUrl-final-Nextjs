import Image from "next/image";
import { useRouter } from "next/router";
import "./photoGraphycard.css";

export default function PhotoGraphyCard({ src, title, subCategory }) {
  const router = useRouter();

  // ✅ Correctly pass the subCategory on click
  const handleViewMore = () => {
    if (!subCategory) return; // safety check
    router.push(`/photography-page/${subCategory}`);
  };

  return (
    <div className="photo-card">
      <div className="photo-imageWrapper">
        <Image src={src} alt={title} fill className="photo-image" priority />
        <div className="photo-imageOverlay"></div>
        <div className="photo-titleWrapper">
          <h3 className="photo-title">{title}</h3>
        </div>
      </div>
      <div className="photo-footer">
        <button className="photo-viewMore" onClick={handleViewMore}>
          View more
        </button>
      </div>
    </div>
  );
}
