import React, { useEffect, useLayoutEffect, useState } from "react";
import "./WonderlandLandingPage.css";
import { useRouter } from "next/router";
import CreateInviteModal from "./create-invite/CreateEventInvite";
import { BASE_URL, GET_ALL_EVENTS_BY_USERID } from "@/utils/apiconstants";
import OtpLoginPopup from "@/components/OtpLoginPopup";

const WonderlandLandingPage = ({ userId }) => {
  const router = useRouter();
  const slug = router.query.slug || [];
  const { page } = router.query;

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [loggedinUserId, setLoggedinUserId] = useState(
    localStorage.getItem("userID") || ""
  );
  const [allEventsData, setAllEventsData] = useState([]);
  const [getEventsError, setGetEventsError] = useState(null);
  const [getEventsLoading, setEventsLoading] = useState(null);
  console.log(
    "%c [ allEventsData ]-20",
    "font-size:13px; background:pink; color:#bf2c9f;",
    allEventsData
  );

  const token = localStorage.getItem("token");

  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClickCreateInvite = async () => {
    try {
      const payload = {
        userId: userId || "",
        eventType: "",
        hostName: "",
        eventDate: "",
        eventTime: "",
        location: "",
        hostImage: null,
      };

      const res = await fetch(
        `${BASE_URL}/api/customer/event/create-event-invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (res.ok) {
        console.log("Invitation created:", result);
        const finalEventId = result?.data?._id;
        if (finalEventId) {
          router.replace(
            `/wonderland/${userId}/${finalEventId}?page=create-invite`
          );
        }
      } else {
        console.error("Failed:", result);
        alert("Failed to save invitation.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    }
  };

  // Agar query me create-invite hai to direct component render karo
  if (page === "create-invite") {
    return <CreateInviteModal slug={slug} />;
  }

  // 🔹 Jab login state change hoti hai to redirect
  useLayoutEffect(() => {
    if (isUserLoggedIn && loggedinUserId && slug?.length === 0) {
      router.push(`/wonderland/${loggedinUserId}`);
    }
  }, [slug, loggedinUserId, isUserLoggedIn]);

  useEffect(() => {
    if (
      isUserLoggedIn &&
      loggedinUserId &&
      slug?.length === 3 &&
      slug[2] === "guest"
    ) {
      router.push(`/wonderland/${loggedinUserId}/${slug[1]}/guest`);
    }
  }, [loggedinUserId, isUserLoggedIn, slug]);

  useEffect(() => {
    if (!isUserLoggedIn) {
      setIsModalOpen(true);
      setShowModal(false);
    } else {
      setIsModalOpen(false);
    }
  }, [isUserLoggedIn]);

  // 🔹 LocalStorage changes listen karo
  useEffect(() => {
    const syncLoginState = () => {
      setIsUserLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setLoggedinUserId(localStorage.getItem("userID") || "");
    };

    window.addEventListener("storage", syncLoginState);

    // Same tab ke liye bhi run karo jab login success ke baad tum manually set karte ho
    window.addEventListener("loginStateChange", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  const fetchAllEventsList = async () => {
    if (!loggedinUserId) {
      setGetEventsError("User ID not found in URL");
      setEventsLoading(false);
      return;
    }
    const token = localStorage.getItem("token"); // Assuming token is stored here
    if (!token) {
      setGetEventsError("No authentication token found");
      setEventsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}${GET_ALL_EVENTS_BY_USERID}/${loggedinUserId}`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.error) {
        setGetEventsError(data.message || "Failed to fetch guests");
      } else {
        setAllEventsData(data.data || []);
      }
    } catch (err) {
      setGetEventsError("Error fetching guests: " + err.message);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    if (loggedinUserId && isUserLoggedIn) {
      fetchAllEventsList();
    }
  }, [loggedinUserId, isUserLoggedIn]);

    const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  return (
  <>
    {!isUserLoggedIn &&
      slug &&
      slug?.length === 3 &&
      slug[2].toLowerCase() === "guest" && (
        <div className="no-orders">
          <OtpLoginPopup setIsModalOpen={setIsModalOpen} />
        </div>
      )}

    {!userId && slug?.length <= 0 && (
      <div className="no-orders">
        <div>Wonderland Public Landing Page</div>
      </div>
    )}

    {userId && slug?.length === 1 && (
      <div className="logedin-container">
        {/* Create New Event Button */}
        <div style={{ marginBottom: "20px" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleClickCreateInvite}
          >
            Create New Event
          </button>
        </div>

        {/* Event List */}
        {getEventsLoading && <p>Loading your events...</p>}
        {getEventsError && <p style={{ color: "red" }}>{getEventsError}</p>}

        {!getEventsLoading && allEventsData.length > 0 && (
          <div className="event-list">
             <h3 style={{textAlign: 'center'}}>OR</h3>
            {/* <h3 style={{textAlign: 'center'}}>View Old Events</h3> */}
            <ul style={{ listStyle: "none", padding: 0 }}>
              {allEventsData?.map((event) => (
                <li
                  key={event._id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{marginRight: '20px'}}>
                    <strong>{event?.hostName}'s {event.eventType || "Untitled Event"}</strong>
                    <br />
                    <small>
                      {formatDate(event.eventDate)} at {event.eventTime}
                    </small>
                  </div>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      router.push(
                        `/wonderland/${userId}/${event._id}/host`
                      )
                    }
                  >
                    View Event
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!getEventsLoading && allEventsData.length === 0 && (
          <p>No events found. Create your first one!</p>
        )}
      </div>
    )}
  </>
);
};

export default WonderlandLandingPage;
