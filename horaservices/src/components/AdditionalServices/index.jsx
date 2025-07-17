"use client";
import React from "react";
import "./AdditionalServices.css";
import Image from "next/image";

const services = [
  {
    title: "PHOTOGRAPHY",
    description: "CAPTURE EVERY SPECIAL MOMENT.",
    color: "#F4629A",
    img: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
    link: "#"
  },
  {
    title: "FOOD&CATERING",
    description: "SATISFY YOUR GUESTS WITH DELICIOUS FOOD.",
    color: "#089D94",
    img: "https://cdn-icons-png.flaticon.com/512/2920/2920094.png",
    link: "#"
  },
  {
    title: "ENTERTAINMENT",
    description: "FUN ACTIVITIES FOR ALL AGES.",
    color: "#3171E0",
    img: "https://cdn-icons-png.flaticon.com/512/2920/2920088.png",
    link: "#"
  }
];

const AdditionalServices = () => {
  return (
    <div className="services-section">
      <h2 className="section-title">OUR ADDITIONAL SERVICES</h2>
      <p className="section-subtitle">
        MAKE YOUR EVENT MORE MEMORABLE WITH OUR EXTRA OFFERINGS
      </p>

      <div className="services-container">
        {services.map((item, index) => (
          <div
            className="service-card"
            key={index}
            style={{ borderColor: item.color }}
          >
            <div className="icon-box" style={{ backgroundColor: item.color }}>
              <Image src={item.img} alt={item.title} width={40} height={40} />
            </div>
            <h3 style={{ color: item.color }}>{item.title}</h3>
            <ul>
              <li>{item.description}</li>
            </ul>
            <div className="view-more" style={{ color: item.color }}>
              VIEW MORE
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdditionalServices;
