import "./Actionbuttons.css";
import Image from "next/image";


import arrowIcon from "@/assets/ArrowIcons.svg";
import searchIcon from "@/assets/searchIcon.svg";
import customiseStar from "@/assets/customistaionStar.svg"
import customiseBg from "@/assets/custombg.webp";

export default function ActionButtons({
  handleCustomise,
  catValue,
  cityName,
  product,
  similarRef,
}) {
  return (
    <div className="action-buttons-row">
      {/* ===== Customize Design Button ===== */}
      <button
        type="button"
        className="customize-design-btn"
        onClick={() => handleCustomise(catValue, cityName)}
      >
        {/* Background sparkle image (JSX से) */}
        <Image
          src={customiseBg}
          alt=""
            fill
          priority
          className="customize-bg-image"
        />

        <span className="icon-circle">
          {/* star icon -> बड़ा icon class */}
          <Image
            src={customiseStar}
            alt="Customisation Icon"
            className="button-main-icon"
            width={30}
            height={30}
          />
        </span>

        <span className="btn-text-col">
          <span className="btn-title">Customize Design</span>
          <span className="btn-subtitle">Make it unique & personal</span>
        </span>

        <span className="arrow-circle">
          {/* arrow icon -> छोटा icon class */}
          <Image
            src={arrowIcon}
            alt="Arrow Icon"
            className="button-arrow-icon"
            width={40}
            height={40}
          />
        </span>
      </button>

      {/* ===== View Similar Button ===== */}
      <button
        type="button"
        className="view-similar-btn-new"
        onClick={() => {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "view_similar_click",
            eventCategory: "Product Details Page",
            eventAction: "View Similar Button Click",
            eventLabel: product?.name,
            product_name: product?.name,
            category: catValue,
            price: product?.price,
          });
          similarRef?.current?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="icon-circle">
         
          <Image
            src={searchIcon}
            alt="Search Icon"
            className="button-main-icon"
           width={40}
           height={40}
          />
        </span>

        <span className="btn-text-col">
          <span className="btn-title">View Similar</span>
          <span className="btn-subtitle">See similar decoration ideas</span>
        </span>

        <span className="arrow-circle">
          {/* arrow icon -> छोटा icon class */}
          <Image
            src={arrowIcon}
            alt="Arrow Icon"
            className="button-arrow-icon"
            width={40}
            height={40}
          />
        </span>
      </button>
    </div>
  );
}