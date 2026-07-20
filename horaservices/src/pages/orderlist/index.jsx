import React, { useEffect, useState } from "react";
import { BASE_URL, ORDERLIST_ENDPOINT } from "../../utils/apiconstants";
import clock from "../../assets/clock.svg";
import date_time_icon from "../../assets/date-time-icon.svg";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import { useRouter } from "next/router";
import Image from "next/image";
import executerDetails from "../../assets/executerDetails.png";
import dangerImage from "../../assets/danger.png";
import Popup from "../../utils/popup";
import OtpLoginPopup from '../../components/OtpLoginPopup';
import './orderlist.css';
import Head from "next/head";
import { fetchWithError } from "@/utils/fetchWithError";

// order.type is 2 for chef
// order.type is 1 for decoration
// order.type is 3 for waiter
// order type 4 bar tender
// order type 5 cleaner
// order type 6 Food Delivery
// order type 7 Live Catering
// order type 8 photography

const Orderlist = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [executor, setExecutor] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  useEffect(() => {
    const checkAuth = () => {

      if (isLoggedIn !== "true") {
        setIsModalOpen(true);
      }
      else {
        setIsModalOpen(false);
      }
    };
    checkAuth();
    const fetchOrderList = async () => {
      try {
        setLoading(true);
        const userId = await localStorage.getItem("userID");
        const response = await fetchWithError(BASE_URL + ORDERLIST_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ page: "1", _id: userId }),
        });
        const data = await response.json();
        if (data?.data?.order) {
          setOrders(data.data.order.sort((a, b) => new Date(b.order_date) - new Date(a.order_date)));
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderList();
  }, []);

  const getOrderStatus = (orderStatusValue) => {
    if (orderStatusValue === 0) {
      return { status: "Booked", className: "status-booked myOrder-status-badge" };
    }
    if (orderStatusValue == 1) {
      return { status: "Accepted", className: "status-accepted myOrder-status-badge" };
    }
    if (orderStatusValue === 2) {
      return { status: "In-progress", className: "status-in-progress myOrder-status-badge" };
    }
    if (orderStatusValue === 3) {
      return { status: "Completed", className: "status-completed myOrder-status-badge" };
    }
    if (orderStatusValue === 4) {
      return { status: "Cancelled", className: "status-cancelled myOrder-status-badge" };
    }
    if (orderStatusValue === 5) {
      return { status: "", className: "status-empty" };
    }
    if (orderStatusValue === 6) {
      return { status: "Expired", className: "status-expired myOrder-status-badge" };
    }
  };

  const getOrderType = (orderTypeValue) => {
    if (orderTypeValue == 1) {
      return "Decoration";
    }
    if (orderTypeValue === 2) {
      return "Chef";
    }
    if (orderTypeValue === 3) {
      return "Waiter";
    }
    if (orderTypeValue === 4) {
      return "Bar Tender";
    }
    if (orderTypeValue === 5) {
      return "Cleaner";
    }
    if (orderTypeValue === 6) {
      return "Food Delivery";
    }
    if (orderTypeValue === 7) {
      return "Live Catering";
    }
    if (orderTypeValue === 8) {
      return "Photography";
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const handleRateUs = (order) => {
    const { } = order;
    window.open(
      "https://wa.me/917338584828?text=Hello%20I%20have%20some%20queries%20for%20decoration%20services",
      "_blank"
    );
  };

  const handleSendInvite = (order) => {
    let message = `You are Invited!!!\n* * * * * *\nEnjoy the gathering with specially cooked by professional chef from Hora `;

    message += `${order.order_date.slice(0, 10)} ${order.order_time}\n`;

    order.selecteditems.forEach((dish, index) => {
      message += `${index + 1}. ${dish.name}\n`;
    });

    if (order.addressId) {
      message += `\nAt ${order.addressId.address1} ${order.addressId.address2}\nhttps://play.google.com/store/apps/details?id=com.hora`;
    }

    return message;
  };

  const getOrderId = (e) => {
    const orderId1 = 10800 + e;
    const updateOrderId = "#" + orderId1;
    localStorage.setItem("orderId", updateOrderId);
    return updateOrderId;
  };

  const handleViewDetail = (order) => {
    const { _id, order_id, type } = order;
    const apiOrderId = _id
    const orderType = type
    const orderId = order_id
    router.push({
      pathname: `/order-details`,
      query: { apiOrderId, orderType, orderId },
    });
  };

  if (loading) {
    return (
      <center>
        <div className="custom-spinner">
          <div>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div style={{ color: "#9252AA", textAlign: "center" }}>
              <h4>Data is loading...</h4>
            </div>
          </div>
        </div>
      </center>
    );
  }

  // if (orders.length === 0) {
  //   return (
  //     <center>
  //       <div className="no-orders">
  //         <h4>No Orders.. Please continue shopping with Hora</h4>
  //         <button className="button-style" onClick={() => router.push("/")}>
  //           Continue Shopping
  //         </button>
  //       </div>
  //     </center>
  //   );
  // }

  const openSupplierPopup = async (order) => {
    console.log(order, "order111");
    const { _id, order_id, type, toId } = order;

    // Validate if `toId` exists
    if (!toId) {
      setPopupMessage({
        img: dangerImage,
        title:
          "Order is not accepted Yet",
        body: "",
        button: "OK",
      });
      return;
    }
    else {
      const apiOrderId = _id;
      const orderType = type;
      const orderId = toId;

      try {
        // Fetch executor details from the API
        const response = await fetchWithError(
          `${BASE_URL}/api/admin/getUserDetails/${orderId}`
        );

        console.log(response, "response");

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        console.log(data, "dataasss");

        const executorName = data.data.name;
        const executorPhone = data.data.phone;

        setPopupMessage({
          img: executerDetails,
          title: (
            <>
              <div className="popup-title-main">{executorName}</div>
              <div className="popup-title-sub">{executorPhone}</div>
            </>
          ),
          body: 'You can contact the executor 30 minutes before the scheduled time to avoid early interruptions.',
          button: "Call Vendor",
          executorPhone: executorPhone,
          onButtonClick: (phone) => {
            console.log(phone, "phone");
            if (phone) {
              window.location.href = `tel:${phone}`;
            } else {
              alert("Phone number not available.");
            }
          },
        });

        setIsPopupVisible(true);
      } catch (error) {
        console.error(error.message);
        setIsPopupVisible(true);
      }
    }

  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setIsPopupVisible(false);
  };

  const parseTime = (timeString, date) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    }
    if (modifier === "AM" && hours === "12") {
      hours = "0";
    }

    const parsedDate = date ? new Date(date) : new Date();
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth();
    const day = parsedDate.getDate();

    return new Date(
      year,
      month,
      day,
      parseInt(hours, 10),
      parseInt(minutes, 10),
      0
    );
  };

  const isWithinFourHourWindow = (orderTimeRange, orderDate) => {
    const [startTimeString] = orderTimeRange.split(" - ");
    const startTime = parseTime(startTimeString, orderDate);
    const twoHoursBeforeStartTime = startTime.getTime() - 3 * 60 * 60 * 1000;
    const twoHoursAfterStartTime = startTime.getTime() + 3 * 60 * 60 * 1000;

    const currentTime = new Date();
    return (
      currentTime.getTime() >= twoHoursBeforeStartTime &&
      currentTime.getTime() < twoHoursAfterStartTime
    );
  };

  const handleCallClick = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <>
    <Head>
  {/* Title */}
  <title>My Orders | Track Your Service Bookings | HORA</title>

  {/* Meta Description */}
  <meta
    name="description"
    content="View and manage all your HORA bookings in one place. Track order status, check booking details, view executor information, and manage your decoration, photography, chef, catering, and event service orders."
  />

  <meta name="robots" content="noindex, follow" />
  <meta name="author" content="Hora Services" />

  {/* Canonical */}
  <link
    rel="canonical"
    href="https://horaservices.com/orderlist"
  />

  {/* Favicon */}
  <link
    rel="icon"
    href="https://horaservices.com/api/uploads/logo-icon.png"
  />

  {/* Open Graph */}
  <meta
    property="og:title"
    content="My Orders | HORA"
  />
  <meta
    property="og:description"
    content="Track and manage all your HORA service bookings, order details, and booking status from one dashboard."
  />
  <meta
    property="og:url"
    content="https://horaservices.com/orderlist"
  />
  <meta property="og:type" content="website" />
  <meta
    property="og:image"
    content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
  />

  {/* Twitter */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="My Orders | HORA"
  />
  <meta
    name="twitter:description"
    content="View your booking history, track order status, and manage HORA service orders."
  />
  <meta
    name="twitter:image"
    content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
  />

  {/* Schema - WebPage */}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "My Orders",
        url: "https://horaservices.com/orderlist",
        description:
          "Manage and track your HORA service bookings including decoration, photography, chef, catering, and other event services.",
      }),
    }}
  />

  {/* Schema - Profile Page */}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        name: "User Orders Dashboard",
        description:
          "User dashboard for viewing and tracking service bookings and orders.",
        publisher: {
          "@type": "Organization",
          name: "HORA",
          url: "https://horaservices.com",
          logo: "https://horaservices.com/api/uploads/logo-icon.png",
        },
      }),
    }}
  />
