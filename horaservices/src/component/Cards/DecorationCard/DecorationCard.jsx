import React from 'react';
import Image from 'next/image';
import logo from '../../../assets/new_logo_light.png'; 
import { getDiscountedDifference } from '@/util/getDiscountedDifference';
import { getDiscountedPrice } from '@/util/getDiscountedPrice';

import "./decorationCard.css"

const DecorationCard = ({ item, onClick }) => {
  return (
    <div
      className="card shadow-md h-100 border-0 shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="position-relative">
        <img
          src={item.Image}
          alt={item.title}
          className="card-img-top img-fluid rounded-top card-decoration-img"
          style={{ objectFit: 'cover', width: '100%'}}
        />
        <div className="position-absolute bottom-0 end-0 p-2">
          <Image
            src={logo}
            alt="Logo Watermark"
            width={50}
            height={50}
            className="opacity-50"
          />
        </div>
        <div className="badge p-2 bg-secondary position-absolute top-0 end-0 m-2 fw-bold">
          ₹{getDiscountedDifference(item.price)} off
        </div>
      </div>
      <div className="card-body text-center">
        <div>
          <h6 className="card-title fw-bold mb-2 text-purple">{item.title}</h6>
        </div>
        <div className="card-title d-flex justify-content-center gap-2 mt-2">
          <span className="fw-bold text-purple">₹{item.price}</span>
          <span className="text-muted text-decoration-line-through ">
            ₹{getDiscountedPrice(item.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DecorationCard;
