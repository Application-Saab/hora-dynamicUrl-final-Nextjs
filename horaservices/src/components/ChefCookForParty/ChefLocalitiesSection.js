import cityData from "@/utils/cityData";
import { useRouter } from "next/router";
import React from "react";

export const ChefLocalitiesSection = ({ city }) => {
  const router = useRouter();

  const localityHandleClick = (localityName) => {
    const formattedLocality = localityName.replace(/\s+/g, "-").toLowerCase();

    router.push(`/${city}/${formattedLocality}/book-chef-cook-for-party`);
  };
  return (
    <>
      <p
        id="city-area-title"
        style={{
          fontSize: "70px",
          textTransform: "uppercase",
          fontWeight: "bold",
          color: "#E6756B",
          margin: "35px 0 2px",
          textAlign: "center",
        }}
      >
        Serving all Areas in {city}
      </p>
      <p
        style={{
          fontSize: "10px",
          fontWeight: "bold",
          color: "#E6756B",
          margin: "2px 0 2px",
          textAlign: "center",
        }}
      >
        All localities are here
      </p>
      <div
        id="city-area-list"
        style={{ width: "150px", alignItems: "center", margin: "auto" }}
      >
        <ul
          style={{
            listStyle: "none",
            padding: "20px 0",
            textAlign: "center",
          }}
        >
          {cityData[city]?.cityLocalitiesList?.length > 0 ? (
            cityData[city].cityLocalitiesList.map((item, index) => (
              <li
                key={index}
                style={{
                  padding: "0 10px",
                  display: "inline-block",
                }}
              >
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  localityHandleClick(item.name);
                }}>
                  {item.name}
                </a>
              </li>
            ))
          ) : (
            <li>No localities found for {city}</li>
          )}
        </ul>
      </div>
    </>
  );
};

