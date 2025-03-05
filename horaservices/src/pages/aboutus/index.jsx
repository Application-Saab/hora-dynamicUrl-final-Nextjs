import React from "react";
import hero_general from "../../assets/hero_general.webp";
import how_1 from '../../assets/how_1.webp';
import how_2 from '../../assets/how_2.webp';
import how_3 from "../../assets/how_3.webp";
import Image from "next/image";
import '../../pages/aboutus/aboutus.css';

const AboutUs = () => {
  return (
    <div className="aboutUsContainer">
      <div className="heroSingle" style={{ backgroundImage: `url(${hero_general.src})` }}>
     
          <div className="textContent">
            <h1>About Us</h1>
            <p>Planning And Celebrating Events Since 2019!</p>
          </div>
        
        {/* <div className="frame white"></div> */}
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
          <p className="duwnloadbtn"><a className="btn1" target="_blank" href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services" 
          role="button">Connect with Us</a></p>
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