"use client";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";

import axiosApi from "@/utils/axiosApi";
import { fetchWithError } from "@/utils/fetchWithError";
import fallbackImg from "@/assets/fallback-image.png";
import logo from "@/assets/new_logo_light.png";
import checkImage from "@/assets/tick.svg";
import ShareIcon from "@/assets/shareIcon.svg";
import StarIcon from "@/assets/Staricon.svg";
import hearticon from "@/assets/hearticon.svg";
import fireIcon from "@/assets/fireIcon.svg";
import SimiliarThemes from "@/assets/SimilarThemes.svg";
import pencil from "@/assets/pencil.svg";
import HowitWork from "@/assets/howitwork.jpg";
import HappyCustomerIMG from "@/assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "@/assets/GoogleRatingIMG4.png";
import SocialMediaIMG from "@/assets/ourSocialmediaIMG.png";
import TopBrandIMg from "@/assets/TpBrandsIMG.png";
import VideoClint from "@/assets/ourclientvideo.mp4";

import { BASE_URL, GET_ADDON_BY_ID } from "@/utils/apiconstants";

import FAQSection from "@/components/FAQSection";
import faqData from "@/utils/FaqData.json";
import BrandBanner from "@/components/BrandBanner";
import SimilarBoosterSlider from "@/components/Similarboosterslider";
import VideoTestimonial from "@/components/VideoTestimonial";
import AdditionalServices from "@/components/AdditionalServices";
import MakeItYoursBanner from "@/components/MakeItYoursBanner";
import WhyHoraSection from "@/components/WhyHoraSection";
import GoogleReviewsCard from "@/components/PhotoGalleryPose/GoogleReviewsCard";
import { reviewsData } from "@/utils/poselinkreviews";
import ActionButtons from "@/components/Actionbuttons";
import { filterLevelUpProducts } from "@/utils/similarProductUtils";

import "./celebrationBoosterDetails.css";

// Ideally move these to utils/apiconstants.js alongside your other endpoints
const CELEBRATION_BOOSTER_API =
  "https://horaservices.com/api/celebration-booster/celebrationBoostersList";
const BOOSTER_IMAGE_BASE_URL = "https://horaservices.com/api/uploads/";
const CATEGORY_SLUG = "celebration-boosters";
const WHATSAPP_PHONE = "917338584828";

const generateSlug = (name) =>
  name
    ?.toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

// Same tiered-discount logic used across the decoration pages
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

const SkeletonLoader = () => (
  <div
    className="skeleton-loader"
    style={{ maxWidth: "1200px", margin: "0 auto", backgroundColor: "white" }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "20px",
        paddingBottom: "20px",
        position: "relative",
      }}
      className="decDetails"
    >
      <div
        style={{
          width: "80%",
          height: "300px",
          backgroundColor: "#f0f0f0",
          margin: "0 auto",
          position: "relative",
        }}
      />
      <div
        style={{ width: "50%", paddingLeft: "20px", paddingRight: "50px" }}
        className="decDetailsRight"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "24px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: i % 2 === 0 ? "60%" : "80%",
              borderRadius: "4px",
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

