import React, { useEffect, useState, useRef } from "react";
import "./GuestRSVPForm.css";
import { BASE_URL, UPDATE_RSVP_STATUS } from "@/utils/apiconstants";
import RSVPPopup from "../RSVPPopup";
import Image from "next/image";
import train from "@/assets/train.png";
import curveBg from "@/assets/train-background.png";
import gif from "@/assets/luckdrawgif.mp4";
import ListViewIcon from "@/assets/list_view_icon.png";
import RightTickRSVP from "@/assets/right_tick_rsvp.png";
import NotSureRSVP from "@/assets/not_sure_rsvp.png";
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
  highlightRSVPButtons,
  setHighlightRSVPButtons,
  rsvpGuestName,
}) => {
  const [guestName, setGuestName] = useState(rsvpGuestName || "");
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);  
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

  const fetchGuestsInside = async () => {
    setGuestData([]);
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
        setGuestData([]);
        setError(data.message || "Failed to fetch guests");
      } else {
        setGuestData(data.data || []);
      }
    } catch (err) {
      setGuestData([]);
      setError("Error fetching guests: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial call
    fetchGuestsInside();

  // Call every 3 minute
  const interval = setInterval(fetchGuestsInside, 10000);

  // Cleanup interval on unmount
  return () => clearInterval(interval);

  }, [eventId, userId]);

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

 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestName || !status) return;

    setShowVideo(true);


    setShowForm(false);
  };

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
    video.currentTime = 0;
    video.play();

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [showVideo]);

  return (
    <>
      {highlightRSVPButtons && <div className="full-screen-overlay"></div>}
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
                <span className="rsvp-btn-icon-bg">
                  <Image
                    src={RightTickRSVP}
                    alt="WhatsApp"
                    className="rsvp-btn-icon-img"
                  />
                </span>
                <span className="rsvp-btn-txt">Sure,Will Come</span>
              </button>
              <button
                className="rsvp-btn rsvp-btn-2"
                onClick={() => handleClick(RSVP_STATUS.WILL_TRY)}
              >
                <span className="rsvp-btn-txt">Sure,Will Try</span>
                <span className="rsvp-btn-icon-bg-2">
                  <Image
                    src={NotSureRSVP}
                    alt="WhatsApp"
                    className="rsvp-btn-icon-img-2"
                  />
                </span>
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

          <div
            className="d-flex justify-content-center"
            style={{ marginBottom: "22.5px" }}
          >
            <button
              className="view-list-button"
              onClick={handleViewFullListClick}
            >
              <span className="view-list-icon-bg">
                <Image
                  src={ListViewIcon}
                  alt="WhatsApp"
                  className="view-list-icon-img"
                />
              </span>
              <span>Full Guest List</span>
            </button>
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
                placeholder="Enter Your Name"
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

      {showVideo && (
        <div className="video-overlay">
          <video
            ref={videoRef}
            src={gif}
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