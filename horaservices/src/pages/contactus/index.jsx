import React from "react";
import { FaTag, FaMapMarkerAlt, FaDownload } from "react-icons/fa";
import contactusbanner from "../../assets/contactusbanner.webp";
import delhi from "../../assets/delhi.webp";
import mumbai from "../../assets/mumbai.webp";
import banglore from "../../assets/banglore.webp";
import pune from "../../assets/Pune.webp";
import noida from "../../assets/Noida.webp";
import indore from "../../assets/indore.webp";
import bhopal from "../../assets/bhopal.webp";
import ghaziabad from "../../assets/ghaziabad.webp";
import gurugram from "../../assets/gurugram.webp";
import faridabad from "../../assets/faridabad.webp";
import hydrabad from "../../assets/hydrabad.webp";
import chennai from "../../assets/Chennai.webp";
import jaipur from "../../assets/jaipur.webp";
import ahmdabad from "../../assets/Ahmdabad.webp";
import chandigarh from "../../assets/Chandigarh.webp";
import kolkata from "../../assets/kolkata.webp";
import lakhnow from "../../assets/Locknow.webp";
import kanpur from "../../assets/Kanpur.webp";
import surat from "../../assets/Kanpur.webp";
import goa from "../../assets/Goa.webp";
import Image from "next/image";
import Head from "next/head";

