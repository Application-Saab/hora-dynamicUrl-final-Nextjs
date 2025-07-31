

// import React from "react";
// import{ useEffect } from "react";
// import "./GuestListPreview.css"; // you'll create this CSS file

// const GuestListPreview = ({ guestList = [], loading, fetchGuests }) => {
//    useEffect(() => {
//     fetchGuests(); // 👈 this ensures guests are loaded on refresh too
//   }, []);
//   const confirmedCount = guestList.filter(g => g.status === "I am coming").length;
//   const willTryCount = guestList.filter(g => g.status === "Not sure").length;

//   const getRandomColor = () => {
//     const colors = ["#7A4E9D", "#502F87", "#FD5C91", "#A45584", "#392B69", "#0C39A8"];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   return (
//     <div className="guest-preview-card">
//       <h3 className="preview-title">See Who’s Coming!</h3>

//       <div className="preview-header-row">
//         <span className="preview-label">Guests</span>
//         <span className="preview-view-list" onClick={fetchGuests}>
//           View Full List
//         </span>
//       </div>

//       <div className="guest-circle-container">
//         {guestList.slice(0, 7).map((g, idx) => (
//           <div
//             className="guest-initial-circle"
//             key={idx}
//             style={{ backgroundColor: getRandomColor() }}
//           >
//             {g.name?.charAt(0).toUpperCase()}
//           </div>
//         ))}
//       </div>

//       <div className="guest-count-row">
//         <span className="confirmed">Confirmed- {confirmedCount}</span>
//         <span className="separator">|</span>
//         <span className="try">Will Try- {willTryCount}</span>
//       </div>
//     </div>
//   );
// };

// export default GuestListPreview;

import React, { useEffect } from "react";
import "./GuestListPreview.css";

const GuestListPreview = ({ guestList = [], loading, fetchGuests, userType }) => {
 useEffect(() => {
  fetchGuests(false); // ❌ Popup nahi khulega
}, []);

  const confirmedCount = guestList.filter(g => g.status === "I am coming").length;
  const willTryCount = guestList.filter(g => g.status === "Not sure").length;

  const getRandomColor = () => {
    const colors = ["#7A4E9D", "#502F87", "#FD5C91", "#A45584", "#392B69", "#0C39A8"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 🛑 Do not render anything if no guests yet and not a host
  if (guestList.length === 0 && userType !== "host") return null;

  return (
    <div className="guest-preview-card">
      <h3 className="preview-title">See Who’s Coming!</h3>

      <div className="preview-header-row">
        <span className="preview-label">Guests</span>
        {guestList.length > 0 && (
          <span className="preview-view-list" onClick={() => fetchGuests(true)}>
  View Full List
</span>
        )}
      </div>

      {guestList.length > 0 && (
        <>
          <div className="guest-circle-container">
            {guestList.slice(0, 7).map((g, idx) => (
              <div
                className="guest-initial-circle"
                key={idx}
                style={{ backgroundColor: getRandomColor() }}
              >
                {g.name?.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>

          <div className="guest-count-row">
            <span className="confirmed">Confirmed - {confirmedCount}</span>
            <span className="separator">|</span>
            <span className="try">Will Try - {willTryCount}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default GuestListPreview;
