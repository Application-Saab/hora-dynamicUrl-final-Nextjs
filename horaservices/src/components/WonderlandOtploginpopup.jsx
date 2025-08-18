import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL, OTP_GENERATE_END_POINT, API_SUCCESS_CODE, OTP_VERIFY_ENDPOINT } from "../utils/apiconstants";
import './WonderlandOtploginpopup.css';
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



    
<div className="wonderland-container">
  {!isUserLoggedIn ? (
    <>
      <div className="wonderland-top-text">
        <h3 className="wonderland-invite-text">You’ve Got an Invite from</h3>
        <h1 className="wonderland-invite-name">Sahaj</h1>
      </div>

      <div className="wonderland-card">
        <label className="wonderland-label">Verify to Join the Fun! ✨</label>

        {!isOtpSent ? (
          <>
            <div className="wonderland-input-group">
              <span className="wonderland-country-code">+91</span>
              <input
                type="text"
                className="wonderland-input"
                placeholder="Login 10 digit Mobile Number"
                value={mobileNumber}
                onChange={handleMobileNumberChange}
              />
            </div>
            <p className="wonderland-hint">We'll send you an OTP to verify</p>
            <button className="wonderland-button" onClick={sendOtp}>
              GET OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              className={`wonderland-input ${otpError ? "wonderland-error-border" : ""}`}
              placeholder="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
            />

            {otpError ? (
              <div className="wonderland-error-text-container">
                <p className="wonderland-error-text">* {otpError}</p>
                <p className="wonderland-resend" onClick={resendOtp}>
                  Resend Code
                </p>
              </div>
            ) : (
              time > 0 && (
                <p className="wonderland-timer">Resend Code in {time} sec</p>
              )
            )}

            <button
              className="wonderland-button"
              onClick={verifyOtp}
              disabled={otp.length !== 4}
            >
              VERIFY
            </button>
            <p className="wonderland-note">NOTE: Max 3 OTP requests allowed per 24 hours.</p>
          </>
        )}

        {error && <p className="wonderland-error-text">{error}</p>}
      </div>
    </>
  ) : (
    <div className="wonderland-success">
      <div className="wonderland-card">
        <div className="wonderland-header">
          <Image src={loginImage} />
        </div>
        <h1>Logged In Successfully</h1>
        <p>Welcome Hora! You have been logged out successfully.</p>
        <button onClick={() => setIsModalOpen(false)} className="wonderland-button">
          Close
        </button>
      </div>
    </div>
  )}
</div>



  );
  
};

export default OtpLogin;
