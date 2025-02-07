import React from 'react';
import Slider from 'react-slick';
import './decorationladingslider.css';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons"
import logo from '../../assets/new_logo_light.png';


const DecorationLandingSlider = ({ data, category, handleViewMore , city }) => {
  const router = useRouter();
const sliderSettings = {
dots: false,
infinite: true,
speed: 500,
slidesToShow: 4,
slidesToScroll: 1,
// autoplay: true,  // Enable autoplay
autoplaySpeed: 3000,  // Adjust the speed for auto-slide (in milliseconds)
responsive: [
{
    breakpoint: 1024,
    settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
    },
},
{
    breakpoint: 768,
    settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: true,
    },
},
],
};


const getDiscountedPrice = (price) => {
  // Trim and remove currency symbol
  price = parseFloat(price.replace(/[^0-9.-]+/g, '')); // Removes non-numeric characters

  // Check if the price is a valid number
  if (isNaN(price) || price < 0) {
      return { error: "Please enter a valid price." };
  }

  let discount;

  // Determine the discount percentage based on the item price
  if (price < 3000) {
      discount = 20; // 20% discount
  } else if (price >= 3000 && price <= 5000) {
      discount = 27; // 27% discount
  } else {
      discount = 35; // 35% discount for prices above 5000
  }

  const discountedPrice = price * (1 + discount / 100); // Calculate the discounted price
  const discountDifference = price - discountedPrice; // Difference in original and discounted price

  return  Math.floor(discountedPrice) ; // Return both discount percentage and discounted price
};


const getDiscountedDifference = (price) => {
  // Trim and remove currency symbol
  price = parseFloat(price.replace(/[^0-9.-]+/g, '')); // Removes non-numeric characters

  // Check if the price is a valid number
  if (isNaN(price) || price < 0) {
      return { error: "Please enter a valid price." };
  }

  let discount;

  // Determine the discount percentage based on the item price
  if (price < 3000) {
      discount = 20; // 20% discount
  } else if (price >= 3000 && price <= 5000) {
      discount = 27; // 27% discount
  } else {
      discount = 35; // 35% discount for prices above 5000
  }
  const discountedPrice = Math.floor(price * (1 - discount / 100)); // Calculate the discounted price and round down
  const discountDifference = Math.floor(price - discountedPrice); // Difference in original and discounted price, rounded down

  return  discountDifference ; // Return both discount percentage and discounted price
};


const handleSliderViewMore = (link , city) =>{
  if(city){
    router.push(`/${city}/${link}`); 
  }
  else{
    router.push(`/${link}`);
  }

}



return (
    <div className="slider-container slider-decoration-inner">
    <Slider {...sliderSettings}>
      {data.map((item, index) => (
        <div key={index} className="slider-item">
          {item.isViewMore ? (
            <div className="view-more-slide" onClick={() => handleSliderViewMore(item.link , city)}>
              <h3 style={{ textAlign: 'center', cursor: 'pointer' }}>{item.title}</h3>
            </div>
          ) : (
            <div onClick={() => handleSliderViewMore(item.link , city)} style={{ position:"relative"}}>
              <div style={{ position:"relative"}}>
              <Image
                src={item.Image}
                alt={item.title}
                className="slider-image"
                width={200}
                height={250}
              />
                <div style={{ position: "absolute", bottom: 3, right: 3, borderRadius: "50%", padding: 10 }}>
                        <span style={{ color: "rgba(157, 74, 147, 0.6)", fontWeight: "600" }}>
                        <Image src={logo} style={{ width:"70px" , height:"80px"}} className="hora-watermark-image"/>  
                        </span>
                      </div>
                      </div>
                <div className="decorationdiscount">
                ₹{getDiscountedDifference(item.price)} {'off'}
                      </div>
              <div className="slider-item-details">
                <h3>{item.title}</h3>
                <div style={{ display: "flex",  justifyContent: "space-between", alignItems: "top" }} className='pri_details'>
                  <div style={{ alignItems: 'left', justifyContent: 'space-between' , display:"flex" }}  className='pro_price'>
                  <p style={{
                  
                  fontWeight: '700',
                  fontSize: 15,
                  color: '#9252AA',
                  textAlign: "left",
                  margin: "10px 10px 7px 0",
  
                }}>{item.price}</p>
                  <p style={{
                            color: '#444',
                            fontWeight: '700',
                            fontSize: 15,
                            textAlign: "left",
                            margin: "10px 0px 7px",
                            textDecoration: 'line-through'
                          }}>₹{getDiscountedPrice(item.price)}</p>

                    </div>
                  {/* <p style={{ fontSize: '17px', color: 'rgb(146, 82, 170)' }}>
                    {item.rating}
                    <FontAwesomeIcon
                      style={{
                        marginBottom: '2px',
                        marginLeft: '8px',
                        height: "14px",
                        color: "#ffc107"
                      }}
                      icon={faStar}
                    />
                  </p> */}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </Slider>
  </div>
);
};

export default DecorationLandingSlider;