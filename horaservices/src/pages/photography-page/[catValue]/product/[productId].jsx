import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Head from "next/head";
import photographyAddOns from "@/utils/photographyAddOns.json";
import productsData from '@/utils/photoGraphyImages.js';
import { faqData } from '@/utils/photographyFAQData.js'
import { getPhotographyOrganizationSchema } from "@/utils/schema";
// import addOnProductsData from '../../../utils/addOnProduct.json';
import cancellation from "@/assets/Cancellation.svg"
import PROFESSIONALPHOTOGRAPHERS from "@/assets/professionalPhoto.png";
import SECURESTORAGE from "@/assets/secureStorage.png";
import SUPPORT from "@/assets/support.png";
import "./productDetails.css";
import {
  BASE_URL,

} from "@/utils/apiconstants";
import { FaQuestionCircle } from "react-icons/fa";
const ProductDetails = () => {
  const schemaOrg = getPhotographyOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  const router = useRouter();
  const { query } = useRouter();
const productId = query.id;
  const {  product } = router.query;
  console.log(product)
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [addedItems, setAddedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [itemQuantities, setItemQuantities] = useState({});
  const [selectedAddOnProduct, setSelectedAddOnProduct] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const [isArrowDown, setIsArrowDown] = useState(true);
  const images = productsData[productId]?.images || [];
  const duration = productsData[productId]?.duration || "Duration not available";

  const parsedProduct = product ? JSON.parse(product) : null;
  const tagId = parsedProduct?.tag?.[0];
  const addonRef = useRef(null);      // Scroll target inside modal
  const customizationRef = useRef(null);

  const calculateTotalPrice = (productPrice) => {
    let totalPrice = Number(productPrice);
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
    let newTotalAmount = Number(product.price);
    selectedAddOnProduct.forEach(item => {
      newTotalAmount += item.price * itemQuantities[item.title];
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
    if (!Array.isArray(inclusion) || inclusion.length === 0) return null;

    const htmlString = inclusion[0];
    const withoutTags = htmlString.replace(/<[^>]*>/g, '');
    const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, ' ');
    const inclusionItems = withoutSpecialChars
      .split('<div>')
      .flatMap(statement =>
        statement
          .split('-')
          .map(item => item.trim())
          .filter(item => item !== '')
      );

    return (
      <div className="inclusionstyle">
        {inclusionItems.map((item, index) => (
          <div key={index} className="inclusion-line">
            <span className="inclusion-icon">✔</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    );
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
        ProductPrice: product.price,
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
      setWork(data); // everything comes from API now
    } catch (err) {
      console.error("Error fetching product details:", err.message);
      setWork(null);
    } finally {
      setLoading(false);
    }
  };

  fetchProductDetails();
}, [productId]);



  if (loading) return <div className="photodetails-loading" >Loading...</div>;
  if (!work) return <div className="photodetails-loading">Work not found</div>;

  const FAQSection = ({ faqData }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };

    return (
      <div style={{ marginTop: "40px", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", marginLeft: "10px" }}>
          <Image src={cancellation} alt="FAQ Icon" width={25} height={25} />
          <h2
            style={{
              color: "#97538c",
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: "100%",
              letterSpacing: "0%",
              margin: 0,
            }}
          >
            FAQ
          </h2>
        </div>

        {faqData.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "12px 14px",
              // boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              marginBottom: "12px",
              border: openIndex === index ? "1.5px solid #97538c" : "2px solid #ddd",
              transition: "border 0.3s ease",
            }}
          >
            <div
              onClick={() => handleToggle(index)}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: 600,
                fontSize: "15px",
                color: "#3b3b3b",
              }}
            >
              <span>{item.question}</span>

              {/* Smaller Circle with Arrow */}
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  minWidth: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#97538c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "10px",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: "14px",
                    transform: openIndex === index ? "rotate(270deg)" : "rotate(90deg)",
                    transition: "transform 0.3s ease",
                    display: "inline-block",

                  }}
                >
                  &gt;
                </span>
              </div>
            </div>

            {/* Answer Text */}
            {openIndex === index && (
              <div
                style={{
                  marginTop: "10px",
                  color: "#555",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                {item.answer}
                {/* {item.acceptedAnswer.text} */}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };





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
        {images.length > 0 ? (
          images.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`${work?.name || "Product"} image ${idx + 1}`}
              width={400}
              height={300}
            />
          ))
        ) : (
          <p>No images found</p>
        )}
        {/* <img src="/traditionalPhoto.png" alt="Traditional Photography" /> */}
      </div>

      <div className="photodetails-price-section">
        <span className="photodetails-discounted">₹ {work.price}</span>
        {/* <span className="photodetails-original">₹ {Math.floor(work.discountedPrice.toFixed(2))} </span> */}
<span className="photodetails-original">
  ₹ {work.discountedPrice ? Math.floor(Number(work.discountedPrice).toFixed(2)) : Math.floor(Number(work.price).toFixed(2))}
</span>

        <span className="photodetails-offer">₹ {Math.floor(work.discountDifference)} off</span>
      </div>
      <div className='addon-prices' ref={customizationRef}>

        <div className="photodetails-inclusions">
          {selectedAddOnProduct.length > 0 && (
            <>
              <label>Customisations</label>
              <span onClick={showAddOnmodal} style={{ marginLeft: "6px", cursor: "pointer" }}>
                < svg stroke="currentColor" fill="currentColor"   stroke-width="0" viewBox="0 0 576 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"  style={{color: "rgb(146, 82, 170)",verticalAlign: "0px" }}><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" ></path></svg>
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
        </div>
      </div>
      <div className="photodetails-inclusions">
        <h3>Inclusions</h3>
        {getItemInclusion(work.inclusion)}
        <p className="work-duration">
          <b className="Duration">Duration:</b> {duration}
        </p>
      </div>

      <div className="modal-top-box11" ref={addonRef}>
        <h2 className="select-heading-sec">Add Extra Features</h2>
      </div>
      

          <div className="modal-overlay11" onClick={() => setIsModalOpen(false)} style={{ maxHeight: "600px", overflowY: "scroll", padding: "10px", backgroundColor: "#FFFAF0", margin: "auto" }}>
            <div className="modal-content`11" onClick={(e) => e.stopPropagation()} style={{ marginTop: "10px" }}>
              {/* <button className="modal-close11" onClick={() => setIsModalOpen(false)}>×</button> */}

              <div className="modal-middle-box 11">
                <div className="modalcard-container">

                  {photographyAddOns?.addOnProductsById?.[tagId]?.map((item, index) => (
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
      <FAQSection faqData={faqData} />
      <div className="confirm-button-wrapper">
        {/* <div className="modal-bottom-box"> */}

        <p style={{ fontWeight: "bold", marginBottom: "0px", color: "black"}}>Total: ₹ {calculateTotalPrice(Number(work?.price))}</p>

        <button className="confirm-button" onClick={() => sendToCheckoutPage(work)}>Continue</button>
        {/* </div> */}
      </div>
    </div>
    </div>
  );
};

export default ProductDetails;
