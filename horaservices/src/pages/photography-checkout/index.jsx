
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL, CONFIRM_ORDER_ENDPOINT, SAVE_LOCATION_ENDPOINT } from '../../utils/apiconstants';
import { PAYMENT, PAYMENT_STATUS, API_SUCCESS_CODE } from '../../utils/apiconstants';
import '../../css/decoration.css';
import { useRouter } from 'next/router';
import Image from 'next/image';
import InfoIcon from '../../assets/info.png'
import Loader from '../../components/Loader'
import { pincodes }  from "../../utils/pincodes.js"
import OtpLoginPopup from "@/components/OtpLoginPopup";
import { contactUsRedirection } from '@/util/contactUsRedirection';
import { generateTimeSlots } from '@/util/generateTimeSlot';
import { CustomDatePicker } from '@/component/DatePicker';
import { CustomTimePicker } from '@/component/TimePicker';

const Checkout = () => {
  const router = useRouter();
  let { product , totalAmount ,orderType} = router.query; // Accessing subCategory and itemName safely
  const selectedAddOnProduct = router.query.selectedAddOnProduct ? JSON.parse(router.query.selectedAddOnProduct) : [];
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
  const [combinedDateTimeError, setCombinedDateTimeError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEventPushed, setIsEventPushed] = useState(false);
  const phoneNumber =  localStorage.getItem("mobileNumber");
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  if (product) {
    product = JSON.parse(product)
  }
  

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

  const saveAddress = async () => {
    try {
      console.log("Inside saveAddress");
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

  const onContinueClick = async () => {
    setLoading(true);
    const apiUrl = BASE_URL + PAYMENT;
    const storedUserID = await localStorage.getItem('userID');
    // const phoneNumber = await localStorage.getItem('mobileNumber')
    let merchantTransactionId;
    console.log('selectedAddOnProduct' , selectedAddOnProduct , phoneNumber, totalAmount);
    try {
      const addressID = await saveAddress();
      const storedUserID = await localStorage.getItem('userID');
      const advanceAmount = Math.round(totalAmount * 0.35);
      const balanceAmount = totalAmount - advanceAmount;
      const url = BASE_URL + CONFIRM_ORDER_ENDPOINT;
      const requestData = {
        "toId": "",
        "add_on": selectedAddOnProduct,
        "order_time": selectedTimeSlot,
        "phone_no": phoneNumber,
        "no_of_people": 0,
        "type":8,
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
console.log("redData" , requestData);
      const token = await localStorage.getItem('token');
      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        },
      });
      merchantTransactionId = response.data.data._id
      }
     catch (error) {
      console.log('Error Confirming Order:', error.message);
    }
  

    const requestData2 = {
      user_id: storedUserID,
      price: Math.round(totalAmount * 0.35),
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
        UserPhoneNumber: phoneNumber
      });

      setIsEventPushed(true);
    }
  }, [product, isEventPushed])

  if (!isClient) return null;

  return (
    <div className="App">
        {!isLoggedIn && isModalOpen && <OtpLoginPopup setIsModalOpen={setIsModalOpen} />} 
       {loading && <Loader />}
      {
        isClient && window.innerWidth > 800 ?
          <div style={{ padding: "1% 2%", backgroundColor: "#edededc9" }}>
            <div style={{ display: "flex", alignItems: "start", margin: "0 !important", padding: "10px 0" }} className='checoutSec my-3 gap-3'>
              <div style={{ width: "40%", boxShadow: "0 1px 8px rgba(0,0,0,.18)", padding: "20px", backgroundColor: "#fff", borderRadius: "20px" }} className='leftSeccheckout'>
                <h2 style={{ fontSize: "22px", fontWeight: "400", color: "#222", borderBottom: "1px solid #f0f0f0", margin: "0 0 8px 0", lineHeight: "35px" }}>Booking Details</h2>

                <div className='border border-danger p-1 px-3 rounded bg-danger-subtle text-black text-center' style={{ color: '#000', fontSize: 12, fontWeight: '500', textAlign: 'left', color: "#9252AA" }}>
                Photographer will be available for 4 hours after arrival.
                </div>

                <div style={{ display: 'flex', margin: "8px 0px 10px", flexDirection: "row" }} className='row align-items-between justify-content-between   align-items-lg-center justify-content-lg-between'>
                  <CustomDatePicker handleDateChange={handleDateChange} setSelectedDate={setSelectedDate} selectedDate={selectedDate} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} combinedDateTimeError={combinedDateTimeError} selectedDateError={selectedDateError} />
                  <CustomTimePicker handleTimeSlotChange={handleTimeSlotChange} generateTimeSlots={generateTimeSlots} selectedTimeSlot={selectedTimeSlot} combinedDateTimeError={combinedDateTimeError} selectedTimeSlotError={selectedTimeSlotError} />
                </div>
                {combinedDateTimeError && <p className="text-danger" style={{ fontSize: '12px', marginBottom: "0px" }}>The selected date and time must be at least 24 hours from now.</p>}
                <div className='checkoutInputType  rounded-4  ' style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                  <h4 style={{ color: "rgb(146, 82, 170)", fontSize: "14px", marginBottom: "4px" }}>Share your comments (if any)</h4>
                  <textarea className=' rounded border  p-1 bg-white text-black'
                    value={comment}
                    onChange={handleComment}
                    rows={3}
                    placeholder="Enter your comment."
                  />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} className='checkoutInputType'>
                    <label style={{ color: "rgb(146, 82, 170)", fontSize: "14px", fontWeight: "600" }}>Address:</label>
                    <textarea
                      type="text"
                      className='rounded border  p-1 bg-white text-black'
                      value={address}
                      onChange={handleAddressChange}
                      rows={3}
                      placeholder="Enter your Address."
                    />
                    {addressError && <p className={`p-0 m-0 ${addressError ? "text-danger" : ""}`}>This field is required!</p>}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} className='checkoutInputType'>
                    <label style={{ color: "rgb(146, 82, 170)", fontSize: "14px", marigin: "16px 0 6px", fontWeight: 600 }}>Pin Code:</label>
                    <input
                      type="text" className=' rounded border  p-1 bg-white text-black'
                      value={pinCode}
                      onChange={handlePinCodeChange}
                    />
                    {pinCode && <p className={`p-0 m-0 ${pinCodeError ? "text-danger" : "text-success"}`}>{`Service ${pinCodeError ? 'not' : ''} available in your area!`}</p>}
                    {pincodeReqError && <p className={`p-0 m-0 ${pincodeReqError ? "text-danger" : ""}`}>This field is required!</p>}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} className='checkoutInputType'>
                    <label style={{ color: "rgb(146, 82, 170)", fontSize: "14px", marigin: "16px 0 6px", fontWeight: 600 }}>City:</label>
                    <select value={city} className=' rounded border  p-1 bg-white text-black' onChange={handleCityChange}>
                      <option value="">Select City</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Hyderabad">Hyderabad</option>
                      {/* Add more cities as needed */}
                    </select>
                    {cityError && <p className={`p-0 m-0 ${cityError ? "text-danger" : ""}`}>This field is required!</p>}
                  </div>
                </div>
                <button onClick={onContinueClick} className="blue-btn chkeoutBottun">Confirm Order</button>
              </div>
{/* order summary box============= */}
              <div className="rightSeccheckout" style={{ boxShadow: "0 1px 8px rgba(0,0,0,.18) ", padding: "20px", backgroundColor: "#fff", borderRadius: "20px", width: "59%" }} >
                <div className='rightsecdecinner decoration'>
                  <h3 style={{ fontSize: "22px", fontWeight: "400", color: "#222", borderBottom: "1px solid #f0f0f0", margin: "0 0 11px 0", lineHeight: "35px", width: "100%" }}>Order Summary</h3>
                  <div className='d-flex flex-column flex-lg-row'>
                  
                    <div className='prod-detailsp'>

                    
                      <div className='add-on-prices'>

                        <div>
                          {selectedAddOnProduct.length > 0 && (
                            <>
                              <label>Customisations</label>
                              {selectedAddOnProduct.map((item, index) => (
                                <li key={index}>
                                  <div>
                                    {item.title}
                                  </div>
                                  <div>
                                    ₹ {item.price} 

                                  </div>
                                </li>
                              ))}

                            </>
                          )}
                        </div>
                      </div>

                      <div className='detail-item'>
                        <label>Total Amount:</label>
                        <p>₹{totalAmount}</p>
                      </div>

                      <div className='detail-item'>
                        <label>Advance Amount:</label>
                        <p>₹ {Math.round(totalAmount * 0.35)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div >
                  <div className='d-flex flex-wrap justify-content-center align-items-center need-more-info-sec'>
                    <h5 className='mt-2'>Need more info?</h5>
                    <button onClick={contactUsRedirection} style={{ border: "2px solid rgb(157, 74, 147)", color: "rgb(157, 74, 147)", padding: "0px 12px" }} className='rounded-5 ms-1 bg-transparent contactus-redirection'>Contact Us</button>
                  </div>
                  <div className='px-1 py-3 border rounded my-2 cancellatiop-policy' style={{
                    background: "rgb(157, 74,147, 28%)"
                  }}>
                    <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className=' text-center m-1'>Cancellation and order change policy</p>
                    <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className='m-1'>1. If the order is beyong 48 Hours: You are eligible for a 100% refund of the advance payment</p>
                    <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className='m-1'>2. If the order is cancelled more than 24 hours before the scheduled delivery: You will not receive refund of the advance payment.</p>
                    <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className='m-1'>3. If the order is cancelled within 24 hours: The full advance amount will be non-refundable, and 100% of the payment for decoration has to be paid by customer.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          <div style={{ padding: "1% 2%", backgroundColor: "#edededc9", position: "relative" }} className='checkoutmobileview'>
            <div className='checoutSec my-3 gap-3'>
              <div>
                {/* <h2 style={{ fontSize: "22px", fontWeight: "400", color: "#222", borderBottom: "1px solid #f0f0f0", margin: "0 0 8px 0", lineHeight: "35px" }}>Booking Details</h2> */}

                <div className='border border-danger p-1 px-3 rounded bg-danger-subtle text-black text-center decoratore-note' style={{ color: '#000', fontSize: 12, fontWeight: '500', textAlign: 'left', color: "#9252AA" }}>
                Photographer will be available for 4 hours after arrival.
                </div>

                <div style={{ display: 'flex', margin: "8px 0px 10px", flexDirection: "row" }} className='row align-items-between justify-content-between  align-items-lg-center justify-content-lg-between'>
                  <CustomDatePicker handleDateChange={handleDateChange} setSelectedDate={setSelectedDate} selectedDate={selectedDate} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} combinedDateTimeError={combinedDateTimeError} selectedDateError={selectedDateError} />
                  <CustomTimePicker handleTimeSlotChange={handleTimeSlotChange} generateTimeSlots={generateTimeSlots} selectedTimeSlot={selectedTimeSlot} combinedDateTimeError={combinedDateTimeError} selectedTimeSlotError={selectedTimeSlotError} />
                  {combinedDateTimeError && <p className="text-danger" style={{ fontSize: '12px' }}>The selected date and time must be at least 24 hours from now.</p>}
                </div>

                <div className="rightSeccheckout" style={{ boxShadow: "0 1px 8px rgba(0,0,0,.18) ", padding: "20px", backgroundColor: "#fff", borderRadius: "20px" }} >
                  <div className='rightcheckoutsec'>
                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", margin: "5px 0 5px 0" }}>
                      <label style={{ color: "rgb(146, 82, 170)", fontSize: "14px", marigin: "16px 0 6px", fontWeight: 700 }}>Product Amount:</label>
                      <p style={{ margin: 0, windth: "100%", color: "rgb(146, 82, 170)", fontSize: "16px", fontWeight: 700 }}>₹  {product?.price}</p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", margin: "0 0 10px 0" }}>
                      <label style={{ color: "rgb(146, 82, 170)", fontSize: "14px", marigin: "16px 0 6px", fontWeight: 700 }}>Advance Amount:</label>
                      <p style={{ margin: 0, windth: "100%", color: "rgb(146, 82, 170)", fontSize: "16px", fontWeight: 700 }}>₹ {Math.round(totalAmount * 0.35)}</p>
                    </div>






                    <div style={{ display: "flex", padding: 7, flexDirection: 'row', borderRadius: 5, marginTop: 5, marginBottom: 10, backgroundColor: 'rgba(211, 75, 233, 0.10)', justifyContent: 'flex-start', alignItems: 'top' }}>
                      <div>
                        <Image style={{ width: "20px", marginRight: "10px", height: "20px" }} src={InfoIcon} alt='info' />
                      </div>
                      <div style={{ fontSize: 9, color: '#9252AA', fontWeight: '400', marginLeft: 4 }}>
                        Balance payment is to be paid to executor after order completion.
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} className='checkoutInputType'>
                      <label style={{ color: "rgb(146, 82, 170)", fontSize: "14px", fontWeight: "600" }}>Address:</label>
                      <textarea
                        type="text"
                        className=' rounded border  p-1 bg-white text-black'
                        value={address}
                        onChange={handleAddressChange}
                        rows={3}
                        placeholder="Enter your Address."
                      />
                      {addressError && <p className={`p-0 m-0 ${addressError ? "text-danger" : ""}`}>This field is required!</p>}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} className='checkoutInputType'>
                      <label style={{ color: "rgb(146, 82, 170)", fontSize: "14px", marigin: "16px 0 6px", fontWeight: 600 }}>Pin Code:</label>
                      <input
                        type="text" className=' rounded border  p-1 bg-white text-black'
                        value={pinCode}
                        onChange={handlePinCodeChange}
                      />
                      {pinCode && <p className={`p-0 m-0 ${pinCodeError ? "text-danger" : "text-success"}`}>{`Service ${pinCodeError ? 'not' : ''} available in your area!`}</p>}
                      {pincodeReqError && <p className={`p-0 m-0 ${pincodeReqError ? "text-danger" : ""}`}>This field is required!</p>}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} className='checkoutInputType'>
                      <label style={{ color: "rgb(146, 82, 170)", fontSize: "14px", marigin: "16px 0 6px", fontWeight: 600 }}>City:</label>
                      <select value={city} className=' rounded border  p-1 bg-white text-black' onChange={handleCityChange}>
                        <option value="">Select City</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Delhi">Delhi NCR</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Hyderabad">Hyderabad</option>
                        {/* Add more cities as needed */}
                      </select>
                      {cityError && <p className={`p-0 m-0 ${cityError ? "text-danger" : ""}`}>This field is required!</p>}
                    </div>
                 

                    <div className='checkoutInputType  rounded-4  my-3' style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                      <h4 style={{ color: "rgb(146, 82, 170)", fontSize: "14px", marginBottom: "4px" }}>Share your comments (if any)</h4>
                      <textarea className='rounded border  p-1 bg-white text-black decor-commemnts'
                        value={comment}
                        onChange={handleComment}
                        rows={3}
                        placeholder="Enter your comment."
                      />
                    </div>
                  </div>
                </div>

                <div className='d-flex justify-content-center align-items-center mt-3 mb-0'>
                  <h5 className='fs-6 mt-2'>Need more info?</h5>
                  <button onClick={contactUsRedirection} style={{ border: "2px solid rgb(157, 74, 147)", color: "rgb(157, 74, 147)", padding: "0px 12px", fontSize: "13px" }} className=' rounded-5 ms-1 bg-transparent contactus-redirection'>Contact Us</button>
                </div>

                <div className='px-1 py-3 border rounded my-2 cancellatiop-policy' style={{
                  background: "rgb(157, 74,147, 28%)"
                }}>
                  <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className=' text-center m-1'>Cancellation and order change policy</p>
                    <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className='m-1'>1. If the order is beyong 48 Hours: You are eligible for a 100% refund of the advance payment</p>
                    <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className='m-1'>2. If the order is cancelled more than 24 hours before the scheduled delivery: You will not receive refund of the advance payment.</p>
                    <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className='m-1'>3. If the order is cancelled within 24 hours: The full advance amount will be non-refundable, and 100% of the payment for decoration has to be paid by customer.</p>
                </div>
              </div>
            </div>
            {isMobile ?
              <div style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                backgroundColor: "#fff",
                borderTop: "1px solid #efefef",
                backgroundColor: "#EDEDED"
              }}
              >
                <button className="blue-btn chkeoutBottun" onClick={onContinueClick}>Confirm Order</button>
              </div>
              :
              null
            }
          </div>
      }
    </div>
  );
}

export default Checkout;