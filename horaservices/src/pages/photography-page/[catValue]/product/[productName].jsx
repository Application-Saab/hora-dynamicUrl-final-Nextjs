// pages/photography-page/[catValue]/product/[productName].jsx
// (city / locality wrappers me bhi same props pass karo)

import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { faqData } from "@/utils/photographyFAQData.js";
import { getPhotographyOrganizationSchema } from "@/utils/schema";
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
import { BASE_URL, GET_ADDON_BY_ID } from "@/utils/apiconstants";
import FAQSection from "@/components/FAQSection";
import BrandBanner from "@/components/BrandBanner";
import AdditionalServices from "@/components/AdditionalServices";
import PhotographySimilarSlider from "@/components/PhotographySimilarSlider";
import { SeoWork } from "@/utils/photoGraphyHead";
import fallbackImg from "@/assets/fallback-image.png";
import pencil from "@/assets/pencil.svg";
import AddonModal from "@/components/AddonModal";
import AddOnsList from "@/components/AddOnsList";
import Categorythemeselector from "@/components/Categorythemeselector";
import { fetchWithError } from "@/utils/fetchWithError";
import axiosApi from "@/utils/axiosApi";

// ---------- helpers ----------
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

const getMappedCatValue = (slug) => {
  if (!slug) return slug;
  const map = {
    "Engagement-Photography": "Engagement-Photography",
    "Wedding-Photography": "Wedding-Photography",
    "Anniversary-Photography": "Anniversary-Photography",
    "Birthday-Photography": "Birthday-Photography",
    "House-warming-Photography": "House-warming-Photography",
    "Naming-ceremony-Photography": "Naming-ceremony-Photography",
    "Baby-Shower-Photography": "Baby-Shower-Photography",
    "Bachelorette-Photography": "Bachelorette-Photography",
    "Maternity-Photography": "Maternity-Photography",
    "New-Born-Baby-Photography": "New-Born-Baby-Photography",
  };
  return map[slug] || slug;
};

async function fetchAddonsByIds(ids = []) {
  if (!ids?.length) return [];
  const q = new URLSearchParams();
  ids.forEach((id) => id && q.append("ids", id));
  if (![...q].length) return [];
  const res = await axiosApi.get(`${BASE_URL}${GET_ADDON_BY_ID}?${q}`);
  return res.data?.data || [];
}

async function fetchThemesByIds(ids = []) {
  if (!ids?.length) return [];
  const q = new URLSearchParams();
  ids.forEach((id) => id && q.append("ids", id));
  if (![...q].length) return [];
  const res = await axiosApi.get(
    `${BASE_URL}/api/photography-theme/get?${q}`
  );
  return res.data?.data || [];
}

