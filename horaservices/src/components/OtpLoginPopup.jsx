import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL, OTP_GENERATE_END_POINT, API_SUCCESS_CODE, OTP_VERIFY_ENDPOINT } from "../utils/apiconstants";
import './login.css';
import { useTimer } from "../utils/useTimer";
import { AiOutlineClose } from "react-icons/ai";
import logo from '../assets/new_logo_light.png';
import Image from "next/image";

const OtpLogin = ({closeModel}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');
  const { time, isTimeUp, resetTimer } = useTimer(30); // Timer for resend OTP countdown (in seconds)

  // Handle mobile number input change
  const handleMobileNumberChange = (e) => {
    setMobileNumber(e.target.value);
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };


  // Function to send OTP
  const sendOtp = async () => {
    if (!mobileNumber) {
      setError('Please enter a valid mobile number');
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
        setError('');
        setOtpError('');
        setIsOtpSent(false);
        alert('OTP verified successfully!'); // You can redirect the user or show another message here
        setOtp('');
        setMobileNumber(''); // Corrected to setMobileNumber('')
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
    closeModel();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
         <div className="popup-header">
          {/* <Image src={logo} alt="Logo"  style={{ width:"60px" , height:"auto"}}/> */}
          <AiOutlineClose className="close-icon" onClick={hadelClose} size={15} />
          <h2>Sign Up / Login to HORA</h2>
          </div>
    <div className="otp-login">

      {/* Conditionally render mobile number input only if OTP is not sent */}
      {!isOtpSent && (
        <div className="input-group login">
          <label>Enter Your Mobile Number</label>
          <div style={{ width:"100%" , display:"flex"}}>
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
            disabled={otp.length !== 4} // Disable button if OTP length is not 4
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
    
    </div>
    </div>
  );
};

export default OtpLogin;
