import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

import photographyAddOns from "../../../utils/photographyAddOns.json";
import productsData from '../../../utils/photoGraphyImages.js';
import { faqData } from '../../../utils/photographyFAQData.js'
// import addOnProductsData from '../../../utils/addOnProduct.json';
import cancellation from "../../../assets/Cancellation.svg"
import PROFESSIONALPHOTOGRAPHERS from "../../../assets/professionalPhoto.png";
import SECURESTORAGE from "../../../assets/secureStorage.png";
import SUPPORT from "../../../assets/support.png";
import "./productDetails.css";
import { FaQuestionCircle } from "react-icons/fa";
const ProductDetails = () => {
  const router = useRouter();
  const { productId, product } = router.query;
  console.log(product)
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [addedItems, setAddedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [itemQuantities, setItemQuantities] = useState({});
  const [selectedAddOnProduct, setSelectedAddOnProduct] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const images = productsData[productId]?.images || [];
  const duration = productsData[productId]?.duration || "Duration not available";

  const parsedProduct = product ? JSON.parse(product) : null;
  const tagId = parsedProduct?.tag?.[0];

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
    const fetchFromBackup = async () => {
      try {
        const res = await axios.get(
          'https://horaservices.com:3000/api/photography/searchByTag/66c96b4e22ed47b72117e09a'
        );
        const allWorks = res.data.data;
        const matched = allWorks.find((item) => item._id === productId);
        if (matched) {
          const price = Number(matched.price);
          const { discount, discountedPrice, discountDifference } = getDiscountedPrice(price);
          setWork({
            ...matched,
            price,
            discountedPrice,
            discountPercentage: discount,
            discountDifference,
          });
        }
      } catch (err) {
        console.error("Backup fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (product) {
      try {
        const parsed = JSON.parse(product);
        const price = Number(parsed.price);
        const { discount, discountedPrice, discountDifference } = getDiscountedPrice(price);
        setWork({
          ...parsed,
          price,
          discountedPrice,
          discountPercentage: discount,
          discountDifference,
        });
        setLoading(false);
      } catch (err) {
        console.error("Invalid product JSON in query:", err);
        fetchFromBackup();
      }
    } else {
      fetchFromBackup();
    }
  }, [product, productId]);

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
        <span className="photodetails-original">₹ {Math.floor(work.discountedPrice.toFixed(2))} </span>

        <span className="photodetails-offer">₹ {Math.floor(work.discountDifference)} off</span>
      </div>
 <div className='add-on-prices'>

                        <div>
                          {selectedAddOnProduct.length > 0 && (
                            <>
                              <label>Customisations</label>
                              {selectedAddOnProduct.map((item, index) => (
                                <li key={index}>
                                  <div>
                                    {item.title}
                                  </div>
                                  <div>
                                    ₹ {item.price} x {itemQuantities[item.title]} = ₹ {item.price * itemQuantities[item.title]}

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
        {getItemInclusion(work.inclusion)}
        <p className="work-duration">
          <b className="Duration">Duration:</b> {duration}
        </p>
      </div>

 <div className="modal-top-box11">
                <h2 style={{ fontSize: 16, fontWeight: 600 }} className="select-heading-sec">Add Extra Features</h2>
              </div>
      <div className="addon-sec">
        {isModalOpen && (
          
          <div className="modal-overlay11" onClick={() => setIsModalOpen(false)} style={{ maxHeight: "600px", overflowY: "scroll" ,padding:"10px"}}>
            <div className="modal-content`11" onClick={(e) => e.stopPropagation()} style={{ marginTop: "10px" }}>
              {/* <button className="modal-close11" onClick={() => setIsModalOpen(false)}>×</button> */}
             
              <div className="modal-middle-box 11">
                <div className="modal-card-container">

                  {photographyAddOns?.addOnProductsById?.[tagId]?.map((item, index) => (
                    <div key={index} className="modal-card">
                      <img
                        style={{ width: "120px", height: "120px" }}
                        src={item.image}
                        alt={item.title}
                        className="model-image"
                      />
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>

                      <div className="price-container">
                        <span className="price">
                          {typeof item.price === "number" ? `₹ ${item.price}` : "Included"}
                        </span>

                        {typeof item.price === "number" && (
                          itemQuantities[item.title] ? (
                            <div>
                              <button onClick={() => handleRemoveFromCart(item)} className="quantity-button">-</button>
                              <span className='qunatity-title'>{itemQuantities[item.title]}</span>
                              <button onClick={() => handleAddToCart(item)} className="quantity-button">+</button>
                            </div>
                          ) : (
                            <button onClick={() => handleAddToCart(item)} className="add-button">Add</button>
                          )
                        )}
                      </div>
                    </div>
                  ))}


                </div>
              </div>

            </div>
          </div>
        )}
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

        <p>Total: ₹ {calculateTotalPrice(Number(work?.price))}</p>

        <button className="confirm-button" onClick={() => sendToCheckoutPage(work)}>Continue</button>
      {/* </div> */}
    </div>
    </div>
  );
};

export default ProductDetails;
