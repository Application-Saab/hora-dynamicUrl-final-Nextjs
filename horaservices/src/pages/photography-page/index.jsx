import { useState, useEffect, useCallback } from 'react'
import './photo.css'
import Head from "next/head";
import Image from 'next/image'
import axios from 'axios';
import { useRouter } from 'next/router';
import { getPhotographyOrganizationSchema } from "../../utils/schema";
import photographyBanner from "../../assets/photography-landing.svg";
import HaldiMehndi from "../../assets/HaldiMehndi.png";
import wedding from "../../assets/wedding.png";
import Maternity from "../../assets/maternity.png";
import Birthday from "../../assets/Sbirthday.png";
import preWedding from "../../assets/prewedding.png";
import Babyshower from "../../assets/babyshower.png"
import PhotoBanner from "../../assets/PhotoBanner.webp"
import Banner1 from "../../assets/banner1.webp"
import Banner2 from "../../assets/Banner2.webp"
import Banner3 from "../../assets/banner3.webp"
import magician from "../../assets/magician.jpg";
import traditionalImg from "../../assets/traditionalphoto.webp";
import candidImg from "../../assets/CandidphotoImg.webp";
import proImg from "../../assets/Prophotography.webp";
import videoImg from "../../assets/Videography.webp";
import defaultImg from "../../assets/traditionalphoto.webp"
import haldiMehendiImg from "../../assets/haldiMehendi.webp";
import PreWeddingImg from "../../assets/PreWeddingImg.webp" ;
import weddingAffairImg from "../../assets/weddingAffair.webp";
import grandWeddingAffairImg from "../../assets/grandWeddingAffair.webp"
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
import google from "../../assets/google.jpg";
const index = () => {
  const schemaOrg = getPhotographyOrganizationSchema();
const scriptTag = JSON.stringify(schemaOrg);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); // State to store product
  const [email, setEmail] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0); // State for the discount percentage
  const [discountedPrice, setDiscountedPrice] = useState(0); // State for the discounted price
  const [discountDifference, setDiscountDifference] = useState(0);
  const [activeTab, setActiveTab] = useState('grand');
  const router = useRouter();
  const { catvalue } = router.query;

  const imageMap = {
  '6710f33c21847b9ca0554940': traditionalImg,
  '67c9af0c4bee1b66f0aac35d': candidImg,
  '67c9af224bee1b66f0aac35e': proImg,
  '67c9b0564bee1b66f0aac35f': videoImg,
  // Grand 
  "683abe22fdfcb315ad5b02b0": traditionalImg,
  "683abe69fdfcb315ad5b02b1": candidImg,
  "68411d34fdfcb315ad5b02bf": proImg,
  "68411d61fdfcb315ad5b02c0":videoImg, 
  //Mega 
  "683ac1bcfdfcb315ad5b02b4": haldiMehendiImg,
  "683ac1d1fdfcb315ad5b02b5": PreWeddingImg,
 "68411cc3fdfcb315ad5b02bd": weddingAffairImg,
 "68411cd8fdfcb315ad5b02be": grandWeddingAffairImg
};

  const renderProducts = (heading) => {
    if (loading) {
      return (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      );
    }
    return (
      <div className="featured-works">
        <div className="works-container products">
          <p className="ProductHeading">{heading}</p>
          <div className="work-container">
            {products.map((work, index) => {
              // const imageUrl = imageList[index % imageList.length]; 
               const imageUrl = imageMap[work._id] || defaultImg;
              return (
                <div className="work-item" key={index}>
                  <div className="discount-badge">
                    ₹ {work.discountDifference.toFixed(0)} off
                  </div>
                  {/* <div className="work-image-wrapper">
                    
                    <div
                      className="work-image"
                      // style={{ backgroundImage: `url("${imageUrl}")` }}
                     
                    >
                   
                      <h5 className="work-title">{work.name}</h5>
                    </div>
                  </div> */}
                  
            <div className="work-image-wrapper">
   <div className="work-image">
    <Image src={imageUrl} alt={work.name} className="work-img" />
    <div className="work-image-overlay" />
    <h5 className="work-title">{work.name}</h5>
  </div>
</div>
                  <div className="work-card-info">
                    <p className="Prefred-occ">
                      <span >₹ {work.price}</span><span> ₹{Math.floor(work.discountedPrice.toFixed(2))} </span>

                    </p>
                    <button onClick={() => viewMoreProduct(work, activeTab)} className="photograpy-book-now">View More</button>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    );
  }
  const viewMoreProduct = (work, activeTab) => {
    router.push({
      pathname: `/photography-page/product/${work._id}`,
      query: {
        product: JSON.stringify(work),
        tagId: tagIds[activeTab],  // now accessible here
      },
    });
  };
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


  const fetchData = useCallback(async (tagId) => {
    setLoading(true);
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
    finally {
      setLoading(false); // Stop loading
    }
  }, []);

  const tagIds = {
    // intimate: '66c96b4e22ed47b72117e09a', // Intimate tab
    grand: '66c96b6922ed47b72117e0b4',    // Grand tab
    mega: '66c96b5922ed47b72117e0a7'      // Mega tab
  };
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
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
    Banner1,
    Banner2,
    Banner3,

  ];

  // const images = [
  //   { title: "Wedding", image: "/wedding-shoot.jpg" },
  //   { title: "Pre-Wedding", image: "/pre-wedding.jpg" },
  //   { title: "Corporate", image: "/corporate-shoot.jpg" },
  //   { title: "Maternity", image: "/maternity-shoot.jpg" },
  //   { title: "Baby Shower", image: "/babyshower-shoot.jpg" },
  //   { title: "Birthday", image: "/birthday-shoot.jpg" },
  //   { title: "SeeMore", image: "/see-more.jpg" }
  // ];

  const tabs = [
    // { id: 'intimate', title: 'Intimate\nMoments' },
    { id: 'grand', title: 'Grand\nCelebrations' },
    { id: 'mega', title: 'Mega\nOccasions' },
  ];

  const heading = {
    intimate: 'Perfect for intimate events and moments with under 100 guests',
    grand: 'Specially Designed for all Wedding Rituals',
    mega: 'For Mega occasions (100-250 guests) needing 2 professional photographers'
  };

  const reviews = [
    {
      text: "Service is very good. We really liked every service. We took decoration photography and food service. Decoration done in 1hr. Photographer reached 20min before. Food delivered 30min before. Everything happened before time and was perfect.",
      author: "Saravani A"
    },
    {
      text: "All the service provided by HORA including decoration and photography done by Mr. Naveen kumar were up to the mark. Thankyou so much for making our baby shower program memorable. Would definitely recommend for decoration and photography.",
      author: "Shilpa Raha"
    },
    {
      text: "The Best Services! I never knew or heard about them, just tried to take photography services n booked it. Especially, The photographer Mr. Devendra! Such a down to earth, friendly n professional men. I was so happy about his services n behaviour!! If you wanna try... Close you eyes n book them!! Highly recommend!",
      author: "Umesh K"
    },
    {
      text: "Hora makes our life easy in simple partying.. it's great I found Hora... Every service team is excellent in doing there jobs. Mr Mitesh photography did his job ",
      author: "Anusha Battiprolu"
    }
  ];
  return (
    <>
      {/* Image Slider */}
      <div>
        <Head>
  <title>HORA Photography : Professional photography for all events - Birthdays, Parties, & Weddings – Starting at ₹3500</title>
  <meta
    name="description"
    content="📸 Capture Every Moment, Forever! ✨
 Welcome to HORA Photography — where every click tells your story! 😊 Whether it's a dreamy wedding, a cute baby welcome, or a rocking birthday bash 🎉, our professional photographers are here to make your moments look as magical as they felt. Specialized packages for:
Weddings 👰‍♀️🤵
Maternity & Baby Shoots 🤰👼
Birthdays & Anniversaries 🎂❤️
Housewarming & Corporate Events" />
   <meta
    name="keywords"
    content="couple photoshoot, romantic photoshoot for couples, pre wedding photoshoot, pre wedding photography, couple pre wedding photography, candid pre wedding shoot, pre bridal photography, pre wedding shoot price, pre wedding shoot in bangalore, 
    couples photography, maternity photoshoot, maternity photoshoot near me, maternity photo sessions, maternity photoshoot in bangalore, maternity couple photoshoot, mother to be photoshoot, maternity shoot near me, pregnancy photoshoot near me, 
    pregnancy photo shoot, photography in pregnancy, pregnant women photoshoot, motherhood photoshoot, pregnant ladies photoshoot, couple pregnancy photoshoot, seemantham photoshoot, pregnancy photoshoot in bangalore, newborn photography, infant photography,
     baby photography near me, newborn photography near me, newborn photoshoot, infant photographers near me, newborn portraits near me, newborn family photoshoot, family photography with newborn, cake smash photoshoot, first birthday cake smash photoshoot, 
     engagement photo shoot, engagement photoshoot, engagement couple photography, engagement photography, wedding photographer, wedding photographer near me, wedding photoshoot, photographer wedding, candid wedding photography, marriage photoshoot, post wedding photoshoot, 
     bridal photoshoot, traditional photography, wedding photographers in bangalore, marriage photographers in bangalore, birthday photoshoot, first birthday photoshoot, pre birthday photoshoot, birthday celebration photoshoot, birthday photo session, 18th photoshoot, 
     birthday party photographer, event photography, photoshoot for wedding anniversary, anniversary photoshoot, candid photography, cinematic photography, fashion photography, model photography, black and white photography, landscape photography, portrait photography, 
     photographers near me, professional photographer near me, professional photographer, freelance photographer, best photographers near me, photoshoot near me, photographer in bangalore, photography in bangalore, bangalore photoshoot, photography services"
  />
  <meta property="og:title" content="HORA Photography : Professional photography for all events" />
  <meta
    property="og:description"
    content="Professional event photography for weddings, birthdays, baby showers, and more. Book today for stunning, affordable memories — starting at just ₹3500!"
  />
  <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
  <meta property="og:url" content="https://horaservices.com/photography" />
  <meta property="og:type" content="website" />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="Hora Services" />
  <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
  <script type="application/ld+json">{scriptTag}</script>
</Head>
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
                  <Image src={img} alt={`Banner ${index + 1}`} layout="responsive"
                    width={1200}
                    height={400}
                    quality={100}
                     loading="eager"
                    className="banner-image" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>


        <Tabs
          tabs={tabs}
          defaultTab="grand"
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div>{renderProducts(heading[activeTab])}</div>



        {/* <h2 className="gallery-heading">
        <img
          src="/GalleryImage.jpg"
          alt="camera"
          style={{ width: '40px', height: '40px' }}
        />
        Our Gallery
      </h2>
      <div >
        <section className="collage-flex-row">
          <div className="side-img image-box">
            <img src="/wedding.jpeg" alt="Wedding" />
            <div className="image-label">Wedding</div>
          </div>

          <div className="center-grid">
            <div className="image-box">
              <img src="/pre-wedding.jpeg" alt="pre-Wedding" />
              <div className="image-label">pre-Wedding</div>
            </div>
            <div className="image-box" >
              <img src="/corporate-shoot.jpeg" alt="Corporate" />
              <div className="image-label">Corporate</div>
            </div>
            <div className="image-box">
              <img src="/maternity-shoot.jpeg" alt="Maternity" />
              <div className="image-label">Maternity</div>
            </div>
            <div className="image-box">
              <img src="/babyshower-shoot.jpg" alt="baby shower" />
              <div className="image-label">Baby Shower</div>
            </div>
          </div>

          <div className="side-img image-box">
            <img src="/birthday-shoot.jpeg" alt="Maternity" />
            <div className="image-label">Birthday</div>
          </div>
        </section>
      </div>
      <div className="gallery-see-more">
        <a href="/gallery" className="see-more-btn">
          See More <span className="arrow-circle">&gt;</span>
        </a>
      </div> */}



        <div class="suggested-poses">
          <div class="suggested-poses-section">
            <Image src={PhotoBanner} alt="Camera Holding" class="suggested-img" />
            <div class="text-overlay">
              <h2 class="pose-title">Suggested Poses</h2>
              <p class="pose-subtitle">Perfect for a relaxed and friendly vibe</p>
            </div>
          </div>
        </div>




        <div class="poses">
          <div class="pose-grid">
            <a href="https://horaservices.com/photo-gallery?folderName=Wedding&customerId=6683e5d43e33c54c0ebde8f2" class="pose-card" target="_blank"
              rel="noopener noreferrer">
              <Image src={wedding} alt="Wedding" />
             <div className='TextBackground'><p>Wedding</p></div> 
            </a>
            <a href="https://horaservices.com/photo-gallery?folderName=maternity%20poses&customerId=6683e5d43e33c54c0ebde8f2" class="pose-card" target="_blank"
              rel="noopener noreferrer">
              <Image src={Maternity} alt="Maternity" />
               <div className='TextBackground'> <p>Maternity</p></div>
            </a>
            <a href="https://horaservices.com/photo-gallery?folderName=birthday%20poses&customerId=6683e5d43e33c54c0ebde8f2" class="pose-card" target="_blank"
              rel="noopener noreferrer">
              <Image src={Birthday} alt="Birthday" />
                <div className='TextBackground'><p>Birthday</p></div> 
            </a>
            <a href="https://horaservices.com/photo-gallery?folderName=pre%20wedding&customerId=6683e5d43e33c54c0ebde8f2" class="pose-card" target="_blank"
              rel="noopener noreferrer">
              <Image src={preWedding} alt="Pre-Wedding" />
                <div className='TextBackground'> <p>pre-Wedding</p></div>
            </a>
            <a href="https://horaservices.com/photo-gallery?folderName=HaldiandMehendi&customerId=6683e5d43e33c54c0ebde8f2" class="pose-card" target="_blank"
              rel="noopener noreferrer">
              <Image src={HaldiMehndi} alt="HaldiMehndi" />
                <div className='TextBackground'> <p>Haldi/Mehndi</p></div> 
            </a>
            <a href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2" class="pose-card" target="_blank"
              rel="noopener noreferrer">
              <Image src={Babyshower} alt="Baby Shower" />

               <div className='TextBackground'><p>Babyshower
              </p>
</div> 
            </a>
          </div>
        </div>

        <div class="trust-section">
          <h2 class="Trust-header" >Why People Trust Us <span>♥</span></h2>
          {/* <h3 class="trust-subtitle">Ashu Tiwari</h3>
        <div class="stars"> ★★★★★</div> */}
          <div className="review">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              loop={true}
              spaceBetween={20}
              slidesPerView={1}
            >
              {reviews.map(({ text, author }, idx) => (
                <SwiperSlide key={idx}>
                  <p className="trust-subtitle">{author}</p>
                  <p className="review-text">{text}</p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>



          {/* <div class="user-quote">
          <img src="user.jpg" alt="Tara Sutara" class="profile-img" />
          <div>
            <div class="quote">"I absolutely love their work! Highly recommended."</div>
            <p class="name">Tara sutara</p>
          </div>
        </div> */}

          <div class="stats-grid">
            <div class="stat-box">
              <div class="rating-row">
                <Image src={google} alt="Google Icon" class="icon" />
                <strong>4.8</strong>
              </div>
              <p class="Text-google">Google Rating</p>
            </div>

            <div class="stat-box">
              <div class="photoD">
                <strong >50L+</strong>
                <div class="photos-title">Photos Delivered</div>
              </div>
            </div>

            <div class="stat-box full">
              <p><strong>15K+</strong><span class="highlight"> Happy Customers</span></p>
            </div>
          </div>
        </div>



        <div className="keywords-box">
 
  <p className="keyword-text">
    {[
      "couple photoshoot",
      "romantic photoshoot for couples",
      "pre wedding photoshoot",
      "pre wedding photography",
      "couple pre wedding photography",
      "candid pre wedding shoot",
      "pre bridal photography",
      "pre wedding shoot price",
      "pre wedding shoot in bangalore",
      "couples photography",
      "maternity photoshoot",
      "maternity photoshoot near me",
      "maternity photo sessions",
      "maternity photoshoot in bangalore",
      "maternity couple photoshoot",
      "mother to be photoshoot",
      "maternity shoot near me",
      "pregnancy photoshoot near me",
      "pregnancy photo shoot",
      "photography in pregnancy",
      "pregnant women photoshoot",
      "motherhood photoshoot",
      "pregnant ladies photoshoot",
      "couple pregnancy photoshoot",
      "seemantham photoshoot",
      "pregnancy photoshoot in bangalore",
      "newborn photography",
      "infant photography",
      "baby photography near me",
      "newborn photography near me",
      "newborn photoshoot",
      "infant photographers near me",
      "newborn portraits near me",
      "newborn family photoshoot",
      "family photography with newborn",
      "cake smash photoshoot",
      "first birthday cake smash photoshoot",
      "engagement photo shoot",
      "engagement photoshoot",
      "engagement couple photography",
      "engagement photography",
      "wedding photographer",
      "wedding photographer near me",
      "wedding photoshoot",
      "photographer wedding",
      "candid wedding photography",
      "marriage photoshoot",
      "post wedding photoshoot",
      "bridal photoshoot",
      "traditional photography",
      "wedding photographers in bangalore",
      "marriage photographers in bangalore",
      "birthday photoshoot",
      "first birthday photoshoot",
      "pre birthday photoshoot",
      "birthday celebration photoshoot",
      "birthday photo session",
      "18th photoshoot",
      "birthday party photographer",
      "event photography",
      "photoshoot for wedding anniversary",
      "anniversary photoshoot",
      "candid photography",
      "cinematic photography",
      "fashion photography",
      "model photography",
      "black and white photography",
      "landscape photography",
      "portrait photography",
      "photographers near me",
      "professional photographer near me",
      "professional photographer",
      "freelance photographer",
      "best photographers near me",
      "photoshoot near me",
      "photographer in bangalore",
      "photography in bangalore",
      "bangalore photoshoot",
      "photography services"
    ].join(", ")}
  </p>
</div>

      </div>
    </>
  );
};

export default index;