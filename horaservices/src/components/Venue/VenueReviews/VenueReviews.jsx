import React from "react";
import "./VenueReviews.css";
import LeftQuoteIcon from "../../../assets/venue/review_left_quote.svg";
import RightQuoteIcon from "../../../assets/venue/review_Right_quote.svg";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    name: "Aakanksha & Rohan Sharma",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces&q=80",
    text: "Booked this venue for our ring ceremony. The decoration, sound setup, and lighting were spot on! Catering management was very smooth.",
    rating: 5,
  },
  {
    id: 2,
    name: "Vikramaditya Rao",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces&q=80",
    text: "Lawn area was huge and well maintained for our 400+ guests. Parking coordination was seamless. AC banquet cooling could be slightly better.",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Pooja Deshmukh",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces&q=80",
    text: "Celebrated my daughter’s 1st birthday here. Support staff was courteous and food was served piping hot. Everyone appreciated the ambience.",
    rating: 4.5,
  },
  {
    id: 4,
    name: "Ankit Khandelwal",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&q=80",
    text: "Overall good experience for corporate annual dinner. Sound system was great, but the stage setup got delayed by 30 mins during handover.",
    rating: 3.5,
  },
  {
    id: 5,
    name: "Megha Soni",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces&q=80",
    text: "Very beautiful hall with premium aesthetic vibes. Photos turned out gorgeous! Highly recommended for pre-wedding functions.",
    rating: 5,
  },
  {
    id: 6,
    name: "Gaurav Joshi",
    photo:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces&q=80",
    text: "Decent venue with spacious rooms for family stay. Washrooms near the lawn needed more frequent cleaning during peak crowd.",
    rating: 3.5,
  },
];

const Star = ({ fillType, starId }) => {
  const gradientId = `half-star-${starId}`;

  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      stroke="#97538C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {fillType === "half" && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#97538C" />
            <stop offset="50%" stopColor="#f3e8f2" />
          </linearGradient>
        </defs>
      )}
      <path
        fill={
          fillType === "full"
            ? "#97538C"
            : fillType === "half"
              ? `url(#${gradientId})`
              : "#f3e8f2"
        }
        stroke={fillType === "empty" ? "#d4c4d2" : "#97538C"}
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </svg>
  );
};

const VenueReviews = () => {
  return (
    <section className="vr-section">
      <div className="vr-header">
        <h2 className="vr-title">Loved by thousands of happy hosts</h2>
        <p className="vr-subtitle">Real experiences from real celebrations</p>
      </div>

      <div className="vr-scroll">
        {reviews.map((item) => (
          <article key={item.id} className="vr-card">
            <div className="vr-photo-wrap">
              <img
                src={item.photo}
                alt={item.name}
                className="vr-photo"
                loading="lazy"
              />
            </div>

            <div className="vr-body">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex" }}>
                  <Image
                    src={LeftQuoteIcon}
                    alt="“"
                    style={{ marginRight: "6.99px" }}
                    width={13}
                    height={11}
                  />
                  <div>
                    <p className="vr-quote-mark" style={{ margin: "0px", margin: "0px" }}>{item.text}</p>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "end", marginTop : "3.13px" }}>
                  <Image
                    src={RightQuoteIcon}
                    alt="“"
                    style={{ marginBottom: "-10px", marginLeft: "6.99px" }}
                    width={13}
                    height={11}
                  />
                </div>
              </div>

              <div className="vr-footer">
                <span className="vr-name">{item.name}</span>
                <div
                  className="vr-stars"
                  style={{ display: "flex", gap: "2px", alignItems: "center" }}
                >
                  {Array.from({ length: 5 }).map((_, i) => {
                    const diff = item.rating - i;
                    let fillType = "empty";

                    if (diff >= 1) {
                      fillType = "full";
                    } else if (diff >= 0.5) {
                      fillType = "half";
                    }

                    return (
                      <Star
                        key={i}
                        starId={`${item.id}-${i}`}
                        fillType={fillType}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default VenueReviews;
