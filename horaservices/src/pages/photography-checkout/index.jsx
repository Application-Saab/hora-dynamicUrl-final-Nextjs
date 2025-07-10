
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import Head from "next/head";
import axios from 'axios';
import { BASE_URL, GET_ADDRESS_LIST, CONFIRM_ORDER_ENDPOINT, SAVE_LOCATION_ENDPOINT } from '../../utils/apiconstants';
import { PAYMENT, PAYMENT_STATUS, API_SUCCESS_CODE } from '../../utils/apiconstants';
import { Form, Dropdown } from 'react-bootstrap';
import '../../css/decoration.css';
import { useRouter } from 'next/router';
import Image from 'next/image';
import InfoIcon from '../../assets/info.png'
import Loader from '../../components/Loader'
import { pincodes } from "../../utils/pincodes.js"
import OtpLoginPopup from "@/components/OtpLoginPopup";
import "./photographyCheckout.css";
import { getPhotographyOrganizationSchema } from "../../utils/schema";
import BackgroundDetails from "../../assets/BackgroundDetails.svg";
import productsData from '../../utils/photoGraphyImages.js';
import CommentIcon from "../../assets/commenticon.png";
import locationIcon from "../../assets/locationIcon.png";
import CityIcon from "../../assets/CityIcon.png";
import PinIcon from "../../assets/Pincode.jpeg";
import cancellation from "../../assets/Cancellation.svg"
import BackgorundImgDetails from "../../assets/BackgorundImgDetails.svg"
const Checkout = () => {
  const router = useRouter();
   const schemaOrg = getPhotographyOrganizationSchema();
   const scriptTag = JSON.stringify(schemaOrg);
  let { product, totalAmount, orderType, } = router.query;// Accessing subCategory and itemName safely
  console.log(product)
  const selectedAddOnProduct = router.query.selectedAddOnProduct ? JSON.parse(router.query.selectedAddOnProduct) : [];// 
console.log(selectedAddOnProduct)
 const itemQuantities = router.query.itemQuantities ? JSON.parse(router.query.itemQuantities) : {};
  const [comment, setComment] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateError, setSelectedDateError] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedTimeSlotError, setSelectedTimeSlotError] = useState(false);
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pincodeReqError, setPincodeReqError] = useState(false);
  const [pinCodeError, setPinCodeError] = useState(false);
  const [city, setCity] = useState('');
  const [cityError, setCityError] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [combinedDateTime, setCombinedDateTime] = useState(null);
  const [combinedDateTimeError, setCombinedDateTimeError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEventPushed, setIsEventPushed] = useState(false);
  const phoneNumber = localStorage.getItem("mobileNumber");
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sendInclusion, setSendInclusion] = useState(false);
  const [productPrice, setProductPrice] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [productDuration, setProductDuration] = useState(null);
  const [productData, setProductData] = useState(null);

  if (product) {
    product = JSON.parse(product)
  }

  const parseInclusions = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const divs = doc.querySelectorAll('div');
    return Array.from(divs).map(div => div.textContent.trim());
  };

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.product) {
      const parsedProduct = JSON.parse(router.query.product);
    
      const formattedInclusions = parseInclusions(parsedProduct.inclusion[0]);
      setSendInclusion(formattedInclusions);
      setProductPrice(product.price);
      setProductData(parsedProduct);

      // Product ID se local image set karo
      if (parsedProduct._id && productsData[parsedProduct._id]) {
        setProductImage(productsData[parsedProduct._id].images[0]);
        setProductDuration(productsData[parsedProduct._id].durationMaxslot);
      }
    }
  }, [router.isReady, router.query.product]);


  useEffect(() => {
    // Check localStorage or a cookie for login status, or call an API
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true'; // Check login status
    setIsLoggedIn(loggedInStatus); // Update state based on login status
    if (!loggedInStatus) {
      setIsModalOpen(true); // Open modal if not logged in
    }
    setLoading(false); // Done with loading
  }, []); // Run once when component mounts

  useEffect(() => {
    // If logged in, close the modal
    if (isLoggedIn) {
      setIsModalOpen(false);
    }
  }, [isLoggedIn]); // This will run when `isLoggedIn` state changes

  useEffect(() => {
    setIsClient(true)
  }, [])
  //   1: "Decoration",
  //       2: "Chef",
  //       3: "Waiter",
  //       4: "Bar Tender",
  //       5: "Cleaner",
  //       6: "Food Delivery",
  //       7: "Live Catering",
  //       8: "Photography",
  const handleComment = (e) => {
    const commentText = e.target.value;
    setComment(commentText);
  };

  // Function to get the final comment including add-on products
  const getFinalComment = () => {
    let addOnProductsText = "";

    if (selectedAddOnProduct.length > 0) {
      selectedAddOnProduct.map(item => `${item.title}: ₹${item.price}`).join(" ");
    }

    return comment + addOnProductsText;
  };


  const handleDateChange = (date) => {
    // console.log(`Date selected: ${date}`);
    setSelectedDate(date);
    setSelectedDateError(false);
    combineDateTime(date, selectedTimeSlot); // Pass the current selected time slot
  };

  const handleTimeSlotChange = (event) => {
    const timeSlot = event.target.value;
    // console.log(`Time slot selected: ${timeSlot}`);
    setSelectedTimeSlot(timeSlot);
    setSelectedDateError(false);
    combineDateTime(selectedDate, timeSlot); // Pass the current selected date
  };

  const combineDateTime = (date, timeSlot) => {
    // console.log(`Combining Date: ${date} with Time Slot: ${timeSlot}`);
    if (date && timeSlot) {
      const [startHour, period] = timeSlot.split('-')[0].trim().split(' ');
      let hour = parseInt(startHour.split(':')[0], 10);
      if (period === 'PM' && hour !== 12) {
        hour += 12;
      } else if (period === 'AM' && hour === 12) {
        hour = 0;
      }

      const combinedDate = new Date(date);
      // console.log(`Initial Combined Date: ${combinedDate}`);
      combinedDate.setHours(hour);
      combinedDate.setMinutes(0);
      combinedDate.setSeconds(0);
      combinedDate.setMilliseconds(0);
      // console.log(`Final Combined Date: ${combinedDate}`);
      setCombinedDateTime(combinedDate);
      validateDateTime(combinedDate);
    }
  };

  const validateDateTime = (combinedDate) => {
    const now = new Date();
    // console.log(`Combined Date for Validation: ${combinedDate}`);
    const timeDifference = combinedDate - now;
    // console.log(`Time Difference: ${timeDifference} ms`);
    // Check if the combined date and time are at least 24 hours in the future
    if (timeDifference < 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
      console.log("The selected date and time are less than 24 hours from now.");
      setCombinedDateTimeError(true);
    } else {
      console.log("The selected date and time are valid.");
      setCombinedDateTimeError(false);
    }
  };

  const generateTimeSlots = () => {
    const startTime = 7; // Starting hour
    const endTime = 22; // Ending hour
    const interval = 1// Interval in hours

    const timeSlots = [];
    for (let hour = startTime; hour < endTime; hour += interval) {
      const startTimeFormatted = hour < 10 ? `0${hour}:00 AM` : `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
      const endTimeFormatted = hour + interval < 10 ? `0${hour + interval}:00 AM` : `${(hour + interval) % 12 || 12}:00 ${hour + interval < 12 ? 'AM' : 'PM'}`;
      timeSlots.push(`${startTimeFormatted} - ${endTimeFormatted}`);
    }
    return timeSlots;
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    if (e.target.value) {
      setAddressError(false)
    } else {
      setAddressError(true)
    }
  };

  const handlePinCodeChange = (e) => {
    if (e.target.value) {
      setPincodeReqError(false)
    } else {
      setPincodeReqError(true)
    }
    setPinCode(e.target.value);
    if (((e.target.value).length) == 6) {
      const validpin = pincodes.some((validPin) => validPin === e.target.value)
      if (!validpin) {
        setPinCodeError(true)
      } else {
        setPinCodeError(false)
      }
    } else {
      setPinCodeError(true)
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    if (e.target.value) {
      setCityError(false)
    } else {
      setCityError(true)
    }
  };

  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  const saveAddress = async () => {
    try {
      const url = BASE_URL + SAVE_LOCATION_ENDPOINT;
      // Retrieve userID from localStorage
      let userId = localStorage.getItem("userID");
      if (!userId) {
        console.error('Error retrieving userID');
        return;
      }
      const address2 = address + pinCode;
      const requestData = {
        address1: address2,
        address2: address2,
        locality: city,
        city: city,
        userId: userId
      };
      const token = localStorage.getItem('token');
      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        },
      });

      if (response.status === API_SUCCESS_CODE) {
        // Handle navigation in React (e.g., using React Router)
        console.log("Address saved successfully");
        return response.data.data._id
      }
    } catch (error) {
      console.log('Error  Data:', error.message);
    }
  };
  const addonAdvanceAmount = selectedAddOnProduct.reduce((acc, item) => {
      const qty = itemQuantities[item.title] || 0;
      return acc + Math.round((item.price * qty) * 0.35);
        }, 0)


  const onContinueClick = async () => {
    setLoading(true);
    const apiUrl = BASE_URL + PAYMENT;
    const storedUserID = await localStorage.getItem('userID');
    // const phoneNumber = await localStorage.getItem('mobileNumber')
    let merchantTransactionId;
    try {
      const addressID = await saveAddress();
      const storedUserID = await localStorage.getItem('userID');
     
    

const advanceAmount = (advanceAmountData[productData?.name] || Math.round(totalAmount * 0.35)) + addonAdvanceAmount;

      const balanceAmount = totalAmount - advanceAmount;
      const url = BASE_URL + CONFIRM_ORDER_ENDPOINT;

      const requestData = {
        "toId": "",
        "add_on": selectedAddOnProduct,
        // "add_on": sendInclusion,
        "order_time": selectedTimeSlot,
        "phone_no": phoneNumber,
        "no_of_people": 0,
        "type": 8,
        "fromId": storedUserID,
        "is_discount": "0",
        "addressId": addressID,
        "order_date": selectedDate.toDateString(),
        "no_of_burner": 0,
        "order_locality": city,
        "total_amount": totalAmount,
        "orderApplianceIds": [],
        "payable_amount": totalAmount,
        "is_gst": "0",
        "advance_amount": advanceAmount,
        "balance_amount": balanceAmount,
        "order_taken_by": "Booked Online",
        "order_type": true,
        "order_pincode": pinCode,
        "items": [product._id],
        "decoration_comments": getFinalComment(),
        "status": 0
      }
      const token = await localStorage.getItem('token');
      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        },
      });
      merchantTransactionId = response.data.data._id
      //}
    } catch (error) {
      console.log('Error Confirming Order:', error.message);
    }

console.log("advanceAmount",advanceAmount);

    const requestData2 = {
      user_id: storedUserID,
      price:advanceAmount,
      phone: phoneNumber,
      name: '',
      merchantTransactionId: merchantTransactionId
    };
    try {
      if (city && pinCode && address && selectedTimeSlot && selectedDate) {
        if (combinedDateTimeError) {
          alert("The selected date and time must be at least 24 hours from now.");
          return;
        }
        const response2 = await axios.post(apiUrl, requestData2, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        window.location.href = response2.data
      } else {
        if (!city) {
          setCityError(true)
        }
        if (!pinCode) {
          setPincodeReqError(true)
          setPinCodeError(true)
        }
        if (!address) {
          setAddressError(true)
        }
        if (!selectedTimeSlot) {
          setSelectedTimeSlotError(true)
        }
        if (!selectedDate) {
          setSelectedDateError(true)
        }
      }
    } catch (error) {
      // Handle errors
      console.error('API error:', error);
    }
    finally {
      setLoading(false); // Hide loader
    }
  }




  const contactUsRedirection = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "photography_checkout_contact_us_click",
    });
    window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20Photography%20services")
  };



  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    if (product?.name && product?.price && !isEventPushed) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'photography_checkout_page',
        pageUrl: window.location.href,
        productName: product.name,
        productPrice: product.price,
        UserPhoneNumber: phoneNumber,

      });

      setIsEventPushed(true);
    }
  }, [product, isEventPushed])

  if (!isClient) return null;
const advanceAmountData = {
  // Initmate
  "Traditional Photography": 1260,
  "Candid Photography": 1660,
  "Pro Photography": 2660,
  "VideoGraphy": 2450,
  // Mega
  "Mega Traditional Photography": 3200,
  "Mega Candid Photography": 4700,
  "Mega Pro Photography": 7200,
  "Mega VideoGraphy": 7200,
  // Grand
  "Haldi & Mehandi": 6000,
  "Pre-wedding shoot and videography": 9600,
  "Wedding Affair": 10000,
  "Grand Wedding Affair": 26000,
};
const advanceAmount = (advanceAmountData[productData?.name] || Math.round(totalAmount * 0.35)) + addonAdvanceAmount;

console.log(advanceAmount);


  return (
    <div className="App">
       <Head>
        <title>HORA Photography : Professional photography for all events - Birthdays, Parties, & Weddings – Starting at ₹3500</title>
        <meta
          name="description"
          content="📸 Capture Every Moment, Forever! ✨
       Welcome to HORA Photography — where every click tells your story! 😊 Whether it's a dreamy wedding, a cute baby welcome, or a rocking birthday bash 🎉, our professional photographers are here to make your moments look as magical as they felt. Specialized packages for:
      Weddings 👰‍♀️🤵
      Maternity & Baby Shoots 🤰👼
      Birthdays & Anniversaries 🎂❤️
      Housewarming & Corporate Events" />
         <meta
          name="keywords"
          content="couple photoshoot, romantic photoshoot for couples, pre wedding photoshoot, pre wedding photography, couple pre wedding photography, candid pre wedding shoot, pre bridal photography, pre wedding shoot price, pre wedding shoot in bangalore, 
          couples photography, maternity photoshoot, maternity photoshoot near me, maternity photo sessions, maternity photoshoot in bangalore, maternity couple photoshoot, mother to be photoshoot, maternity shoot near me, pregnancy photoshoot near me, 
          pregnancy photo shoot, photography in pregnancy, pregnant women photoshoot, motherhood photoshoot, pregnant ladies photoshoot, couple pregnancy photoshoot, seemantham photoshoot, pregnancy photoshoot in bangalore, newborn photography, infant photography,
           baby photography near me, newborn photography near me, newborn photoshoot, infant photographers near me, newborn portraits near me, newborn family photoshoot, family photography with newborn, cake smash photoshoot, first birthday cake smash photoshoot, 
           engagement photo shoot, engagement photoshoot, engagement couple photography, engagement photography, wedding photographer, wedding photographer near me, wedding photoshoot, photographer wedding, candid wedding photography, marriage photoshoot, post wedding photoshoot, 
           bridal photoshoot, traditional photography, wedding photographers in bangalore, marriage photographers in bangalore, birthday photoshoot, first birthday photoshoot, pre birthday photoshoot, birthday celebration photoshoot, birthday photo session, 18th photoshoot, 
           birthday party photographer, event photography, photoshoot for wedding anniversary, anniversary photoshoot, candid photography, cinematic photography, fashion photography, model photography, black and white photography, landscape photography, portrait photography, 
           photographers near me, professional photographer near me, professional photographer, freelance photographer, best photographers near me, photoshoot near me, photographer in bangalore, photography in bangalore, bangalore photoshoot, photography services"
        />
        <meta property="og:title" content="HORA Photography : Professional photography for all events" />
        <meta
          property="og:description"
          content="Professional event photography for weddings, birthdays, baby showers, and more. Book today for stunning, affordable memories — starting at just ₹3500!"
        />
        <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
        <meta property="og:url" content="https://horaservices.com/photography" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
        <script type="application/ld+json">{scriptTag}</script>
      </Head>
      {!isLoggedIn && isModalOpen && <OtpLoginPopup setIsModalOpen={setIsModalOpen} />}
      {loading && <Loader />}

      <div className="booking-form-card" >
        <div style={{

          backgroundImage: `url(${BackgroundDetails.src})`,
          backgroundSize: '423px 100%',
          backgroundPosition: ' left 0px top 40%',
          backgroundRepeat: 'no-repeat',

        }} >

          {/* Transparent Foreground Form Layer */}
          <div className="booking-form with-bg-shapes" >
            <div className="background-shape top-left" />
            <div className="background-shape bottom-right" />

            <h4 className="form-title" style={{ color: '#8b3dff', fontWeight: 700 }}>Booking Details</h4>
  <div className="photographer-note">
       Photographer will be available for {productDuration} after arrival.
  {/* Need more info ? chat on WhatsApp now! */}
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

            {combinedDateTimeError && (
              <p className="error-text">
                The selected date and time must be at least 24 hours from now.
              </p>
            )}

            <div className="form-group input-with-icon">
              <label className="form-label">Share comments</label>
              <Image src={CommentIcon} className="input-icon" alt="comment" />
              <textarea
                className="formcontrol"
                value={comment}
                onChange={handleComment}
                rows={2}
                placeholder="Enter your comments here..."
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
              {addressError && <p className="error-text">This field is required!</p>}
            </div>

            <div className="form-group input-with-icon">
              <label className="form-label">City:</label>
              <Image src={CityIcon} className="input-icon" alt="city" />
              <select
                value={city}
                onChange={handleCityChange}
                className="formcontrol select-colored"
              >
                <option value="" disabled>Select City</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
              {cityError && <p className="error-text">This field is required!</p>}
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
                <p className={`info-text ${pinCodeError ? "error-text" : "success-text"}`}>
                  Service {pinCodeError ? "not " : ""}available in your area!
                </p>
              )}
              {pincodeReqError && <p className="error-text">This field is required!</p>}
            </div>

          </div>
        </div>
      </div>



      <div className="rightSeccheckout" >
        <div className="floating-center-image">
          <Image
            src={BackgorundImgDetails}
            alt="Floating Decoration"
            className="floating-image"
          />
        </div>
        <div className='rightsecdecinner photography'>
          <h3 style={{ fontSize: "22px", fontWeight: "600", color: "rgb(157, 74, 147)", margin: "33px 0 11px 0", lineHeight: "35px", width: "100%", textAlign: "center" }}>Product Details</h3>
          <div className='d-flex flex-column flex-lg-row'>

            <div >
              {/* <label>Product Name :</label> */}
              <p className='productTitle'>{productData?.name || "N/A"}</p>
            </div>
            {/* <div className='prod-detailsp'>
              {productImage && (
                <div className='detail-item'>
                  <Image src={productImage} alt={product.name} className="detailimage" />
                </div>
              )}
            </div> */}

            <div className='prod-details'>
         
              <div className='detailitem'>
                <label>Product Amount:</label>
                <p>₹{productPrice}</p>
              </div>
              <div className='addon-prices'>
                        <div >
                         {selectedAddOnProduct.length > 0 && (
  <>
    <label>Add-Ons :</label>
    <ul className="addon-list">
      {selectedAddOnProduct.map((item, index) => (
        <li key={index} className="addon-item">
          <span className="addon-title">{index + 1}. {item.title}</span>
          <span className="addon-price">₹ {item.price} x {itemQuantities[item.title]} = ₹ {item.price * itemQuantities[item.title]}</span>
        </li>
      ))}
    </ul>
  </>
)}

                        </div>
                      </div>
                     
              <div className='detailitem'>
                <label style={{ color: "rgb(157, 74, 147)"}}>Total Amount:</label>
                <p style={{ color: "rgb(157, 74, 147)"}}>₹{totalAmount}</p>
              </div>
               {/* <div className='detailitem'>
                <label style={{ color: "rgb(157, 74, 147)"}}>Advance Amount:</label>
                <p style={{ color: "rgb(157, 74, 147)"}}>₹ {Math.round(totalAmount * 0.35)}</p>
              </div> */}
<div className='detailitem'>
  <label style={{ color: "rgb(157, 74, 147)" }}>Advance Amount:</label>
  <p style={{ color: "rgb(157, 74, 147)" }}>₹ {advanceAmount}</p>
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
              // padding: "0px 12px 10px",
              width: "100%",
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 500, color: "black", marginBottom: 0 }}>
              Need more info?
            </p>

            <button className="button-cta whatsapp-cta" onClick={contactUsRedirection}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle icon-cta"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" className="whatsapp-iconimg"></path></svg>Whatsapp</button>

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

            <span className="policy-title">Cancellation and Order Change Policy</span>
          </div>
          <ol className="policy-list">
            <li>
              If the order is beyond 48 hours: You are eligible for a 100% refund of the advance payment.
            </li>
            <li>
              If the order is cancelled more than 24 hours before the scheduled delivery: You will not receive refund of the advance payment.
            </li>
            <li>
              If the order is cancelled within 24 hours: The full advance amount will be non-refundable, and 100% of the payment for decoration has to be paid by customer.
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

      </div>
  );
}

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
    <div className={`custom-datepicker-container ${combinedDateTimeError ? 'error' : ''}`}>

      <Dropdown show={showDatePicker} onToggle={toggleDatePicker} className="dropdown-custom">
        <Dropdown.Toggle
          variant="outline-secondary"
          className={`dropdown-toggle-custom ${selectedDateError ? 'error' : ''}`}
          style={{ cursor: 'pointer' }}
        >
          <span>{selectedDate ? selectedDate.toLocaleDateString() : ' Select Date'}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-menu-custom" show={showDatePicker} >
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
      className={`custom-timepicker-container ${combinedDateTimeError || selectedTimeSlotError ? 'error' : ''
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