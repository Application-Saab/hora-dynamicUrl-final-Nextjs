// import { useLocation } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import checkOutImage from '../../assets/checkout-problem.png';
import axios from 'axios';
import { BASE_URL, GET_ADDRESS_LIST, CONFIRM_ORDER_ENDPOINT, SAVE_LOCATION_ENDPOINT } from '../../utils/apiconstants';
import { PAYMENT, PAYMENT_STATUS, API_SUCCESS_CODE } from '../../utils/apiconstants';
import { Button, Card, Form } from 'react-bootstrap';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import '../../css/chefOrder.css';
import SelectDishes from "../../assets/selectDish.png";
import SelectDateTime from "../../assets/event2.png";
import InfoIcon from '../../assets/info.png'
import SelectConfirmOrder from "../../assets/ConfirmOrderSelected.png";
import styled from "styled-components";
import { useRouter } from 'next/router';
import Image from 'next/image';
import Loader from '../../components/Loader'
import { pincodes }  from "../../utils/pincodes.js"
import OtpLoginPopup from "@/components/OtpLoginPopup";

const ChefCheckout = () => {
    //   let { peopleCount, orderType, selectedDishDictionary, selectedDishPrice, selectedCount , selectedDishes } = useLocation().state || {}; // Accessing subCategory and itemName safely
    // const { subCategory, product } = useLocation().state || {}; // Accessing subCategory and itemName safely
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
    const router = useRouter();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [combinedDateTime, setCombinedDateTime] = useState(null);
    const [combinedDateTimeError, setCombinedDateTimeError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    let {
        peopleCount,
        orderType,
        selectedDishDictionary,
        selectedDishPrice,
        selectedCount,
        selectedDishes
    } = router.query;
   
 const numericPeopleCount = Number(peopleCount) || 1;
const dishBasePrice = Number(selectedDishPrice) || 0;


   const safeCharge = selectedCount >= 7 ? 700 : 0; 

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

    if (selectedDishDictionary) {
        try {
            selectedDishDictionary = JSON.parse(selectedDishDictionary);
            selectedDishes = JSON.parse(selectedDishes);
        } catch (error) {
            console.error('Error parsing selectedDishDictionary:', error);
        }
    }
    

    const Container = styled.div`
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row; // Align items horizontally
      overflow-x: auto;    // Enable horizontal scrolling if needed
      padding: 10px;      // Adjust padding for mobile view
      width: 100%;        // Ensure it takes up the full width of the parent
      white-space: nowrap; // Prevent labels from wrapping to the next line

      @media (max-width: 600px) {
        padding: 5px;    // Reduce padding on smaller screens
      }
    `;

    const Step = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 10px;    // Adjust margin for spacing
    `;

    const Line = styled.div`
      height: 2px;
      width: 50px;       // Default width for mobile view
      background-color: #ccc;
      margin: 0 4px;     // Adjust margin for spacing
      color: ${(props) => (props.active ? '#F46C5B' : 'black')};

      @media (max-width: 600px) {
        width: 30px;     // Smaller width for mobile view
      }
    `;

    // const Image = styled.img`
    //   width: 48px;       // Default size for mobile view
    //   height: 48px;
    //   flex-shrink: 0;
    //   ${(props) => props.active && `border: 2px solid #000;`};

    //   @media (max-width: 600px) {
    //   width: 32px;     // Smaller width for mobile view
    //   height: 32px;    // Maintain aspect ratio
    // }
    // `;

    const Label = styled.div`
      margin-top: 5px;
      text-align: center;
      font-size: 14px;   // Default font size
      color: ${(props) => (props.active ? '#F46C5B' : 'black')}; // Color based on active prop
      white-space: nowrap; // Prevent text from wrapping

      @media (max-width: 600px) {
        font-size: 10px; // Smaller font size for mobile view
      }
    `;

    /// order.type is 2 for chef
    /// order.type is 1 for decoration
    /// order.type is 3 for waiter
    /// order type 4  bar tender
    /// order type 5 cleaner
    /// order type 6 Single Plate Meal
    /// order type 7 Live Buffer
    /// order type 8 Bulk Catering.
    const handleComment = (e) => {
        setComment(e.target.value);
    };

    // const contactUsRedirection = () => {
    //     window.open('https://wa.me/917338584828?text=Hello%20I%20have%20some%20queries%20for%20personal%20chef%20and%20for%20party%20service', '_blank');
    // };
const contactUsRedirection = () => {
  // Fire GTM custom event
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "book-chef-checkout_contact_us_click", // 👈 Custom event name
    button_name: "Contact Us"
  });

  // Open WhatsApp
  window.open(
    'https://wa.me/917338584828?text=Hello%20I%20have%20some%20queries%20for%20personal%20chef%20and%20for%20party%20service',
    '_blank'
  );
};

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedDateError(false);
        combineDateTime(date, selectedTimeSlot); // Pass the current selected time slot
    };

    const handleTimeSlotChange = (event) => {
        const timeSlot = event.target.value;
        setSelectedTimeSlot(timeSlot);
        setSelectedDateError(false);
        combineDateTime(selectedDate, timeSlot); // Pass the current selected date
    };

    const combineDateTime = (date, timeSlot) => {
        if (date && timeSlot) {
            const [startHour, period] = timeSlot.split('-')[0].trim().split(' ');
            let hour = parseInt(startHour.split(':')[0], 10);
            if (period === 'PM' && hour !== 12) {
                hour += 12;
            } else if (period === 'AM' && hour === 12) {
                hour = 0;
            }

            const combinedDate = new Date(date);
            combinedDate.setHours(hour);
            combinedDate.setMinutes(0);
            combinedDate.setSeconds(0);
            combinedDate.setMilliseconds(0);
            setCombinedDateTime(combinedDate);
            validateDateTime(combinedDate);
        }
    };

    const validateDateTime = (combinedDate) => {
        const now = new Date();
        const timeDifference = combinedDate - now;
        
        if (timeDifference < 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
            setCombinedDateTimeError(true);
        } else {
            setCombinedDateTimeError(false);
        }
    };

    const generateTimeSlots = () => {
        const startTime = 7; // Starting hour
        const endTime = 22; // Ending hour
        const interval =  1 ; // Interval in hours

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

    const openWhatsppLink = () => {
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20payment%20in%20Decoration%20services", "_blank");
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
        const phoneNumber = await localStorage.getItem('mobileNumber')
        let merchantTransactionId;
        try {
            const addressID = await saveAddress();
            const storedUserID = await localStorage.getItem('userID');
            const advanceAmount = Math.round(totalPrice * 0.35);
            const balanceAmount = totalPrice - advanceAmount;
            const url = BASE_URL + CONFIRM_ORDER_ENDPOINT;
            const requestData = {
                "toId": "",
                "phone_no": phoneNumber,
                "order_time": selectedTimeSlot,
                "no_of_people": peopleCount,
                "type": 2,
                "fromId": storedUserID,
                "is_discount": "0",
                "addressId": addressID,
                "order_date": selectedDate.toDateString(),
                "no_of_burner": 0,
                "order_locality": city,
                "total_amount": totalPrice,
                "orderApplianceIds": [],
                "payable_amount": totalPrice,
                "is_gst": "0",
                "advance_amount": advanceAmount,
                "balance_amount": balanceAmount,
                "order_taken_by": "Booked Online",
                "order_type": true,
                "order_pincode": pinCode,
                "items": selectedDishes,
                "status": 0
            }
            alert(JSON.stringify(requestData));
            const token = await localStorage.getItem('token');
            const response = await axios.post(url, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token
                },
            });
            merchantTransactionId = response.data.data._id
        } catch (error) {
            console.log('Error Confirming Order:', error.message);
        }

        const requestData2 = {
            user_id: storedUserID,
            price: Math.round(totalPrice * 0.2),
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
            setLoading(false); // Hide the loader after the operation
        }
    }

  const priceForPeople = numericPeopleCount > 1 ? (numericPeopleCount - 1) * 49 : 0;
    let totalPrice = dishBasePrice + priceForPeople + safeCharge;
   console.log (safeCharge)
    if (Array.isArray(selectedDishes) && selectedDishes.length > 7) {
        totalPrice += 700;
    }
    useEffect(() => {
        setIsClient(true);
    }, [])


    return (
        <div className="App">
            {!isLoggedIn && isModalOpen && <OtpLoginPopup setIsModalOpen={setIsModalOpen} />} 
            {loading && <Loader />}
            {isClient && window.innerWidth > 800 ?
                <div style={{ padding: "1% 2%", backgroundColor: "#edededc9" }}>
                    <div style={{ display: "flex", alignItems: "start", margin: "0 !important", padding: "10px 0" }}
                        className='checoutSec my-3 gap-3'>
                        <div style={{
                            width: "40%", boxShadow: "0 1px 8px rgba(0,0,0,.18)", padding: "20px", backgroundColor: "#fff",
                            borderRadius: "20px"
                        }} className='leftSeccheckout'>
                            <h2 style={{
                                fontSize: "22px", fontWeight: "400", color: "#222", borderBottom: "1px solid #f0f0f0",
                                margin: "0 0 8px 0", lineHeight: "35px"
                            }}>Booking Details</h2>

                            <div className='border border-danger p-1 px-3 rounded bg-danger-subtle text-black text-center'
                                style={{ fontSize: 12, fontWeight: '500', textAlign: 'left', color: "#9252AA" }}>
                                Chef service will be available for 5 hours after arrival.
                            </div>

                            <div style={{ display: 'flex', margin: "8px 0px 10px", flexDirection: "row" }} className='row align-items-between justify-content-between   align-items-lg-center justify-content-lg-between'>
                                <CustomDatePicker handleDateChange={handleDateChange} setSelectedDate={setSelectedDate} selectedDate={selectedDate} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} combinedDateTimeError={combinedDateTimeError} selectedDateError={selectedDateError} />
                                <CustomTimePicker handleTimeSlotChange={handleTimeSlotChange} generateTimeSlots={generateTimeSlots} selectedTimeSlot={selectedTimeSlot} combinedDateTimeError={combinedDateTimeError} selectedTimeSlotError={selectedTimeSlotError} />
                            </div>
                            {combinedDateTimeError && <p className="text-danger" style={{ fontSize: '12px', margin: "5px 0 0 0" }}>The selected date and time must be at least 24 hours from now.</p>}
                            <div className='checkoutInputType border-1 rounded-4  ' style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                                <h4 style={{ color: "rgb(146, 82, 170)", fontSize: "14px", marginBottom: "4px" }}>Share your comments (if any)</h4>
                                <textarea className=' rounded border border-1 p-1 bg-white text-black'
                                    value={comment}
                                    onChange={handleComment}
                                    rows={4}
                                    placeholder="Enter your comment."
                                />
                            </div>
                            <div>
                                <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} className='checkoutInputType'>
                                    <label style={{ color: "rgb(146, 82, 170)", fontSize: "14px", fontWeight: "600" }}>Address:</label>
                                    <textarea
                                        type="text"
                                        className=' rounded border border-1 p-1 bg-white text-black'
                                        value={address}
                                        onChange={handleAddressChange}
                                        rows={4}
                                        placeholder="Enter your Address."
                                    />
                                    {addressError && <p className={`p-0 m-0 ${addressError ? "text-danger" : ""}`}>This field is required!</p>}
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} className='checkoutInputType'>
                                    <label style={{ color: "rgb(146, 82, 170)", fontSize: "14px", marigin: "16px 0 6px", fontWeight: 600 }}>Pin Code:</label>
                                    <input
                                        type="text" className=' rounded border border-1 p-1 bg-white text-black'
                                        value={pinCode}
                                        onChange={handlePinCodeChange}
                                    />
                                    {pinCode && <p className={`p-0 m-0 ${pinCodeError ? "text-danger" : "text-success"}`}>{`Service ${pinCodeError ? 'not' : ''} available in your area!`}</p>}
                                    {pincodeReqError && <p className={`p-0 m-0 ${pincodeReqError ? "text-danger" : ""}`}>This field is required!</p>}
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} className='checkoutInputType'>
                                    <label style={{ color: "rgb(146, 82, 170)", fontSize: "14px", marigin: "16px 0 6px", fontWeight: 600 }}>City:</label>
                                    <select value={city} className=' rounded border border-1 p-1 select-city bg-white text-black' onChange={handleCityChange}>
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

                        <div className="rightSeccheckout chef" style={{ boxShadow: "0 1px 8px rgba(0,0,0,.18)", padding: "20px", backgroundColor: "#fff", borderRadius: "20px", width: "59%" }}>
                            <h3 style={{ fontSize: "22px", fontWeight: "400", color: "#222", borderBottom: "1px solid #f0f0f0", margin: "0 0 11px 0", lineHeight: "35px" }}>Order Summary</h3>
                            <div className='righysercchefinner'>
                                <div style={{ display: "flex", padding: 7, flexDirection: 'row', borderRadius: 5, marginTop: 5, marginBottom: 10, backgroundColor: 'rgba(211, 75, 233, 0.10)', justifyContent: 'flex-start', alignItems: 'top' }}>
                                    <div style={{ color: "#9252AA", fontWeight: '500', fontSize: 10 }}>Note: Additional charge of 700 applies for more than 7 dishes.  </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "top", flexDirection: "row" }}>
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", border: "1px solid #efefef", borderRadius: "3px", margin: "0 0 10px 0", textAlign: "left", padding: "3px 8px" }}>
                                            <label style={{ color: "rgb(146, 82, 170)", fontSize: "12px", marigin: "16px 0 6px", fontWeight: 500 }}>Total Dishes</label>
                                            <p style={{ margin: 0, windth: "100%", color: "rgb(146, 82, 170)", fontSize: "12px", fontWeight: 200 }}> {selectedCount}</p>
                                        </div>
                                        {peopleCount >= 0 ?
                                            <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", fontWeight: 500, border: "1px solid #efefef", borderRadius: "3px", margin: "0 0 10px 0", textAlign: "left", padding: "3px 8px" }}>
                                                <label style={{ color: "rgb(146, 82, 170)", fontSize: "12px", marigin: "16px 0 6px", fontWeight: 500 }}>Number of people</label>
                                                <p style={{ margin: 0, windth: "100%", color: "rgb(146, 82, 170)", fontSize: "12px", fontWeight: 200 }}>{peopleCount}</p>
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", margin: "0 0 5px 0" }}>
                                            <label style={{ color: "rgb(146, 82, 170)", fontSize: "16px", marigin: "16px 0 6px", fontWeight: 700 }}>Total Amount:</label>
                                            <p style={{ margin: 0, windth: "100%", color: "rgb(146, 82, 170)", fontSize: "16px", fontWeight: 700 }}>₹  {totalPrice}</p>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", margin: "0 0 5px 0" }}>
                                            <label style={{ color: "rgb(146, 82, 170)", fontSize: "16px", marigin: "16px 0 6px", fontWeight: 700 }}>Advance Amount:</label>
                                            <p style={{ margin: 0, windth: "100%", color: "rgb(146, 82, 170)", fontSize: "16px", fontWeight: 700 }}>₹ {Math.round(totalPrice * 0.35)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", padding: 7, flexDirection: 'row', borderRadius: 5, marginTop: 5, marginBottom: 10, backgroundColor: 'rgba(211, 75, 233, 0.10)', justifyContent: 'flex-start', alignItems: 'top' }}>
                                    <div>
                                        <Image style={{ width: "10px", height: '10px', marginRight: "10px" }} src={InfoIcon} alt='info' />
                                    </div>
                                    <div style={{ color: "#9252AA", fontWeight: '500', fontSize: 10 }}>
                                        Balance payment is to be paid to chef after order completion.
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "top", flexWrap: "wrap" }}>
                                    {Object.values(selectedDishDictionary).map((item) => {
                                        return (
                                            <div className="ordersummaryproduct">
                                                <div>
                                                    <Image className='checkoutRightImg chef' src={`https://horaservices.com/api/uploads/${item.image}`} style={{ width: "100%", height: "auto" }} width={300} height={300} />
                                                </div>
                                                <div style={{ color: "rgb(146, 82, 170)", fontWeight: "600" }}>
                                                    <p style={{ margin: "0 0 0 0", padding: "0" }} className="ordersummeryname">{item.name}</p>
                                                    <p className="ordersummeryprice">{item.price}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                            </div>

                            <div className='d-flex justify-content-center align-items-center mt-3 mb-0'>
                                <h5 className='mt-2'>Need more info?</h5>
                                <button onClick={contactUsRedirection} style={{ border: "2px solid rgb(157, 74, 147)", color: "rgb(157, 74, 147)", padding: "3px 3px" }} className='rounded-5 ms-1 bg-white contactus-redirection'>Contact Us</button>
                            </div>

                            <div className='px-1 py-3 border rounded my-2 cancellatiop-policy' style={{
                                background: "rgb(157, 74,147, 28%)"
                            }}>
                                <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className=' text-center m-1'>Cancellation and order change policy</p>
                                <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className='m-1'>Till the order is not assign to the service provider , 100% of the amount will be refunded, othewise 50%of the advance will be deducted as a cancellation charges to componsate the service provider. </p>
                                <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className='m-1'>The order cannot be edited after paying the advance customers can cancel the order and replace it with a new order with the required changes.</p>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div style={{ padding: "1% 2%", backgroundColor: "#edededc9", position: "relative" }} className='checkoutmobileview'>
                    <div className='checoutSec my-3 gap-3'>
                        <div>
                            <Container>
                                <Step active={true.toString()}>
                                    <Image src={SelectDishes} alt="Select Dishes" height={32} width={32} />
                                    <Label active={true.toString()}>Select Dishes</Label>
                                </Step>
                                <Line active={true.toString()} />
                                <Step>
                                    <Image src={SelectDateTime} alt="Select Date & Time" height={32} width={32} />
                                    <Label active={true.toString()}>Select Date & Time</Label>
                                </Step>
                                <Line />
                                <Step>
                                    <Image src={SelectConfirmOrder} alt="Confirm Order" height={32} width={32} />
                                    <Label>Select Confirm Order</Label>
                                </Step>
                            </Container>
                            <div className='border border-danger p-1 px-3 rounded bg-danger-subtle text-black text-center'
                                style={{ fontSize: 12, fontWeight: '500', textAlign: 'left', color: "#9252AA", margin: "9px 0 0" }}>
                                Chef service will be available for 5 hours after arrival.
                            </div>

                            <div style={{ display: 'flex', margin: "5px 0px -10px", flexDirection: "row" }} className='row align-items-between justify-content-between  align-items-lg-center justify-content-lg-between'>
                                <CustomDatePicker handleDateChange={handleDateChange} setSelectedDate={setSelectedDate} selectedDate={selectedDate} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} combinedDateTimeError={combinedDateTimeError} selectedDateError={selectedDateError} />
                                <CustomTimePicker handleTimeSlotChange={handleTimeSlotChange} generateTimeSlots={generateTimeSlots} selectedTimeSlot={selectedTimeSlot} combinedDateTimeError={combinedDateTimeError} selectedTimeSlotError={selectedTimeSlotError} />
                                {combinedDateTimeError && <p className="text-danger" style={{ fontSize: '12px', margin: "7px 0 0 0" }}>The selected date and time must be at least 24 hours from now.</p>}
                            </div>

                            <div className="rightSeccheckout chef" style={{ boxShadow: "0 1px 8px rgba(0,0,0,.18)", padding: "20px", backgroundColor: "#fff", borderRadius: "20px", width: "59%" }}>
                                <div className='rightcheckoutsec' style={{ padding: "6px  0 0 " }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", border: "1px solid #efefef", borderRadius: "3px", margin: "0 0 10px 0", textAlign: "left", padding: "3px 8px" }}>
                                            <label style={{ color: "rgb(146, 82, 170)", fontSize: "12px", marigin: "16px 0 6px", fontWeight: 500 }}>Total Dishes</label>
                                            <p style={{ margin: 0, windth: "100%", color: "rgb(146, 82, 170)", fontSize: "12px", fontWeight: 200 }}> {selectedCount}</p>
                                        </div>
                                        {peopleCount >= 0 ?
                                            <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", fontWeight: 500, border: "1px solid #efefef", borderRadius: "3px", margin: "0 0 10px 0", textAlign: "left", padding: "3px 8px" }}>
                                                <label style={{ color: "rgb(146, 82, 170)", fontSize: "12px", marigin: "16px 0 6px", fontWeight: 500 }}>Number of people</label>
                                                <p style={{ margin: 0, windth: "100%", color: "rgb(146, 82, 170)", fontSize: "12px", fontWeight: 200 }}>{peopleCount}</p>
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                    <div style={{ display: "flex", padding: 7, flexDirection: 'row', borderRadius: 5, marginTop: 5, marginBottom: 10, backgroundColor: 'rgba(211, 75, 233, 0.10)', justifyContent: 'flex-start', alignItems: 'top' }}>
                                        <div style={{ color: "#9252AA", fontWeight: '500', fontSize: 10 }}>Note: Additional charge of 700 applies for more than 7 dishes</div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", margin: "0 0 5px 0" }}>
                                        <label style={{ color: "rgb(146, 82, 170)", fontSize: "16px", marigin: "16px 0 6px", fontWeight: 700 }}>Total Amount:</label>
                                        <p style={{ margin: 0, windth: "100%", color: "rgb(146, 82, 170)", fontSize: "16px", fontWeight: 700 }}>₹  {totalPrice}</p>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", margin: "0 0 5px 0" }}>
                                        <label style={{ color: "rgb(146, 82, 170)", fontSize: "16px", marigin: "16px 0 6px", fontWeight: 700 }}>Advance Amount:</label>
                                        <p style={{ margin: 0, windth: "100%", color: "rgb(146, 82, 170)", fontSize: "16px", fontWeight: 700 }}>₹ {Math.round(totalPrice * 0.35)}</p>
                                    </div>

                                    <div style={{ display: "flex", padding: 7, flexDirection: 'row', borderRadius: 5, marginTop: 5, marginBottom: 10, backgroundColor: 'rgba(211, 75, 233, 0.10)', justifyContent: 'flex-start', alignItems: 'top' }}>
                                        <div>
                                            <Image style={{ width: "20px", height: '20px', marginRight: "10px" }} src={InfoIcon} alt='info' />
                                        </div>
                                        <div style={{ color: "#9252AA", fontWeight: '500', fontSize: 10 }}>
                                            Balance payment is to be paid to chef after order completion.
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} className='checkoutInputType'>
                                        <label style={{ color: "rgb(146, 82, 170)", fontSize: "14px", fontWeight: "600" }}>Address:</label>
                                        <textarea
                                            type="text"
                                            className=' rounded border border-1 p-1 bg-white text-black'
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
                                            type="text" className='rounded border border-1 p-1 bg-white text-black'
                                            value={pinCode}
                                            onChange={handlePinCodeChange}
                                        />
                                        {pinCode && <p className={`p-0 m-0 ${pinCodeError ? "text-danger" : "text-success"}`}>{`Service ${pinCodeError ? 'not' : ''} available in your area!`}</p>}
                                        {pincodeReqError && <p className={`p-0 m-0 ${pincodeReqError ? "text-danger" : ""}`}>This field is required!</p>}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} className='checkoutInputType'>
                                        <label style={{ color: "rgb(146, 82, 170)", fontSize: "14px", marigin: "16px 0 6px", fontWeight: 600 }}>City:</label>
                                        <select value={city} className='rounded border border-1 p-1 select-city bg-white text-black' onChange={handleCityChange}>
                                            <option value="">Select City</option>
                                        <option value="Bangalore">Bangalore</option>
                                        <option value="Delhi">Delhi NCR</option>
                                        <option value="Mumbai">Mumbai</option>
                                        <option value="Hyderabad">Hyderabad</option>
                                            {/* Add more cities as needed */}
                                        </select>
                                        {cityError && <p className={`p-0 m-0 ${cityError ? "text-danger" : ""}`}>This field is required!</p>}
                                    </div>
                                    <div>
                                        <h1 style={{ color: '#000', fontSize: 13, fontWeight: '600', margin: 0, padding: "10px 0" }}>
                                            Dishes Selected
                                        </h1>
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexFlow: "wrap" }}>
                                            {Object.values(selectedDishDictionary).map((item) => {
                                                return (
                                                    <div style={{ width: "48%", border: "1px solid rgb(149 142 142 / 73%)", flexDirection: "row", display: "flex", borderRadius: "10px", padding: "6px 10px", boxSizing: "border-box" }} className='dishes-checkout-page'>
                                                        <div style={{ marginRight: 2, width: "90%" }}>
                                                            <Image className='checkoutRightImg chef' src={`https://horaservices.com/api/uploads/${item.image}`} style={{ width: "100%", height: "auto" }} width={300} height={300} />
                                                        </div>
                                                        <div style={{ color: "rgb(146, 82, 170)", fontWeight: "500", fontSize: "12px" }}>
                                                            <p style={{ margin: "0 0 0 0", padding: "0" }}>{item.name}</p>
                                                            {/* <p style={{ margin: "0 0 0 0", padding: "0" }}>{item.price}</p> */}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            }
                                        </div>
                                    </div>
                                    <div className='checkoutInputType border-1 rounded-4  my-3' style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                                        <h4 style={{ color: "rgb(146, 82, 170)", fontSize: "14px", marginBottom: "4px" }}>Share your comments (if any)</h4>
                                        <textarea className='rounded border border-1 p-1 bg-white text-black decor-commemnts'
                                            value={comment}
                                            onChange={handleComment}
                                            rows={4}
                                            placeholder="Enter your comments"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='d-flex justify-content-center align-items-center mt-3 mb-0'>
                                <h5 className='fs-6 mt-2'>Need more info?</h5>
                                <button onClick={contactUsRedirection} style={{ border: "2px solid rgb(157, 74, 147)", color: "rgb(157, 74, 147)", padding: "3px 3px", fontSize: "13px" }} className='rounded-5 ms-1 bg-white contactus-redirection'>Contact Us</button>
                            </div>

                            <div className='px-1 py-3 border rounded my-2 cancellatiop-policy' style={{
                                background: "rgb(157, 74,147, 28%)"
                            }}>
                                <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className=' text-center m-1'>Cancellation and order change policy</p>
                                <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className='m-1'>Till the order is not assign to the service provider , 100% of the amount will be refunded, othewise 50%of the advance will be deducted as a cancellation charges to componsate the service provider. </p>
                                <p style={{ fontSize: "13px", color: "rgb(157, 74, 147)" }} className='m-1'>The order cannot be edited after paying the advance customers can cancel the order and replace it with a new order with the required changes.</p>
                            </div>
                        </div>
                    </div>

                    {window.innerWidth < 800 ?
                        <div style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            width: "100%",
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

export default ChefCheckout;

export const CustomDatePicker = ({ handleDateChange, selectedDate, showDatePicker, setShowDatePicker, selectedDateError, combinedDateTimeError }) => {

    const toggleDatePicker = () => {
        setShowDatePicker((prev) => !prev);
    };

    return (
        <div className={`d-flex flex-column border border-1 rounded-4  timepkerSec ${combinedDateTimeError ? 'border-danger' : ''} `}>
            <p style={{ marginBottom: "4px", color: "rgb(146, 82, 170)", fontSize: "12px" }} className='p-0 m-0'>Booking Date</p>
            <Dropdown show={showDatePicker} onToggle={toggleDatePicker} className='border-none p-0'>
                <Dropdown.Toggle
                    variant="outline-secondary"
                    className={`w-100 m-0 p-0 d-flex justify-content-between align-items-center text-black ${selectedDateError ? 'border-danger' : ''}`}
                    style={{ cursor: 'pointer', padding: 0, background: 'none', border: 'none' }}        >
                    <span style={{ fontSize: '12px' }} className='m-0 p-0 '>{selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu
                    show={showDatePicker}
                    className="p-2"
                    style={{ minWidth: 'auto' }}
                >
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        minDate={new Date()}
                        inline // Use inline to show the calendar
                    />
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export const CustomTimePicker = ({ selectedTimeSlot, handleTimeSlotChange, generateTimeSlots, selectedTimeSlotError, combinedDateTimeError }) => {
    return (
        <div className={`timepkerSec d-flex flex-column border border-1 ${combinedDateTimeError ? 'border-danger' : ''}  ${selectedTimeSlotError ? 'border-danger' : ""} rounded-4 `}>
            <p style={{ marginBottom: "4px", color: "rgb(146, 82, 170)", fontSize: "12px" }} className='p-0 m-0'>Select Time Slot</p>
            <div>
                <Form.Control
                    as="select"
                    value={selectedTimeSlot}
                    onChange={handleTimeSlotChange}
                    style={{ fontSize: "14px", cursor: 'pointer', padding: 0, background: 'none', border: 'none' }}
                    className="timeslot"
                >
                    <option value="">Chef Arrival time</option>
                    {generateTimeSlots().map((timeSlot, index) => (
                        <option key={index} value={timeSlot}>
                            {timeSlot}
                        </option>
                    ))}
                </Form.Control>
            </div>
        </div>
    )
}