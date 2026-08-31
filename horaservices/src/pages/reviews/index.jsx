import React, { useState } from "react";
import styled from "styled-components";
import Head from "next/head";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const RatingHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: green;

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const Star = styled.span`
  color: gold;
  margin-right: 5px;
  font-size: 24px;

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const VerifiedReviews = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: green;

  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const ReviewContainer1 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 30px;
  margin-bottom: 30px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ReviewCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ccc;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 16px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const BookingInfo = styled.div`
  font-size: 12px;
  color: #666;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const BookingDate = styled.span`
  margin-top: 20px;
  font-size: 12px;
  color: #666;

  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const UserRating = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;

  @media (max-width: 600px) {
    font-size: 18px;
  }

  .filled {
    color: gold;
  }

  .blank {
    color: grey;
  }
`;

const Indicators = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
`;

const Indicator = styled.span`
  font-size: 12px;
  color: #4a4a4a;
  background-color: #f0f0f0;
  padding: 2px 5px;
  border-radius: 3px;

  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const ReviewText = styled.div`
  font-size: 14px;
  color: #333;
  max-height: 100px;
  overflow-y: auto;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #9252aa;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const getStars = (rating) => {
  const filledStars = Array(rating).fill(<span className="filled">★</span>);
  const blankStars = Array(5 - rating).fill(<span className="blank">★</span>);
  return [...filledStars, ...blankStars];
};

const CustomersReviews = ({ allReviewsData = [] }) => {
  const [visibleReviews, setVisibleReviews] = useState(10);

  const loadMore = () => {
    setVisibleReviews((prevVisible) =>
      Math.min(prevVisible + 10, allReviewsData.length)
    );
  };

  return (
    <>
      <Head>
        <title>Ratings & Reviews | HORA Services</title>
        <meta
          name="description"
          content="Read verified customer reviews for HORA Services. 4.7/5 average rating from 10,000+ reviews across decoration, chef, catering and event services in 20+ cities."
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://horaservices.com/customers-reviews"
        />
      </Head>

      <Container>
        <Header>
          <h1>Ratings & Reviews</h1>
          <p>HORA has Served 5 Lakh people in 20+ cities!</p>
          <RatingHeader>
            <Star>★</Star> 4.7 / 5 Average Rating
          </RatingHeader>
          <VerifiedReviews>✔ 10238 Verified Reviews</VerifiedReviews>
        </Header>

        <ReviewContainer1>
          {allReviewsData.slice(0, visibleReviews).map((review, index) => (
            <ReviewCard key={index}>
              <UserInfo>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={review.avatar} />
                  <div>
                    <UserName>{review.name}</UserName>
                    <BookingInfo>{review.booking}</BookingInfo>
                  </div>
                </div>
                <BookingDate>{review.date}</BookingDate>
              </UserInfo>
              <UserRating>{getStars(review.rating)}</UserRating>
              <ReviewText>{review.text}</ReviewText>
            </ReviewCard>
          ))}
        </ReviewContainer1>

        {visibleReviews < allReviewsData.length && (
          <LoadMoreButton onClick={loadMore}>Load More</LoadMoreButton>
        )}
      </Container>
    </>
  );
};

