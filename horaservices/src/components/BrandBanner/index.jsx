"use client";

import Image from "next/image";
import "./BrandBanner.css";

const BrandBanner = ({ title, items }) => {
  return (
    <div className="brandBanner">
      <div className="page-width">
        <h2 className="brandBanner-heading">{title}</h2>
        <div className="brandBanner-grid">
          {items.map((item, index) => (
            <div className="brandBanner-card" key={index}>
              <Image src={item.img} alt={item.alt} width={60} height={60} />
              <p className="brandBanner-bold">{item.bold}</p>
              <p className="brandBanner-sub">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandBanner;
