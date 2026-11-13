import Head from "next/head";
import Image from "next/image";
import FlowerGrid from "@/components/FlowerlandingpageGrid";
import Banner from "@/components/Banner";
import { flowerThemes, FLOWER_CATEGORY_SLUG } from "@/utils/Flowerdecorationdata";
import FlowerBannerImg from "@/assets/flower/flower-banner.webp";
import whatsappbanner from "@/assets/Whatsaap_banner.webp";
import whatsappIcon from "@/assets/whatsapp-icon.png";
import { trackWAClicks } from "@/utils/storeWhatsappClicks";
import { MARKETING_EVENTS, trackWhatsAppButtonClick } from "@/utils/marketingEvents";
import flowerCollageImg from "@/assets/flower/flowerCollageImg.jpg";
import whypeople1 from "../../assets/whypeople1.jpg";
import whypeople2 from "../../assets/whypeople2.jpg";
import whypeople3 from "../../assets/whypeople3.jpg";
import whypeople4 from "../../assets/whypeople4.jpg";
import "./flowerdecoration.css";
import BrandBanner from "@/components/BrandBanner";
import HappyCustomerIMG from "../../assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "../../assets/GoogleRatingIMG4.png";
import SocialMediaIMG from "../../assets/ourSocialmediaIMG.png";
import TopBrandIMg from "../../assets/TpBrandsIMG.png";
import BrandBannerIMG from "../../assets/BrandBannerIMG.webp";
import { balloonreviewsproduct } from "@/utils/balloonReviews";
import GoogleReviewsCard from "@/components/PhotoGalleryPose/GoogleReviewsCard";
import WhyPeopleLoveUs from "@/components/WhyPeopleLoveUs";
import { stats, brandItems } from "@/utils/whylovebranddata"
const SITE = "https://horaservices.com";
const slugify = (v) => String(v || "").trim().toLowerCase().replace(/\s+/g, "-");

const FlowerDecorationLanding = ({ city = "", locality = "" }) => {
  const citySlug = city ? slugify(city) : "";
  const localitySlug = locality ? slugify(locality) : "";

  const canonicalUrl =
    citySlug && localitySlug
      ? `${SITE}/${citySlug}/${localitySlug}/${FLOWER_CATEGORY_SLUG}`
      : citySlug
        ? `${SITE}/${citySlug}/${FLOWER_CATEGORY_SLUG}`
        : `${SITE}/${FLOWER_CATEGORY_SLUG}`;

  const cityName = city ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() : "";
  const title = cityName
    ? `Flower Decoration in ${cityName} for Haldi, Wedding & More | HORA`
    : "Flower Decoration for Haldi, Wedding, Reception & More | HORA";
  const description =
    "Book beautiful flower decoration for haldi, mehndi, sangeet, engagement, wedding, reception and more.";

  const waMessage = cityName
    ? `Hi, how can we help in your flower decoration services for ${cityName}`
    : "Hi, how can we help in your flower decoration services";
  const waLink = `https://wa.me/917338584828?text=${encodeURIComponent(waMessage)}`;

  return (
  <div style={{ maxWidth: "480px",  margin: "auto", padding: "clamp(12.22px, 3.82vw, 18.32px) clamp(7.33px, 2.29vw, 10.99px) clamp(19.08px, 6.11vw, 29.31px)", }}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Head>

      <div className="fd-banner">
        <Image
          src={FlowerBannerImg}
          alt="Flower decoration for haldi, wedding and reception"
          priority
          quality={100}
        />
      </div>

      <FlowerGrid
        title="Popular Flower Decoration"
        subtitle="Choose from our stunning flower decoration themes"
        themes={flowerThemes}
        city={city}
        locality={locality}
        categorySlug={FLOWER_CATEGORY_SLUG}
      />

      <a
        className="wa-banner"
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat now on WhatsApp"
        onClick={() => {
          trackWhatsAppButtonClick(
            MARKETING_EVENTS.WHATSAPP_BUTTONS.WE_ARE_HERE_BANNER_DECORATION,
            {
              button_name: "Chat Now on Whatsapp",
              button_type: "happy_to_help_banner_btn",
              page_path: window.location.pathname,
            },
          );
          trackWAClicks();
        }}
      >
        <Banner image={whatsappbanner} alt="Your Celebrations, Our Commitment" border="1px solid #599911" />
        <span className="wa-banner__btn">
          <Image src={whatsappIcon} alt="WhatsApp – chat with HORA for flower decoration booking" width={24} height={24} className="wa-banner__icon" />
          <span>Chat Now on WhatsApp</span>
        </span>
      </a>

            {/* ===== Real Flower Decoration collage ===== */}
      <section className="fc-section">
        <h2 className="fc-title">Real Flower Decoration</h2>
        <p className="fc-sub">
          Make every celebration unforgettable with stunning flower decorations
        </p>

        <Image
          src={flowerCollageImg}
          alt="Real flower decoration setups for haldi, mehndi, wedding, car and first night"
          className="fc-image"
          sizes="(max-width: 480px) 100vw, 480px"
        />
      </section>
       <WhyPeopleLoveUs stats={stats} />
       <section className="BabyShowerBanner">
        <Image
          src={BrandBannerIMG}
          alt="HORA – trusted brand for balloon and flower decoration at home"
          width={1200}
          height={400}
          className="decorationBanner-image"
        />
      </section>
             <BrandBanner
        title="Excellence Backed by Happy Customers"
        items={brandItems}
      />
      <div  style={{ margin: " 10px 0px" }}>
        <GoogleReviewsCard reviews={balloonreviewsproduct} />
      </div>
    </div>
  );
};

export default FlowerDecorationLanding;