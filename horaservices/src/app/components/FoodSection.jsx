import { foodData } from "@/utils/homeDumpData/foodData";
import Image from "next/image";
import React from "react";
import FoodIcon from "../../assets/food_icon.png";
import FoodCard from "@/components/FoodCard";

export function FoodSection({ handleTitleClick }) {
  return (
    <section className="container my-2">
      <h1 className="d-flex align-items-center  gap-2 fw-bold text-dark fs-2 fs-md-1">
        <span className="text-purple fw-bold display-5">Food</span>
        <span>
          <Image src={FoodIcon} alt="Food Icon" className="food-icon" />
        </span>
      </h1>

      {/* Desktop view */}
      <div className="row d-none d-md-flex mt-4">
        {foodData.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <FoodCard item={item} onClick={handleTitleClick} />
          </div>
        ))}
      </div>

      <div className="row d-lg-none mt-4">
        <div className="d-flex w-100 gap-1"  >
          {/* Left Side Large Card */}
          <div className="col-6">
            <div className="h-100">
              {foodData.slice(0, 1).map((item) => (
                <div style={{ height: "100%" }}>
                  <FoodCard
                    key={item.id}
                    item={item}
                    onClick={handleTitleClick}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Two Smaller Cards Stacked */}
          <div className="col-6 d-flex flex-column justify-content-between gap-3">
            {foodData.slice(1, 3).map((item) => (
              <FoodCard key={item.id} item={item} onClick={handleTitleClick} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
