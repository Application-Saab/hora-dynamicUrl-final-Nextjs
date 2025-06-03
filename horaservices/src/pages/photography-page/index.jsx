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
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Tabs from '@/components/Tabs';

const index = () => {
  const [products, setProducts] = useState([]); // State to store product
  const [email, setEmail] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0); // State for the discount percentage
  const [discountedPrice, setDiscountedPrice] = useState(0); // State for the discounted price
  const [discountDifference, setDiscountDifference] = useState(0);
  const [activeTab, setActiveTab] = useState('intimate');
  const router = useRouter();


  const renderProducts = () => (
    <div className="featured-works">
      <div className="works-container products">
        <p className="ProductHeading">
          For small gatherings under 100 guests. (Birthdays, Anniversaries, etc.)
        </p>

        <div className="work-container">
          {products.map((work, index) => (
            <div className="work-item" key={index}>
              <div className="discount-badge">
                ₹ {work.discountDifference.toFixed(0)} off
              </div>
              <div className="work-image-wrapper">


                <div
                  className="work-image"
                  style={{ backgroundImage: `url("/Banner1.avif")` }}
                >
                  <h5 className="work-title">{work.name}</h5>
                </div>
              </div>

              <div className="work-card-info">
                <p className="Prefred-occ">
                  ₹ {Math.floor(work.discountedPrice)}{" "}
                  <span className="original-price">₹ {work.price}</span>
                </p>

                <button
                  onClick={() => sendToCheckoutPage(work)}
                  className="photograpy-book-now"
                >
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  const getDiscountedPrice = (price) => {
    let discount;

    // Determine the discount percentage based on the item price
    if (price < 3000) {
      discount = 20; // 20% discount
    } else if (price >= 3000 && price <= 5000) {
      discount = 27; // 27% discount
    } else {
      discount = 35; // 35% discount for prices above 5000
    }

    const discountedPrice = price * (1 + discount / 100); // Calculate the discounted price
    const discountDifference = Math.abs(price - discountedPrice);;
    return { discount, discountedPrice, discountDifference }; // Return both discount percentage and discounted price
  };

  // const fetchData = useCallback(async () => {
  //   try {
  //     const response = await axios.get(
  //       'https://horaservices.com:3000/api/photography/searchByTag/66c96b4e22ed47b72117e09a'
  //     );
  //     const productData = response.data.data.map(item => {
  //       const { discount, discountedPrice, discountDifference } = getDiscountedPrice(item.price); // Destructure the return value
  //       return {
  //         ...item,
  //         discountPercentage: discount, // Add discount percentage
  //         discountedPrice: discountedPrice,// Add discounted price
  //         discountDifference: discountDifference
  //       };
  //     });
  //     setProducts(productData);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     setProducts([]); // Set to empty array in case of an error
  //   }
  // }, []);
  // useEffect(() => {
  //   fetchData(); // Call fetchData when the component mounts
  // }, []);

  const fetchData = useCallback(async (tagId) => {
    try {
      const response = await axios.get(
        `https://horaservices.com:3000/api/photography/searchByTag/${tagId}`
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
    }
  }, []);
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const tagIds = {
      intimate: '66c96b4e22ed47b72117e09a', // Intimate tab
      grand: '66c96b5922ed47b72117e0a7',    // Grand tab
      mega: '66c96b6922ed47b72117e0b4'      // Mega tab
    };
    fetchData(tagIds[tabId]);
  };
  useEffect(() => {
    fetchData('66c96b4e22ed47b72117e09a');
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

  const bannerImages = [
    '/Banner1.jpeg',
    '/Banner2.jpeg',
    '/Banner3.svg',

  ];



  const images = [
    { title: "Wedding", image: "/wedding-shoot.jpg" },
    { title: "Pre-Wedding", image: "/pre-wedding.jpg" },
    { title: "Corporate", image: "/corporate-shoot.jpg" },
    { title: "Maternity", image: "/maternity-shoot.jpg" },
    { title: "Baby Shower", image: "/babyshower-shoot.jpg" },
    { title: "Birthday", image: "/birthday-shoot.jpg" },
    { title: "SeeMore", image: "/see-more.jpg" }
  ];

  const tabs = [
    { id: 'intimate', title: 'Intimate\nMoments', content: renderProducts() },
    { id: 'grand', title: 'Grand\nCelebrations', content: renderProducts() },
    { id: 'mega', title: 'Mega\nOccasions', content: renderProducts() },
  ];

  return (
    <>
      {/* Image Slider */}
      <div className="party-services homeslider">
        <div className="image-banner-slider">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
          >
            {bannerImages.map((img, index) => (
              <SwiperSlide key={index}>
                <img src={img} alt={`Banner ${index + 1}`} className="banner-image" />
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </div>


      {/* <Tabs tabs={tabs} defaultTab="intimate" activeTab={activeTab} onTabChange={setActiveTab} /> */}
      <Tabs
        tabs={tabs}
        defaultTab="intimate"
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />


      {/* <h2 className="gallery-heading">
        <span role="img" aria-label="camera">📸</span> Our Gallery
      </h2> */}

      <h2 className="gallery-heading">
        <img
          src="/GalleryImage.jpg"
          alt="camera"
          style={{ width: '40px', height: '40px' }}
        />
        Our Gallery
      </h2>
      {/* <section className="collage-flex-row">
        <div className="side-img">
          <img src="/pre-wedding.jpg" alt="Left Vertical" />

        </div>

        <div className="center-grid">
          <img src="/corporate-shoot.jpg" alt="Center 1" />
          <img src="/wedding-shoot.jpg" alt="Center 2" />
          <img src="/babyshower-shoot.jpg" alt="Center 3" />
          <img src="/birthday-shoot.jpg" alt="Center 4" />
        </div>

        <div className="side-img">
          <img src="/maternity-shoot.jpg" alt="Right Vertical" />
        </div>
      </section> */}
<section className="collage-flex-row">
  <div className="side-img image-box">
    <img src="/pre-wedding.jpg" alt="Pre-Wedding" />
    <div className="image-label">Pre-Wedding</div>
  </div>

  <div className="center-grid">
    <div className="image-box">
      <img src="/corporate-shoot.jpg" alt="Corporate" />
      <div className="image-label">Corporate</div>
    </div>
    <div className="image-box">
      <img src="/wedding-shoot.jpg" alt="Wedding" />
      <div className="image-label">Wedding</div>
    </div>
    <div className="image-box">
      <img src="/babyshower-shoot.jpg" alt="Baby Shower" />
      <div className="image-label">Baby Shower</div>
    </div>
    <div className="image-box">
      <img src="/birthday-shoot.jpg" alt="Birthday" />
      <div className="image-label">Birthday</div>
    </div>
  </div>

  <div className="side-img image-box">
    <img src="/maternity-shoot.jpg" alt="Maternity" />
    <div className="image-label">Maternity</div>
  </div>
</section>

      <div className="gallery-see-more">
        <a href="/gallery" className="see-more-btn">
          See More <span className="arrow-circle">➤</span>
        </a>
      </div>



      <div class="suggested-poses">
        <div class="suggested-poses-section">
          <img src="/PhotoBanner.png" alt="Camera Holding" class="suggested-img" />
          <div class="text-overlay">
            <h2 class="pose-title"> Suggested Poses</h2>
            <p class="pose-subtitle">Perfect for a relaxed and friendly vibe</p>
          </div>
        </div>
      </div>




      <div class="poses">
        <div class="pose-grid">
          <a href="#wedding" class="pose-card">
            <img src="/wedding.png" alt="Wedding" />
            <p>Wedding</p>
          </a>
          <a href="#maternity" class="pose-card">
            <img src="/maternity.png" alt="Maternity" />
            <p>Maternity</p>
          </a>
          <a href="#birthday" class="pose-card">
            <img src="/Sbirthday.png" alt="Birthday" />
            <p>Birthday</p>
          </a>
          <a href="#prewedding" class="pose-card">
            <img src="/prewedding.png" alt="Pre-Wedding" />
            <p>pre-Wedding</p>
          </a>
          <a href="#corporate" class="pose-card">
            <img src="/corporate.png" alt="Corporate" />
            <p>corporate</p>
          </a>
          <a href="#babyshower" class="pose-card">
            <img src="/babyshower.png" alt="Baby Shower" />
            
            <p>Baby shower</p>
          </a>
        </div>
      </div>


      <div class="trust-section">
        <h2 class="Trust-header">Why People Trust Us 💜</h2>
        <h3 class="trust-subtitle">Ashu Tiwari</h3>
        <div class="stars">⭐️⭐️⭐️⭐️⭐️</div>
        <p class="main-review">
          Food was too good. I mean all dishes were good and quantity was good.
          Every guest appreciated the taste and love it so much. Will definitely recommend
          to anyone looking for food services
        </p>

        <div class="user-quote">
          <img src="user.jpg" alt="Tara Sutara" class="profile-img" />
          <div>
            <div class="quote">"I absolutely love their work! Highly recommended."</div>
            <p class="name">Tara sutara</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <div class="rating-row">
              <img src="google.jpg" alt="Google Icon" class="icon" />
              <strong>4.8</strong>
            </div>
            <p class="Text-google">Google Rating</p>
          </div>

          <div class="stat-box">
            <strong>50L+</strong>
            <div class="photos-title">Photos Delivered</div>
          </div>

          <div class="stat-box full">
            <p><strong>15K+</strong><span class="highlight"> Happy Customers</span></p>
          </div>
        </div>
      </div>

    </>
  );
};

export default index;

