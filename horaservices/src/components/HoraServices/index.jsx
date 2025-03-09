import React from 'react'
import DecorationIcon from '../../assets/decoration_icon.webp';
import PhotographyIcon from '../../assets/photography_icon.webp';
import FoodIcon from '../../assets/food_icon.png';
import Image from 'next/image';

const Horaservices = ({ city, locality }) => {
  const foodData = [
    {
      id: 1,
      image: "https://horaservices.com/api/uploads/homepage_food1.webp",
      title: "Bulk Food Delivery",
      imgAlt: "Bulk food delivery service",
      link: "/party-food-delivery-live-catering-buffet/party-food-delivery"
    },
    {
      id: 2,
      image: "https://horaservices.com/api/uploads/homepage_food2.webp",
      title: "Chef For Party",
      imgAlt: "Chef cooking for a party",
      link: "/book-chef-cook-for-party"
    },
    {
      id: 3,
      image: "https://horaservices.com/api/uploads/homepage_food3.webp",
      title: "Live Catering",
      imgAlt: "Live catering service at an event",
      link: "/party-food-delivery-live-catering-buffet/party-live-buffet-catering"
    },
  ];

  const photographyUrl = () => {
    window.open(
      'https://api.whatsapp.com/send?phone=+917338584828&text=I%20wanted%20to%20know%20about%2C%20photography',
      '_blank'
    );
  }


  return (
    <>
      <div className="food-container section-container">
        <h2 className="heading-purple food-title">
          <span>Food</span>
          <span><Image src={FoodIcon} alt="Food Icon" className="heading-Icon" /></span>
        </h2>
        <div className="food-services-cards desktop">
          {foodData.map(item => (
            <div key={item.id} className="food-card">
              <a href={
                city && locality
                  ? `${city}/${locality}/${item.link}`  // If both city and locality exist
                  : city
                    ? `${city}/${item.link}`             // If only city exists
                    : `${item.link}`                      // If neither exist
              }
              onClick={() => {
                const eventName = item.title.replace(/\s+/g, "") + "Click";
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  event: eventName,
                  itemTitle: item.title,
                  itemLink: item.link,
                });
                localStorage(window.dataLayer, "dataLayer");
                handleTitleClick(item.title);
              }}
                className="food-card-link">
                <Image src={item.image} alt={item.title} className="food-image" width={200} height={100} />
                <p className="food-card-title">{item.title}</p>
              </a>
            </div>
          ))}
        </div>

        <div className="food-services-cards mobile">
          {foodData.slice(0, 1).map(item => (
            <div key={item.id} className="food-card left-side">
              <a href={
                city && locality
                  ? `/${city}/${locality}/${item.link}`  // If both city and locality exist
                  : city
                    ? `${city}/${item.link}`             // If only city exists
                    : `${item.link}`                      // If neither exist
              }
              onClick={() => {
                const eventName = item.title.replace(/\s+/g, "") + "Click";
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  event: eventName,
                  itemTitle: item.title,
                  itemLink: item.link,
                });
                localStorage(window.dataLayer, "dataLayer");
                handleTitleClick(item.title);
              }}
                className="food-card-link">
                <Image
                  src={item.image}
                  alt={item.title}
                  className="food-image"
                  width={0} // Set dynamically
                  height={0} // Set dynamically
                  // sizes="100vw" // Makes it responsive
                  style={{ width: "auto", height: "100%" }}
                />
                <p className="food-card-title">{item.title}</p>
              </a>
            </div>
          ))}

          <div className="food-card  right-side">
            {foodData.slice(1, 3).map(item => (
              <div key={item.id} className="right-card">
                <a href={
                  city && locality
                    ? `/${city}/${locality}/${item.link}`  // If both city and locality exist
                    : city
                      ? `${city}/${item.link}`             // If only city exists
                      : `${item.link}`                      // If neither exist
                }
                  className="food-card-link">
                  <Image src={item.image} alt={item.title} className="food-image" width={0} // Set dynamically
                    height={0} // Set dynamically                  
                    style={{ width: "auto", height: "auto" }} />
                  <p className="food-card-title">{item.title}</p>
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="decore-photo-con section-container">
        <div className="decore service">
          <h2 className='heading-purple'>
            Decoration
            <Image src={DecorationIcon} alt="Decoration Icon" className="heading-Icon" />
          </h2>

          <div className="service-image-container">
            <Image src="https://horaservices.com/api/uploads/homepage_decoration.webp" alt="Decoration" className="service-image" width={200} height={100} />
            <button
              className="book-now"
              onClick={() => {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  event: 'decoration_button_click',  // Custom event name
                  custom_button_id: 'decoration_button',  // Custom parameter name with your chosen value
                });
                const url = city && locality
                  ? `/${city}/${locality}/balloon-decoration`  // If both city and locality exist
                  : city
                    ? `${city}/balloon-decoration`             // If only city exists
                    : `/balloon-decoration`;                   // If neither exist

                window.location.href = url;
              }}

            >
              Book Now
            </button>

          </div>
        </div>
        <div className="photo service">
          <h2 className='heading-purple'>
            Photography
            <Image src={PhotographyIcon} alt="Photography Icon" className="heading-Icon" />
          </h2>

          <div className="service-image-container">
            <Image src="https://horaservices.com/api/uploads/homepage_photography.webp" alt="Photography" className="service-image" width={200} height={100} />
            <button className="book-now" onClick={() => {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                event: 'photography_button_click',  // Custom event name
                photography_button_id: 'photography_button',  // Custom parameter name with another value
              });
              photographyUrl();
            }} >Book Now</button>

          </div>
        </div>
      </div>

    </>
  )
}

export default Horaservices;