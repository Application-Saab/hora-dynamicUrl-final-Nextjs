import React, { useEffect, useState } from "react";
import "./GuestListPreview.css";
import RSVPPopup from "../RSVPPopup";
import { useRouter } from "next/router";
import { BASE_URL } from "@/utils/apiconstants";
import train from "@/assets/train.png";
import curveBg from "@/assets/train-background.png";
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
      const token = localStorage.getItem("token");
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

    fetchGuests();
  }, [urlParams?.eventId]);

  useEffect(() => {
    const confirmed = guestData.filter(
      (guest) => guest.rsvpStatus === RSVP_STATUS.WILL_COME
    ).length + 1; 

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
      <div className="curve-container">
        <Image src={curveBg} alt="Curve Background" className="curve-bg" />
        <h3 className="preview-title">Let’s see who’s joining</h3>

        <div className="train-preview-wrapper">
          <Image src={train} alt="Train Guests" className="train-image" />

          {
            [
              { name: hostData?.name || hostData?.Name },
              ...guestData.filter(
                (guest) => guest.rsvpStatus === RSVP_STATUS.WILL_COME
              ),
            ]
              .slice(0, 5)
              .map((guest, index) => {
                const firstLetter = guest?.name?.charAt(0).toUpperCase() || "";
                return (
                  <span key={index} className={`balloon-letter balloon-${index}`}>
                    {firstLetter}
                  </span>
                );
              })
          }


          <div className="guest-count-overlay">
            <span className="confirmed">Confirm - {guestCounts?.confirmed || 0}</span>
            <span className="separator">|</span>
            <span className="try">Will Try - {guestCounts?.willTry || 0}</span>
          </div>
        </div>


        <div className="view-list-button" onClick={() => setOpenRsvpList(true)}>
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




  );
};

export default GuestListPreview;