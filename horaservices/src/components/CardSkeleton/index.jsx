import Image from "next/image";
import dummyImage from "../../assets/dummyPlaceholder.webp";
const CardSkeleton = () => {
  return (
    <div className="card-skeleton">
      <div className="skeleton-image-wrapper">
        <Image
          className="skeleton-image"
          src={dummyImage}
          alt="loading"
          height={150}
          width={300}
        />
      </div>
      <div className="skeleton-body">
        <div className="skeleton-title shimmer" />
        <div className="skeleton-line shimmer" />
        <div className="skeleton-line short shimmer" />
        <div className="skeleton-line medium shimmer" />
      </div>
    </div>
  );
};

export default CardSkeleton;
