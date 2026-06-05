import Image from 'next/image'
import { useRouter } from 'next/router';
import { getPhotographyOrganizationSchema } from "../../utils/schema";
import './photo.css'

import PhotoBanner from "../../assets/PhotoBanner.jpg"
import Banner1 from "../../assets/banner1.webp"
import Banner2 from "../../assets/Banner2.webp"
import Banner3 from "../../assets/banner3.webp"
import BrandBannerIMG from "../../assets/BrandBannerIMG.webp";
import HappyCustomerIMG from "../../assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "../../assets/GoogleRatingIMG4.png";
import SocialMediaIMG from "../../assets/ourSocialmediaIMG.png";
import TopBrandIMg from "../../assets/TpBrandsIMG.png";
import { photographyreviews } from '@/utils/photographyreviews';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import PhotoGraphyCard from '@/components/PhotoGraphyCard';
import PhotoGraphyCardgrid from '@/components/photoGraphyCardGrid';

import { photoCat } from "@/utils/photoCategories.js";
import BrandBanner from '@/components/BrandBanner';
import ReviewSlider from '@/components/ReviewSection';
import { SeoMain } from "@/utils/photoGraphyHead";
import { keywordsList } from "@/utils/photoGraphyKeywordlist";
import { poseGridData } from "@/utils/poseGridData";
import PhotographyPackageGridSlider from '@/components/PhotographyPackageGridSlider';
const index = () => {

  const router = useRouter();
  const schemaOrg = getPhotographyOrganizationSchema();
const scriptTag = JSON.stringify(schemaOrg);
const { city, locality, photoCat: photoCatQuery } = router.query;

const cityProps = {
  city,
  locality,
  photoCat: photoCatQuery,
  hasCityPageParam: true,
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

const brandItems = [
  { img: HappyCustomerIMG, alt: "Happy Customers", bold: "1L+ HAPPY", sub: "CUSTOMERS" },
  { img: GoogleRatingIMG, alt: "Google Rating", bold: "4.8+ GOOGLE", sub: "RATING" },
  { img: SocialMediaIMG, alt: "Social Media", bold: "OUR", sub: "SOCIAL MEDIA" },
  { img: TopBrandIMg, alt: "Top Brands", bold: "TOP BRANDS", sub: "PARTNERED" },
];

  return (
    <>
      <div style={{maxWidth:"800px",margin:"auto"}}>
      
   <SeoMain city={city}  locality={locality} scriptTag={scriptTag} />
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
                    className="professional event photographer in India" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
 
        <div className="gridContainer">
          {photoCat.slice(0, 6).map((item) => (
            <PhotoGraphyCard
              key={item.id}
              src={item.image}
              title={item.name}
              subCategory={item.subCategory}
              city={city}
              locality={locality}
            />
          ))}
        </div>



        <PhotographyPackageGridSlider
          title="Standard Packages"
          tagId="66c96b4e22ed47b72117e09a"
          cityProps={cityProps}
        />


        <div className="gridContainersec">
          {photoCat.slice(6, 10).map((item) => (
            <PhotoGraphyCardgrid
              key={item.id}
              src={item.image}
              title={item.name}
              subCategory={item.subCategory}
                  cityProps={cityProps}
            />
          ))}
        </div>

<div className="hora-wrap">
      <div className="hora-card">
        <span className="hora-tag">Book in minutes</span>
        <h1>Professional event photographers across India</h1>

        <div className="hora-stat">
          <div className="hora-stat-item">
            <div className="hora-stat-num">1000+</div>
            <div className="hora-stat-label">Verified photographers</div>
          </div>
          <div className="hora-divider"></div>
          <div className="hora-stat-item">
            <div className="hora-stat-num">Pan</div>
            <div className="hora-stat-label">India coverage</div>
          </div>
        </div>

        <p>
          Looking for a photographer near you?{" "}
          <span className="hora-brand">HORA</span> covers birthdays,
          anniversaries, weddings, maternity shoots, baby showers &amp; more.
        </p>

        <div className="hora-price-box">
          <div className="hora-price-row">
            <span className="hora-price-from">Starting from</span>
            <span className="hora-price-amt">₹3600/-</span>
          </div>
        </div>

        {/* <div className="hora-badges">
          {events.map(tag => (
            <span key={tag} className="hora-badge">{tag}</span>
          ))}
        </div> */}

        {/* <button className="hora-cta">Book your photoshoot</button> */}
      </div>
    </div>


{/* <div class="suggested-poses">
          <div class="suggested-poses-section">
            <Image src={PhotoBanner} alt="Camera Holding" class="suggested-image" />
          </div>
        </div>

             <div class="poses">
<div className="pose-grid">
 {poseGridData.map((pose, index) => (
  <a
    key={index}
    href={`https://horaservices.com/photo-gallery?folderName=${encodeURIComponent(
      pose.folder
    )}&customerId=${pose.customerId}`}
    className="pose-card"
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => firePoseClickEvent(pose.title)}
  >
    <Image src={pose.image} alt={pose.title} />
    <div className="TextBackground">
      <p>{pose.title}</p>
    </div>
  </a>
))}

</div>
     </div> */}

<section className="BabyShowerBanner">
        <Image
          src={BrandBannerIMG}
          alt="Decoration-Banner"
          width={1200}
          height={400}
          className="decorationBanner-image"
          priority
        />
      </section>
      <BrandBanner title="Excellence Backed by Happy Customers" items={brandItems} />

<ReviewSlider reviews={photographyreviews} title="Customer Reviews" />


 <div className="keywords-box">
      <p className="keyword-text">{keywordsList.join(", ")}</p>
    </div>

      </div>
    </>
  );
};

export default index;