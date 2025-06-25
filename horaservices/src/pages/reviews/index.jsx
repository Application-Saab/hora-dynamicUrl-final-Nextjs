import React, { useState } from 'react';
import styled from 'styled-components';

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
  background-image: url(${props => props.src});
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

const ReviewContainer = styled.div`
  position: relative;
  padding: 20px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
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

const CustomersReviews = () => {
    const allReviewsData = [
        {
            name: "hemant singh",
            booking: "Booked Chef in Mumbai",
            date: "19 Mar 2024",
            rating: 5,
            avatar:"https://img.freepik.com/free-photo/medium-shot-smiley-man-posing_23-2149915892.jpg",
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
            "name": "Neha Patel",
            "booking": "Booked Chef and Balloon Decoration",
            "date": "12 May 24",
            "rating": 4,
            "avatar": "https://randomuser.me/api/portraits/women/10.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Hora Services completely transformed our venue with their gorgeous balloon decorations! The colors were vibrant, and the designs were flawless. They really went above and beyond to meet our vision. Highly recommend for any event!"
        },
        {
            "name": "Harikrishna Thakur",
            "booking": "Booked Decor Service for Party",
            "date": "10 Jan 24",
            "rating": 4,
            "avatar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0F4GYEzj2SD3l-ILtMKSL1NArnPj-9UsYA&s",
            "indicators": {
                "Taste": false,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Very responsive to communication. Team were very polite in addressing all of my concerns and answering my endless questions in a timely matter.Reasonable prices too! Highly recommend!!"
        },
        {
            name: "SANDIP RAI",
            booking: "Booked Decoration services in Bhopal",
            date: "3 April 24",
            rating: 5,
            avatar: "https://play-lh.googleusercontent.com/a/ACg8ocJ3rwU_SQsSWbLiTYa9DsB3xjuM1Qa2oUzyowa6bka5AsXukg=s32-rw-mo",
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
            avatar: "https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png",
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
            avatar: "https://play-lh.googleusercontent.com/a-/ALV-UjVOQrKBRar3UK4sK6KyxFymcvdJgZR5N12qq_CKezcxylA5icHmIg=s32-rw",
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
            avatar: "https://play-lh.googleusercontent.com/a-/ALV-UjWDqzjOJ19p-lbksp72dtFtEozrxlyX3-grQi0fSoiFSm8RrR9H=s32-rw",
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
            avatar: "data:image/jpeg;base64,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",
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
            avatar: "https://play-lh.googleusercontent.com/a-/ALV-UjWFDTqDTGwEO4_z-t3k8FPAL4YavkPwEyOvVkiDzcnN3zjZ6k51=s32-rw",
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
            avatar: "https://play-lh.googleusercontent.com/a-/ALV-UjUChSgkPLahgkjxnEzmsFYxYlZzzJ-r38LWTOwr4xvQFEq1ffI=s32-rw",
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
            avatar: "https://play-lh.googleusercontent.com/a-/ALV-UjXt1BScAlFKvlv8oaTMTuJ5hS9raN3b3ZNpG-oFmc5zjyOeU7-H=s32-rw",
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
            avatar: "https://play-lh.googleusercontent.com/a-/ALV-UjXtTD4G9gbxQz1RSCSnAEkBxESsZuZI2pSfXLzd6WjXDJ3muobz6w=s32-rw",
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
            avatar: "https://play-lh.googleusercontent.com/a-/ALV-UjX75wkzXlHbOA2P8ql-iy0PiLPcz-6NErfy9RBwPcCx3zwHKxLd=s32-rw",
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
                "name": "Olivia Brown",
                "booking": "Booked Party Planning",
                "date": "22 Feb 24",
                "rating": 3,
                "avatar": "https://randomuser.me/api/portraits/women/4.jpg",
                "indicators": {
                    "Taste": false,
                    "Behaviour": true,
                    "Presentation": true,
                    "Quantity": true,
                    "Hygiene": true,
                    "Punctuality": false
                },
                "text": "If you want to make your event extra special, definitely go with Hora Services' Chef for Party! The chef was incredibly professional, friendly, and made the whole cooking process so much fun. The food was incredible—easily the highlight of the evening."
            },
            {
                "name": "Yash Jadav",
                "booking": "Booked Themed Decor for Birthday Party",
                "date": "14 Mar 24",
                "rating": 3,
                "avatar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf9gbKLIRaf9WtoLCRkyRduQC-YAwEnAyPZ6t7AVEjI-tkhupfOgKk0heFjw&s",
                "indicators": {
                    "Taste": false,
                    "Behaviour": false,
                    "Presentation": true,
                    "Quantity": false,
                    "Hygiene": true,
                    "Punctuality": true
                },
                "text": "Hora Services transformed my venue with their stunning decorations. From the floral arrangements to the balloon arch, every detail was carefully thought out. It was exactly what I envisioned for my event!"
            },
            {
                "name": "Radika Sharma",
                "booking": "Booked Event Styling for Anniversary",
                "date": "30 Apr 24",
                "rating": 5,
                "avatar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVR5kfELoNTyq9ooySzzeGiAnrEBQvsrkNTOTvJxyeCgTUgJo3vnLUQVaUMA&s",
                "indicators": {
                    "Taste": false,
                    "Behaviour": true,
                    "Presentation": true,
                    "Quantity": true,
                    "Hygiene": true,
                    "Punctuality": true
                },
                "text": "Hora Celebration Designs exceeded our expectations with their exceptional service. The anniversary celebration was beautifully styled, and every detail was perfect. Highly recommend their services!"
            },
            {
                "name": "Akshay Singh",
                "booking": "Booked Decoration for Baby Shower",
                "date": "15 May 24",
                "rating": 4,
                "avatar": "data:image/jpeg;base64,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",
                "indicators": {
                    "Taste": false,
                    "Behaviour": true,
                    "Presentation": true,
                    "Quantity": true,
                    "Hygiene": false,
                    "Punctuality": true
                },
                "text": "I booked Hora Services for my baby shower, and they did an absolutely fantastic job with the balloon decorations! The colors were soft and beautiful, matching the theme perfectly. The balloon arch was gorgeous, and it created such a welcoming atmosphere for our guests. The team was professional and punctual—couldn't have asked for a better experience!"
            },
        {
            "name": "Aarav Sharma",
            "booking": "Booked Balloon Decoration and Live Catering",
            "date": "10 July 24",
            "rating": 5,
            "avatar": "https://randomuser.me/api/portraits/men/1.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Hora truly exceeded our expectations! The balloon decorations were stunning, and the live catering was a hit with everyone. The team was punctual and very attentive to our needs. Highly recommend their services for any event!"
        },
        {
            "name": "Saanvi Patel",
            "booking": "Booked Chef for Dinner Party",
            "date": "22 June 24",
            "rating": 4,
            "avatar": "https://randomuser.me/api/portraits/women/2.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": false
            },
            "text": "I booked a private chef from Hora Services for a dinner party, and it was an absolute hit! The food was exceptional—each dish was beautifully presented and bursting with flavor. The chef was so professional, making sure every detail was perfect. Our guests couldn't stop talking about the meal! Highly recommend for anyone looking to elevate their event."
        },
        {
            "name": "Vivaan Gupta",
            "booking": "Booked Balloon Decoration for Engagement",
            "date": "05 June 24",
            "rating": 5,
            "avatar": "https://media.istockphoto.com/id/613557584/photo/portrait-of-a-beautifull-smiling-man.jpg?s=612x612&w=0&k=20&c=hkCg5CrmTKOApePbPOyo1U9GexEfIJOJqoLXJIvcN8E=",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Absolutely wonderful service! The balloon decorations for our engagement party were perfect, and everything was handled with great professionalism. Couldn’t have asked for a better team to make our day special."
        },
        {
            "name": "Isha Mehta",
            "booking": "Booked Decoration for Baby Shower",
            "date": "15 May 24",
            "rating": 4,
            "avatar": "https://photosrush.net/wp-content/uploads/simple-cute-girl-pic-caption-1.jpg",
            "indicators": {
                "Taste": false,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": false,
                "Punctuality": true
            },
            "text": "I couldn't be happier with the balloon decorations provided by Hora Services for my baby shower! They really listened to my vision and turned it into reality with the most creative and stunning arrangements. The balloons were vibrant, and they even incorporated cute little details to match the baby theme. Highly recommend for anyone planning a special event!"
        },
        {
            "name": "Arjun Singh",
            "booking": "Booked Live Catering for Corporate Event",
            "date": "30 April 24",
            "rating": 3,
            "avatar": "https://randomuser.me/api/portraits/men/5.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": false,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "We booked live catering from Hora Services for our corporate event on April 30th, 2024, and it was absolutely amazing! The food was fresh, vibrant, and beautifully presented. The live cooking stations were a huge hit with our guests, and the chef's skills were impressive. Everything was perfectly coordinated, and the team was so professional. I highly recommend them for any corporate function!"
        },
        {
            "name": "Ananya Joshi",
            "booking": "Booked Decoration and Chef for Reception",
            "date": "18 March 24",
            "rating": 5,
            "avatar": "https://randomuser.me/api/portraits/women/6.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Our wedding reception was a huge success thanks to Hora. Both the decorations and the food were exceptional. Everything was handled perfectly, and the team was incredibly professional and accommodating."
        },
        {
            "name": "Kartik Agarwal",
            "booking": "Booked Balloon Decoration for Kid's Birthday",
            "date": "01 July 24",
            "rating": 4,
            "avatar": "https://randomuser.me/api/portraits/men/7.jpg",
            "indicators": {
                "Taste": false,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "I booked Hora Services for my child’s birthday, and they completely exceeded my expectations! The balloon decorations were absolutely magical—colorful, fun, and perfectly themed. The kids loved the balloon arch and the creative designs! The team was punctual, professional, and made everything so easy. I will definitely be using them for future events!"
        },
        {
            "name": "Priya Sharma",
            "booking": "Booked Chef and Live Catering for Party",
            "date": "14 June 24",
            "rating": 5,
            "avatar": "https://randomuser.me/api/portraits/women/8.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Hora made our graduation party memorable with excellent catering and service. The food was superb, and the team was punctual and professional. Highly recommend them for any event."
        },
        {
            "name": "Rohan Kapoor",
            "booking": "Booked Balloon Decoration for Baby Shower",
            "date": "25 April 24",
            "rating": 3,
            "avatar": "https://randomuser.me/api/portraits/men/9.jpg",
            "indicators": {
                "Taste": false,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": false,
                "Hygiene": false,
                "Punctuality": true
            },
            "text": "I hired Hora Services for decorations, and they did an incredible job! The team created the perfect ambiance with their beautiful designs, and I received so many compliments from my guests. Highly recommend!"
        },
        {
            "name": "Neha Patel",
            "booking": "Booked Chef and Balloon Decoration",
            "date": "12 May 24",
            "rating": 4,
            "avatar": "https://randomuser.me/api/portraits/women/10.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "The chef and balloon decorations were excellent for our housewarming party. The service was prompt, and everything looked great."
        },
        {
            "name": "Amit Kumar",
            "booking": "Booked Live Catering for Birthday Party",
            "date": "03 June 24",
            "rating": 5,
            "avatar": "https://randomuser.me/api/portraits/men/11.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Everything was perfect for our birthday party. The live catering was outstanding, and the team was professional and courteous. The food was delicious and everyone had a great time."
        },
        {
            "name": "Shruti Agarwal",
            "booking": "Booked Decoration for Corporate Event",
            "date": "29 June 24",
            "rating": 4,
            "avatar": "https://randomuser.me/api/portraits/women/12.jpg",
            "indicators": {
                "Taste": false,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Hora Services truly transformed our corporate event with their stunning decorations. From the floral arrangements to the custom branding touches, everything was on point. The attention to detail was incredible, and the setup was flawless. Our team and guests were all impressed, and I’ll definitely be booking them again for future events"
        },
        {
            "name": "Ravi Kumar",
            "booking": "Booked Balloon Decoration and Live Catering",
            "date": "08 July 24",
            "rating": 4,
            "avatar": "https://thumbs.dreamstime.com/b/young-indian-man-happy-outdoors-looking-camera-39595562.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Hora did a wonderful job with the balloon decorations and live catering. The setup was beautiful, and the food was tasty. The team was professional, although there was a slight delay in the setup."
        },
        {
            "name": "Aanya Verma",
            "booking": "Booked Chef for Anniversary Party",
            "date": "21 June 24",
            "rating": 5,
            "avatar": "https://images.pexels.com/photos/4307692/pexels-photo-4307692.jpeg?cs=srgb&dl=pexels-ketut-subiyanto-4307692.jpg&fm=jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "The chef and catering service provided by Hora for our anniversary party were exceptional. The food was delicious and the service was flawless. Highly recommend them for any special occasion!"
        },
        {
            "name": "Kiran Reddy",
            "booking": "Booked Balloon Decoration for Office Party",
            "date": "27 May 24",
            "rating": 4,
            "avatar": "https://t3.ftcdn.net/jpg/01/31/93/60/360_F_131936042_7mqbuFNDSTlCEImH4GCkIiAuI66swziu.jpg",
            "indicators": {
                "Taste": false,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "The decoration service from Hora Services took my party to the next level. The arrangements were not only gorgeous but also unique and perfectly matched the theme. It truly made the event feel special and unforgettable."
        },
        {
            "name": "Maya Singh",
            "booking": "Booked Live Catering for Family Reunion",
            "date": "15 June 24",
            "rating": 5,
            "avatar": "https://img.freepik.com/premium-photo/indian-woman-thinking-happy-college-scholarship-opportunity-campus-learning-university-student-smile-gen-z-class-schedule-idea-memory-decision-education_590464-381315.jpg?semt=ais_hybrid&w=740",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Hora Services exceeded my expectations with their decoration service. The team listened to my ideas and created a beautiful, elegant setup for my wedding. It made the event feel magical, and I couldn’t have asked for more!"
        },
        {
            "name": "Nikhil Joshi",
            "booking": "Booked Balloon Decoration for Wedding",
            "date": "20 May 24",
            "rating": 3,
            "avatar": "https://randomuser.me/api/portraits/men/17.jpg",
            "indicators": {
                "Taste": false,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": false,
                "Hygiene": false,
                "Punctuality": true
            },
            "text": "Hora Services made our wedding day absolutely magical with their stunning decorations. The floral arrangements were breathtaking, and the attention to detail was perfect. Our guests couldn't stop complimenting how beautiful everything looked!"
        },
        {
            "name": "Riya Gupta",
            "booking": "Booked Balloon Decoration for Baby Shower",
            "date": "05 June 24",
            "rating": 4,
            "avatar": "https://randomuser.me/api/portraits/women/18.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "The balloon decorations and catering for our baby shower were excellent. The food was delicious, and the decorations were beautiful. great service."
        },
        {
            "name": "Aditya Patel",
            "booking": "Booked Live Catering for Graduation Party",
            "date": "12 July 24",
            "rating": 5,
            "avatar": "https://randomuser.me/api/portraits/men/19.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "The live catering service was fantastic for our graduation party. The food was amazing, and the team was very professional. The event went off without a hitch, thanks to Hora."
        },
        {
            "name": "Siddhi Rao",
            "booking": "Booked Balloon Decoration",
            "date": "01 July 24",
            "rating": 4,
            "avatar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXrjzld1vMgJ9I5-HhB2lbcyLEYovuPu_lng&s",
            "indicators": {
                "Taste": false,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Hora Services did an amazing job decorating our corporate event. The colors, the centerpieces, and the overall layout were perfect for our theme. They turned the space into something truly special and gave our guests a memorable experience."
        },
        {
            "name": "Kabir Sharma",
            "booking": "Booked Chef for Housewarming",
            "date": "19 June 24",
            "rating": 5,
            "avatar": "https://randomuser.me/api/portraits/men/21.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Hora provided excellent chef and decoration services for our housewarming. The food was delicious and the decorations were perfect. The team was very professional and timely."
        },
        {
            "name": "Pooja Agarwal",
            "booking": "Booked Live Catering for Engagement Party",
            "date": "28 April 24",
            "rating": 4,
            "avatar": "https://randomuser.me/api/portraits/women/22.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Hora Services’ live catering was the highlight of our engagement party! Watching the chef prepare incredible dishes right in front of us was so fun, and the food was absolutely delicious. Our guests couldn’t stop talking about the experience!"
        },
        {
            "name": "Ishaan Kapoor",
            "booking": "Booked Balloon Decoration for Corporate Event",
            "date": "02 June 24",
            "rating": 3,
            "avatar": "https://randomuser.me/api/portraits/men/23.jpg",
            "indicators": {
                "Taste": false,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": false,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "I booked Hora Services for our corporate event, and they did an outstanding job with the decorations! The venue looked elegant and professional, with tasteful designs that matched our branding perfectly. The team was punctual and worked efficiently to ensure everything was set up seamlessly. I highly recommend them for any corporate function!"
        },
        {
            "name": "Meera Desai",
            "booking": "Booked Chef and Balloon Decoration for Birthday Party",
            "date": "09 May 24",
            "rating": 5,
            "avatar": "https://randomuser.me/api/portraits/women/24.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Everything was perfect for our birthday party. The food was delicious, and the balloon decorations were exactly what we wanted. The team was very professional and the event went smoothly."
        },
        {
            "name": "Rajesh Mehta",
            "booking": "Booked Balloon Decoration for Baby Shower",
            "date": "23 June 24",
            "rating": 4,
            "avatar": "https://img.freepik.com/free-photo/successful-businessman_1098-18155.jpg",
            "indicators": {
                "Taste": false,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Hora Services made our baby shower so special with their stunning decorations! The pastel-colored flowers, cute baby-themed centerpieces, and personalized touches created the perfect atmosphere for celebrating our little one. Highly recommend!"
        },
        {
            "name": "Sanya Verma",
            "booking": "Booked Live Catering for Wedding Reception",
            "date": "12 April 24",
            "rating": 5,
            "avatar": "https://media.istockphoto.com/id/1395880805/photo/indoor-close-up-portrait-of-beauty-asian-indian-serene-young-woman-sitting-near-the-window.jpg?s=612x612&w=0&k=20&c=HFFaDToYEashf-L8YCZh3y6mlTaOVHvkBqDsKN4mro0=",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "The live catering for our wedding reception was excellent. The food was delicious and the service was impeccable. The team was very accommodating and made sure everything was perfect."
        },
        {
            "name": "Ankit Singh",
            "booking": "Booked Balloon Decoration for Anniversary Party",
            "date": "29 May 24",
            "rating": 4,
            "avatar": "https://english.cdn.zeenews.com/sites/default/files/2017/11/17/639329-indian-men.jpg?",
            "indicators": {
                "Taste": false,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Hora Services made our anniversary celebration unforgettable. The decorations were elegant and romantic, with every detail thoughtfully arranged. It felt like a dream come true. Thank you for making our special day even more beautiful!"
        },
        {
            "name": "Jia Patel",
            "booking": "Booked Chef for Graduation Party",
            "date": "17 June 24",
            "rating": 5,
            "avatar": "https://randomuser.me/api/portraits/women/26.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "The chef provided by Hora was outstanding. The food was amazing and the service was top-notch. Our graduation party was a success thanks to their excellent catering."
        },
        {
            "name": "Gaurav Kumar",
            "booking": "Booked Balloon Decoration and Live Catering for Birthday Party",
            "date": "06 July 24",
            "rating": 4,
            "avatar": "https://randomuser.me/api/portraits/men/26.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "The live catering service from Hora Services was an absolute hit at our event! The chef prepared everything right in front of us, and the food was not only delicious but also an exciting experience for our guests. Highly recommend!"
        },
        {
            "name": "Neelam Yadav",
            "booking": "Booked Chef and Balloon Decoration for Family Gathering",
            "date": "10 June 24",
            "rating": 5,
            "avatar": "https://randomuser.me/api/portraits/women/27.jpg",
            "indicators": {
                "Taste": true,
                "Behaviour": true,
                "Presentation": true,
                "Quantity": true,
                "Hygiene": true,
                "Punctuality": true
            },
            "text": "Everything was perfect for our family gathering. The food was excellent, and the balloon decorations were exactly what we hoped for. The team was very professional and everything went smoothly."
        }

    ]

    const [visibleReviews, setVisibleReviews] = useState(10);

    const loadMore = () => {
        setVisibleReviews((prevVisible) => Math.min(prevVisible + 10, allReviewsData.length));
    };

    return (
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
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar src={review.avatar} />
                                <div>
                                    <UserName>{review.name}</UserName>
                                    <BookingInfo>{review.booking}</BookingInfo>
                                </div>
                            </div>
                            <BookingDate>{review.date}</BookingDate>
                        </UserInfo>
                        <UserRating>{getStars(review.rating)}</UserRating>
                        {/* <Indicators>
                            {Object.entries(review.indicators).map(([key, value]) => (
                                value && <Indicator key={key}>{key}👍</Indicator>
                            ))}
                        </Indicators> */}
                        <ReviewText>{review.text}</ReviewText>
                    </ReviewCard>
                ))}
            </ReviewContainer1>
            {visibleReviews < allReviewsData.length && (
                <LoadMoreButton onClick={loadMore}>Load More</LoadMoreButton>
            )}
        </Container>
    );
};

export default CustomersReviews;