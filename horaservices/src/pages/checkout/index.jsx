"use client";
import React, { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import {
  BASE_URL,
  CONFIRM_ORDER_ENDPOINT,
  GET_ADDON_BY_ID,
  GET_DECORATION_BY_ID,
  SAVE_LOCATION_ENDPOINT,
} from "../../utils/apiconstants";
import { PAYMENT, API_SUCCESS_CODE } from "../../utils/apiconstants";
import { Form } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import "../../css/decoration.css";
import { useRouter } from "next/router";
import Image from "next/image";
import Loader from "../../components/Loader";
import { pincodes } from "../../utils/pincodes.js";
import OtpLoginPopup from "../../components/OtpLoginPopup";
import BackgroundDetails from "../../assets/BackgroundDetails2.jpg";
import CommentIcon from "../../assets/commentIcon.png";
import locationIcon from "../../assets/locationIcon.png";
import CityIcon from "../../assets/CityIcon.png";
import PinIcon from "../../assets/Pincode.jpeg";
import cancellation from "../../assets/Cancellation.svg";
import BackgorundImgDetails from "../../assets/DecorBackgorundImgDetails.png";
import "./checkout.css";
import UrgentBookingModal from "@/components/UrgentBookingModal";
import { contactUsRedirect } from "@/components/CheckoutWhatsAppSummary";
import { formatDate } from "../../utils/formateDate";
import axiosApi from "@/utils/axiosApi";
import { safeGetItem } from "@/utils/safeStorage";
import { useCity } from "@/utils/cityContext";
import { fetchWithError } from "@/utils/fetchWithError";
import { getCategoryNameToSlug } from "@/utils/similarProductUtils";

// Safe parse helpers
const safeJsonParse = (value, fallback) => {
  if (value == null || value === "") return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const Checkout = () => {
  const router = useRouter();
  const { selectedCitySlug } = useCity();
  const { totalAmount, productid, selectedaddonids } = router.query;
  const selectedAddonIdsParam = Array.isArray(selectedaddonids)
    ? selectedaddonids[0]
    : selectedaddonids;

  const rawAddonIds = useMemo(
    () => safeJsonParse(selectedAddonIdsParam, []),
    [selectedAddonIdsParam],
  );

  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedCatValue, setSelectedCatValue] = useState({});
  const [selectedAddonsData, setSelectedAddonsData] = useState([]);

  useEffect(() => {
    const getProductDetails = async () => {
      if (productid) {
        const res = await fetchWithError(
          `${BASE_URL}${GET_DECORATION_BY_ID}${productid}`,
        );
        const data = await res.json();
        if (res.ok && !data.error) setSelectedProduct(data.data || []);
        if (data?.data?.tag?.length > 0) {
          let tagData = data?.data?.tag[0];
          setSelectedCatValue(getCategoryNameToSlug(tagData?.name));
        }
      }
    };
    getProductDetails();
  }, [productid]);

  useEffect(() => {
    if (!router.isReady || !Array.isArray(rawAddonIds) || !rawAddonIds.length) {
      return;
    }

    const getAddons = async () => {
      try {
        const q = new URLSearchParams();

        rawAddonIds.forEach((item) => {
          if (item?.id) {
            q.append("ids", item.id);
          }
        });

        if (!q.size) return;

        const res = await fetchWithError(
          `${BASE_URL}${GET_ADDON_BY_ID}?${q.toString()}`,
        );

        const data = await res.json();

        if (res.ok && !data.error) {
          const newData = (data?.data || []).map((addon) => {
            const matchedAddon = rawAddonIds.find(
              (urlAddon) => urlAddon?.id === addon?._id,
            );

            return {
              ...addon,
              quantity: matchedAddon?.quantity ?? 1,
            };
          });
          setSelectedAddonsData(newData);
        }
      } catch (error) {
        console.error("Failed to fetch addons:", error);
      }
    };

    getAddons();
  }, [router.isReady, rawAddonIds]);

  const selectedAddOnProduct = (
    Array.isArray(selectedAddonsData) ? selectedAddonsData : []
  ).map((item) => ({
    ...item,
    totalPrice: item.price * (item.quantity || 1),
  }));

  const [comment, setComment] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateError, setSelectedDateError] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedTimeSlotError, setSelectedTimeSlotError] = useState(false);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [pincodeReqError, setPincodeReqError] = useState(false);
  const [pinCodeError, setPinCodeError] = useState(false);
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [combinedDateTimeError, setCombinedDateTimeError] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEventPushed, setIsEventPushed] = useState(false);
  const phoneNumber = safeGetItem("mobileNumber");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cityName = selectedCitySlug;

  useEffect(() => {
    setIsClosed(false);
  }, [combinedDateTimeError]);
  useEffect(() => {
    const loggedInStatus = safeGetItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
    if (!loggedInStatus) {
      setIsModalOpen(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setIsModalOpen(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  /// order.type is 2 for chef
  /// order.type is 1 for decoration
  /// order.type is 3 for waiter
  /// order type 4  bar tender
  /// order type 5 cleaner
  /// order type 6 Single Plate Meal
  /// order type 7 Live Buffer
  /// order type 8 Bulk Catering.

  const handleComment = (e) => {
    const commentText = e.target.value;
    setComment(commentText);
  };

  // Function to get the final comment including add-on products
  const getFinalComment = () => {
    let addOnProductsText = "";

    if (selectedAddOnProduct.length > 0) {
      selectedAddOnProduct
        .map((item) => `${item.title}: ₹${item.price}`)
        .join(" ");
    }

    return comment + addOnProductsText;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedDateError(false);
  };

  const handleTimeSlotChange = (event) => {
    const timeSlot = event.target.value;
    setSelectedTimeSlot(timeSlot);
    setSelectedTimeSlotError(false);
    setCombinedDateTimeError(false);
  };

  const combineDateTime = (date, timeSlot) => {
    if (date && timeSlot) {
      const [startHour, period] = timeSlot.split("-")[0].trim().split(" ");
      let hour = parseInt(startHour.split(":")[0], 10);
      if (period === "PM" && hour !== 12) {
        hour += 12;
      } else if (period === "AM" && hour === 12) {
        hour = 0;
      }

      const combinedDate = new Date(date);
      combinedDate.setHours(hour);
      combinedDate.setMinutes(0);
      combinedDate.setSeconds(0);
      combinedDate.setMilliseconds(0);
      validateDateTime(combinedDate);
      return combinedDate;
    }
  };

  const validateDateTime = (combinedDate) => {
    const now = new Date();
    const timeDifference = combinedDate - now;

    return timeDifference < 24 * 60 * 60 * 1000;
  };

  const generateTimeSlots = () => {
    const startTime = 7; // Starting hour
    const endTime = 22; // Ending hour
    const interval = 3; // Interval in hours

    const timeSlots = [];
    for (let hour = startTime; hour < endTime; hour += interval) {
      const startTimeFormatted =
        hour < 10
          ? `0${hour}:00 AM`
          : `${hour % 12 || 12}:00 ${hour < 12 ? "AM" : "PM"}`;
      const endTimeFormatted =
        hour + interval < 10
          ? `0${hour + interval}:00 AM`
          : `${(hour + interval) % 12 || 12}:00 ${
              hour + interval < 12 ? "AM" : "PM"
            }`;
      timeSlots.push(`${startTimeFormatted} - ${endTimeFormatted}`);
    }

    return timeSlots;
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    if (e.target.value) {
      setAddressError(false);
    } else {
      setAddressError(true);
    }
  };

  const handlePinCodeChange = (e) => {
    if (e.target.value) {
      setPincodeReqError(false);
    } else {
      setPincodeReqError(true);
    }
    setPinCode(e.target.value);
    if (e.target.value.length == 6) {
      const validpin = pincodes.some((validPin) => validPin === e.target.value);
      if (!validpin) {
        setPinCodeError(true);
      } else {
        setPinCodeError(false);
      }
    } else {
      setPinCodeError(true);
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    if (e.target.value) {
      setCityError(false);
    } else {
      setCityError(true);
    }
  };

  const saveAddress = async () => {
    try {
      const url = BASE_URL + SAVE_LOCATION_ENDPOINT;
      // Retrieve userID from localStorage
      let userId = safeGetItem("userID");
      if (!userId) {
        console.error("Error retrieving userID");
        return;
      }
      const address2 = address + pinCode;
      const requestData = {
        address1: address2,
        address2: address2,
        locality: city,
        city: city,
        userId: userId,
      };
      const token = safeGetItem("token");
      const response = await axiosApi.post(url, requestData, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });

      if (response.status === API_SUCCESS_CODE) {
        // Handle navigation in React (e.g., using React Router)
        console.log("Address saved successfully");
        return response.data.data._id;
      }
    } catch (error) {
      console.log("Error  Data:", error.message);
    }
  };

  const onContinueClick = async () => {
    setIsClosed(false);

    if (!selectedTimeSlot) {
      setSelectedTimeSlotError(true);
      setLoading(false);
      return;
    }

    const combinedDate = combineDateTime(selectedDate, selectedTimeSlot);

    if (!combinedDate) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const isInvalid = validateDateTime(combinedDate);

    if (isInvalid) {
      setCombinedDateTimeError(true);
      setLoading(false);
    } else {
      setCombinedDateTimeError(false);
    }
    const apiUrl = BASE_URL + PAYMENT;
    const storedUserID = await safeGetItem("userID");
    // const phoneNumber = await safeGetItem('mobileNumber')
    let merchantTransactionId;
    try {
      const addressID = await saveAddress();
      const storedUserID = await safeGetItem("userID");
      const advanceAmount = Math.round(totalAmount * 0.4);
      const balanceAmount = totalAmount - advanceAmount;
      const url = BASE_URL + CONFIRM_ORDER_ENDPOINT;
      const requestData = {
        toId: "",
        add_on: selectedAddOnProduct,
        order_time: selectedTimeSlot,
        phone_no: phoneNumber,
        no_of_people: 0,
        type: 1,
        fromId: storedUserID,
        is_discount: "0",
        addressId: addressID,
        order_date: formatDate(selectedDate),
        no_of_burner: 0,
        order_locality: city,
        total_amount: totalAmount,
        orderApplianceIds: [],
        payable_amount: totalAmount,
        is_gst: "0",
        advance_amount: advanceAmount,
        balance_amount: balanceAmount,
        order_taken_by: "Booked Online",
        order_type: true,
        order_pincode: pinCode,
        items: [selectedProduct?._id],
        decoration_comments: getFinalComment(),
        status: 0,
      };
      const token = await safeGetItem("token");
      const response = await axiosApi.post(url, requestData, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });
      merchantTransactionId = response.data.data._id;
    } catch (error) {
      console.log("Error Confirming Order:", error.message);
    }

    if (isInvalid) {
      setLoading(false);
      return;
    }

    const requestData2 = {
      user_id: storedUserID,
      price: Math.round(totalAmount * 0.4),
      phone: phoneNumber,
      name: `user_${merchantTransactionId}`,
      merchantTransactionId: merchantTransactionId,
    };
    try {
      if (city && pinCode && address && selectedTimeSlot && selectedDate) {
        if (isInvalid) {
          setCombinedDateTimeError(true);
          setLoading(false);
          return;
        }
        const response2 = await axiosApi.post(apiUrl, requestData2, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        window.location.href = response2.data;
      } else {
        if (!city) {
          setCityError(true);
        }
        if (!pinCode) {
          setPincodeReqError(true);
          setPinCodeError(true);
        }
        if (!address) {
          setAddressError(true);
        }
        if (!selectedTimeSlot) {
          setSelectedTimeSlotError(true);
        }
        if (!selectedDate) {
          setSelectedDateError(true);
        }
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };
  const getDecorationImageUrl = (item) => {
    let fileName = "";

    if (item?.featured_image && typeof item.featured_image === "string") {
      fileName = item.featured_image;
    } else if (
      Array.isArray(item?.featured_image) &&
      item.featured_image.length > 0
    ) {
      fileName =
        item.featured_image[0]?.fileName || item.featured_image[0] || "";
    } else if (item?.featured_images?.[0]?.fileName) {
      fileName = item.featured_images[0].fileName;
    }

    if (!fileName) {
      return "/default-image.webp";
    }

    // Already a complete URL
    if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
      return fileName;
    }

    // Remove existing extension
    const cleanFileName = fileName.replace(/\.[^/.]+$/, "");

    return `https://horaservices.com/api/uploads/compressed_webp/${cleanFileName}.webp`;
  };

  const contactUsRedirection = (category, cityName) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "decoration-checkout_contact_us_click",
      button_name: "Contact Us",
      category: category,
    });

    const messages = {
      "kids-birthday-decoration":
        "Hi, I want to book kids birthday decor design & need more info",
      "birthday-decoration":
        "Hi, I want to book birthday decor design & need more info",
      "anniversary-decoration":
        "Hi, I want to book anniversary decor design & need more info",
      "baby-shower-decoration":
        "Hi, I want to book baby shower decor design & need more info",
      "welcome-baby-decoration":
        "Hi, I want to book baby welcome decor design & need more info",
      "first-night-decoration":
        "Hi, I want to book first night decor design & need more info",
      "premium-decoration":
        "Hi, I want to book premium decor design & need more info",
      "haldi-mehendi-decoration":
        "Hi, I want to book haldi & mehendi decor design & need more info",
      Wedding: "Hi, I want to book wedding decor design & need more info",
      "wedding-decoration":
        "Hi, I want to book wedding decor design & need more info",
      "bachelorette-decoration":
        "Hi, I want to book bachelorette decor design & need more info",
    };

    let message =
      messages[category] ||
      "Hi, I want to book a decoration design & need more info";

    // append city if available
    if (cityName) {
      message += ` for ${cityName}!`;
    } else {
      message += "!";
    }

    setTimeout(() => {
      window.open(
        `https://wa.me/917338584828?text=${encodeURIComponent(message)}`,
        "_blank",
      );
    }, 300);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };

    handleResize(); // Check initial size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedProduct?.name && selectedProduct?.price && !isEventPushed) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "decoration_checkout_page",
        pageUrl: window.location.href,
        productName: selectedProduct?.name,
        productPrice: selectedProduct?.price,
        UserPhoneNumber: phoneNumber,
      });

      setIsEventPushed(true);
    }
  }, [selectedProduct, isEventPushed]);

  if (!isClient) return null;

  return (
    <div className="App">
      {!isLoggedIn && isModalOpen && (
        <OtpLoginPopup setIsModalOpen={setIsModalOpen} fromCheckout />
      )}
      {loading && <Loader />}

      <div className="booking-form-card">
        <div
          style={{
            backgroundImage: `url(${BackgroundDetails.src})`,
            backgroundSize: "600px 500px",
            backgroundPosition: " left -160px top 100px",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Transparent Foreground Form Layer */}
          <div className="booking-form with-bg-shapes">
            <div className="background-shape top-left" />
            <div className="background-shape bottom-right" />

            <h4
              className="form-title"
              style={{ color: "#8b3dff", fontWeight: 700 }}
            >
              Booking Details
            </h4>
            <div className="photographer-note">
              {/* <Image
                src={Infoicon}
                alt="info icon"
                className="info-icon"
              /> */}
              The decorator requires approximately 40–90 minutes to fulfill the
              service.
            </div>
            <div className="form-row">
              <div className="form-half large-input">
                <label className="form-label">Booking Date</label>
                <div className="input-wrapper large-input-field">
                  <CustomDatePicker
                    handleDateChange={handleDateChange}
                    setSelectedDate={setSelectedDate}
                    selectedDate={selectedDate}
                    showDatePicker={showDatePicker}
                    setShowDatePicker={setShowDatePicker}
                    combinedDateTimeError={combinedDateTimeError}
                    selectedDateError={selectedDateError}
                  />
                </div>
              </div>

              <div className="form-half large-input">
                <label className="form-label">Select Time Slot</label>
                <div className="input-wrapper large-input-field">
                  <CustomTimePicker
                    handleTimeSlotChange={handleTimeSlotChange}
                    generateTimeSlots={generateTimeSlots}
                    selectedTimeSlot={selectedTimeSlot}
                    combinedDateTimeError={combinedDateTimeError}
                    selectedTimeSlotError={selectedTimeSlotError}
                  />
                </div>
              </div>
            </div>

            <div className="amountBox">
              <div className="amountRow">
                <span className="labels">TOTAL AMOUNT :</span>
                <span className="value">₹ {totalAmount}</span>
              </div>
              <div className="amountRow">
                <span className="labels">ADVANCE AMOUNT :</span>
                <span className="value">₹ {Math.round(totalAmount * 0.4)}</span>
              </div>
            </div>

            <div className="form-group input-with-icon">
              <label className="form-label">Share comments</label>
              <Image src={CommentIcon} className="input-icon" alt="comment" />
              <textarea
                className="formcontrol"
                value={comment}
                onChange={handleComment}
                rows={4}
                placeholder="No Extra charges for customizing ballon color or replacing tags(Happy Birthday / Anniversary). Chages wil be applied for additional items"
              />
            </div>

            <div className="form-group input-with-icon">
              <label className="form-label">Address:</label>
              <Image src={locationIcon} className="input-icon" alt="location" />
              <textarea
                className="formcontrol"
                value={address}
                onChange={handleAddressChange}
                rows={2}
                placeholder="Enter your address here..."
              />
              {addressError && (
                <p className="error-text">This field is required!</p>
              )}
            </div>

            <div className="form-group input-with-icon">
              <label className="form-label">City:</label>
              <Image src={CityIcon} className="input-icon" alt="city" />
              <select
                value={city}
                onChange={handleCityChange}
                className="formcontrol select-colored"
              >
                <option value="" disabled>
                  Select City
                </option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
              {cityError && (
                <p className="error-text">This field is required!</p>
              )}
            </div>

            <div className="form-group input-with-icon">
              <label className="form-label">Pin Code:</label>
              <Image src={PinIcon} className="input-icon" alt="pincode" />
              <input
                type="text"
                className="formcontrol"
                value={pinCode}
                onChange={handlePinCodeChange}
                placeholder="Enter your pin code here..."
              />
              {pinCode && (
                <p
                  className={`info-text ${pinCodeError ? "error-text" : "success-text"}`}
                >
                  Service {pinCodeError ? "not " : ""}available in your area!
                </p>
              )}
              {pincodeReqError && (
                <p className="error-text">This field is required!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rightSeccheckout">
        <div className="floating-center-image">
          <Image
            src={BackgorundImgDetails}
            alt="Floating Decoration"
            className="floating-image"
          />
        </div>
        <div className="rightsecdecinner photography">
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "rgb(157, 74, 147)",
              margin: "33px 0px 15px 15px",
              lineHeight: "35px",
              width: "100%",
              textAlign: "center",
            }}
          >
            Product Details
          </h3>
          <div className="">
            <Image
              className="checkoutRightImg"
              src={getDecorationImageUrl(selectedProduct)}
              alt={selectedProduct?.name || "Decoration product"}
              width={300}
              height={300}
            />

            <div>
              {/* <label>Product Name :</label> */}
              <p className="productTitle">{selectedProduct?.name || "N/A"}</p>
            </div>

            <div className="prod-details">
              <div className="detailitem">
                <label style={{ color: "black" }}> Product Amount: </label>
                <p style={{ color: "black" }}> ₹{selectedProduct?.price}</p>
              </div>

              <div className="addon-prices">
                <div>
                  {selectedAddOnProduct.length > 0 && (
                    <>
                      <label>Add-Ons :</label>
                      <ul className="addon-list">
                        {selectedAddOnProduct.map((item, index) => (
                          <li key={index} className="addon-item">
                            <span className="addon-title">
                              {index + 1}. {item.title}
                            </span>
                            <span className="addon-price">
                              ₹{item.price} x {item.quantity} = ₹{" "}
                              {item.totalPrice}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
              <div className="detailitem">
                <label style={{ color: "rgb(157, 74, 147)" }}>
                  Total Amount:
                </label>
                <p style={{ color: "rgb(157, 74, 147)" }}>₹{totalAmount}</p>
              </div>
              <div className="detailitem">
                <label>Advance Amount:</label>
                <p>₹ {Math.round(totalAmount * 0.4)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="needmore">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: " center",
              justifyContent: "space-evenly",

              width: "100%",
            }}
          >
            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "black",
                marginBottom: 0,
              }}
            >
              Need more info?
            </p>
            <button
              className="button-cta whatsapp-cta"
              onClick={() => contactUsRedirection(selectedCatValue, cityName)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-message-circle icon-cta"
              >
                <path
                  d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"
                  className="whatsapp-iconimg"
                ></path>
              </svg>
              Whatsapp
            </button>
          </div>
        </div>
        <div className="policy-wrapper">
          <div className="policy-heading">
            <Image
              src={cancellation}
              className="policy-icon"
              height={18}
              width={16}
            />

            <span className="policy-title">
              Cancellation and Order Change Policy
            </span>
          </div>
          <ol className="policy-list">
            <li>
              If the order is beyond 48 hours: You are eligible for a 100%
              refund of the advance payment.
            </li>
            <li>
              If the order is cancelled more than 24 hours before the scheduled
              delivery: You will not receive refund of the advance payment.
            </li>
            <li>
              If the order is cancelled within 24 hours: The full advance amount
              will be non-refundable, and 100% of the payment for decoration has
              to be paid by customer.
            </li>
          </ol>
        </div>
      </div>

      <div className="confirmbutton-wrapper">
        <button
          className="confirmbutton"
          onClick={onContinueClick}
          type="button"
        >
          Confirm Order
        </button>
      </div>
      {combinedDateTimeError && !isClosed && (
        <UrgentBookingModal
          onClose={() => {
            setIsClosed(true);
            setCombinedDateTimeError(false);
          }}
          onWhatsApp={() =>
            contactUsRedirect({
              type: "decoration",
              category: selectedCatValue,
              city: cityName,
              selectedDate,
              selectedTimeSlot,
              address,
              totalAmount,
              product: selectedProduct,
              selectedAddOnProduct,
              comment: getFinalComment(),
              router,
            })
          }
        />
      )}
    </div>
  );
};

export default Checkout;

export const CustomDatePicker = ({
  handleDateChange,
  selectedDate,
  showDatePicker,
  setShowDatePicker,
  selectedDateError,
  combinedDateTimeError,
}) => {
  const toggleDatePicker = () => {
    setShowDatePicker((prev) => !prev);
  };
  // const handleToggle = (isOpen, event, metadata) => {
  //   // Agar user ne bahar click kiya ya toggle button pe click kiya
  //   // dropdown open/close ka status yaha milega
  //   setShowDatePicker(isOpen);
  // };

  return (
    <div
      className={`custom-datepicker-container ${combinedDateTimeError ? "error" : ""}`}
    >
      <Dropdown show={showDatePicker} onToggle={toggleDatePicker}>
        <Dropdown.Toggle
          variant="outline-secondary"
          className={`dropdown-toggle-custom ${selectedDateError ? "error" : ""}`}
          style={{ cursor: "pointer" }}
        >
          <span>
            {selectedDate ? selectedDate.toLocaleDateString() : " Select Date"}
          </span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-menu-custom" show={showDatePicker}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            inline
          />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
export const CustomTimePicker = ({
  selectedTimeSlot,
  handleTimeSlotChange,
  generateTimeSlots,
  selectedTimeSlotError,
  combinedDateTimeError,
}) => {
  return (
    <div
      className={`custom-timepicker-container ${
        combinedDateTimeError || selectedTimeSlotError ? "error" : ""
      }`}
    >
      <Form.Control
        as="select"
        value={selectedTimeSlot}
        onChange={handleTimeSlotChange}
        className="timeslot-select"
      >
        <option value="">🕒 Arrival Time</option>
        {generateTimeSlots().map((timeSlot, index) => (
          <option key={index} value={timeSlot}>
            {timeSlot}
          </option>
        ))}
      </Form.Control>
    </div>
  );
};
