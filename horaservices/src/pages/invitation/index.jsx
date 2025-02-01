import { useRouter } from "next/router";
import React, { useState } from "react";
import Image from "next/image";
import "./in.css";

const products = [
  {
    category: "Happy Birthday Cards",
    products: [
      {
        id: 1,
        name: "Barbie Doll Decoration for birthday",
        price: "₹1673",
        originalPrice: "₹2007",
        discount: "₹335 off",
        image: "/assets/outside svg/template1.svg",
      },
      {
        id: 2,
        name: "Princess Decoration for birthday",
        price: "₹2483",
        originalPrice: "₹2979",
        discount: "₹497 off",
        image: "/assets/outside svg/template13.svg",
      },
      {
        id: 3,
        name: "Football Decoration for birthday",
        price: "₹2483",
        originalPrice: "₹2979",
        discount: "₹497 off",
        image: "/assets/outside svg/template12.svg",
      },
      {
        id: 4,
        name: "Superhero Decoration for birthday",
        price: "₹2483",
        originalPrice: "₹2979",
        discount: "₹497 off",
        image: "/assets/outside svg/template10.svg",
      },
      {
        id: 5,
        name: "Oceans Decoration for birthday",
        price: "₹2483",
        originalPrice: "₹2979",
        discount: "₹497 off",
        image: "/assets/outside svg/template11.svg",
      },
      {
        id: 6,
        name: "Jungle Decoration for birthday",
        price: "₹2483",
        originalPrice: "₹2979",
        discount: "₹497 off",
        image: "/assets/outside svg/template7.svg",
      },
      {
        id: 7,
        name: "Mickey Mouse Decoration for birthday",
        price: "₹2483",
        originalPrice: "₹2979",
        discount: "₹497 off",
        image: "/assets/outside svg/template8.svg",
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
                  {/* <div className="product-discount-i">{product.discount}</div> */}
                </div>
                <h3 className="product-name-i">{product.name}<span style={{border: "2px solid black", marginLeft: "5px",
                  backgroundColor:"blue", color:"white"
                }}>EDIT</span></h3>
                <div className="product-price-container-i">
                  {/* <span className="product-price-i">{product.price}</span> */}
                  <span className="product-original-price-i">
                    {/* {product.originalPrice} */}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
