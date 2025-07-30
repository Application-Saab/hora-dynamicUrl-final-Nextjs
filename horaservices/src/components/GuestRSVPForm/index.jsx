// import React, { useState } from "react";

// const GuestRSVPForm = ({ onSubmit, userType }) => {
//   const [guestName, setGuestName] = useState("");
//   const [guestPhone, setGuestPhone] = useState("");
//   const [status, setStatus] = useState("");
//   const [showForm, setShowForm] = useState(false);

//   // 🔒 Hide this form entirely for hosts
//   if (userType === "Host") return null;

//   const handleClick = (selectedStatus) => {
//     setStatus(selectedStatus);
//     setShowForm(true);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!guestName || !guestPhone || !status) return;
//     onSubmit({ name: guestName, phone: guestPhone, status });
//     setGuestName("");
//     setGuestPhone("");
//     setStatus("");
//     setShowForm(false);
//   };

//   return (
//     <div className="guest-rsvp-box">
//       <h4>Hope you’ll definitely be coming, just wanted to confirm 😊</h4>

//       <div className="rsvp-button-group">
//         <button onClick={() => handleClick("I am coming")}>Will Come</button>
//         <button onClick={() => handleClick("Not sure")}>Sure, will try</button>
//       </div>

//       {showForm && (
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Your Name"
//             value={guestName}
//             onChange={(e) => setGuestName(e.target.value)}
//             required
//           />
//           <input
//             type="tel"
//             placeholder="Phone"
//             value={guestPhone}
//             onChange={(e) => setGuestPhone(e.target.value)}
//             required
//           />
//           <button type="submit">Submit RSVP</button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default GuestRSVPForm;


import React, { useState } from "react";
import "./GuestRSVPForm.css"; // For modal styles

const GuestRSVPForm = ({ onSubmit, userType }) => {
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);

  if (userType === "Host") return null;

  const handleClick = (selectedStatus) => {
    setStatus(selectedStatus);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestName || !guestPhone || !status) return;
    onSubmit({ name: guestName, phone: guestPhone, status });
    setGuestName("");
    setGuestPhone("");
    setStatus("");
    setShowForm(false);
  };

  const handleClose = () => {
    setShowForm(false);
    setStatus("");
  };

  return (
    <div className="guest-rsvp-box">
      <h4>Hope you’ll definitely be coming, just wanted to confirm 😊</h4>

      <div className="rsvp-button-group">
        <button onClick={() => handleClick("I am coming")}>Will Come</button>
        <button onClick={() => handleClick("Not sure")}>Sure, will try</button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleClose}>×</button>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                required
              />
              <button type="submit">Submit RSVP</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestRSVPForm;
