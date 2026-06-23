import React from "react";
import "./CitySelector.css";
import mumbai from "@/assets/mumbai.webp";
import delhi from "@/assets/delhi.webp";
import bengaluru from "@/assets/banglore.webp"
import gurgaon from "@/assets/gurugram.webp"
import hydrabad from "@/assets/hydrabad.webp";
import faridabad from "@/assets/faridabad.webp";
import noida from "@/assets/Noida.webp";
import indore from "@/assets/indore.webp";
import bhopal from "@/assets/bhopal.webp";
import Image from "next/image";


const cities = [
  { name: "Mumbai", image: mumbai },
  { name: "Delhi", image: delhi},
  { name: "Bangalore", image: bengaluru },
  { name: "Gurgaon", image: gurgaon },
  { name: "Hyderabad", image: hydrabad},
  { name: "Faridabad", image: faridabad },
  { name: "Noida", image: noida},
  {name:"Indore",image :indore},
  {name:"Bhopal",image:bhopal}
];

const CitySelector = ({ onSelect }) => {
  return (
    <div className="city-overlay">
      <div className="city-modal">
        <h2 className="city-title">SELECT CITY</h2>
        <div className="city-grid">
          {cities.map((city) => (
            <div
              key={city.name}
              className="city-item"
              onClick={() => onSelect(city.name)}
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