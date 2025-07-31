"use client";
import React, { useState, useEffect, useRef } from "react";
import "./EventInvitation.css";
import profileImage from "../../assets/Ahmdabad.png"; // Add your own image
// import pr from "../../../../public/sticky.jpeg";import tabIcon1 from "../../../assets/galleryicon.jpg";
import tabIcon1 from "../../assets/galleryicon.jpg";
import tabIcon2 from "../../assets/thankyouicon.png";
import { FaUpload, FaStickyNote } from 'react-icons/fa';
import tabIcon3 from "../../assets/luckdrawicon.jpg";
import dressIcon from "../../assets/dressIcon.jpg";
import StickyImage from "../../assets/sticky5.png";
import { FaCheckCircle, FaUsers } from 'react-icons/fa';
import imageBackground from "../../assets/imageBackground.png";
import imageBackGround from "../../assets/imageBackground.png"
import Image from "next/image";
import { FaCamera, FaRegStickyNote, FaTicketAlt } from "react-icons/fa";
import FloatingEditButton from "../../components/FloatingActionButton/FAB";
import { BASE_URL, IMAGE_UPLOAD } from "../../utils/apiconstants";
import { useRouter } from "next/router";
import axios from "axios";
import OtpLoginPopup from "../../components/OtpLoginPopup";
import html2canvas from "html2canvas";
import LuckyDrawForm from "../lucky-draw/index";
import { MapPin, User, Gift, Wand2, Camera } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // add icons
import {
  faCamera,
  faPen,
  faGift,
  faPersonDress,
} from "@fortawesome/free-solid-svg-icons"; // add icons
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams } from "next/navigation";
import InvitationModal from "@/components/InvitationModal";
import FinalInviteDisplay from "@/components/FinalInviteDisplay";
import GuestListPreview from "@/components/GuestListPreview";
import ThankYouNotePopup from "@/components/ThankYouNotePopup";
import RSVPPopup from "@/components/RSVPPopup";
import GuestRSVPForm from "@/components/GuestRSVPForm";


const InvitationCard = () => {
  const fileInputRef = useRef(null);
  const router = useRouter();
  const { orderid } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);
  const [showFAB, setShowFAB] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");

  const [sendCustomerId, setSendCustomerId] = useState("");
  const [sendCustomerPhoneNumber, setSendCustomerPhoneNumber] = useState("");

  const [eventData, setEventData] = useState([]);
  const [loadingThumbnails, setLoadingThumbnails] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBy, setNoteBy] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const noteRef = useRef(null);

  const searchParams = useSearchParams();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPhoneNumber, setGuestPhoneNumber] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [currentEventId, setCurrentEventId] = useState("");
  const [currentGuestId, setCurrentGuestId] = useState("");

  const [showPopupGuest, setShowPopupGuest] = useState(false);
  const [guestList, setGuestList] = useState([]);
  const [loading, setLoading] = useState(false);
const [wallUploading, setWallUploading] = useState(false);
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyU06csCT5OIJzO3F9VGTjCIli74-k2puAp8AhybJGHPYvyEmuQmJlvPf60wHsy--NGGg/exec"; // no query params


  const [showLuckyDrawPopup, setShowLuckyDrawPopup] = useState(false);

  const [id, setId] = useState(null);
  const [secondId, setSecondId] = useState("");

  const [userType, setUserType] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);


useEffect(() => {
  if (!router.isReady) return;

  const queryId = router.query.id;
  const parts = Array.isArray(queryId) ? queryId : queryId?.split("/");

  if (parts && parts.length >= 2) {
    const eventId = parts[0];
    const userId = parts[1];
    const userType = parts[2]?.toLowerCase() || "";

    setId(eventId);
    setSecondId(userId);
    setUserType(userType);

    const alreadyRSVP = localStorage.getItem(`rsvp_submitted_${eventId}_${userId}`);
    if (alreadyRSVP === "true") {
      setHasSubmitted(true);
    }

    setLoadingUser(false);
  }
}, [router.isReady, router.query.id]);



  const userId = localStorage.getItem("userID");
  console.log(userId, "userid");
  const userPhoneNumber = localStorage.getItem("mobileNumber");
  console.log(userPhoneNumber, "userPhoneNumber");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("isLoggedIn");
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
    // }
  }, []);

  const actions = [
    {
      image: tabIcon1,
      title: "Upload Pictures",
    },
    {
      image: tabIcon2,
      title: "Thank You Note",
    },
    // {
    //   image: tabIcon3,
    //   title: "Lucky Draw",

    // },
  ];
