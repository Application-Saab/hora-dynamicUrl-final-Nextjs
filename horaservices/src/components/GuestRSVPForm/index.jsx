// import React, { useEffect, useState ,useRef } from "react";
// import "./GuestRSVPForm.css";
// import { BASE_URL, UPDATE_RSVP_STATUS } from "@/utils/apiconstants";
// import RSVPPopup from "../RSVPPopup";
// import Image from "next/image";
// import train from "@/assets/train.png";
// import curveBg from "@/assets/train-background.png";
// const RSVP_STATUS = {
//   WILL_COME: "will Come",
//   WILL_TRY: "Sure, will try",
// };

// const GuestRSVPForm = ({
//   hostData,
//   userType,
//   guestList = [],
//   fetchGuests,
//   eventId,
//   userId,
//   hasSubmitted,
//   setHasSubmitted,
//   setShowPopupGuest,
// }) => {
//   const [guestName, setGuestName] = useState("");
//   const [status, setStatus] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [highlightRSVPButtons, setHighlightRSVPButtons] = useState(false);
//   const [openRsvpList, setOpenRsvpList] = useState(false);

//   const [guestData, setGuestData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [guestCounts, setGuestCounts] = useState({
//     confirmed: 0,
//     willTry: 0,
//     notAnswered: 0,
//   });
// const [showVideo, setShowVideo] = useState(false);
// const videoRef = useRef(null);


// const playVideo = () => {
//   setShowVideo(true); 
// };
//   useEffect(() => {
//   const confirmed =
//     guestData.filter(
//       (guest) => guest.rsvpStatus === RSVP_STATUS.WILL_COME
//     ).length + 1; // host ka fixed count

//   const willTry = guestData.filter(
//     (guest) => guest.rsvpStatus === RSVP_STATUS.WILL_TRY
//   ).length;

//   const notAnswered = guestData.filter(
//     (guest) => guest.rsvpStatus === undefined || guest.rsvpStatus === ""
//   ).length;

//   setGuestCounts({ confirmed, willTry, notAnswered });
// }, [guestData]);




//   const fetchGuestsInside = async () => {
//     if (!eventId) {
//       setError("Event ID not found in URL");
//       setLoading(false);
//       return;
//     }
//     const token = localStorage.getItem("token"); // Assuming token is stored here
//     if (!token) {
//       setError("No authentication token found");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${BASE_URL}/api/customer/event/event-guests/all/${eventId}`,
//         {
//           headers: {
//             Authorization: `${token}`, // Add token in Authorization header
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const data = await response.json();
//       if (data.error) {
//         setError(data.message || "Failed to fetch guests");
//       } else {
//         setGuestData(data.data || []);
//       }
//     } catch (err) {
//       setError("Error fetching guests: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGuestsInside();
//   }, []);

//   // Check localStorage to see if already submitted
//   useEffect(() => {
//     if (!hasSubmitted && eventId && userId) {
//       const isSubmitted = localStorage.getItem(
//         `rsvp_submitted_${eventId}_${userId}`
//       );
//       if (isSubmitted === "true") {
//         setHasSubmitted(true);
//       }
//     }
//   }, [eventId, userId, hasSubmitted, setHasSubmitted]);

//   const handleClick = (selectedStatus) => {
//     setStatus(selectedStatus);
//     setShowForm(true);
//   };

//   const handleClose = () => {
//     setShowForm(false);
//     setStatus("");
//   };

//   const handleViewFullListClick = () => {
//     if (!hasSubmitted) {
//       setHighlightRSVPButtons(true);
//       setTimeout(() => setHighlightRSVPButtons(false), 1000);
//       return;
//     }
//     // fetchGuests();
//   };

//   const updateRsvpStatus = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("No authentication token found");
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}${UPDATE_RSVP_STATUS}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           eventId: eventId,
//           userId: userId,
//           rsvpStatus: status,
//           name: guestName,
//         }),
//       });

//       const data = await response.json();
//       if (data.error) {
//         alert("Something went wrong. Please try again. 1");
//       } else {
//         fetchGuestsInside(); 
//         setOpenRsvpList(true);
//         localStorage.setItem(`rsvp_submitted_${eventId}_${userId}`, "true");
//         setHasSubmitted(true);
//         setGuestName("");
//         setStatus("");
//         setShowForm(false);
//         setSubmitting(false);
//         // setShowPopupGuest(true); // Open the RSVP list popup
//         setShowVideo(true);
//       }
//     } catch (err) {
//       setSubmitting(false);
//       alert("Something went wrong. Please try again. 2");
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   if (!guestName || !status) {
//   //     alert("Please enter your name and select an option.");
//   //     return;
//   //   }
//   //   setSubmitting(true);
//   //   updateRsvpStatus();
//   // };
// // 1️⃣ Handle submit
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!guestName || !status) return;

//   // 1️⃣ Show video immediately
//   setShowVideo(true);

//   // 2️⃣ Start API update in background
//   setSubmitting(true);
//   await updateRsvpStatus(); 
//   setSubmitting(false);