// ====================== STATIC GENERATION (Best) ======================
export async function getStaticProps() {
const allReviewsData = [
  {
    name: "hemant singh",
    booking: "Booked Chef in Mumbai",
    date: "19 Mar 2024",
    rating: 5,
    avatar:
      "https://img.freepik.com/free-photo/medium-shot-smiley-man-posing_23-2149915892.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: false,
      Punctuality: false,
    },
    text: "HORA have experienced and trained staff. Despite the tight timeline, they effortlessly executed my event with grace. The food was not only delicious but also elegantly presented, leaving my guests raving about the taste and variety. I couldn't have asked for a better partner in planning my special day!",
  },
  {
    name: "Harikrishna Thakur",
    booking: "Booked Decor Service for Party",
    date: "10 Jan 24",
    rating: 4,
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0F4GYEzj2SD3l-ILtMKSL1NArnPj-9UsYA&s",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Very responsive to communication. Team were very polite in addressing all of my concerns and answering my endless questions in a timely matter.Reasonable prices too! Highly recommend!!",
  },
  {
    name: "SANDIP RAI",
    booking: "Booked Decoration services in Bhopal",
    date: "3 April 24",
    rating: 5,
    avatar:
      "https://play-lh.googleusercontent.com/a/ACg8ocJ3rwU_SQsSWbLiTYa9DsB3xjuM1Qa2oUzyowa6bka5AsXukg=s32-rw-mo",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "The decoration was so good and magical.I booked this decoration for my lil ones bday and I was very happy the way the canopy was set up and decorated by Sandeep from Hora.Will definitely recommend to anyone looking for decoration services",
  },
  {
    name: "Hari krishna",
    booking: "Booked Chef in Mumbai",
    date: "10 Jul 2024",
    rating: 5,
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6IxbIZQ-7xwGQI6QiWFt03C1pwLI7RcL9zQ&s",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Very responsive to communication. Team were very polite in addressing all of my concerns and answering my endless questions in a timely matter.Reasonable prices too! Highly recommend!!",
  },
  {
    name: "Raju",
    booking: "Booked party in Delhi",
    date: "28 Jan 2024",
    rating: 4,
    avatar:
      "https://play-lh.googleusercontent.com/a-/ALV-UjVOQrKBRar3UK4sK6KyxFymcvdJgZR5N12qq_CKezcxylA5icHmIg=s32-rw",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "I was blown away by the creativity and professionalism of Hora Services. The balloon arch they created for our wedding was a showstopper! It added a magical touch to our special day. Truly top-notch service!",
  },
  {
    name: "Ashu Tiwari",
    booking: "Booked Chef in Mumbai",
    date: "28 Aug 2023",
    rating: 4,
    avatar:
      "https://play-lh.googleusercontent.com/a-/ALV-UjWDqzjOJ19p-lbksp72dtFtEozrxlyX3-grQi0fSoiFSm8RrR9H=s32-rw",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Food was too good . I mean all dishes were good and quantity was good .everyguest appreciated the taste. Plus cook and his assistant behaviour politeness and willingness to make good food made ocassion special. Will definitely consider this option again Thanks alot",
  },
  {
    name: "sachin verma",
    booking: "Booked Cook in Mumbai",
    date: "28 Aug 2023",
    rating: 5,
    avatar:
      "https://play-lh.googleusercontent.com/a-/ALV-UjU_D6MAIAmJm4BrWTwjmEUcdUPXGbQOutY3YUmEfozjR0EDCDlbfQ=s32-rw",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "It was my first experience, I loved it, I booked for my brother birthday & chef made it memorable. The way chef was preparing was in a very professional way, taste was too good. I will be booking often for the occasions. Thank you Hora",
  },
  {
    name: "Emily",
    booking: "Booked Chef in Mumbai",
    date: "25 Dec 2023",
    rating: 5,
    avatar: "https://i.pinimg.com/736x/d2/38/de/d238deeadabed399debaed1a2aa1a650.jpg",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "I can't recommend Hora Services’ Chef for Party service enough! The chef created a custom menu that was perfect for our gathering. The food was beautifully presented and tasted even better than we imagined. It was a truly memorable experience.",
  },
  {
    name: "David",
    booking: "Booked Chef in Mumbai",
    date: "25 Dec 2023",
    rating: 5,
    avatar:
      "https://play-lh.googleusercontent.com/a-/ALV-UjWFDTqDTGwEO4_z-t3k8FPAL4YavkPwEyOvVkiDzcnN3zjZ6k51=s32-rw",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: false,
      Punctuality: true,
    },
    text: "Hora Celebration Designs transformed our anniversary party into something truly special. The creative decorations and personalized touches made the event memorable. The team was great to work with, and I couldn't have asked for more",
  },
  {
    name: "Lisa",
    booking: "Booked Chef in Mumbai",
    date: "25 Dec 2023",
    rating: 4,
    avatar:
      "https://play-lh.googleusercontent.com/a-/ALV-UjUChSgkPLahgkjxnEzmsFYxYlZzzJ-r38LWTOwr4xvQFEq1ffI=s32-rw",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: false,
      Hygiene: false,
      Punctuality: true,
    },
    text: "Hiring a chef from Hora Services was the best decision I made for my event! The chef was not only skilled but also brought a personal touch to the meal preparation. The food was absolutely delicious, and my guests were raving about it for days!",
  },
  {
    name: "Vijeta Sunda",
    booking: "Booked Chef in Mumbai",
    date: "25 Dec 2023",
    rating: 4,
    avatar:
      "https://play-lh.googleusercontent.com/a-/ALV-UjXt1BScAlFKvlv8oaTMTuJ5hS9raN3b3ZNpG-oFmc5zjyOeU7-H=s32-rw",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: false,
      Hygiene: false,
      Punctuality: true,
    },
    text: "What a delightful experience we had..I'm so grateful for sending me the best Chef Vipin Kumar Arya who was so so experienced and skilled and dedicated...we had a party of 25people and he made it so easy for me..Thank you to the waiter Tara who was really very helpful..they are really so experienced...Thank you once again.my guests loved the lip smacking food..",
  },
  {
    name: "Michael",
    booking: "Booked Chef in Mumbai",
    date: "25 Dec 2023",
    rating: 5,
    avatar:
      "https://play-lh.googleusercontent.com/a-/ALV-UjXtTD4G9gbxQz1RSCSnAEkBxESsZuZI2pSfXLzd6WjXDJ3muobz6w=s32-rw",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: false,
      Hygiene: false,
      Punctuality: true,
    },
    text: "Hora Services made my event unforgettable with their top-notch chef for party services. The food was restaurant-quality, and the chef prepared everything on-site, which was such a cool experience for my guests.",
  },
  {
    name: "Samantha Jones",
    booking: "Booked Chef in Mumbai",
    date: "25 Dec 2023",
    rating: 4,
    avatar:
      "https://play-lh.googleusercontent.com/a-/ALV-UjX75wkzXlHbOA2P8ql-iy0PiLPcz-6NErfy9RBwPcCx3zwHKxLd=s32-rw",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: false,
      Hygiene: false,
      Punctuality: true,
    },
    text: "The Chef for Party service by Hora Services was a huge hit at my dinner party. The chef prepared an exquisite multi-course meal right in front of us, and it was a fantastic experience. All of my guests were impressed with both the food and the presentation!",
  },
  {
    name: "Olivia Brown",
    booking: "Booked Party Planning",
    date: "22 Feb 24",
    rating: 3,
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: false,
    },
    text: "If you want to make your event extra special, definitely go with Hora Services' Chef for Party! The chef was incredibly professional, friendly, and made the whole cooking process so much fun. The food was incredible—easily the highlight of the evening.",
  },
  {
    name: "Yash Jadav",
    booking: "Booked Themed Decor for Birthday Party",
    date: "14 Mar 24",
    rating: 3,
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf9gbKLIRaf9WtoLCRkyRduQC-YAwEnAyPZ6t7AVEjI-tkhupfOgKk0heFjw&s",
    indicators: {
      Taste: false,
      Behaviour: false,
      Presentation: true,
      Quantity: false,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Hora Services transformed my venue with their stunning decorations. From the floral arrangements to the balloon arch, every detail was carefully thought out. It was exactly what I envisioned for my event!",
  },
  {
    name: "Radika Sharma",
    booking: "Booked Event Styling for Anniversary",
    date: "30 Apr 24",
    rating: 5,
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVR5kfELoNTyq9ooySzzeGiAnrEBQvsrkNTOTvJxyeCgTUgJo3vnLUQVaUMA&s",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Hora Celebration Designs exceeded our expectations with their exceptional service. The anniversary celebration was beautifully styled, and every detail was perfect. Highly recommend their services!",
  },
  {
    name: "Akshay Singh",
    booking: "Booked Decoration for Baby Shower",
    date: "15 May 24",
    rating: 4,
    avatar:
      "https://randomuser.me/api/portraits/men/15.jpg",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: false,
      Punctuality: true,
    },
    text: "I booked Hora Services for my baby shower, and they did an absolutely fantastic job with the balloon decorations! The colors were soft and beautiful, matching the theme perfectly. The balloon arch was gorgeous, and it created such a welcoming atmosphere for our guests. The team was professional and punctual—couldn't have asked for a better experience!",
  },
  {
    name: "Aarav Sharma",
    booking: "Booked Balloon Decoration and Live Catering",
    date: "10 July 24",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Hora truly exceeded our expectations! The balloon decorations were stunning, and the live catering was a hit with everyone. The team was punctual and very attentive to our needs. Highly recommend their services for any event!",
  },
  {
    name: "Saanvi Patel",
    booking: "Booked Chef for Dinner Party",
    date: "22 June 24",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: false,
    },
    text: "I booked a private chef from Hora Services for a dinner party, and it was an absolute hit! The food was exceptional—each dish was beautifully presented and bursting with flavor. The chef was so professional, making sure every detail was perfect. Our guests couldn't stop talking about the meal! Highly recommend for anyone looking to elevate their event.",
  },
  {
    name: "Vivaan Gupta",
    booking: "Booked Balloon Decoration for Engagement",
    date: "05 June 24",
    rating: 5,
    avatar:
      "https://media.istockphoto.com/id/613557584/photo/portrait-of-a-beautifull-smiling-man.jpg?s=612x612&w=0&k=20&c=hkCg5CrmTKOApePbPOyo1U9GexEfIJOJqoLXJIvcN8E=",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Absolutely wonderful service! The balloon decorations for our engagement party were perfect, and everything was handled with great professionalism. Couldn’t have asked for a better team to make our day special.",
  },
  {
    name: "Isha Mehta",
    booking: "Booked Decoration for Baby Shower",
    date: "15 May 24",
    rating: 4,
    avatar:
      "https://photosrush.net/wp-content/uploads/simple-cute-girl-pic-caption-1.jpg",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: false,
      Punctuality: true,
    },
    text: "I couldn't be happier with the balloon decorations provided by Hora Services for my baby shower! They really listened to my vision and turned it into reality with the most creative and stunning arrangements. The balloons were vibrant, and they even incorporated cute little details to match the baby theme. Highly recommend for anyone planning a special event!",
  },
  {
    name: "Arjun Singh",
    booking: "Booked Live Catering for Corporate Event",
    date: "30 April 24",
    rating: 3,
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: false,
      Hygiene: true,
      Punctuality: true,
    },
    text: "We booked live catering from Hora Services for our corporate event on April 30th, 2024, and it was absolutely amazing! The food was fresh, vibrant, and beautifully presented. The live cooking stations were a huge hit with our guests, and the chef's skills were impressive. Everything was perfectly coordinated, and the team was so professional. I highly recommend them for any corporate function!",
  },
  {
    name: "Ananya Joshi",
    booking: "Booked Decoration and Chef for Reception",
    date: "18 March 24",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Our wedding reception was a huge success thanks to Hora. Both the decorations and the food were exceptional. Everything was handled perfectly, and the team was incredibly professional and accommodating.",
  },
  {
    name: "Kartik Agarwal",
    booking: "Booked Balloon Decoration for Kid's Birthday",
    date: "01 July 24",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "I booked Hora Services for my child’s birthday, and they completely exceeded my expectations! The balloon decorations were absolutely magical—colorful, fun, and perfectly themed. The kids loved the balloon arch and the creative designs! The team was punctual, professional, and made everything so easy. I will definitely be using them for future events!",
  },
  {
    name: "Priya Sharma",
    booking: "Booked Chef and Live Catering for Party",
    date: "14 June 24",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Hora made our graduation party memorable with excellent catering and service. The food was superb, and the team was punctual and professional. Highly recommend them for any event.",
  },
  {
    name: "Rohan Kapoor",
    booking: "Booked Balloon Decoration for Baby Shower",
    date: "25 April 24",
    rating: 3,
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: false,
      Hygiene: false,
      Punctuality: true,
    },
    text: "I hired Hora Services for decorations, and they did an incredible job! The team created the perfect ambiance with their beautiful designs, and I received so many compliments from my guests. Highly recommend!",
  },
  {
    name: "Neha Patel",
    booking: "Booked Chef and Balloon Decoration",
    date: "12 May 24",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "The chef and balloon decorations were excellent for our housewarming party. The service was prompt, and everything looked great.",
  },
  {
    name: "Amit Kumar",
    booking: "Booked Live Catering for Birthday Party",
    date: "03 June 24",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Everything was perfect for our birthday party. The live catering was outstanding, and the team was professional and courteous. The food was delicious and everyone had a great time.",
  },
  {
    name: "Shruti Agarwal",
    booking: "Booked Decoration for Corporate Event",
    date: "29 June 24",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Hora Services truly transformed our corporate event with their stunning decorations. From the floral arrangements to the custom branding touches, everything was on point. The attention to detail was incredible, and the setup was flawless. Our team and guests were all impressed, and I’ll definitely be booking them again for future events",
  },
  {
    name: "Ravi Kumar",
    booking: "Booked Balloon Decoration and Live Catering",
    date: "08 July 24",
    rating: 4,
    avatar:
      "https://thumbs.dreamstime.com/b/young-indian-man-happy-outdoors-looking-camera-39595562.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Hora did a wonderful job with the balloon decorations and live catering. The setup was beautiful, and the food was tasty. The team was professional, although there was a slight delay in the setup.",
  },
  {
    name: "Aanya Verma",
    booking: "Booked Chef for Anniversary Party",
    date: "21 June 24",
    rating: 5,
    avatar:
      "https://images.pexels.com/photos/4307692/pexels-photo-4307692.jpeg?cs=srgb&dl=pexels-ketut-subiyanto-4307692.jpg&fm=jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "The chef and catering service provided by Hora for our anniversary party were exceptional. The food was delicious and the service was flawless. Highly recommend them for any special occasion!",
  },
  {
    name: "Kiran Reddy",
    booking: "Booked Balloon Decoration for Office Party",
    date: "27 May 24",
    rating: 4,
    avatar:
      "https://t3.ftcdn.net/jpg/01/31/93/60/360_F_131936042_7mqbuFNDSTlCEImH4GCkIiAuI66swziu.jpg",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "The decoration service from Hora Services took my party to the next level. The arrangements were not only gorgeous but also unique and perfectly matched the theme. It truly made the event feel special and unforgettable.",
  },
  {
    name: "Maya Singh",
    booking: "Booked Live Catering for Family Reunion",
    date: "15 June 24",
    rating: 5,
    avatar:
      "https://img.freepik.com/premium-photo/indian-woman-thinking-happy-college-scholarship-opportunity-campus-learning-university-student-smile-gen-z-class-schedule-idea-memory-decision-education_590464-381315.jpg?semt=ais_hybrid&w=740",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Hora Services exceeded my expectations with their decoration service. The team listened to my ideas and created a beautiful, elegant setup for my wedding. It made the event feel magical, and I couldn’t have asked for more!",
  },
  {
    name: "Nikhil Joshi",
    booking: "Booked Balloon Decoration for Wedding",
    date: "20 May 24",
    rating: 3,
    avatar: "https://randomuser.me/api/portraits/men/17.jpg",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: false,
      Hygiene: false,
      Punctuality: true,
    },
    text: "Hora Services made our wedding day absolutely magical with their stunning decorations. The floral arrangements were breathtaking, and the attention to detail was perfect. Our guests couldn't stop complimenting how beautiful everything looked!",
  },
  {
    name: "Riya Gupta",
    booking: "Booked Balloon Decoration for Baby Shower",
    date: "05 June 24",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/18.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "The balloon decorations and catering for our baby shower were excellent. The food was delicious, and the decorations were beautiful. great service.",
  },
  {
    name: "Aditya Patel",
    booking: "Booked Live Catering for Graduation Party",
    date: "12 July 24",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/19.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "The live catering service was fantastic for our graduation party. The food was amazing, and the team was very professional. The event went off without a hitch, thanks to Hora.",
  },
  {
    name: "Siddhi Rao",
    booking: "Booked Balloon Decoration",
    date: "01 July 24",
    rating: 4,
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXrjzld1vMgJ9I5-HhB2lbcyLEYovuPu_lng&s",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Hora Services did an amazing job decorating our corporate event. The colors, the centerpieces, and the overall layout were perfect for our theme. They turned the space into something truly special and gave our guests a memorable experience.",
  },
  {
    name: "Kabir Sharma",
    booking: "Booked Chef for Housewarming",
    date: "19 June 24",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/21.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Hora provided excellent chef and decoration services for our housewarming. The food was delicious and the decorations were perfect. The team was very professional and timely.",
  },
  {
    name: "Pooja Agarwal",
    booking: "Booked Live Catering for Engagement Party",
    date: "28 April 24",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Hora Services’ live catering was the highlight of our engagement party! Watching the chef prepare incredible dishes right in front of us was so fun, and the food was absolutely delicious. Our guests couldn’t stop talking about the experience!",
  },
  {
    name: "Ishaan Kapoor",
    booking: "Booked Balloon Decoration for Corporate Event",
    date: "02 June 24",
    rating: 3,
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: false,
      Hygiene: true,
      Punctuality: true,
    },
    text: "I booked Hora Services for our corporate event, and they did an outstanding job with the decorations! The venue looked elegant and professional, with tasteful designs that matched our branding perfectly. The team was punctual and worked efficiently to ensure everything was set up seamlessly. I highly recommend them for any corporate function!",
  },
  {
    name: "Meera Desai",
    booking: "Booked Chef and Balloon Decoration for Birthday Party",
    date: "09 May 24",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Everything was perfect for our birthday party. The food was delicious, and the balloon decorations were exactly what we wanted. The team was very professional and the event went smoothly.",
  },
  {
    name: "Rajesh Mehta",
    booking: "Booked Balloon Decoration for Baby Shower",
    date: "23 June 24",
    rating: 4,
    avatar: "https://img.freepik.com/free-photo/successful-businessman_1098-18155.jpg",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Hora Services made our baby shower so special with their stunning decorations! The pastel-colored flowers, cute baby-themed centerpieces, and personalized touches created the perfect atmosphere for celebrating our little one. Highly recommend!",
  },
  {
    name: "Sanya Verma",
    booking: "Booked Live Catering for Wedding Reception",
    date: "12 April 24",
    rating: 5,
    avatar:
      "https://media.istockphoto.com/id/1395880805/photo/indoor-close-up-portrait-of-beauty-asian-indian-serene-young-woman-sitting-near-the-window.jpg?s=612x612&w=0&k=20&c=HFFaDToYEashf-L8YCZh3y6mlTaOVHvkBqDsKN4mro0=",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "The live catering for our wedding reception was excellent. The food was delicious and the service was impeccable. The team was very accommodating and made sure everything was perfect.",
  },
  {
    name: "Ankit Singh",
    booking: "Booked Balloon Decoration for Anniversary Party",
    date: "29 May 24",
    rating: 4,
    avatar:
      "https://english.cdn.zeenews.com/sites/default/files/2017/11/17/639329-indian-men.jpg?",
    indicators: {
      Taste: false,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Hora Services made our anniversary celebration unforgettable. The decorations were elegant and romantic, with every detail thoughtfully arranged. It felt like a dream come true. Thank you for making our special day even more beautiful!",
  },
  {
    name: "Jia Patel",
    booking: "Booked Chef for Graduation Party",
    date: "17 June 24",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "The chef provided by Hora was outstanding. The food was amazing and the service was top-notch. Our graduation party was a success thanks to their excellent catering.",
  },
  {
    name: "Gaurav Kumar",
    booking: "Booked Balloon Decoration and Live Catering for Birthday Party",
    date: "06 July 24",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/26.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "The live catering service from Hora Services was an absolute hit at our event! The chef prepared everything right in front of us, and the food was not only delicious but also an exciting experience for our guests. Highly recommend!",
  },
  {
    name: "Neelam Yadav",
    booking: "Booked Chef and Balloon Decoration for Family Gathering",
    date: "10 June 24",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/27.jpg",
    indicators: {
      Taste: true,
      Behaviour: true,
      Presentation: true,
      Quantity: true,
      Hygiene: true,
      Punctuality: true,
    },
    text: "Everything was perfect for our family gathering. The food was excellent, and the balloon decorations were exactly what we hoped for. The team was very professional and everything went smoothly.",
  },
];

  return {
    props: {
      allReviewsData,
    },
    // Optional ISR — reviews update ho to:
    // revalidate: 86400, // 24 hours
  };
}

export default CustomersReviews;



