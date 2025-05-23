"use client";
import React, { useState, useEffect } from "react";
import "./EventInvitation.css";
import profileImage from "../../../assets/Ahmdabad.png"; // Add your own image
import Image from "next/image";
import FloatingEditButton from "../../../components/FloatingActionButton/FAB";
import { BASE_URL, IMAGE_UPLOAD } from "../../../utils/apiconstants";
import { useRouter } from "next/router";
import axios from "axios";
import OtpLoginPopup from "../../../components/OtpLoginPopup";
import { MapPin, User, Gift, Wand2, Camera } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // add icons
import { faCamera, faPen, faGift ,faPersonDress } from '@fortawesome/free-solid-svg-icons';// add icons
import WanderlandTabSection from "../../../components/WanderlandTabs/WanderlandTabSection";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InvitationCard = () => {
  const router = useRouter();
  const { orderid } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);
  const [showFAB, setShowFAB] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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
        const fromId = order?.fromId;
        const userId = localStorage.getItem("userID");
        console.log("From ID:", fromId);
        console.log("User ID:", userId);

        if (fromId && userId && fromId === userId) {
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
        // setShowModal(false);
      }
    };
    checkAuth();
    // }
  }, []);


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

      setUploadedImage(data.data);
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
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
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
    params.append("image", uploadedImage || "");
    params.append("orderid", orderid);
    params.append("eventType", formData.eventType);


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
    });

    try {
      const response = await fetch(
        " https://script.google.com/macros/s/AKfycbyaBqKt-f0yly3fKrzTEG6mJA8DugAUzpXLIS_mFHs85X-nMj-WSwFDqbqAJWmoBxFZJQ/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        }
      );

      const result = await response.json();
      window.location.reload();

      // Clear form & selections
      setFormData({ name: "", date: "", time: "", address: "", eventType: "", eventTypeSearch: "", });
      setUploadedImage(null);
      setSelectedImage("");
      setShowModal(false);
    } catch (error) {
      console.error("❌ Failed to send to Google Sheets:", error);
    }
  };

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
    "Birthday", "Wedding", "Anniversary", "Graduation", "Baby Shower", "Other"
  ];



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
    className="invitation-container relative min-h-screen flex flex-col items-center justify-center"
    style={{
      backgroundImage: orderDetails?.Template
        ? `url(https://horaservices.com/api/uploads/${orderDetails.Template})`
        : `url('/background-image.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {showFAB && <FloatingEditButton onClick={handleEdit} />}

    {/* Overlay Container */}
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
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>

    {/* Tabs */}
    <div className="tabs-container">
      <div className="tab-box">
        <div className="icon-and-text">
          <FontAwesomeIcon icon={faCamera} size="2x" className="tab-icon" />
          <span className="upload-text">Upload Image</span>
        </div>
        <div className="tab-text">
          <div className="tab-desc">Add photos taken at the party</div>
        </div>
      </div>

      <div className="tab-box">
        <div className="icon-and-text">
          <FontAwesomeIcon icon={faPen} size="2x" className="tab-icon" />
          <span className="upload-text">Thank You Note</span>
        </div>
        <div className="tab-text">
          <div className="tab-desc">Leave a message for the host</div>
        </div>
      </div>

      <div className="tab-box">
        <div className="icon-and-text">
          <FontAwesomeIcon icon={faGift} size="2x" className="tab-icon" />
          <span className="upload-text">Try Your Luck!</span>
        </div>
        <div className="tab-text">
          <div className="tab-desc">Try your luck and win!</div>
        </div>
      </div>
    </div>

  </div>
</>
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
                  value={formData.eventTypeSearch || ""}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      eventTypeSearch: e.target.value,
                    }));
                    setShowDropdown(true); // show dropdown on typing
                  }}
                  onFocus={() => setShowDropdown(true)} // show dropdown on focus
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
             <label  className="block text-black px-4 ">
              Upload Image:
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
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
    </>
  );
};

export default InvitationCard;