function CelebrationBoosterDetails({ city, locality }) {
  const router = useRouter();
  const { productName } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [allBoosters, setAllBoosters] = useState([]);
  const [otherBoosters, setOtherBoosters] = useState([]);
  const [levelUp1000, setLevelUp1000] = useState([]);
  const [levelUp2000, setLevelUp2000] = useState([]);

  // Addon state — mirrors DecorationCatDetails exactly
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isArrowDown, setIsArrowDown] = useState(true);
  const [selectedAddOnProduct, setSelectedAddOnProduct] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [totalAmount, setTotalAmount] = useState();
  
  const cityName = router.query?.city;
  const hasCityPageParam = city ? true : false;

  const customizationRef = useRef(null);
  const similarRef = useRef(null);
  const addonRef = useRef(null);
  const reviewsRef = useRef(null);

  const brandItems = [
    { img: HappyCustomerIMG, alt: "Happy Customers", bold: "1L+HAPPY ", sub: "CUSTOMERS" },
    { img: GoogleRatingIMG, alt: "Google Rating", bold: "4.8+ GOOGLE", sub: "RATING" },
    { img: SocialMediaIMG, alt: "Social Media", bold: "OUR", sub: "SOCIAL MEDIA" },
    { img: TopBrandIMg, alt: "Top Brands", bold: "TOP BRANDS", sub: "PARTNERED" },
  ];

  useEffect(() => {
    if (!router.isReady || !productName) return;
    fetchBoosterDetails();
  }, [router.isReady, productName]);

  const fetchBoosterDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosApi.get(CELEBRATION_BOOSTER_API);

      if (response.data?.error) {
        throw new Error(
          response.data.message || "Failed to fetch celebration boosters"
        );
      }

      const list = response.data?.data || [];
      setAllBoosters(list);

      const matched = list.find(
        (item) => generateSlug(item.name) === productName
      );

      if (!matched) {
        setError("Booster not found");
        setProduct(null);
        setLoading(false);
        return;
      }

      const numericPrice = Number(matched.price);
      setDiscountInfo(getDiscountedPrice(numericPrice));
      setProduct({ ...matched, price: numericPrice });
     

      // "Similar boosters" — everything else in the same flat catalogue
      setOtherBoosters(
        list
          .filter((item) => item._id !== matched._id)
          .map((item) => {
            const p = Number(item.price);
            const { discountedPrice, discountDifference } = getDiscountedPrice(p);
            return {
              ...item,
              price: p,
              discountedPrice,
              discountDifference,
              slug: generateSlug(item.name),
            };
          })
      );

      setLoading(false);
    } catch (err) {
      setError(err.message || "Something went wrong while fetching this booster");
      setLoading(false);
    }
  };

  // "You may also like" — price-tier based, same generic util used on the
  // decoration product page (works off price + excluded id, no theme data needed)
  useEffect(() => {
    if (product?.price && otherBoosters.length > 0) {
      const { level1, level2 } = filterLevelUpProducts(
        product.price,
        otherBoosters,
        product._id
      );
      setLevelUp1000(level1);
      setLevelUp2000(level2);
    }
  }, [product, otherBoosters]);

  // Restore saved addons from sessionStorage — mirrors DecorationCatDetails
  useEffect(() => {
    if (!product?._id) return;
    try {
      const saved = sessionStorage.getItem(`booster_addons_${product._id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedAddOnProduct(parsed.selectedAddOnProduct || []);
        setItemQuantities(parsed.itemQuantities || {});
      }
    } catch (e) {
      console.error("Error restoring addons:", e);
    }
  }, [product?._id]);

  // Persist addons on every change
  useEffect(() => {
    if (!product?._id) return;
    try {
      sessionStorage.setItem(
        `booster_addons_${product._id}`,
        JSON.stringify({ selectedAddOnProduct, itemQuantities })
      );
    } catch (e) {
      console.error("Error saving addons:", e);
    }
  }, [selectedAddOnProduct, itemQuantities, product?._id]);


  const calculateTotalPrice = (productPrice) => {
    let totalPrice = Number(productPrice);
    selectedAddOnProduct.forEach((item) => {
      totalPrice += item.price * itemQuantities[item.title];
    });
    return totalPrice;
  };

  const updateTotalAmount = () => {
    let newTotalAmount = Number(product?.price || 0);
    selectedAddOnProduct.forEach((item) => {
      newTotalAmount += item.price * itemQuantities[item.title];
    });
    setTotalAmount(newTotalAmount);
  };

  useEffect(() => {
    if (product?.price) updateTotalAmount();
  }, [selectedAddOnProduct, itemQuantities, product?.price]);

  const handleAddToCart = (item) => {
    const updatedSelectedAddOnProduct = [...selectedAddOnProduct];
    const existingItemIndex = updatedSelectedAddOnProduct.findIndex(
      (addonproductItem) => addonproductItem.title === item.title
    );

    if (existingItemIndex !== -1) {
      updatedSelectedAddOnProduct[existingItemIndex].quantity += 1;
    } else {
      updatedSelectedAddOnProduct.push({ ...item, quantity: 1 });
    }

    setSelectedAddOnProduct(updatedSelectedAddOnProduct);
    setItemQuantities({
      ...itemQuantities,
      [item.title]: (itemQuantities[item.title] || 0) + 1,
    });
    updateTotalAmount();
  };

  const handleRemoveFromCart = (item) => {
    const updatedSelectedAddOnProduct = [...selectedAddOnProduct];
    const existingItemIndex = updatedSelectedAddOnProduct.findIndex(
      (addonproductItem) => addonproductItem.title === item.title
    );

    if (existingItemIndex !== -1) {
      if (updatedSelectedAddOnProduct[existingItemIndex].quantity > 1) {
        updatedSelectedAddOnProduct[existingItemIndex].quantity -= 1;
      } else {
        updatedSelectedAddOnProduct.splice(existingItemIndex, 1);
      }
    }

    const updatedQuantities = { ...itemQuantities };
    if (updatedQuantities[item.title] > 1) {
      updatedQuantities[item.title] -= 1;
    } else {
      delete updatedQuantities[item.title];
    }

    setSelectedAddOnProduct(updatedSelectedAddOnProduct);
    setItemQuantities(updatedQuantities);
    updateTotalAmount();
  };

  const handleAddToCartAndScrollBack = (item) => {
    handleAddToCart(item);
    setIsModalOpen(false);

    setTimeout(() => {
      customizationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const handleShare = () => {
    const cleanUrl = window.location.origin + window.location.pathname;
    if (navigator.share) {
      navigator.share({ title: product?.name, url: cleanUrl });
    } else {
      navigator.clipboard.writeText(cleanUrl);
      alert("Link copied!");
    }
  };

  // WhatsApp "customize / enquire" — mirrors handleCustomise in DecorationCatDetails
  const handleCustomise = (type, cityNameParam) => {
    const phoneNumber = WHATSAPP_PHONE;
    let message = `Hi, I want to know more about "${product?.name}" (Celebration Booster), can you help me`;

    if (cityNameParam) {
      message += ` for ${cityNameParam}!`;
    } else {
      message += "!";
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "Customization_WhatsApp_Button",
      eventCategory: "Booster Product Page",
      eventAction: "WhatsApp Click",
      eventLabel: "Booster Enquiry WhatsApp Button",
    });

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleCheckout = () => {
    if (!product) return;
    const totalPrice = calculateTotalPrice(product.price);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "book_now_click",
      product_name: product.name,
    });

    router.push({
      pathname: "/checkout",
      query: {
        from: window.location.pathname,
        product: JSON.stringify(product),
        orderType: "celebration-booster",
        catValue: CATEGORY_SLUG,
        selectedAddOnProduct: JSON.stringify(selectedAddOnProduct),
        itemQuantities: JSON.stringify(itemQuantities),
        totalAmount: totalPrice,
        slug: product.slug || generateSlug(product.name),
      },
    });
  };

  // Same inclusion-HTML parsing logic used on the decoration product page
  const getItemInclusion = (inclusion) => {
    if (!Array.isArray(inclusion) || inclusion.length === 0) return null;

    const htmlString = inclusion[0];
    const withoutTags = htmlString.replace(/<[^>]*>/g, "");
    const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, " ");
    const statements = withoutSpecialChars.split("<div>");
    const inclusionItems = statements.flatMap((statement) =>
      statement.split("-").filter((item) => item.trim() !== "")
    );

    return (
      <div className="inclusion-sections">
        <div className="inclusion-heading">Inclusions</div>
        <ul className="inclusion-list">
          {inclusionItems.map((item, index) => (
            <li className="inclusionstyle" key={index}>
              <Image src={checkImage} alt="check" className="inclusion-check" />
              <span className="inclusion-text">{item.trim()}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error || !product) {
    return (
      <div className="boosterNotFound">
        <h2>{error || "Booster not found"}</h2>
      </div>
    );
  }

  const imageUrl = product.featured_image
    ? `${BOOSTER_IMAGE_BASE_URL}${product.featured_image}`
    : fallbackImg;

  const boosterUrl =
    locality && cityName
      ? `https://horaservices.com/${cityName}/${locality}/${CATEGORY_SLUG}/product/${generateSlug(product.name)}`
      : cityName
      ? `https://horaservices.com/${cityName}/${CATEGORY_SLUG}/product/${generateSlug(product.name)}`
      : `https://horaservices.com/${CATEGORY_SLUG}/product/${generateSlug(product.name)}`;

  const breadcrumbHref =
    city && locality
      ? `/${city.toLowerCase()}/${locality.toLowerCase()}/${CATEGORY_SLUG}`
      : city
      ? `/${city.toLowerCase()}/${CATEGORY_SLUG}`
      : `/${CATEGORY_SLUG}`;

  return (
    <div className="App" style={{ backgroundColor: "white" }}>
      <Head>
        <title>
          {locality && cityName
            ? `${product.name} | Celebration Boosters in ${locality}, ${cityName}`
            : cityName
            ? `${product.name} | Celebration Boosters in ${cityName}`
            : `${product.name} | Celebration Boosters by Hora Services`}
        </title>

        <meta
          name="description"
          content={
            locality && cityName
              ? `${product.name} from Hora Services — add extra magic to your event in ${locality}, ${cityName}, starting at just ₹${product.price}. Perfect add-on for birthdays, weddings, and celebrations of all kinds!`
              : cityName
              ? `${product.name} from Hora Services — add extra magic to your event in ${cityName}, starting at just ₹${product.price}. Perfect add-on for birthdays, weddings, and celebrations of all kinds!`
              : `${product.name} from Hora Services — add extra magic to your event, starting at just ₹${product.price}. Perfect add-on for birthdays, weddings, and celebrations of all kinds!`
          }
        />
        <meta
          name="keywords"
          content={
            locality && cityName
              ? `${product.name}, celebration booster in ${locality} ${cityName}, ${product.name} price`
              : cityName
              ? `${product.name}, celebration booster in ${cityName}, ${product.name} price`
              : `${product.name}, celebration booster, ${product.name} price, Hora Services`
          }
        />
        <meta
          property="og:title"
          content={
            locality && cityName
              ? `${product.name} | Celebration Boosters in ${locality}, ${cityName} by Hora Services`
              : cityName
              ? `${product.name} | Celebration Boosters in ${cityName} by Hora Services`
              : `${product.name} | Celebration Boosters by Hora Services`
          }
        />
        <meta
          property="og:description"
          content={
            locality && cityName
              ? `Book ${product.name} in ${locality}, ${cityName} by Hora Services. Add extra magic to your event.`
              : `Book ${product.name} by Hora Services. Add extra magic to your event.`
          }
        />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:alt" content={`Celebration booster - ${product.name}`} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link
          rel="icon"
          href="https://horaservices.com/api/uploads/logo-icon.png"
          type="image/x-icon"
        />
        <meta property="og:url" content={boosterUrl} />
        <meta property="og:type" content="website" />
      </Head>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="decDetails">
          <div className="decDetailsLeft">
            <div style={{ position: "relative" }}>
              <Image
                src={imageUrl}
                alt={`celebration booster ${product.name} ${product.price}`}
                style={{ width: "100%", height: "auto" }}
                width={300}
                height={300}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 3,
                  right: 3,
                  borderRadius: "50%",
                  padding: 10,
                }}
              >
                <span style={{ color: "rgba(157, 74, 147, 0.6)", fontWeight: "600" }}>
                  <Image src={logo} alt="Hora Services" className="hora-watermark-image" />
                </span>
              </div>
            </div>
          </div>

          <div className="decDetailsRight">
            <div
              style={{
                padding: "clamp(8px, 2.5vw, 10px) clamp(8px, 2.5vw, 10px) 0",
              }}
            >
              <div className="breadcrumb-row">
                <h2 className="breadcrumb-text">
                  <a className="breadcrumb-link" href="/">
                    Home
                  </a>
                  {" > "}
                  <a className="breadcrumb-link" href={breadcrumbHref}>
                    Celebration Boosters
                  </a>
                  {" > "}
                </h2>
              </div>

              <h1 className="product-title">{product.name}</h1>

              <div className="price-share-row">
                <div className="pro-details-price">
                  <p className="product-price">₹ {product.price}</p>
                  <p className="product-old-price">
                    ₹ {Math.floor(discountInfo?.discountedPrice)}
                  </p>
                  <div className="product-discount">
                    ₹ {Math.floor(discountInfo?.discountDifference || 0)} off
                  </div>
                </div>
                <div className="share-btn" onClick={handleShare}>
                  <Image src={ShareIcon} alt="share" className="share-icon-img" />
                </div>
              </div>

             

          
            </div>
    {/* <div className="addon-container" ref={customizationRef}>
                <AddOnsList
                  selectedAddOnProduct={selectedAddOnProduct}
                  itemQuantities={itemQuantities}
                  showAddOnmodal={showAddOnmodal}
                  pencil={pencil}
                />
              </div> */}
            <div style={{ padding: "0px 10px" }}>
              {getItemInclusion(product.inclusion)}

           
            </div>
            {/* <div ref={addonRef}>
              <AddonModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                addOnProducts={addonData}
                itemQuantities={itemQuantities}
                onAdd={handleAddToCartAndScrollBack}
                onRemove={handleRemoveFromCart}
              />
            </div> */}

            <div ref={similarRef}>
              <SimilarBoosterSlider
                title="Similar Boosters"
                data={otherBoosters}
                showDiscount={true}
                imageSize={{ width: 120, height: 120 }}
                city={city}
                hasCityPageParam={hasCityPageParam}
                locality={locality}
                catValue={CATEGORY_SLUG}
                icon={StarIcon}
                sparkleIcon={SimiliarThemes}
              />
            </div>

            {levelUp1000.length > 0 && (
              <SimilarBoosterSlider
                title="You May Also Like This"
                data={levelUp1000}
                showDiscount={true}
                city={city}
                hasCityPageParam={hasCityPageParam}
                locality={locality}
                catValue={CATEGORY_SLUG}
                icon={StarIcon}
                sparkleIcon={hearticon}
              />
            )}

            {levelUp2000.length > 0 && (
              <SimilarBoosterSlider
                data={levelUp2000}
                showDiscount={true}
                city={city}
                hasCityPageParam={hasCityPageParam}
                locality={locality}
                catValue={CATEGORY_SLUG}
              />
            )}

            <WhyHoraSection />

            <div ref={reviewsRef}>
              <GoogleReviewsCard reviews={reviewsData} />
            </div>

            <BrandBanner title="Excellence Backed by Happy Customers" items={brandItems} />

            <VideoTestimonial videoSrc={VideoClint} />

            <div className="decorke-celebrate-banner">
              <Image
                src={HowitWork}
                alt="How Celebration Boosters Work"
                className="decorke-banner-img"
              />
            </div>

            <AdditionalServices />

            <div className="tab-section-details-productpage">
              <FAQSection faqData={faqData} />
            </div>
          </div>
        </div>

        <div className="confirm-button-wrapper">
          <p style={{ fontWeight: "bold", marginBottom: "0px", color: "black" }}>
            Total: ₹ {calculateTotalPrice(Number(product?.price))}
          </p>
          <button className="confirm-button" onClick={handleCheckout}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default CelebrationBoosterDetails;