export const chefFaqs = [
  {
    question: "How can I hire an online chef for my event in {CITY}?",
    answer: [
      "Hiring an online chef in {CITY} is easy!",
      "Visit our website or download our app and place the order by selecting your dish, number of people, date, and time of the event to secure their services for your event.",
    ],
  },
  {
    question:
      "What makes your catering services the best for small parties in {CITY}?",
    answer: [
      "Our catering services in {CITY} are tailored for small parties, We offer personalized options to make your event unforgettable.",
    ],
  },
  {
    question: "Can I book a private chef for a day or night in {CITY}?",
    answer: [
      "Absolutely! Our private chefs are available for hire in {CITY}, ensuring a unique dining experience for any occasion.",
    ],
  },
  {
    question: "How do I find a trained verified cook near me in {CITY}?",
    answer: [
      "Finding a trained verified cook near you is simple. Enter your location on our platform, and choose from a list of dishes, number of people, date and time of event.",
    ],
  },
  {
    question:
      "Is Book a cook in {CITY} suitable for last-minute chef bookings?",
    answer: [
      "Yes, our platform allows for convenient and quick bookings, you can book the order 24 hours in advance.",
    ],
  },
  {
    question: "What sets your chefs for hire in {CITY} apart from others?",
    answer: [
      "Our chefs in {CITY} are not only skilled but also verified, ensuring a high standard of service and culinary expertise.",
    ],
  },
  {
    question: "Can I hire a cook at home for a special occasion in {CITY}?",
    answer: [
      "Certainly! Explore our selection of cooks available for hire at home in {CITY} to make your event memorable.",
    ],
  },
  {
    question:
      "How do I take a chef in {CITY} for a personalized cooking experience?",
    answer: [
      "Taking a chef in {CITY} is simple. Choose a chef, specify your preferences, and enjoy a personalized cooking experience in the comfort of your home.",
    ],
  },
  {
    question:
      "Are your party caterers in {CITY} suitable for both small and large events?",
    answer: [
      "Yes, our party caterers in {CITY} cater to a variety of events, from intimate gatherings to larger celebrations.",
    ],
  },
  {
    question: "Can I hire a professional chef for a night in {CITY}?",
    answer: [
      "Absolutely! Explore our options to hire a professional chef for a night in {CITY} and create a culinary experience to remember.",
    ],
  },
  {
    question:
      "Is it possible to hire someone to cook for me in {CITY} regularly?",
    answer: [
      "Yes, you can hire a cook near you in {CITY} for regular cooking services. Choose a cook that fits your preferences and schedule.",
    ],
  },
  {
    question:
      "What is the process for hiring a private personal chef in {CITY}?",
    answer: [
      "Hiring a private personal chef is easy. Browse through our profiles, select your preferred chef, and book their services for a personalized culinary experience.",
    ],
  },
  {
    question: "How can I find the best home caterers in {CITY}?",
    answer: [
      "Finding the best home caterers in {CITY} is simple with our platform. Explore our options and choose the one that suits your needs.",
    ],
  },
  {
    question: "Do you have top-rated cooks in {CITY} available for hire?",
    answer: [
      "Yes, we have a selection of top-rated cooks in {CITY} available for hire. Explore their profiles and book the one that meets your requirements.",
    ],
  },
  {
    question:
      "Can I hire a chef at home in {CITY} for a cooking demonstration?",
    answer: [
      "Absolutely! Hire a chef at home in {CITY} for a cooking demonstration and learn culinary skills from a professional.",
    ],
  },
  {
    question:
      "What is the difference between a private chef and a personal cook in {CITY}?",
    answer: [
      "A private chef typically offers a more personalized and upscale dining experience, while a personal cook provides regular cooking services. Choose based on your specific needs.",
    ],
  },
  {
    question:
      "Can I hire cooks on demand in {CITY} for last-minute gatherings?",
    answer: [
      "Yes, our platform allows you to hire cooks on demand in {CITY}, making it convenient for spontaneous events.",
    ],
  },
  {
    question:
      "How can I find local chefs for hire in {CITY} for a regional cuisine?",
    answer: [
      "Finding local chefs for hire in {CITY} is easy. Specify your cuisine preferences, and our platform will display chefs with expertise in that cuisine.",
    ],
  },
  {
    question: "Are there cooking maids near me in {CITY} available for hire?",
    answer: [
      "Yes, you can find cooking maids near you in {CITY} available for hire. Explore their profiles and choose the one that suits your needs.",
    ],
  },
  {
    question:
      "Can I hire a personal chef for a night in {CITY} for a romantic dinner?",
    answer: [
      "Certainly! Hire a personal chef for a night in {CITY} and create a romantic dining experience in the comfort of your home",
    ],
  },
  {
    question:
      "How do I hire a cook online in {CITY} for virtual cooking sessions?",
    answer: [
      "Hiring a cook online in {CITY} for virtual cooking sessions is simple. Browse through available cooks, choose one, and arrange for an online cooking session.",
    ],
  },
  {
    question: "What makes your home cooking service in {CITY} unique?",
    answer: [
      "Our home cooking service in {CITY} is unique due to our diverse selection of trained and verified cooks, ensuring a high-quality culinary experience",
    ],
  },
  {
    question:
      "Can I book mini caterers in {CITY} for a small family gathering?",
    answer: [
      "Absolutely! Our mini caterers in {CITY} are perfect for small family gatherings, providing a customized and delightful culinary experience.",
    ],
  },
  {
    question:
      "How do I hire a private cook for home in {CITY} for regular meals?",
    answer: [
      "Hiring a private cook for home in {CITY} for regular meals is easy. Choose a cook that fits your preferences and schedule for consistent cooking services.",
    ],
  },
  {
    question:
      "Are your private chef services near me in {CITY} available for special dietary requirements?",
    answer: [
      "Yes, our private chef services near you in {CITY} are customizable to accommodate special dietary requirements. Discuss your needs with the selected chef to ensure a tailored culinary experience.",
    ],
  },
];

export const ChefFAQS = ({ city }) => {
  const displayCity = city?.trim() || "";

  const formatText = (text) =>
    text.replaceAll("{CITY}", displayCity?.toUpperCase());

  return (
    <div id="faqQ">
      <div>
        <h1
          style={{
            fontSize: "70px",
            textTransform: "uppercase",
            fontWeight: "bold",
            color: "#E6756B",
            margin: "35px 0 0px",
            textAlign: "center",
          }}
        >
          Faq
        </h1>
      </div>

      {chefFaqs.map((faq, index) => (
        <div key={index}>
          <strong>
            {index + 1}: {formatText(faq.question)}
          </strong>

          {faq.answer.map((answer, answerIndex) => (
            <p key={answerIndex}>A: {formatText(answer)}</p>
          ))}
        </div>
      ))}
    </div>
  );
};
