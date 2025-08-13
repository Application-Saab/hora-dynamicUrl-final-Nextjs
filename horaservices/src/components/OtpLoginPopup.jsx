import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL, OTP_GENERATE_END_POINT, API_SUCCESS_CODE, OTP_VERIFY_ENDPOINT } from "../utils/apiconstants";
import './login.css';
import { useTimer } from "../utils/useTimer";
import { AiOutlineClose } from "react-icons/ai";
import logo from '../assets/new_logo_light.png';
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import loginImage from '../assets/login.png';


const OtpLogin = ({setIsModalOpen}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [otpError, setOtpError] = useState('');
  const { time, isTimeUp, resetTimer } = useTimer(30); 
  const router = useRouter();
  const routerPathname = usePathname();
  const isHomePage = routerPathname === '/';

  // Handle mobile number input change
  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setMobileNumber(value);
      setError('Please enter a valid mobile number');
    }

    // Reset error message if mobile number length is correct
    if (value.length === 10) {
      setError('');
    }
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

     // Function to send the WhatsApp message
const sendWelcomeMessage = async (mobileNumber) => {
  let formattedMobileNumber = mobileNumber;

  // Ensure the mobile number starts with '+91'
  if (!formattedMobileNumber.startsWith('+91')) {
      formattedMobileNumber = '+91' + formattedMobileNumber;
  }

  // Remove any extra spaces or special characters
  formattedMobileNumber = formattedMobileNumber.replace(/\s+/g, '');


  const options = {
      method: 'POST',
      url: 'https://public.doubletick.io/whatsapp/message/template',
      headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: 'key_wZpn79uTfV' // Keep this secure in backend
      },
      data: {
          messages: [
              {
                  content: {
                      language: 'en',
                      templateData: {
                          header: {
                              type: 'IMAGE',
                              mediaUrl: 'https://quickscale-template-media.s3.ap-south-1.amazonaws.com/org_FGdNfMoTi9/2a2f1b0c-63e0-4c3e-a0fb-7ba269f23014.jpeg'
                          },
                          body: { placeholders: ['Hora Services'] } // Use dynamic placeholders if needed
                      },
                      templateName: 'happy_to_help_v2'
                  },
                  from: '+917338584828',
                  to: formattedMobileNumber // Send to the formatted mobile number
              }
          ]
      }
  };

  try {
      const response = await axios.request(options);
      console.log('WhatsApp message response:', response.data);
  } catch (error) {
      console.error('Error sending WhatsApp message:', error);
  }
};

  // Function to send OTP
  const sendOtp = async () => {
    if (!mobileNumber ) {
      setError('Mobile number is required.');
      return;
    }
  
    try {
      const url = BASE_URL + OTP_GENERATE_END_POINT;
      const requestData = {
        phone: mobileNumber,
        role: 'customer',
      };

      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === API_SUCCESS_CODE) {
        setIsOtpSent(true);
        setError('');
        resetTimer(); // Start the timer once OTP is sent
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Error sending OTP. Please try again.');
    }
  };

  // Function to verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    try {
      const url = BASE_URL + OTP_VERIFY_ENDPOINT;
      const requestData = {
        phone: mobileNumber,
        role: 'customer',
        otp: otp,
      };

      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === API_SUCCESS_CODE) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem("mobileNumber", mobileNumber);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userID', response.data.data._id);
        // Trigger event so same tab listeners also catch it
        window.dispatchEvent(new Event("loginStateChange"));
        sendWelcomeMessage(mobileNumber);
        setError('');
        setOtpError('');
        setIsOtpSent(false);
        setIsUserLoggedIn(true);
        setOtp('');
        setMobileNumber(''); // Corrected to setMobileNumber('')
        if (routerPathname === '/orderlist' || routerPathname === '/photo-gallery' ){
          console.log('inside reload');
          window.location.reload();
        }
        else {
          console.log('outside reload');
        }
      } else {
        setOtpError('Invalid OTP. Please try again.');
        setOtp(''); // Clear OTP field if invalid
      }
    } catch (err) {
      setOtpError('Error verifying OTP. Please try again.');
    }
  };

  // Function to handle OTP resend logic
  const resendOtp = async () => {
    setOtp(''); // Clear OTP field
    setIsOtpSent(true);
    setOtpError('');
    await sendOtp(); // Call sendOtp to resend the OTP
  };

  const hadelClose = () => {
    // closeModel();
    setIsModalOpen(false);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {!isUserLoggedIn ? (
          <>
            <div className="popup-header">
              {isHomePage ? (
                <AiOutlineClose className="close-icon" onClick={hadelClose} size={15} />
              ) : (
                ''
              )}
              <h2>Login to Hora!</h2> {/* Fixed missing closing quote */}
            </div>
            <div className="otp-login">
              {/* Render the form if not logged in */}
  
              {!isOtpSent && (
                <div className="input-group login">
                  <div style={{ width: '100%', display: 'flex' }}>
                    <div className="country-code">+91</div>
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={handleMobileNumberChange}
                      placeholder="Login 10 digit Mobile Number"
                    />
                  </div>
                </div>
              )}
  
              {isOtpSent && (
                <div className="input-group">
                  <input
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter OTP"
                    className="enterotp-input"
                  />
                </div>
              )}
  
              <div className="buttons">
                {!isOtpSent ? (
                  <button onClick={sendOtp} className="loginbtn">
                    GET OTP
                  </button>
                ) : (
                  <button
                    onClick={verifyOtp}
                    className="loginbtn"
                    disabled={otp.length !== 4} // Disable if OTP is not 4 digits
                  >
                    Verify OTP
                  </button>
                )}
              </div>
  
              {otpError ? (
                <div className="d-flex justify-content-between mt-2 otp-error">
                  <p className="m-0 p-0 text-danger">* {otpError}</p>
                  <p
                    className="m-0 p-0"
                    style={{ color: '#9252AA', cursor: 'pointer' }}
                    onClick={resendOtp}
                  >
                    Resend Code
                  </p>
                </div>
              ) : isOtpSent ? (
                <div className="d-flex justify-content-center mt-4 resend-timer">
                  <p className="m-0 p-0 text-center" style={{ color: '#8A8A8A' }}>
                    Resend Code in {time} sec
                  </p>
                </div>
              ) : null}
  
              {error && <p className="error-message">{error}</p>}
            </div>
          </>
        ) : (
          <div className="success-message">
            <div className='popup-header'>  
              <Image src={loginImage} />
            <AiOutlineClose className="close-icon" onClick={hadelClose} size={15} />
              </div>
            <h1>Logged In Successful</h1>
            <p>Welcome Hora! You have been logged out successfully.</p>
            <button onClick={() => setIsModalOpen(false)} className="loginbtn">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default OtpLogin;
