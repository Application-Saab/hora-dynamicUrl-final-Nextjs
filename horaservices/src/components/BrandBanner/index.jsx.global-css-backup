"use client";

import Image from "next/image";
import "./BrandBanner.css";
import React from "react";

const BrandBanner = ({ title, items }) => {
  return (
    <div className="brandBanner">
     
        <h2 className="brandBanner-heading">{title}</h2>
        <div className="brandBanner-grid">
          {items.map((item, index) => (
            <div className="brandBanner-card" key={index}>
              <Image src={item.img} alt={item.alt} className="small-img" />
              <div className="wrapper" >
              <p className="brandBanner-bold">{item.bold}</p>
              <p className="brandBanner-sub">{item.sub}</p>
              </div>
            </div>
            
          ))}
        </div>
      </div>
  
  );
};

export default React.memo(BrandBanner);
