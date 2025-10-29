import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Head from "next/head";
import photographyAddOns from "@/utils/photographyAddOns.json";
import productsData from '@/utils/photoGraphyImages.js';
import { faqData } from '@/utils/photographyFAQData.js'
import { getPhotographyOrganizationSchema } from "@/utils/schema";
import { useParams } from "next/navigation";
// import addOnProductsData from '../../../utils/addOnProduct.json';
import cancellation from "@/assets/Cancellation.svg"
import PROFESSIONALPHOTOGRAPHERS from "@/assets/professionalPhoto.png";
import SECURESTORAGE from "@/assets/secureStorage.png";
import SUPPORT from "@/assets/support.png";
import Brand from "@/assets/Brand.png";
import HowitWork from "@/assets/howitwork.jpg";
import HappyCustomerIMG from "@/assets/HappyCustomerIMG.jpg";
import GoogleRatingIMG from "@/assets/GoogleRatingIMG4.png";
import SocialMediaIMG from "@/assets/ourSocialmediaIMG.png";
import TopBrandIMg from "@/assets/TpBrandsIMG.png";
import checkImage from "@/assets/tick.jpeg";
import "./productDetails.css";
import {
  BASE_URL,
} from "@/utils/apiconstants";
import { FaQuestionCircle } from "react-icons/fa";
import FAQSection from '@/components/FAQSection';
import BrandBanner from '@/components/BrandBanner';
import AdditionalServices from '@/components/AdditionalServices';

