import { React, useState } from "react";
import "./photo.css";
import Image from "next/image";
import testing from "../../assets/bird7.png";
import testing2 from "../../assets/bird8.jpg";
import testing3 from "../../assets/bird9.jpg";

import testing4 from "../../assets/bird10.jpg";
import testing5 from "../../assets/bird11.jpg";
import instagramIcon from "../../assets/bird12.png";
import testing6 from "../../assets/bird12.jpg";

import emailicon from "../../assets/emailicon.png";

const data = [
  {
    category: "Landscape",
    title: "Sunrise and Sunset",
    description:
      "Doc, she’s beautiful. She’s crazy about me. Look at this, look what she wrote me, Doc. That says it all. Doc, you’re my only hope.",
    image: require("../../assets/bird2.jpg"),
  },
  {
    category: "Wildlife",
    title: "Court of Owls",
    description:
      "Doc, she’s beautiful. She’s crazy about me. Look at this, look what she wrote me, Doc. That says it all. Doc, you’re my only hope. Excuse me. But you’re good, Marty.",
    image: require("../../assets/bird1.jpg"),
  },
  {
    category: "Wildlife",
    title: "The Power of Personality",
    description:
      "Doc, she’s beautiful. She’s crazy about me. Look at this, look what she wrote me, Doc. That says it all. Doc, you’re my only hope.",
    image: require("../../assets/bird3.jpg"),
  },
  {
    category: "Wildlife",
    title: "Amazing Asia",
    description:
      "Doc, she’s beautiful. She’s crazy about me. Look at this, look what she wrote me, Doc. That says it all. Doc, you’re my only hope.",
    image: require("../../assets/bird4.jpg"),
  },
];

const servicesData = {
  servicesSection: {
    title: "Professional",
    heading: "SERVICES",
    dividerColor: "#ff0057",
    services: [
      {
        title: "Outdoor Photography",
        description:
          "Doc, she's beautiful. She's crazy about me. Look at this, look what she wrote me. Doc, that says it all. Doc, you're my only hope. Excuse me. But you're good, Marty.",
        icon: require("../../assets/bird6.png"),
      },
      {
        title: "Portrait Photography",
        description:
          "Doc, she's beautiful. She's crazy about me. Look at this, look what she wrote me. Doc, that says it all. Doc, you're my only hope. Excuse me. But you're good, Marty.",
        icon: require("../../assets/bird6.png"),
      },
      {
        title: "Retouching",
        description:
          "Doc, she's beautiful. She's crazy about me. Look at this, look what she wrote me. Doc, that says it all. Doc, you're my only hope. Excuse me. But you're good, Marty.",
        icon: require("../../assets/bird6.png"),
      },
      {
        title: "Photography Classes",
        description:
          "Doc, she's beautiful. She's crazy about me. Look at this, look what she wrote me. Doc, that says it all. Doc, you're my only hope. Excuse me. But you're good, Marty.",
        icon: require("../../assets/bird6.png"),
      },
    ],
  },
};

const clients = [
  { name: "aven", logo: testing },
  { name: "earth", logo: testing },
  { name: "ideaa", logo: testing },
  { name: "zootv", logo: testing },
  { name: "codelab", logo: testing },
  { name: "circle", logo: testing },
];

const reviews = [
  {
    id: 1,
    name: "Doctor Emmett Brown",
    date: "October 26, 1985",
    location: "Twin Pines Mall",
    text: "Good evening, I'm Doctor Emmett Brown. I'm standing on the parking lot of Twin Pines Mall. It's Saturday morning, October 26, 1985.",
    avatar: testing2,
  },
  {
    id: 2,
    name: "Marty McFly",
    date: "November 5, 1955",
    location: "Hill Valley",
    text: "This is heavy! I'm standing in the middle of Hill Valley, and you won't believe what I'm seeing!",
    avatar: testing2,
  },
  {
    id: 3,
    name: "Jennifer Parker",
    date: "October 21, 2015",
    location: "Courthouse Square",
    text: "The future is so different from what we expected. Flying cars everywhere!",
    avatar: testing2,
  },
];

const imageData = [
  { id: 1, url: testing2 },
  { id: 2, url: testing4 },
  { id: 3, url: testing3 },
  { id: 4, url: testing2 },
  { id: 5, url: testing2 },
  { id: 6, url: testing5 },
  { id: 7, url: testing3 },
  { id: 8, url: testing4 },
  { id: 9, url: testing5 },
  { id: 10, url: testing2 },
  { id: 11, url: testing3 },
  { id: 12, url: testing2 },
];

const blogData = [
  {
    id: 1,
    date: "June 15, 2017",
    category: "Tutorial",
    title: "12 Tips for Indoor Natural Light Photography",
    image: testing6,
  },
  {
    id: 2,
    date: "June 1, 2017",
    category: "Personal",
    title: "Dealing with Weird Job Interview Questions",
    image: testing6,
  },
  {
    id: 3,
    date: "May 23, 2017",
    category: "Travel",
    title: "How to Spend 4 Days in Amsterdam",
    image: testing6,
  },
];

