import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "../invitation.css";
import template15 from "../../../assets/template15.svg";
import template9 from "../../../assets/template9.svg";
import template3 from "../../../assets/template3.svg";
import template2 from "../../../assets/template2.svg";
import template6 from "../../../assets/template6.svg";
import template1 from "../../../assets/template1.svg";
import template13 from "../../../assets/template13.svg";
import template10 from "../../../assets/template10.svg";
import template12 from "../../../assets/template12.svg";
import template7 from "../../../assets/template7.svg";
import template11 from "../../../assets/template11.svg";
import template17 from "../../../assets/template17.svg";

const products = [
  {
    category: "Happy Birthday Cards",
    products: [
      { id: 1, name: "Barbie Doll Decoration for birthday", image: template1},
      { id: 2, name: "Princess Decoration for birthday", image: template13 },
      { id: 3, name: "Football Decoration for birthday", image: template12 },
      { id: 4, name: "Superhero Decoration for birthday", image: template10},
      { id: 5, name: "Oceans Decoration for birthday", image: template11 },
      { id: 6, name: "Jungle Decoration for birthday", image: template7 },
      // { id: 7, name: "Mickey Mouse Decoration for birthday", image: "/assets/template8.svg" },
      { id: 8, name: "Mickey Mouse Decoration for birthday", image: template2 },
      { id: 9, name: "Mickey Mouse Decoration for birthday", image: template3 },
      // { id: 10, name: "Mickey Mouse Decoration for birthday", image: "/assets/template4.svg" },
      { id: 11, name: "Mickey Mouse Decoration for birthday", image: template6 },
      { id: 12, name: "Mickey Mouse Decoration for birthday", image: template9 },
      { id: 13, name: "Mickey Mouse Decoration for birthday", image: template15 },
    //   { id: 14, name: "Mickey Mouse Decoration for birthday", image: template16 },
      { id: 15, name: "Mickey Mouse Decoration for birthday", image: template17},
    ],
  },
];

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const product = products
    .flatMap((category) => category.products)
    .find((p) => p.id === parseInt(id));

  const [svgContent, setSvgContent] = useState("");
  const [fullname, setFullname] = useState("John Doe");
  const [date, setdate] = useState("25 Nov 2025");
  const [imageSrc, setImageSrc] = useState("/assets/user2.png");
  const [address, setAddress] = useState("Address");
  const [category, setCategory] = useState("BIRTHDAY PARTY");
  const [time, setTime] = useState("9:00 PM");

  useEffect(() => {
    if (product) {
      fetch(product.image) 
        .then((response) => response.text())
        .then((data) => setSvgContent(data))
        .catch((error) => console.error("Error loading SVG:", error));
    }
  }, [product]);


  useEffect(() => {
    if (svgContent) {
      const container = document.getElementById("svg-container");
      if (container) {
        container.innerHTML = svgContent;
        const svgElement = container.querySelector("svg");

        if (svgElement) {
          const nameText = svgElement.querySelector("#name");
          if (nameText) nameText.textContent = fullname;

          const dateText = svgElement.querySelector("#date");
          if (dateText) dateText.textContent = date;

          const textTime = svgElement.querySelector("#time");
          if (textTime) textTime.textContent = time;

          const textAddress = svgElement.querySelector("#address");
          if (textAddress) textAddress.textContent = address;

          const imageElement = svgElement.querySelector('[data-id="uniqueImage1"]');
          if (imageElement) {
            imageElement.setAttribute("href", imageSrc); 
          }
        }
      } 
      
    }
  }, [svgContent, fullname, date, imageSrc, time, address]);


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShareOnWhatsApp = async () => {
    const svgElement = document.querySelector(".product-svg svg");
    if (!svgElement) {
      console.error("SVG element not found!");
      return;
    }

    const svgRect = svgElement.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const scaleFactor = 4;
    canvas.width = svgRect.width * scaleFactor;
    canvas.height = svgRect.height * scaleFactor;

    const clonedSvg = svgElement.cloneNode(true);
    const styleSheets = [...document.styleSheets]
      .map((sheet) => {
        try {
          return [...sheet.cssRules].map((rule) => rule.cssText).join("\n");
        } catch (e) {
          console.warn("Failed to access stylesheet:", sheet.href);
          return "";
        }
      })
      .join("\n");

    const styleElement = document.createElement("style");
    styleElement.textContent = styleSheets;
    clonedSvg.insertBefore(styleElement, clonedSvg.firstChild);

    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new window.Image();
    img.onload = async () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            console.error("Failed to convert canvas to Blob.");
            return;
          }

          if (navigator.share) {
            try {
              const title = "Awesome Product - SVG";
              const description =
                "Check out this amazing product with great features!";

              const file = new File([blob], "Invitation.png", {
                type: "image/png",
              });

              await navigator.share({
                title: title,
                text: description,
                files: [file],
              });

              console.log("Image shared successfully!");
            } catch (error) {
              console.error("Error sharing via Web Share API:", error);
            }
          } else {
            alert(
              "Your browser does not support the Web Share API. Please use a mobile device."
            );
          }
        },
        "image/png",
        1.0
      );
    };

    img.onerror = (error) => {
      console.error("Failed to load SVG image:", error);
    };

    img.src = svgUrl;
  };

  return (
    <div className="product-details-container">
      <div className="product-content">
      <div id="svg-container" className="product-svg" />
        <div className="edit-buttons">
          <div
            style={{
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "10px",
            }}
          >
            <div className="breadcrumb">
              <span>{product ? product.name : "Product Not Found"}</span>
            </div>

              <div className="edit-section">
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter Name 2"
                  value={date}
                  onChange={(e) => setdate(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter Time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />

              </div>
            <button onClick={handleShareOnWhatsApp}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
}