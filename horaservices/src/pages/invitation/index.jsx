import { useRouter } from "next/router";
import React, { useState } from "react";
import Image from "next/image";
import "./invitation.css";
import { FaEdit } from "react-icons/fa";
import template1 from "../../assets/outside svg/template1.svg";
import template13 from "../../assets/outside svg/template13.svg";
import template12 from "../../assets/outside svg/template12.svg";
import template10 from "../../assets/outside svg/template10.svg";
import template11 from "../../assets/outside svg/template11.svg";
import template7 from "../../assets/outside svg/template7.svg";
import template17 from "../../assets/template17.svg";
import template16 from "../../assets/outside svg/template16.svg";
import template15 from "../../assets/template15.svg";
import template9 from "../../assets/template9.svg";
import template3 from "../../assets/template3.svg";
import template2 from "../../assets/template2.svg";
import template6 from "../../assets/template6.svg";
const products = [
  {
    category: "Happy Birthday Cards",
    products: [
      {
        id: 1,
        name: "Barbie Doll Decoration for birthday",
        image: template1,
      },
      {
        id: 2,
        name: "Princess Decoration for birthday",
        image: template13,
      },
      {
        id: 3,
        name: "Football Decoration for birthday",
        image: template12,
      },
      {
        id: 4,
        name: "Superhero Decoration for birthday",
        image: template10,
      },
      {
        id: 5,
        name: "Oceans Decoration for birthday",
        image: template11,
      },
      {
        id: 6,
        name: "Jungle Decoration for birthday",
        image: template7,
      },
      // {
      //   id: 7,
      //   name: "Mickey Mouse Decoration for birthday",
      //   image: "/assets/outside svg/template8.svg",
      // },
      {
        id: 8,
        name: "Celebrate Decoration for birthday",
        image: template2,
      },
      {
        id: 9,
        name: "Doll Decoration for birthday",
        image: template3,
      },
      // { id: 10, name: "Mickey Mouse Decoration for birthday", image: "/assets/template4.svg" },
      {
        id: 11,
        name: "Baby Boss Decoration for birthday",
        image: template6,
      },
      {
        id: 12,
        name: "Mickey Decoration for birthday",
        image: template9,
      },
      {
        id: 13,
        name: "Duck Decoration for birthday",
        image: template15,
      },
      {
        id: 14,
        name: "IronMan Decoration for birthday",
        image: template16,
      },
      {
        id: 15,
        name: "MineCraft Decoration for birthday",
        image: template17,
      },
    ],
  },
];

export default function App() {
  const router = useRouter();

  const handleImageClick = (product) => {
    router.push(`/invitation/${product.id}`);
  };

  return (
    <div className="product-container-i">
      {products.map((categoryData) => (
        <div key={categoryData.category}>
          <h1 className="heading-i">{categoryData.category}</h1>
          <div className="product-slider-i">
            {categoryData.products.map((product) => (
              <div
                key={product.id}
                className="product-box-i"
                onClick={() => handleImageClick(product)}
              >
                <div className="product-image-container-i">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={600}
                    height={480}
                  />
                </div>
                <h3 className="product-name-i">
                  {product.name}
                  <span className="edit-btn">
                    <FaEdit className="edit-icon" />
                  </span>
                </h3>
                <div className="product-price-container-i">
                  <span className="product-original-price-i"></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}