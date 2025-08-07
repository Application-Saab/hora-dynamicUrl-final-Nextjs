import React, { useEffect, useState } from "react";
import "./GuestListPreview.css";
import RSVPPopup from "../RSVPPopup";
import { useRouter } from "next/router";
import { BASE_URL } from "@/utils/apiconstants";

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

const GuestListPreview = ({ hostData }) => {
  const router = useRouter();
  const { id } = router.query;
  let eventId = id ? id.split("/")[0] : null; // Extract eventId from URL
  const paramsUserId = id ? id.split("/")[1] : null;
  const isHost = localStorage.getItem("userID") === paramsUserId;

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

    fetchGuests();
  }, [eventId]);

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

  if (loading) return <div>Loading...</div>;

  // 🛑 Do not render anything if no guests yet and not a host
  if (guestData.length === 0) return null;

  return (
    <div className="guest-preview-card">
      <h3 className="preview-title">See Who’s Coming!</h3>

      <div className="preview-header-row">
        <span className="preview-label">Guests</span>
        {guestData?.length > 0 && (
          <span
            className="preview-view-list"
            onClick={() => setOpenRsvpList(true)}
          >
            View Full List
          </span>
        )}
      </div>

      {guestData?.length > 0 && (
        <>
          <div className="guest-circle-container">
            {guestData.slice(0, 7)?.map((g, idx) => (
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
            <span className="confirmed">
              Confirmed - {guestCounts?.confirmed}
            </span>
            <span className="separator">|</span>
            <span className="try">Will Try - {guestCounts?.willTry}</span>
          </div>
        </>
      )}

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