</Head>
   
    <main className="order-list">
      <div className="myorder-container">
        {!isLoggedIn ? (
          // Case 2: User is NOT logged in
          <div className="no-orders">
            <h2 className="no-record-heading">Please log in to check all your orders.</h2>
            <button
              style={{
                backgroundColor: "#97538C",
                fontSize: "14px",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                color: "#fff",
                cursor: "pointer"
              }}
              onClick={() => setIsModalOpen(true)}
            >
              Login
            </button>

            {isModalOpen &&
              <OtpLoginPopup setIsModalOpen={setIsModalOpen}fromCheckout />
            }
          </div>
        ) :

          orders.length > 0 ? (
            orders?.map((order) => {
              const orderStatus = getOrderStatus(order?.order_status);
              return (
                <div key={order.order_id} className="order-card">
                  <div className="order-div header">
                    <div className="order-left-container">
                      <div className="order-Id">
                        Order Id: {getOrderId(order?.order_id)}
                      </div>
                      <div className="order-type">
                        {getOrderType(order?.type)}
                      </div>
                    </div>
                    <div className="myorder-status">
                      <span className={orderStatus.className}>
                        {orderStatus.status}
                      </span>

                    </div>
                  </div>
                  <div className="order-details">
                    <div className="left-details">
                      <div className="date-time">
                        {/* <IoCalendarClear color="#9252AA" size={20}/>{" "} */}
                        <Image
                          className="time-img"
                          src={date_time_icon}
                          width={14}
                          height={14}
                        />{" "}
                        <span className="date-time-text">{formatDate(order.order_date)}</span>
                      </div>
                      <div className="date-time">
                        {/* <FiClock color="#9252AA" size={20}/>{" "} */}
                        <Image
                          className="time-img"
                          src={clock}
                          width={14}
                          height={14}
                        />{" "}
                        <span className="date-time-text">{order.order_time}</span>
                      </div>
                    </div>
                    <div className="right-details">
                      <div className="totalAmount">
                        <div className="label">
                          Total Amount
                          <p className="amount" style={{ textAlign: "start", margin: 0 }}>
                            {" "}
                            ₹ {order?.total_amount}
                          </p>
                        </div>
                      </div>
                      <div className="BalanceAmount">
                        {/* <strong style={{ color: "#9252AA" }}>
                        Balance Amount
                        {order?.type === 2 || order?.type === 3 || order?.type === 4 || order?.type === 5 ? (
                        <p className="mb-0 price-para">
                        {'₹' + Math.round((order?.payable_amount * 4) / 5)}
                        </p>
                        ) : order?.type === 6 || order?.type === 7 ? (
                        <p className="mb-0 price-para">
                        {'₹' + Math.round(order?.payable_amount * 0.35)}
                        </p>
                        ) : (
                        <p className="mb-0 price-para">
                        {'₹' + Math.round(order?.payable_amount * 0.65)}
                        </p>
                        )}

                      </strong> */}
                        <div className="label">
                          Balance Amount
                          <p className="amount" style={{ textAlign: "start", margin: 0 }}>
                            {" "}
                            ₹ {order?.balance_amount || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="order-otp">
                      OTP : {order?.otp}
                    </div>
                  </div>



                  {/* <hr className="m-0" /> */}
                  <div className="d-flex button-div">
                    <div>
                      <button
                        className="view-details-btn"
                        onClick={() => handleViewDetail(order)}
                      >
                        View Details
                      </button>
                    </div>
                    {order?.type == 2 &&
                      (orderStatus?.status == "Booked" ||
                        orderStatus?.status == "Accepted" ||
                        orderStatus?.status == "In-progress" ? (
                        <div>
                          <WhatsappShareButton
                            url="https://play.google.com/store/apps/details?id=com.hora"
                            title={handleSendInvite(order)}
                            separator="\n\n"
                          >
                            {/* <WhatsappIcon size={32} round /> */}
                            <button
                              className="send-invite"
                              onClick={() => handleSendInvite(order)}
                            >
                              Send Invite
                            </button>
                          </WhatsappShareButton>
                        </div>
                      ) : null)}

                    {(
                      (order.type === 1 || order.type === 8) &&
                      (
                        orderStatus?.status === "Booked" ||
                        orderStatus?.status === "Accepted" ||
                        orderStatus?.status === "In-progress"
                      )
                    ) && (
                        <div className="Executor-rate-btn">
                          <>
                            <button
                              className="view-details-btn"
                              onClick={() => {
                                if (isWithinFourHourWindow(order.order_time, order.order_date)) {
                                  openSupplierPopup(order);
                                  setIsPopupVisible(true);
                                }
                                else {
                                  setPopupMessage({
                                    img: dangerImage,
                                    title:
                                      "Executor details will be shown 2 hours before your scheduled time to avoid distractions.",
                                    body: "",
                                    button: "OK",
                                  });
                                  console.log(order, "order");
                                  setIsPopupVisible(true);
                                }
                              }}

                            >
                              Executor Details
                            </button>
                            {isPopupVisible && (
                              <Popup
                                style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                                onClose={closePopup}
                                popupMessage={popupMessage}
                                titleClass="popup-title-main"
                                buttonClass="popup-button"
                                imageClass="popup-image"
                              />
                            )}
                          </>

                        </div>
                      )}


                    {(
                      orderStatus?.status === "Completed" ||
                      orderStatus?.status === "Cancelled" ||
                      orderStatus?.status === "Expired"
                    ) && (
                        <div>
                          <button
                            className="send-invite"
                            onClick={() => handleViewDetail(order)}
                          >
                            Rate Us
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-record-div m-5">
              <h2 className="no-record-heading">
                No Orders.. Please continue shopping with Hora
              </h2>
              <button className="button-style" onClick={() => router.push("/")}>
                Continue Shopping
              </button>
            </div>
          )}
      </div>
    </main>
     </>
  );
}

export default Orderlist;