const FeaturedWorks = () => {
  const { title, heading, dividerColor, services } =
    servicesData.servicesSection;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const middleIndex = Math.ceil(imageData.length / 2);
  const grid1 = imageData.slice(0, middleIndex);
  const grid2 = imageData.slice(middleIndex);

  return (
    <>
      <div className="featured-works">
        <div class="section-small-header">Featured</div>
        <h2 className="hh2">Works</h2>
        <img
          src="https://cdn.prod.website-files.com/593008e46c534e61e392e0f2/5938f139d7978c0a4faf1460_Sep.svg"
          alt=""
          class="section-separator"
        ></img>
        <div className="works-container">
          {data.map((work, index) => (
            <div className="work-item" key={index}>
              <Image src={work.image} alt={work.title} className="work-image" />
              <div className="work-card-info">
                <div className="work-details">
                  <p className="work-category">{work.category}</p>
                  <h5 className="work-title">{work.title}</h5>
                  <p className="work-description">{work.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <a href="/works" className="button-viewall">
            View All Works
          </a>
        </div>
      </div>


{/* client names */}
      <section className="clients-section">
        <div className="container">
          <h2 className="clients-title">Awesome</h2>
          <h1 className="clients-heading">Clients</h1>
          <img
            src="https://cdn.prod.website-files.com/593008e46c534e61e392e0f2/5938f139d7978c0a4faf1460_Sep.svg"
            alt=""
            class="section-separator"
          ></img>
          <div className="clients-grid">
            {clients.map((client, index) => (
              <div className="client-box" key={index}>
                <Image
                  src={client.logo}
                  width={100}
                  height={40}
                  alt={client.name}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

{/* services section */}
      <section className="services-section">
        <div className="container">
          <h2 className="services-title">{title}</h2>
          <h1 className="services-heading">{heading}</h1>
          <img
            src="https://cdn.prod.website-files.com/593008e46c534e61e392e0f2/5938f139d7978c0a4faf1460_Sep.svg"
            alt=""
            class="section-separator"
          ></img>

          <div className="services-grid">
            {services.map((service, index) => (
              <div className="service-box" key={index}>
                <div
                  className="services-divider-second"
                  style={{ backgroundColor: dividerColor }}
                />
                <div className="service-title-container">
                  <div className="service-icon">
                    <Image
                      src={service.icon}
                      width={50}
                      height={50}
                      alt={service.title}
                      className="circle-img"
                    />
                  </div>
                  <h6>{service.title}</h6>
                </div>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
          <button className="contact-button">Contact Me</button>
        </div>
      </section>


      {/* review section */}

      <div>
        <div className="slider-container">
          <button
            onClick={prevSlide}
            className="slide-button prev"
            aria-label="Previous review"
          >
            ◀
          </button>

          <div className="slide-content">
            <div className="avatar-container">
              <Image
                src={reviews[currentIndex].avatar}
                alt={reviews[currentIndex].name}
              />
            </div>

            <p className="review-text">{reviews[currentIndex].text}</p>

            <div className="review-info">
              <span>{reviews[currentIndex].name}</span>
              {reviews[currentIndex].location && (
                <span className="separator">•</span>
              )}
              <span>{reviews[currentIndex].location}</span>
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="slide-button next"
            aria-label="Next review"
          >
            ▶
          </button>

          <div className="dots-container">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>


      {/* gallery section */}

      <div className="gallery-container">
        <div className="grid-wrapper">
          {/* First Grid */}
          <div className="gallery-grid">
            {grid1.map((image) => (
              <div key={image.id} className="gallery-item">
                <Image
                  src={image.url}
                  width={10}
                  height={10}
                  alt={`Image ${image.id}`}
                />
              </div>
            ))}
          </div>

          {/* Instagram Overlay */}
          <div className="center-overlay">
            <div className="instagram-box">
              <Image
                src={instagramIcon}
                alt="Instagram Logo"
                className="instagram-logo"
                width={50}
                height={50}
              />
              <div className="instagram-text">
                Follow Me on
                <br />
                <strong>Instagram</strong>
              </div>
            </div>
          </div>

          {/* Second Grid */}
          <div className="gallery-grid">
            {grid2.map((image) => (
              <div key={image.id} className="gallery-item">
                <Image
                  src={image.url}
                  width={10}
                  height={10}
                  alt={`Image ${image.id}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>


{/* blog section */}
      <div className="blog-posts-container">
        <h2 className="blog-title">From the Blog</h2>
        <h1 className="blog-sub-title">Recent Posts</h1>
        <img
          src="https://cdn.prod.website-files.com/593008e46c534e61e392e0f2/5938f139d7978c0a4faf1460_Sep.svg"
          alt=""
          class="section-separator"
        ></img>
        <div className="posts">
          {blogData.map((post) => (
            <div key={post.id} className="post">
              <Image
                src={post.image}
                alt={post.title}
                className="post-image"
                width={10}
                height={10}
              />
              <div className="post-details">
                <div className="post-meta">
                  <p className="post-date">{post.date}</p>
                  <p className="post-category">{post.category}</p>
                </div>
                <h3 className="post-title">{post.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* email section */}
      <div className="container1">
        <img
          src="https://cdn.prod.website-files.com/593008e46c534e61e392e0f2/5938f139d7978c0a4faf1460_Sep.svg"
          alt=""
        ></img>
        <h5 className="email-heading">
          Subscribe to my newsletter to receive updates about new projects and
          blog posts
        </h5>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="input-container">
              {/* <span className="email-icon">📧</span> */}
              <span className="email-icon">
  <Image src={emailicon} alt="Email Icon"  width={45} height={45}/>
</span>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
              <button type="submit" className="button">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* imforamtiuon */}
      <div className="two-column-container">
        <div className="column column-red">
          <div className="action-title">Contact Me</div>
          <h5 className="action-subtitle">Let's Work Together</h5>
        </div>
        <div className="column column-blue">
          <div className="action-title">How Am I?</div>
          <h5 className="action-subtitle">Learn More About Me</h5>
        </div>
      </div>
    </>
  );
};

export default FeaturedWorks;
