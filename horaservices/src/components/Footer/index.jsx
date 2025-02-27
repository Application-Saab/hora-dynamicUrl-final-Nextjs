import React from "react";
import frame_footer from "../../assets/frame_footer.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Container, Row, Col } from 'react-bootstrap';
import './footer.css';
import Link from "next/link";

const footerColumns = [
  {
    title: 'About Hora',
    links: [
      { text: 'My Order', to: '/orderlist' },
      // { text: 'Invitation', to: '/invitation' },
      { text: 'About Us', href: '/aboutus' },
      { text: 'Private Policy', href: '/termsCondition' },
      { text: 'Terms & Condition', href: '/termsCondition' },
      { text: 'Sitemap', href: 'https://horaservices.com/sitemap.xml' },
    ],
  },

  {
    title: 'Services',
    links: [
      { text: 'Chef for Party and Occasions', href: '/book-chef-cook-for-party' },
      { text: 'Decorations for Party and Occasions', href: '/balloon-decoration' },
      { text: 'Food Delivery for Party and Occasions', href: 'party-food-delivery-live-catering-buffet/party-food-delivery' },
      { text: 'Catering Service for Party and Occasions', href: '/party-food-delivery-live-catering-buffet/party-live-buffet-catering' },
      { text: 'Waiter for Party and Occasions', href: '/contactus' },
      { text: 'Bar Tender for Party and Occasions', href: '/contactus' },
      { text: 'Cleaner for Party and Occasions', href: '/contactus' },
      { text: 'Live Catering' , href:"/caterers"},
      { text: 'Food Delivery for Parties' , href:"/bulk-food-delivery"},
    ],
  },
  {
    title:"Services in your city",
    links: [
      { text: 'Delhi', to: '/delhi' },
      { text: 'Gurugram', to: '/gurugram' },
      { text: 'Ghaziabad', to: '/ghaziabad' },
      { text: 'Faridabad', to: '/faridabad' },
      { text: 'Noida', to: '/noida' },
      { text: 'Bengaluru', to: '/bengaluru' },
      { text: 'Bangalore', to: '/bangalore' },
      { text: 'Hyderabad', to: '/hyderabad' },
      { text: 'Mumbai', to: '/mumbai' },
      { text: 'Indore', to: '/indore' },
      { text: 'Chennai', to: '/chennai' },
      { text: 'Pune', to: '/pune' },
      { text: 'Surat', to: '/surat' },
      { text: 'Bhopal', to: '/bhopal' },
      { text: 'Kanpur', to: '/kanpur' },
      { text: 'Lucknow', to: '/lucknow' },
      { text: 'Goa', to: '/goa' },
    ]
  },
  {
    title: 'Chef in your city',
    links: [
      { text: 'Delhi', to: '/delhi/chef-near-me' },
      { text: 'Gurugram', to: '/gurugram/chef-near-me' },
      { text: 'Ghaziabad', to: '/ghaziabad/chef-near-me' },
      { text: 'Faridabad', to: '/faridabad/chef-near-me' },
      { text: 'Noida', to: '/noida/chef-near-me' },
      { text: 'Bengaluru', to: '/bengaluru/chef-near-me' },
      { text: 'Bangalore', to: '/bangalore/chef-near-me' },
      { text: 'Hyderabad', to: '/hyderabad/chef-near-me' },
      { text: 'Mumbai', to: '/mumbai/chef-near-me' },
      { text: 'Indore', to: '/indore/chef-near-me' },
      { text: 'Chennai', to: '/chennai/chef-near-me' },
      { text: 'Pune', to: '/pune/chef-near-me' },
      { text: 'Surat', to: '/surat/chef-near-me' },
      { text: 'Bhopal', to: '/bhopal/chef-near-me' },
      { text: 'Kanpur', to: '/kanpur/chef-near-me' },
      { text: 'Lucknow', to: '/lucknow/chef-near-me' },
      { text: 'Goa', to: '/goa/chef-near-me' },
    ],
  },
  {
    title: 'Decorations in your city',
    links: [
      { text: 'Delhi', to: '/delhi/balloon-decoration' },
      { text: 'Gurugram', to: '/gurugram/balloon-decoration' },
      { text: 'Ghaziabad', to: '/ghaziabad/balloon-decoration' },
      { text: 'Faridabad', to: '/faridabad/balloon-decoration' },
      { text: 'Noida', to: '/noida/balloon-decoration' },
      { text: 'Bengaluru', to: '/bengaluru/balloon-decoration' },
      { text: 'Bangalore', to: '/bangalore/balloon-decoration' },
      { text: 'Hyderabad', to: '/hyderabad/balloon-decoration' },
      { text: 'Mumbai', to: '/mumbai/balloon-decoration' },
      { text: 'Indore', to: '/indore/balloon-decoration' },
      { text: 'Chennai', to: '/chennai/balloon-decoration' },
      { text: 'Pune', to: '/pune/balloon-decoration' },
      { text: 'Surat', to: '/surat/balloon-decoration' },
      { text: 'Bhopal', to: '/bhopal/balloon-decoration' },
      { text: 'Kanpur', to: '/kanpur/balloon-decoration' },
      { text: 'Lucknow', to: '/lucknow/balloon-decoration' },
      { text: 'Goa', to: '/goa/balloon-decoration' },
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
                      <Link href={link.to} style={style.link}>{link.text}</Link>
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


