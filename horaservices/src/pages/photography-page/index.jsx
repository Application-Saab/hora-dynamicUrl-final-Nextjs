import Image from "next/image";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { getPhotographyOrganizationSchema } from "../../utils/schema";
import { photoCat } from "@/utils/photoCategories.js";
import { SeoMain } from "@/utils/photoGraphyHead";
import { keywordsList } from "@/utils/photoGraphyKeywordlist";
import { poseGridData } from "@/utils/poseGridData";
import { photographyreviews } from "@/utils/photographyreviews";
import { BASE_URL, GET_PHOTOGRAPHY_BY_TAG } from "@/utils/apiconstants.js";
import axiosApi from "@/utils/axiosApi";

import "./photo.css";

import PhotoBanner from "../../assets/PhotoBanner.jpg";
import Banner1 from "../../assets/banner1.webp";
import Banner2 from "../../assets/Banner2.webp";
import Banner3 from "../../assets/Banner3.webp";
import HappyCustomerIMG from "../../assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "../../assets/GoogleRatingIMG4.png";
import SocialMediaIMG from "../../assets/ourSocialmediaIMG.png";
import TopBrandIMg from "../../assets/TpBrandsIMG.png";
import arrowIcon from "@/assets/arrowicon.svg";
import BannerImg from "@/assets/capsulebanner.webp";

import EventCapsuleBannerImage from "@/components/Eventcapsulebannerimage";
import PhotoGraphyCard from "@/components/PhotoGraphyCard";
import PhotoGraphyCardgrid from "@/components/photoGraphyCardGrid";

// Heavy client-only pieces
const BrandBanner = dynamic(() => import("@/components/BrandBanner"));
const ReviewSlider = dynamic(() => import("@/components/ReviewSection"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" />,
});
import PhotographyPackageGridSlider from "@/components/PhotographyPackageGridSlider";

const STANDARD_PACKAGE_TAG_ID = "66c96b4e22ed47b72117e09a";

const brandItems = [
  { img: HappyCustomerIMG, alt: "Happy Customers", bold: "1L+ HAPPY", sub: "CUSTOMERS" },
  { img: GoogleRatingIMG, alt: "Google Rating", bold: "4.8+ GOOGLE", sub: "RATING" },
  { img: SocialMediaIMG, alt: "Social Media", bold: "OUR", sub: "SOCIAL MEDIA" },
  { img: TopBrandIMg, alt: "Top Brands", bold: "TOP BRANDS", sub: "PARTNERED" },
];

const bannerImages = [Banner1, Banner2, Banner3];

const getDiscountedPrice = (price = 0) => {
  const discountedPrice = price / 0.78;
  const discountDifference = discountedPrice - price;
  const discount = ((discountDifference / discountedPrice) * 100).toFixed(0);
  return {
    discount: Number(discount),
    discountedPrice: Math.round(discountedPrice),
    discountDifference: Math.round(discountDifference),
  };
};

// ---------- SSR ----------
export async function getServerSideProps(context) {
  // City pages: /[city]/photography-page  ya  /[city]/[locality]/photography-page
  // Non-city: /photography-page
  const { city, locality } = context.params || {};
  const query = context.query || {};

  const finalCity = city || query.city || null;
  const finalLocality = locality || query.locality || null;

  let standardPackages = [];

  try {
    const res = await axiosApi.get(
      `${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}${STANDARD_PACKAGE_TAG_ID}`
    );

    standardPackages =
      res.data?.data?.map((item) => {
        const { discountedPrice, discountDifference } = getDiscountedPrice(
          item.price || 0
        );
        return { ...item, discountedPrice, discountDifference };
      }) || [];
  } catch (err) {
    console.error("SSR photography packages fetch error:", err.message);
    standardPackages = [];
  }

  return {
    props: {
      city: finalCity,
      locality: finalLocality,
      initialPackages: standardPackages,
    },
  };
}

// ---------- Page ----------
const PhotographyIndexPage = ({
  city: propCity,
  locality: propLocality,
  initialPackages: propPackages,
}) => {
  const router = useRouter();
  const schemaOrg = getPhotographyOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  const city = propCity || null;
  const locality = propLocality || null;
  const initialPackages = propPackages || [];

  const cityProps = {
    city,
    locality,
    photoCat: null,
    hasCityPageParam: Boolean(city),
  };

  const firePoseClickEvent = (poseCategory) => {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "pose_card_click",
      eventCategory: "pose_click",
      eventAction: "click",
      eventLabel: poseCategory,
    });
  };

  return (
    <>
      <div style={{ maxWidth: "480px", margin: "auto" }}>
        <SeoMain city={city} locality={locality} scriptTag={scriptTag} />

        {/* Banner slider */}
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
                  <Image
                    src={img}
                    alt={`Professional event photographer in India - Banner ${index + 1}`}
                    layout="responsive"
                    width={1200}
                    height={400}
                    quality={100}
                    priority={index === 0}
                    className="professional event photographer in India"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Category cards – first 6 */}
        <div className="gridContainer">
          {photoCat.slice(0, 6).map((item) => (
            <PhotoGraphyCard
              key={item.id}
              src={item.image}
              title={item.name}
              subCategory={item.subCategory}
              city={city}
              locality={locality}
              photoCat={photoCat}
              hasCityPageParam={Boolean(city)}
            />
          ))}
        </div>

        {/* Category cards – next 4 */}
        <div className="gridContainersec">
          {photoCat.slice(6, 10).map((item) => (
            <PhotoGraphyCardgrid
              key={item.id}
              src={item.image}
              title={item.name}
              subCategory={item.subCategory}
              city={city}
              locality={locality}
              photoCat={photoCat}
            />
          ))}
        </div>

        {/* Packages – SSR data pass karo */}
        <PhotographyPackageGridSlider
          title="Standard Packages"
          tagId={STANDARD_PACKAGE_TAG_ID}
          cityProps={cityProps}
          initialProducts={initialPackages}
        />

        {/* HORA info card */}
        <div className="hora-wrap">
          <div className="hora-card">
            <span className="hora-tag">Book in minutes</span>
            <h1>Professional event photographers across India</h1>

            <div className="hora-stat">
              <div className="hora-stat-item">
                <div className="hora-stat-num">1000+</div>
                <div className="hora-stat-label">Verified photographers</div>
              </div>
              <div className="hora-divider" />
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
          </div>
        </div>

        {/* Suggested poses banner */}
        <div className="suggested-poses">
          <div className="suggested-poses-section">
            <Image
              src={PhotoBanner}
              alt="Camera Holding"
              className="suggested-image"
            />
          </div>
        </div>

        {/* Pose grid */}
        <div className="poses">
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
                <Image src={pose.image} alt={pose.title} fill />
                <div className="TextBackground">
                  <p>{pose.title}</p>
                  <span className="pose-arrow">
                    <Image src={arrowIcon} alt="arrow" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <EventCapsuleBannerImage
          image={BannerImg}
          onExploreClick={() =>
            router.push(
              "https://horaservices.com/weblink-gallery?folderName=32468_6a7f09a01144665025c88d8e_9406754372&customerId=6a7f09a01144665025c88d8e&fromPanel=true"
            )
          }
        />

        <BrandBanner
          title="Excellence Backed by Happy Customers"
          items={brandItems}
        />

        <ReviewSlider reviews={photographyreviews} title="Customer Reviews" />

        <div className="keywords-box">
          <p className="keyword-text">{keywordsList.join(", ")}</p>
        </div>
      </div>
    </>
  );
};

export default PhotographyIndexPage;