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
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [discountDifference , setDiscountDifference] = useState(0);
  const [loading, setLoading] = useState(true);

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
    const withoutTags = htmlString.replace(/<[^>]*>/g, '');
    const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, ' ');
    const statements = withoutSpecialChars.split('<div>');
    const inclusionItems = statements.flatMap(statement => statement.split("-").filter(item => item.trim() !== ''));
    const inclusionList = inclusionItems.map((item, index) => (
      <li key={index} className="inclusionstyle">
        {index + 1}. {item.trim()}
      </li>
    ));

    return (
      <div>
        <ul className="work-duration">
          {inclusionList}
        </ul>
      </div>
    );
  };

  const getDiscountedPrice = (price) => {
    let discount;
    if (price < 3000) {
      discount = 20;
    } else if (price >= 3000 && price <= 5000) {
      discount = 27;
    } else {
      discount = 35;
    }
    const discountedPrice = price * (1 + discount / 100);
    const discountDifference = Math.abs(price - discountedPrice);
    return { discount, discountedPrice, discountDifference };
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://horaservices.com:3000/api/photography/searchByTag/66c96b4e22ed47b72117e09a'
      );
      const productData = response.data.data.map(item => {
        const { discount, discountedPrice, discountDifference } = getDiscountedPrice(item.price);
        return {
          ...item,
          discountPercentage: discount,
          discountedPrice,
          discountDifference
        };
      });
      setProducts(productData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
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

  return (
    <>
      <div>
        <div className="party-services homeslider">
          <div className="home-slider-inner">
            <img src="../../../assets/photography-landing.svg" alt="Decoration services, Balloon decoration , decoration for birthday party" />
          </div>
        </div>
      </div>

      <div className="featured-works">
        <div className="works-container products">
          <div className="section-small-header-sec">
            Kids, Birthday, House Warming, Naming Ceremony, Corporate,
            Baby Shower, New Born baby, Maternity Shoot
          </div>
          <div className="section-small-header">Services: Less than 100 Guest</div>
          <img
            src="https://cdn.prod.website-files.com/593008e46c534e61e392e0f2/5938f139d7978c0a4faf1460_Sep.svg"
            alt=""
            className="section-separator"
          />

          {loading ? (
              <div className="custom-spinner">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div style={{ color: "#9252AA", textAlign: "center" }}>
              <h4 style={{ fontSize:"16px"}}>Loading Products...</h4>
            </div>
            </div>
          ) : (
            <div className='sec-prod'>
              {products.map((work, index) => (
                <div className="work-item" key={index}>
                  <div className="work-card-info">
                    <div className="work-details">
                      <h5 className="work-title">{work.name}</h5>
                      <p className="Prefred-occ">
                        <span>₹ {work.price}</span>
                        <span> ₹{Math.floor(work.discountedPrice.toFixed(2))}</span>
                        <span className='photograpty-disconut'>
                          ₹ {work.discountDifference.toFixed(0)} off
                        </span>
                      </p>
                      <b className="inclusion-heading">Inclusion:</b>
                      <div>{getItemInclusion(work.inclusion)}</div>
                      <p className="work-duration">
                        <b>Duration:</b> 2-4 Hours (After 4 hours, 650 Rs extra per hour)
                      </p>
                      <button onClick={() => sendToCheckoutPage(work)} className="photograpy-ook-now">Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="works-container products preweddng">
        <div className="section-small-header">Wedding and preWedding Services</div>
        <Link href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20wedding%20photography%20&%20pPrewedding%20services" target="_blank">
          <div className="section-small-header-sec">Please connect with us on Whatsapp</div>
        </Link>
      </div>
    </>
  );
};

export default index;
