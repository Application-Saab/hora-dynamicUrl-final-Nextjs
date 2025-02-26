import React from "react";
import hero_general from "../../assets/hero_general.jpg";
import how_1 from '../../../public/assets/how_1.svg';
import how_2 from '../../../public/assets/how_2.svg';
import how_3 from "../../../public/assets/how_3.svg";
import Image from "next/image";
import '../../pages/aboutus/aboutus.css';
import Head from 'next/head';
import { getDecorationOrganizationSchema } from '../../utils/schema';

const AboutUs = () => {
      const schemaOrg = getDecorationOrganizationSchema();
      const scriptTag = JSON.stringify(schemaOrg);
  return (
    <div className="aboutUsContainer">
      <Head>
  <title>About Us - HORA Decorations | Professional Balloon & Flower Decorations for Every Occasion</title>
  <meta name="description" content="Learn more about HORA Decorations, your trusted partner for stunning balloon and flower decorations for birthdays, weddings, anniversaries, parties, and more. Our mission is to bring your events to life with creativity, passion, and top-quality decor." />
  <meta name="keywords" content="about hora services, balloon decorations, flower decorations, event decorators, professional decorators, party decorations, wedding decorations, anniversary decorations, event planning" />
  <meta property="og:title" content="About HORA Decorations - Professional Balloon & Flower Decorators" />
  <meta property="og:description" content="Discover HORA Decorations, a team of expert decorators providing personalized balloon and flower decorations for events. From intimate gatherings to large-scale celebrations, we bring creativity and professionalism to every occasion." />
  <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
  <meta property="og:image:alt" content="HORA Decorations logo, balloon and flower decor for events" />
  <script type="application/ld+json">{scriptTag}</script>  
  <meta name="robots" content="index, follow" />
  <meta name="author" content="Hora Services" />
  <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
  <meta property="og:url" content="https://horaservices.com/aboutus" />
  <meta property="og:type" content="website" />
</Head>

      <div className="heroSingle" style={{ backgroundImage: `url(${hero_general.src})` }}>
        <div className="imageOverlay">
          <div className="textContent">
            <h1>About Us</h1>
            <p>Planning And Celebrating Events Since 2019!</p>
          </div>
        </div>
        <div className="frame white"></div>
      </div>

      <div className="pattern2 sec1">
        <div className="contentWrapper">
          <h2>Our Story</h2>
          <p>
            At Hora, we specialize in making every event memorable and stress-free with our comprehensive
            digital event planning services across India. Whether you're hosting a small gathering or a large 
            celebration, we offer everything you need to make your event unforgettable. 
            From food and catering options like hiring a personal chef, bulk food delivery, live catering, 
            and smart catering services, to stunning balloon and flower decorations, professional photography 
            packages, and engaging entertainment options like party hosts, mehndi artists, tattoo artists, mascots, 
            and more, we cover it all. Hora is your go-to partner for any occasion, whether it’s an 
            intimate anniversary party, a fun-filled kitty party, a child's birthday celebration, or 
            a grand wedding event. With our wide range of services offered at economical prices, we 
            strive to simplify your event planning experience and help you create lasting memories.
          </p>
        </div>
      </div>

      <div className="pattern2 sec2">
        <div className="contentWrapper">
          <h2>Why Choose Hora</h2>
          <p>
            Imagine indulging in a world-class dining experience without leaving the comfort of your home. With Hora, that dream becomes a reality. Our team of skilled private chefs is committed to delivering culinary excellence tailored to your unique preferences and occasion. From crafting tantalizing menus to showcasing their culinary artistry, our chefs will create a feast that will leave a lasting impression on your guests.
          </p>

          <strong> Hygiene: Our Top Priority </strong>
          <br />
          <strong> Exquisite Menus for Every Occasion </strong>
          <br />
          <strong> Savor the Convenience </strong>
          <br />
          <strong> Discover the Hora Difference </strong>
          <br />
          <br />
          <p className="duwnloadbtn"><a className="btn1" target="_blank" href="https://play.google.com/store/apps/details?id=com.hora" 
          role="button">Download Application</a></p>
        </div>
        
        <div className="secRight">
          <div className="boxHow">
            <Image src={how_1} alt='how_1' />
            <h3 className="boxTitle">Assurity of Dedicated call support</h3>
          </div>
          <div className="boxHow">
            <Image src={how_2} alt="how_2" />
            <h3 className="boxTitle">Amazing Experience</h3>
          </div>
          <div className="boxHow">
            <Image src={how_3} alt='how_3' />
            <h3 className="boxTitle">Trained & Verified Professionals</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;