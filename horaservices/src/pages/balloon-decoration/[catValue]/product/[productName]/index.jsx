
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import checkImage from "../../../../../assets/tick.svg";
import logo from "../../../../../assets/new_logo_light.png";
import HowitWork from "../../../../../assets/howitwork.jpg";
import HappyCustomerIMG from "../../../../../assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "../../../../../assets/GoogleRatingIMG4.png";
import SocialMediaIMG from "../../../../../assets/ourSocialmediaIMG.png";
import TopBrandIMg from "../../../../../assets/TpBrandsIMG.png";
import ShareIcon from "@/assets/shareIcon.svg";
import pencil from "@/assets/pencil.svg";
import SimiliarThemes from "@/assets/SimilarThemes.svg";
import StarIcon from "@/assets/StarIcon.svg";
import fireIcon from "@/assets/fireIcon.svg";
import hearticon from "@/assets/hearticon.svg";
import fallbackImg from "@/assets/fallback-image.png";
import VideoClint from "@/assets/ourclientvideo.mp4";

import "./Decorproduct.css";
import "../../../../../css/decoration.css";
import "../../../../../components/CategoryTabs/CategoryTabs.css";

import {
  getDecorationProductOrganizationSchema,
  getProductFAQSchemaProductDetails,
} from "../../../../../utils/schema";
import {
  filterSimilarProducts,
  filterLevelUpProducts,
  getMappedCatValue,
} from "../../../../../utils/similarProductUtils";
import {
  BASE_URL,
  GET_DECORATION_BY_NAME,
  GET_DECORATION_CAT_ID,
  GET_ADDON_BY_ID,
  COMPRESSED_WEBP_IMG_URL,
} from "@/utils/apiconstants";
import FAQSection from "@/components/FAQSection";
import faqData from "../../../../../utils/faqData.json";
import CategoryTabs from "../../../../../components/CategoryTabs/index.jsx";
import { themeFilters } from "@/utils/themeFilters";
import AddonModal from "@/components/AddonModal";
import AdditionalServices from "@/components/AdditionalServices";
import BrandBanner from "@/components/BrandBanner";
import SimilarDecorationSlider from "@/components/SimilarDecorationSlider";
import VideoTestimonial from "@/components/VideoTestimonial";
import AddOnsList from "@/components/AddOnsList";
import { fetchWithError } from "@/utils/fetchWithError";
import axiosApi from "@/utils/axiosApi";
import MakeItYoursBanner from "@/components/MakeItYoursBanner";
import GoogleReviewsCard from "@/components/PhotoGalleryPose/GoogleReviewsCard";
import { reviewsData } from "@/utils/poselinkreviews";
import ActionButtons from "@/components/Actionbuttons";
import WhyHoraSection from "@/components/WhyHoraSection";

// ---------- helpers ----------
const getDiscountedPrice = (price) => {
  let discount;
  if (price < 3000) discount = 20;
  else if (price >= 3000 && price <= 5000) discount = 27;
  else discount = 35;

  const discountedPrice = parseFloat(price) * (1 + parseFloat(discount) / 100);
  const discountDifference = Math.abs(parseFloat(price) - discountedPrice);
  return { discount, discountedPrice, discountDifference };
};

