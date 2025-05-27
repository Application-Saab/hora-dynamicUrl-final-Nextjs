"use client";
import React, { useState, useEffect, useRef } from "react";
import "./EventInvitation.css";
import profileImage from "../../../assets/Ahmdabad.png"; // Add your own image

// import pr from "../../../../public/sticky.jpeg";
import Image from "next/image";
import { FaCamera, FaRegStickyNote, FaTicketAlt } from "react-icons/fa";
import FloatingEditButton from "../../../components/FloatingActionButton/FAB";
import { BASE_URL, IMAGE_UPLOAD } from "../../../utils/apiconstants";
import { useRouter } from "next/router";
import axios from "axios";
import OtpLoginPopup from "../../../components/OtpLoginPopup";
import html2canvas from "html2canvas";
import LuckyDrawForm from "../../lucky-draw/index";
import { MapPin, User, Gift, Wand2, Camera } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // add icons
import { faCamera, faPen, faGift, faPersonDress } from '@fortawesome/free-solid-svg-icons';// add icons
import "react-datepicker/dist/react-datepicker.css";

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
  const noteRef = useRef(null);

  // const [showPopup, setShowPopup] = useState(false);
  const [showLuckyDrawPopup, setShowLuckyDrawPopup] = useState(false);

  useEffect(() => {
    if (!orderid) return;

    
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.post(
          "https://horaservices.com:3000/api/admin/adminOrderList",
          {
            order_id: Number(orderid),
            page: 1,
            per_page: 1,
          }
        );

        console.log("API response:", response.data);

        const order = response?.data?.data?.order?.[0];
        console.log(order, "order123");
        const fromId = order?.fromId;
        const userId = localStorage.getItem("userID");
        console.log("From ID:", fromId);
        console.log("User ID:", userId);
        const customerPhoneNo = order.phone_no;
        setCustomerId(fromId);
        setCustomerPhoneNumber(customerPhoneNo);

     if (fromId && userId && fromId.trim() === userId.trim()) {
  setShowFAB(true);
} else {
  setShowFAB(false);
}

      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchOrderDetails();
  }, [orderid]);

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
      image: "/galleryicon.jpg",
      titleTop: "Upload &",
      titleBottom: "Share Pictures",
      subtitle: "Add photos taken at the party",
    },
    {
      image: "/thankyouicon.png",
      titleTop: "Thank You",
      titleBottom: "Note",
      subtitle: "Leave a message for the host",
    },
    {
      image: "/luckdrawicon.jpg",
      titleTop: "Lucky Draw",
      titleBottom: "",
      subtitle: "Try your luck and win!",
    },
  ];


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



  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    }
     else {
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

    const params = new URLSearchParams();
    params.append("name", formData.name);
    params.append("date", formattedDate);
    params.append("time", formattedTime);
    params.append("address", formData.address);
    params.append("selectedImage", selectedImage || "");
     params.append("image", uploadedImage || orderDetails?.Image || "");

    params.append("orderid", orderid);
    params.append("eventType", formData.eventType);

   
    params.append("customerId", customerId);
    params.append("customerPhoneNumber", customerPhoneNumber);
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
      orderid,
      eventType: formData.eventType,
      eventTypeSearch: formData.eventTypeSearch,
      customerId,
      customerPhoneNumber,
    });

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxFOyIwe8f3B0jSeyeyYnBKRCXmxnMmcAG84yNzXHshet2WOQkDVIL0Aq1cjW9Lj63vbw/exec",
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

      // Clear form & selections
      setFormData({ name: "", date: "", time: "", address: "", eventType: "", eventTypeSearch: "", });
      setUploadedImage(null);
      setSelectedImage("");
      setShowModal(false);
       window.location.reload();
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
      name: orderDetails["Name"] || '',
      date: isoDate,
      time: time24h || '',
      address: orderDetails["Address"] || '',
       eventType: orderDetails["Event Type"] || '',
    });setUploadedImage(orderDetails.Image || null);
  }
}, [orderDetails]);


  useEffect(() => {
const fetchOrderDetails = async () => {
      if (!orderid) return;
    
      try {
        const response = await fetch(
          `https://script.google.com/macros/s/AKfycbyqVoYkcUl-iWAOx1_G16_AkJVXs4_EDQWmwf0z6Q5ZarLsYyjEhrt1IvAepsrckdgqaw/exec?orderid=${orderid}`
        );

        const result = await response.json();
        if (result.status === "success") {
          console.log("Matched Order Details:", result.data);
          const customerPhone = result.data["Customer Phone Number"];
          const customerId = result.data["Customer ID"];
          console.log("Customer ID:", customerId);
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
  }, [orderid]);

 //Format Time
  function convertTo24Hour(time12h) {
  if (!time12h) return "";
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
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
      "https://script.google.com/macros/s/AKfycbyuH7I4TpYROjUiV_9CssCgMIlvLrNTCpy4w54ug8wMmsmrZKS8VR7ZKnM0_LSAaTqC3g/exec"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setImages(data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);
  const eventOptions = [
    "Birthday", "Wedding", "Anniversary", "Graduation", "Baby Shower", "Engagement", "anniversary", "baby welcome/baby shower", "haldi-mendani", "bachelorette"
  ];
  const handleActionClick = (title) => {
    if (title === "Upload &") {
      document.getElementById("imageUploadInput").click();
    } else if (title === "Thank You") {
      setShowPopup(true);
    } else if (title === "Lucky Draw") {
      setShowLuckyDrawPopup(true);
    }
  };

  const handleImageUpload = async (e) => {
    setUploading(true);
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("customerId", sendCustomerId);
      formData.append("phoneNo", sendCustomerPhoneNumber);
      formData.append("folderName", orderid);

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

        window.location.reload();
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setUploading(false);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {

      const fetchThumbnails = async () => {
        try {
          const response = await fetch(
            `https://horaservices.com:3000/api/photo/thumbnailsWithinProject?folderName=${orderid}&customerId=${customerId}`
          );
          const data = await response.json();
          const images = data.thumbnails.map((item) => ({
            type: "image",
            src: item.url,
            alt: item.key,
          }));
          setEventData(images);
        } catch (error) {
          console.error("Error fetching thumbnails:", error);
        } finally {
          setLoadingThumbnails(false);
        }
      };

      fetchThumbnails();
    }, 5000); // 5 second delay

    return () => clearTimeout(timer);
  }, [orderid, customerId]);

  const handleDownload = async () => {
    const canvas = await html2canvas(noteRef.current, {
      backgroundColor: null,
      useCORS: true,
    });

    // Convert canvas to Blob instead of DataURL
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      // Convert Blob to File 👇
      const file = new File([blob], "sticky-note.png", {
        type: "image/png",
        lastModified: new Date().getTime(),
      });

      // Create FormData and append File
      const formData = new FormData();
      formData.append("files", file); // matches your upload key: "files"
      formData.append("customerId", sendCustomerId);
      formData.append("phoneNo", sendCustomerPhoneNumber);
      formData.append("folderName", orderid);

      try {
        const response = await fetch(
          "https://horaservices.com:3000/api/photo/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        console.log("Upload result:", result);
        window.location.reload();
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }, "image/png");
  };

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
        // If user IS logged in, show the full invitation UI
        <>
          <div
            className="invitation-container relative  flex flex-col items-center justify-center;"
            
            style={{
              backgroundImage: orderDetails?.Template
                ? `url(https://horaservices.com/api/uploads/${orderDetails.Template})`
                // : `url('/background-image.jpg')`,
                : `url('/pastel-purpleBallons.webp')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
               <FloatingEditButton onClick={handleEdit}    /> 
            <div className="invite-wrapper">
              
            
              <div className="overlay-content bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-4 max-w-2xl w-full text-center">

              
             
                {orderDetails ? (
                  <>
                  
           
                    <h1 className="invitation-title text-3xl font-bold mb-4">
                      You’re invited to join us for the
                    </h1>

                    <div className="profile-container flex justify-center mb-4">
                      <div className="profile-image w-36 h-36 rounded-full overflow-hidden border-4 border-pink-300 shadow-md">
                        <img
                          src={`https://horaservices.com/api/uploads/${orderDetails.Image}`}
                          alt={orderDetails.Name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <h2 className="subtitle text-2xl font-semibold text-pink-600 mb-2">
                      {orderDetails["Event Type"] || "Celebration"} Celebration of {orderDetails.Name || "Someone Special"}
                    </h2>

                    <p className="event-info text-gray-700 mb-1">
                      📅 {formatDate(orderDetails.Date)} at 🕒 {orderDetails.Time}
                    </p>

                    <p className="event-info text-gray-700 mb-4">
                      📍 Venue: <span className="venue-highlight font-medium text-pink-600">{orderDetails.Address || "Venue Details"}</span>
                    </p>

                    <div className="info-card">
                      <div className="info-card-title ">
                        <img
                          src="/photo.jpg"
                          alt="Dress Code"
                          className=" object-contain"
                        />
                        <span className="info-card-text text-sm">Fairy-tale attire</span>
                      </div>
                    </div>



                    <p className="waiting-text text-gray-600 mb-4">
                      We look forward to celebrating this special day with you!
                    </p>

                    <button className="rsvp-button bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition">
                      I'm Coming!
                    </button>
                    <div className="tabs-container" style={{ width: '100%', marginTop: 20, display: 'flex', justifyContent: 'space-between', gap: 2, marginleft: 20 }}>

                      {actions.map((action, index) => (
                        <div className="tab-container">
                          <div
                            key={index}
                            onClick={() => handleActionClick(action.titleTop)}
                            className="tab-item"

                          >
                            <img
                              src={action.image}
                              alt={`${action.titleTop} ${action.titleBottom}`}
                              style={{ width: 50, height: 50, borderRadius: 6, objectFit: 'cover' }}
                            />
                            <div style={{ fontSize: 14, lineHeight: 1.2 }}>
                              {action.titleTop}<br />{action.titleBottom}
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                    <div>
                      {/* Hidden File Input for Upload */}
                      <input
                        type="file"
                        accept="image/*"
                        id="imageUploadInput"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />

                      {uploading && <p>Uploading image, please wait...</p>}

                      {/* Action Cards */}


                      {showPopup && <div className="overlay"></div>}
                      {showPopup && (
                        <div className="popup">
                          <h2 style={{ color: " rgb(146, 82, 170)" }}>Leave a Thank You Note</h2>
                          <input
                            type="text"
                            placeholder="Title"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="By"
                            value={noteBy}
                            onChange={(e) => setNoteBy(e.target.value)}
                          />
                          <div className="popup-buttons">
                            <button onClick={handleDownload}>Save</button>
                            <button onClick={() => setShowPopup(false)}>Cancel</button>
                          </div>
                        </div>
                      )}

                      {/* Basic CSS */}
                      <style jsx>{`
                



                  .popup {
                    position: fixed;
                    top: 42%;
                    left: 50%;
                    transform: translate(-50%, -25%);
                   background: white;
                   border: 1px solid #ccc;
                   padding: 24px;
                   border-radius: 8px;
                   z-index: 1000;
                   box-shadow: 0 0 10px rgba(0, 0, 0, .1);
                   width: 95%;
                  // height: 100%;
                 }

                 .popup input {
                  display: block;
                   width: 100%;
                  padding: 8px;
                  margin-top: 10px;
                 margin-bottom: 12px;
                 border: 1px solid rebeccapurple;
                 border-radius: 10px;
                 background-color: white;
                   }

                .popup-buttons {
                  display: flex;
                  justify-content: flex-end;
                  gap: 10px;
                }

                .popup button {
                  padding: 8px 16px;
                  border: none;
                  background: rgb(146, 82, 170);
                  color: white;
                  border-radius: 4px;
                  cursor: pointer;
                }

                .popup button:last-child {
                  background: #6c757d;}`
                      }</style>
                    </div>

                  </>
                ) : (
                  <p >Loading...</p>
                )}
              </div>
            </div>


            <div className="event-wall">
              <h1 className="event-heading">Event Wall</h1>

              {loadingThumbnails ? (

                <div className="loader">Loading thumbnails...</div>
              ) : (
                <div className="event-grid">
                  {eventData.map((item, index) =>
                    item.type === "image" ? (
                      <img
                        key={index}
                        src={item.src}
                        alt={item.alt}
                        className="event-image"
                      />
                    ) : (
                      <div
                        key={index}
                        className="event-text"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                    )
                  )}
                </div>
              )}
            </div>



            <div style={{ textAlign: "center", marginTop: 30 }}>
              <div
                ref={noteRef}
                style={{
                  width: "300px",
                  height: "300px",
                  position: "relative",
                  margin: "0",
                  padding: "0",
                  overflow: "hidden",
                  backgroundColor: "transparent",
                  position: "absolute",
                  left: "-9999px",
                  top: "-9999px",
                }}
              >
                {/* Render image as actual DOM element */}
                <img
                  src={`${window.location.origin}/sticky5.png`}
                  alt="Sticky Note"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 0,
                    // display: "none",
                    overflow: "hidden",
                  }}
                />

                {/* Centered text */}
                <div
                  style={{
                    position: "absolute",
                    top: "45%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontWeight: "bold",
                    fontSize: "35px",
                    color: "black",
                    textAlign: "center",
                    fontFamily: "Arial, sans-serif",
                    zIndex: 1,
                  }}
                >
                  {noteTitle}
                </div>

                {/* Bottom right signature */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 57,
                    right: 70,
                    fontWeight: "bold",
                    fontSize: "20px",
                    color: "#000",
                    fontFamily: "Arial, sans-serif",
                    zIndex: 1,
                  }}
                >
                  - {noteBy}
                </div>
              </div>
            </div>

            {/* Lucky Draw Popup */}
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
              <div className="modal-overlay">
                <div
                  className="modal-content"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modalTitle"
                >
                  <h2 id="modalTitle">Create Event Invite</h2>

                  <p className="invite-text" style={{ userSelect: "none" }}>
                    🌟 A day of joy, a heart full of cheer, <br />
                    The people we love, we wish to have near.
                  </p>

                  <p className="invite-text">
                    So please come join us in celebrating
                    {/* Searchable Dropdown for Event Type */}
                    <div
                      style={{
                        margin: "10px 0",
                        position: "relative",
                        width: "70%",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >


  

                <input
  type="text"
  placeholder="Event type..."
  value={formData.eventTypeSearch ?? formData.eventType ?? ""}
  onChange={(e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      eventTypeSearch: value,
      eventType: value, // <-- IMPORTANT: sync both
    }));
    setShowDropdown(true);
  }}
  onFocus={() => setShowDropdown(true)}
  autoComplete="off"
  className="underline-input"
/>


                      {showDropdown && formData.eventTypeSearch && (
                        <ul
                          style={{
                            position: "absolute",
                            top: "38px",
                            left: 0,
                            right: 0,
                            maxHeight: "120px",
                            overflowY: "auto",
                            background: "white",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            listStyleType: "none",
                            margin: 0,
                            padding: 0,
                            zIndex: 1000,
                          }}
                        >
                          {eventOptions
                            .filter((opt) =>
                              opt.toLowerCase().includes(formData.eventTypeSearch.toLowerCase())
                            )
                            .map((opt) => (
                              <li
                                key={opt}
                                style={{
                                  padding: "8px",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #eee",
                                }}
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    eventType: opt,
                                    eventTypeSearch: opt,
                                  }));
                                  setShowDropdown(false); // hide dropdown on select
                                }}
                              >
                                {opt}
                              </li>
                            ))}

                          {eventOptions.filter((opt) =>
                            opt.toLowerCase().includes(formData.eventTypeSearch.toLowerCase())
                          ).length === 0 && (
                              <li style={{ padding: "8px", color: "#888" }}>No results found</li>
                            )}
                        </ul>
                      )}
                    </div>
                       </p>


                  <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginLeft: "70px" }}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Host Name"
                      className="underline-input "
                      style={{ minWidth: "100px", textAlign: "centre", }}
                    />
                    <span>’s</span>
                  </div>
                  <p className="invite-text">
                    on{' '}
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="underline-input date-input"
                    />
                    {' '}
                    at{' '}
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="underline-input time-input"
                    />{' '}
                    at{' '}
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Venue"
                      className="underline-input address-input"
                    />
                  </p>
                  <label className="block text-[#4c1d95] text-sm">
                    {/* Upload Image: */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </label>
      {(uploadedImage || orderDetails?.Image) && (
      <div>
      
        <img
          src={`https://horaservices.com/api/uploads/${uploadedImage || orderDetails.Image}`}
          alt="Preview"
          style={{ width: "100px",height: "100px", borderRadius: "8px", marginTop: "10px" }}
        />
      </div>
    )}
   


                  <p className="invite-text" style={{ marginTop: "1rem" }}>
                    because happiness means more when shared with you.
                  </p>

                  <div className="modal-actions">
                    <button className="close-btn" onClick={handleClose} type="button">
                      Cancel
                    </button>
                    <button className="save-btn" onClick={handleSave} type="button">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default InvitationCard;