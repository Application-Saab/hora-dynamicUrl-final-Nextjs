

// import React from "react";
// import "./finalInvteDisplay.css";
// import Head from "next/head";
// import imageBackground from "@/assets/imageBackground.jpg";
// const formatDate = (isoDateString) => {
//   const date = new Date(isoDateString);
//   return date.toLocaleDateString("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   });
// };

// const FinalInviteDisplay = ({ orderDetails, handleClick, isHost }) => {
//   if (!orderDetails) return <p>Loading...</p>;

 

//   return (

//     <div className="invite-wrapper">
//       <Head>
//         <link
//           rel="stylesheet"
//           href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Aclonica&display=swap"
//           rel="stylesheet"
//         />
//       </Head>

//       <div className="invite-card">
//         <h2 className="invite-heading party-title">It's Time To Party!</h2>

//         <div className="cake-image-wrapper">
//           <img src={orderDetails.Image} alt="Cake" className="cake-image" />
//         </div>

//         <h3 className="invite-title highlight-title">
//           {orderDetails.Name || "Someone"}’s{" "}
//           {orderDetails["Event Type"] || "Birthday"}
//         </h3>

      

// <div className="event-info-wrapper">
//   <div className="event-details">
//     <div className="event-line">📅 Date : {formatDate(orderDetails.Date)}</div>
//     <div className="event-line">⏰ Time : {orderDetails.Time}</div>
//   </div>
//   <div className="event-address">{orderDetails.Address}</div>
// </div>



       
//       </div>
     
//     </div>

//   );
// };

// export default FinalInviteDisplay;

import React from "react";
import "./finalInvteDisplay.css";
import Head from "next/head";
import Image from "next/image";
import imageBackground from "@/assets/imageBackground.jpg";
// import chatIcon from "@/assets/chaticon.png"
const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const FinalInviteDisplay = ({
  orderDetails,
  handleClick,
  isHost,
  openChat,
  clearNewMessage,
  hasNewMessage,
}) => {
  if (!orderDetails) return <p>Loading...</p>;

  return (
    <div className="invite-wrapper">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Aclonica&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="invite-card">
        <h2 className="invite-heading party-title">It's Time To Party!</h2>

        <div className="cake-image-wrapper">
          <img src={orderDetails.Image} alt="Cake" className="cake-image" />
        </div>

        <h3 className="invite-title highlight-title">
          {orderDetails.Name || "Someone"}’s{" "}
          {orderDetails["Event Type"] || "Birthday"}
        </h3>

        <div className="event-info-wrapper">
          <div className="event-details">
            <div className="event-line">
              📅 Date : {formatDate(orderDetails.Date)}
            </div>
            <div className="event-line">⏰ Time : {orderDetails.Time}</div>
          </div>
          <div className="event-address">{orderDetails.Address}</div>
        </div>

        {/* Chat Icon */}
        {/* <div
          className="invite-image-wrapper"
          onClick={() => {
            openChat();
            clearNewMessage();
          }}
        >
          <Image
            src={chatIcon}
            alt="chat"
            className="invite-image"
            width={40}
            height={40}
          />

          {hasNewMessage && (
            <span
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                width: "10px",
                height: "10px",
                backgroundColor: "red",
                borderRadius: "50%",
              }}
            />
          )}
        </div> */}
      </div>
    </div>
  );
};

export default FinalInviteDisplay;
