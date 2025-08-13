import React, { useEffect, useState } from "react";
import "./WonderlandLandingPage.css";
import { useRouter } from "next/router";
import CreateInviteModal from "./create-invite/CreateEventInvite";
import { BASE_URL } from "@/utils/apiconstants";
import OtpLoginPopup from "@/components/OtpLoginPopup";

const WonderlandLandingPage = ({ userId, slug }) => {
  const router = useRouter();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const [isUerLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    setIsUserLoggedIn(isLoggedIn);
  }, [isLoggedIn, isModalOpen]);
  const { page } = router.query;
  const token = localStorage.getItem("token");
  const USER_ID = localStorage.getItem("userID");

  const handleClickCreateInvite = async () => {
    try {
      const payload = {
        userId: userId || "", // prop se userId
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

  useEffect(() => {
    if (isUerLoggedIn && USER_ID && slug?.length === 0) {
      router.replace(`/wonderland/${USER_ID}`);
    }
  }, [slug, USER_ID, isUerLoggedIn]);

  useEffect(() => {
    const checkAuth = () => {
      if (isLoggedIn !== "true") {
        setIsModalOpen(true);
        setShowModal(false);
      } else {
        setIsModalOpen(false);
      }
    };
    checkAuth();
  }, []);

  // useEffect(() => {
  //   if (!isUerLoggedIn && slug?.length <= 2) {
  //     router.replace("/wonderland");
  //   }
  // }, [isUerLoggedIn, slug]);

  return (
    <>
      {!isLoggedIn &&
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
          <div>Wonderland User Specific Page for Id : {userId}</div>
          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleClickCreateInvite}
            >
              Create Invite
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WonderlandLandingPage;
