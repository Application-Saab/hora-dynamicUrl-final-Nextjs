import "./PhotographyCardSkeleton.css";

const PhotographyCardSkeleton = () => {
  return (
    <div className="photography-skeleton-card shimmer">

      {/* Left Image */}
      <div className="photography-skeleton-image" />

      {/* Right Content */}
      <div className="photography-skeleton-content">

        {/* Title */}
        <div className="photography-skeleton-title" />

        {/* Features Row 1 */}
        <div className="photography-skeleton-feature-row">
          <div className="photography-skeleton-feature" />
          <div className="photography-skeleton-feature" />
          <div className="photography-skeleton-feature" />
        </div>


        {/* Features Row 3 */}
        <div className="photography-skeleton-feature-row">
          <div className="photography-skeleton-feature short" />
          <div className="photography-skeleton-feature short" />
          <div className="photography-skeleton-feature short" />
        </div>

        {/* Bottom Details */}
        <div className="photography-skeleton-details">
          <div className="photography-skeleton-detail" />
          <div className="photography-skeleton-detail" />
          <div className="photography-skeleton-detail" />
        </div>

        {/* Price + Offer */}
        <div className="photography-skeleton-price-row">
          <div className="photography-skeleton-price" />
          <div className="photography-skeleton-old-price" />
          <div className="photography-skeleton-offer" />
        </div>

        {/* Button */}
        <div className="photography-skeleton-button" />

      </div>
    </div>
  );
};

export default PhotographyCardSkeleton;