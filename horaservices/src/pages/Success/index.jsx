import React, { useEffect , useState } from "react";
import "../../css/success.css";
import confirmOrder from "../../assets/confirmOrder.png";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from 'axios';

const Success = () => {
const router = useRouter();
const [mobileNumber, setMobileNumber] = useState(() => localStorage.getItem("mobileNumber") || '');
  const contactUsRedirection = async () => {
    try {
      window.open(
        `whatsapp://send?phone=+917338584828&text=I've canceled my order, kindly assist with the refund process. Thanks!`
      );
    } catch (error) {
      console.log("contactUsRedirection error", error);
    }
  };

  const handleContinue = () => {
    router.push("/orderlist");
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

  console.log('Sending WhatsApp message to mobile number:', formattedMobileNumber);

  const options = {
      method: 'POST',
      url: 'https://public.doubletick.io/whatsapp/message/template',
      headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: 'key_fHOm5tEzbfSWRbC29LoZkYd0vpqaU7B22Q2iSL2vgawcN3k0D75iXNSPRen3ie7Qj3L7C6r5EhH4lLYeL1dCtPj9WyQ9wPm2abK1wltW8bYXVR5xvjLfPeQgfRld3ws1lkkRduX6tfrHbmYnbhbYnau3HSfJAylSmBso4m5qjO7vm4YjbhtqMbdkNK2EoNPXqM5SdxThyeGvSlvoA8JCVhGvL98yrocJJ7JfhBasgsEnN7qArGvPdsswdhys' // Keep this secure in backend
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
                      templateName: 'order_confirmation_message__v3'
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


  useEffect(()=>{
    sendWelcomeMessage(mobileNumber);
  },[]);

  return (
    <div className="confirm-order">
      <div className="confirm-order-image">
        <Image
          src={confirmOrder}
          alt="Order Confirmed"
          className="success-image"
          height={230}
        />
      </div>
      <div className="confirm-order-details">
        <h2>Your order is confirmed!</h2>
        <p>
          Our Executor will contact 5 hours before the scheduled time. Have a great
          feast!
        </p>
        {/* <Link to="/" className="track-order">
          Track Order
        </Link> */}
        <div className="need-help" onClick={contactUsRedirection}>Need help? Call us.</div>
        <button className="continue-button" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default Success;
