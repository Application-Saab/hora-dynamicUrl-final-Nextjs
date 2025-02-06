import { useRouter } from "next/router";
import React, { useState } from "react";
import Image from "next/image";
import "./invitation.css";
import { FaEdit } from "react-icons/fa";

const products = [
  {
    category: "Happy Birthday Cards",
    products: [
      {
        id: 1,
        name: "Barbie Doll Decoration for birthday",
        image: "/assets/outside svg/template1.svg",
      },
      {
        id: 2,
        name: "Princess Decoration for birthday",
        image: "/assets/outside svg/template13.svg",
      },
      {
        id: 3,
        name: "Football Decoration for birthday",
        image: "/assets/outside svg/template12.svg",
      },
      {
        id: 4,
        name: "Superhero Decoration for birthday",
        image: "/assets/outside svg/template10.svg",
      },
      {
        id: 5,
        name: "Oceans Decoration for birthday",
        image: "/assets/outside svg/template11.svg",
      },
      {
        id: 6,
        name: "Jungle Decoration for birthday",
        image: "/assets/outside svg/template7.svg",
      },
      // {
      //   id: 7,
      //   name: "Mickey Mouse Decoration for birthday",
      //   image: "/assets/outside svg/template8.svg",
      // },
      {
        id: 8,
        name: "Celebrate Decoration for birthday",
        image: "/assets/template2.svg",
      },
      {
        id: 9,
        name: "Doll Decoration for birthday",
        image: "/assets/template3.svg",
      },
      // { id: 10, name: "Mickey Mouse Decoration for birthday", image: "/assets/template4.svg" },
      {
        id: 11,
        name: "Baby Boss Decoration for birthday",
        image: "/assets/template6.svg",
      },
      {
        id: 12,
        name: "Mickey Decoration for birthday",
        image: "/assets/template9.svg",
      },
      {
        id: 13,
        name: "Duck Decoration for birthday",
        image: "/assets/template15.svg",
      },
      {
        id: 14,
        name: "IronMan Decoration for birthday",
        image: "/assets/outside svg/template16.svg",
      },
      {
        id: 15,
        name: "MineCraft Decoration for birthday",
        image: "/assets/template17.svg",
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
