import React, { useEffect, useState } from "react";
import "./GuestRSVPForm.css";
import { BASE_URL, UPDATE_RSVP_STATUS } from "@/utils/apiconstants";
import RSVPPopup from "../RSVPPopup";

const RSVP_STATUS = {
  WILL_COME: "will Come",
  WILL_TRY: "Sure, will try",
};

const getRandomColor = () => {
  const colors = [
    "#7A4E9D",
    "#502F87",
    "#FD5C91",
    "#A45584",
    "#392B69",
    "#0C39A8",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
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

  useEffect(() => {
    if (guestData.length > 0) {
      const confirmed = guestData.filter(
        (guest) => guest.rsvpStatus === RSVP_STATUS.WILL_COME
      ).length;
      const willTry = guestData.filter(
        (guest) => guest.rsvpStatus === RSVP_STATUS.WILL_TRY
      ).length;
      const notAnswered = guestData.filter(
        (guest) => guest.rsvpStatus === undefined || guest.rsvpStatus === ""
      ).length;

      setGuestCounts({ confirmed, willTry, notAnswered });
    }
  }, [guestData]);

  const fetchGuestsInside = async () => {
    if (!eventId) {
      setError("Event ID not found in URL");
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("token"); // Assuming token is stored here
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
            Authorization: `${token}`, // Add token in Authorization header
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

  // Check localStorage to see if already submitted
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

  const handleClose = () => {
    setShowForm(false);
    setStatus("");
  };

  const handleViewFullListClick = () => {
    if (!hasSubmitted) {
      setHighlightRSVPButtons(true);
      setTimeout(() => setHighlightRSVPButtons(false), 1000);
      return;
    }
    // fetchGuests();
  };

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
          eventId: eventId,
          userId: userId,
          rsvpStatus: status,
          name: guestName,
        }),
      });

      const data = await response.json();
      if (data.error) {
        alert("Something went wrong. Please try again. 1");
      } else {
        fetchGuestsInside(); // Refresh the guest list
        // fetchGuests(); // Refresh the guest list
        setOpenRsvpList(true);
        localStorage.setItem(`rsvp_submitted_${eventId}_${userId}`, "true");
        // setHasSubmitted(true);
        alert("Thank you! Your response has been submitted.");
        setGuestName("");
        setStatus("");
        setShowForm(false);
        setSubmitting(false);
        // setShowPopupGuest(true); // Open the RSVP list popup
      }
    } catch (err) {
      setSubmitting(false);
      alert("Something went wrong. Please try again. 2");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName || !status) {
      alert("Please enter your name and select an option.");
      return;
    }
    setSubmitting(true);
    updateRsvpStatus();
  };

  return (
    <div className="guest-rsvp-box">
      {userType !== "host" && !hasSubmitted && (
        <>
          <h4 className="rsvp-title">
            Hope you’ll definitely be coming, just wanted to confirm 😊
          </h4>

          <div className="rsvp-button-group">
            <button
              className={`rsvp-btn ${highlightRSVPButtons ? "highlight" : ""}`}
              onClick={() => handleClick(RSVP_STATUS.WILL_COME)}
            >
              Will Come
            </button>
            <button
              className={`rsvp-btn ${highlightRSVPButtons ? "highlight" : ""}`}
              onClick={() => handleClick(RSVP_STATUS.WILL_TRY)}
            >
              Sure, will try
            </button>
          </div>
        </>
      )}

      <h3 className="coming-title">See Who’s Coming!</h3>

      <div className="guest-preview-header">
        <span className="guests-label">Guests</span>
        <span
          className="view-list"
          onClick={handleViewFullListClick}
          style={{ cursor: "pointer" }}
        >
          View Full List
        </span>
      </div>

      <div className="guest-circle-container">
        {guestData?.length > 0 &&
        (guestCounts?.confirmed > 0 || guestCounts?.willTry > 0)
          ? guestData?.slice(0, 7).map((g, idx) => (
              <div
                className="circle"
                key={idx}
                style={{ backgroundColor: getRandomColor(), color: "white" }}
              >
                {g.name?.charAt(0).toUpperCase()}
              </div>
            ))
          : Array.from({ length: 5 }).map((_, idx) => (
              <div className="circle placeholder" key={idx}></div>
            ))}
      </div>

      <div className="guest-count-row">
        <span className="confirmed">Confirmed - {guestCounts?.confirmed}</span>
        <span className="separator">|</span>
        <span className="try">Will Try - {guestCounts?.willTry}</span>
      </div>

      {showForm && (
        <div className="modal-overlay-form">
          <div className="modal-content-form">
            <button className="modal-close-form" onClick={handleClose}>
              ×
            </button>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit RSVP"}
              </button>
            </form>
          </div>
        </div>
      )}
      {openRsvpList && (
        <RSVPPopup
          hostData={hostData}
          guestData={guestData}
          loading={loading}
          error={error}
          onClose={() => {
            setOpenRsvpList(false);
            setHasSubmitted(true)
          }}
        />
      )}
    </div>
  );
};

export default GuestRSVPForm;
