import React from 'react';
import Image from 'next/image';
import logo from '../../../assets/new_logo_light.png'; 
import { getDiscountedDifference } from '@/util/getDiscountedDifference';
import { getDiscountedPrice } from '@/util/getDiscountedPrice';

import "./decorationCard.css"

const DecorationCard = ({ item, onClick }) => {
  const image=item.Image?item.Image:`https://horaservices.com/api/uploads/compressed_webp/${item?.featured_image.split('.')[0]}.webp`;
  console.log(image)
  return (
    <div
      className="card shadow-md h-100 border-0 shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="position-relative">
        <Image
          src={image}
          alt={item.title}
          className="card-img-top img-fluid rounded-top card-decoration-img"
          style={{ objectFit: 'cover', width: '100%'}}
          width={300}
          height={300}
          loading='lazy'
        />
        <div className="position-absolute bottom-0 end-0 p-2">
          <Image
            src={logo}
            alt="Logo Watermark"
            width={50}
            height={50}
            className="opacity-50 watermark-img"
          />
        </div>
        <div className="badge p-2 position-absolute top-0 end-0 m-2 fw-bold" style={{backgroundColor:"#f99e1f"}}>
          ₹{getDiscountedDifference(item.price)} off
        </div>
      </div>
      <div className="card-body">
        <div>
          <h6 className="fw-bold mb-2 text-purple text-title">{item.title??item.name}</h6>
        </div>
        <div className="d-flex justify-content-start gap-2 mt-2">
          <span className="fw-bold text-purple text-title"> {String(item.price).includes('₹') ? item.price : `₹${item.price}`}</span>
          <span className="text-muted text-decoration-line-through text-title discount-title">
            ₹{getDiscountedPrice(item.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DecorationCard;
