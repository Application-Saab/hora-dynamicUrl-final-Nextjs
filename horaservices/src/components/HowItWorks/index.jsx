import React from "react";
import "./howItWorks.css";
import Image from "next/image";
import IMG1 from "@/assets/wonderland/img1.webp";
import IMG2 from "@/assets/wonderland/img2.webp";
import IMG3 from "@/assets/wonderland/img3.webp";
const data = [
  {
    img: IMG1,
    title: "SEND BEAUTIFUL INVITES",
    desc: "Create & share invites with ease",
    bg: "#F9F4FB",   // light purple
  },
  {
    img: IMG2,
    title: "STAY CONNECTED",
    desc: "Track who is coming & chat with guests",
    bg: "#EEDEFA",   // peach
  },
  {
    img: IMG3,
    title: "RELIVE THE MOMENTS",
    desc: "Upload event photos & build your album",
    bg: "#FCECF8",   // pinkish
  },
];

const HowItWorks = ({ items = data }) => {
  return (
    <div className="how-wrapper">
      <h2 className="how-title">HOW ITS WORK’S</h2>

      <div className="how-cards">
        {items.map((item, i) => (
          <div  
    className="how-card"
    key={i}
    style={{ background: item.bg }}
  >
            <Image src={item.img} alt="icon" className="card-image" />

            <h3 className="card-title">{item.title}</h3>

            <p className="card-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;