import React, { useState, useEffect, useCallback } from "react";
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
import axios from 'axios';
import Head from 'next/head';
import  logo  from '../../../../../../assets/new_logo_light.png';
import { useRouter } from "next/router";
import Image from "next/image";
import faqData from '../../../../../../utils/faqData.json'
import Tabs from '../../../../../../components/Tabs';
import addOnProductsData from '../../../../../../utils/addOnProduct.json';
import DecorationCatDetails from "@/pages/balloon-decoration/[catValue]/product/[productName]";

// URL ke pehle segment se city slug nikalo, jaise "/hyderabad/balloon-decoration/..." -> "hyderabad"
function getCitySlugFromPath(pathname) {
  if (!pathname) return "";
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] || "";
}

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


function DecorationCatCityDetails() {
  const [selCat, setSelCat] = useState("");
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

   let {  locality} = router.query;

  // Yeh state hamesha ASLI browser URL se derive hoti hai — chahe
  // navigation Next.js router.push se hua ho, ya CityContext ke
  // window.history.pushState (silent URL change) se — dono cases handle honge.
  const [citySlug, setCitySlug] = useState("");

  const syncCityFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    setCitySlug(getCitySlugFromPath(window.location.pathname));
  }, []);

  // Pehla mount — SSR/hydration ke baad turant sync karo
  useEffect(() => {
    syncCityFromUrl();
  }, [syncCityFromUrl]);

  // Jab Next.js Pages Router khud se route change kare (Link click, router.push)
  useEffect(() => {
    router.events.on("routeChangeComplete", syncCityFromUrl);
    return () => router.events.off("routeChangeComplete", syncCityFromUrl);
  }, [router.events, syncCityFromUrl]);

  // Jab CityContext silently URL change kare (city popup se select karne par)
  useEffect(() => {
    window.addEventListener("city:changed", syncCityFromUrl);
    return () => window.removeEventListener("city:changed", syncCityFromUrl);
  }, [syncCityFromUrl]);

  // Browser back/forward button
  useEffect(() => {
    window.addEventListener("popstate", syncCityFromUrl);
    return () => window.removeEventListener("popstate", syncCityFromUrl);
  }, [syncCityFromUrl]);

  const city = citySlug
    ? citySlug.charAt(0).toUpperCase() + citySlug.slice(1)
    : "";

   // Use useEffect to handle router query (catValue, subCategory, productName)
   useEffect(() => {
    if (router.isReady) {
      const { subCategory: urlSubCategory, catValue: urlCatValue, productName } = router.query;
      const formattedProduct = productName ? productName.replace(/-/g, ' ') : '';
      setApiProduct(formattedProduct);
      setSubCategory(urlSubCategory || '');
      setCatValue(urlCatValue || '');
    }
  }, [router.isReady, router.query]);


  const handleWhatsApp = () => {
    const phoneNumber = '7338584828';
    const message = encodeURIComponent('I want to customize a decoration');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');

  };

  useEffect(() => {
    if (apiProduct && !isFetched) {
      const fetchDecorationDetails = async () => {
        try {
          const url = `${BASE_URL}${GET_DECORATION_BY_NAME}${apiProduct}`;
          const response = await axios.get(url);
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

 

  useEffect(() => {
    addSpaces(subCategory);
  }, [subCategory]);

  useEffect(() => {
    setIsClient(true);
  }, []);


 
console.log(city);


  return (
    <div className="App" style={{ backgroundColor: "#EDEDED" }}>
   
   <DecorationCatDetails city={city} locality={locality}/>
   
  </div>
  );
};



export default DecorationCatCityDetails;