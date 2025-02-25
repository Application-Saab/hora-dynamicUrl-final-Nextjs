import React, { useState } from "react";
import daal_image from "../../assets/daal-image.png";
import OrderDetailsMenu from "../OrderDetailsMenu";
import OrderDetailsIngre from "../OrderDetailsIngre";
import {
  BASE_URL,
  ORDER_CANCEL,
  GET_PHOTOGRAPHY_BY_NAME,
} from "../../utils/apiconstants";
// import { useNavigate } from "react-router-dom";
import OrderDetailsAppliances from "../OrderDetailsAppliances";
import { useRouter } from "next/navigation";
import Image from "next/image";
import checkImage from "../../assets/tick.jpeg";
import logo from '../../assets/new_logo_light.png';
const axios = require("axios");

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
  const router = useRouter();
  const [tab, setTab] = useState("Menu");
  const [orderStatus, setOrderStatus] = useState(orderDetail?.order_status);

  const [name, setname] = useState();

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

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm("Do you want to cancel the order?");

    if (confirmCancel) {
      await cancelOrder();
    } else {
      console.log("Order cancellation aborted.");
    }
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
      console.log(items, "fdsfds");

      if (!items || items.length === 0) {
        return;
      }

      for (const itemId of items) {
        const url = `${BASE_URL}${GET_PHOTOGRAPHY_BY_NAME}`;

        try {
          const response = await axios.get(url);
          const apiData = response.data;

          if (apiData && apiData.data && apiData.data.length > 0) {
            const responseData = apiData.data[0];

            if (responseData._id === itemId) {
              console.log(`Match found for ID ${itemId}:`, responseData.name);
              setname(responseData.name);
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
        <div>
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
          {tab === "Menu" && (
            <OrderDetailsMenu orderDetail={orderDetail} orderType={orderType} />
          )}
          {tab === "Appliances" && (
            <OrderDetailsAppliances
              orderDetail={orderDetail}
              orderType={orderType}
            />
          )}
          {tab === "Ingredients" && (
            <OrderDetailsIngre
              orderDetail={orderDetail}
              orderType={orderType}
            />
          )}
        </div>
      ) : orderType === 6 ? (
        <>
          <OrderDetailsMenu orderDetail={orderDetail} orderType={orderType} />
          <div className="food-delivert-inclusions-container">
            <h5>Inclusions:</h5>
            <ul className="list-unstyled-inclusion">
              <li>
                <span>✔️</span> Food Delivery at Door-Step
              </li>
              <li>
                <span>✔️</span> Free Delivery
              </li>
              <li>
                <span>✔️</span> Hygienically Packed boxes
              </li>
              <li>
                <span>✔️</span> Freshly Cooked Food
              </li>
              <li>
                <span>✔️</span> Quality Disposable set of Plates & Spoons &
                forks
              </li>
              <li>
                <span>✔️</span> Water bottles (small bottles equal to number of
                people)
              </li>
            </ul>
          </div>
        </>
      ) : orderType === 7 ? (
        <>
          <OrderDetailsMenu orderDetail={orderDetail} orderType={orderType} />
          <div class="live-catering-container">
            <div class="live-catering-title">Inclusion:</div>
            <ul class="live-catering-inclusions">
              <li>✔️ Well Groomed Waiters (2 Nos)</li>
              <li>
                ✔️ Bone-china Crockery & Quality disposal for loose items.
              </li>
              <li>✔️ Transport (to & fro)</li>
              <li>✔️ Dustbin with Garbage bag</li>
              <li>✔️ Head Mask for waiters & chefs</li>
              <li>✔️ Tandoor/Other cooking Utensiles</li>
              <li>✔️ Chafing Dish</li>
              <li>✔️ Cocktail Napkins</li>
              <li>✔️ 2 Chef</li>
              <li>✔️ Water Can (Bisleri)(20 litres)</li>
              <li>✔️ Hand gloves</li>
            </ul>
            <div class="live-catering-title">Exclusion:</div>
            <ul class="live-catering-exclusions">
              <li>
                ❌ Buffet table/kitchen table is in client scope (can be
                provided at additional cost)
              </li>
            </ul>
          </div>
        </>
      ) : orderType === 8 ? (
        <>
          <div className="decoration-container">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingTop: "10px",
                position: "relative",
              }}
              className="decDetails"
            >
              <div
                style={{ width: "50%", textAlign: "center" }}
                className="decDetailsLeft"
              ></div>
              <div
                style={{
                  width: "50%",
                  paddingLeft: "20px",
                  paddingRight: "50px",
                }}
                className="decDetailsRight"
              >
                <div
                  style={{
                    boxShadow: "0 1px 8px rgba(0,0,0,.18)",
                    padding: "10px",
                    marginBottom: "12px",
                    backgroundColor: "#fff",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "16px",
                      color: "#222",
                      fontSize: "21px",
                      fontWeight: "#222",
                    }}
                  >
                    {name}
                  </h1>
                </div>

                <div
                  style={{
                    boxShadow: "0 1px 8px rgba(0,0,0,.18)",
                    padding: "10px",
                    marginBottom: "12px",
                    backgroundColor: "#fff",
                  }}
                >
                  {orderDetail?.add_on?.length > 0 && (
                    <>
                      <div
                        style={{
                          fontSize: "21px",
                          borderBottom: "1px solid #e7eff9",
                          marginBottom: "10px",
                        }}
                      >
                        Inclusions
                      </div>
                      {/* <div className="product-add-ons"> */}
                      <ul>
                        {orderDetail.add_on.map((item, index) => (
                          <li key={index} className="inclusionstyle">
                            <Image
                              src={checkImage}
                              alt="Info"
                              style={{ height: 13, width: 13, marginRight: 10 }}
                            />
                            <span>{item || "NA"}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Cancellation and Order Change Policy */}
                <div
                  className="px-1 py-3 border rounded my-2 cancellatiop-policy"
                  style={{
                    background: "rgb(157, 74,147, 28%)",
                  }}
                >
                  <p
                    style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }}
                    className=" text-center m-1"
                  >
                    Cancellation and order change policy
                  </p>
                  <p
                    style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }}
                    className="m-1"
                  >
                    1. If the order is beyong 48 Hours: You are eligible for a
                    100% refund of the advance payment
                  </p>
                  <p
                    style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }}
                    className="m-1"
                  >
                    2. If the order is cancelled more than 24 hours before the
                    scheduled delivery: You will not receive refund of the
                    advance payment.
                  </p>
                  <p
                    style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }}
                    className="m-1"
                  >
                    3. If the order is cancelled within 24 hours: The full
                    advance amount will be non-refundable, and 100% of the
                    payment for photography has to be paid by customer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : orderType === 1 ? (
        <div className="decoration-container">
          {decorationItems?.map((product, index) => {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingTop: "10px",
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
                      boxShadow: "0 1px 8px rgba(0,0,0,.1)",
                      padding: "10px",
                      margin: "0 auto",
                      position: "relative",
                    }}
                    className="decDetailsImage"
                  >
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
                          <Image src={logo} style={{ width:"70px" , height:"80px"}} className="hora-watermark-image"/>  
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div
                  style={{
                    width: "50%",
                    paddingLeft: "20px",
                    paddingRight: "50px",
                  }}
                  className="decDetailsRight"
                >
                <div
  style={{
    boxShadow: "0 1px 8px rgba(0,0,0,.18)",
    padding: "6px", // Reduced padding
    marginBottom: "6px", // Reduced marginBottom
    backgroundColor: "#fff",
  }}
>
  <h1
    style={{
      fontSize: "21px",
      color: "#222",
      fontWeight: "600", 
      marginBottom: "4px",
    }}
  >
    {product.name}
  </h1>
  <div className="pro-details-price">
    <p
      style={{
        fontSize: "18px",
        color: "#9252AA",
        fontWeight: "600",
        marginTop: "0", 
        marginBottom: "-2px",
      }}
    >
      ₹ {product.price}
    </p>
  </div>
</div>


                  <div
                    style={{
                      boxShadow: "0 1px 8px rgba(0,0,0,.18)",
                      padding: "10px",
                      marginBottom: "12px",
                      backgroundColor: "#fff",
                    }}
                  >
                    {getItemInclusion(product.inclusion)}
                  </div>

                  <div
                    style={{
                      boxShadow: "0 1px 8px rgba(0,0,0,.18)",
                      padding: "10px",
                      marginBottom: "12px",
                      backgroundColor: "#fff",
                    }}
                  >
                    {addOn.length > 0 && (
                      <>
                        <div
                          style={{
                            fontSize: "21px",
                            borderBottom: "1px solid #e7eff9",
                            marginBottom: "10px",
                          }}
                        >
                          Add On
                        </div>
                        {/* <div className="product-add-ons"> */}
                        <ul>
                          {addOn.map((item, index) => (
                            <li key={index} className="inclusionstyle">
                              <span>• {item.name || "NA"}</span>:
                              <span> ₹{item.price || "NA"}</span>
                            </li>
                          ))}
                        </ul>
                        {/* </div> */}
                      </>
                    )}
                  </div>

                  {/* Additional Comments */}
                  <div
                    style={{
                      boxShadow: "0 1px 8px rgba(0,0,0,.18)",
                      padding: "10px",
                      marginBottom: "12px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "21px",
                        borderBottom: "1px solid #e7eff9",
                        marginBottom: "10px",
                      }}
                    >
                      Additional Comments
                    </div>

                    {decorationComments && (
                      <div className="comment-container">
                        <p className="comments-text">{decorationComments}</p>
                      </div>
                    )}
                  </div>

                  {/* Cancellation and Order Change Policy */}
                  <div
                    className="px-1 py-3 border rounded my-2 cancellatiop-policy"
                    style={{
                      background: "rgb(157, 74,147, 28%)",
                    }}
                  >
                    <p
                      style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }}
                      className=" text-center m-1"
                    >
                      Cancellation and order change policy
                    </p>
                    <p
                      style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }}
                      className="m-1"
                    >
                      1. If the order is beyong 48 Hours: You are eligible for a
                      100% refund of the advance payment
                    </p>
                    <p
                      style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }}
                      className="m-1"
                    >
                      2. If the order is cancelled more than 24 hours before the
                      scheduled delivery: You will not receive refund of the
                      advance payment.
                    </p>
                    <p
                      style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }}
                      className="m-1"
                    >
                      3. If the order is cancelled within 24 hours: The full
                      advance amount will be non-refundable, and 100% of the
                      payment for decoration has to be paid by customer.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* <div className="rate-us-footer">
        <button className="rate-us-button">Rate Us</button>
      </div> */}

      {orderStatus === 0 || orderStatus === 1 || orderStatus === 2 ? (
        <div className="rate-us-footer" onClick={handleCancelOrder}>
          <button className="rate-us-button">Cancel Order</button>
        </div>
      ) : null}
      {orderStatus === 3 ? (
        <div className="rate-us-footer" onClick={contactUsRedirection}>
          <button className="rate-us-button">
            Share Your Feedback With Us
          </button>
        </div>
      ) : null}
      {orderStatus === 4 ? (
        <div className="rate-us-footer" onClick={cancelcontactUsRedirection}>
          <button className="rate-us-button">Initiate Refund</button>
        </div>
      ) : null}
    </>
  );
};

export default OrderDetailTab;
