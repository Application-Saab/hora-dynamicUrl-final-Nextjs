import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import photographyAddOns from "@/utils/photographyAddOns.json";
import { faqData } from '@/utils/photographyFAQData.js'
import { getPhotographyOrganizationSchema } from "@/utils/schema";
import { useParams } from "next/navigation";
import ShareIcon from "@/assets/shareIcon.svg";
import PROFESSIONALPHOTOGRAPHERS from "@/assets/professionalPhoto.png";
import SECURESTORAGE from "@/assets/secureStorage.png";
import SUPPORT from "@/assets/support.png";
import Brand from "@/assets/Brand.png";
import HowitWork from "@/assets/howitworkphoto.jpg";
import HappyCustomerIMG from "@/assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "@/assets/GoogleRatingIMG4.png";
import SocialMediaIMG from "@/assets/ourSocialmediaIMG.png";
import TopBrandIMg from "@/assets/TpBrandsIMG.png";
import checkImage from "@/assets/tick.svg";
import logo from "@/assets/new_logo_light.png";
import "./productDetails.css";
import {
  BASE_URL,
} from "@/utils/apiconstants";
import FAQSection from '@/components/FAQSection';
import BrandBanner from '@/components/BrandBanner';
import AdditionalServices from '@/components/AdditionalServices';
import Photographyslider from '@/components/photoslidersection';
import { SeoWork } from '@/utils/photoGraphyHead';
import { GET_ADDON_BY_ID } from '../../../../utils/apiconstants'
import pencil from "@/assets/pencil.svg";
import AddonModal from '@/components/AddonModal';
import AddOnsList from '@/components/AddOnsList';
const SkeletonLoader = () => {
  return (
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
          style={{ width: "50%", textAlign: "center" }}
          className="decDetailsLeft"
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
        </div>
        <div
          style={{ width: "50%", paddingLeft: "20px", paddingRight: "50px" }}
          className="decDetailsRight"
        >
          <div
            style={{
              height: "20px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "60%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "30px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "40%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "20px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "80%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "30px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "60%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "20px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "60%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "50px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "60%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "20px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "60%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "50px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "60%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "50px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "100%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
          <div
            style={{
              height: "50px",
              backgroundColor: "#f0f0f0",
              marginBottom: "12px",
              width: "100%",
              borderRadius: "4px",
            }}
            className="decDetailsRightInner"
          />
        </div>
      </div>
    </div>
  );
};
const ProductDetails = () => {
  const schemaOrg = getPhotographyOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  const router = useRouter();
  const { query } = useRouter();
  const productId = query.id;
  const { city, locality, catValue } = router.query;
  const { product } = router.query;
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isArrowDown, setIsArrowDown] = useState(false);
  const [itemQuantities, setItemQuantities] = useState({});
  const [selectedAddOnProduct, setSelectedAddOnProduct] = useState([]);
  const hasCityPageParam = city ? true : false;
  const addonRef = useRef(null);
  const customizationRef = useRef(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const similarRef = useRef(null);
  const [addonData, setAddonData] = useState([]);
  const [addonIds, setAddonIds] = useState([]);

  const brandItems = [
    { img: HappyCustomerIMG, alt: "Happy Customers", bold: "1L+ HAPPY", sub: "CUSTOMERS" },
    { img: GoogleRatingIMG, alt: "Google Rating", bold: "4.8+ GOOGLE", sub: "RATING" },
    { img: SocialMediaIMG, alt: "Social Media", bold: "OUR", sub: "SOCIAL MEDIA" },
    { img: TopBrandIMg, alt: "Top Brands", bold: "TOP BRANDS", sub: "PARTNERED" },
  ];

  const calculateTotalPrice = (productPrice) => {
    let totalPrice = Number(work?.price || productPrice);

    selectedAddOnProduct.forEach(item => {
      totalPrice += item.price * itemQuantities[item.title];
    });
    return totalPrice;
  };


  const showAddOnmodal = () => {
    setIsModalOpen((prev) => !prev);
    setIsArrowDown((prev) => !prev);

    setTimeout(() => {
      addonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  const handleAddToCartAndScrollBack = (item) => {
    handleAddToCart(item);

    setIsModalOpen(false);

    setTimeout(() => {
      customizationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };
  const handleAddToCart = (item) => {
    const updatedSelectedAddOnProduct = [...selectedAddOnProduct];
    const existingItemIndex = updatedSelectedAddOnProduct.findIndex(addonproductItem => addonproductItem.title === item.title);

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

  };



  const handleRemoveFromCart = (item) => {
    const updatedSelectedAddOnProduct = [...selectedAddOnProduct];
    const existingItemIndex = updatedSelectedAddOnProduct.findIndex(addonproductItem => addonproductItem.title === item.title);

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

  };



 const getItemInclusion = (inclusion) => {
    if (!Array.isArray(inclusion) || inclusion.length === 0) {
      return null;
    }
    const htmlString = inclusion[0];
    const withoutTags = htmlString.replace(/<[^>]*>/g, ""); // Remove HTML tags
    const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, " "); // Replace &# sequences with space
    const statements = withoutSpecialChars.split("<div>");
    const inclusionItems = statements.flatMap((statement) =>
      statement.split("-").filter((item) => item.trim() !== "")
    );
  const inclusionList = inclusionItems.map((item, index) => (
      <li key={index} className="inclusionstyle">
        <Image src={checkImage} alt="Info" />
        {item.trim()}
      </li>
    ));
    return (
      <div className="inclusion-section">
        <div className="inclusion-heading">
          Inclusions
        </div>

        <ul className="inclusion-list">
          {inclusionList}
        </ul>
      </div>
    );
  };


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
  const getAddonTotalPrice = () => {
    let addonTotal = 0;

    selectedAddOnProduct.forEach((item) => {
      const qty = itemQuantities[item.title] || 0;
      addonTotal += Number(item.price) * qty;
    });

    return addonTotal;
  };

  const getFinalAdvanceAmount = () => {
    const productAdvance = Number(work?.advance_amount || 0); // Y
    const addonTotal = getAddonTotalPrice(); // Z
    const addonAdvance = addonTotal * 0.35;

    return Math.round(productAdvance + addonAdvance);
  };


  const sendToCheckoutPage = (product) => {
    const totalPrice = calculateTotalPrice(product.price);
    const advanceAmount = getFinalAdvanceAmount();
    const balanceAmount = totalPrice - advanceAmount;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "book_now_click",
      product_name: product.name,
    });

    router.push({
      pathname: '/photography-checkout',
      query: {
        from: window.location.pathname,
        product: JSON.stringify(product),
        ProductPrice: product.discountedPrice || product.price,
        selectedAddOnProduct: JSON.stringify(selectedAddOnProduct),
        itemQuantities: JSON.stringify(itemQuantities),
        totalAmount: totalPrice,

        // ✅ NEW (IMPORTANT)
        advanceAmount: advanceAmount,
        balanceAmount: balanceAmount,

        duration: work?.duration,
      }
    });
  };






  const getMappedCatValue = (slug) => {
    const map = {
      "Engagement-Photography": "Engagement-Photography",
      "  Wedding-Photography": "  Wedding-Photography",
      " Anniversary-Photography": " Anniversary-Photography",
      " Birthday-Photography": "Birthday-Photography",
      "   House-warming-Photography": "   House-warming-Photography",
      " Naming-ceremony-Photography": "Naming-ceremony-Photography",
      " Baby-Shower-Photography": " Baby-Shower-Photography",
      " Bachelorette-Photography": " Bachelorette-Photography",
      "  Maternity-Photography": "  Maternity-Photography",
      " New-Born-Baby-Photography": " New-Born-Baby-Photography"
    };
    return map[slug] || slug;
  };
  useEffect(() => {
    if (!productId) return;

    const fetchProductAndSimilar = async () => {
      try {
        setLoading(true);

        // ✅ SINGLE API CALL
        const res = await axios.get(
          `${BASE_URL}/api/photography/details/${productId}`
        );

        const data = res.data?.data;
        if (!data) throw new Error("No product found");
        setAddonIds(data?.addons)

        const { discount, discountedPrice, discountDifference } =
          getDiscountedPrice(Number(data.price));

        const formattedProduct = {
          ...data,
          discount,
          discountedPrice,
          discountDifference,
          advance_amount: Number(data.advance_amount || 0),
        };

        setWork(formattedProduct);

        // ✅ Fetch similar products
        const tagId = data?.tag?.[0]?._id;
        if (tagId) {
          const similarRes = await axios.get(
            `${BASE_URL}/api/photography/searchByTag/${tagId}`
          );

          const filteredProducts =
            (similarRes.data?.data || []).filter(
              (p) => p._id !== productId
            );

          setSimilarProducts(filteredProducts);
        }
      } catch (error) {
        console.error(error);
        setWork(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndSimilar();
  }, [productId]);


  useEffect(() => {
    if (!addonIds || addonIds.length === 0) return; // wait until addonIds is available

    const getAddons = async () => {
      try {
        const query = new URLSearchParams();
        addonIds.forEach(id => {
          if (id) query.append("ids", id);
        });

        if ([...query].length === 0) return; // no valid IDs

        const url = `${BASE_URL}${GET_ADDON_BY_ID}?${query.toString()}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.message || "Failed to fetch addons");
        }

        setAddonData(data.data || []);
      } catch (error) {
        console.error("Error fetching addons:", error);
      }
    };

    getAddons();
  }, [addonIds]);
  const handleShare = async () => {
    if (!work?._id || typeof window === "undefined") return;

    const cleanPath = router.asPath.split("?")[0];
    const shareUrl = `${window.location.origin}${cleanPath}?id=${work._id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: work?.name || "Product",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied!");
      }
    } catch (err) {
      console.log("Share cancelled");
    }
  };
  if (loading) {
    return <SkeletonLoader />
  }

  if (!work) return <div className="photodetails-loading">Work not found</div>;

  return (
    <div>
      <SeoWork city={city} work={work} scriptTag={scriptTag} />

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div className="decDetails">
          <div
            className="decDetailsLeft"
          >
            <div >
              <Image
                src={
                  work.featured_image
                    ? `https://horaservices.com/api/uploads/compressed_webp/${work.featured_image.split(".")[0]}.webp`
                    : "/default.jpg"
                }
                alt={`${work?.name || "Product"} image`}
                style={{ width: "100%", height: "auto" }}
                className="photoImage"
                width={400}
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
                <span
                  style={{
                    color: "rgba(157, 74, 147, 0.6)",
                    fontWeight: "600",
                  }}
                >
                  <Image
                    src={logo}
                    alt="Hora Services"
                    className="hora-watermark-image"
                  />
                </span>
              </div>
            </div>
          </div>
          <div
            className="decDetailsRight"
          >
            <div
              style={{
                padding: "clamp(8px, 2.5vw, 10px) clamp(8px, 2.5vw, 10px) 0"
              }}
            >
              <div className="breadcrumb-row">
                <h2 className="breadcrumb-text">
                  <a
                    style={{ color: "rgb(157, 74, 147)", textDecoration: "none", fontSize: "13px" }}
                    href="/photography-page"
                  >
                    Home
                  </a>
                  {" > "}

                  <a
                    className="breadcrumb-link"
                    href={`/photography-page/${catValue}`}
                  >
                    {catValue.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </a>

                  {" > "}
                </h2>

                <button
                  onClick={() => {
                    similarRef?.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="view-similar-btn"
                >
                  View Similar
                </button>
              </div>


              <h1 className="product-title">
                {work.name}
              </h1>

              <div className="price-share-row">
                <div className="pro-details-price">
                  <p className="product-price">
                    ₹{work.price}
                  </p>
                  <p className="product-old-price">₹ {work.discountedPrice ? Math.floor(Number(work.discountedPrice).toFixed(2)) : Math.floor(Number(work.price).toFixed(2))}</p>
                  <div className="product-discount">₹ {Math.floor(work.discountDifference)} off</div>
                </div>
                  <div className="share-btn" onClick={handleShare}>
                  <Image
                    src={ShareIcon}
                    alt="share"
                    className="share-icon-img"
                  />
                </div>
                </div>
              
            
              <div className='addon-container' ref={customizationRef}>


                {/* <div className="photodetails-inclusions">
                  {selectedAddOnProduct.length > 0 && (
                    <>

                      <h1 className="photodetalis-heading">
                        Add-ons
                      </h1>
                      <span
                        onClick={showAddOnmodal}
                        style={{ marginLeft: "6px", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                      >
                        <Image
                          src={pencil} // replace with your image path
                          alt="Addons"
                          className="addon-icon"
                        />
                      </span>
                      {selectedAddOnProduct.map((item, index) => (
                        <li key={index}>
                          <div className="itemline">
                            {index + 1}. {item.title} = ₹ {item.price} x {itemQuantities[item.title]} = ₹ {item.price * itemQuantities[item.title]}

                          </div>

                        </li>
                      ))}

                    </>
                  )}
                </div> */}
                <AddOnsList
  selectedAddOnProduct={selectedAddOnProduct}
  itemQuantities={itemQuantities}
  showAddOnmodal={showAddOnmodal}
  pencil={pencil}
/>
              </div>
            </div>
            </div>
          <div className="photodetails-inclusions">
            {getItemInclusion(work.inclusion)}
            <p className="work-duration">
              <b className="Duration">Duration:</b> {work?.event_duration || work?.duration || "Duration not available"}
            </p>
          </div>
    <AddonModal 
    isopen={isModalOpen}
    setIsOpen={setIsModalOpen}
    addOnProducts={addonData}
    itemQuantities={itemQuantities}
    onAdd={handleAddToCartAndScrollBack}
    onRemove={handleRemoveFromCart}
        />

     
          <div className="whyHoraSec">
            <h2 className="whyHoraHeading">Why Hora Photography</h2>
            <div className="whyHoraSecInner">
              <div className="whyHoraSecBox">
                <Image src={PROFESSIONALPHOTOGRAPHERS} alt="buy-now" />
                <p className="whyHoraSubheading">PROFESSIONAL PHOTOGRAPHERS</p>
              </div>
              <div className="whyHoraSecBox">
                <Image src={SECURESTORAGE} alt="buy-now" />
                <p className="whyHoraSubheading">SECURE STORAGE</p>
              </div>
              <div className="whyHoraSecBox">
                <Image src={SUPPORT} alt="buy-now" />
                <p className="whyHoraSubheading">27/7 SUPPORT</p>
              </div>
            </div>
          </div>

          <div ref={similarRef}>
            <Photographyslider
              title="Similar Photography"
              data={similarProducts}
              showDiscount={true}
              imageSize={{ width: 120, height: 120 }}
              city={city}
              hasCityPageParam={hasCityPageParam}
              locality={locality}
              catValue={getMappedCatValue(router.query.catValue)}
            />
          </div>


          <div className="decorke-celebrate-banner">
            <Image
              src={HowitWork}
              alt="Customize Your Celebration"
              className="decorke-banner-img"
            />
          </div>

          <div className="media-section">
            <h2 className="media-heading">Hora in Media</h2>
            <div className="media-logos">
              <Image src={Brand} alt="Hora Featured Media" className="media-logos-img" />
            </div>
          </div>

          <BrandBanner title="Excellence Backed by Happy Customers" items={brandItems} />

          <AdditionalServices />

          <div className="tab-section-details-productpage">
            <FAQSection faqData={faqData} />
          </div>
          </div>
          <div className="confirm-button-wrapper">


            <p style={{ fontWeight: "bold", marginBottom: "0px", color: "black" }}>Total: ₹ {calculateTotalPrice(Number(work?.price))}</p>

            <button className="confirm-button" onClick={() => sendToCheckoutPage(work)}>Continue</button>

          </div>
        </div>
      </div>
      );
};

      export default ProductDetails;
