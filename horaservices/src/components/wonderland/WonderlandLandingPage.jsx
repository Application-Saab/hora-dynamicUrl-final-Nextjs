"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import "./WonderlandLandingPage.css";
import { useRouter } from "next/router";
import CreateInviteModal from "./create-invite/CreateEventInvite";
import { BASE_URL, GET_ALL_EVENTS_BY_USERID } from "@/utils/apiconstants";
import WonderlandOtploginpopup from "@/components/WonderlandOtploginpopup";
import Image from "next/image";
import wonderlandBanner from "@/assets/wonderlandBanner.jpg";
import wonderlandeventplanningBanner from "@/assets/wonderlandeventplanningBanner.svg";
import howitworks from "@/assets/howitworks.jpg";
import hostandGuest from "@/assets/hostandGuest.png";
import yourcelebration from "@/assets/yourcelebration.png";
import luckdrawBnaner from "@/assets/lucky.jpg";
import OtpLogin from "../OtpLoginPopup";
import {
  FaHome,
  FaComments,
  FaServicestack,
  FaFolderOpen,
  FaGlassCheers,
  FaSearch,
  FaUser,
  FaImage,
} from "react-icons/fa";
import Link from "next/link";
import eventIcon from "../../assets/nav_icon/events.png";
import messageIcon from "../../assets/nav_icon/message.png";
import servicesIcon from "../../assets/nav_icon/services.png";
import accountIcon from "../../assets/nav_icon/account.png";

