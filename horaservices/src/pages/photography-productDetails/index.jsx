import React, { useState, useEffect } from "react";
import buynowImage from '../../assets/experts.png';
import buynowImage1 from '../../assets/secured.png';
import buynowImage2 from '../../assets/service.png';
import checkImage from '../../assets/tick.jpeg';
import { getDecorationProductOrganizationSchema } from "../../utils/schema";
import '../../css/decoration.css';
import { useRouter } from "next/router";
import Image from "next/image";
import { BASE_URL, GET_DECORATION_BY_NAME } from "@/utils/apiconstants";
import axios from 'axios';
import OtpLoginPopup from '../../components/OtpLoginPopup';

function PhotograpgyProdDetails() {
  const [selCat, setSelCat] = useState("");
  const [orderType, setOrderType] = useState(1);
  const router = useRouter();
  const [product, setProduct] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const [subCategory, setSubCategory] = useState('');
  const [catValue, setCatValue] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const { subCategory: urlSubCategory, catValue: urlCatValue, productName } = router.query;
      const formattedProduct = productName ? productName.replace(/-/g, ' ') : '';
      setProduct(formattedProduct);
      setSubCategory(urlSubCategory || '');
      setCatValue(urlCatValue || '');
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (product && !isFetched) {
      const fetchDecorationDetails = async () => {
        try {
          const url = `${BASE_URL}${GET_DECORATION_BY_NAME}${product}`;
          const response = await axios.get(url);
          setProduct(response.data.data[0]);
          setSubCategory(getSubCategory(catValue || ''));
        } catch (error) {
          console.error("Error:", error.message);
        }
      };
      fetchDecorationDetails();
      setIsFetched(true);
    }
  }, [product, catValue, isFetched]);

  const schemaOrg = getDecorationProductOrganizationSchema(product);
  const scriptTag = JSON.stringify(schemaOrg);

  const handleCheckout = (subCategory, product) => {
    const stateData = {
      from: window.location.pathname,
      subCategory,
      product: JSON.stringify(product),
      orderType,
      catValue
    };

    // const destination = localStorage.getItem("isLoggedIn") === "true"
    //   ? '/photography-checkout'
    //   : '/login';

    router.push({
      pathname:'/photography-checkout',
      query: stateData
    });
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
      const parts = catValue.split('-');
      return parts.slice(0, 2)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('');
    }
  }

  useEffect(() => {
    addSpaces(subCategory);
  }, [subCategory]);

  useEffect(() => {
    setIsClient(true);
  }, []);
   const [isModalOpen, setIsModalOpen] = useState(false);  
   const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsModalOpen(true); // Open modal when user is not logged in
    }
  }, [isLoggedIn]); // Run this when `isLoggedIn` changes

  const getItemInclusion = (inclusion) => {
    if (!Array.isArray(inclusion) || inclusion.length === 0) {
      return null;
    }
    const htmlString = inclusion[0];
    const withoutTags = htmlString.replace(/<[^>]*>/g, '');
    const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, ' ');
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

  const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const getRandomRating = () => (Math.random() * (4.8 - 4.1) + 4.1).toFixed(1);

  return (
    <div className="App" style={styles.app}>
        {/* by aarti */}
      {/* <Head>
        <title>Balloon and Flower Decoration @999</title>
        <meta name="description" content="Celebrate Anniversary, Birthday & other Occasions with Candlelight Dinners, Surprises & Balloon Decorations" />
        <meta name="keywords" content="Balloon and Flower Decoration @999" />
        <meta property="og:title" content="Balloon and Flower Decoration by Professional Decorators" />
        <meta property="og:description" content="Celebrate Anniversary, Birthday & other Occasions with Candlelight Dinners, Surprises & Balloon Decorations" />
        <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
        <script type="application/ld+json">{scriptTag}</script>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <meta property="og:url" content={`https://horaservices.com/balloon-decoration/${catValue}/product/${product.name}`} />
        <meta property="og:type" content="website" />
      </Head> */}
         {!isLoggedIn && isModalOpen && <OtpLoginPopup setIsModalOpen={setIsModalOpen} />} 
    {product && product.featured_image ? (
      <div style={styles.container}>
        <div style={styles.decDetails} className="decDetails">
          <div style={styles.decDetailsLeft} className="decDetailsLeft">
            <div style={styles.decDetailsImage} className="decDetailsImage">
              <Image 
                src={product.featured_image} 
                alt="decoration-image" 
                style={{ width: "100%", height: "auto" }} 
                width={300} 
                height={300} 
              />
              <div style={styles.imageOverlay}>
                <span style={{ color: "rgba(157, 74, 147, 0.6)", fontWeight: "600" }}>Hora</span>
              </div>
            </div>
          </div>
          <div style={styles.decDetailsRight} className="decDetailsRight">
            <div style={styles.card}>
              <h2 style={styles.heading}>{'Home'}{' > '}{"Enter"}{' > '}{product.name}</h2>
              <h1 style={styles.productName}>{product.name}</h1>
              <p style={styles.price}> ₹ {product.price}</p>
            </div>
            <div style={styles.card}>
              {getItemInclusion(product.inclusion)}
              <button style={styles.Buttonstyle} className="dec-continueButton" onClick={() => handleCheckout(subCategory, product)}>Continue</button>
            </div>
            <div style={styles.card} className="whyHoraSec">
              <p style={styles.whyHoraHeading} className="whyHoraHeading">Why Hora</p>
              <div style={styles.whyHoraSecInner} className="whyHoraSecInner">
                <div className="whyHoraSecBox">
                  <Image src={buynowImage} alt="buy-now" style={{ height: "auto" }} />
                  <p style={styles.whyHoraSubheading} className="whyHoraSubheading">Experts Decorations</p>
                </div>
                <div className="whyHoraSecBox">
                  <Image src={buynowImage1} alt="buy-now" style={{ height: "auto" }} />
                  <p style={styles.whyHoraSubheading} className="whyHoraSubheading">Secured Transactions</p>
                </div>
                <div className="whyHoraSecBox">
                  <Image src={buynowImage2} alt="buy-now" style={{ height: "auto" }} />
                  <p style={styles.whyHoraSubheading} className="whyHoraSubheading">100% Service Guaranteed</p>
                </div>
              </div>
            </div>
            <div style={styles.card} className="canceltionPolicy">
              <p style={styles.cancellationPolicyHeading} className="cancelltionPolicySecHeading">Cancellation and Order Change Policy:</p>
              <p style={styles.cancellationPolicyText} className="cancelltionPolicySecSubHeading">- Till the order is not assigned to service provider, 100% of the amount will be refunded, otherwise 50% of advance will be deducted as cancellation charge.</p>
              <p style={styles.cancellationPolicyText} className="cancelltionPolicySecSubHeading">- The order cannot be edited after paying advance. Customer can cancel the order and replace the new order with required changes.</p>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <p>Loading image...</p>
    )}
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
  app: {
    backgroundColor: "#EDEDED",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  decDetails: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "10px",
    position: "relative",
  },
  decDetailsLeft: {
    width: "50%",
    textAlign: "center",
  },
  decDetailsImage: {
    width: "80%",
    boxShadow: "0 1px 8px rgba(0,0,0,.18)",
    padding: "10px",
    margin: "0 auto",
    position: "relative",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: "50%",
    padding: 10,
  },
  decDetailsRight: {
    width: "50%",
    paddingLeft: "20px",
    paddingRight: "50px",
  },
  card: {
    boxShadow: "0 1px 8px rgba(0,0,0,.18)",
    padding: "10px",
    marginBottom: "12px",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: "12px",
    color: "#9252AA",
  },
  productName: {
    fontSize: "21px",
    color: "#222",
    fontWeight: "bold",
  },
  price: {
    fontSize: "18px",
    color: "#9252AA",
    fontWeight: "600",
  },
  Buttonstyle: {
    backgroundColor: "#9252AA",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "600",
    borderRadius: "4px",
  },
  whyHoraHeading: {
    fontSize: "21px",
    color: "rgb(34, 34, 34)",
    borderBottom: "1px solid #e7eff9",
  },
  whyHoraSecInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  whyHoraSubheading: {
    color: "gray",
    fontSize: "12px",
  },
  cancellationPolicyHeading: {
    fontSize: "21px",
    color: "rgb(34, 34, 34)",
    borderBottom: "1px solid #e7eff9",
  },
  cancellationPolicyText: {
    fontSize: "14px",
    color: "#555",
  },

};

export default PhotograpgyProdDetails;