const ContactUs = () => {
  return (
    <>
      <Head>
        {/* Title */}
        <title>
          Contact Us | HORA Services - Event Planning & Home Services
        </title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Contact HORA Services for decoration, photography, catering, chef, waiter, cleaner, and event services across India. Call, WhatsApp, email, or download the HORA app to book services."
        />

        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />

        {/* Canonical */}
        <link rel="canonical" href="https://horaservices.com/contactus" />

        {/* Favicon */}
        <link
          rel="icon"
          href="https://horaservices.com/api/uploads/logo-icon.png"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Contact HORA Services" />
        <meta
          property="og:description"
          content="Get in touch with HORA Services for event planning, decoration, catering, photography, and home services across India."
        />
        <meta property="og:url" content="https://horaservices.com/contactus" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact HORA Services" />
        <meta
          name="twitter:description"
          content="Call, WhatsApp, email, or download the HORA app to book trusted event and home services."
        />
        <meta
          name="twitter:image"
          content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
        />

        {/* Contact Page Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              name: "Contact HORA Services",
              url: "https://horaservices.com/contactus",
              description:
                "Contact HORA Services for decoration, photography, catering, chef, and event services across India.",
            }),
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "HORA Services",
              url: "https://horaservices.com",
              logo: "https://horaservices.com/api/uploads/logo-icon.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-7338584828",
                contactType: "customer service",
                areaServed: "IN",
                availableLanguage: ["English", "Hindi"],
              },
              email: "dev@horaservices.com",
            }),
          }}
        />
      </Head>

      <main>
        <div className="aboutUsContainer" style={styles.aboutUsContainer}>
          <div
            className="heroSingle"
            style={{
              ...styles.heroSingle,
              backgroundImage: `url(${contactusbanner.src})`,
            }}
          >
            <div className="imageOverlay" style={styles.imageOverlay}>
              <div className="textContent" style={styles.textContent}>
                <h1>Contact Us</h1>
                <p className="contact-us-main-heading">
                  We would love to hear from you! Feel free to reach out to us.
                </p>
              </div>
            </div>

            <div className="frame white"></div>
          </div>

          <div className="contact-us-secRight" style={styles.secRight}>
            <div className="contact-us-boxsection" style={styles.boxHow}>
              <a href="tel:+917338584828" style={{ color: "#444" }}>
                <FaTag style={styles.icon} />
                <h2
                  style={{
                    fontSize: "1.3125rem",
                    color: "#444",
                    margin: "10px 0",
                  }}
                >
                  Call & Whatsapp
                </h2>
                +917338584828
              </a>
            </div>

            <div className="contact-us-boxsection" style={styles.boxHow}>
              <a href="mailto:dev@horaservices.com" style={{ color: "#444" }}>
                <FaMapMarkerAlt style={styles.icon} />
                <h2
                  style={{
                    fontSize: "1.3125rem",
                    color: "#444",
                    margin: "10px 0",
                  }}
                >
                  Email
                </h2>
                dev@horaservices.com
              </a>
            </div>

            <div className="contact-us-boxsection" style={styles.boxHow}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://play.google.com/store/apps/details?id=com.hora"
                style={{ color: "#444" }}
              >
                <FaDownload style={styles.icon} />
                <h2
                  style={{
                    fontSize: "1.3125rem",
                    color: "#444",
                    margin: "10px 0",
                  }}
                >
                  Download Application
                </h2>
                <small>- Click Here -</small>
              </a>
            </div>
          </div>

          <div style={styles.contactUs}>
            <div style={styles.secRight1}>
              <h5
                className="contact-us-second-heading"
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                  fontSize: "1.25rem",
                  marginTop: "10px",
                  padding: "30px",
                }}
              >
                We Provide Services In These Cities
              </h5>

              <div
                className="contact-us-img-section-1"
                style={styles.cityContact}
              >
                {[
                  {
                    href: "/mumbai",
                    src: mumbai,
                    alt: "Mumbai",
                    label: "Mumbai",
                  },
                  { href: "/delhi", src: delhi, alt: "Delhi", label: "Delhi" },
                  {
                    href: "/bengaluru",
                    src: banglore,
                    alt: "Bengaluru",
                    label: "Bengaluru",
                  },
                  {
                    href: "/bangalore",
                    src: banglore,
                    alt: "Bangalore",
                    label: "Bangalore",
                  },
                  { href: "/noida", src: noida, alt: "Noida", label: "Noida" },
                  {
                    href: "/ghaziabad",
                    src: ghaziabad,
                    alt: "Ghaziabad",
                    label: "Ghaziabad",
                  },
                  {
                    href: "/gurugram",
                    src: gurugram,
                    alt: "Gurugram",
                    label: "Gurugram",
                  },
                  {
                    href: "/faridabad",
                    src: faridabad,
                    alt: "Faridabad",
                    label: "Faridabad",
                  },
                  {
                    href: "/hyderabad",
                    src: hydrabad,
                    alt: "Hyderabad",
                    label: "Hyderabad",
                  },
                  {
                    href: "/chennai",
                    src: chennai,
                    alt: "Chennai",
                    label: "Chennai",
                  },
                  {
                    href: "/kolkata",
                    src: kolkata,
                    alt: "Kolkata",
                    label: "Kolkata",
                  },
                  {
                    href: "/lucknow",
                    src: lakhnow,
                    alt: "Lucknow",
                    label: "Lucknow",
                  },
                  {
                    href: "/kanpur",
                    src: kanpur,
                    alt: "Kanpur",
                    label: "Kanpur",
                  },
                  {
                    href: "/indore",
                    src: indore,
                    alt: "Indore",
                    label: "Indore",
                  },
                  { href: "/surat", src: surat, alt: "Surat", label: "Surat" },
                  {
                    href: "/bhopal",
                    src: bhopal,
                    alt: "Bhopal",
                    label: "Bhopal",
                  },
                  { href: "/goa", src: goa, alt: "Goa", label: "Goa" },
                  { href: "/pune", src: pune, alt: "Pune", label: "Pune" },
                ].map((city) => (
                  <div className="contact-us-section-div" key={city.href}>
                    <a href={city.href} className="contactuscitylink" style={styles.contactuscitylink}>
                      <Image
                        className="contact-us-img"
                        src={city.src}
                        alt={city.alt}
                      />
                      <h4 className="contact-us-heading">{city.label}</h4>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

const styles = {
  aboutUsContainer: {
    width: "100%",
    backgroundColor: "#ededed",
  },
  contactUs: {
    backgroundColor: "#fff",
  },
  cityContact: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "30px",
    gap: "10px",
  },
  heroSingle: {
    position: "relative",
    width: "100%",
    height: "400px",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  imageOverlay: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0, 0, 0, 0.1)",
  },
  textContent: {
    textAlign: "center",
    color: "white",
  },
  secRight1: {
    width: "75%",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 auto 20px",
    flexDirection: "column",
  },
  secRight: {
    display: "flex",
    justifyContent: "space-around",
    padding: "20px 0",
    backgroundColor: "#f8f8f8",
  },
  boxHow: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "30%",
  },
  icon: {
    fontSize: "2rem",
    color: "#8a6d3b",
  },
  contactuscitylink: {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    textAlign: "center",
  },
};

export async function getStaticProps() {
  return { props: {} };
}

export default ContactUs;
