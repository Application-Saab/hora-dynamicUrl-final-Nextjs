import React from 'react'
import Image from 'next/image';
import Slider from 'react-slick';
import "../../app/homepage.css"; 
const CustomerReview = [
  {
    id: 1,
    name: "hemant singh",
    image: "https://play-lh.googleusercontent.com/a-/ALV-UjU_D6MAIAmJm4BrWTwjmEUcdUPXGbQOutY3YUmEfozjR0EDCDlbfQ=s32-rw",
    imgAlt: 'hemant singh review',
    rating: 5,
    review: "HORA have experienced and trained staff. they effortlessly executed my event with grace. The food was not only delicious but also elegantly presented, leaving my guests raving about the taste and variety.",
  },
  {
    id: 2,
    name: "SANDIP RAI",
    image: "https://play-lh.googleusercontent.com/a/ACg8ocJ3rwU_SQsSWbLiTYa9DsB3xjuM1Qa2oUzyowa6bka5AsXukg=s32-rw-mo",
    imgAlt: 'SANDIP RAI review',
    rating: 5,
    review: "The decoration was so good and magical.I booked this decoration for my lil ones bday and I was very happy the way the canopy was set up and decorated by Sandeep from Hora. Greate Job!!"
  },
  {
    id: 3,
    name: "Ashu Tiwari",
    image: "https://play-lh.googleusercontent.com/a-/ALV-UjWDqzjOJ19p-lbksp72dtFtEozrxlyX3-grQi0fSoiFSm8RrR9H=s32-rw",
    imgAlt: 'Ashu Tiwari review',
    rating: 5,
    review: "Food was too good . I mean all dishes were good and quantity was good .every guest appreciated the taste and love it so much.Will definitely recommend to anyone looking for food services"
  },
  {
    id: 4,
    name: "Vijeta Sunda",
    image: "https://play-lh.googleusercontent.com/a-/ALV-UjVFRB3pRXxtJgvV6QWB7tLW9JFDG-QiY8oHr22n_pQIQJaN_WD87w=s32-rw",
    imgAlt: 'Vijeta Sunda review',
    rating: 4,
    review: "What a delightful experience we had..I'm so grateful for sending me the best Chef Vipin Kumar Arya who was so so experienced and skilled and dedicated...we had a party of 25people and he made it so easy for me and all"
  },
  {
    id: 5,
    name: "Sneha",
    image: "https://play-lh.googleusercontent.com/a-/ALV-UjWYlq3OV6In6sCw_X91EexqX7q9FdazSyOJ-ROxRw63-BEbUnuB_A=s32-rw",
    imgAlt: 'Jerome Bell review repeated',
    rating: 4,
    review: "The decorations were festive and vibrant, creating the perfect atmosphere for our celebration. Their professionalism and creativity were top-notch.. Very Good and amazing suppport"
  },
];
const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    arrows:false,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

const  CustomerReviewSection = () => {
  return (<>
  <div className="customer-review-container sec-container">
        <h2 className='customer-review-h2'>Customer Review</h2>
        <Slider {...settings}  >
          {CustomerReview.map(({ id, name, image, rating, review }) => (
            <div key={id} className="review-card">
              <div className="review-header">
                <Image src={image} alt={name} className="review-image" width={100} height={100}/>
                <div>
                  <h3 className="review-name">{name}</h3>
                  <div className="review-rating">{"⭐".repeat(rating)}</div>
                </div>
              </div>
              <p className="review-text">{review}</p>
            </div>
          ))}
        </Slider>
      </div>
  </>)
}
export default CustomerReviewSection;