const isHost = userType === "host";

console.log("ishost",isHost);

 // determine from props or state
const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // image: null,
    name: "",
    date: "",
    time: "",
    address: "",
    eventType: "",
    eventTypeSearch: "",
  });
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(BASE_URL + IMAGE_UPLOAD, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      console.log("Image uploaded:", data);
      console.log("Image uploaded2:", data.data);

      setUploadedImage(data.data); // Save response for later use
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Failed to upload image");
    }
  };

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleClosePopup = () => {
    setNoteTitle("");
    setNoteBy("");
    setShowPopup(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleClick = () => {
    router.push('/templates');
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!formData.eventType && formData.eventTypeSearch) {
      formData.eventType = formData.eventTypeSearch;
    }

    const formattedDate = new Date(formData.date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const formattedTime = new Date(
      `1970-01-01T${formData.time}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    console.log(formattedTime, "formattedTime");

    const HostType = "Host";

    const params = new URLSearchParams();
    params.append("name", formData.name);
    params.append("date", formattedDate);
    params.append("time", formattedTime);
    params.append("address", formData.address);
    params.append("selectedImage", selectedImage || "");
    params.append("image", uploadedImage || orderDetails?.Image || "");

    params.append("idd", id);
    params.append("eventType", formData.eventType);
    params.append("hostType", HostType);

    params.append("customerId", userId);
    params.append("customerPhoneNumber", userPhoneNumber);
    console.log("🚀 Submitting:", {
      image: uploadedImage,
      fallbackImage: orderDetails?.Image,
      finalImage: uploadedImage || orderDetails?.Image || "",
    });
    console.log("🚀 Submitting data to Google Sheets:", {
      name: formData.name,
      date: formattedDate,
      time: formattedTime,
      address: formData.address,
      selectedImage,
      uploadedImage,
      id,
      eventType: formData.eventType,
      eventTypeSearch: formData.eventTypeSearch,
      customerId,
      customerPhoneNumber,
    });
    try {
      const response = await fetch(
        `${GOOGLE_SCRIPT_URL}?action=saveOrUpdateEvent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        }
      );

      const result = await response.json();
      console.log("✅ Sheets Response:", result);

//    if (result.idd) {
//   const newEventId = result.idd;
//   const newUserId = userId;
//   const newUserType = "host";

//   // Push new URL to address bar
//   window.history.pushState({}, "", `/wonderland?id=${newEventId}/${newUserId}/${newUserType}`);

//   // Manually update state to reflect new values
//   setId(newEventId);
//   setSecondId(newUserId);
//   setUserType(newUserType); // ✅ ensures isHost becomes true immediately
// }

     if (result.idd && result.idd !== id) {
  const newEventId = result.idd;
  const newUserId = userId;
  const newUserType = "host";

  window.history.pushState({}, "", `/wonderland?id=${newEventId}/${newUserId}/${newUserType}`);
  setId(newEventId);
  setSecondId(newUserId);
  setUserType(newUserType);
}

      setFormData({
        name: "",
        date: "",
        time: "",
        address: "",
        eventType: "",
        eventTypeSearch: "",
      });
      setUploadedImage(null);
      setSelectedImage("");
      setShowModal(false);
      // window.location.reload();
    } catch (error) {
      console.error("❌ Failed to send to Google Sheets:", error);
    }
  };

  useEffect(() => {
    if (orderDetails) {
      const time24h = convertTo24Hour(orderDetails["Time"]);
      const date = new Date(orderDetails["Date"]);
      const isoDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
      let time = orderDetails["Time"];

      setFormData({
        name: orderDetails["Name"] || "",
        date: isoDate,
        time: time24h || "",
        address: orderDetails["Address"] || "",
        eventType: orderDetails["Event Type"] || "",
      });
      setUploadedImage(orderDetails.Image || null);
    }
  }, [orderDetails]);

  useEffect(() => {
    // Show modal if user visits /wonderland (no id in query)
    if (
      window.location.pathname === "/wonderland" &&
      !window.location.search.includes("id=")
    ) {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      console.log(window.location.href);

      console.log(id, "iddd2");

      // if (!orderid) return;
      if (!id) return;

      console.log(id, "idddiid1");

      try {
        const response = await fetch(
          `https://script.google.com/macros/s/AKfycbwkX57cwaJw5DeJsQM3p0BukqMIvrbybUHmT3KBseCnoW6JPP0Swnv3590WyEhdH2Wq4g/exec?action=getByIdd&idd=${id}`
        );

        console.log(response, "response");

        const result = await response.json();
        console.log(result, "ressss");
        if (result.status === "success") {
          console.log("Matched Order Details:", result.data);
          const customerPhone = result.data["Customer Phone Number"];
          const customerId = result.data["Customer ID"];
          console.log("Customer ID11:", customerId);
          console.log("Customer Phone:", customerPhone);
          setSendCustomerId(customerId);
          setSendCustomerPhoneNumber(customerPhone);

          setOrderDetails(result.data);
        } else {
          console.log("Order ID not found in sheet.");
          // setShowFAB(true);
          setShowModal(true);
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
      }
    };

    fetchOrderDetails();
  }, [id]);

  //Format Time
  function convertTo24Hour(time12h) {
    if (!time12h) return "";
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }
  // Format date
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // sheet second fetch data Background_templates
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbwkX57cwaJw5DeJsQM3p0BukqMIvrbybUHmT3KBseCnoW6JPP0Swnv3590WyEhdH2Wq4g/exec"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setImages(data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const eventOptions = [
    "Birthday",
    "Wedding",
    "Anniversary",
    "Engagement",
    "Baby welcome/Baby shower",
    "Haldi-mendani",
    "Bachelorette",
  ];


  const handleActionClick = (title) => {
    if (title === "Upload Pictures") {
      document.getElementById("imageUploadInput").click();
    } else if (title === "Thank You Note") {
      setShowPopup(true);
    } else if (title === "Lucky Draw") {
      setShowLuckyDrawPopup(true);
    }
  };


  const handleImageUpload = async (e) => {
  setUploading(true);
  setWallUploading(true);
  const files = e.target.files;
  if (files.length > 0) {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]); // backend expects "files"
    }

    formData.append("customerId", sendCustomerId);
    formData.append("phoneNo", sendCustomerPhoneNumber);
    formData.append("folderName", id);

    try {
      const res = await fetch(
        "https://horaservices.com:3000/api/photo/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Uploaded:", data);

      if (data?.uploaded && Array.isArray(data.uploaded)) {
        // Update eventData with uploaded images
        const newImages = data.uploaded.map((item) => ({
          type: "image",
          src: item.url, // backend should return this
          alt: item.key || item.filename || "Uploaded image",
        }));

        setEventData((prev) => [...newImages, ...prev]);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
       setWallUploading(false);
    }
  }
};
useEffect(() => {
  const timer = setTimeout(() => {
    fetchThumbnails();
  }, 2000); // shorter delay is fine now

  return () => clearTimeout(timer);
}, [id, sendCustomerId]);

 const fetchThumbnails = async () => {
  try {
    const response = await fetch(
      `https://horaservices.com:3000/api/photo/thumbnailsWithinProject?folderName=${id}&customerId=${sendCustomerId}`
    );
    const data = await response.json();
    const imagesFromAPI = data.thumbnails.map((item) => ({
      type: "image",
      src: item.url,
      alt: item.key,
    }));

    // Merge without duplication
    setEventData((prev) => {
      const apiUrls = imagesFromAPI.map((img) => img.src);
      const nonApiUploads = prev.filter((img) => !apiUrls.includes(img.src));
      return [...nonApiUploads, ...imagesFromAPI.reverse()];
    });
  } catch (error) {
    console.error("Error fetching thumbnails:", error);
  } finally {
    setLoadingThumbnails(false);
  }
};




  const handleDownload = async () => {
    if (noteTitle.trim() === "" || noteBy.trim() === "") {
      setErrorMsg("Please fill all required fields.");
      return;
    }
    setErrorMsg("");

    const canvas = await html2canvas(noteRef.current, {
      backgroundColor: null,
      useCORS: true,
    });

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], "sticky-note.png", {
        type: "image/png",
        lastModified: new Date().getTime(),
      });

      const formData = new FormData();
      formData.append("files", file);
      formData.append("customerId", sendCustomerId);
      formData.append("phoneNo", sendCustomerPhoneNumber);
      formData.append("folderName", id);

      try {
        const response = await fetch(
          "https://horaservices.com:3000/api/photo/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        if (result.success && result.uploaded && result.uploaded[0]?.url) {
          // ✅ Add the uploaded image to eventData so it shows in the UI
          const newImage = {
            type: "image",
            src: result.uploaded[0].url,
            alt: "Thank You Note",
          };
          setEventData((prev) => [newImage, ...prev]);
        }

        setShowPopup(false);
        setNoteTitle("");
        setNoteBy("");
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }, "image/png");
  };

  const charsWithoutSpaces = noteTitle.replace(/\s/g, "").length;

  useEffect(() => {
    if (sendCustomerId && userId && sendCustomerId.trim() === userId.trim()) {
      setShowFAB(true);
    } else {
      setShowFAB(false);
    }
  }, [sendCustomerId, userId]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!userId) return;

    const { id } = router.query;
    if (!id || typeof id !== "string") return;

    const parts = id.split("/");
    const firstPart = parts[0];

    const isHost = String(userId).trim() === String(sendCustomerId).trim();
    const role = isHost ? "host" : "guest";

    // Avoid redirect loop
    if (parts[1] === userId && parts[2] === role) return;

    const newId = `${firstPart}/${userId}/${role}`;
    router.replace(`/wonderland?id=${newId}`);
  }, [router.isReady, router.query.id, userId, sendCustomerId]);

 
 
