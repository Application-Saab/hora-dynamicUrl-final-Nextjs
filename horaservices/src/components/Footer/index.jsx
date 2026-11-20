"use client";
import React from "react";
import phoneIcon from "@/assets/phoneicon.svg"
import emailIcon from "@/assets/emailicon.svg"
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebookF,
  faLinkedinIn,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faPhone,
  faEnvelope,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useCity } from "@/utils/cityContext";
import "./footer.css";
import Image from "next/image";

const PHONE = "+917338584828";
const EMAIL = "dev@horaservices.com";

const cities = [
  "Delhi",
  "Gurugram",
  "Ghaziabad",
  "Faridabad",
  "Noida",
  "Bangalore",
  "Hyderabad",
  "Mumbai",
];

// NOTE: Celebrate ke links ko apne real routes se replace kar lena
const footerColumns = [
  {
    title: "Services",
    links: [
      { text: "Balloon Decor", href: "/balloon-decoration" },
      { text: "Flower Decoration", href: "/flower-decoration" },
      { text: "Photography", href: "/photography" },
      { text: "Venue Booking", href: "/venue-list" },
      { text: "Party Props", href: "/party-props" },
      { text: "Chef For Party", href: "/chef-near-me" },
      {
        text: "Live Catering",
        href: "/party-food-delivery-live-catering-buffet/party-live-buffet-catering",
      },
      {
        text: "Bulk Food Delivery",
        href: "/party-food-delivery-live-catering-buffet/party-food-delivery",
      },
    ],
  },
  {
    title: "Celebrate",
    links: [
      { text: "Kids Birthday", href: "/balloon-decoration/kids-birthday-decoration" },
      { text: "Welcome Baby", href: "/balloon-decoration/welcome-baby-decoration" },
      { text: "Anniversary", href: "/balloon-decoration/anniversary-decoration" },
      { text: "Baby shower", href: "/balloon-decoration" },
      { text: "Haldi & Mehndi", href: "/wedding-decoration/haldi-decoration" },
      { text: "First Night", href: "/wedding-decoration/first-night-decoration" },
      { text: "Festivals", href: "/festivals-decoration" },
      { text: "House Warming", href: "/balloon-decoration/house-warming-decoration" },
      
    ],
  },
  {
    title: "Cities",
    links: cities.map((c) => ({
      text: c,
      to: `/${c.toLowerCase()}`,
      city: c,
    })),
  },
  {
    title: "Company",
    links: [
      { text: "My Account", to: "/orderlist" },
      { text: "About us", to: "/aboutus" },
      { text: "Contact Us", to: "/contactus" },
      { text: "Blogs", to: "/blog" },
      { text: "Terms & Conditions", to: "/termCondition" },
      { text: "Sitemap", href: "https://horaservices.com/sitemap.xml" },
    ],
  },
];

const socials = [
  {
    icon: faInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/horaservices/",
  },
  {
    icon: faFacebookF,
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61550111701616",
  },
  { icon: faLinkedinIn, label: "LinkedIn", href: "https://www.linkedin.com/" },
  {
    icon: faYoutube,
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCj5gMUjptHut0aGYHxCbE5g",
  },
];

function Footer() {
  const { syncSelectedCity } = useCity();

  return (
    <footer className="hf">
      <div className="hf-inner">
        {/* CTA strip */}
        <div className="hf-cta">
          <div className="hf-cta-text">
            <h2 className="hf-cta-title">
              Planning Something?{" "}
              <br className="hf-br" />
              Let’s Make it effortless.
            </h2>
            <p className="hf-cta-sub">
              Tell us the occasion–we’ll send a verified pro to your door.
            </p>
          </div>
          <div className="hf-cta-actions">
            <Link href="/balloon-decoration" className="hf-btn hf-btn-solid">
              Book a service →
            </Link>
            <a href={`tel:${PHONE}`} className="hf-btn hf-btn-outline">
  <Image
    src={phoneIcon}
    alt=""
    width={11}
    height={11}
    className="hf-svg-icon"
  />
  <span>{PHONE}</span>
</a>
          </div>
        </div>

        <hr className="hf-divider" />

        {/* Main grid */}
        <div className="hf-grid">
          <div className="hf-brand">
            <h3 className="hf-brand-name">HORA SERVICES</h3>
           <a href={`mailto:${EMAIL}`} className="hf-contact">
  <Image
    src={emailIcon}
    alt=""
    width={17}
    height={13}
    className="hf-svg-icon"
  />
  <span>{EMAIL}</span>
</a>
           
          </div>

          {footerColumns.map((col) => (
            <nav
              key={col.title}
              className={`hf-col hf-col-${col.title.toLowerCase()}`}
              aria-label={col.title}
            >
              <h3 className="hf-heading">{col.title}</h3>
              <ul className="hf-list">
                {col.links.map((link) => (
                  <li key={link.text}>
                    {link.to ? (
                      <Link
                        href={link.to}
                        className="hf-link"
                        onClick={() =>
                          link.city && syncSelectedCity(link.city)
                        }
                      >
                        {link.text}
                      </Link>
                    ) : (
                      <a href={link.href} className="hf-link">
                        {link.text}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <hr className="hf-divider" />

        {/* Bottom bar */}
        <div className="hf-bottom">
          <div className="hf-social">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="hf-social-link"
              >
                <FontAwesomeIcon icon={s.icon} />
              </a>
            ))}
          </div>
          <p className="hf-copy">©2026 Hora Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;