
import { useState , useEffect , useCallback } from 'react'
import './photo.css'
import { FeaturedWorkData, clients, ourServicesData, InstImageData } from './data'
import Image from 'next/image'
import InstagramSection from '@/components/InstaGram-section';
import CustomerReviewSection from '@/components/Reviews-section';
import BlogPosts from '@/components/BlogPosts';
import axios from 'axios';
import { useRouter } from 'next/router';
const index = () => {
  const [products, setproducts] = useState([]); // State to store product
  const [email, setEmail] = useState("");
  const router = useRouter();
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  }, [email]);
  const getCleanInclusionText = (inclusionArray) => {
    if (!inclusionArray || inclusionArray.length === 0)
      return "No inclusion details available";

    return inclusionArray
      .join("")
      .replace(/<\/?(div|span|br)>/g, "")
      .replace(/&#10;/g, "\n")
      .replace(/\s*-\s*/g, "\n- ")
      .trim();
  };
  const fetchData = useCallback(async () => {
    try {   
      const res = await axios.get(        
         'https://horaservices.com:3000/api/photography/searchByTag/66c96b4e22ed47b72117e09a'
      );
    
      setproducts(res.data.data); // Save the response data to state
    } catch (error) {
      console.error('Error fetching data:', error);
      setproducts([]); // Set to empty array in case of an error
    }
  },[]);
  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []);
  const sendToCheckoutPage = (product) => {
    router.push({
      pathname: 'photography-checkout',
      query: {
        from: window.location.pathname,      
        product: JSON.stringify(product),
        totalAmount: product.price,
      }
    });
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
            {/* Render API product */}
        {products.map((product, index) => (
          <div className="work-item" key={product.id || index}>
            <img src={product.featured_image} alt={product.title} className="work-image" />
            <div className="work-card-info">
              <div className="work-details">
                <h5 className="work-title">{product.name}</h5>
                {Array.isArray(product.inclusion) && product.inclusion.length > 0 && (
                  <ul className="work-inclusions">
                    <li>{getCleanInclusionText(product.inclusion)}</li>
                    {/* {product.inclusion.map((inc, index) => (
                      <li className="inclusion-item" key={index}>{inc}</li>
                    ))} */}
                  </ul>
                )}
                <p className="work-duration">
                  <b>Duration:</b> {product.duration}
                </p>
                <p className="work-price">
                  <b>Price:</b> {product.price}
                </p>
              </div>
            </div>
            <button onClick={() => sendToCheckoutPage(product)}>Book Now</button>
          </div>
        ))}
      </div>
        {/* Render Static product  */}
      <div className="works-container">
        {FeaturedWorkData.map((work, index) => (
          <div className="work-item" key={index}  >
            <img src={work.image} alt={work.title} className="work-image" />
            <div className="work-card-info">
              <div className="work-details">
                <h5 className="work-title">{work.title}</h5>
                {Array.isArray(work.inclusion) && work.inclusion.length > 0 && (
                  <ul className="work-inclusions">
                    {work.inclusion.map((inc, index) => (
                      <li className="inclusion-item" key={index}>{inc}</li>
                    ))}
                  </ul>
                )}
                <p className="work-duration">
                  <b>Duration:</b> {work.duration}
                </p>
                <p className="work-price">
                  <b>Price:</b> {work.price}
                </p>
                <button >View Sample Work</button>
                <button onClick={() => sendToCheckoutPage(product)}>Book Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
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
          className="section-separator"
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
          className="section-separator"
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