import Photographyslider from '@/components/photoslidersection';
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
const ProductDetails = ({city,locality}) => {
  const schemaOrg = getPhotographyOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  const router = useRouter();
    const params = useParams();
  const { query } = useRouter();
  const productId = query.id;
  const { product } = router.query;
    const [catValue, setCatValue] = useState("");
  const [work, setWork] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [addedItems, setAddedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [itemQuantities, setItemQuantities] = useState({});
  const [selectedAddOnProduct, setSelectedAddOnProduct] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const [isArrowDown, setIsArrowDown] = useState(true);
  const altTagCatValue = catValue.replace(/-/g, " ");
  const hasCityPageParam = city ? true : false;
  const cityName = params?.city;
  const parsedProduct = product ? JSON.parse(product) : null;
  const tagId = parsedProduct?.tag?.[0];
  const addonRef = useRef(null);      // Scroll target inside modal
  const customizationRef = useRef(null);
  const [similarProducts, setSimilarProducts] = useState([]);
const similarRef = useRef(null);

  const brandItems = [
    { img: HappyCustomerIMG, alt: "Happy Customers", bold: "1L+ HAPPY", sub: "CUSTOMERS" },
    { img: GoogleRatingIMG, alt: "Google Rating", bold: "4.8+ GOOGLE", sub: "RATING" },
    { img: SocialMediaIMG, alt: "Social Media", bold: "OUR", sub: "SOCIAL MEDIA" },
    { img: TopBrandIMg, alt: "Top Brands", bold: "TOP BRANDS", sub: "PARTNERED" },
  ];
    useEffect(() => {
    if (params?.catValue) {
      setCatValue(params.catValue);
    }
  }, [params]);
  const calculateTotalPrice = (productPrice) => {
    // let totalPrice = Number(productPrice);
    let totalPrice = Number(work?.price || productPrice);

    selectedAddOnProduct.forEach(item => {
      totalPrice += item.price * itemQuantities[item.title];
    });
    return totalPrice;
  };

  const handleContinue = () => {
    setIsModalOpen(false);
  }
  const showAddOnmodal = () => {
    setIsModalOpen((prev) => !prev);
    setIsArrowDown((prev) => !prev);

    setTimeout(() => {
      addonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  const handleAddToCartAndScrollBack = (item) => {
    handleAddToCart(item);  // You already have this function

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
    updateTotalAmount();
  };

  const updateTotalAmount = () => {
    if (!work) return;
let newTotalAmount = Number(work.discountedPrice || work.price) || 0;

    // let newTotalAmount = Number(work.price) || 0;
    selectedAddOnProduct.forEach(item => {
      newTotalAmount += item.price * (itemQuantities[item.title] || 0);
    });
    setTotalAmount(newTotalAmount);
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
    updateTotalAmount();
  };




  const getItemInclusion = (inclusion) => {
    if (!Array.isArray(inclusion) || inclusion.length === 0) {
      return null;
    }
    const htmlString = inclusion[0];
    const withoutTags = htmlString.replace(/<[^>]*>/g, "");
    const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, " ");
    const statements = withoutSpecialChars.split("<div>");
    const inclusionItems = statements.flatMap((statement) =>
      statement.split("-").filter((item) => item.trim() !== "")
    );
    const inclusionList = inclusionItems.map((item, index) => (
      <li key={index} className="inclusionstyle">
        <Image
          src={checkImage}
          alt="Info"
          style={{ height: 13, width: 13, marginRight: 10 }}
        />
        {item.trim()}
      </li>
    ));
    return (
      <div>
        <div
          style={{
            fontSize: "21px",
            borderBottom: "1px solid #e7eff9",
            marginBottom: "10px",
          }}
        >
          Inclusions
        </div>
        <ul>{inclusionList}</ul>
      </div>
    );
  };

const getDiscountedPrice = (price = 0) => {
  // price here is AFTER discount
  const discountedPrice = price / 0.78; // get original (before discount)
  const discountDifference = discountedPrice - price; // how much is off
  const discount = ((discountDifference / discountedPrice) * 100).toFixed(0); // 22%
  return {
    discount: Number(discount),              // 22
    discountedPrice: Math.round(discountedPrice), // original price (before discount)
    discountDifference: Math.round(discountDifference), // amount off
  };
};


  const sendToCheckoutPage = (product) => {
    const totalPrice = calculateTotalPrice(product.price);
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "book_now_click",
      product_name: product.name,
    });

    router.push({
      pathname: '/photography-checkout',
      // query: {
      //   from: window.location.pathname,
      //   product: JSON.stringify(product),
      //  ProductPrice: product.price,
      //   // Productname: product.name,
      //   // productId: product._id,
      // }
      query: {
        from: window.location.pathname,
        product: JSON.stringify(product),
        ProductPrice: product.discountedPrice || product.price,
        selectedAddOnProduct: JSON.stringify(selectedAddOnProduct),
        itemQuantities: JSON.stringify(itemQuantities),
        totalAmount: totalPrice,
      }
    });
  };





  useEffect(() => {
    if (!productId) return;

    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/photography/details/${productId}`);
        const data = res.data?.data;

        if (!data) throw new Error("No product found");

        // 💰 Calculate discount
        const { discount, discountedPrice, discountDifference } = getDiscountedPrice(Number(data.price));

        setWork({
          ...data,
          discount,
          discountedPrice,
          discountDifference,
        });
      } catch (err) {
        console.error("Error fetching product details:", err.message);
        setWork(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

// const catValue = work?.catValue || work?.category || parsedProduct?.catValue || "";
 const getMappedCatValue = (slug) => {
    const map = {
        "Engagement-Photography": "Engagement-Photography",
   "  Wedding-Photography": "  Wedding-Photography",
    " Anniversary-Photography":" Anniversary-Photography",
    " Birthday-Photography": "Birthday-Photography",
  "   House-warming-Photography":"   House-warming-Photography",
    " Naming-ceremony-Photography": "Naming-ceremony-Photography",
    " Baby-Shower-Photography":" Baby-Shower-Photography",
    " Bachelorette-Photography":" Bachelorette-Photography",
   "  Maternity-Photography":"  Maternity-Photography",
   " New-Born-Baby-Photography":" New-Born-Baby-Photography"
    };
    return map[slug] || slug;  // If not mapped, return the same slug
  };
//   useEffect(() => {
//   if (!tagId || !productId) return; // Wait until both are available

//   const fetchSimilarProducts = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/photography/searchByTag/${tagId}`);
//       const allProducts = res.data?.data || [];

//       // Remove the current product
//       const filteredProducts = allProducts.filter(p => p._id !== productId);
//       setSimilarProducts(filteredProducts);
//     } catch (error) {
//       console.error("Error fetching similar products:", error.message);
//     }
//   };

//   fetchSimilarProducts();
// }, [tagId, productId]);
useEffect(() => {
  if (!productId) return;

  const fetchProductAndSimilar = async () => {
    try {
      // 1️⃣ Fetch main product details
      const res = await axios.get(`${BASE_URL}/api/photography/details/${productId}`);
      const data = res.data?.data;

      if (!data) throw new Error("No product found");

      // 💰 Calculate discount
      const { discount, discountedPrice, discountDifference } = getDiscountedPrice(Number(data.price));

      // 🟢 Set product info for UI
      setWork({
        ...data,
        discount,
        discountedPrice,
        discountDifference,
      });

      // 2️⃣ Extract tag ID safely
      const tagId = data?.tag?.[0]?._id;
      if (!tagId) {
        console.warn("No tag found for product");
        return;
      }

      // 3️⃣ Fetch similar products by tag
      const similarRes = await axios.get(`${BASE_URL}/api/photography/searchByTag/${tagId}`);
      const allProducts = similarRes.data?.data || [];

      // 4️⃣ Remove the current product from the similar list
      const filteredProducts = allProducts.filter((p) => p._id !== productId);

      setSimilarProducts(filteredProducts);
      console.log("✅ Similar products:", filteredProducts);
    } catch (error) {
      console.error("Error fetching product or similar products:", error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchProductAndSimilar();
}, [productId]);



  if (loading) {
    return <SkeletonLoader />; // Show skeleton loader while loading
  }

  if (!work) return <div className="photodetails-loading">Work not found</div>;

  return (
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
      <div className="photodetails-container">

        <div className="photodetails-image-section">
          <Image
            src={
              work.featured_image
                ? `https://horaservices.com/api/uploads/compressed_webp/${work.featured_image.split(".")[0]}.webp`
                : "/default.jpg"
            }
            alt={`${work?.name || "Product"} image`}
            className="photoImage"
            width={400}
            height={300}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',   padding: "0px 10px" }}>
          <h2
            style={{
              fontSize: "13px",
              color: "#222",
              margin: "8px 0 8px 0",
              fontWeight: "500",
           
            }}
          >
            <a
              style={{ color: "rgb(157, 74, 147)", textDecoration: "none", fontSize: "13px" }}
              href="/photography-page"
            >
              Home
            </a>
            {" > "}
                  
    <a
      style={{ color: "rgb(157, 74, 147)", textDecoration: "none", fontSize: "13px" }}
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
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 700, // numeric value
              color: "rgb(157, 74, 147)",
              background: "none",
              border: "none",
              textDecoration: "underline",
              textDecorationStyle: "solid",
              textAlign: "center",
              lineHeight: "100%",
              cursor: "pointer",
            }}

          >
            View Similar
          </button>


        </div>

        <h1
          style={{
            fontSize: "18px",
            color: "#222",
            fontWeight: "#500",
               padding: "10px",
               marginBottom: "0",
          }}
        >
          {work.name}
        </h1>

        <div className="photodetails-price-section">
          <span className="photodetails-discounted">
            ₹{work.price}
          </span>
          <span className="photodetails-original">₹ {work.discountedPrice ? Math.floor(Number(work.discountedPrice).toFixed(2)) : Math.floor(Number(work.price).toFixed(2))}</span>
          <span className="photodetails-offer">₹ {Math.floor(work.discountDifference)} off</span>
        </div>

        <div className='addon-prices' ref={customizationRef}>

       
            {selectedAddOnProduct.length > 0 && (
              <>
                 <div style={{ padding: "10px" }} >
                <label>Customisations</label>
                <span onClick={showAddOnmodal} style={{ marginLeft: "6px", cursor: "pointer" }}>
                  < svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg" style={{ color: "rgb(146, 82, 170)", verticalAlign: "0px" }}><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" ></path></svg>
                </span>
                {selectedAddOnProduct.map((item, index) => (
                  <li key={index}>
                    <div className="itemline">
                      {index + 1}. {item.title} = ₹ {item.price} x {itemQuantities[item.title]} = ₹ {item.price * itemQuantities[item.title]}

                    </div>

                  </li>
                ))}

             </div>
              </>
            )}
       
        </div>
        <div className="photodetails-inclusions">

          {getItemInclusion(work.inclusion)}
          <p className="work-duration">
            <b className="Duration">Duration:</b> {work?.event_duration || work?.duration || "Duration not available"}
          </p>
        </div>

        <div className="modal-top-box11" ref={addonRef}>
          <h2 className="select-heading-sec">Add Extra Features</h2>
        </div>


        <div className="modal-overlay11" onClick={() => setIsModalOpen(false)} style={{ maxHeight: "400px", overflowY: "scroll", padding: "10px", backgroundColor: "#FFFAF0", margin: "auto" }}>
          <div className="modal-content`11" onClick={(e) => e.stopPropagation()} style={{ marginTop: "10px" }}>
            {/* <button className="modal-close11" onClick={() => setIsModalOpen(false)}>×</button> */}

            <div className="modal-middle-box 11">
              <div className="modalcard-container">
                {photographyAddOns?.addOnProducts.map((item, index) => (
                  <div key={index} className="modalcard">
                    <img
                      // style={{ width: "120px", height: "120px" }}
                      src={item.image}
                      alt={item.title}
                      className="model-image"
                    />
                    <h3>{item.title}</h3>
                    {/* <p>{item.description}</p> */}

                    <div className="price-container">
                      <span className="price">
                        {typeof item.price === "number" ? `₹${item.price}` : "Included"}
                      </span>
                      {typeof item.price === "number" && (
                        itemQuantities[item.title] ? (
                          <div className="quantitycontrols">
                            <button onClick={() => handleRemoveFromCart(item)} className="quantitybutton">-</button>
                            <span className="qunatity-title">{itemQuantities[item.title]}</span>
                            <button onClick={() => handleAddToCart(item)} className="quantitybutton">+</button>
                          </div>
                        ) : (
                          // <button onClick={() => handleAddToCart(item)} className="addbutton">Add</button>
                          <button onClick={() => handleAddToCartAndScrollBack(item)} className="addbutton">Add</button>

                        )
                      )}
                    </div>

                  </div>
                ))}


              </div>
            </div>

          </div>
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
        <div className="confirm-button-wrapper">
          {/* <div className="modal-bottom-box"> */}

          <p style={{ fontWeight: "bold", marginBottom: "0px", color: "black" }}>Total: ₹ {calculateTotalPrice(Number(work?.price))}</p>

          <button className="confirm-button" onClick={() => sendToCheckoutPage(work)}>Continue</button>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
