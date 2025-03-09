import React from 'react'
import Slider from 'react-slick';
import Image from 'next/image';
import DecorationIcon from '../../assets/decoration_icon.webp';
const CelebrateWithUs = () => {
    const celebrateslidersettings = {
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        arrows: false,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 1,
            },
          },
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 458,
              settings: {
                slidesToShow: 1, // Adjusted to 1 to better fit smaller screens
                slidesToScroll: 1,
              },
            },
          ]
          
      };
      const celebrateData = [
        {
          id: 1,
          title: 'Birthday and Anniversary',
          imageUrl: require('../../assets/homepage_Celebrate1.png'),
          imgAlt: 'Birthday and Anniversary celebration',
          link: "/balloon-decoration/birthday-decoration",
        },
        {
          id: 2,
          title: 'House Parties',
          imageUrl: require('../../assets/homepage_Celebrate2.png'),
          imgAlt: 'House parties celebration',
          link :'/book-chef-cook-for-party'
          
        },
        {
          id: 3,
          title: 'Corporate Events',
          imageUrl: require('../../assets/homepage_Celebrate3.png'),
          imgAlt: 'Corporate events celebration',
          link: "/party-food-delivery-live-catering-buffet/party-food-delivery",
        },
        {
          id: 4,
          title: 'Wedding Events',
          imageUrl: require('../../assets/homepage_Celebrate4.png'),
          imgAlt: 'Wedding events celebration',
          link:"/balloon-decoration/anniversary-decoration"
        },
        {
          id: 5,
          title: 'Gatherings',
          imageUrl: require('../../assets/homepage_Celebrate5.png'),
          imgAlt: 'Gatherings celebration',
          link: "/balloon-decoration/premium-decoration",
        },
        {
          id: 6,
          title: 'Kids Events',
          imageUrl: require('../../assets/homepage_Celebrate6.png'),
          imgAlt: 'Kids events celebration',
          link: "/balloon-decoration/kids-birthday-decoration",
        },
      ];
    
  return (
    <div className="celebrate-container section-container">
    <h2 className="heading-black">Celebrate With Us <Image src={DecorationIcon} alt="Entertainment Icon" className="heading-Icon" />
    </h2>
    <p className="subtitle">You can easily search for what category of item you want to order.</p>
    <div className="categories-cards">
      <Slider {...celebrateslidersettings}>
        {celebrateData.map(category => (
          <div key={category.id} className="categories-card">
            <a href={category.link} rel="noopener noreferrer">
              <Image src={category.imageUrl} alt={category.title} className="categories-image" />          
            <p className="categories-name">{category.title}</p>
            </a>
          </div>
        ))}
      </Slider>
    </div>


  </div>
  )
}

export default CelebrateWithUs;