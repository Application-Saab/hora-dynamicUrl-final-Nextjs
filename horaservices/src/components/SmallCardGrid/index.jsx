"use client";

import Image from "next/image";
import { useDecorationEvents } from "@/utils/decorationEvents";
import smallcardBackground from "@/assets/small-cardBackground.png";
import "./SmallCardGrid.css"
const SmallCardGrid = ({ city, hasCityPageParam, decCat, categories ,locality}) => {
  const { handleItemClick, openCatItems } = useDecorationEvents(city, hasCityPageParam, decCat,locality);

  const handleClick = (item) => {
    const matchedCat = decCat.find(
      (cat) => cat.name.toLowerCase() === item.name.toLowerCase()
    );

    const eventPayload = {
      title: item.name,
      categoryName: item.name,
      subCategory: matchedCat?.subCategory || "N/A",
      catValue: matchedCat?.catValue || "N/A",
      imgAlt: matchedCat?.imgAlt || "N/A",
    };

    handleItemClick(eventPayload);

    if (matchedCat) {
      openCatItems(matchedCat);
    } else {
      console.warn("❌ No matching category in decCat for:", item.name);
    }
  };

  return (
    <div className="small-card-grid-outer">
      <div className="page-width">
        <div className="small-card-grid">
          {categories.map((item, index) => (
            <div
              key={index}
              className="small-card-wrapper"
              onClick={() => handleClick(item)}
              style={{ cursor: "pointer" }}
            >
              <div
                className="small-card"
                style={{
                  backgroundImage: `url(${smallcardBackground.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                />
              </div>
              <p className="small-card-name">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmallCardGrid;
