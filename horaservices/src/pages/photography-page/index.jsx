
import { useState } from 'react'
import './photo.css'
import { FeaturedWorkData, clients, ourServicesData, InstImageData } from './data'
import Image from 'next/image'
import InstagramSection from '@/components/InstaGram-section';
import CustomerReviewSection from '@/components/Reviews-section';
import BlogPosts from '@/components/BlogPosts';

const index = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  };
  return (<>

    <div className="featured-works">
      <div className="section-small-header">Featured</div>
      <h2 className="hh2">Works</h2>
      <img
        src="https://cdn.prod.website-files.com/593008e46c534e61e392e0f2/5938f139d7978c0a4faf1460_Sep.svg"
        alt=""
        className="section-separator"
      />
      <div className="works-container">
        {FeaturedWorkData.map((work, index) => (
          <div className="work-item" key={index}>
            <img src={work.image} alt={work.title} className="work-image" />
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
    {/* clients */}
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
        <h2 className="services-title">{ourServicesData.title}</h2>
        <h1 className="services-heading">{ourServicesData.heading}</h1>
        <img
          src="https://cdn.prod.website-files.com/593008e46c534e61e392e0f2/5938f139d7978c0a4faf1460_Sep.svg"
          alt=""
          class="section-separator"
        ></img>

        <div className="services-grid">
          {ourServicesData.services.map((service, index) => (
            <div className="service-box" key={index}>
              <div
                className="services-divider-second"
                style={{ backgroundColor: ourServicesData.dividerColor }}
              />
              <div className="service-title-container">
                <div className="service-icon">
                  {/* <Image
                      src={service.icon}
                      width={50}
                      height={50}
                      alt={service.title}
                      className="circle-img"
                    /> */}

                  {service.icon}
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
   
    {/* <CustomerReviewSection /> */}
    <CustomerReviewSection />
    {/* instasection */}
    <InstagramSection />
    {/* BlogPost */}
    <BlogPosts />
    {/* Newsletter */}
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
              <Image src='/assets/emailicon.png' alt="Email Icon" width={45} height={45} />
            </span>

            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
            <button type="submit" className="button">
            Subscribe
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
  </>)
}

export default index