const handleRSVPSubmit = async ({ name, phoneNumber, status, rsvpId, userId }) => {
  if (!name || !status) {
    alert("Please enter your name and select an option.");
    return;
  }

  const rsvpData = {
    name,
    phoneNumber,
    status,
    hostType: "Guest",
    eventId: rsvpId,
    userId: userId,
  };

  try {
    await fetch(`${GOOGLE_SCRIPT_URL}?action=updateGuestStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(rsvpData),
    });

    alert("Thank you! Your response has been submitted.");
  } catch (error) {
    console.error("RSVP submission failed:", error);
    alert("An error occurred while submitting your response.");
  }
};


  const fetchGuests = async (showPopup = false) => {
  setLoading(true);
  try {
    const res = await axios.get(
      "https://script.google.com/macros/s/AKfycbz5_pOpOi7tfRnvBNUMtNuayZ3_Jdw27l5cmohLKx7GlknqePtKxD8TW87Hlz4dgbu6Dw/exec",
      {
        params: { action: "getAssociateIdd", idd: id },
      }
    );

    if (res.data.status === "success") {
      const guests = res.data.data.filter((row) => row[10] === "Guest");
      setGuestList(
        guests.map((row) => ({
          name: row[0],
          status: row[11] || "N/A",
        }))
      );

      if (showPopup) {
        setShowPopupGuest(true); // ✅ Only open when asked
      }
    }
  } catch (err) {
    alert("Error fetching data");
  } finally {
    setLoading(false);
  }
};

const isGuest = userType === "guest";

  const openFileInput = () => document.getElementById('imageUploadInput')?.click();

  return (
    <>
      {!isLoggedIn ? (
        // If user is NOT logged in
        <div className="no-orders">
          <h2 className="no-record-heading">
            Please log in to check all your orders.
          </h2>
          <OtpLoginPopup setIsModalOpen={setIsModalOpen} />
        </div>
      ) : (

        <>
          <div
            className="invitation-container relative  flex flex-col items-center justify-center;"
            style={{
              backgroundImage: orderDetails?.Template
                ? `url(https://horaservices.com/api/uploads/${orderDetails.Template})`
                : `url(${imageBackGround.src})`,
              backgroundSize: "100%",
              backgroundPosition: "center",
            }}
          >
            {showFAB && <FloatingEditButton onClick={handleEdit} />}
            {orderDetails ? (
              <>
                <FinalInviteDisplay orderDetails={orderDetails} handleClick={handleClick} />
           

 {isHost ? (
      <GuestListPreview
        guestList={guestList}
        loading={loading}
        fetchGuests={fetchGuests}
        userType={userType}
      />
    ) : hasSubmitted ? (
      <GuestListPreview
        guestList={guestList}
        loading={loading}
        fetchGuests={fetchGuests}
        userType={userType}
      />
    ) : (

  
<GuestRSVPForm
  userType={userType}
  guestList={guestList}
  loading={loading}
  userId={secondId}
  rsvpId={id}
  fetchGuests={fetchGuests}
  hasSubmitted={hasSubmitted}
  setHasSubmitted={setHasSubmitted}
  onSubmit={(data) => {
    const payload = {
      ...data,
      rsvpId: id,
      userId: secondId,
    };

    handleRSVPSubmit(payload); // send full data to Google Sheet
    localStorage.setItem(`rsvp_submitted_${id}_${secondId}`, "true");
    setHasSubmitted(true); // lift state to show RSVP done
  }}
/>


    )}




                {/* {showPopup && <div className="overlay"></div>} */}
                {showPopup && (
                  <ThankYouNotePopup
                    noteTitle={noteTitle}
                    setNoteTitle={setNoteTitle}
                    noteBy={noteBy}
                    setNoteBy={setNoteBy}
                    errorMsg={errorMsg}
                    setErrorMsg={setErrorMsg}
                    handleDownload={handleDownload}
                    handleClosePopup={handleClosePopup}
                    noteRef={noteRef}
                  />
                )}
              </>

            ) : (
              <p>Loading...</p>
            )}

          </div>

      

       

    <div style={styles.wrapper}>
            <h2 style={styles.heading}>📸 Celebration Wall</h2>
            <p style={styles.subheading}>
              A wall filled with your party’s happiest moments and heartfelt messages.
            </p>



           <div className="tabs-container" style={styles.tabsContainer}>
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              if (action.title === "Upload Pictures") {
                const input = document.getElementById("imageUploadInput");
                if (input) {
                  input.value = ""; // Reset to allow re-upload of same files
                  input.click();
                }
              } else {
                handleActionClick(action.title);
              }
            }}
            style={styles.actionButton}
          >
            <Image src={action.image} alt={action.title} style={styles.iconStyle} />
            <span style={styles.buttonLabel}>{action.title}</span>
          </button>
        ))}

        {/* ✅ Hidden file input */}
        <input
          type="file"
          id="imageUploadInput"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
      </div>

   

