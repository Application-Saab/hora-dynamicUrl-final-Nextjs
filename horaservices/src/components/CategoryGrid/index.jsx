"use client";
import Image from "next/image";
import Link from "next/link";
import "./CategoryGrid.css";

const CategoryGrid = ({ cardsData }) => {
  return (
    <div className="category-grid">
      {cardsData.map((card, index) => (
        <div
          key={index}
          className={`category-grid__card ${card.sizeClass} ${card.extraClass || ""}`}
        >
      
          <div className="category-grid__image-wrapper">
            <Image
              src={card.image}
              alt={card.title}
              width={300}
              height={200}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          </div>

          <div className="category-grid__content">
            <h3>{card.title}</h3>
            {card.subtitle && <p>{card.subtitle}</p>}
            {card.link && (
              <Link href={card.link}>
                <button className="category-grid__button">View More</button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