const WonderlandLandingPage = ({ setRefectchLoginGuest }) => {
  const token = localStorage.getItem("token");
  const router = useRouter();
  const { page, id: queryId, hostName } = router.query;
  const { id } = router.query;
  // const queryId = router.query.id;
  const slug = Array.isArray(queryId) ? queryId : queryId?.split("/") || [];
  console.log(
    "%c [ slug..... ]-12",
    "font-size:13px; background:pink; color:#bf2c9f;",
    slug
  );

  console.log(
    "%c [ page ]-15",
    "font-size:13px; background:pink; color:#bf2c9f;",
    page
  );

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [loggedinUserId, setLoggedinUserId] = useState(
    localStorage.getItem("userID") || ""
  );
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [allEventsData, setAllEventsData] = useState([]);
  const [getEventsError, setGetEventsError] = useState(null);
  const [getEventsLoading, setEventsLoading] = useState(null);
  const [showHostLoginModal, setShowHostLoginModal] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isUserLoggedIn && slug?.length) {
      if (slug?.length === 3 && slug[2].toLowerCase() === "guest") {
        setShowLoginModal(true);
      }
    } else {
      setShowLoginModal(false);
    }
  }, [isUserLoggedIn, queryId]);

  const handleClickCreateInvite = async () => {
    try {
      const payload = {
        userId: loggedinUserId || "",
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
            `/wonderland/?id=${loggedinUserId}/${finalEventId}&page=create-invite`
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

  const createInviteClick = () => {
    if (!isUserLoggedIn) {
      setShowHostLoginModal(true);
      return;
    } else {
      handleClickCreateInvite();
    }
  };
  // Agar query me create-invite hai to direct component render karo
  if (page === "create-invite") {
    return <CreateInviteModal slug={slug} />;
  }

  useEffect(() => {
    if (
      isUserLoggedIn &&
      loggedinUserId &&
      slug?.length === 3 &&
      slug[2] === "guest"
    ) {
      if (slug[0] === loggedinUserId) {
        router.push(`/wonderland?id=${slug[0]}/${slug[1]}/host`);
        return;
      }
      setRefectchLoginGuest(true);
      router.push(`/wonderland?id=${slug[0]}/${slug[1]}/guest`);
    }
  }, [loggedinUserId, isUserLoggedIn, queryId]);

  // 🔹 Jab login state change hoti hai to redirect // TODO: Need to fix this thing
  // useEffect(() => {
  //   if (isUserLoggedIn && loggedinUserId && slug?.length === 0) {
  //     router.push(`/wonderland?id=${loggedinUserId}`);
  //   }
  // }, [queryId, loggedinUserId, isUserLoggedIn]);

  useLayoutEffect(() => {
    let timer;

    if (isUserLoggedIn && loggedinUserId && slug?.length === 0) {
      timer = setTimeout(() => {
        router.push(`/wonderland?id=${loggedinUserId}`);
      }, 2500);
    }

    return () => clearTimeout(timer);
  }, [queryId, loggedinUserId, isUserLoggedIn, slug]);

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
        // Hosted Events with role
        const hosted = (data.data.hostedEvents || []).map((event) => ({
          ...event,
          eventRole: "host",
        }));

        // Guest Events with role
        const guest = (data.data.asAGuestEvents || []).map((event) => ({
          ...event,
          eventRole: "guest",
        }));

        // Merge & Sort
        const merged = [...hosted, ...guest].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setAllEventsData(merged);
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
    if (!dateString) return "Event Date";
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

  const handleClickViewEvent = (eventData) => {
    if (
      eventData?.hostName &&
      eventData?.eventType &&
      eventData?.eventDate &&
      eventData?.eventTime
    ) {
      if (eventData?.eventRole === "host") {
        router.push(
          `/wonderland?id=${eventData?.userId}/${eventData._id}/host`
        );
      } else if (eventData?.eventRole === "guest") {
        router.push(
          `/wonderland?id=${eventData?.userId}/${eventData._id}/guest`
        );
      }
    } else {
      if (eventData?.eventRole === "host") {
        router.push(
          `/wonderland?id=${eventData?.userId}/${eventData._id}&page=create-invite`
        );
      } else {
        alert("Event details are incomplete, only host can update this event.");
      }
    }
  };
  const getEventIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "birthday party":
        return "🎂";
      case "wedding":
        return "💍";
      case "holi celebration":
        return "🎉";
      case "kids party":
        return "🧒";
      default:
        return "🎊";
    }
  };

  console.log(allEventsData, "allEventsData");

  return (
    <>
      {showLoginModal && (
        <div className="no-orders">
          <WonderlandOtploginpopup
            setIsModalOpen={setIsModalOpen}
            hostName={hostName}
          />
        </div>
      )}

      {/* {!loggedinUserId && slug?.length <= 0 && (
      <div className="no-orders">
        <div>Wonderland Public Landing Page</div>
      </div>
    )} */}
      {(slug?.length === 1 || slug?.length <= 0) && (
        <>
          <div className="logedin-container">
            <div className="invite-banner">
              <Image
                src={wonderlandBanner}
                alt="Invite Banner"
                className="banner-image-top"
              />

              <button
                type="button"
                className="create-invite-btn"
                onClick={createInviteClick}
              >
                Create Invite
              </button>
            </div>

            {/* Event List */}
            {getEventsLoading && <p>Loading your events...</p>}

            {allEventsData?.length > 0 && (
              <div className="event-list-wrapper">
                <h3 className="section-heading">Past Events</h3>
                <ul className="event-list">
                  {allEventsData?.map((event) => (
                    <>
                      <li key={event._id} className="event-item">
                        <div className="event-info-list">
                          <div className="event-details-list">
                            <div className="event-meta">
                              <span className="event-role">
                                {event.eventRole?.charAt(0).toUpperCase() +
                                  event.eventRole?.slice(1)}
                              </span>
                            </div>
                            <span className="list-event-title">
                              {event.hostName
                                ? `${event.hostName}'s`
                                : "Host Name"}{" "}
                              {event.eventType
                                ? `${event.eventType}`
                                : "Event Type"}
                            </span>
                            <div className="list-event-date">
                              <span>{formatDate(event.eventDate)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="btn-ctn-event">
                          <button
                            className="view-btn"
                            onClick={() => handleClickViewEvent(event)}
                          >
                            View Event
                          </button>
                        </div>
                      </li>
                    </>
                  ))}
                </ul>
              </div>
            )}

            <div className="invite-banner">
              <Image
                src={wonderlandeventplanningBanner}
                alt="Invite Banner"
                className="banner-image"
              />
            </div>
            <div className="invite-banner">
              <Image
                src={luckdrawBnaner}
                alt="Invite Banner"
                className="banner-image"
              />
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontStyle: "normal",
                fontSize: "20px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                margin: "10px",
              }}
            >
              How It Works Wonderland
            </div>
            <div className="invite-banner">
              <Image
                src={howitworks}
                alt="Invite Banner"
                className="banner-image"
              />
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontStyle: "normal",
                fontSize: "21px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                margin: "10px",
              }}
            >
              Host & Guest Features
            </div>

            <div className="invite-banner">
              <Image
                src={hostandGuest}
                alt="Invite Banner"
                className="banner-image"
              />
            </div>
            <div className="invite-banner">
              <Image
                src={yourcelebration}
                alt="Invite Banner"
                className="banner-image"
              />
            </div>
          </div>

          {showHostLoginModal && (
            <OtpLogin
              setIsModalOpen={() => {
                setShowHostLoginModal(false);
                handleClickCreateInvite();
              }}
            />
          )}
        </>
      )}

      {/* <div className="bottom-nav">
        <div className="nav-item">
          <Image src={eventIcon} alt="Events Icon" className="nav-icon" />
          <span className="nav-text">Events</span>
        </div>
        <Link href={{ pathname: "/chat", query: { id } }}>
          <div className="nav-item">
            <Image src={messageIcon} alt="Message Icon" className="nav-icon" />
            <span className="nav-text">Chats</span>
          </div>
        </Link>
        <div className="nav-item">
          <Image src={servicesIcon} alt="Services Icon" className="nav-icon" />
          <span className="nav-text">Services</span>
        </div>
        <div className="nav-item">
          <Image src={accountIcon} alt="Account Icon" className="nav-icon" />
          <span className="nav-text">Accounts</span>
        </div>
      </div> */}
    </>
  );
};

export default WonderlandLandingPage;
