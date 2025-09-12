import { useState, useEffect, useCallback } from 'react'
import './photo.css'
import Head from "next/head";
import Image from 'next/image'
import axios from 'axios';
import { useRouter } from 'next/router';
import { getPhotographyOrganizationSchema } from "../../utils/schema";
import pose1 from "@/assets/poseimages/pose1.png"
import pose2 from "@/assets/poseimages/pose2.png"
import pose3 from "@/assets/poseimages/pose3.jpg"
import pose4 from "@/assets/poseimages/pose4.jpg"
import pose5 from "@/assets/poseimages/pose5.jpg"
import pose6 from "@/assets/poseimages/pose6.jpg"
import pose7 from "@/assets/poseimages/pose7.png"
import pose8 from "@/assets/poseimages/pose8.png"
import pose9 from "@/assets/poseimages/pose9.jpg"
import pose10 from "@/assets/poseimages/pose10.jpg"
import pose11 from "@/assets/poseimages/pose11.png"
import pose12 from "@/assets/poseimages/pose12.jpg"
import pose13 from "@/assets/poseimages/pose13.png"
import pose14 from "@/assets/poseimages/pose14.jpg"
import pose15 from "@/assets/poseimages/pose15.jpg"
import PhotoBanner from "../../assets/PhotoBanner.webp"
import Banner1 from "../../assets/banner1.webp"
import Banner2 from "../../assets/Banner2.webp"
import Banner3 from "../../assets/banner3.webp"

import photo1 from "@/assets/cardphoto/photo1.jpg"
import photo2 from "@/assets/cardphoto/photo2.jpg"
import photo3 from "@/assets/cardphoto/photo3.jpg"
import photo4 from "@/assets/cardphoto/photo4.jpg"
import photo5 from "@/assets/cardphoto/photo5.jpg"
import photo6 from "@/assets/cardphoto/photo6.jpg"
import photo7 from "@/assets/cardphoto/photo7.jpg"
import photo8 from "@/assets/cardphoto/photo8.jpg"
import photo9 from "@/assets/cardphoto/photo9.jpg"
import photo10 from "@/assets/cardphoto/photo10.png"
import GalleryImage from "@/assets/GalleryImage.jpg"
import wedding from "@/assets/wedding.jpeg"
import prewedding from "@/assets/pre-wedding.jpeg"
import corporateshoot from "@/assets/corporate-shoot.jpeg"
import babyshowershoot from "@/assets/babyshower-shoot.jpg"
import maternityshoot from "@/assets/maternity-shoot.jpeg"
import birthdayshoot from "@/assets/birthday-shoot.jpeg"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import google from "../../assets/google.jpg";
import PhotoGraphyCard from '@/components/PhotoGraphyCard';
import PhotoGraphyCardgrid from '@/components/photoGraphyCardGrid';
import PhotographysliderSection from '@/components/photographysliderSection';
const index = () => {
  const schemaOrg = getPhotographyOrganizationSchema();
const scriptTag = JSON.stringify(schemaOrg);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0); 
  const [discountedPrice, setDiscountedPrice] = useState(0); 
  const [discountDifference, setDiscountDifference] = useState(0);
  const router = useRouter();
  const { catvalue } = router.query;
 let { city } = router.query;

 const viewMoreProduct = (work, activeTab) => {
   router.push({
      pathname: `/photography-page/product/${work._id}`,
      query: {
        product: JSON.stringify(work),
        tagId: tagIds[activeTab],  
      },
    });
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'photography_view_more_click',
    eventCategory: 'photography',
    eventAction: 'view_more_click',
    eventLabel: work?.title || work?.name || 'Unknown Product',
    productId: work?._id,
    tabName: activeTab,
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


const firePoseClickEvent = (poseCategory) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "pose_card_click",   
    eventCategory: "pose_click",
    eventAction: "click",
    eventLabel: poseCategory,   
  });
};

  const bannerImages = [
    Banner1,
    Banner2,
    Banner3,
  ];

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
  
