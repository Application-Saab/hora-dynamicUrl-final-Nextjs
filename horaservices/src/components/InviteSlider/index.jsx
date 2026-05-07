import React from "react";
import "./inviteslider.css";
import invite1 from "@/assets/wonderland/inviteslider/invite1.jpeg";
import invite2 from "@/assets/wonderland/inviteslider/invite2.jpeg";
import invite3 from "@/assets/wonderland/inviteslider/invite3.jpeg";
import invite4 from "@/assets/wonderland/inviteslider/invite4.jpeg";
import invite5 from "@/assets/wonderland/inviteslider/invite5.webp";
import invite6 from "@/assets/wonderland/inviteslider/invite6.webp";
import invite7 from "@/assets/wonderland/inviteslider/invite7.webp";
import invite8 from "@/assets/wonderland/inviteslider/invite8.webp";
import invite9 from "@/assets/wonderland/inviteslider/invite9.webp";
import invite10 from "@/assets/wonderland/inviteslider/invite10.webp";
import invite11 from "@/assets/wonderland/inviteslider/invite11.webp";
import invite12 from "@/assets/wonderland/inviteslider/invite12.webp";
import invite13 from "@/assets/wonderland/inviteslider/invite13.webp";
import arrowIcon from "@/assets/arrowicon.svg";
import Image from "next/image";
const data = [
  { title: "Birthday", img: invite1 },
  { title: "Baby Shower", img: invite2 },
  { title: "House Warming", img: invite3 },
  { title: "Welcome Baby", img: invite4 },
  { title: "Mother's Day", img: invite5 },
  { title: "Bridal Shower", img: invite6 },
  { title: "Kitty Party", img: invite7 },
  { title: "Gender Reveal", img: invite8 },
  { title: "Wedding", img: invite9 },
  { title: "Reception", img: invite10 },
  { title: "Dinner Party", img: invite11 },
  { title: "Baptism & Christening", img: invite12 },
  { title: "Engagement", img: invite13 },
];

const InviteSlider = ({onCreateInvite}) => {
  return (
    <div className="slider-wrapper">
      <h2 className="heading">Premium Invitations Designs</h2>

      <div className="slider">
        {data.map((item, index) => (
          <div className="card" key={index}>
            <Image src={item.img} alt={item.title} />
            <p>{item.title}</p>
          </div>
        ))}
      </div>

      <button className="create-btn" onClick={onCreateInvite}>Create Invite  
        <Image
    src={arrowIcon}
    alt="arrow"
    width={16}
    height={16}
    className="arrow-img"
  /></button>
    </div>
  );
};

export default InviteSlider;