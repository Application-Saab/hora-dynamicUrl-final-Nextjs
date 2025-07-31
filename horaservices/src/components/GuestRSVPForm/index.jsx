import React, { useState } from "react";
import "./GuestRSVPForm.css";

const GuestRSVPForm = ({ onSubmit, userType, guestList = [], loading, fetchGuests }) => {
  const [guestName, setGuestName] = useState("");
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false); // ✅ loader state

  if (userType === "host") return null;

  const handleClick = (selectedStatus) => {
    setStatus(selectedStatus);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName || !status) return;

    setSubmitting(true);
    try {
      await onSubmit({ name: guestName, status }); // ✅ only name & status
      alert("Thank you! Your response has been submitted.");
      setHasSubmitted(true);
      setGuestName("");
      setStatus("");
      setShowForm(false);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setStatus("");
  };

  const confirmedCount = guestList.filter((g) => g.status === "I am coming").length;
  const willTryCount = guestList.filter((g) => g.status === "Not sure").length;

  const getRandomColor = () => {
    const colors = ["#7A4E9D", "#502F87", "#FD5C91", "#A45584", "#392B69", "#0C39A8"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="guest-rsvp-box">
      {!hasSubmitted && (
        <>
          <h4 className="rsvp-title">
            Hope you’ll definitely be coming, just wanted to confirm 😊
          </h4>

          <div className="rsvp-button-group">
            <button className="rsvp-btn" onClick={() => handleClick("I am coming")}>
              Will Come
            </button>
            <button className="rsvp-btn" onClick={() => handleClick("Not sure")}>
              Sure, will try
            </button>
          </div>
        </>
      )}

      <h3 className="coming-title">See Who’s Coming!</h3>

      <div className="guest-preview-header">
        <span className="guests-label">Guests</span>
        <span className="view-list" onClick={fetchGuests}>View Full List</span>
      </div>

      <div className="guest-circle-container">
        {guestList.slice(0, 7).map((g, idx) => (
          <div
            className="circle"
            key={idx}
            style={{ backgroundColor: getRandomColor(), color: "white" }}
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
    </div>
  );
};

export default GuestRSVPForm;
