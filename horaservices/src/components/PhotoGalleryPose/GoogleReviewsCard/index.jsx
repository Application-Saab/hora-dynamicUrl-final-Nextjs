import "./googlereviewscard.css";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import googleLogo from "@/assets/review/google.svg";

const GoogleReviewsCard = ({
  rating = "4.9",
  totalReviews = "2,500+ Reviews",
  heading = "Loved By thousands of happy customers",
  reviews = [],
}) => {
  return (
    <div className="gr-card">
      <div className="gr-header">
        <Image
          src={googleLogo}
          alt="Google"
          width={56}
          height={56}
        />

        <div>
          <h3 className="gr-title">Google Reviews</h3>

          <div className="gr-rating-row">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="gr-star" />
            ))}

            <span className="gr-rating">
              {rating} ({totalReviews})
            </span>
          </div>
        </div>
      </div>

      <h4 className="gr-heading">{heading}</h4>

      <div className="gr-reviews">
        {reviews.map((item, index) => (
          <div className="gr-review-card" key={index}>
            <div className="gr-image-wrap">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="gr-image"
              />
            </div>

            <div className="gr-content">
              <div className="gr-quote">❝</div>

              <p className="gr-text">{item.review}</p>

              <div className="gr-footer">
                <span>{item.name}</span>

                <div className="gr-stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleReviewsCard;