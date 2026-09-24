"use client";
import React from "react";
import frame_footer from "../../assets/frame_footer.png";
import horaFooterImage from '../../assets/hora-footer-bg.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Container, Row, Col } from 'react-bootstrap';
import './footer.css';
import Link from "next/link";
import { useCity } from "@/utils/cityContext";

const footerColumns = [
  {
    title: 'About Hora',
    links: [
      { text: 'My Order', to: '/orderlist' },

      { text: 'About Us', href: '/aboutus' },
      { text: 'Private Policy', href: '/termCondition' },
      { text: 'Terms & Condition', href: '/termCondition' },
      { text: 'Sitemap', href: 'https://horaservices.com/sitemap.xml' },
    ],
  },

  {
    title: 'Services',
    links: [
      { text: 'Chef for Party and Occasions', href: '/book-chef-cook-for-party' },
      { text: 'Decorations for Party and Occasions', href: '/balloon-decoration' },
      { text: 'Photography for Party and Occasions', href: '/photography-page' },
      { text: 'Food Delivery for Party and Occasions', href: 'party-food-delivery-live-catering-buffet/party-food-delivery' },
      { text: 'Catering Service for Party and Occasions', href: '/party-food-delivery-live-catering-buffet/party-live-buffet-catering' },
    ],
  },
  {
    title: "Services in your city",
    links: [
      { text: 'Delhi', to: '/delhi', city: 'Delhi' },
      { text: 'Gurugram', to: '/gurugram', city: 'Gurugram' },
      { text: 'Ghaziabad', to: '/ghaziabad', city: 'Ghaziabad' },
      { text: 'Faridabad', to: '/faridabad', city: 'Faridabad' },
      { text: 'Noida', to: '/noida', city: 'Noida' },
      { text: 'Bangalore', to: '/bangalore', city: 'Bangalore' },
      { text: 'Hyderabad', to: '/hyderabad', city: 'Hyderabad' },
      { text: 'Mumbai', to: '/mumbai', city: 'Mumbai' },
    ]
  },
  {
    title: 'Chef',
    links: [
      { text: 'Delhi', to: '/delhi/book-chef-cook-for-party', city: 'Delhi' },
      { text: 'Gurugram', to: '/gurugram/book-chef-cook-for-party', city: 'Gurugram' },
      { text: 'Ghaziabad', to: '/ghaziabad/book-chef-cook-for-party', city: 'Ghaziabad' },
      { text: 'Faridabad', to: '/faridabad/book-chef-cook-for-party', city: 'Faridabad' },
      { text: 'Noida', to: '/noida/book-chef-cook-for-party', city: 'Noida' },
      { text: 'Bangalore', to: '/bangalore/book-chef-cook-for-party', city: 'Bangalore' },
      { text: 'Hyderabad', to: '/hyderabad/book-chef-cook-for-party', city: 'Hyderabad' },
      { text: 'Mumbai', to: '/mumbai/book-chef-cook-for-party', city: 'Mumbai' },
    ],
  },
  {
    title: 'Decorations',
    links: [
      { text: 'Delhi', to: '/delhi/balloon-decoration', city: 'Delhi' },
      { text: 'Gurugram', to: '/gurugram/balloon-decoration', city: 'Gurugram' },
      { text: 'Ghaziabad', to: '/ghaziabad/balloon-decoration', city: 'Ghaziabad' },
      { text: 'Faridabad', to: '/faridabad/balloon-decoration', city: 'Faridabad' },
      { text: 'Noida', to: '/noida/balloon-decoration', city: 'Noida' },
      { text: 'Bangalore', to: '/bangalore/balloon-decoration', city: 'Bangalore' },
      { text: 'Hyderabad', to: '/hyderabad/balloon-decoration', city: 'Hyderabad' },
      { text: 'Mumbai', to: '/mumbai/balloon-decoration', city: 'Mumbai' },
    ],
  },
  {
    title: 'Photographer',
    links: [
      { text: 'Delhi', to: '/delhi/photography-page', city: 'Delhi' },
      { text: 'Gurugram', to: '/gurugram/photography-page', city: 'Gurugram' },
      { text: 'Ghaziabad', to: '/ghaziabad/photography-page', city: 'Ghaziabad' },
      { text: 'Faridabad', to: '/faridabad/photography-page', city: 'Faridabad' },
      { text: 'Noida', to: '/noida/photography-page', city: 'Noida' },
      { text: 'Bangalore', to: '/bangalore/photography-page', city: 'Bangalore' },
      { text: 'Hyderabad', to: '/hyderabad/photography-page', city: 'Hyderabad' },
      { text: 'Mumbai', to: '/mumbai/photography-page', city: 'Mumbai' },
    ],
  },
  {
    title: 'Party Venues',
    links: [
      { text: 'Delhi', to: '/delhi/venue-list', city: 'Delhi' },
      { text: 'Gurugram', to: '/gurugram/venue-list', city: 'Gurugram' },
      { text: 'Ghaziabad', to: '/ghaziabad/venue-list', city: 'Ghaziabad' },
      { text: 'Faridabad', to: '/faridabad/venue-list', city: 'Faridabad' },
      { text: 'Noida', to: '/noida/venue-list', city: 'Noida' },
      { text: 'Bangalore', to: '/bangalore/venue-list', city: 'Bangalore' },
      { text: 'Hyderabad', to: '/hyderabad/venue-list', city: 'Hyderabad' },
      { text: 'Mumbai', to: '/mumbai/venue-list', city: 'Mumbai' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { text: '+917338584828', href: 'tel:+917338584828' },
      { text: 'dev@horaservices.com', href: 'mailto:dev@horaservices.com', style: { textTransform: 'lowercase' } },
      { text: 'Contact Us', href: '/contactus' },
    ],
  },
];

function Footer() {
  const { syncSelectedCity } = useCity();

  const handleCityLinkClick = (city) => {
    if (city) {
      syncSelectedCity(city);
    }
  };

return (
    <footer style={style.footer}>
      <div className="page-width footerlist">
          {footerColumns.map((column, index) => (
            <div key={index} className="footerlist-sec">
              <h2 className="footerheading">{column.title}</h2>
              <ul
                className={`list-unstyled-${index}`}
                style={{ listStyle: "none", padding: 0, margin: 0 }}
              >
                {column.links.map((link, idx) => (
                  <li key={idx} style={{ listStyle: "none" }}>
                    {link.to ? (
                      <Link
                        href={link.to}
                        style={style.link}
                        onClick={() => handleCityLinkClick(link.city)}
                      >
                        {link.text}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        style={style.link}
                      >
                        {link.text}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
       
      </div>
      <div className="page-width copy-right">
        <Row>
        <Col>
            <p className="copy p-0 m-0">© HORA - All rights reserved</p>
          </Col>
        </Row>
        <Row className="text-center align-items-center justify-content-center">
          <Col>
            <div className="social-icons">
              <Link href="https://www.facebook.com/profile.php?id=61550111701616" target="_blank" rel="noopener noreferrer" className="mx-2" style={{ color: "inherit" }}>
                <FontAwesomeIcon icon={faFacebook} />
              </Link>
              <Link href="https://www.instagram.com/horaservices/?fbclid=IwAR0PktJ-rl5rKC6YGSZ8BSw3m8o9qMfLpJchO17FCEZuCXKxvASZWRymifA" target="_blank" rel="noopener noreferrer" className="mx-2" style={{ color: "inherit" }}>
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
              <Link href="https://www.youtube.com/channel/UCj5gMUjptHut0aGYHxCbE5g" target="_blank" rel="noopener noreferrer" className="mx-2" style={{ color: "inherit" }}>
                <FontAwesomeIcon icon={faYoutube} />
              </Link>
            </div>
          </Col>
        
        </Row>
      </div>
    </footer>
  )
}

const style = {
  footer: {
    backgroundColor: "#96528D",
    padding: '10px 0',
    color: '#fff',
  },
  frameBlack: {
    background: `url(${frame_footer.src}) 0 0 repeat-x`,
    backgroundSize: '10px 3px',
    height: '3px',
    width: '100%',
    position: 'absolute',
    top: '-3px',
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
  
}

export default Footer;