<div style={{ position: "relative" }}>

  {wallUploading && (
    <div style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(255, 255, 255, 0.8)",
      display: "flex",
      // alignItems: "center",
      justifyContent: "center",
      zIndex: 2
    }}>
      <div className="spinner" /> {/* You can style this below */}
    </div>
  )}

  {/* Image Wall */}
  <div className="event-grid" style={{ opacity: wallUploading ? 0.5 : 1 }}>
    {eventData.map((item, index) => (
      <div key={index}>
        {item.type === "image" ? (
          <img
            src={item.src}
            alt={item.alt}
            className="event-image"
            onLoad={(e) => e.currentTarget.classList.add("loaded")}
          />
        ) : (
          <div
            className="event-text"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        )}
      </div>
    ))}
  </div>
</div>

          </div>

          {showLuckyDrawPopup && (
            <div
              className="popup-luckdraw-overlay"
              onClick={() => setShowLuckyDrawPopup(false)}
            >
              <div
                className="popup-luckdraw-container"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="popup-luckdraw-close"
                  onClick={() => setShowLuckyDrawPopup(false)}
                >
                  ×
                </button>
                <div className="popup-luckdraw-content">
                  <LuckyDrawForm
                    onClose={() => setShowLuckyDrawPopup(false)}
                  />
                </div>
              </div>
            </div>
          )}


          {showModal && (
            <InvitationModal
              showModal={showModal}
              handleClose={handleClose}
              handleSave={handleSave}
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              handleImageChange={handleImageChange}
              uploadedImage={uploadedImage}
              eventOptions={eventOptions}
              fileInputRef={fileInputRef}
              orderDetails={orderDetails}
              imageBackground={imageBackground}
            />
          )}


        </>
      )}
      

      {showPopupGuest && (
        <>
          <div style={styles.backdrop} onClick={() => setShowPopupGuest(false)} />

          <RSVPPopup guestList={guestList} onClose={() => setShowPopupGuest(false)} />

        </>
      )}



    </>
  );
};

