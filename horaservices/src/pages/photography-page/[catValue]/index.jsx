import Image from "next/image";
import React, { useEffect, useState } from "react";
import {faqData} from "@/utils/photographyFAQData";
import buynowImage from "../../../assets/experts.png";
import buynowImage1 from "../../../assets/secured.png";
import buynowImage2 from "../../../assets/service.png";
import Tabs from "../../../components/Tabs";
import "../../../css/decoration.css";
import logo from "../../../assets/new_logo_light.png";
import { useRouter } from "next/router";
import { GetItemInclusion } from "@/utils/getItemInclusion";
import { getDiscountedPrice } from "@/utils/getDiscountedPrice";

const PhotographyFAQSection = ({faqData}) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faqSection">
      {faqData.map((item, index) => (
        <div key={index} className="faqItem">
          <div
            onClick={() => handleToggle(index)}
            style={{ cursor: "pointer" }}
          >
            <h3>{item.question}</h3>
            <span>{openIndex === index ? "-" : "+"}</span>
          </div>
          {openIndex === index && (
            <div>
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


const PhotographDetail = () => {
  const router = useRouter();
  const [productData, setProductData] = useState();
  const tabs = [
    {
      id: "faq",
      title: "FAQ",
      content: <PhotographyFAQSection faqData={faqData} />,
    },
    {
      id: "whyHora",
      title: "Why Hora",
      content: (
        <div className="whyHoraSec">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            className="whyHoraSecInner"
          >
            <div className="whyHoraSecBox">
              <Image
                src={buynowImage}
                alt="buy-now"
                style={{ height: "auto" }}
              />
              <p
                style={{ color: "gray", fontSize: "12px" }}
                className="whyHoraSubheading"
              >
                Experts Decorations
              </p>
            </div>
            <div className="whyHoraSecBox">
              <Image
                src={buynowImage1}
                alt="buy-now"
                style={{ height: "auto" }}
              />
              <p
                style={{ color: "gray", fontSize: "12px" }}
                className="whyHoraSubheading"
              >
                Secured Transactions
              </p>
            </div>
            <div className="whyHoraSecBox">
              <Image
                src={buynowImage2}
                alt="buy-now"
                style={{ height: "auto" }}
              />
              <p
                style={{ color: "gray", fontSize: "12px" }}
                className="whyHoraSubheading"
              >
                100% Service Guaranteed
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "cancellationPolicy",
      title: "Cancellation Policy",
      content: (
        <div className="canceltionPolicy">
          <p
            style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }}
            className=" text-left m-1"
          >
            Cancellation and order change policy
          </p>
          <p
            style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }}
            className="m-1"
          >
            1. If the order is beyong 48 Hours: You are eligible for a 100%
            refund of the advance payment
          </p>
          <p
            style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }}
            className="m-1"
          >
            2. If the order is cancelled more than 24 hours before the scheduled
            delivery: You will not receive refund of the advance payment.
          </p>
          <p
            style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }}
            className="m-1"
          >
            3. If the order is cancelled within 24 hours: The full advance
            amount will be non-refundable, and 100% of the payment for
            photographer has to be paid by customer.
          </p>
        </div>
      ),
    },
  ];

  const handleCheckout = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "book_now_click",
      product_name: productData?.name,
    });
    router.push({
      pathname: '/photography-checkout',
      query: {
        from: window.location.pathname,
        product: JSON.stringify(productData),
        totalAmount: productData.price,
      }
    });
  };

  useEffect(() => {
    if (router.isReady) {
      const { product } = router.query;
      const data=JSON.parse(product);
      setProductData(data);
    }
  }, [router.isReady, router.query]);


  return (
    <div className="container my-4 decDetails">
      <div className="row">
        {/* Left Side: Image */}
        <div className="col-md-6 decDetailsLeft ">
          <div
            style={{
              width: "80%",
              boxShadow: "0 1px 8px rgba(0,0,0,.1)",
              padding: "10px",
              margin: "0 auto",
              position: "relative",
            }}
            className="decDetailsImage"
          >
            <div>
              <Image
                src="https://geeksui.codescandy.com/geeks/assets/images/placeholder/placeholder-4by3.svg"
                 className="img-fluid"
                alt={`photography`}
                // style={{ width: "100%", height: "auto" }}
                width={500}
                height={500}
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
                    style={{ width: "70px", height: "80px" }}
                    className="hora-watermark-image"
                  />
                </span>
              </div>
            </div>
          </div>
         
        </div>

        {/* Right Side: Info */}
        <div
          style={{ paddingLeft: "20px", paddingRight: "50px" }}
          className="col-md-6 decDetailsRight mt-4 mt-lg-0"
        >
          <div
            style={{
              boxShadow: "0 1px 8px rgba(0,0,0,.18)",
              padding: "10px",
              marginBottom: "12px",
              backgroundColor: "#fff",
            }}
          >
            <h2
              style={{
                fontSize: "13px",
                color: "#222",
                margin: "5px 0 5px 0",
                fontWeight: "500",
              }}
            >
              <a style={{ color: "#9252AA", textDecoration: "none" }} href="/">
                Home
              </a>
              {" > "}
               <a style={{ color: "#9252AA", textDecoration: "none" }} href="/photography-page">
                photography-page
              </a>
              {" > "}
             

              <span>{productData?.name.toLowerCase().replace(' ','-')}</span>
            </h2>
            <h1
              style={{
                fontSize: "16px",
                color: "#222",
                fontSize: "21px",
                fontWeight: "#222",
              }}
            >
              {productData?.name}
            </h1>
            <div className="pro-details-price">
              <p
                style={{
                  fontSize: "18px",
                  color: "#9252AA",
                  fontWeight: "600",
                }}
              >
                {productData?.price}
              </p>
              <p
                style={{
                  color: "#444",
                  fontWeight: "700",
                  fontSize: 18,
                  textAlign: "left",
                  margin: "10px 0px 7px",
                  textDecoration: "line-through",
                }}
              >
                 ₹ {Math.floor(getDiscountedPrice(productData?.price).discountedPrice)}
              </p>
              <div className="decorationdiscount-details">{Math.floor(getDiscountedPrice(productData?.price)?.discountDifference || 0)} {"off"}</div>
            </div>

            <button
              style={styles.Buttonstyle}
              id="continueButton"
              className="dec-continueButton"
              onClick={() => handleCheckout()}
            >
              Continue
            </button>
          </div>
          <div
            style={{
              boxShadow: "0 1px 8px rgba(0,0,0,.18)",
              padding: "10px",
              marginBottom: "12px",
              backgroundColor: "#fff",
            }}
          >
            {GetItemInclusion(productData?.inclusion)}
            
          </div>
          <div
            className="tab-section-details-productpage"
            style={{
              boxShadow: "0 1px 8px rgba(0,0,0,.18)",
              padding: "10px",
              marginBottom: "12px",
              backgroundColor: "#fff",
            }}
          >
            <Tabs tabs={tabs} defaultTab="faq" />
          </div>
        </div>
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

export default PhotographDetail;
