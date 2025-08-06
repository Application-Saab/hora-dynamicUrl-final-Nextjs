
// import React from "react";
// import "./finalInvteDisplay.css";

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

//   const handleWhatsAppShare = () => {
//     const inviteURL = `https://horaservices.com/wonderland?id=${orderDetails._id}/${orderDetails.userId}/guest`;

//     const shareText = `You're invited to ${
//       orderDetails.Name || "someone"
//     }'s ${orderDetails["Event Type"] || "Birthday"}! 🎉\n\n📅 ${formatDate(
//       orderDetails.Date
//     )}\n⏰ ${orderDetails.Time}\n📍 ${
//       orderDetails.Address || "Venue"
//     }\n\n👉 Tap to view the invite:\n${inviteURL}`;

//     const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
//     window.open(whatsappLink, "_blank");
//   };

//   return (
//     <div className="invite-wrapper">
//       <div className="invite-card">
//         <h2 className="invite-heading">YOU‘RE INVITED</h2>

//         <div className="cake-image-wrapper">
//           <img
//             src={orderDetails.Image}
//             alt="Cake"
//             className="cake-image"
//           />
//         </div>

//         <h3 className="invite-title">
//           {orderDetails.Name || "Someone"}‘S{" "}
//           {orderDetails["Event Type"] || "Birthday"} CELEBRATION
//         </h3>

//         <p className="invite-detail">
//           <span>📅</span> DATE : {formatDate(orderDetails.Date)}
//         </p>

//         <p className="invite-detail">
//           <span>⏰</span> TIME : {orderDetails.Time}
//         </p>

//         <p className="invite-detail">
//           <span>📍</span> <strong>Home</strong> ({orderDetails.Address || "Venue"})
//         </p>

//         {/* ✅ Show both buttons to Host only */}
//         {isHost && (
//           <div className="invite-buttons">
//             <button className="invite-btn" onClick={handleClick}>
//               📩 Explore templates
//             </button>
//             <button className="invite-btn" onClick={handleWhatsAppShare}>
//               📤 Share Invitation
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FinalInviteDisplay;


import React from "react";
import "./finalInvteDisplay.css";
import Head from "next/head";

const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const FinalInviteDisplay = ({ orderDetails, handleClick, isHost }) => {
  if (!orderDetails) return <p>Loading...</p>;

  const handleWhatsAppShare = () => {
    const inviteURL = `https://horaservices.com/wonderland?id=${orderDetails._id}/${orderDetails.userId}/guest`;
    const shareText = `You're invited to ${
      orderDetails.Name || "someone"
    }'s ${orderDetails["Event Type"] || "Birthday"}! 🎉\n\n📅 ${formatDate(
      orderDetails.Date
    )}\n⏰ ${orderDetails.Time}\n📍 ${
      orderDetails.Address || "Venue"
    }\n\n👉 Tap to view the invite:\n${inviteURL}`;

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappLink, "_blank");
  };

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

      

<div className="event-info-container">
  <div className="event-line-left">📅 Date : {formatDate(orderDetails.Date)}</div>
  <div className="event-line-left">⏰ Time : {orderDetails.Time}</div>
  <div className="event-line-center">{orderDetails.Address}</div>
</div>


        {isHost && (
          <div className="invite-buttons">
            <button className="btn-green" onClick={handleClick}>
              <i className="fa fa-magic" /> Explore Themes
            </button>
            <button className="btn-pink" onClick={handleWhatsAppShare}>
              <i className="fa fa-whatsapp" /> Share Invitation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalInviteDisplay;