//   // Note: overlay auto hide is handled in useEffect
// };


// // useEffect(() => {
// //   if (!showVideo || !videoRef.current) return;

// //   const video = videoRef.current;
// //   video.currentTime = 0;

// //   const handleCanPlay = () => {
// //     video.play();
// //     setTimeout(() => {
// //       setShowVideo(false); // hide overlay after 5 sec
// //     }, 5000);
// //   };

// //   video.addEventListener("canplay", handleCanPlay);

// //   return () => {
// //     video.removeEventListener("canplay", handleCanPlay);
// //     clearTimeout();
// //   };
// // }, [showVideo]);



 
//   return(
//     <>
//     <div className={`guest-rsvp-box ${highlightRSVPButtons ? "highlight" : ""}`}>
//       {userType !== "host" && !hasSubmitted && (
//         <div className="rsvp-box">
//           <h4 className="rsvp-title">
//             Hope you’ll definitely be coming, just wanted to confirm 😊
//           </h4>

//           <div  className="rsvp-button-group">
//             <button
//               className="rsvp-btn"
//                    onClick={() => handleClick(RSVP_STATUS.WILL_COME)}
//             >
//               Will Come
//             </button>
//             <button
//                className="rsvp-btn"
//              onClick={() => handleClick(RSVP_STATUS.WILL_TRY)}
//             >
//               Sure, will try
//             </button>
//           </div>
//         </div>
//       )}
// </div>

//       <div className="guest-preview-card">
//         <div className="curve-container">
//           <Image src={curveBg} alt="Curve Background" className="curve-bg" />
          
//           <h3 className="preview-title">Let’s see who’s joining</h3>
      
//           {/* 🚂 Train Image */}
//           <div className="train-preview-wrapper">
//             <Image src={train} alt="Train Guests" className="train-image" />
      
//             {/* 🔢 Overlay Guest Counts */}
//             <div className="guest-count-overlay">
//               <span className="confirmed">Confirm - {guestCounts?.confirmed || 0}</span>
//               <span className="separator">|</span>
//               <span className="try">Will Try - {guestCounts?.willTry || 0}</span>
//             </div>
//           </div>
      
//           {/* 🔘 Full Guest List Button */}
//           <div className="view-list-button" onClick={handleViewFullListClick}>
//             <span className="list-icon">☰</span> Full Guest List
//           </div>
//         </div>
      
//         {openRsvpList && (
//           <RSVPPopup
//             hostData={hostData}
//             guestData={guestData}
//             loading={loading}
//             error={error}
//             onClose={() => setOpenRsvpList(false)}
//           />
//         )}
//       </div>

//       {showForm && (
//         <div className="modal-overlay-form">
//   <div className="modal-content-form">
//     <button className="modal-close-form" onClick={() => setShowForm(false)}>×</button>
//     <h2>What Should We Scream When You Enter?</h2>
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         placeholder="Write Your Name Here"
//         value={guestName}
//         onChange={(e) => setGuestName(e.target.value)}
//         required
//       />
//       <button type="submit" className="submit-btn" disabled={submitting}>
//         {submitting ? "Submitting..." : "SAVE"}
//       </button>
//     </form>
//   </div>
// </div>

//       )}
// {showVideo && (
//   <div className="video-overlay">
//     <video
//       ref={videoRef}
//       src="/luckdrawgif.mp4"
//       muted
//       autoPlay
//       playsInline
//       onEnded={() => setShowVideo(false)} // 👈 Video end hote hi overlay hide
//     />
//   </div>
// )}





//       {/* {openRsvpList && (
//         <div className="popup-rsvp-list">
//           <div className="rsvp-list-box">
//             <h4>Guest List</h4>
//             <ul>
//               {guestData.map((g, i) => (
//                 <li key={i}>{g.name}</li>
//               ))}
//             </ul>
//             <button onClick={() => setOpenRsvpList(false)}>Close</button>
//           </div>
//         </div>
//       )} */}
//     {/* </div> */}
//     </>
//   );
// };

// export default GuestRSVPForm;

import React, { useEffect, useState, useRef } from "react";
import "./GuestRSVPForm.css";
import { BASE_URL, UPDATE_RSVP_STATUS } from "@/utils/apiconstants";
import RSVPPopup from "../RSVPPopup";
import Image from "next/image";
import train from "@/assets/train.png";
import curveBg from "@/assets/train-background.png";

const RSVP_STATUS = {
  WILL_COME: "will Come",
  WILL_TRY: "Sure, will try",
};

