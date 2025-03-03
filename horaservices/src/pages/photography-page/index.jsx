
import { useState , useEffect , useCallback } from 'react'
import './photo.css'
import { FeaturedWorkData, clients, ourServicesData, InstImageData } from './data'
import Image from 'next/image'
import axios from 'axios';
import { useRouter } from 'next/router';
import  photographyBanner  from "../../assets/photography-landing.svg";
import  magician  from "../../assets/magician.jpg";
import  triditionalPhoto  from "../../assets/triditional-photo.jpg";
import Slider from 'react-slick'; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

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
        <div>
              <div className="banner-sec">
          <div className="photograpy-bannner-sec">
          <div className="sec">
                    <Image src={photographyBanner} alt="Decoration services, Balloon decoration , decoration for birthday party"
                     width={1500} 
                     height={450} 
                     className="responsive-image"
                     />
                  </div>
          
              </div>
          
              </div>
        </div>
      <div className="featured-works">   
     
             {/* Render API product */}

             
        {/* <div className="works-container">
       
        {products.map((product, index) => (
          <div className="work-item" key={product.id || index}>
            {
              product.name === 'Traditional Photography' ? 
              <Image
              src={triditionalPhoto}
              width={300}
              height={250}
              alt={product.name}
              />
              : 
              <Image
              src={magician}
              width={300}
              height={250}
              alt={product.name}
              />
            }
           
            <img src={product.featured_image} alt={product.title} className="work-image" />


            <div className="work-card-info">
              <div className="work-details">
                <h5 className="work-title">{product.name}</h5>
                {Array.isArray(product.inclusion) && product.inclusion.length > 0 && (
                  <ul className="work-inclusions">
                    <li>{getCleanInclusionText(product.inclusion)}</li>
                    {product.inclusion.map((inc, index) => (
                      <li className="inclusion-item" key={index}>{inc}</li>
                    ))}
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
            <button onClick={() => sendToCheckoutPage(product)} className='book-now-btn'>Book Now</button>
          </div>
        ))}
      </div> */}

<div className="works-container products">
<div className="section-small-header">  Services: Less than 100 Guest</div>
<div className="section-small-header-sec">Kids, Birthday, House Warming, Naming Ceremony, Corporate, 
Baby Shower, New Born baby, Maternity Shoot

</div>
      <img
        src="https://cdn.prod.website-files.com/593008e46c534e61e392e0f2/5938f139d7978c0a4faf1460_Sep.svg"
        alt=""
        className="section-separator"
      />
     
      <div className='sec-prod'>
        {FeaturedWorkData.map((work, index) => (
          <div className="work-item" key={index}  >
            {/* <img src={work.image} alt={work.title} className="work-image" /> */}
            <Image
              src={triditionalPhoto}
              width={300}
              height={250}
              />
            <div className="work-card-info">
              <div className="work-details">
                <h5 className="work-title">{work.title}</h5>
                {/* {Array.isArray(work.inclusion) && work.inclusion.length > 0 && (
                  <ul className="work-inclusions">
                    {work.inclusion.map((inc, index) => (
                      <li className="inclusion-item" key={index}>{inc}</li>
                    ))}
                  </ul>
                )} */}
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
      </div>
      <div className="works-container products">
<div className="section-small-header">  Services: 100-300s Guest</div>
<div className="section-small-header-sec"> Kids, Birthday, House Warming, Naming Ceremony, Corporate, 
Baby Shower, New Born baby, Maternity Shoot

</div>
      <img
        src="https://cdn.prod.website-files.com/593008e46c534e61e392e0f2/5938f139d7978c0a4faf1460_Sep.svg"
        alt=""
        className="section-separator"
      />
     
      <div className='sec-prod'>
        {FeaturedWorkData.map((work, index) => (
          <div className="work-item" key={index}  >
            {/* <img src={work.image} alt={work.title} className="work-image" /> */}
            <Image
              src={triditionalPhoto}
              width={300}
              height={250}
              />
            <div className="work-card-info">
              <div className="work-details">
                <h5 className="work-title">{work.title}</h5>
                {/* {Array.isArray(work.inclusion) && work.inclusion.length > 0 && (
                  <ul className="work-inclusions">
                    {work.inclusion.map((inc, index) => (
                      <li className="inclusion-item" key={index}>{inc}</li>
                    ))}
                  </ul>
                )} */}
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
      </div>

      {/* View All Button */}
      <div>
        <a href="/works" className="button-viewall">
          View All Works
        </a>
      </div>
    </div>

    

  </>)
}



export default index;