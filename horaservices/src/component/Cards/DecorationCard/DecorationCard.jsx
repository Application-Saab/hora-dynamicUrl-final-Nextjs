import React from 'react';
import Image from 'next/image';
import logo from '../../../assets/new_logo_light.png';
import { getDiscountedDifference } from '@/util/getDiscountedDifference';
import { getDiscountedPrice } from '@/util/getDiscountedPrice';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons"; 
import "./decorationCard.css"

const DecorationCard = ({ item, onClick }) => {
  const image = item.Image ? item.Image : `https://horaservices.com/api/uploads/compressed_webp/${item?.featured_image.split('.')[0]}.webp`;
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
          style={{ objectFit: 'cover', width: '100%' }}
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
        <div className="badge p-2 position-absolute  decorationdiscount" style={{ backgroundColor: "#f99e1f" }}>
          ₹{getDiscountedDifference(item.price)} off
        </div>
      </div>
      <div className="px-2 py-2">
        <div >
          <h6 style={{
            textAlign: "left",
            fontWeight: 600,
            fontSize: "12px",
            marginTop: "4px",
            color: "rgb(146, 82, 170)",
            lineHeight: "18px",
            marginBottom: "0px",
          }}>{item.title ?? item.name}</h6>
        </div>
        <div className="d-flex justify-content-start gap-2 mt-2">
          <span style={{
            fontWeight: 700,
            fontSize: "15px",
            color: "rgb(146, 82, 170)",
            textAlign: "left",
          }} > {String(item.price).includes('₹') ? item.price : `₹${item.price}`}</span>
          
          <span style={{
            color: "rgb(68, 68, 68)",
            fontWeight: 700,
            fontSize: "12px",
            textAlign: "left",

            textDecoration: "line-through",
          }}>
            ₹{getDiscountedPrice(item.price)}
          </span>
          
        </div>
         <div className="d-flex align-items-center rating-sec">
                  <p className="m-0 p-0" style={{ fontWeight: '500', fontSize: 12, margin: "0px", color: '#9252AA' }}>
                    {item.rating}
                    <span className='px-1 m-0 py-0 img-fluid' style={{ color: '#ffc107' }}>
                      <FontAwesomeIcon style={{ margin: 0, height: "12px" }} icon={faStar} />
                    </span>
                  </p>
                  <p style={{ color: '#9252AA', fontWeight: '600', fontSize: 12, margin: "0px", padding: "0 0 0 2px" }}>
                    ({item.userCount})
                  </p>
                </div>
      </div>
    </div>
  );
};

export default DecorationCard;
