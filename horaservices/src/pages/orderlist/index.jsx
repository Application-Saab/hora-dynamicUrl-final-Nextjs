import React, { useEffect, useState } from "react";
import { BASE_URL, ORDERLIST_ENDPOINT } from "../../utils/apiconstants";
import clock from "../../assets/clock.png";
import people from "../../assets/people.png";
import date_time_icon from "../../assets/date-time-icon.png";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import { useRouter } from "next/router";
import Image from "next/image";
import informationImage from "../../assets/information.webp";
import dangerImage from "../../assets/danger.webp";
import Popup from "../../utils/popup";
import OtpLoginPopup from "../../components/OtpLoginPopup";

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
      } else {
        setIsModalOpen(false);
      }
    };
    checkAuth();
    const fetchOrderList = async () => {
      try {
        setLoading(true);
        const userId = await localStorage.getItem("userID");
        const response = await fetch(BASE_URL + ORDERLIST_ENDPOINT, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ page: "1", _id: userId }),
        });
        const data = await response.json();
        if (data?.data?.order) {
          setOrders(
            data.data.order.sort(
              (a, b) => new Date(b.order_date) - new Date(a.order_date)
            )
          );
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
      return { status: "Booked", className: "status-booked" };
    }
    if (orderStatusValue == 1) {
      return { status: "Accepted", className: "status-accepted" };
    }
    if (orderStatusValue === 2) {
      return { status: "In-progress", className: "status-in-progress" };
    }
    if (orderStatusValue === 3) {
      return { status: "Completed", className: "status-completed" };
    }
    if (orderStatusValue === 4) {
      return { status: "Cancelled", className: "status-cancelled" };
    }
    if (orderStatusValue === 5) {
      return { status: "", className: "status-empty" };
    }
    if (orderStatusValue === 6) {
      return { status: "Expired", className: "status-expired" };
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
    const {} = order;
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
    const apiOrderId = _id;
    const orderType = type;
    const orderId = order_id;
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
        title: "Order is not accepted Yet",
        body: "",
        button: "OK",
      });
      return;
    } else {
      const apiOrderId = _id;
      const orderType = type;
      const orderId = toId;

      try {
        // Fetch executor details from the API
        const response = await fetch(
          `https://horaservices.com:3000/api/admin/getUserDetails/${orderId}`
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
          img: informationImage,
          title: `Executor Name: ${executorName}`,
          body: `Executor Phone: ${executorPhone}`,
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
    <main className="order-list">
      <div className="order-container">
        {!isLoggedIn ? (
          // Case 2: User is NOT logged in
          <div className="no-orders">
            <h2 className="no-record-heading">
              Please log in to check all your orders.
            </h2>
            <OtpLoginPopup setIsModalOpen={setIsModalOpen} />
          </div>
        ) : orders.length > 0 ? (
          orders?.map((order) => {
            const orderStatus = getOrderStatus(order?.order_status);
            return (
              <div key={order.order_id} className="order-card">
                <div className="order-div header">
                  <div className="order-id">
                    <div style={{ color: "#9252AA" }}>
                      Order Id: {getOrderId(order?.order_id)}
                    </div>
                    <div className="order-otp" style={{ color: "#9252AA" }}>
                      OTP: {order?.otp}
                    </div>
                  </div>
                  <div className="order-status">
                    <span className={orderStatus.className}>
                      {orderStatus.status}
                    </span>
                    <div className="m-0" style={{ color: "#9252AA" }}>
                      {getOrderType(order?.type)}
                    </div>
                  </div>
                </div>
                <div className="order-details">
                  <div className="left-details">
                    <div>
                      {/* <IoCalendarClear color="#9252AA" size={20}/>{" "} */}
                      <Image
                        className="contact-us-img"
                        src={date_time_icon}
                        height={20}
                        width={20}
                      />{" "}
                      <span>{formatDate(order.order_date)}</span>
                    </div>
                    <div>
                      {/* <FiClock color="#9252AA" size={20}/>{" "} */}
                      <Image
                        className="contact-us-img"
                        src={clock}
                        height={20}
                        width={20}
                      />{" "}
                      <span>{order.order_time}</span>
                    </div>
                    {order?.type == 1 || order?.type == 8 ? (
                      ""
                    ) : (
                      <div>
                        <Image
                          className="contact-us-img"
                          src={people}
                          height={20}
                          width={20}
                          alt="people"
                        />{" "}
                        <span>{order?.no_of_people} People</span>
                      </div>
                    )}
                  </div>
                  <div className="right-details">
                    <div className="totalAmount">
                      <strong style={{ color: "#9252AA" }}>
                        Total Amount
                        <p style={{ textAlign: "start", margin: 0 }}>
                          {" "}
                          ₹{order?.payable_amount}
                        </p>
                      </strong>
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
                      <strong style={{ color: "#9252AA" }}>
                        Balance Amount
                        <p style={{ textAlign: "start", margin: 0 }}>
                          {" "}
                          ₹{order?.balance_amount}
                        </p>
                      </strong>
                    </div>
                  </div>
                </div>
                <hr className="m-0" />
                <div className="d-flex button-div">
                  <div>
                    <button
                      className="view-details order-details"
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

                  {((order.type === 1 && orderStatus?.status !== "Expired") ||
                    (order.type === 8 &&
                      orderStatus?.status !== "Expired")) && (
                    <div className="Executor-rate-btn">
                      <>
                        <button
                          className="view-details order-details"
                          onClick={() => {
                            if (
                              isWithinFourHourWindow(
                                order.order_time,
                                order.order_date
                              )
                            ) {
                              openSupplierPopup(order);
                              setIsPopupVisible(true);
                            } else {
                              setPopupMessage({
                                img: dangerImage,
                                title:
                                  "Executor details will be shown 2 hours before your scheduled time to avoid distractions. 🙂",
                                body: "",
                                button: "OK",
                              });
                              console.log(order, "order");
                              setIsPopupVisible(true);
                            }
                          }}
                          style={{ marginLeft: "10px" }}
                        >
                          Executor Details
                        </button>
                        {isPopupVisible && (
                          <Popup
                            style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                            onClose={closePopup}
                            popupMessage={popupMessage}
                          />
                        )}
                      </>
                    </div>
                  )}

                  {order?.type === 2 && orderStatus?.status == "Completed" ? (
                    <div>
                      <button
                        className="send-invite"
                        onClick={() => handleRateUs(order)}
                      >
                        Rate us
                      </button>
                    </div>
                  ) : null}
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
  );
};

export default Orderlist;
