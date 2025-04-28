import React from 'react';
import Image from 'next/image';
import logo from '../../assets/new_logo_light.png'; 
import { getDiscountedDifference } from '@/util/getDiscountedDifference';
import { getDiscountedPrice } from '@/util/getDiscountedPrice';

const DecorationCard = ({ item, onClick }) => {
  return (
    <div
      className="card shadow-md h-100 border-0 shadow-sm cursor-pointer decoration-card-height"
      onClick={onClick}
    >
      <div className="position-relative">
        <Image
          src={item.Image}
          alt={item.title}
          width={200}
          height={250}
          className="card-img-top img-fluid rounded-top"
          style={{ objectFit: 'cover', width: '100%', height: '250px' }}
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
        <div className="badge p-2 bg-primary position-absolute top-0 end-0 m-2 fw-bold">
          ₹{getDiscountedDifference(item.price)} off
        </div>
      </div>
      <div className="card-body d-flex flex-column justify-content-between text-center">
        <div>
          <h6 className="card-title mb-2 text-purple">{item.title}</h6>
        </div>
        <div className="d-flex justify-content-center gap-2 mt-2">
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