const GuestRSVPForm = ({
  hostData,
  userType,
  guestList = [],
  fetchGuests,
  eventId,
  userId,
  hasSubmitted,
  setHasSubmitted,
  setShowPopupGuest,
}) => {
  const [guestName, setGuestName] = useState("");
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [highlightRSVPButtons, setHighlightRSVPButtons] = useState(false);
  const [openRsvpList, setOpenRsvpList] = useState(false);

  const [guestData, setGuestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guestCounts, setGuestCounts] = useState({
    confirmed: 0,
    willTry: 0,
    notAnswered: 0,
  });

  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  // Count guests
  useEffect(() => {
    const confirmed =
      guestData.filter((guest) => guest.rsvpStatus === RSVP_STATUS.WILL_COME)
        .length + 1;
    const willTry = guestData.filter(
      (guest) => guest.rsvpStatus === RSVP_STATUS.WILL_TRY
    ).length;
    const notAnswered = guestData.filter((guest) => !guest.rsvpStatus).length;

    setGuestCounts({ confirmed, willTry, notAnswered });
  }, [guestData]);

  // Fetch guests
  const fetchGuestsInside = async () => {
    if (!eventId) {
      setError("Event ID not found in URL");
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/customer/event/event-guests/all/${eventId}`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.error) {
        setError(data.message || "Failed to fetch guests");
      } else {
        setGuestData(data.data || []);
      }
    } catch (err) {
      setError("Error fetching guests: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestsInside();
  }, []);

  // Check localStorage if RSVP submitted
  useEffect(() => {
    if (!hasSubmitted && eventId && userId) {
      const isSubmitted = localStorage.getItem(
        `rsvp_submitted_${eventId}_${userId}`
      );
      if (isSubmitted === "true") {
        setHasSubmitted(true);
      }
    }
  }, [eventId, userId, hasSubmitted, setHasSubmitted]);

  const handleClick = (selectedStatus) => {
    setStatus(selectedStatus);
    setShowForm(true);
  };

  const handleViewFullListClick = () => {
    if (!hasSubmitted) {
      setHighlightRSVPButtons(true);
      setTimeout(() => setHighlightRSVPButtons(false), 1000);
      return;
    }
  };

  // API call to update RSVP
  const updateRsvpStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authentication token found");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}${UPDATE_RSVP_STATUS}`, {
        method: "PUT",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          userId,
          rsvpStatus: status,
          name: guestName,
        }),
      });
      const data = await response.json();
      if (data.error) {
        alert("Something went wrong. Please try again.");
      } else {
        fetchGuestsInside();
        setOpenRsvpList(true);
        localStorage.setItem(`rsvp_submitted_${eventId}_${userId}`, "true");
        setHasSubmitted(true);
        setGuestName("");
        setStatus("");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestName || !status) return;

    // 1️⃣ Show video immediately
    setShowVideo(true);

    // 2️⃣ Close name modal immediately
    setShowForm(false);
  };

  // ✅ Video overlay effect: hides overlay and triggers API
  useEffect(() => {
    if (!showVideo || !videoRef.current) return;

    const video = videoRef.current;

    const handleEnded = async () => {
      setShowVideo(false);
      setSubmitting(true);
      await updateRsvpStatus();
      setSubmitting(false);
    };

    video.addEventListener("ended", handleEnded);

    // Start video from beginning
    video.currentTime = 0;
    video.play();

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [showVideo]);

  return (
    <>
      <div className={`guest-rsvp-box ${highlightRSVPButtons ? "highlight" : ""}`}>
        {userType !== "host" && !hasSubmitted && (
          <div className="rsvp-box">
            <h4 className="rsvp-title">
              Hope you’ll definitely be coming, just wanted to confirm 😊
            </h4>
            <div className="rsvp-button-group">
              <button
                className="rsvp-btn"
                onClick={() => handleClick(RSVP_STATUS.WILL_COME)}
              >
                Will Come
              </button>
              <button
                className="rsvp-btn"
                onClick={() => handleClick(RSVP_STATUS.WILL_TRY)}
              >
                Sure, will try
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="guest-preview-card">
        <div className="curve-container">
          <Image src={curveBg} alt="Curve Background" className="curve-bg" />
          <h3 className="preview-title">Let’s see who’s joining</h3>

          <div className="train-preview-wrapper">
            <Image src={train} alt="Train Guests" className="train-image" />
            <div className="guest-count-overlay">
              <span className="confirmed">Confirm - {guestCounts?.confirmed || 0}</span>
              <span className="separator">|</span>
              <span className="try">Will Try - {guestCounts?.willTry || 0}</span>
            </div>
          </div>

          <div className="view-list-button" onClick={handleViewFullListClick}>
            <span className="list-icon">☰</span> Full Guest List
          </div>
        </div>

        {openRsvpList && (
          <RSVPPopup
            hostData={hostData}
            guestData={guestData}
            loading={loading}
            error={error}
            onClose={() => setOpenRsvpList(false)}
          />
        )}
      </div>

      {showForm && (
        <div className="modal-overlay-form">
          <div className="modal-content-form">
            <button className="modal-close-form" onClick={() => setShowForm(false)}>×</button>
            <h2>What Should We Scream When You Enter?</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Write Your Name Here"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? "Submitting..." : "SAVE"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Video overlay */}
      {showVideo && (
        <div className="video-overlay">
          <video
            ref={videoRef}
            src="/luckdrawgif.mp4"
            muted
            autoPlay
            playsInline
          />
        </div>
      )}
    </>
  );
};

export default GuestRSVPForm;
