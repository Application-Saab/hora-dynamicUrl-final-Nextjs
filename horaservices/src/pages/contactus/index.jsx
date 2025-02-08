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

const ContactUs = () => {
  return (
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
            <FaTag style={styles.icon} />
            <h2
              style={{ fontSize: "1.3125rem", color: "#444", margin: "10px 0" }}
            >
              Call & Whatsapp
            </h2>
            <a href="tel:+917338584828" style={{ color: "#444" }}>
              +917338584828
            </a>
          </div>
          <div className="contact-us-boxsection" style={styles.boxHow}>
            <FaMapMarkerAlt style={styles.icon} />
            <h2
              style={{ fontSize: "1.3125rem", color: "#444", margin: "10px 0" }}
            >
              Email
            </h2>
            <a href="mailto:dev@horaservices.com" style={{ color: "#444" }}>
              dev@horaservices.com
            </a>
          </div>
          <div className="contact-us-boxsection" style={styles.boxHow}>
            <FaDownload style={styles.icon} />
            <h2
              style={{ fontSize: "1.3125rem", color: "#444", margin: "10px 0" }}
            >
              Download Application
            </h2>
            <small>
              -{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://play.google.com/store/apps/details?id=com.hora"
                style={{ color: "#444" }}
              >
                Click Here
              </a>{" "}
              -
            </small>
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
            <div>
              <div
                className="contact-us-img-section-1"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginBottom: "30px",
                  gap: "10px",
                }}
              >
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={mumbai} alt="image" />
                  <h4 className="contact-us-heading"><a href="/mumbai">Mumbai</a></h4>
                </div>
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={delhi} alt="image" />
                  <h4 className="contact-us-heading"><a href="/delhi">Delhi</a></h4>
                </div>

                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={banglore} alt="image" />
                  <h4 className="contact-us-heading"><a href="/bengaluru">Bengaluru</a></h4>
                </div>
              </div>
              <div
                className="contact-us-img-section-1"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginBottom: "30px",
                  gap: "10px",
                }}
              >
                 <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={banglore} alt="image" />
                  <h4 className="contact-us-heading"><a href="/bangalore">Bangalore</a></h4>
                </div>
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={noida} alt="image" />
                  <h4 className="contact-us-heading"><a href="/noida">Noida</a></h4>
                </div>
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={ghaziabad} alt="image" />
                  <h4 className="contact-us-heading"><a href="/ghaziabad">Gaziabad</a></h4>
                </div>
              </div>
              <div
                className="contact-us-img-section-1"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginBottom: "30px",
                  gap: "10px",
                }}
              >
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={gurugram} alt="image" />
                  <h4 className="contact-us-heading"><a href="/gurugram">Gurugram</a></h4>
                </div>
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={faridabad} alt="image" />
                  <h4 className="contact-us-heading"><a href="/faridabad">Faridabad</a></h4>
                </div>
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={hydrabad} alt="image" />
                  <h4 className="contact-us-heading">< a href="/hyderabad">Hydrabad</a></h4>
                </div>
              </div>
              <div
                className="contact-us-img-section-1"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginBottom: "30px",
                  gap: "10px",
                }}
              >
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={chennai} alt="image" />
                  <h4 className="contact-us-heading"><a href="/chennai">Chennai</a></h4>
                </div>
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={kolkata} alt="image" />
                  <h4 className="contact-us-heading"><a href="/kolkata">Kolkata</a></h4>
                </div>
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={lakhnow} alt="image" />
                  <h4 className="contact-us-heading"><a href="/lucknow">Lucknow</a></h4>
                </div>
              </div>
              <div
                className="contact-us-img-section-1"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginBottom: "30px",
                  gap: "10px",
                  gap: "10px",
                }}
              >
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={kanpur} alt="image" />
                  <h4 className="contact-us-heading"><a href="/kanpur">Kanpur</a></h4>
                </div>
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={indore} alt="image" />
                  <h4 className="contact-us-heading"><a href="/indore">Indore</a></h4>
                </div>
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={surat} alt="image" />
                  <h4 className="contact-us-heading"><a href="/surat">Surat</a></h4>
                </div>
              </div>
              <div
                className="contact-us-img-section-1"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginBottom: "30px",
                  gap: "10px",
                  gap: "10px",
                }}
              >
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={bhopal} alt="image" />
                  <h4 className="contact-us-heading"><a href="/bhopal">Bhopal</a></h4>
                </div>
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={goa}  alt="image"/>
                  <h4 className="contact-us-heading"><a href="/goa">Goa</a></h4>
                </div>
                <div className="contact-us-section-div">
                  <Image className="contact-us-img" src={pune} alt="image" />
                  <h4 className="contact-us-heading"><a href="/pune">Pune</a></h4>
                </div>
              </div>
              <div className="our-address">
                <h1 style={{ fontSize:"10px" , textAlign:"center"}}>Our Registered Address: B27/295, Bhopal, 462030</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
const styles = {
  aboutUsContainer: {
    width: "100%",
    backgroundColor: "#ededed",
  },
  contactUs: {
    backgroundColor: "#fff",
  },
  heroSingle: {
    position: "relative",
    width: "100%",
    height: "400px" /* Adjust height as needed */,
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
    background:
      "rgba(0, 0, 0, 0.1)" /* Adjust overlay color and opacity as needed */,
  },
  textContent: {
    textAlign: "center",
    color: "white",
  },
  // secRight: {
  //   width: "80%",
  //   display: "flex",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   margin: "27px auto 51px",
  // },
  secRight1: {
    width: "75%",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 auto 20px",
    flexDirection: "column",
  },
  // boxHow: {
  //   boxShadow: "0 0 32px -7px rgba(0, 0, 0, 0.1)",
  //   padding: "30px 25px",
  //   textAlign: "center",
  //   marignBottum: "20px",
  //   backgroundColor: "#fff",
  //   width: "300px",
  // },
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
};

export default ContactUs;
