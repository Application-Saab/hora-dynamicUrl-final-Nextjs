import React, { useState, useEffect } from "react";
// import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { MessageCircle, Plus , ArrowDown , ArrowUp} from 'lucide-react';
import buynowImage from '../../../../../../assets/experts.png';
import buynowImage1 from '../../../../../../assets/secured.png';
import buynowImage2 from '../../../../../../assets/service.png';
import checkImage from '../../../../../../assets/tick.jpeg';
import { getDecorationProductOrganizationSchema , getProductFAQSchemaProductDetails} from "../../../../../../utils/schema";
import '../../../../../../css/decoration.css';
import { useSelector } from 'react-redux';
import { BASE_URL, GET_DECORATION_BY_NAME } from "@/utils/apiconstants";
import Head from 'next/head';
import  logo  from '../../../../../../assets/new_logo_light.png';
import { useRouter } from "next/router";
import Image from "next/image";
import faqData from '../../../../../../utils/faqData.json'
import Tabs from '../../../../../../components/Tabs';
import addOnProductsData from '../../../../../../utils/addOnProduct.json';
import axiosApi from "@/utils/axiosApi";

// Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <div className="skeleton-loader" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "20px", paddingBottom: "20px", position: "relative" }} className="decDetails">
        <div style={{ width: "50%", textAlign: "center" }} className="decDetailsLeft">
          <div style={{ width: "80%", height: "300px", backgroundColor: "#f0f0f0", margin: "0 auto", position: "relative" }} />
        </div>
        <div style={{ width: "50%", paddingLeft: "20px", paddingRight: "50px" }} className="decDetailsRight">
          <div style={{ height: "20px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "60%", borderRadius: "4px" }} className="decDetailsRightInner" />
          <div style={{ height: "30px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "40%", borderRadius: "4px" }} className="decDetailsRightInner" />
          <div style={{ height: "20px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "80%", borderRadius: "4px" }} className="decDetailsRightInner" />
          <div style={{ height: "30px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "60%", borderRadius: "4px" }} className="decDetailsRightInner" />
          <div style={{ height: "20px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "60%", borderRadius: "4px" }} className="decDetailsRightInner" />
          <div style={{ height: "50px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "60%", borderRadius: "4px" }} className="decDetailsRightInner" />
          <div style={{ height: "20px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "60%", borderRadius: "4px" }} className="decDetailsRightInner" />
          <div style={{ height: "50px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "60%", borderRadius: "4px" }} className="decDetailsRightInner" />
          <div style={{ height: "50px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "100%", borderRadius: "4px" }} className="decDetailsRightInner" />
          <div style={{ height: "50px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "100%", borderRadius: "4px" }} className="decDetailsRightInner" />
        </div>
      </div>
    </div>
  );
};


function DecorationCatDetails() {
  const [selCat, setSelCat] = useState("");
  const [city, setCity] = useState("");
  const [isArrowDown, setIsArrowDown] = useState(true);
  const [orderType, setOrderType] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedAddOnProduct, setSelectedAddOnProduct] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [totalAmount, setTotalAmount] = useState();
  const [buttonClickCount, setButtonClickCount] = useState(0);
  const router = useRouter();
  const [product, setProduct] = useState('');
  const [apiProduct, setApiProduct] = useState('');
  const [isFetched, setIsFetched] = useState(false)
  const [subCategory, setSubCategory] = useState('');
  const [catValue, setCatValue] = useState('');
  const altTagCatValue = catValue.replace(/-/g, ' ');
  const [discountInfo, setDiscountInfo] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state



   // Use useEffect to handle router query
   useEffect(() => {
    if (router.isReady) {
      const { subCategory: urlSubCategory, catValue: urlCatValue, productName , city } = router.query;
      const formattedProduct = productName ? productName.replace(/-/g, ' ') : '';
      setApiProduct(formattedProduct);
      setSubCategory(urlSubCategory || '');
      setCatValue(urlCatValue || '');
      setCity(city)
    }
  }, [router.isReady, router.query]);


  const handleWhatsApp = () => {
    const phoneNumber = '7338584828';
    const message = encodeURIComponent('I want to customize a decoration');
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'city_youtube_product_detail_decorwhatsapp_click',
    });  
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  useEffect(() => {
    if (apiProduct && !isFetched) {
      const fetchDecorationDetails = async () => {
        try {
          const url = `${BASE_URL}${GET_DECORATION_BY_NAME}${apiProduct}`;
          const response = await axiosApi.get(url);
          console.log("API Response:", response.data);
          
          // Assuming the product has a price property
          const fetchedProduct = response.data.data[0];
          setProduct(fetchedProduct);
          setSubCategory(getSubCategory(catValue || ''));
  
          // Calculate discount info if price is available
          if (fetchedProduct && fetchedProduct.price) {
            const price = fetchedProduct.price;

            const discountDetails = getDiscountedPrice(price);
            setDiscountInfo(discountDetails);
          } else {
            console.error("Price is not available in the fetched product.");
          }
  
          setLoading(false); // Stop loading when data is fetched
        } catch (error) {
          console.error("Error:", error.message);
          setLoading(false); // Stop loading even if there is an error
        }
      };
  
      fetchDecorationDetails();
    }
  }, [apiProduct, catValue, isFetched]);
  
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
  
    const discountedPrice = parseFloat(price) * (1 + parseFloat(discount) / 100); // Calculate the discounted price
    const discountDifference = Math.abs(parseFloat(price) - discountedPrice); // Get the absolute difference
  
    return { discount, discountedPrice, discountDifference }; // Return discount percentage, discounted price, and discount difference
  };
  
  const schemaOrg = getDecorationProductOrganizationSchema(product);
  const scriptTag = JSON.stringify(schemaOrg);
  const faqSchema = getProductFAQSchemaProductDetails(product);
  const faqScriptTag = JSON.stringify(faqSchema);
  const [isClient, setIsClient] = useState(false);


  const showAddOnmodal = () => {
    setIsModalOpen(prevState => !prevState);
    setIsArrowDown(!isArrowDown);
  };
  const updateTotalAmount = () => {
    let newTotalAmount = Number(product.price);
    selectedAddOnProduct.forEach(item => {
      newTotalAmount += item.price * itemQuantities[item.title];
    });
    setTotalAmount(newTotalAmount);
  };

  useEffect(() => {
    updateTotalAmount();
  }, [selectedAddOnProduct, itemQuantities, product.price]);

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


  const calculateTotalPrice = (productPrice) => {
    let totalPrice = Number(productPrice); // Ensure productPrice is a number
    selectedAddOnProduct.forEach(item => {
      totalPrice += item.price * itemQuantities[item.title];
    });
    return totalPrice;
  };

  const handleContinue = () => {
    setIsModalOpen(false);
  }
  
  
  const handleButtonClick = (subCategory, product) => {
    //if (buttonClickCount === 0) {
     // showAddOnmodal(subCategory, product);
    // console.log("continue clicked");
   // } else 
   // {
      handleCheckout(subCategory, product);
   // }
    setButtonClickCount(buttonClickCount + 1);
  };
  const handleAddOnClick = (subCategory, product) => {
    showAddOnmodal(subCategory, product);
  }

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const FAQSection = ({ faqData }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };

    return (
      <div className="faqSection">
        {faqData.map((item, index) => (
          <div key={index} className="faqItem">
            <div onClick={() => handleToggle(index)} style={{ cursor: 'pointer' }}>
              <h3>{item.name}</h3>
              <span>{openIndex === index ? "-" : "+"}</span>
            </div>
            {openIndex === index && (
              <div>
                <p>{item.acceptedAnswer.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const tabs = [
    {
      id: 'faq',
      title: 'FAQ',
      content: <FAQSection faqData={faqData} />,
    },
    {
      id: 'whyHora',
      title: 'Why Hora',
      content: (
        <div className="whyHoraSec">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} className="whyHoraSecInner">
            <div className="whyHoraSecBox">
              <Image src={buynowImage} alt="buy-now" style={{ height: "auto" }} />
              <p style={{ color: "gray", fontSize: "12px" }} className="whyHoraSubheading">Experts Decorations</p>
            </div>
            <div className="whyHoraSecBox">
              <Image src={buynowImage1} alt="buy-now" style={{ height: "auto" }} />
              <p style={{ color: "gray", fontSize: "12px" }} className="whyHoraSubheading">Secured Transactions</p>
            </div>
            <div className="whyHoraSecBox">
              <Image src={buynowImage2} alt="buy-now" style={{ height: "auto" }} />
              <p style={{ color: "gray", fontSize: "12px" }} className="whyHoraSubheading">100% Service Guaranteed</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'cancellationPolicy',
      title: 'Cancellation Policy',
      content: (
        <div className="canceltionPolicy">
           <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)"   }} className=' text-left m-1'>Cancellation and order change policy</p>
                    <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className='m-1'>1. If the order is beyong 48 Hours: You are eligible for a 100% refund of the advance payment</p>
                    <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className='m-1'>2. If the order is cancelled more than 24 hours before the scheduled delivery: You will not receive refund of the advance payment.</p>
                    <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className='m-1'>3. If the order is cancelled within 24 hours: The full advance amount will be non-refundable, and 100% of the payment for decoration has to be paid by customer.</p>
                       
        </div>
      ),
    },
  ];


  const handleCheckout = (subCategory, product, selectedAddOnProduct) => {
    const stateData = {
      from: window.location.pathname,
      subCategory,
      product: JSON.stringify(product),
      orderType,
      catValue,
      selectedAddOnProduct: JSON.stringify(selectedAddOnProduct),
      itemQuantities: JSON.stringify(itemQuantities),
      totalAmount: totalAmount,
    };

    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.push({
        pathname: '/login',
        query: {
          from: window.location.pathname,
          subCategory,
          product: JSON.stringify(product),
          orderType,
          catValue,
          selectedAddOnProduct: JSON.stringify(selectedAddOnProduct),
          itemQuantities: JSON.stringify(itemQuantities),
          totalAmount: totalAmount,
        }
      });
    } else {
      router.push({
        pathname: '/checkout',
        query: {
          from: window.location.pathname,
          subCategory,
          product: JSON.stringify(product),
          orderType,
          catValue,
          selectedAddOnProduct: JSON.stringify(selectedAddOnProduct),
          itemQuantities: JSON.stringify(itemQuantities),
          totalAmount: totalAmount,
        }
      });
    }
  };
 

  function addSpaces(subCategory) {
    let result = "";
    for (let i = 0; i < subCategory?.length; i++) {
      if (i !== 0 && subCategory[i] === subCategory[i].toUpperCase()) {
        result += " ";
      }
      result += subCategory[i];
    }
    setSelCat(result);
  }

  function getSubCategory(catValue) {
    if (catValue === 'birthday-decoration') {
      return 'Birthday';
    } else if (catValue === 'anniversary-decoration') {
      return 'Anniversary';
    } else {
      const parts = catValue.split('-'); // Split by hyphens
      return parts.slice(0, 2) // Take only the first two parts
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Capitalize each part
        .join(''); // Join parts together without spaces
    }
  }

  function getSimilarProducts(product){
    console.log("product" , product);
  }


  useEffect(() => {
    addSpaces(subCategory);
  }, [subCategory]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getItemInclusion = (inclusion) => {
    if (!Array.isArray(inclusion) || inclusion.length === 0) {
      return null;
    }
    const htmlString = inclusion[0];
    const withoutTags = htmlString.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, ' '); // Replace &# sequences with space
    const statements = withoutSpecialChars.split('<div>');
    const inclusionItems = statements.flatMap(statement => statement.split("-").filter(item => item.trim() !== ''));
    const inclusionList = inclusionItems.map((item, index) => (
      <li key={index} className="inclusionstyle">
        <Image src={checkImage} alt="Info" style={{ height: 13, width: 13, marginRight: 10 }} />
        {item.trim()}
      </li>
    ));
    return (
      <div>
        <div style={{ fontSize: "21px", borderBottom: "1px solid #e7eff9", marginBottom: "10px" }}>Inclusions</div>
        <ul>
          {inclusionList}
        </ul>
      </div>

    );
  };

  // Function to generate a random number between min and max (inclusive)
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Function to generate a random rating between 4.1 to 4.8
  const getRandomRating = () => {
    return (Math.random() * (4.8 - 4.1) + 4.1).toFixed(1);
  };

  if (loading) {
    return <SkeletonLoader />; // Show skeleton loader while loading
  }


  return (
    <div className="App" style={{ backgroundColor: "#EDEDED" }}>
    <Head>
      <title>Balloon and Flower Decoration @999 in {city}</title>
      <meta name="description" content="Celebrate Anniversary, Birthday & other Occasions with Candlelight Dinners, Surprises & Balloon Decorations"  />
      <meta name="keywords" content="Balloon and Flower Decoration @ ₹999" />
      <meta property="og:title" content="Balloon and Flower Decoration by Professional Decorators" />
      <meta property="og:description" content="Celebrate Anniversary, Birthday & other Occasions with Candlelight Dinners, Surprises & Balloon Decorations" />
      <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
      <script type="application/ld+json">{scriptTag}</script>
      <script type="application/ld+json">{faqScriptTag}</script>
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Hora Services" />
      <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
      <meta property="og:url" content={`https://horaservices.com/balloon-decoration/${catValue}/product/${product.name}`} />
      <meta property="og:type" content="website" />
    </Head>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "10px", position: "relative" }} className="decDetails">
        <div style={{ width: "50%", textAlign: "center" }} className="decDetailsLeft">
          <div style={{ width: "80%", boxShadow: "0 1px 8px rgba(0,0,0,.1)", padding: "10px", margin: "0 auto", position: "relative" }} className="decDetailsImage">
            <div>
            <Image src={`https://horaservices.com/api/uploads/${product.featured_image}`} alt={`balloon decoration ${altTagCatValue} ${product.name} ${product.price}`} style={{ width: "100%", height: "auto" }} width={300} height={300} />
            <div style={{ position: "absolute", bottom: 3, right: 3, borderRadius: "50%", padding: 10 }}>
                      <span style={{ color: "rgba(157, 74, 147, 0.6)", fontWeight: "600" }}>
                      <Image src={logo} style={{ width:"70px" , height:"80px"}} className="hora-watermark-image"/>  
                      </span>
                    </div>
            </div>
           
          </div>
          <div style={{ border:"1px solid rgb(220, 53, 69)", backgroundColor:"rgb(248, 215, 218)" , margin:"13px auto 7px" , padding:"10px 10px 11px 16px" , borderRadius:10 , width:"80%" , textAlign:"left"}} className="inclusiton-details desktop-view">
        <p style={{ marginBottom:"0" , fontWeight:"bold" , fontSize:12}}>Note:</p>
        <p style={{ margin:"4px 0 0 0" , padding:0 , fontWeight:"700" , fontSize:13 , color:"#444" , fontWeight:700}}>*Balloons color can be changed as per your choice.*</p>
        <p style={{ margin:"4px 0 0 0" , padding:0 , fontWeight:"700" , fontSize:13 , color:"#444" , fontWeight:700}}>*Neon lights can be changed for the event (if  included in the design).*</p>
        <p style={{ margin:"4px 0 0 0" , padding:0 , fontWeight:"700" , fontSize:13 , color:"#444" , fontWeight:700}}>*Age numbers and name are customizable (if included in the design).*</p>

        </div>
        </div>
        <div style={{ width: "50%", paddingLeft: "20px", paddingRight: "50px" }} className="decDetailsRight">
          <div style={{ boxShadow: "0 1px 8px rgba(0,0,0,.18)", padding: "10px", marginBottom: "12px", backgroundColor: "#fff" }}>
            <h2 style={{ fontSize: "13px", color: "#222" , margin:"5px 0 5px 0" , fontWeight:"500" }}>
            <a style={{ color: "#9252AA", textDecoration: "none" }} href="/">Home</a>
            {' > '}
            <a style={{ color: "#9252AA", textDecoration: "none" }} href={`/balloon-decoration/${catValue}`}>
            {subCategory}</a>

            {' > '}
            <span>{product.name}</span>
            </h2>
            <h1 style={{ fontSize: "16px", color: "#222", fontSize: "21px", fontWeight: "#222" }}>{product.name}</h1>
            <div className="pro-details-price">
            <p  style={{ fontSize: "18px", color: "#9252AA", fontWeight: "600" }}> ₹ {product.price}</p>
            <p style={{
                          color: '#444',
                          fontWeight: '700',
                          fontSize: 18,
                          textAlign: "left",
                          margin: "10px 0px 7px",
                          textDecoration: 'line-through'
                        }}
                        >
                           ₹ {Math.floor(discountInfo?.discountedPrice)}
                        </p>
                        <div className="decorationdiscount-details">
                    ₹ {Math.floor(discountInfo?.discountDifference || 0)} {'off'}
                    </div>
            </div>

            {selectedAddOnProduct.length == 0 && (
              <button style={styles.Buttonstyle} id="continueButton" className="dec-continueButton" onClick={() => handleButtonClick(subCategory, product)}>Continue</button>
            )}
            
                      
            {/* <div className="d-flex align-items-center pro-rating-sec">
            <p className="m-0 p-0 pe-3 pro-rating-sec1" style={{ fontWeight: '500', fontSize: 17, margin: "0px", color:"#9252AA" }}>{getRandomRating()}<span className='px-1 m-0 py-0 img-fluid' style={{ color: '#FFBF00' }}><FontAwesomeIcon style={{ margin: 0 }} icon={faStar} /></span></p>
            <p className="m-0 p-0" style={{ color: '#9252AA', fontWeight: '500', fontSize: 17, margin: "0px", padding: "0 0 0 10px" }}>({getRandomNumber(20, 500)})</p>
          </div> */}
         
          </div>


          {selectedAddOnProduct.length > 0 && (
            <ul className="decoration-addons">
              <>
                <div className="addon-sec">
                  <h1 style={{ color: "#222", fontSize: "16px", fontWeight: "#222" }}>{product.name} : </h1>
                  <div style={{ fontSize: "16px", color: "#222", fontWeight: "600" }}> ₹ {product.price}</div>
                </div>
                <h6>Customisations
                  <span onClick={showAddOnmodal} style={{ marginLeft: "6px", cursor: "pointer" }}>
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path></svg>
                  </span>
                </h6>
                {selectedAddOnProduct.map((item, index) => (
                  <li key={index} className="addon-sec">
                    <div>
                      {item.title} :
                    </div>
                    <div>
                      ₹ {item.price} x {itemQuantities[item.title]} = ₹ {item.price * itemQuantities[item.title]}
                    </div>
                  </li>
                ))}
                <p style={{ fontSize: "18px", color: "#9252AA", fontWeight: "600" }} className="addon-sec">
                  <div>
                    Total:
                  </div>
                  <div>
                    ₹ {totalAmount}
                  </div>

                </p>
                
                <button style={styles.Buttonstyle}  id="continueButton"  className="dec-continueButton" onClick={() => handleCheckout(subCategory, product, selectedAddOnProduct)}>Continue</button>
                  
                </>
            </ul>
          )}






          <div style={{ boxShadow: "0 1px 8px rgba(0,0,0,.18)", padding: "10px", marginBottom: "12px", backgroundColor: "#fff" }}>
            {getItemInclusion(product.inclusion)}

            <div style={{ border:"1px solid rgb(220, 53, 69)", backgroundColor:"rgb(248, 215, 218)" , margin:"13px 2px 7px" , padding:"7px 7px" , borderRadius:10 , textAlign:"left" , margin:"10px auto" , width:"100%"}} className="inclusiton-details mobile-view">
        <p style={{ marginBottom:"0" , fontWeight:"bold" , fontSize:12}}>Note:</p>
        <p style={{ margin:"4px 0 0 0" , padding:0 , fontWeight:"700" , fontSize:12 , color:"#444" , fontWeight:700}}>*Balloons color can be changed as per your choice.*</p>
        <p style={{ margin:"4px 0 0 0" , padding:0 , fontWeight:"700" , fontSize:12 , color:"#444" , fontWeight:700}}>*Neon lights can be changed for the event (if  included in the design).*</p>
        <p style={{ margin:"4px 0 0 0" , padding:0 , fontWeight:"700" , fontSize:12 , color:"#444" , fontWeight:700}}>*Age numbers and name are customizable (if included in the design).*</p>

        </div>
            
         
          </div>

    <div className="card-container-cta">
    <div className="header-section-cta">
      <div className="addon-section-buttons">
      <div className="icon-wrapper-cta">
        <span className="user-icon-cta">👤</span>
      </div>
      <p className="header-text-cta">
        Want to <span className="highlight-cta">customize</span> this decoration?
        {/* <p className="subtext-cta">Talk with our Experts!</p> */}
      </p>
      </div>
            
     
    </div>
   
    <div className="button-group-cta">
      <button onClick={showAddOnmodal} className="button-cta call-cta">
          
              
      {isArrowDown ? (
        <ArrowDown className="icon-cta down-icon" />
      ) : (
        <ArrowUp className="icon-cta up-icon" />
      )}
          Decor Upgrade's
        </button>
        <button onClick={handleWhatsApp} className="button-cta whatsapp-cta">
          <MessageCircle className="icon-cta" />
          Whatsapp
        </button>           
      
      
      </div>
      <div className="addon-sec">
             {isModalOpen && (
             <div className="modal-overlay11" onClick={() => setIsModalOpen(false)} style={{ maxHeight:"500px" , overflowY:"scroll"}}>
          <div className="modal-content`11" onClick={(e) => e.stopPropagation()} style={{ marginTop:"10px"}}>
            {/* <button className="modal-close11" onClick={() => setIsModalOpen(false)}>×</button> */}
            <div className="modal-top-box11">
              <h2 style={{ fontSize:16 , fontWeight:600}} className="select-heading-sec">Please select here to add in your decoration</h2>
            </div>
            <div className="modal-middle-box 11">
              <div className="modal-card-container">
                {addOnProductsData.addOnProducts.map((item, index) => (
                  <div key={index} className="modal-card">
                    <img style={{ width: "120px", height: "120px" }} src={item.image} alt={item.title} className="model-image" />
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>

                    <div className="price-container">
                      <span className="price">₹ {item.price}</span>
                      {itemQuantities[item.title] ? (
                        <div>
                          <button onClick={() => handleRemoveFromCart(item)} className="quantity-button">-</button>
                          <span>{itemQuantities[item.title]}</span>
                          <button onClick={() => handleAddToCart(item)} className="quantity-button">+</button>
                        </div>
                      ) : (
                        <button onClick={() => handleAddToCart(item)} className="add-button">Add</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-bottom-box">

              <p>Total: ₹ {calculateTotalPrice(Number(product.price))}</p>
              <button className="book-now-button" onClick={handleContinue}>Continue</button>
            </div>
          </div>
        </div>
       )} 
        </div>
  </div>



          <div className="tab-section-details-productpage">
            <Tabs
              tabs={tabs}
              defaultTab="faq"
              className="faqtabs"
            />
          </div>

          {/* <div className="similar-products">
            <h2>Similar Products</h2>
            {getSimilarProducts(product)}
          </div> */}

        </div>
      </div>
    </div>

  <div>
  
              </div> 

   
  </div>
  );
};

const styles = {
  Buttonstyle: {
    border: "2px solid rgb(157, 74, 147)",
    backgroundColor: "rgb(157, 74, 147)",
    color: "#fff",
    fontSize: "16px",
    padding: "10px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "23px auto 14px",
    width: "93%",
  },
};

export default DecorationCatDetails;