// ---------- SSR ----------
export async function getServerSideProps(context) {
  const { catValue, city, locality, productName } = context.params || {};
  const query = context.query || {};

  const productId = query.id || null;
  const finalCity = city || query.city || null;
  const finalLocality = locality || query.locality || null;
  const finalCatValue = catValue || query.catValue || null;

  let work = null;
  let similarProducts = [];
  let addonData = [];
  let themeData = [];
  let error = null;

  if (productId) {
    try {
      const res = await axiosApi.get(
        `${BASE_URL}/api/photography/details/${productId}`
      );
      const data = res.data?.data;

      if (data) {
        const { discount, discountedPrice, discountDifference } =
          getDiscountedPrice(Number(data.price));

        work = {
          ...data,
          discount,
          discountedPrice,
          discountDifference,
          advance_amount: Number(data.advance_amount || 0),
        };

        const tagId = data?.tag?.[0]?._id;
        if (tagId) {
          try {
            const similarRes = await axiosApi.get(
              `${BASE_URL}/api/photography/searchByTag/${tagId}`
            );
            similarProducts = (similarRes.data?.data || []).filter(
              (p) => p._id !== productId
            );
          } catch (e) {
            console.error("SSR similar:", e.message);
          }
        }

        try {
          addonData = await fetchAddonsByIds(data?.addons || []);
        } catch (e) {
          console.error("SSR addons:", e.message);
        }

        try {
          themeData = await fetchThemesByIds(data?.ThemesId || []);
        } catch (e) {
          console.error("SSR themes:", e.message);
        }
      } else {
        error = "No product found";
      }
    } catch (err) {
      console.error("SSR product:", err.message);
      error = err.message;
    }
  }

  return {
    props: {
      initialWork: work,
      initialSimilar: similarProducts,
      initialAddons: addonData,
      initialThemes: themeData,
      productId: productId || null,
      city: finalCity,
      locality: finalLocality,
      catValue: finalCatValue,
      productName: productName || null,
      ssrError: error,
    },
  };
}

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
        paddingTop: 20,
        paddingBottom: 20,
      }}
      className="decDetails"
    >
      <div style={{ width: "50%", textAlign: "center" }} className="decDetailsLeft">
        <div
          style={{
            width: "80%",
            height: 300,
            backgroundColor: "#f0f0f0",
            margin: "0 auto",
          }}
        />
      </div>
      <div
        style={{ width: "50%", paddingLeft: 20, paddingRight: 50 }}
        className="decDetailsRight"
      >
        {[60, 40, 80, 60, 60, 60, 60, 100, 100].map((w, i) => (
          <div
            key={i}
            style={{
              height: i % 2 ? 30 : 20,
              backgroundColor: "#f0f0f0",
              marginBottom: 12,
              width: `${w}%`,
              borderRadius: 4,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ---------- Page ----------
const ProductDetails = ({
  initialWork = null,
  initialSimilar = null,
  initialAddons = null,
  initialThemes = null,
  productId: ssrProductId = null,
  city: ssrCity = null,
  locality: ssrLocality = null,
  catValue: ssrCatValue = null,
}) => {
  const router = useRouter();
  const productId = router.query.id || ssrProductId;
  const city = ssrCity || router.query.city || null;
  const locality = ssrLocality || router.query.locality || null;
  const catValue = ssrCatValue || router.query.catValue || "";

  const [work, setWork] = useState(initialWork);
  const [loading, setLoading] = useState(!initialWork);
  const [similarProducts, setSimilarProducts] = useState(initialSimilar || []);
  const [addonData, setAddonData] = useState(initialAddons || []);
  const [addonIds, setAddonIds] = useState(initialWork?.addons || []);
  const [themeIds, setThemeIds] = useState(initialWork?.ThemesId || []);
  const [themeData, setThemeData] = useState(initialThemes || []);
  const [themeLoading, setThemeLoading] = useState(
    !(initialThemes && initialThemes.length >= 0) && !initialWork
  );
  const [themeError, setThemeError] = useState(null);
  const [selectedThemeData, setSelectedThemeData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isArrowDown, setIsArrowDown] = useState(false);
  const [itemQuantities, setItemQuantities] = useState({});
  const [selectedAddOnProduct, setSelectedAddOnProduct] = useState([]);

  const hasCityPageParam = Boolean(city);
  const addonRef = useRef(null);
  const customizationRef = useRef(null);
  const similarRef = useRef(null);

  const schemaOrg = getPhotographyOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);

  const brandItems = [
    {
      img: HappyCustomerIMG,
      alt: "Happy Customers",
      bold: "1L+ HAPPY",
      sub: "CUSTOMERS",
    },
    {
      img: GoogleRatingIMG,
      alt: "Google Rating",
      bold: "4.8+ GOOGLE",
      sub: "RATING",
    },
    {
      img: SocialMediaIMG,
      alt: "Social Media",
      bold: "OUR",
      sub: "SOCIAL MEDIA",
    },
    {
      img: TopBrandIMg,
      alt: "Top Brands",
      bold: "TOP BRANDS",
      sub: "PARTNERED",
    },
  ];

  // Client nav: alag product id
  useEffect(() => {
    if (!productId) return;
    if (productId === ssrProductId && initialWork) {
      setLoading(false);
      return;
    }

    const fetchProductAndSimilar = async () => {
      try {
        setLoading(true);
        const res = await axiosApi.get(
          `${BASE_URL}/api/photography/details/${productId}`
        );
        const data = res.data?.data;
        if (!data) throw new Error("No product found");

        setAddonIds(data?.addons || []);
        setThemeIds(data?.ThemesId || []);

        const { discount, discountedPrice, discountDifference } =
          getDiscountedPrice(Number(data.price));

        setWork({
          ...data,
          discount,
          discountedPrice,
          discountDifference,
          advance_amount: Number(data.advance_amount || 0),
        });

        const tagId = data?.tag?.[0]?._id;
        if (tagId) {
          const similarRes = await axiosApi.get(
            `${BASE_URL}/api/photography/searchByTag/${tagId}`
          );
          setSimilarProducts(
            (similarRes.data?.data || []).filter((p) => p._id !== productId)
          );
        } else {
          setSimilarProducts([]);
        }
      } catch (error) {
        console.error(error);
        setWork(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndSimilar();
  }, [productId, ssrProductId, initialWork]);

  // Addons — SSR miss / client nav
  useEffect(() => {
    if (!addonIds?.length) return;
    if (productId === ssrProductId && initialAddons?.length) return;

    const getAddons = async () => {
      try {
        const q = new URLSearchParams();
        addonIds.forEach((id) => id && q.append("ids", id));
        if (![...q].length) return;

        const response = await fetchWithError(
          `${BASE_URL}${GET_ADDON_BY_ID}?${q}`
        );
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
  }, [addonIds, productId, ssrProductId, initialAddons]);

  // Themes — SSR miss / client nav
  useEffect(() => {
    if (!themeIds?.length) {
      if (!(productId === ssrProductId && initialThemes)) {
        setThemeData([]);
      }
      setThemeLoading(false);
      return;
    }
    if (productId === ssrProductId && initialThemes) {
      setThemeLoading(false);
      return;
    }

    const getThemes = async () => {
      try {
        setThemeLoading(true);
        setThemeError(null);
        const q = new URLSearchParams();
        themeIds.forEach((id) => id && q.append("ids", id));
        if (![...q].length) {
          setThemeData([]);
          return;
        }
        const response = await fetchWithError(
          `${BASE_URL}/api/photography-theme/get?${q}`
        );
        const data = await response.json();
        if (!response.ok || data.error) {
          throw new Error(data.message || "Failed to fetch themes");
        }
        setThemeData(data.data || []);
      } catch (error) {
        console.error("Error fetching themes:", error);
        setThemeError(error.message || "Something went wrong");
        setThemeData([]);
      } finally {
        setThemeLoading(false);
      }
    };
    getThemes();
  }, [themeIds, productId, ssrProductId, initialThemes]);

  // sessionStorage addons
  useEffect(() => {
    if (!productId) return;
    try {
      const saved = sessionStorage.getItem(`photo_addons_${productId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedAddOnProduct(parsed.selectedAddOnProduct || []);
        setItemQuantities(parsed.itemQuantities || {});
      }
    } catch (e) {
      console.error("Error restoring addons:", e);
    }
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    try {
      sessionStorage.setItem(
        `photo_addons_${productId}`,
        JSON.stringify({ selectedAddOnProduct, itemQuantities })
      );
    } catch (e) {
      console.error("Error saving addons:", e);
    }
  }, [selectedAddOnProduct, itemQuantities, productId]);

  // ---------- handlers (same as tumhara) ----------
  const calculateTotalPrice = (productPrice) => {
    let totalPrice = Number(work?.price || productPrice || 0);
    selectedAddOnProduct.forEach((item) => {
      totalPrice += item.price * (itemQuantities[item.title] || 0);
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

  const handleAddToCart = (item) => {
    const updated = [...selectedAddOnProduct];
    const idx = updated.findIndex((a) => a.title === item.title);
    if (idx !== -1) updated[idx].quantity += 1;
    else updated.push({ ...item, quantity: 1 });
    setSelectedAddOnProduct(updated);
    setItemQuantities({
      ...itemQuantities,
      [item.title]: (itemQuantities[item.title] || 0) + 1,
    });
  };

  const handleRemoveFromCart = (item) => {
    const updated = [...selectedAddOnProduct];
    const idx = updated.findIndex((a) => a.title === item.title);
    if (idx !== -1) {
      if (updated[idx].quantity > 1) updated[idx].quantity -= 1;
      else updated.splice(idx, 1);
    }
    const qty = { ...itemQuantities };
    if (qty[item.title] > 1) qty[item.title] -= 1;
    else delete qty[item.title];
    setSelectedAddOnProduct(updated);
    setItemQuantities(qty);
  };

  const handleAddToCartAndScrollBack = (item) => {
    handleAddToCart(item);
    setIsModalOpen(false);
    setTimeout(() => {
      customizationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  };

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
      <div className="inclusion-section">
        <div className="inclusion-heading">Inclusions</div>
        <ul className="inclusion-list">
          {inclusionItems.map((item, index) => (
            <li key={index} className="inclusionstyle">
              <Image src={checkImage} alt="Info" />
              {item.trim()}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const getAddonTotalPrice = () => {
    let addonTotal = 0;
    selectedAddOnProduct.forEach((item) => {
      addonTotal += Number(item.price) * (itemQuantities[item.title] || 0);
    });
    return addonTotal;
  };

  const getFinalAdvanceAmount = () => {
    const productAdvance = Number(work?.advance_amount || 0);
    const addonAdvance = getAddonTotalPrice() * 0.35;
    return Math.round(productAdvance + addonAdvance);
  };

  const sendToCheckoutPage = (product) => {
    const totalPrice = calculateTotalPrice(product.price);
    const advanceAmount = getFinalAdvanceAmount();
    const balanceAmount = totalPrice - advanceAmount;

    router.push({
      pathname: "/photography-checkout",
      query: {
        from: typeof window !== "undefined" ? window.location.pathname : "",
        product: JSON.stringify(product),
        ProductPrice: product.discountedPrice || product.price,
        selectedAddOnProduct: JSON.stringify(selectedAddOnProduct),
        itemQuantities: JSON.stringify(itemQuantities),
        selectedThemes: JSON.stringify(selectedThemeData),
        totalAmount: totalPrice,
        advanceAmount,
        balanceAmount,
        duration: work?.duration,
      },
    });
  };

  const handleShare = async () => {
    if (!work?._id || typeof window === "undefined") return;
    const cleanPath = router.asPath.split("?")[0];
    const shareUrl = `${window.location.origin}${cleanPath}?id=${work._id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: work?.name || "Product", url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied!");
      }
    } catch (err) {
      console.log("Share cancelled");
    }
  };

  if (loading && !work) return <SkeletonLoader />;
  if (!work) return <div className="photodetails-loading">Work not found</div>;

  return (
    <div>
      <SeoWork
        city={city}
        locality={locality}
        work={work}
        scriptTag={scriptTag}
      />

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div className="decDetails">
          <div className="decDetailsLeft">
            <div style={{ position: "relative" }}>
              <Image
                src={
                  work.featured_image
                    ? `https://horaservices.com/api/uploads/compressed_webp/${
                        work.featured_image.split(".")[0]
                      }.webp`
                    : fallbackImg
                }
                alt={`${work?.name || "Product"} image`}
                style={{ width: "100%", height: "auto" }}
                className="photoImage"
                width={400}
                height={300}
                priority
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
                <Image
                  src={logo}
                  alt="Hora Services"
                  className="hora-watermark-image"
                />
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
                  <a
                    style={{
                      color: "rgb(157, 74, 147)",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                    href="/photography-page"
                  >
                    Home
                  </a>
                  {" > "}
                  <a
                    className="breadcrumb-link"
                    href={`/photography-page/${catValue}`}
                  >
                    {(catValue || "")
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </a>
                  {" > "}
                </h2>

                <button
                  onClick={() => {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                      event: "view_similar_click",
                      eventCategory: "Product Details Page",
                      eventAction: "View Similar Button Click",
                      eventLabel: work?.name,
                      product_name: work?.name,
                      category: catValue,
                      price: work?.price,
                    });
                    similarRef?.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="view-similar-btn"
                >
                  View Similar
                </button>
              </div>

              <h1 className="product-title">{work.name}</h1>

              <div className="price-share-row">
                <div className="pro-details-price">
                  <p className="product-price">₹{work.price}</p>
                  <p className="product-old-price">
                    ₹{" "}
                    {work.discountedPrice
                      ? Math.floor(Number(work.discountedPrice))
                      : Math.floor(Number(work.price))}
                  </p>
                  <div className="product-discount">
                    ₹ {Math.floor(work.discountDifference || 0)} off
                  </div>
                </div>
                <div className="share-btn" onClick={handleShare}>
                  <Image
                    src={ShareIcon}
                    alt="share"
                    className="share-icon-img"
                  />
                </div>
              </div>

              <div className="addon-container" ref={customizationRef}>
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
              <b className="Duration">Duration:</b>{" "}
              {work?.event_duration ||
                work?.duration ||
                "Duration not available"}
            </p>
          </div>

          {!themeLoading && themeData.length > 0 && (
            <Categorythemeselector
              themes={themeData}
              loading={themeLoading}
              error={themeError}
              maxSelect={3}
              onSelectionChange={setSelectedThemeData}
            />
          )}

          <div ref={addonRef}>
            <AddonModal
              isopen={isModalOpen}
              setIsOpen={setIsModalOpen}
              addOnProducts={addonData}
              itemQuantities={itemQuantities}
              onAdd={handleAddToCartAndScrollBack}
              onRemove={handleRemoveFromCart}
              title="Add-ons"
            />
          </div>

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
            <PhotographySimilarSlider
              title="Similar Photography"
              data={similarProducts}
              showDiscount={true}
              imageSize={{ width: 120, height: 120 }}
              city={city}
              hasCityPageParam={hasCityPageParam}
              locality={locality}
              catValue={getMappedCatValue(catValue)}
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
              <Image
                src={Brand}
                alt="Hora Featured Media"
                className="media-logos-img"
              />
            </div>
          </div>

          <BrandBanner
            title="Excellence Backed by Happy Customers"
            items={brandItems}
          />
          <AdditionalServices />
          <div className="tab-section-details-productpage">
            <FAQSection faqData={faqData} />
          </div>
        </div>

        <div className="confirm-button-wrapper">
          <p
            style={{
              fontWeight: "bold",
              marginBottom: "0px",
              color: "black",
            }}
          >
            Total: ₹ {calculateTotalPrice(Number(work?.price))}
          </p>
          <button
            className="confirm-button"
            onClick={() => sendToCheckoutPage(work)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;