import React, { useState } from "react";
import daal_image from "../../assets/daal-image.png";
import OrderDetailsMenu from "../OrderDetailsMenu";
import OrderDetailsIngre from "../OrderDetailsIngre";
import { BASE_URL, ORDER_CANCEL, GET_PHOTOGRAPHY_BY_TAG } from "../../utils/apiconstants";
// import { useNavigate } from "react-router-dom";
import OrderDetailsAppliances from "../OrderDetailsAppliances";
import { useRouter } from "next/navigation";
import Image from "next/image";
import checkImage from "../../assets/tick.jpeg";
import logo from '../../assets/new_logo_light.png';
const axios = require("axios");
import './orderDetails.css';
import cancellation from '../../assets/cancellation.png';
import checkIcon from '../../assets/checkIcon.png';
import inviteGuest from '../../assets/inviteGuest.png';
import cancleOrderIcon from '../../assets/cancleOrderIcon.png';
import Popup from '../../utils/popup';

import ReviewSections from "../ReviewSections";

// order.type is 2 for chef
// order.type is 1 for decoration
// order.type is 3 for waiter
// order type 4 bar tender
// order type 5 cleaner
// order type 6 Food Delivery
// order type 7 Live Catering

const OrderDetailTab = ({
  orderDetail,
  orderType,
  decorationItems,
  decorationComments,
  addOn,
}) => {

  const decorationArray = Array.isArray(decorationItems) ? decorationItems : [decorationItems];
  const router = useRouter();
  const [tab, setTab] = useState("Menu");
  const [name, setname] = useState();
  const [photographyImage, setPhotographyImage] = useState();
  const [popupMessage, setPopupMessage] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  console.log(orderDetail, "orderdetaillive");
  const comments = orderDetail.decoration_comments
    ? orderDetail.decoration_comments.split('\n').map(comment => comment.trim()).filter(Boolean)
    : [];

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const [orderStatus, setOrderStatus] = useState(orderDetail?.order_status);

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
      <div className="info-row" key={index}>
        <div className="info-icon">
          <Image
            src={checkIcon}
            alt="Info"
            style={{ height: 13, width: 13, marginRight: '5px' }}
          />
        </div>
        <div>
          {item.trim()}
        </div>
      </div>
    ));
    return (
      <div>
        <div className="fw-semiBold myOrderDetails-heading">
          Inclusions
        </div>
        <ul>{inclusionList}</ul>
      </div>
    );
  };
  const handleCancelOrder = async () => {
    setPopupMessage({
      img: cancleOrderIcon,
      title:
        "Cancel Order",
      body: "Are you sure you Want To cancel this order? This action cannot be undone!",
      button: "Yes ,Cancel Order",
    });
    setIsPopupVisible(true);
    // const confirmCancel = window.confirm("Do you want to cancel the order?");

    // if (confirmCancel) {
    //   await cancelOrder();
    // } else {
    //   console.log("Order cancellation aborted.");
    // }
  };

  const primaryButtonAction = async () => {
    await cancelOrder();
  };

  const cancelOrder = async () => {
    try {
      const token = await localStorage.getItem("token");

      const response = await fetch(BASE_URL + ORDER_CANCEL, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, /",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: orderDetail?._id,
          Authorisation: token,
        }),
      });

      if (response.ok) {
        // Handle success response
        alert("Order cancelled successfully");
        router.push("/orderlist");
      } else {
        // Handle error response
        alert("Failed to cancel the order. Please try again.");
      }
    } catch (error) {
      console.log("cancelOrder error", error);
    }
  };
  const contactUsRedirection = async () => {
    try {
      window.open(
        `whatsapp://send?phone=+917338584828&text=I've canceled my order, kindly assist with the refund process. Thanks!`
      );
    } catch (error) {
      console.log("contactUsRedirection error", error);
    }
  };

  const cancelcontactUsRedirection = async () => {
    try {
      window.open(
        "whatsapp://send?phone=+917338584828&text=I%20have%20canceled%20my%20order%20kindly%20assist%20with%20the%20refund%20process%20Thanks!"
      );
    } catch (error) {
      console.log("cancelcontactUsRedirection error", error);
    }
  };
  const fetchAndMatchItems = async (orderDetail) => {
    try {
      const { items } = orderDetail;
      console.log(items, "orderedItems");

      if (!items || items.length === 0) {
        return;
      }

      for (const itemId of items) {
        const url = `${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}`;

        try {
          const response = await axios.get(url);
          const apiData = response.data;

          if (apiData && apiData.data && apiData.data.length > 0) {
            const responseData = apiData.data[0];

            if (responseData._id === itemId) {
              console.log(`Match found for ID ${itemId}:`, responseData.name);
              setname(responseData.name);
              setPhotographyImage(responseData.featured_image);
            }
          }
        } catch (axiosError) {
          console.error(
            `Error fetching data for ID ${itemId}:`,
            axiosError.message
          );
        }
      }
    } catch (error) {
      console.error("Error in fetchAndMatchItems:", error);
    }
  };

  fetchAndMatchItems(orderDetail);

  const cancellationPolicy = [
    `If the order is beyond 48 Hours: You are eligible for a 100% refund of the advance payment.`,
    `If the order is cancelled more than 24 hours before the scheduled delivery: You will not receive a refund of the advance payment.`,
    `If the order is cancelled within 24 hours: The full advance amount will be non-refundable, and 100% of the payment for ${orderType === 8 ? "Photography" : "Decoration"} has to be paid by the customer.`,
  ];

  const infoList = [
    "Our Supply Team will contact you 1 day prior to your order date to confirm all details and customizations, ensuring smooth communication and flawless execution.",
    "The scheduled time slots for decoration cannot be changed on the day of order fulfillment.",
    "A power socket near the decoration area is required. If unavailable, please arrange for appropriate extensions in advance.",
    "Any rented items used for decoration will be collected within 24 hours of order completion. Please ensure accessibility for timely pickup. 🚚"
  ];
  const foodDeliveryInclusionItems = [
    "Food Delivery at Door-Step",
    "Free Delivery",
    "Hygienically Packed boxes",
    "Freshly Cooked Food",
    "Quality Disposable set of Plates & Spoons & Forks",
    "Water bottles (small bottles equal to number of people)"
  ];
  const cateringInclusionItems = [
    "Well Groomed Waiters (2 Nos)",
    "Bone-china Crockery & Quality disposal for loose items.",
    "Transport (to & fro)",
    "Dustbin with Garbage bag",
    "Head Mask for waiters & chefs",
    "Tandoor/Other cooking Utensiles",
    "Chafing Dish",
    "Cocktail Napkins",
    "2 Chef",
    "Water Can (Bisleri)(20 litres)",
    "Hand gloves"
  ];
  const chefInclusionItems = [
    "Professional Chef For Select Dishes",
    "Fresh Cooking at your Location",
    "Chef service available for up to 5 hours after arrival ",
    "All dishes prepared as per selected menu",
    "Hygiene & quality maintained throughout the service"
  ];
  const foodDeliveryPolicy = [
    "If the order is not assigned to the kitchen: You are eligible for a 100% refund of the advance payment.",
    "If the order is cancelled more than 24 hours before the scheduled delivery: You will receive a 50% refund of the advance payment.",
    "If the order is cancelled within 24 hours of the scheduled delivery: The full advance amount will be non-refundable, and 100% of the payment is required.",
  ];
   const chefPolicy = [
    "Till the order is not assign to the service provider , 100% of the amount will be refunded, othewise 50%of the advance will be deducted as a cancellation charges to componsate the service provider.",
    "The order cannot be edited after paying the advance customers can cancel the order and replace it with a new order with the required changes.",
    ];

  return (
    <>
      {/* <div className="chef-details">
        <img src="chef-image.jpg" alt="Chef" className="chef-image" />
        <div className="chef-info">
          <h3>Rahul Kumar Gupta</h3>
          <p>⭐⭐⭐⭐</p>
          <button className="rate-us-button">Rate Us</button>
        </div>
      </div> */}

      {parseInt(orderType) === 2 ? (
        <div className="myOrder-decDetails">
          <div className="myOrder-decDetailsLeft">
            <div>
              <Image
                src={inviteGuest}
                style={{ width: "100%", height: "auto" }}
                width={300}
                height={300}
              />
            </div>
          </div>
          <div className="myOrder-decDetailsRight">
            <div className="fw-semiBold myOrderDetails-heading">
              Chef For Party
            </div>
            <div className="fw-semiBold myOrderDetails-heading">
              Inclusions
            </div>
            {chefInclusionItems.map((item, index) => (
              <div className="info-row" key={index}>
                <div className="info-icon">
                  <Image
                    src={checkIcon}
                    alt="Info"
                    style={{ height: 13, width: 13, marginRight: '5px' }}
                  />
                </div>
                <div>
                  {item}
                </div>
              </div>
            ))}
            <div className="fw-semiBold myOrderDetails-heading">
              Required Procurement
            </div>

            <div className="tabs">
              <button
                className={`${tab === "Menu" ? "tab active" : "tab"}`}
                onClick={() => setTab("Menu")}
              >
                Menu
              </button>
              <button
                className={`${tab === "Appliances" ? "tab active" : "tab"}`}
                onClick={() => setTab("Appliances")}
              >
                Appliances
              </button>
              <button
                className={`${tab === "Ingredients" ? "tab active" : "tab"}`}
                onClick={() => setTab("Ingredients")}
              >
                Ingredients
              </button>
            </div>
            <div className="myTab-container">
              {tab === "Menu" && (
                <OrderDetailsMenu orderDetail={orderDetail} orderType={orderType} />
              )}
              {tab === "Appliances" && (
                <OrderDetailsAppliances orderDetail={orderDetail} orderType={orderType} />
              )}
              {tab === "Ingredients" && (
                <OrderDetailsIngre
                  orderDetail={orderDetail}
                  orderType={orderType}
                />
              )}
            </div>
            <div className="fw-semiBold myOrderDetails-heading">
              Additional Comments
            </div>
            {orderDetail.comments ? (
              <div className="info-row">
                <div className="info-icon">
                  <Image
                    src={checkIcon}
                    alt="Info"
                    style={{ height: 13, width: 13, marginRight: '5px' }}
                  />
                </div>

                <div>
                  {orderDetail.comments}
                </div>
              </div>
            ) : 'NA'
            }

            <div className="fw-semiBold myOrderDetails-heading">
              Price Details
            </div>

            <div style={{ fontSize: "14px", color: "#97538C" }}>
              {/* <div className="myOrder-amountList">
                <div className="myOrder-labelStyle">Original Price :</div>
                <div>₹ {orderDetail?.total_amount || 0}</div>
              </div>

              <div className="myOrder-amountList">
                <div className="myOrder-labelStyle">Discount :</div>
                <div style={{ color: "#F7941D" }}>₹ {orderDetail?.discount || 0} OFF</div>
              </div> */}

              <div className="myOrder-amountList">
                <div className="myOrder-labelStyle">Final Amount :</div>
                <div>₹ {orderDetail?.payable_amount || 0}</div>
              </div>

              <div className="myOrder-amountList">
                <div className="myOrder-labelStyle">Advance Amount :</div>
                <div>₹ {orderDetail?.advance_amount || 0}</div>
              </div>

              <div className="myOrder-amountList">
                <div className="myOrder-labelStyle">Balance Amount :</div>
                <div>₹ {orderDetail?.balance_amount || 0}</div>
              </div>
            </div>

            <div className="fw-semiBold myOrderDetails-heading">
              Venue Details
            </div>

            <div style={{ fontSize: "13.17px" }}>
              <div style={{ marginBottom: "8px" }}>
                <span className="fw-semiBold">Address :</span>
                <span> {' '}{ `${orderDetail?.addressId?.address1 || "NA"}`}</span>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span className="fw-semiBold">City :</span>
                <span>{' '}{orderDetail?.addressId?.city || 'N/A'}</span>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span className="fw-semiBold">Pin Code :</span>
                <span>{' '}{orderDetail?.order_pincode || 'N/A'}</span>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span className="fw-semiBold">Google Map Location :</span>
                 <a href={orderDetail?.addressId?.address2} className="myordergoogle-location"  target="_blank" rel="noopener">{' '}{orderDetail?.addressId?.address2}</a>
              </div>
            </div>

            {/* <div className="fw-semiBold myOrderDetails-heading ">
              Points For Considerations
            </div>

            <div>
              {infoList.map((text, index) => (
                <div key={index} className="info-row">
                  <div className="info-icon">
                    <Image
                      src={checkIcon}
                      alt="Info"
                      className="info-icon-img"
                    />
                  </div>
                  <div>{text}</div>
                </div>
              ))}
            </div> */}

            {/* Cancellation and Order Change Policy */}
            <div className="mt-2 mx-3 cancellation-policy border-0">
              <div style={{ display: "flex", alignItems: "center", }}>
                <span>
                  <Image
                    src={cancellation}
                    alt="cancellation"
                    style={{ height: 15, width: 13, marginRight: '4px' }}
                  />
                </span>
                <p
                  style={{ fontSize: "13.54px", color: "#4C494A", margin: "0px" }} >
                  Cancellation and Order Change Policy
                </p>
              </div>

              {chefPolicy.map((policy, index) => (
                <p key={index} style={{ fontSize: "11.6px", color: "#9D60B3" }} className="m-1">
                  {index + 1}. {policy}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : orderType === 6 ? (
        <div className="myOrder-decDetails">
          <div className="myOrder-decDetailsLeft">
            <div>
              <Image
                src={inviteGuest}
                style={{ width: "100%", height: "auto" }}
                width={300}
                height={300}
              />
            </div>
          </div>
          <div className="myOrder-decDetailsRight">
            <div className="fw-semiBold myOrderDetails-heading">
              Bulk Food Delivery
            </div>
            <div className="fw-semiBold myOrderDetails-heading">
              Inclusions
            </div>
            {foodDeliveryInclusionItems.map((item, index) => (
              <div className="info-row" key={index}>
                <div className="info-icon">
                  <Image
                    src={checkIcon}
                    alt="Info"
                    style={{ height: 13, width: 13, marginRight: '5px' }}
                  />
                </div>
                <div>
                  {item}
                </div>
              </div>
            ))}
            <div className="fw-semiBold myOrderDetails-heading">
              Menu
            </div>
            <OrderDetailsMenu orderDetail={orderDetail} orderType={orderType} />
            <div className="fw-semiBold myOrderDetails-heading">
              Price Details
            </div>

            <div style={{ fontSize: "14px", color: "#97538C" }}>
              {/* <div className="myOrder-amountList">
                <div className="myOrder-labelStyle">Original Price :</div>
                <div>₹ {orderDetail?.total_amount || 0}</div>
              </div>

              <div className="myOrder-amountList">
                <div className="myOrder-labelStyle">Discount :</div>
                <div style={{ color: "#F7941D" }}>₹ {orderDetail?.discount || 0} OFF</div>
              </div> */}

              <div className="myOrder-amountList">
                <div className="myOrder-labelStyle">Final Amount :</div>
                <div>₹ {orderDetail?.payable_amount || 0}</div>
              </div>

              <div className="myOrder-amountList">
                <div className="myOrder-labelStyle">Advance Amount :</div>
                <div>₹ {orderDetail?.advance_amount || 0}</div>
              </div>

              <div className="myOrder-amountList">
                <div className="myOrder-labelStyle">Balance Amount :</div>
                <div>₹ {orderDetail?.balance_amount || 0}</div>
              </div>
            </div>

            <div className="fw-semiBold myOrderDetails-heading">
              Venue Details
            </div>

            <div style={{ fontSize: "13.17px" }}>
              <div style={{ marginBottom: "8px" }}>
                <span className="fw-semiBold">Address :</span>
                <span> {' '}
                  {`${orderDetail?.addressId?.address1 || 'NA'}`}
                </span>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span className="fw-semiBold">City :</span>
                <span>{' '}{orderDetail?.addressId?.city || 'N/A'}</span>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span className="fw-semiBold">Pin Code :</span>
                <span>{' '}{orderDetail?.order_pincode || 'N/A'}</span>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span className="fw-semiBold">Google Map Location :</span>
                 <a href={orderDetail?.addressId?.address2} className="myordergoogle-location"  target="_blank" rel="noopener">{' '}{orderDetail?.addressId?.address2}</a>
              </div>
            </div>

            {/* <div className="fw-semiBold myOrderDetails-heading ">
              Points For Considerations
            </div>

            <div>
              {infoList.map((text, index) => (
                <div key={index} className="info-row">
                  <div className="info-icon">
                    <Image
                      src={checkIcon}
                      alt="Info"
                      className="info-icon-img"
                    />
                  </div>
                  <div>{text}</div>
                </div>
              ))}
            </div> */}

            {/* Cancellation and Order Change Policy */}
            <div className="mt-2 mx-3 cancellation-policy border-0">

              <div style={{ display: "flex", alignItems: "center", }}>
                <span>
                  <Image
                    src={cancellation}
                    alt="cancellation"
                    style={{ height: 15, width: 13, marginRight: '4px' }}
                  />
                </span>
                <p
                  style={{ fontSize: "13.54px", color: "#4C494A", margin: "0px" }} >
                  Cancellation and Order Change Policy
                </p>
              </div>

              {foodDeliveryPolicy.map((policy, index) => (
                <p key={index} style={{ fontSize: "11.6px", color: "#9D60B3" }} className="m-1">
                  {index + 1}. {policy}
                </p>
              ))}
            </div>
          </div>
        </div>

      ) : orderType === 7 ? (
        <div className="myOrder-decDetails">
          <div className="myOrder-decDetailsLeft">
            <div>
              <Image
                src={inviteGuest}
                style={{ width: "100%", height: "auto" }}
                width={300}
                height={300}
              />
            </div>
          </div>
          <div className="myOrder-decDetailsRight">
            <div className="fw-semiBold myOrderDetails-heading">
              Live Catering
            </div>
            <div className="fw-semiBold myOrderDetails-heading">
              Inclusions
            </div>
            {cateringInclusionItems.map((item, index) => (
              <div className="info-row" key={index}>
                <div className="info-icon">
                  <Image
                    src={checkIcon}
                    alt="Info"
                    style={{ height: 13, width: 13, marginRight: '5px' }}
                  />
                </div>
                <div>
                  {item}
                </div>
              </div>
            ))}
            <div className="fw-semiBold myOrderDetails-heading">
              Menu
            </div>
            <OrderDetailsMenu orderDetail={orderDetail} orderType={orderType} />
            {/* Additional Comments */}
            <div>
              <div className="fw-semiBold myOrderDetails-heading">
                Additional Comments
              </div>
              {orderDetail.comments ? (
              <div className="info-row">
                <div className="info-icon">
                  <Image
                    src={checkIcon}
                    alt="Info"
                    style={{ height: 13, width: 13, marginRight: '5px' }}
                  />
                </div>
                <div>
                  {orderDetail.comments}
                </div>
              </div>
            ) : 'NA'
            }
      
            </div>
              <div className="fw-semiBold myOrderDetails-heading">
                    Price Details
                  </div>

                  <div style={{ fontSize: "14px", color: "#97538C" }}>
                    {/* <div className="myOrder-amountList">
                      <div className="myOrder-labelStyle">Original Price :</div>
                      <div>₹ {orderDetail?.total_amount || 0}</div>
                    </div>

                    <div className="myOrder-amountList">
                      <div className="myOrder-labelStyle">Discount :</div>
                      <div style={{ color: "#F7941D" }}>₹ {orderDetail?.discount || 0} OFF</div>
                    </div> */}

                    <div className="myOrder-amountList">
                      <div className="myOrder-labelStyle">Final Amount :</div>
                      <div>₹ {orderDetail?.payable_amount || 0}</div>
                    </div>

                    <div className="myOrder-amountList">
                      <div className="myOrder-labelStyle">Advance Amount :</div>
                      <div>₹ {orderDetail?.advance_amount || 0}</div>
                    </div>

                    <div className="myOrder-amountList">
                      <div className="myOrder-labelStyle">Balance Amount :</div>
                      <div>₹ {orderDetail?.balance_amount || 0}</div>
                    </div>
                  </div>
                  <div className="fw-semiBold myOrderDetails-heading">
                    Venue Details
                  </div>

                  <div style={{ fontSize: "13.17px" }}>
                    <div style={{ marginBottom: "8px" }}>
                      <span className="fw-semiBold">Address :</span>
                      <span> {' '}
                        {orderDetail?.addressId?.address1 || "NA"}
                      </span>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <span className="fw-semiBold">City :</span>
                      <span>{' '}{orderDetail?.addressId?.city || "NA"}</span>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <span className="fw-semiBold">Pin Code :</span>
                      <span>{' '}{orderDetail?.order_pincode || "NA"}</span>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <span className="fw-semiBold">Google Map Location :</span>
                      <a href={orderDetail?.addressId?.address2} className="myordergoogle-location"  target="_blank" rel="noopener">{' '}{orderDetail?.addressId?.address2}</a>
                    </div>
                  </div>

                  {/* <div className="fw-semiBold myOrderDetails-heading ">
                    Points For Considerations
                  </div>

                  <div>
                    {infoList.map((text, index) => (
                      <div key={index} className="info-row">
                        <div className="info-icon">
                          <Image
                            src={checkIcon}
                            alt="Info"
                            className="info-icon-img"
                          />
                        </div>
                        <div>{text}</div>
                      </div>
                    ))}
                  </div> */}

                  {/* Cancellation and Order Change Policy */}
                  <div className="mt-2 mx-3 cancellation-policy border-0">

                    <div style={{ display: "flex", alignItems: "center", }}>
                      <span>
                        <Image
                          src={cancellation}
                          alt="cancellation"
                          style={{ height: 15, width: 13, marginRight: '4px' }}
                        />
                      </span>
                      <p
                        style={{ fontSize: "13.54px", color: "#4C494A", margin: "0px" }} >
                        Cancellation and Order Change Policy
                      </p>
                    </div>

                    {foodDeliveryPolicy.map((policy, index) => (
                      <p key={index} style={{ fontSize: "11.6px", color: "#9D60B3" }} className="m-1">
                        {index + 1}. {policy}
                      </p>
                    ))}
                  </div>
            {/* <div class="live-catering-title">Exclusion:</div>
            <ul class="live-catering-exclusions">
              <li>
                ❌ Buffet table/kitchen table is in client scope (can be
                provided at additional cost)
              </li>
            </ul> */}
          </div>
        </div>
      ) : orderType === 1 ? (
         
        <div className="decoration-container orderdetails">
          <ReviewSections />
          {decorationArray?.map((product, index) => {
            return (
              <div className="myOrder-decDetails">
                <div className="myOrder-decDetailsLeft">
                  <div>
                    <Image
                      src={`https://horaservices.com/api/uploads/${product.featured_image}`}
                      style={{ width: "100%", height: "auto" }}
                      width={300}
                      height={300}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 9,
                        right: 4,
                      }}
                    >
                      <span>
                        <Image src={logo} style={{ width: "50px", height: "55px" }} className="hora-watermark-image" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="myOrder-decDetailsRight">
                  <h1>
                    {product.name}
                  </h1>
                  <div style={{ marginBottom: "12px" }}>
                    {getItemInclusion(product.inclusion)}
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <div className="fw-semiBold myOrderDetails-heading">
                      Add-Ons
                    </div>
                    {addOn.length > 0 ? (
                      <div>
                        {addOn.map((item, index) => (
                          <div key={index} className="info-row">
                            <div className="info-icon">
                              <Image
                                src={checkIcon}
                                alt="Info"
                                style={{ height: 13, width: 13, marginRight: "5px" }}
                              />
                            </div>

                            <div>
                              {item.name || "NA"} =  ₹{item.price || "NA"} x 1 = ₹{item.price || "NA"}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      "NA"
                    )}

                  </div>

                  {/* Additional Comments */}
                  <div>
                    <div className="fw-semiBold myOrderDetails-heading">
                      Additional Comments
                    </div>
                    {decorationComments && (
                      <div className="info-row">
                        <div className="info-icon">
                          <Image
                            src={checkIcon}
                            alt="Info"
                            style={{ height: 13, width: 13, marginRight: '5px' }}
                          />
                        </div>

                        <div>
                          {decorationComments}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="fw-semiBold myOrderDetails-heading">
                    Price Details
                  </div>

                  <div style={{ fontSize: "14px", color: "#97538C" }}>
                    {/* <div className="myOrder-amountList">
                      <div className="myOrder-labelStyle">Original Price :</div>
                      <div>₹ {orderDetail?.total_amount || 0}</div>
                    </div>

                    <div className="myOrder-amountList">
                      <div className="myOrder-labelStyle">Discount :</div>
                      <div style={{ color: "#F7941D" }}>₹ {orderDetail?.discount || 0} OFF</div>
                    </div> */}

                    <div className="myOrder-amountList">
                      <div className="myOrder-labelStyle">Final Amount :</div>
                      <div>₹ {orderDetail?.payable_amount || 0}</div>
                    </div>

                    <div className="myOrder-amountList">
                      <div className="myOrder-labelStyle">Advance Amount :</div>
                      <div>₹ {orderDetail?.advance_amount || 0}</div>
                    </div>

                    <div className="myOrder-amountList">
                      <div className="myOrder-labelStyle">Balance Amount :</div>
                      <div>₹ {orderDetail?.balance_amount || 0}</div>
                    </div>
                  </div>
                  <div className="fw-semiBold myOrderDetails-heading">
                    Venue Details
                  </div>

                  <div style={{ fontSize: "13.17px" }}>
                    <div style={{ marginBottom: "8px" }}>
                      <span className="fw-semiBold">Address :</span>
                      <span> {' '}
                        {orderDetail?.addressId?.address1 || "NA"}
                      </span>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <span className="fw-semiBold">City :</span>
                      <span>{' '}{orderDetail?.addressId?.city || "NA"}</span>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <span className="fw-semiBold">Pin Code :</span>
                      <span>{' '}{orderDetail?.order_pincode || "NA"}</span>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <span className="fw-semiBold">Google Map Location :</span>
                      <a href={orderDetail?.addressId?.address2} className="myordergoogle-location"  target="_blank" rel="noopener">{' '}{orderDetail?.addressId?.address2}</a>
                    </div>
                  </div>

                  <div className="fw-semiBold myOrderDetails-heading ">
                    Points For Considerations
                  </div>

                  <div>
                    {cancellationPolicy.map((text, index) => (
                      <div key={index} className="info-row">
                        <div className="info-icon">
                          <Image
                            src={checkIcon}
                            alt="Info"
                            className="info-icon-img"
                          />
                        </div>
                        <div>{text}</div>
                      </div>
                    ))}
                  </div>

                  {/* Cancellation and Order Change Policy */}
                  <div className="mt-2 mx-3 cancellation-policy border-0">

                    <div style={{ display: "flex", alignItems: "center", }}>
                      <span>
                        <Image
                          src={cancellation}
                          alt="cancellation"
                          style={{ height: 15, width: 13, marginRight: '4px' }}
                        />
                      </span>
                      <p
                        style={{ fontSize: "13.54px", color: "#4C494A", margin: "0px" }} >
                        Cancellation and Order Change Policy
                      </p>
                    </div>

                    {cancellationPolicy.map((policy, index) => (
                      <p key={index} style={{ fontSize: "11.6px", color: "#9D60B3" }} className="m-1">
                        {index + 1}. {policy}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : orderType === 8 ? (
       <div className="decoration-container">
    <div className="decDetails">
      {(() => {
        const photography = orderDetail?.items?.[0]?.photography;

        return (
          <div className="myOrder-decDetailsRight">

            {/* ================= PRODUCT NAME ================= */}
            <h1 className="mb-2">
              {photography?.name || "Photography Service"}
            </h1>

            {/* ================= INCLUSIONS ================= */}
            {photography?.inclusion?.length > 0 && (
              <>
                <div className="fw-semiBold myOrderDetails-heading">
                  Inclusions
                </div>

                <div
                  className="photography-inclusions"
                  dangerouslySetInnerHTML={{
                    __html: photography.inclusion.join(""),
                  }}
                />
              </>
            )}

            {/* ================= ADD ONS ================= */}
            <div className="fw-semiBold myOrderDetails-heading">
              Add-ons
            </div>

            {orderDetail?.add_on?.length > 0 ? (
              orderDetail.add_on.map((item, index) => (
                <div key={index} className="info-row">
                  <Image
                    src={checkIcon}
                    alt=""
                    width={13}
                    height={13}
                    style={{ marginRight: 8 }}
                  />
                  <div>
                    {item?.title || "NA"} – ₹{item?.price || 0}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 13 }}>NA</div>
            )}

            {/* ================= ADDITIONAL COMMENTS ================= */}
            <div className="fw-semiBold myOrderDetails-heading">
              Additional Comments
            </div>

            {orderDetail?.comments ? (
              <div className="info-row">
                <Image
                  src={checkIcon}
                  alt=""
                  width={13}
                  height={13}
                  style={{ marginRight: 8 }}
                />
                <div>{orderDetail.comments}</div>
              </div>
            ) : (
              <div style={{ fontSize: 13 }}>NA</div>
            )}

            {/* ================= PRICE DETAILS ================= */}
            <div className="fw-semiBold myOrderDetails-heading">
              Price Details
            </div>

            <div style={{ fontSize: 14, color: "#97538C" }}>
              <div className="myOrder-amountList">
                <div>Final Amount :</div>
                <div>₹ {orderDetail?.total_amount || 0}</div>
              </div>

              <div className="myOrder-amountList">
                <div>Advance Amount :</div>
                <div>₹ {orderDetail?.advance_amount || 0}</div>
              </div>

              <div className="myOrder-amountList">
                <div>Balance Amount :</div>
                <div>₹ {orderDetail?.balance_amount || 0}</div>
              </div>
            </div>

            {/* ================= DURATION ================= */}
            {photography?.duration && (
              <>
                <div className="fw-semiBold myOrderDetails-heading">
                  Duration
                </div>
                <div style={{ fontSize: 13 }}>{photography.duration}</div>
              </>
            )}

            {/* ================= VENUE DETAILS ================= */}
            <div className="fw-semiBold myOrderDetails-heading">
              Venue Details
            </div>

            <div style={{ fontSize: 13 }}>
              <div className="mb-2">
                <strong>Address :</strong>{" "}
                {orderDetail?.addressId?.address1 || "NA"}
              </div>

              <div className="mb-2">
                <strong>City :</strong>{" "}
                {orderDetail?.addressId?.city || "NA"}
              </div>

              <div className="mb-2">
                <strong>Pin Code :</strong>{" "}
                {orderDetail?.order_pincode || "NA"}
              </div>

              {orderDetail?.addressId?.address2 && (
                <div className="mb-2">
                  <strong>Google Map :</strong>{" "}
                  <a
                    href={orderDetail.addressId.address2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="myordergoogle-location"
                  >
                    View Location
                  </a>
                </div>
              )}
            </div>

            {/* ================= CANCELLATION POLICY ================= */}
            {cancellationPolicy?.length > 0 && (
              <div className="mt-3 cancellation-policy">
                <div className="d-flex align-items-center mb-1">
                  <Image
                    src={cancellation}
                    alt="cancellation"
                    width={14}
                    height={14}
                    style={{ marginRight: "6" }}
                  />
                  <span style={{ fontSize: "13" }}>
                    Cancellation and Order Change Policy
                  </span>
                </div>

                {cancellationPolicy.map((policy, index) => (
                  <p
                    key={index}
                    style={{ fontSize: "11.5", color: "#9D60B3" }}
                    className="m-0"
                  >
                    {index + 1}. {policy}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  </div>
      ) : null}

      {/* <div className="rate-us-footer">
        <button className="rate-us-button">Rate Us</button>
      </div> */}
      {/* bottom buttons */}
      <div className="mx-3" style={{ padding: "8px" }}>
        {orderStatus === 0 || orderStatus === 1 || orderStatus === 2 ? (
          <div className="" onClick={handleCancelOrder}>
            <button className="fw-semiBold myOrder-cancelOrderBtn">CANCLE ORDER</button>
          </div>
        ) : null}
        {orderStatus === 3 ? (
          <div className="" onClick={contactUsRedirection}>
            <button className="fw-semiBold myOrder-cancelOrderBtn">
              Share Your Feedback With Us
            </button>
          </div>
        ) : null}
        {orderStatus === 4 ? (
          <div className="" onClick={contactUsRedirection}>
            <button className="fw-semiBold myOrder-cancelOrderBtn">Initiate Refund</button>
          </div>
        ) : null}
      </div>
      {isPopupVisible && (
        <Popup
          style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
          onClose={closePopup}
          popupMessage={popupMessage}
          primaryButtonAction={primaryButtonAction}
        />
      )}
    </>
  );
};

export default OrderDetailTab;