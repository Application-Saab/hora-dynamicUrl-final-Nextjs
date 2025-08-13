import React, { useEffect, useState } from "react";
import "./GuestListPreview.css";
import RSVPPopup from "../RSVPPopup";
import { useRouter } from "next/router";
import { BASE_URL } from "@/utils/apiconstants";
import train from "@/assets/train.png"
import Image from "next/image";
const RSVP_STATUS = {
  WILL_COME: "will Come",
  WILL_TRY: "Sure, will try",
};


const GuestListPreview = ({ hostData, urlParams }) => {
  const router = useRouter();

  const [guestData, setGuestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRsvpList, setOpenRsvpList] = useState(false);
  const [guestCounts, setGuestCounts] = useState({
    confirmed: 0,
    willTry: 0,
    notAnswered: 0,
  });

  useEffect(() => {
    const fetchGuests = async () => {
      if (!urlParams?.eventId) {
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
          `${BASE_URL}/api/customer/event/event-guests/all/${urlParams?.eventId}`,
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

    fetchGuests();
  }, [urlParams?.eventId]);

  // useEffect(() => {
  //   if (guestData.length > 0) {
  //     const confirmed = guestData.filter(
  //       (guest) => guest.rsvpStatus === RSVP_STATUS.WILL_COME
  //     ).length;
  //     const willTry = guestData.filter(
  //       (guest) => guest.rsvpStatus === RSVP_STATUS.WILL_TRY
  //     ).length;
  //     const notAnswered = guestData.filter(
  //       (guest) => guest.rsvpStatus === undefined || guest.rsvpStatus === ""
  //     ).length;

  //     setGuestCounts({ confirmed, willTry, notAnswered });
  //   }
  // }, [guestData]);
useEffect(() => {
  const confirmed = guestData.filter(
    (guest) => guest.rsvpStatus === RSVP_STATUS.WILL_COME
  ).length + 1; // host hamesha confirmed me

  const willTry = guestData.filter(
    (guest) => guest.rsvpStatus === RSVP_STATUS.WILL_TRY
  ).length;

  const notAnswered = guestData.filter(
    (guest) => guest.rsvpStatus === undefined || guest.rsvpStatus === ""
  ).length;

  setGuestCounts({ confirmed, willTry, notAnswered });
}, [guestData]);

  if (loading) return <div>Loading...</div>;

  

  return (
  
    <div className="guest-preview-card">
  <h3 className="preview-title">Let’s see who’s joining</h3>

 
 <div className="train-preview-wrapper">
    <div className="train-gradient-bg">
      <Image src={train} alt="Train Guests" className="train-image" />
    </div>
    {/* Overlaid counts */}
    <div className="guest-count-overlay">
      <span className="confirmed">Confirm - {guestCounts?.confirmed || 0}</span>
      <span className="separator">|</span>
      <span className="try">Will Try - {guestCounts?.willTry || 0}</span>
    </div>
  </div>

  {/* View Full List Button */}
  <div className="view-list-button" onClick={() => setOpenRsvpList(true)}>
    <span className="list-icon">☰</span> Full Guest List
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

  );
};

export default GuestListPreview;
