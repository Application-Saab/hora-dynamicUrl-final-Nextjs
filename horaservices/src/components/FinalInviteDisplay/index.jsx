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

// const FinalInviteDisplay = ({ orderDetails, handleClick }) => {
//   if (!orderDetails) return <p>Loading...</p>;

//   return (
//     <div className="invite-wrapper">
//       <div className="invite-card">
//         <h2 className="invite-heading">YOU‘RE INVITED</h2>

//         <div className="cake-image-wrapper">
//           <img
//             src={orderDetails.Image} // ✅ Expecting base64 format here
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

//         <button className="invite-btn" onClick={handleClick}>
//           📩 Explore Invites templates
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FinalInviteDisplay;
import React from "react";
import "./finalInvteDisplay.css";

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
    const inviteURL = `https://horaservices.com/wonderland?id=${orderDetails?.id}/${orderDetails?.userId}/guest`;

    const shareText = `You're invited to ${orderDetails.Name || "someone"}'s ${
      orderDetails["Event Type"] || "Birthday"
    }! 🎉\n\n📅 ${formatDate(orderDetails.Date)}\n⏰ ${orderDetails.Time}\n📍 ${
      orderDetails.Address || "Venue"
    }\n\n👉 Tap to view the invite:\n${inviteURL}`;

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="invite-wrapper">
      <div className="invite-card">
        <h2 className="invite-heading">YOU‘RE INVITED</h2>

        <div className="cake-image-wrapper">
          <img src={orderDetails.Image} alt="Cake" className="cake-image" />
        </div>

        <h3 className="invite-title">
          {orderDetails.Name || "Someone"}‘S{" "}
          {orderDetails["Event Type"] || "Birthday"} CELEBRATION
        </h3>

        <p className="invite-detail">
          <span>📅</span> DATE : {formatDate(orderDetails.Date)}
        </p>

        <p className="invite-detail">
          <span>⏰</span> TIME : {orderDetails.Time}
        </p>

        <p className="invite-detail">
          <span>📍</span> <strong>Home</strong> (
          {orderDetails.Address || "Venue"})
        </p>

        {/* ✅ Show both buttons to Host only */}
        {isHost && (
          <div className="invite-buttons">
            <button className="invite-btn" onClick={handleClick}>
              📩 Explore templates
            </button>
            <button className="invite-btn" onClick={handleWhatsAppShare}>
              📤 Share Invitation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalInviteDisplay;
