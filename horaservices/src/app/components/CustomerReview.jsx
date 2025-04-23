import { customerReview } from "@/utils/homeDumpData/customerReview";
import dynamic from "next/dynamic";
import Image from "next/image";
import React from "react";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

 function CustomerReview() {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container text-center my-5">
      <h2 className="fw-bold display-5 mb-4">Customer Review</h2>
      <Slider {...settings}>
        {customerReview.map(({ id, name, image, rating, review }) => (
          <div key={id} className="card p-3 shadow-sm border-0">
            <div className="d-flex align-items-center mb-3">
              <Image
                src={image}
                alt={name}
                width={50}
                height={50}
                className="rounded-circle me-3"
              />
              <div className="text-start">
                <h5 className="mb-1">{name}</h5>
                <div className="text-warning small">{"⭐".repeat(rating)}</div>
              </div>
            </div>
            <p className="text-muted small text-start mb-0">{review}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default React.memo(CustomerReview);