const generateSlug = (name) =>
  name
    ?.toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const formatProductName = (productName) => {
  if (!productName) return "";
  return productName
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

// ---------- SSR ----------
export async function getServerSideProps(context) {
  const { productName, catValue } = context.params || {};
  const query = context.query || {};

  const apiProduct = formatProductName(productName);
  const finalCatValue = catValue || query.catValue || "";
  const finalSubCategory = query.subCategory || "";

  let product = null;

  if (apiProduct) {
    try {
      const tryFetch = async (name) => {
        const url = `${BASE_URL}${GET_DECORATION_BY_NAME}${encodeURIComponent(name)}`;
        const res = await axiosApi.get(url);
        if (res?.data?.error) return null;
        return res?.data?.data?.[0] || null;
      };

      product = await tryFetch(apiProduct);

      // "And" → "&" fallback
      if (!product && /\bAnd\b/i.test(apiProduct)) {
        product = await tryFetch(apiProduct.replace(/\bAnd\b/gi, "&"));
      }
    } catch (err) {
      console.error("SSR product fetch error:", err.message);
    }
  }

  return {
    props: {
      initialProduct: product,
      initialCatValue: finalCatValue,
      initialSubCategory: finalSubCategory,
      productNameFromUrl: productName || null,
    },
  };
}

// ---------- Component ----------
function DecorationCatDetails({
  initialProduct,
  initialCatValue,
  initialSubCategory,
}) {
  const router = useRouter();

  const [product, setProduct] = useState(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [catValue, setCatValue] = useState(initialCatValue || "");
  const [subCategory, setSubCategory] = useState(initialSubCategory || "");
  const [apiProduct, setApiProduct] = useState(
    initialProduct?.name || formatProductName(router.query?.productName)
  );

  const [selectedAddOnProduct, setSelectedAddOnProduct] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [totalAmount, setTotalAmount] = useState();
  const [discountInfo, setDiscountInfo] = useState(
    initialProduct?.price ? getDiscountedPrice(initialProduct.price) : null
  );
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isArrowDown, setIsArrowDown] = useState(true);
  const [sendCategoryId, setSendCategoryId] = useState(initialCatValue || "");
  const [passCategoryId, setPassCategoryId] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [similarByTheme, setSimilarByTheme] = useState([]);
  const [levelUp1000, setLevelUp1000] = useState([]);
  const [levelUp2000, setLevelUp2000] = useState([]);
  const [addonIds, setAddonIds] = useState(initialProduct?.addons || []);
  const [addonData, setAddonData] = useState([]);
  const [selCat, setSelCat] = useState("");

  const customizationRef = useRef(null);
  const similarRef = useRef(null);
  const addonRef = useRef(null);
  const reviewsRef = useRef(null);

  const altTagCatValue = (catValue || "").replace(/-/g, " ");
  const kidsCategories = ["kids-birthday-decoration", "kidsbirthday"];

  const brandItems = [
    { img: HappyCustomerIMG, alt: "Happy Customers", bold: "1L+HAPPY ", sub: "CUSTOMERS" },
    { img: GoogleRatingIMG, alt: "Google Rating", bold: "4.8+ GOOGLE", sub: "RATING" },
    { img: SocialMediaIMG, alt: "Social Media", bold: "OUR", sub: "SOCIAL MEDIA" },
    { img: TopBrandIMg, alt: "Top Brands", bold: "TOP BRANDS", sub: "PARTNERED" },
  ];

  // Client-side route change (agar user same page pe dusra product open kare)
  useEffect(() => {
    if (!router.isReady) return;

    const { catValue: urlCat, subCategory: urlSub, productName } = router.query;

    if (urlCat) {
      setCatValue(urlCat);
      setSendCategoryId(getMappedCatValue(urlCat));
    }
    if (urlSub) setSubCategory(urlSub);

    if (productName) {
      const formatted = formatProductName(productName);
      setApiProduct(formatted);
    }
  }, [router.isReady, router.query]);

  // Client fetch only when product name changes (SSR data already hai)
  useEffect(() => {
    if (!apiProduct) return;
    if (product?.name && product.name.toLowerCase() === apiProduct.toLowerCase()) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const tryFetch = async (name) => {
          const url = `${BASE_URL}${GET_DECORATION_BY_NAME}${encodeURIComponent(name)}`;
          const res = await axiosApi.get(url);
          if (res?.data?.error) return null;
          return res?.data?.data?.[0] || null;
        };

        let fetched = await tryFetch(apiProduct);
        if (!fetched && /\bAnd\b/i.test(apiProduct)) {
          fetched = await tryFetch(apiProduct.replace(/\bAnd\b/gi, "&"));
        }

        if (!fetched) {
          setProduct(null);
          setLoading(false);
          return;
        }

        setProduct(fetched);
        if (fetched.price) setDiscountInfo(getDiscountedPrice(fetched.price));
        setAddonIds(fetched.addons || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [apiProduct]);

  // Category products
  useEffect(() => {
    if (product?.categoryId) getCategoryProducts(product.categoryId);
    else if (catValue) getSubCatId(catValue);
  }, [product, catValue]);

  useEffect(() => {
    if (passCategoryId) getCategoryProducts(passCategoryId);
  }, [passCategoryId]);

  useEffect(() => {
    if (sendCategoryId) getSubCatId(sendCategoryId);
  }, [sendCategoryId]);

  const getCategoryProducts = async (categoryId) => {
    try {
      const res = await axiosApi.get(
        `${BASE_URL}/api/Decoration/searchByTag/v2/${categoryId}?page=1&priceFilter=all&sortBy=asc&theme=all&limit=500`
      );
      setAllProducts(res.data.data || []);
    } catch (e) {
      console.error(e.message);
    }
  };

  const getSubCatId = async (catSlug) => {
    try {
      const res = await axiosApi.get(`${BASE_URL}${GET_DECORATION_CAT_ID}${catSlug}`);
      if (res.data?.data) setPassCategoryId(res.data.data._id);
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    if (product && allProducts.length > 0) {
      setSimilarByTheme(filterSimilarProducts(product, allProducts, themeFilters));
    }
  }, [product, allProducts]);

  useEffect(() => {
    if (product?.price && allProducts.length > 0) {
      const { level1, level2 } = filterLevelUpProducts(
        product.price,
        allProducts,
        product._id
      );
      setLevelUp1000(level1);
      setLevelUp2000(level2);
    }
  }, [product, allProducts]);

  // Addons persist
  useEffect(() => {
    if (!product?._id) return;
    try {
      const saved = sessionStorage.getItem(`addons_${product._id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedAddOnProduct(parsed.selectedAddOnProduct || []);
        setItemQuantities(parsed.itemQuantities || {});
      }
    } catch (e) {}
  }, [product?._id]);

  useEffect(() => {
    if (!product?._id) return;
    try {
      sessionStorage.setItem(
        `addons_${product._id}`,
        JSON.stringify({ selectedAddOnProduct, itemQuantities })
      );
    } catch (e) {}
  }, [selectedAddOnProduct, itemQuantities, product?._id]);

  // Fetch addon details
  useEffect(() => {
    if (!addonIds?.length) return;
    const getAddons = async () => {
      try {
        const q = new URLSearchParams();
        addonIds.forEach((id) => id && q.append("ids", id));
        if (![...q].length) return;
        const res = await fetchWithError(`${BASE_URL}${GET_ADDON_BY_ID}?${q}`);
        const data = await res.json();
        if (res.ok && !data.error) setAddonData(data.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    getAddons();
  }, [addonIds]);

  useEffect(() => {
    if (!subCategory) return;
    let result = "";
    for (let i = 0; i < subCategory.length; i++) {
      if (i !== 0 && subCategory[i] === subCategory[i].toUpperCase()) result += " ";
      result += subCategory[i];
    }
    setSelCat(result);
  }, [subCategory]);

  // ---------- handlers ----------
  const openCatItems = (item) => {
    const catSlug = item.catSlug || item.catValue || "kids-birthday-decoration";
    let path = `/balloon-decoration/${catSlug}`;
    if (item.value) path += `?theme=${encodeURIComponent(item.value)}`;
    router.push(path);
  };

  const handleCustomise = (type) => {
    const messages = {
      "kids-birthday-decoration": "Hi, I want to customize a kids birthday decoration design, can you help me",
      "birthday-decoration": "Hi, I want to customize a birthday decoration design, can you help me",
      "anniversary-decoration": "Hi, I want to customize an anniversary decoration design, can you help me",
      "baby-shower-decoration": "Hi, I want to customize a baby shower decoration design, can you help me",
      "welcome-baby-decoration": "Hi, I want to customize a baby welcome decoration design, can you help me",
      "first-night-decoration": "Hi, I want to customize a first night decoration design, can you help me",
      "premium-decoration": "Hi, I want to customize a premium decoration design, can you help me",
      "haldi-mehendi-decoration": "Hi, I want to customize a haldi & mehendi decoration design, can you help me",
      "wedding-decoration": "Hi, I want to customize a wedding decoration design, can you help me",
      "bachelorette-decoration": "Hi, I want to customize a bachelorette decoration design, can you help me",
    };
    const phoneNumber = "917338584828";
    const message = (messages[type] || "Hi, I want to customize a decoration design, can you help me") + "!";

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "Customization_WhatsApp_Button",
      eventCategory: "Product Page",
      eventAction: "WhatsApp Click",
      eventLabel: "Customization WhatsApp Button",
    });

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const showAddOnmodal = () => {
    setIsModalOpen((p) => !p);
    setIsArrowDown((p) => !p);
    setTimeout(() => addonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const updateTotalAmount = () => {
    let total = Number(product?.price || 0);
    selectedAddOnProduct.forEach((item) => {
      total += item.price * (itemQuantities[item.title] || 0);
    });
    setTotalAmount(total);
  };

  useEffect(() => {
    if (product?.price) updateTotalAmount();
  }, [selectedAddOnProduct, itemQuantities, product?.price]);

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

  const calculateTotalPrice = (price) => {
    let total = Number(price || 0);
    selectedAddOnProduct.forEach((item) => {
      total += item.price * (itemQuantities[item.title] || 0);
    });
    return total;
  };

  const handleAddToCartAndScrollBack = (item) => {
    handleAddToCart(item);
    setIsModalOpen(false);
    setTimeout(() => {
      customizationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const handleCheckout = () => {
    const totalPrice = calculateTotalPrice(product.price);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "book_now_click", product_name: product.name });

    router.push({
      pathname: "/checkout",
      query: {
        from: typeof window !== "undefined" ? window.location.pathname : "",
        subCategory,
        product: JSON.stringify(product),
        orderType: "decoration",
        catValue,
        selectedAddOnProduct: JSON.stringify(selectedAddOnProduct),
        itemQuantities: JSON.stringify(itemQuantities),
        totalAmount: totalPrice,
        slug: product.slug || generateSlug(product.name),
      },
    });
  };

  const handleShare = () => {
    const cleanUrl = window.location.origin + window.location.pathname;
    if (navigator.share) {
      navigator.share({ title: product.name, url: cleanUrl });
    } else {
      navigator.clipboard.writeText(cleanUrl);
      alert("Link copied!");
    }
  };

  const getItemInclusion = (inclusion) => {
    if (!Array.isArray(inclusion) || !inclusion.length) return null;
    const htmlString = inclusion[0];
    const withoutTags = htmlString.replace(/<[^>]*>/g, "");
    const withoutSpecial = withoutTags.replace(/&#[^;]*;/g, " ");
    const items = withoutSpecial
      .split("<div>")
      .flatMap((s) => s.split("-").filter((i) => i.trim()));

    return (
      <div className="inclusion-sections">
        <div className="inclusion-heading">Inclusions</div>
        <ul className="inclusion-list">
          {items.map((item, i) => (
            <li className="inclusionstyle" key={i}>
              <Image src={checkImage} alt="check" className="inclusion-check" />
              <span className="inclusion-text">{item.trim()}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Schema
  const schemaOrg = getDecorationProductOrganizationSchema(product || {});
  const scriptTag = JSON.stringify(schemaOrg);
  const faqSchema = getProductFAQSchemaProductDetails(product || {});
  const faqScriptTag = JSON.stringify(faqSchema);

  // Loading / not found
  if (loading && !product) {
    return (
      <div style={{ maxWidth: 1200, margin: "40px auto", textAlign: "center" }}>
        Loading…
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ maxWidth: 1200, margin: "40px auto", textAlign: "center" }}>
        <h1>Product not found</h1>
        <p>Is design ko nahi mil paya. Koi aur try karo.</p>
      </div>
    );
  }

  return (
    <div className="App" style={{ backgroundColor: "white" }}>
      <Head>
        <title>{`${product.name} | ${catValue.replace(/-/g, " ")}`}</title>
        <meta
          name="description"
          content={`${product.name} from Hora Services – Beautiful ${catValue.replace(/-/g, " ")} decoration starting at just ₹999. Book for birthdays, anniversaries, weddings & more!`}
        />
        <meta
          name="keywords"
          content={`${product.name}, ${catValue.replace(/-/g, " ")}, balloon decoration, ${product.name} decoration price`}
        />
        <meta property="og:title" content={`${product.name} | ${catValue.replace(/-/g, " ")} by Hora Services`} />
        <meta
          property="og:description"
          content={`Book ${product.name} decoration by Hora Services. Explore ${catValue.replace(/-/g, " ")} designs for birthdays, anniversaries, baby showers & more.`}
        />
        <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
        <meta property="og:image:alt" content={`${product.name}, ${catValue.replace(/-/g, " ")} decoration`} />
        <meta
          property="og:url"
          content={`https://horaservices.com/balloon-decoration/${catValue}/product/${product.name?.replace(/\s+/g, "-")}`}
        />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: scriptTag }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqScriptTag }} />
      </Head>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="decDetails">
          {/* Left image */}
          <div className="decDetailsLeft">
            <div style={{ position: "relative" }}>
              <Image
                src={
                  product?.featured_images?.[0]?.fileName
                    ? `${COMPRESSED_WEBP_IMG_URL}${product.featured_images[0].fileName.split(".")[0]}.webp`
                    : fallbackImg
                }
                alt={`balloon decoration ${altTagCatValue} ${product.name} ${product.price}`}
                style={{ width: "100%", height: "auto" }}
                width={300}
                height={300}
                priority
              />
              <div style={{ position: "absolute", bottom: 3, right: 3, borderRadius: "50%", padding: 10 }}>
                <Image src={logo} alt="Hora Services" className="hora-watermark-image" />
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="decDetailsRight">
            <div style={{ padding: "clamp(8px, 2.5vw, 10px) clamp(8px, 2.5vw, 10px) 0" }}>
              <div className="breadcrumb-row">
                <h2 className="breadcrumb-text">
                  <a className="breadcrumb-link" href="/">Home</a>
                  {" > "}
                  <a className="breadcrumb-link" href={`/balloon-decoration/${catValue}`}>
                    {catValue.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </a>
                  {" > "}
                </h2>
              </div>

              <h1 className="product-title">{product.name}</h1>

              <div className="price-share-row">
                <div className="pro-details-price">
                  <p className="product-price">₹ {product.price}</p>
                  <p className="product-old-price">₹ {Math.floor(discountInfo?.discountedPrice || 0)}</p>
                  <div className="product-discount">
                    ₹ {Math.floor(discountInfo?.discountDifference || 0)} off
                  </div>
                </div>
                <div className="share-btn" onClick={handleShare}>
                  <Image src={ShareIcon} alt="share" className="share-icon-img" />
                </div>
              </div>

              <ActionButtons
                product={product}
                catValue={catValue}
                cityName={null}
                similarRef={similarRef}
                handleCustomise={handleCustomise}
              />

              <div className="addon-container" ref={customizationRef}>
                <AddOnsList
                  selectedAddOnProduct={selectedAddOnProduct}
                  itemQuantities={itemQuantities}
                  showAddOnmodal={showAddOnmodal}
                  pencil={pencil}
                />
              </div>
            </div>

            <div style={{ padding: "0 10px" }}>
              {getItemInclusion(product.inclusion)}
              <MakeItYoursBanner />
            </div>

            <div ref={addonRef}>
              <AddonModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                addOnProducts={addonData}
                itemQuantities={itemQuantities}
                onAdd={handleAddToCartAndScrollBack}
                onRemove={handleRemoveFromCart}
              />
            </div>

            <div ref={similarRef}>
              <SimilarDecorationSlider
                title="Similar Decorations"
                data={similarByTheme}
                showDiscount={true}
                imageSize={{ width: 120, height: 120 }}
                city={null}
                hasCityPageParam={false}
                locality={null}
                catValue={catValue}
                icon={StarIcon}
                sparkleIcon={SimiliarThemes}
              />
            </div>

            {kidsCategories.includes(catValue?.toLowerCase()) && (
              <div className="category-tabs-outer">
                <CategoryTabs
                  data={themeFilters.map((item) => ({
                    id: item.value,
                    name: item.label,
                    image: item.image,
                    value: item.value,
                    catValue: "kids-birthday-decoration",
                  }))}
                  onSelect={openCatItems}
                  city={null}
                  hasCityPageParam={false}
                  locality={null}
                  variant="grid"
                  catValue="KidsBirthday"
                  heading="Other Popular Themes"
                  hasBg={true}
                  icon={StarIcon}
                  fireIcon={fireIcon}
                />
              </div>
            )}

            {levelUp1000.length > 0 && (
              <SimilarDecorationSlider
                title="You May Also Like This"
                data={levelUp1000}
                showDiscount={true}
                city={null}
                hasCityPageParam={false}
                locality={null}
                catValue={catValue}
                icon={StarIcon}
                sparkleIcon={hearticon}
              />
            )}

            {levelUp2000.length > 0 && (
              <SimilarDecorationSlider
                data={levelUp2000}
                showDiscount={true}
                city={null}
                hasCityPageParam={false}
                locality={null}
                catValue={catValue}
              />
            )}

            <WhyHoraSection />

            <div ref={reviewsRef}>
              <GoogleReviewsCard reviews={reviewsData} />
            </div>

            <BrandBanner title="Excellence Backed by Happy Customers" items={brandItems} />
            <VideoTestimonial videoSrc={VideoClint} />

            <div className="decorke-celebrate-banner">
              <Image src={HowitWork} alt="Customize Your Celebration" className="decorke-banner-img" />
            </div>

            <AdditionalServices />

            <div className="tab-section-details-productpage">
              <FAQSection faqData={faqData} />
            </div>
          </div>
        </div>

        {/* Sticky bottom bar */}
        <div className="confirm-button-wrapper">
          <p style={{ fontWeight: "bold", marginBottom: 0, color: "black" }}>
            Total: ₹ {calculateTotalPrice(Number(product.price))}
          </p>
          <button className="confirm-button" onClick={handleCheckout}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default DecorationCatDetails;
