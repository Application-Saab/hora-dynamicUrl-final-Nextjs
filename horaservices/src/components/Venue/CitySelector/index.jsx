import React from "react";
import "./cityselector.css";
import mumbai from "@/assets/city/mumbai.webp";
import delhi from "@/assets/city/delhi.webp";
import bengaluru from "@/assets/city/bengluru.webp";
import gurgaon from "@/assets/city/gurgaon.webp";
import hydrabad from "@/assets/city/hyderabad.webp";
import faridabad from "@/assets/city/faridabad.webp";
import noida from "@/assets/city/noida.webp";
import ghaziabad from "@/assets/city/Ghaziabad.webp";
import others from "@/assets/others.webp";
import Image from "next/image";
import { useLockBodyScroll } from "@/utils/Uselockbodyscroll";

const cities = [
  { name: "Mumbai", image: mumbai },
  { name: "Delhi", image: delhi },
  { name: "Bengaluru", image: bengaluru },
  { name: "Gurgaon", image: gurgaon },
  { name: "Ghaziabad", image: ghaziabad },
  { name: "Hyderabad", image: hydrabad },
  { name: "Faridabad", image: faridabad },
  { name: "Noida", image: noida },
  { name: "Others", image: others },
];

const CitySelector = ({ onSelect }) => {
  // ✅ jab tak ye component mounted hai (yaani popup open hai),
  // background scroll lock rahega aur exact position par pin rahega
  useLockBodyScroll(true);

  const handleClick = (cityName) => {
    if (cityName === "Others") {
      window.location.href = "https://horaservices.com/";
      return;
    }
    onSelect(cityName);
  };

  return (
    <div className="city-overlay">
      <div className="city-modal">
        <h2 className="city-title">SELECT CITY</h2>
        <div className="city-grid">
          {cities.map((city, index) => (
            <div
              key={`${city.name}-${index}`}
              className="city-item"
              onClick={() => handleClick(city.name)}
            >
              <div className="city-img-wrap">
                <Image src={city.image} alt={city.name} className="city-img" />
              </div>
              <p className="city-name">{city.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitySelector;