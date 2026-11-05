import React from "react";
import "./VenueReviews.css";

const reviews = [
  {
    id: 1,
    name: "Sikha Ahuja",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    text: "You guy did a very great job in preparing everything so quick and making my event happen! Will book next time too.",
    rating: 5,
  },
  {
    id: 2,
    name: "Mohit Sharma",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    text: "You guy did a very great job in preparing everything so quick and making my event happen! Will book next time too.",
    rating: 4,
  },
  {
    id: 3,
    name: "Priya Mehta",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    text: "Amazing experience! The team was professional and the venue looked perfect. Highly recommended.",
    rating: 4,
  },
  {
    id: 4,
    name: "Rahul Verma",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    text: "Super smooth booking and great support. Everything was arranged on time. Will definitely book again.",
    rating: 5,
  },
];

const Star = ({ filled }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill={filled ? "#924286" : "none"}
    stroke={filled ? "#924286" : "#d4c4d2"}
    strokeWidth="1.5"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const VenueReviews = () => {
  return (
    <section className="vr-section">
      <div className="vr-header">
        <h2 className="vr-title">Loved By thousands of happy customers</h2>
        <p className="vr-subtitle">Real reviews from real celebrations</p>
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
              <p className="vr-quote">
                <span className="vr-quote-mark">“</span>
                {item.text}
                <span className="vr-quote-mark">”</span>
              </p>

              <div className="vr-footer">
                <span className="vr-name">{item.name}</span>
                <div className="vr-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} filled={i < item.rating} />
                  ))}
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