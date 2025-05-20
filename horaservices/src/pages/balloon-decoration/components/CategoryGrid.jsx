import React from "react";
import Image from "next/image";

const CategoryGrid = ({ categories, openCatItems }) => {
  return (
    <div className="d-flex flex-wrap mb-3 justify-content-lg-between gap-1 justify-content-around">
      {categories
        .filter((item) => item.image)
        .map((item, index) => (
          <div key={index} className="flex-shrink-0 col-3 col-md-1 rounded-4 category-card " >
            <a href={item.link}>
              <Image
                src={item.image}
                className="img-fluid cursor-pointer"
                alt={item.imgAlt}
                quality={75}
                priority={true}
                onClick={() => {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: "categoryClick",
                    categoryName: item.name??"N/A",
                    subCategory: item.subCategory??"N/A",
                    catValue: item.catValue??"N/A",
                    imageAlt: item.imgAlt??"N/A",
                    itemLink: item.link??"N/A",
                  });
                  openCatItems(item);
                }}
                width={300}
                height={300}
              />
            </a>
          </div>
        ))}
    </div>
  );
};

export default React.memo(CategoryGrid);
