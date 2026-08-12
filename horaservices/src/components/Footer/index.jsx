"use client";
import React from "react";
import frame_footer from "../../assets/frame_footer.png";
import horaFooterImage from '../../assets/hora-footer-bg.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Container, Row, Col } from 'react-bootstrap';
import Link from "next/link";
import { useCity } from "@/utils/cityContext";

const footerColumns = [
  {
    title: 'About Hora',
    links: [
      { text: 'My Order', to: '/orderlist' },
      // { text: 'Invitation', to: '/invitation' },
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
      // { text: 'Waiter for Party and Occasions', href: '/contactus' },
      // { text: 'Bar Tender for Party and Occasions', href: '/contactus' },
      // { text: 'Cleaner for Party and Occasions', href: '/contactus' },
      { text: 'Live Catering' , href:"/caterers"},
      { text: 'Food Delivery for Parties' , href:"/bulk-food-delivery"},
    ],
  },
  {
    title:"Services in your city",
    links: [
      { text: 'Delhi', to: '/delhi', city: 'Delhi' },
      { text: 'Gurugram', to: '/gurugram', city: 'Gurugram' },
      { text: 'Ghaziabad', to: '/ghaziabad', city: 'Ghaziabad' },
      { text: 'Faridabad', to: '/faridabad', city: 'Faridabad' },
      { text: 'Noida', to: '/noida', city: 'Noida' },
      { text: 'Bengaluru', to: '/bengaluru', city: 'Bengaluru' },
      { text: 'Bangalore', to: '/bangalore', city: 'Bangalore' },
      { text: 'Hyderabad', to: '/hyderabad', city: 'Hyderabad' },
      { text: 'Mumbai', to: '/mumbai', city: 'Mumbai' },
      { text: 'Indore', to: '/indore', city: 'Indore' },
      { text: 'Chennai', to: '/chennai', city: 'Chennai' },
      { text: 'Pune', to: '/pune', city: 'Pune' },
      { text: 'Surat', to: '/surat', city: 'Surat' },
      { text: 'Bhopal', to: '/bhopal', city: 'Bhopal' },
      { text: 'Kanpur', to: '/kanpur', city: 'Kanpur' },
      { text: 'Lucknow', to: '/lucknow', city: 'Lucknow' },
      { text: 'Goa', to: '/goa', city: 'Goa' },
    ]
  },
  {
    title: 'Chef in your city',
    links: [
      { text: 'Delhi', to: '/delhi/chef-near-me', city: 'Delhi' },
      { text: 'Gurugram', to: '/gurugram/chef-near-me', city: 'Gurugram' },
      { text: 'Ghaziabad', to: '/ghaziabad/chef-near-me', city: 'Ghaziabad' },
      { text: 'Faridabad', to: '/faridabad/chef-near-me', city: 'Faridabad' },
      { text: 'Noida', to: '/noida/chef-near-me', city: 'Noida' },
      { text: 'Bengaluru', to: '/bengaluru/chef-near-me', city: 'Bengaluru' },
      { text: 'Bangalore', to: '/bangalore/chef-near-me', city: 'Bangalore' },
      { text: 'Hyderabad', to: '/hyderabad/chef-near-me', city: 'Hyderabad' },
      { text: 'Mumbai', to: '/mumbai/chef-near-me', city: 'Mumbai' },
      { text: 'Indore', to: '/indore/chef-near-me', city: 'Indore' },
      { text: 'Chennai', to: '/chennai/chef-near-me', city: 'Chennai' },
      { text: 'Pune', to: '/pune/chef-near-me', city: 'Pune' },
      { text: 'Surat', to: '/surat/chef-near-me', city: 'Surat' },
      { text: 'Bhopal', to: '/bhopal/chef-near-me', city: 'Bhopal' },
      { text: 'Kanpur', to: '/kanpur/chef-near-me', city: 'Kanpur' },
      { text: 'Lucknow', to: '/lucknow/chef-near-me', city: 'Lucknow' },
      { text: 'Goa', to: '/goa/chef-near-me', city: 'Goa' },
    ],
  },
  {
    title: 'Decorations in your city',
    links: [
      { text: 'Delhi', to: '/delhi/balloon-decoration', city: 'Delhi' },
      { text: 'Gurugram', to: '/gurugram/balloon-decoration', city: 'Gurugram' },
      { text: 'Ghaziabad', to: '/ghaziabad/balloon-decoration', city: 'Ghaziabad' },
      { text: 'Faridabad', to: '/faridabad/balloon-decoration', city: 'Faridabad' },
      { text: 'Noida', to: '/noida/balloon-decoration', city: 'Noida' },
      { text: 'Bengaluru', to: '/bengaluru/balloon-decoration', city: 'Bengaluru' },
      { text: 'Bangalore', to: '/bangalore/balloon-decoration', city: 'Bangalore' },
      { text: 'Hyderabad', to: '/hyderabad/balloon-decoration', city: 'Hyderabad' },
      { text: 'Mumbai', to: '/mumbai/balloon-decoration', city: 'Mumbai' },
      { text: 'Indore', to: '/indore/balloon-decoration', city: 'Indore' },
      { text: 'Chennai', to: '/chennai/balloon-decoration', city: 'Chennai' },
      { text: 'Pune', to: '/pune/balloon-decoration', city: 'Pune' },
      { text: 'Surat', to: '/surat/balloon-decoration', city: 'Surat' },
      { text: 'Bhopal', to: '/bhopal/balloon-decoration', city: 'Bhopal' },
      { text: 'Kanpur', to: '/kanpur/balloon-decoration', city: 'Kanpur' },
      { text: 'Lucknow', to: '/lucknow/balloon-decoration', city: 'Lucknow' },
      { text: 'Goa', to: '/goa/balloon-decoration', city: 'Goa' },
    ],
  },
  {
    title: 'Photographer in your city',
    links: [
      { text: 'Delhi', to: '/delhi/photography-page', city: 'Delhi' },
      { text: 'Gurugram', to: '/gurugram/photography-page', city: 'Gurugram' },
      { text: 'Ghaziabad', to: '/ghaziabad/photography-page', city: 'Ghaziabad' },
      { text: 'Faridabad', to: '/faridabad/photography-page', city: 'Faridabad' },
      { text: 'Noida', to: '/noida/photography-page', city: 'Noida' },
      { text: 'Bengaluru', to: '/bengaluru/photography-page', city: 'Bengaluru' },
      { text: 'Bangalore', to: '/bangalore/photography-page', city: 'Bangalore' },
      { text: 'Hyderabad', to: '/hyderabad/photography-page', city: 'Hyderabad' },
      { text: 'Mumbai', to: '/mumbai/photography-page', city: 'Mumbai' },
      { text: 'Indore', to: '/indore/photography-page', city: 'Indore' },
      { text: 'Chennai', to: '/chennai/photography-page', city: 'Chennai' },
      { text: 'Pune', to: '/pune/photography-page', city: 'Pune' },
      { text: 'Surat', to: '/surat/photography-page', city: 'Surat' },
      { text: 'Bhopal', to: '/bhopal/photography-page', city: 'Bhopal' },
      { text: 'Kanpur', to: '/kanpur/photography-page', city: 'Kanpur' },
      { text: 'Lucknow', to: '/lucknow/photography-page', city: 'Lucknow' },
      { text: 'Goa', to: '/goa/photography-page', city: 'Goa' },
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
              <ul className={`list-unstyled-${index}`}>
                {column.links.map((link, idx) => (
                  <li key={idx}>
                    {link.to ? (
                      <Link
                        href={link.to}
                        style={style.link}
                        onClick={() => handleCityLinkClick(link.city)}
                      >
                        {link.text}
                      </Link>
                    ) : (
                      <Link href={link.href} style={style.link}>{link.text}</Link>
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