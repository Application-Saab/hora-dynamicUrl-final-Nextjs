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
import { faCamera, faPen, faGift } from '@fortawesome/free-solid-svg-icons';// add icons
import WanderlandTabSection from "../../../components/WanderlandTabs/WanderlandTabSection";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const InvitationCard = () => {
  const router = useRouter();
  const { orderid } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);
  const [showFAB, setShowFAB] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");


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
      } else {
        setIsModalOpen(false);
      }
    };
    checkAuth();
    // }
  }, []);

  const [showModal, setShowModal] = useState(true

  );
  const [formData, setFormData] = useState({
    // image: null,
    name: "",
    date: "",
    time: "",
    address: "",
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

    console.log("🚀 Submitting data to Google Sheets:", {
      name: formData.name,
      date: formattedDate,
      time: formattedTime,
      address: formData.address,
      selectedImage,
      uploadedImage,
      orderid,
    });

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyzPu0fLxFYhDJiCTJUNrbIUAXeGt-W94K8jh6HrgCIur5wc0lAB0ASSollfMP2X0p7pQ/exec",
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
      setFormData({ name: "", date: "", time: "", address: "" });
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
            className="invitation-container"
            style={{
              backgroundImage: orderDetails?.Template
                ? `url(https://horaservices.com/api/uploads/${orderDetails.Template})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {showFAB && <FloatingEditButton onClick={handleEdit} />}
            {orderDetails ? (
              <>
                {/* Profile Image */}
                <div className="profile-container">
                  <div className="profile-image">
                    <img
                      src={`https://horaservices.com/api/uploads/${orderDetails.Image}`}
                      alt="Host"
                    />
                  </div>
                  <h2 className="profile-name">{orderDetails.Name}</h2>
                </div>

                {/* Invitation Title */}
                <div className="invitation-title">
                  <h1>
                    You're Invited to a <br />
                    Celebration of Magic & Memories!
                  </h1>
                </div>


                {/* Event Details Card */}
                <div className="event-details-card">
                  <div className="event-location">
                    <MapPin className="icon" size={20} />
                    <span className="event-location-text">
                      {orderDetails.Address}
                    </span>
                    <span className="event-time">
                      {formatDate(orderDetails.Date)} | {orderDetails.Time}
                    </span>
                  </div>
                  <div className="event-divider">
                    <div className="event-description">
                      <User className="icon" size={20} />
                      <span className="event-description-text">
                        {orderDetails.Name}'s Birthday    {/* add dynamic name */}
                      </span>
                    </div>
                  </div>
                </div>


              </>
            ) : (
              <p>Loading...</p>
            )}

            {/* RSVP Button */}
            <button className="rsvp-button">I'm Coming!</button>

            <p className="waiting-text">We can't wait to see you</p>

            {/* Additional Info Grid */}
            <div className="info-grid">

              <div className="info-card full-width">
                <div className="info-card-title">
                  <Wand2 size={20} style={{ marginRight: "2px" }} />
                  <h3>Theme & Dress Code</h3>
                </div>
                <p className="info-card-text">Fairy-tale attire</p>
              </div>
            </div>



            {/* tabs container */}
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

            {/* 
<WanderlandTabSection /> */}




            {/* Footer Buttons */}
            <div className="footer-buttons">
              <button className="footer-button">
                <MapPin size={20} style={{ marginRight: "8px" }} />
                <span>Open in Google Maps</span>
              </button>
              <button className="footer-button">
                <Camera size={20} style={{ marginRight: "8px" }} />
                <span>Upload Photos</span>
              </button>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Details</h2>

            {/* Image selection area */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
                flexWrap: "wrap",
              }}
            >
              {images.map((item) => (
                <img
                  key={item.id}
                  src={`https://horaservices.com/api/uploads/${item.image}`}
                  alt={`Option ${item.id}`}
                  style={{
                    width: "60px",
                    height: "60px",
                    border:
                      selectedImage === item.image
                        ? "3px solid blue"
                        : "1px solid #ccc",
                    cursor: "pointer",
                    borderRadius: "4px",
                    objectFit: "cover",
                  }}
                  onClick={() => setSelectedImage(item.image)}
                />
              ))}
            </div>

            <label>
              Upload Image:
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </label>


            {/* <label>
              Date:
              <input
                type="date"
                name="date"
                value={formData.date}
            
              />
            </label> 

             <label>
              Time:
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
              />
            </label> */}
            <label>
              Date:
            </label>
            <DatePicker
              selected={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              placeholderText="Select date"
              dateFormat="yyyy-MM-dd"
              className="custom-input"
            />

            <label>
              Time:
            </label>
            <DatePicker
              selected={formData.time}
              onChange={(time) => setFormData({ ...formData, time })}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText="Select time"
              className="custom-input"
            />


            <label>
              Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
              />
            </label>

            <div className="modal-actions">
              <button className="close-btn" onClick={handleClose}>
                Close
              </button>
              <button className="save-btn" onClick={handleSave}>
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
