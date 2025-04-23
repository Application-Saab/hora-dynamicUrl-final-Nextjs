"use client";
import Image from "next/image";
import React from "react";
import DecorationIcon from "../../assets/decoration_icon.webp";
import PhotographyIcon from "../../assets/photography_icon.webp";
import { useRouter } from "next/navigation";

const ServiceSection = () => {
  const router = useRouter();

  const handleClick = (type) => {
    if (type === "photography") {
      window.dataLayer?.push({
        event: "photography_button_click",
        photography_button_id: "photography_button",
      });
      router.push("/photography-page");
    } else if (type === "decoration") {
      window.dataLayer?.push({
        event: "decoration_button_click",
        custom_button_id: "decoration_button",
      });
      router.push("/balloon-decoration");
    }
  };

  return (
    <div className="container mt-3 mb-5">
      <div className="row g-4 align-items-center">
        {/* Photography Section */}
        <div className="col-12 col-md-6">
          <div className="text-start mb-3 d-flex align-items-center">
            <h2 className="h3 text-purple fw-bold display-5  mb-0">
              Photography
            </h2>
            <Image
              src={PhotographyIcon}
              alt="Photography Icon"
              width={40}
              height={40}
              className="ms-2"
            />
          </div>
          <div
            className="position-relative rounded overflow-hidden shadow-sm"
            role="button"
            onClick={() => handleClick("photography")}
            type="button"
          >
            <Image
              src="https://horaservices.com/api/uploads/homepage_photography.webp"
              alt="Photography"
              className="img-fluid w-100"
              width={600}
              height={400}
            />
            <button
              className="btn btn-danger position-absolute bottom-0 start-0 m-3 px-4 py-2 fw-semibold"
              id="home-photography-sec"
              onClick={() => handleClick("photography")}
              type="button"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Decoration Section */}
        <div className="col-12 col-md-6">
          <div className="text-start mb-3 d-flex align-items-center">
            <h2 className="h3 text-purple fw-bold display-5 mb-0">
              Decoration
            </h2>
            <Image
              src={DecorationIcon}
              alt="Decoration Icon"
              width={40}
              height={40}
              className="ms-2"
            />
          </div>
          <div
            className="position-relative rounded overflow-hidden shadow-sm"
            onClick={() => handleClick("decoration")}
            role="button"
            type="button"
          >
            <Image
              src="https://horaservices.com/api/uploads/homepage_decoration.webp"
              alt="Decoration"
              className="img-fluid w-100"
              width={600}
              height={400}
            />
            <button
              className="btn btn-danger position-absolute bottom-0 start-0 m-3 px-4 py-2 fw-semibold"
              id="home-decoration-sec"
              onClick={() => handleClick("decoration")}
              type="button"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ServiceSection);
