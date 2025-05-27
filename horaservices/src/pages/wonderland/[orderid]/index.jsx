"use client";
import React, { useState, useEffect, useRef } from "react";
import "./EventInvitation.css";
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

const InvitationCard = () => {
  const router = useRouter();
  const { orderid } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);
  const [showFAB, setShowFAB] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

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

  const actions = [
    {
      icon: <FaCamera />,
      titleTop: "Upload/",
      titleBottom: "Share Pictures",
      subtitle: "Add photos taken at the party",
    },
    {
      icon: <FaRegStickyNote />,
      titleTop: "Thank You",
      titleBottom: "Note",
      subtitle: "Leave a message for the host",
    },
    {
      icon: <FaTicketAlt />,
      titleTop: "Lucky Draw",
      titleBottom: "/ Scratch Card",
      subtitle: "Try your luck and win!",
    },
  ];

  const [showModal, setShowModal] = useState(false);
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
    params.append("customerId", customerId);
    params.append("customerPhoneNumber", customerPhoneNumber);

    console.log("🚀 Submitting data to Google Sheets:", {
      name: formData.name,
      date: formattedDate,
      time: formattedTime,
      address: formData.address,
      selectedImage,
      uploadedImage,
      orderid,
      customerId,
      customerPhoneNumber,
    });

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxAAYrO6O2M-6lPd-Kk6mD6xYIrf_P0cc_YgJ7J0UPnwNwpWlPOnSWZ6ton4YEiyu15IQ/exec",
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

  const handleActionClick = (title) => {
    if (title === "Upload/") {
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
            // className="wonderland-page-bg"

            style={{
              backgroundImage: orderDetails?.Template
                ? `url(https://horaservices.com/api/uploads/${orderDetails.Template})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="invite-wrapper">
              {showFAB && <FloatingEditButton onClick={handleEdit} />}
              <h1 className="invite-title">Wonderland</h1>
              <div className="invite-card">
                {orderDetails ? (
                  <>
                    <div className="invite-left">
                      <Image
                        src={`https://horaservices.com/api/uploads/${orderDetails.Image}`}
                        alt={orderDetails.Name}
                        className="invite-image"
                        width={50}
                        height={50}
                      />
                      <p className="invite-name">{orderDetails.Name}</p>
                      <p className="invite-name">{orderDetails.customerId}</p>
                    </div>

                    <div className="invite-right">
                      <h2 className="invite-heading">YOU'RE INVITED!</h2>
                      <div className="invite-info">
                        <div className="info-row">
                          <span className="icon">📅</span>
                          <span>{formatDate(orderDetails.Date)}</span>
                          <span className="icon">⏰</span>
                          <span>{orderDetails.Time}</span>
                        </div>
                        <div className="info-row">
                          <span className="icon">📍</span>
                          <span>{orderDetails.Address}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
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

              {/* Action Cards upload image, thank you, lucky draw */}
              <div className="party-actions">
                {actions.map((action, index) => (
                  <div
                    className="action-card"
                    key={index}
                    onClick={() => handleActionClick(action.titleTop)}
                  >
                    <div className="top-row">
                      <div className="icon">{action.icon}</div>
                      <div className="title-text">
                        <div>{action.titleTop}</div>
                        <div>{action.titleBottom}</div>
                      </div>
                    </div>
                    <div className="subtitle">{action.subtitle}</div>
                  </div>
                ))}
              </div>


              {/* Popup for Thank You */}
              {showPopup && (
                <div className="popup">
                  <h2>Leave a Thank You Note</h2>
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
                  top: 25%;
                  left: 50%;
                  transform: translate(-50%, -25%);
                  background: white;
                  border: 1px solid #ccc;
                  padding: 24px;
                  border-radius: 8px;
                  z-index: 1000;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                .popup input {
                  display: block;
                  width: 100%;
                  padding: 8px;
                  margin-top: 10px;
                  margin-bottom: 12px;
                  border: 1px solid #ccc;
                  border-radius: 4px;
                }

                .popup-buttons {
                  display: flex;
                  justify-content: flex-end;
                  gap: 10px;
                }

                .popup button {
                  padding: 8px 16px;
                  border: none;
                  background: #007bff;
                  color: white;
                  border-radius: 4px;
                  cursor: pointer;
                }

                .popup button:last-child {
                  background: #6c757d;
                }
              `}</style>
            </div>

{/* image showing grid */}
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
                    fontSize: "18px",
                    color: "#000",
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
                    fontSize: "12px",
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
                    />
                  </label>

                  <label>
                    Date:
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
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
                  </label>

                  <label>
                    Address:
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
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
          </div>
        </>
      )}
    </>
  );
};

export default InvitationCard;