const cards = [
  { src: photo1, title: "Birthday Photography" },
  { src: photo2, title: "Anniversary Photography" },
  { src: photo3, title: "House warming Photography" },
  { src: photo4, title: "Naming ceremony Photography" },
  { src: photo5, title: "Bachelorette Photography" },
  { src: photo6, title: "Baby Shower Photography" },
];
const cardsgrid = [
  { src: photo7, title: "Engagement Photography" },
  { src: photo8, title: "Wedding Photography" },
  { src: photo9, title: "Maternity Photography" },
  { src: photo10, title: "New Born Baby Photography" },
];
  return (
    <>
      <div>
        <Head>
  <title>
    {city
      ? `HORA Photography in ${city} | Professional Event Photography – Birthdays, Weddings & More – Starting at ₹3500`
      : 'HORA Photography : Professional photography for all events - Birthdays, Parties, & Weddings – Starting at ₹3500'}
  </title>
    <meta
    name="description"
    content={
      city
        ? `📸 Capture Every Moment in ${city}! ✨ Welcome to HORA Photography — where every click tells your story! 😊 Whether it's a dreamy wedding, a cute baby welcome, or a rocking birthday bash 🎉 in ${city}, our professional photographers are here to make your moments look as magical as they felt.`
        : `📸 Capture Every Moment, Forever! ✨ Welcome to HORA Photography — where every click tells your story! 😊 Whether it's a dreamy wedding, a cute baby welcome, or a rocking birthday bash 🎉, our professional photographers are here to make your moments look as magical as they felt.`
    }
  />
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

    <div className="gridContainer">
      {cards.map((card, index) => (
        <PhotoGraphyCard key={index} src={card.src} title={card.title} />
      ))}
    </div>
      
         <PhotographysliderSection
        title="Standard Packages"
        tagId="66c96b4e22ed47b72117e09a" 
      />

  <div className="gridContainersec">
      {cardsgrid.map((cardsgrid, index) => (
        <PhotoGraphyCardgrid key={index} src={cardsgrid.src} title={cardsgrid.title} />
      ))}
    </div>

        <h2 className="gallery-heading">
        <Image
          src={GalleryImage}
          alt="camera"
          style={{ width: '40px', height: '40px' }}
        />
        Our Gallery
      </h2>
      <div >
        <section className="collage-flex-row">
          <div className="side-img image-box">
            <Image src={wedding} alt="Wedding" />
            <div className="image-label">Wedding</div>
          </div>

          <div className="center-grid">
            <div className="image-box">
              <Image src={prewedding} alt="pre-Wedding" />
              <div className="image-label">pre-Wedding</div>
            </div>
            <div className="image-box" >
              <Image src={corporateshoot} alt="Corporate" />
              <div className="image-label">Corporate</div>
            </div>
            <div className="image-box">
              <Image src={maternityshoot} alt="Maternity" />
              <div className="image-label">Maternity</div>
            </div>
            <div className="image-box">
              <Image src={babyshowershoot} alt="baby shower" />
              <div className="image-label">Baby Shower</div>
            </div>
          </div>

          <div className="side-img image-box">
            <Image src={birthdayshoot} alt="Maternity" />
            <div className="image-label">Birthday</div>
          </div>
        </section>
      </div>
      <div className="gallery-see-more">
        <a href="/gallery" className="see-more-btn">
          See More <span className="arrow-circle">&gt;</span>
        </a>
      </div>



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
           <a
  href="https://horaservices.com/photo-gallery?folderName=Wedding&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Wedding")}
>
  <Image src={pose1} alt="Wedding" />
  <div className="TextBackground"><p>Wedding</p></div>
</a>

<a
  href="https://horaservices.com/photo-gallery?folderName=maternity%20poses&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Maternity")}
>
  <Image src={pose2} alt="Maternity" />
  <div className="TextBackground"><p>Maternity</p></div>
</a>

<a
  href="https://horaservices.com/photo-gallery?folderName=birthday%20poses&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Birthday")}
>
  <Image src={pose3} alt="Birthday" />
  <div className="TextBackground"><p>Birthday</p></div>
</a>

<a
  href="https://horaservices.com/photo-gallery?folderName=pre%20wedding&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Pre-Wedding")}
>
  <Image src={pose4} alt="Pre-Wedding" />
  <div className="TextBackground"><p>Pre-Wedding</p></div>
</a>

<a
  href="https://horaservices.com/photo-gallery?folderName=HaldiandMehendi&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Haldi/Mehndi")}
>
  <Image src={pose5} alt="HaldiMehndi" />
  <div className="TextBackground"><p>Haldi/Mehndi</p></div>
</a>

<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Babyshower")}
>
  <Image src={pose6} alt="Baby Shower" />
  <div className="TextBackground"><p>Babyshower</p></div>
</a>

<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Naming Ceremony")}
>
  <Image src={pose7} alt="Naming Ceremony" />
  <div className="TextBackground"><p>Naming Ceremony</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Couple shoot")}
>
  <Image src={pose8} alt="Couple shoot" />
  <div className="TextBackground"><p>Couple shoot</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("New Born Baby")}
>
  <Image src={pose9} alt="New Born Baby" />
  <div className="TextBackground"><p>New Born Baby</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Engagement")}
>
  <Image src={pose10} alt="Engagementr" />
  <div className="TextBackground"><p>Engagement</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Anniversary")}
>
  <Image src={pose11} alt="Anniversary" />
  <div className="TextBackground"><p>Anniversary</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("House warming")}
>
  <Image src={pose12} alt="House warming" />
  <div className="TextBackground"><p>House warming</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Bachelorate")}
>
  <Image src={pose13} alt="Bachelorate" />
  <div className="TextBackground"><p>Bachelorate</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Corporate")}
>
  <Image src={pose14} alt="Corporate" />
  <div className="TextBackground"><p>Corporate</p></div>
</a>
<a
  href="https://horaservices.com/photo-gallery?folderName=baby%20shower&customerId=6683e5d43e33c54c0ebde8f2"
  className="pose-card"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => firePoseClickEvent("Model shoot")}
>
  <Image src={pose15} alt="Model shoot" />
  <div className="TextBackground"><p>Model shoot</p></div>
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