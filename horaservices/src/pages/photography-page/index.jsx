
import { useState, useEffect, useCallback } from 'react'
import './photo.css'
import Image from 'next/image'
import axios from 'axios';
import { useRouter } from 'next/router';
import photographyBanner from "../../assets/photography-landing.svg";
import magician from "../../assets/magician.jpg";
import triditionalPhoto from "../../assets/triditional-photo.jpg";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import whatsppicon from "../../assets/whatsapp-new.webp";
import Link from 'next/link';


const index = () => {
  const [products, setproducts] = useState([]); // State to store product
  const [email, setEmail] = useState("");
  const router = useRouter();
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  }, [email]);

  const getItemInclusion = (inclusion) => {
      if (!Array.isArray(inclusion) || inclusion.length === 0) {
        return null;
      }
      const htmlString = inclusion[0];
      const withoutTags = htmlString.replace(/<[^>]*>/g, ''); // Remove HTML tags
      const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, ' '); // Replace &# sequences with space
      const statements = withoutSpecialChars.split('<div>');
      const inclusionItems = statements.flatMap(statement => statement.split("-").filter(item => item.trim() !== ''));
      const inclusionList = inclusionItems.map((item, index) => (
        <li key={index} className="inclusionstyle">
          {index + 1}{'.'} {item.trim()}
        </li>
      ));

      return (
        <div>
          <ul class="work-duration">
            {inclusionList}
          </ul>
        </div>
  
      );
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
  }, []);
  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []);
  const sendToCheckoutPage = (product) => {
    window.dataLayer = window.dataLayer || [];
     window.dataLayer.push({
       event: "book_now_click",
       product_name: product.name,
     });
     console.log("Data sent to dataLayer:");
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
 <div className="party-services homeslider">
      <div className="home-slider-inner">
                <img src="../../../assets/photography-landing.svg" alt="Decoration services, Balloon decoration , decoration for birthday party"
                 />
              </div>
          </div>
    </div>
    <div className="featured-works">
      <div className="works-container products">
        <div className="section-small-header">  Services: Less than 100 Guest</div>
        <div className="section-small-header-sec">Kids, Birthday, House Warming, Naming Ceremony, Corporate,
          Baby Shower, New Born baby, Maternity Shoot</div>
        <img
          src="https://cdn.prod.website-files.com/593008e46c534e61e392e0f2/5938f139d7978c0a4faf1460_Sep.svg"
          alt=""
          className="section-separator"
        />
        <div className='sec-prod'>
          {products.map((work, index) => (
            <div className="work-item" key={index}  >
              <div className="work-card-info">
                <div className="work-details">
                  <h5 className="work-title">{work.name}</h5>
                  <p className="Prefred-occ"><b>Price: </b>₹ {work.price}</p>
                  <b class="inclusion-heading">Inclusion:</b>
                  <div> {getItemInclusion(work.inclusion)}</div>
                  <p className="work-duration">
                    <b>Duration:</b> 2-4 Hours (After 4 hours, 650 Rs extra per hour)
                  </p>
                  {/* <button >View Sample Work</button> */}
                  <button onClick={() => sendToCheckoutPage(work)} class="photograpy-ook-now">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>

    <div className="works-container products preweddng">
        <div className="section-small-header">Wedding and preWedding Services</div>
       
        <Link href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20wedding%20photography%20&%20pPrewedding%20services" target="_blank">
        <div className="section-small-header-sec">Please connect with us on Whatsapp </div> 
        </Link>

        
      
    </div>



  </>)
}



export default index;