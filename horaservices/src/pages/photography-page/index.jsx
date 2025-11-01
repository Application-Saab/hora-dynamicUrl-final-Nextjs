import Head from "next/head";
import Image from 'next/image'
import { useRouter } from 'next/router';
import { getPhotographyOrganizationSchema } from "../../utils/schema";
import './photo.css'
import pose1 from "@/assets/poseimages/pose1.png"
import pose2 from "@/assets/poseimages/pose2.png"
import pose3 from "@/assets/poseimages/pose3.jpg"
import pose4 from "@/assets/poseimages/pose4.jpg"
import pose5 from "@/assets/poseimages/pose5.jpg"
import pose6 from "@/assets/poseimages/pose6.jpg"
import pose7 from "@/assets/poseimages/pose7.png"
import pose9 from "@/assets/poseimages/pose9.jpg"
import pose10 from "@/assets/poseimages/pose10.jpg"
import pose11 from "@/assets/poseimages/pose11.png"
import pose12 from "@/assets/poseimages/pose12.jpg"
import pose13 from "@/assets/poseimages/pose13.png"
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
import PhotographysliderSection from '@/components/photographysliderSection';
import { photoCat } from "@/utils/photoCategories.js";
import BrandBanner from '@/components/BrandBanner';
import ReviewSlider from '@/components/ReviewSection';
const index = () => {

  const router = useRouter();
  const schemaOrg = getPhotographyOrganizationSchema();
const scriptTag = JSON.stringify(schemaOrg);
 let { city } = router.query;
let {locality} = router.query;

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
                : `    📸 Capture Every Moment, Forever! ✨
 Welcome to HORA Photography — where every click tells your story! 😊 Whether it's a dreamy wedding, a cute baby welcome, or a rocking birthday bash 🎉, our professional photographers are here to make your moments look as magical as they felt. Specialized packages for:
Weddings Photoshoot👰‍♀️; 
Maternity photoshoot;
Baby Shoots 🤰👼; 
Birthdays photoshoot; 
Newborn photography;
Couples photography
Anniversaries photographer 🎂❤️; 
Newborn photography
Housewarming & Corporate Events; 
Pre wedding photoshoot & Couple Photographer; 
Freelancer Photographer; Photographer near me, `
       
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
          {photoCat.slice(0, 6).map((item) => (
            <PhotoGraphyCard
              key={item.id}
              src={item.image}
              title={item.name}
              subCategory={item.subCategory}
              city={city}
              locality={locality}   
              photoCat={photoCat}   
              hasCityPageParam={true}
            />
          ))}
        </div>



        <PhotographysliderSection
          title="Standard Packages"
          tagId="66c96b4e22ed47b72117e09a"
           city={city}              
      locality={locality}        
      photoCat={photoCat}       
      hasCityPageParam={true}
        />


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
      hasCityPageParam={true} 
            />
          ))}
        </div>



<div class="suggested-poses">
          <div class="suggested-poses-section">
            <Image src={PhotoBanner} alt="Camera Holding" class="suggested-image" />
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
              href="https://horaservices.com/photo-gallery?folderName=naming%20ceremony%20weblink&customerId=64137625549b58e3dc39a685"
              className="pose-card"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => firePoseClickEvent("Naming Ceremony")}
            >
              <Image src={pose7} alt="Naming Ceremony" />
              <div className="TextBackground"><p>Naming Ceremony</p></div>
            </a>
            <a
              href="https://horaservices.com/photo-gallery?folderName=new%20born%20&customerId=64137625549b58e3dc39a685"
              className="pose-card"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => firePoseClickEvent("New Born Baby")}
            >
              <Image src={pose9} alt="New Born Baby" />
              <div className="TextBackground"><p>New Born Baby</p></div>
            </a>
            <a
              href="https://horaservices.com/photo-gallery?folderName=engagement weblink&customerId=64137625549b58e3dc39a685"
              className="pose-card"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => firePoseClickEvent("Engagement")}
            >
              <Image src={pose10} alt="Engagementr" />
              <div className="TextBackground"><p>Engagement</p></div>
            </a>
            <a
              href="https://horaservices.com/photo-gallery?folderName=anniversary%20poses%20web%20link&customerId=64137625549b58e3dc39a685"
              className="pose-card"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => firePoseClickEvent("Anniversary")}
            >
              <Image src={pose11} alt="Anniversary" />
              <div className="TextBackground"><p>Anniversary</p></div>
            </a>
            <a
              href="https://horaservices.com/photo-gallery?folderName=House warming weblink&customerId=64137625549b58e3dc39a685"
              className="pose-card"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => firePoseClickEvent("House warming")}
            >
              <Image src={pose12} alt="House warming" />
              <div className="TextBackground"><p>House warming</p></div>
            </a>
            <a
              href="https://horaservices.com/photo-gallery?folderName=bacherrolerate&customerId=64137625549b58e3dc39a685"
              className="pose-card"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => firePoseClickEvent("Bachelorate")}
            >
              <Image src={pose13} alt="Bachelorate" />
              <div className="TextBackground"><p>Bachelorate</p></div>
            </a>

          </div>
        </div>

     

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