const styles = {
  cardWrapper: {
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    margin: "auto",
    border: "2px solid #e0e0e0",
    width: "95%",
  },
  cardTitle: {
    fontSize: "20px",
    color: "#6b21a8",
    marginBottom: "15px",
  },
  nameRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "#333",
    marginBottom: "15px",
  },
  viewListButton: {
    backgroundColor: "#a54c93",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "5px 30px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popupCard: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",

  },
  formField: {
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "6px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  submitButton: {
    backgroundColor: "#0070f3",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #e0c3fc, #8ec5fc)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },

  button: {
    backgroundColor: "#6b21a8",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "background-color 0.3s ease",
  },
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.3)",
    zIndex: 999,
  },
  popupGuest: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "24px",
    width: "300px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
  popupTitle: {
    textAlign: "center",
    color: "#924c9d",
    fontSize: "20px",
    marginBottom: "16px",
    fontWeight: "bold",
  },
  section: {
    marginBottom: "16px",
  },
  sectionTitleGreen: {
    fontWeight: "bold",
    color: "green",
    marginBottom: "6px",
  },
  sectionTitleGray: {
    fontWeight: "bold",
    color: "#444",
    marginBottom: "6px",
  },
  guestRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    fontSize: "15px",
    color: "#333",
  },
  check: {
    color: "green",
    fontSize: "16px",
  },
  dash: {
    fontSize: "16px",
    color: "#777",
  },
  closeBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "8px",
    backgroundColor: "#924c9d",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  wrapper: {
    padding: 20,
    fontFamily: 'sans-serif',
    maxWidth: 500,
    margin: '0 auto',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#a8328e',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  buttonRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#a8328e',
    color: '#fff',
    border: 'none',
    padding: '10px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
  },
  uploading: {
    fontSize: 13,
    color: '#444',
    marginBottom: 10,
  },
  loading: {
    fontSize: 15,
    fontWeight: 500,
    textAlign: 'center',
    marginTop: 40,
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 8,
  },
  imageBox: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    display: 'block',
  },

  tabsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 16,
    flexWrap: "wrap",
    marginTop: 20,
  },

  actionButton: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "linear-gradient(to right, #6b21a8, #9333ea)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    minWidth: 160,
    justifyContent: "center",
  },

  iconStyle: {
    width: 20,
    height: 20,
    objectFit: "contain",
  },

  buttonLabel: {
    lineHeight: 1.2,
    textAlign: "left",
  },
};
   {/* Basic CSS */}
          // <style jsx>{`
          //     .overlay {
          //       position: fixed;
          //       top: 0;
          //       left: 0;
          //       width: 100vw;
          //       height: 100vh;
          //       background-color: rgba(0, 0, 0, 0.2);
          //       backdrop-filter: blur(6px);
          //       -webkit-backdrop-filter: blur(6px);
          //       z-index: 1000;
          //       pointer-events: all;
          //     }

          //     .popup {
          //       position: fixed;
          //       top: 35%;
          //       left: 50%;
          //       transform: translate(-50%, -25%);
          //       background: white;
          //       border: 1px solid #ccc;
          //       padding: 24px;
          //       border-radius: 12px;
          //       z-index: 1500;
          //       background-color: rgb(238, 233, 240);
          //       width: 95%;
          //       max-width: 420px;
          //       display: flex;
          //       flex-direction: column;
          //       height: 80%;
          //       border: 2px solid purple;
          //     }

          //     .title {
          //       margin-top: 25px;
          //       text-align: center;
          //       font-size: 28px;
          //       font-weight: bold;
          //       color: rgb(146, 82, 170);
          //       margin-bottom: 24px;
          //     }

          //     .subtitlePopUp {
          //       text-align: center;
          //       font-size: 20px;
          //       color: #444;
          //       // margin-top: 12px;
          //     }

          //     .form-group {
          //       display: flex;
          //       flex-direction: column;
          //       margin-top: 12px;
          //     }

          //     .label {
          //       font-size: 14px;
          //       font-weight: 500;
          //       margin-bottom: 6px;
          //       color: #333;
          //     }

          //     .popup textarea {
          //       background: white;
          //       color: black;
          //       border: 1px solid purple;
          //       resize: none;
          //       padding: 10px;
          //       border-radius: 8px;
          //       font-size: 14px;
          //     }

          //     .popup input {
          //       background: white;
          //       color: black;
          //       padding: 10px;
          //       border: 1px solid rebeccapurple;
          //       border-radius: 8px;
          //       font-size: 14px;
          //     }

          //     .word-limit {
          //       text-align: right;
          //       font-size: 12px;
          //       color: #888;
          //       margin-top: 4px;
          //     }

          //     .popup-buttons {
          //       display: flex;
          //       justify-content: center;
          //       gap: 10px;
          //       margin-top: 20px;
          //     }

          //     .popup button {
          //       padding: 8px 18px;
          //       border: none;
          //       background: rgb(146, 82, 170);
          //       color: white;
          //       border-radius: 6px;
          //       font-weight: 500;
          //       cursor: pointer;
          //     }
          //   `}</style>
export default InvitationCard;
