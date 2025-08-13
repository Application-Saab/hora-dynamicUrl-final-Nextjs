"use client";
import React, { useState, useEffect, useRef } from "react";
import "../EventInvitation.css";
import { useSwipeable } from "react-swipeable";
import tabIcon1 from "../../../assets/galleryicon.jpg";
import tabIcon2 from "../../../assets/thankyouicon.png";
import imageBackground from "../../../assets/imageBackground.jpg";
import imageBackGround from "../../../assets/finalInviteBackground.png";
import LuckDrawTicketBanner from "../../../assets/lucky_draw_ticket_bg.png";
import Image from "next/image";
import FloatingEditButton from "@/components/FloatingActionButton/FAB";
import {
  BASE_URL,
  CREATE_GUEST_BY_EVENTID,
  GET_EVENT_IMAGES,
  IMAGE_UPLOAD,
  GET_GUEST_DETTAILS,
  UPLOAD_IMAGES_SELF,
  UPLOAD_THANKYOU_NOTE,
} from "@/utils/apiconstants";
import { useRouter } from "next/router";
import axios from "axios";
import OtpLoginPopup from "@/components/OtpLoginPopup";
import html2canvas from "html2canvas";
import LuckyDrawForm from "../../lucky-draw/index";
import LuckDrawBanner from "@/assets/LuckdrawBanner.jpg";
import photo1 from "@/assets/collage/photo1.png";
import photo2 from "@/assets/collage/photo2.jpeg";
import photo3 from "@/assets/collage/photo3.png";
import photo4 from "@/assets/collage/photo4.png";
import photo5 from "@/assets/collage/photo5.png";
import photo6 from "@/assets/collage/photo6.png";
import photo7 from "@/assets/collage/photo7.png";
import wallCamera from "@/assets/wallCamera.png";
import downloadicon from "@/assets/download-icon.png";
import deletebtn from "@/assets/deletebtn.png";
import photo8 from "@/assets/collage/photo8.png";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams } from "next/navigation";
import InvitationModal from "@/components/InvitationModal";
import FinalInviteDisplay from "@/components/FinalInviteDisplay";
import GuestListPreview from "@/components/GuestListPreview";
import ThankYouNotePopup from "@/components/ThankYouNotePopup";
import RSVPPopup from "@/components/RSVPPopup";
import GuestRSVPForm from "@/components/GuestRSVPForm";
import frame from "@/assets/Frame1.png";
import WonderlandLandingPage from "@/components/wonderland/WonderlandLandingPage";
import { eventOptions } from "../constants";

const InvitationCard = () => {
  const fileInputRef = useRef(null);
  const router = useRouter();
  const { page } = router.query;
  const slug = router.query.slug || [];
  console.log(
    "%c [ slug ]-54",
    "font-size:13px; background:pink; color:#bf2c9f;",
    slug
  );
  const userID = localStorage.getItem("userID");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  console.log('%c [ isLoggedIn ]-62', 'font-size:13px; background:pink; color:#bf2c9f;', isLoggedIn)
  const token = localStorage.getItem("token");
  const [errorAddGuest, setErrorAddGuest] = useState("");
  const [openRsvpList, setOpenRsvpList] = useState(false);
  const [errorGetGuest, setErrorGetGuest] = useState(null);
  const [guestDetails, setGuestDetails] = useState({});
  console.log(
    "%c [ guestDetails ]-60",
    "font-size:13px; background:pink; color:#bf2c9f;",
    guestDetails
  );
  const [refetchLuckyDraw, setRefetchLuckyDraw] = useState(false);
  const [eventAllImages, setEventAllImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loadingEventImages, setLoadingEventImages] = useState(true);
  const [errorEventImages, setErrorEventImages] = useState(null);
  const [refetchEventImages, setRefetchEventImages] = useState(false);

  const [urlParams, setUrlParams] = useState({
    eventUserId: slug[0] || "",
    eventId: slug[1] || "",
    userType: slug[2] ? slug[2].toLowerCase() : "",
  });
  console.log(
    "%c [ urlParams ]-77",
    "font-size:13px; background:pink; color:#bf2c9f;",
    urlParams
  );

  useEffect(() => {
    if (slug.length) {
      // const parts = id2.split("/");
      if (slug.length >= 2) {
        setUrlParams((prev) => ({
          ...prev,
          eventUserId: slug[0],
          eventId: slug[1],
          userType: slug[2] ? slug[2].toLowerCase() : "host",
        }));
      }
    }
  }, [slug]);

  useEffect(() => {
    const fetchEventImages = async () => {
      if (!urlParams.eventId) {
        setErrorEventImages("Event ID not found in URL");
        setLoadingEventImages(false);
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}${GET_EVENT_IMAGES}/${urlParams?.eventId}`,
          {
            headers: {
              Authorization: `${token}`, // Add token in Authorization header
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.error) {
          setErrorEventImages(data.message || "Failed to fetch guests");
        } else {
          setEventAllImages(data.data || []);
        }
      } catch (err) {
        setErrorEventImages("Error fetching guests: " + err.message);
      } finally {
        setLoadingEventImages(false);
      }
    };

    fetchEventImages();
  }, [urlParams.eventId, refetchEventImages, refetchLuckyDraw]);

  useEffect(() => {
    const fetchGuestDetails = async () => {
      // if (userID === urlParams.eventUserId) {
      //   // alert(`${userID} and ${urlParams.eventUserId} are same`);
      //   return;
      // }
      if (!urlParams.eventId || !userID) {
        setErrorGetGuest("Event id or user id not found!");
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}${GET_GUEST_DETTAILS}/${urlParams?.eventId}/user/${userID}`,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.error) {
          setErrorGetGuest(data.message || "Failed to fetch guest");
        } else {
          setGuestDetails(data.data || []);
        }
      } catch (err) {
        setErrorGetGuest("Error fetching guest: " + err.message);
      }
    };

    fetchGuestDetails();
  }, [urlParams.eventId, userID, refetchLuckyDraw]);

  useEffect(() => {
    const addGuest = async () => {
      try {
        const response = await fetch(`${BASE_URL}${CREATE_GUEST_BY_EVENTID}`, {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: urlParams.eventId,
            userId: userID,
          }),
        });

        const data = await response.json();
        if (data.error) {
          setErrorAddGuest(data.message || "Failed to add guest");
        } else {
          console.log("Guest added successfully:", data);
          setErrorAddGuest(null);
        }
      } catch (err) {
        setErrorAddGuest("Error adding guest: " + err.message);
      }
    };
    if (
      isLoggedIn === "true" &&
      urlParams.eventId &&
      urlParams.eventUserId &&
      urlParams.userType === "guest"
    ) {
      addGuest();
    }
  }, [
    urlParams.eventId,
    urlParams.eventUserId,
    urlParams.userType,
    isLoggedIn,
    guestDetails,
  ]);

  const [orderDetails, setOrderDetails] = useState(null);
  console.log(
    "%c [ orderDetails ]-199",
    "font-size:13px; background:pink; color:#bf2c9f;",
    orderDetails
  );
  const [showFAB, setShowFAB] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
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
  const [noteBy, setNoteBy] = useState(
    userID === urlParams.eventUserId ? orderDetails?.Name : guestDetails?.name
  );
  const [errorMsg, setErrorMsg] = useState("");
  const noteRef = useRef(null);

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

    // const queryId = router.query.id;
    // const parts = Array.isArray(queryId) ? queryId : queryId?.split("/");

    if (urlParams && slug.length > 2) {
      const eventId = urlParams.eventId;
      const userId = urlParams.eventUserId;
      const userType = urlParams.userType || "host";

      setId(eventId);
      setSecondId(userId);
      setUserType(userType);

      const alreadyRSVP = localStorage.getItem(
        `rsvp_submitted_${eventId}_${userId}`
      );
      if (alreadyRSVP === "true") {
        setHasSubmitted(true);
      }

      setLoadingUser(false);
    }
  }, [router.isReady, urlParams]);

  const userId = localStorage.getItem("userID");
  const userPhoneNumber = localStorage.getItem("mobileNumber");
  const [isHost, setIsHost] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const actions = [
    {
      image: tabIcon1,
      title: "Upload Pictures",
    },
    {
      image: tabIcon2,
      title: "Thank You Note",
    },
  ];

  console.log("ishost", isHost);

  // determine from props or state
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    address: "",
    eventType: "",
    eventTypeSearch: "",
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result;

      try {
        const compressed = await compressBase64Image(base64String, 500, 0.4); // 👈 compress karo
        setUploadedImage(compressed); // ✅ use compressed base64
        console.log("Compressed Base64:", compressed);
        console.log(
          "Size (approx):",
          Math.round((compressed.length * 3) / 4 / 1024),
          "KB"
        );
      } catch (err) {
        console.error("Image compression failed:", err);
        alert("Image compress karne mein error aaya.");
      }
    };

    reader.readAsDataURL(file); // ✅ Converts file to base64 string
  };

  const compressBase64Image = (base64, maxWidth = 500, quality = 0.4) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");

        const ratio = img.width / img.height;
        const newWidth = Math.min(img.width, maxWidth);
        const newHeight = newWidth / ratio;

        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
      img.src = base64;
    });
  };

  const handleEdit = () => {
    if (!orderDetails) return;

    let formattedTime = "";
    if (orderDetails.Time) {
      const timeStr = orderDetails.Time;
      const parsed = new Date(`1970-01-01T${timeStr}`);
      if (!isNaN(parsed)) {
        formattedTime = parsed.toTimeString().slice(0, 5); // "HH:mm"
      } else {
        try {
          const [timePart, meridian] = timeStr.split(" ");
          const [h, m] = timePart.split(":");
          let hours = parseInt(h, 10);
          if (meridian === "PM" && hours < 12) hours += 12;
          if (meridian === "AM" && hours === 12) hours = 0;
          formattedTime = `${hours.toString().padStart(2, "0")}:${m}`;
        } catch {
          formattedTime = "";
        }
      }
    }

    setFormData({
      name: orderDetails.Name || "",
      date: orderDetails.Date
        ? new Date(orderDetails.Date).toISOString().split("T")[0]
        : "",
      time: formattedTime,
      address: orderDetails.Address || "",
      eventType: orderDetails.eventType || orderDetails["Event Type"] || "",
      eventTypeSearch:
        orderDetails.eventType || orderDetails["Event Type"] || "",
    });

    setUploadedImage(orderDetails.Image || "");
    setSelectedImage(orderDetails.Image || "");
    setId(orderDetails?.id || orderDetails?._id || orderDetails?.eventId);
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
    router.push("/templates");
  };
  const handleWhatsAppShare = () => {
    const inviteURL = `https://horaservices.com/wonderland/${orderDetails.userId}/${orderDetails._id}/guest`;
    const shareText = `You're invited to ${orderDetails.Name || "someone"}'s ${
      orderDetails["Event Type"] || "Birthday"
    }! 🎉\n\n📅 ${formatDate(orderDetails.Date)}\n⏰ ${orderDetails.Time}\n📍 ${
      orderDetails.Address || "Venue"
    }\n\n👉 Tap to view the invite:\n${inviteURL}`;

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappLink, "_blank");
  };
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    // Set the input value in formData
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // ✅ Add/remove `has-value` class for date/time inputs
    if (type === "date" || type === "time") {
      if (value) {
        e.target.classList.add("has-value");
      } else {
        e.target.classList.remove("has-value");
      }
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSave = async () => {
    if (!formData.eventType && formData.eventTypeSearch) {
      formData.eventType = formData.eventTypeSearch;
    }

    const formattedDate = formData.date
      ? new Date(formData.date).toISOString()
      : "";
    const formattedTime = formData.time
      ? new Date(`1970-01-01T${formData.time}`).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "";

    const finalImage = uploadedImage || orderDetails?.Image || "";
    const loggedInUserId = localStorage.getItem("userID");

    if (!token || !loggedInUserId) {
      alert("Please login to continue.");
      return;
    }

    const payload = {
      userId: loggedInUserId,
      eventType: formData.eventType,
      hostName: formData.name,
      eventDate: formattedDate,
      eventTime: formattedTime,
      location: formData.address,
      hostImage: finalImage,
    };

    const isEdit = !!id;

    try {
      const res = await fetch(
        isEdit
          ? `${BASE_URL}/api/customer/event/event-invites/${id}`
          : `${BASE_URL}/api/customer/event/create-event-invite`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      const finalEventId = isEdit
        ? id
        : result?.data?._id || result?.data?.idd || result?.data?.event?._id;

      if (res.ok && finalEventId) {
        await fetchOrderDetails(finalEventId); // ✅ Refresh latest details
        setId(finalEventId);
        setSecondId(loggedInUserId);
        setUserType("host");
        setShowModal(false);

        // ✅ Update the URL route to reflect changes
        router.replace(`/wonderland/${loggedInUserId}/${finalEventId}/host`);
      } else {
        alert("Failed to save invitation.");
      }

      // ✅ Reset form
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
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Something went wrong.");
    }
  };

  const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");

    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
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
      window.location.pathname === "/wonderland"
      // !window.location.search.includes("id=")
    ) {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    // const queryId = router.query.id;
    const eventId = urlParams?.eventId;
    if (!eventId) return;

    fetchOrderDetails(eventId);
  }, [router.isReady, urlParams?.eventId, urlParams]);

  const fetchOrderDetails = async (eventId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/customer/event/event-invites/${eventId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const result = await res.json();

      if (res.status === 200 && result.data) {
        const data = result.data;
        const hostId = String(data.userId).trim();

        setOrderDetails({
          Name: data.hostName,
          "Event Type": data.eventType,
          eventType: data.eventType, // ✅ add this
          Date: data.eventDate,
          Time: data.eventTime,
          Address: data.location,
          Image: data.hostImage || data.imageUrl || "",
          userId: hostId,
          id: data._id || data.id || data.eventId,
          luckyDraws: data?.luckyDraws || [],
        });

        // ✅ Set host ID globally
        setSendCustomerId(hostId);
      }
    } catch (err) {
      console.error("❌ Fetch failed:", err);
      // alert("Fetch failed.");
    }
  };

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

  const handleActionClick = (title) => {
    if (title === "Upload Pictures") {
      document.getElementById("imageUploadInput").click();
    } else if (title === "Thank You Note") {
      setShowPopup(true);
    } else if (title === "Lucky Draw") {
      setShowLuckyDrawPopup(true);
    }
  };
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const nextIndex = (selectedIndex + 1) % eventAllImages.length;
      setSelectedIndex(nextIndex);
      setSelectedImage(eventAllImages[nextIndex]);
    },
    onSwipedRight: () => {
      const prevIndex =
        (selectedIndex - 1 + eventAllImages.length) % eventAllImages.length;
      setSelectedIndex(prevIndex);
      setSelectedImage(eventAllImages[prevIndex]);
    },
    trackMouse: true, // optional, mouse drag support bhi deta hai
  });
  const handleImageUpload = async (e) => {
    setUploading(true);
    setWallUploading(true);

    const files = e.target.files;
    if (!files || files.length === 0) {
      console.error("No files selected for upload");
      setUploading(false);
      setWallUploading(false);
      return;
    }

    const formData = new FormData();

    // Append all files with the same field name "files" (backend should handle array)
    Array.from(files).forEach((file, index) => {
      formData.append("selfUploadedImages", file); // Multiple files under "files" key
    });

    formData.append("userId", userID);

    try {
      const res = await fetch(
        `${BASE_URL}${UPLOAD_IMAGES_SELF}/${urlParams?.eventId}/self-uploaded`,
        {
          method: "PUT",
          headers: {
            Authorization: `${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Uploaded:", data);

      if (data?.uploaded && Array.isArray(data.uploaded)) {
        // Update eventData with uploaded images
        const newImages = data.uploaded.map((item) => ({
          type: "image",
          src: item.url, // Ensure backend returns "url" field
          alt:
            item.key ||
            item.filename ||
            `Uploaded image ${data.uploaded.indexOf(item) + 1}`,
        }));

        setEventData((prev) => [...newImages, ...prev]);
      } else {
        console.warn("No valid uploaded images data received", data);
      }
    } catch (err) {
      console.error("Upload failed", err.message);
      // Optionally show user feedback (e.g., alert or UI message)
    } finally {
      setRefetchEventImages(!refetchEventImages);
      setUploading(false);
      setWallUploading(false);
    }
  };
  const handleDeleteImage = async (imageId, imageType) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(
        `${BASE_URL}/api/customer/event/event-images/${urlParams.eventId}/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userID, imageId, imageType }),
        }
      );

      const data = await res.json();

      if (!data.error) {
        // Update images list state
        setEventAllImages((prev) => {
          const newImages = prev.filter((img) => img._id !== imageId);

          // Update selectedImage and selectedIndex so lightbox doesn't show deleted image
          if (newImages.length === 0) {
            setIsImageOpen(false); // Close lightbox if no images left
          } else {
            let newIndex = selectedIndex;
            if (selectedIndex >= newImages.length) {
              newIndex = newImages.length - 1;
            }
            setSelectedIndex(newIndex);
            setSelectedImage(newImages[newIndex]);
          }

          return newImages;
        });

        alert("Image deleted successfully");
      } else {
        alert(data.message || "Failed to delete image");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting");
    }
  };

  const handleDownload = async () => {
    if (noteTitle.trim() === "" || noteBy.trim() === "") {
      setErrorMsg("Please fill all required fields.");
      return;
    }
    setErrorMsg("");
    setShowPopup(false);
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
      formData.append("image", file);
      formData.append("userId", userID);
      try {
        const response = await fetch(
          `${BASE_URL}${UPLOAD_THANKYOU_NOTE}/${urlParams?.eventId}/thankyou-note`,
          {
            method: "PUT",
            headers: {
              Authorization: `${token}`,
            },
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
        setRefetchEventImages(!refetchEventImages);
        // setShowPopup(false);
        setNoteTitle("");
        setNoteBy("");
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }, "image/png");
  };

  const charsWithoutSpaces = noteTitle.replace(/\s/g, "").length;

  useEffect(() => {
    if (sendCustomerId && userId) {
      const isHost = sendCustomerId.trim() === userId.trim();
      setIsHost(isHost);
      setShowFAB(isHost);
    }
  }, [sendCustomerId, userId]);

  useEffect(() => {
    if (!router.isReady || !userId || !sendCustomerId) return;

    const actualRole =
      userId.trim() === sendCustomerId.trim() ? "host" : "guest";

    if (urlParams?.userType === actualRole) return; // Only check role; skip if already correct

    const newRoute = `${urlParams?.eventUserId}/${urlParams?.eventId}/${actualRole}`;
    router.replace(`/wonderland/${newRoute}`);
  }, [router.isReady, urlParams, userId, sendCustomerId]);

  return (
    <>
      {!isLoggedIn ? (
        <div className="no-orders">
          <WonderlandLandingPage isLoggedIn={isLoggedIn} />
        </div>
      ) : (
        <>
          {slug.length === 3 && orderDetails && (
            <>
              {showFAB && isHost && <FloatingEditButton onClick={handleEdit} />}

              {orderDetails ? (
                <>
                  <div
                    className="invitation-container"
                    style={{
                      backgroundImage: `url(${imageBackGround.src})`,
                    }}
                  >
                    <FinalInviteDisplay
                      orderDetails={orderDetails}
                      handleClick={handleClick}
                      isHost={userType === "host"}
                    />
                  </div>

                  <div>
                    {isHost && (
                      <div className="invite-section">
                        <h2 className="invite-titles">
                          Turn invites into memory albums!
                        </h2>
                        <p className="invite-subtitles">
                          🎉 Let your friends and family join in the joy! <br />
                          A special day is waiting — don’t miss the celebration!
                        </p>
                        <div className="invite-butons">
                          <button className="btn-explore" onClick={handleClick}>
                            <i className="fa fa-paper-plane" /> Explore Themes
                          </button>
                          <button
                            className="btn-share"
                            onClick={handleWhatsAppShare}
                          >
                            <i className="fa fa-whatsapp" /> Share Invitation
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 🎉 RSVP Section */}
                  {isHost || hasSubmitted ? (
                    <GuestListPreview
                      guestList={guestList}
                      loading={loading}
                      userType={userType}
                      hostData={orderDetails}
                      urlParams={urlParams}
                    />
                  ) : (
                    <GuestRSVPForm
                      hostData={orderDetails}
                      userType={userType}
                      guestList={guestList}
                      loading={loading}
                      userId={userID}
                      eventId={urlParams.eventId}
                      // fetchGuests={fetchGuests}
                      hasSubmitted={hasSubmitted}
                      setHasSubmitted={setHasSubmitted}
                      setShowPopupGuest={setShowPopupGuest}
                      onSubmit={(data) => {
                        const payload = {
                          ...data,
                          rsvpId: id,
                          userId: secondId,
                        };
                        // handleRSVPSubmit(payload);
                        localStorage.setItem(
                          `rsvp_submitted_${id}_${secondId}`,
                          "true"
                        );
                        setHasSubmitted(true);
                      }}
                    />
                  )}

                  {/* 💌 Thank You Note Popup */}
                  {showPopup && (
                    <div className="popup-thankyounaote-container">
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
                    </div>
                  )}
                </>
              ) : (
                <p>Loading...</p>
              )}
              {isHost &&
                orderDetails &&
                (orderDetails?.luckyDraws?.length === 0 ? (
                  <div className="lucky-draw-banner">
                    <Image
                      src={LuckDrawBanner}
                      alt="Luck Draw Banner"
                      className="banner-img"
                    />
                    <button
                      className="click-now-btn"
                      onClick={() => setShowLuckyDrawPopup(true)}
                    >
                      Click Now
                    </button>
                  </div>
                ) : (
                  <div className="lucky-draw-banner">
                    <Image
                      src={LuckDrawTicketBanner}
                      alt="Luck Draw Banner"
                      className="banner-img"
                    />
                    <span className="ticket-number">
                      {orderDetails &&
                        orderDetails?.luckyDraws?.length > 0 &&
                        orderDetails?.luckyDraws[0]?.ticketNumber}
                    </span>
                  </div>
                ))}
              {!isHost &&
                guestDetails &&
                (guestDetails?.luckyDraws?.length === 0 ? (
                  <div className="lucky-draw-banner">
                    <Image
                      src={LuckDrawBanner}
                      alt="Luck Draw Banner"
                      className="banner-img"
                    />
                    <button
                      className="click-now-btn"
                      onClick={() => setShowLuckyDrawPopup(true)}
                    >
                      Click Now
                    </button>
                  </div>
                ) : (
                  <div className="lucky-draw-banner">
                    <Image
                      src={LuckDrawTicketBanner}
                      alt="Luck Draw Banner"
                      className="banner-img"
                    />
                    <span className="ticket-number">
                      {guestDetails &&
                        guestDetails?.luckyDraws?.length > 0 &&
                        guestDetails?.luckyDraws[0]?.ticketNumber}
                    </span>
                  </div>
                ))}

              <div style={styles.wrapper}>
                <h2 style={styles.heading}>
                  <Image
                    src={wallCamera}
                    alt="Camera Icon"
                    style={{ width: 60, height: 60 }}
                  />
                  Celebration Wall
                </h2>

                <p style={styles.subheading}>
                  A wall filled with your party’s happiest moments and heartfelt
                  messages.
                </p>

                {/* Action Buttons */}
                <div className="tabs-container" style={styles.tabsContainer}>
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (action.title === "Upload Pictures") {
                          const input =
                            document.getElementById("imageUploadInput");
                          if (input) {
                            input.value = "";
                            input.click();
                          }
                        } else {
                          handleActionClick(action.title);
                        }
                      }}
                      style={styles.actionButton}
                    >
                      <Image
                        src={action.image}
                        alt={action.title}
                        style={styles.iconStyle}
                      />
                      <span style={styles.buttonLabel}>{action.title}</span>
                    </button>
                  ))}
                  <input
                    type="file"
                    id="imageUploadInput"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </div>

                {/* Images Grid */}
                <div style={{ position: "relative", marginTop: "auto" }}>
                  {wallUploading && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(255, 255, 255, 0.8)",
                        display: "flex",
                        justifyContent: "center",
                        zIndex: 2,
                      }}
                    >
                      <div className="spinner" />
                    </div>
                  )}

                  <div
                    className="event-grid"
                    style={{
                      opacity: wallUploading ? 0.5 : 1,
                      margin: "10px auto",
                    }}
                  >
                    {eventAllImages.length === 0 ? (
                      <>
                        <div className="collage-item">
                          <Image
                            src={photo1}
                            className="collage-image"
                            alt="img1"
                          />
                        </div>
                        <div className="collage-item">
                          <Image
                            src={photo4}
                            className="collage-image"
                            alt="sticky note"
                          />
                        </div>
                        <div className="collage-item">
                          <Image
                            src={photo3}
                            className="collage-image"
                            alt="img2"
                          />
                        </div>
                        <div className="collage-item">
                          <Image
                            src={photo7}
                            className="collage-image"
                            alt="img2"
                          />
                        </div>
                        <div className="collage-item">
                          <Image
                            src={photo8}
                            className="collage-image"
                            alt="img5"
                          />
                        </div>
                        <div className="collage-item">
                          <Image
                            src={photo2}
                            className="collage-image"
                            alt="img3"
                          />
                        </div>
                        <div className="collage-item">
                          <Image
                            src={photo5}
                            className="collage-image"
                            alt="img4"
                          />
                        </div>
                        <div className="collage-item">
                          <Image
                            src={photo6}
                            className="collage-image"
                            alt="img5"
                          />
                        </div>
                      </>
                    ) : (
                      eventAllImages.map((item, index) => (
                        <div
                          key={item._id || index}
                          className="collage-item"
                          style={{ position: "relative" }}
                        >
                          <img
                            src={item.imageUrl}
                            alt={`Event Image ${index + 1}`}
                            className="event-image"
                            onClick={() => {
                              setSelectedImage(item); // Image select karo
                              setIsImageOpen(true); // Lightbox open karo
                            }}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {isImageOpen && selectedImage && (
                  <div className="custom-lightbox">
                    <div {...handlers} className="lightbox-content">
                      {/* Close Button */}
                      <button
                        className="close-btn"
                        onClick={() => setIsImageOpen(false)}
                      >
                        ✖
                      </button>

                      {/* Prev Button */}
                      <button
                        className="nav-btn prev-btn"
                        onClick={() => {
                          const prevIndex =
                            (selectedIndex - 1 + eventAllImages.length) %
                            eventAllImages.length;
                          setSelectedIndex(prevIndex);
                          setSelectedImage(eventAllImages[prevIndex]);
                        }}
                      >
                        ‹
                      </button>

                      {/* Image */}
                      <img
                        src={selectedImage.imageUrl}
                        alt=""
                        className="lightbox-img"
                      />

                      {/* Next Button */}
                      <button
                        className="nav-btn next-btn"
                        onClick={() => {
                          const nextIndex =
                            (selectedIndex + 1) % eventAllImages.length;
                          setSelectedIndex(nextIndex);
                          setSelectedImage(eventAllImages[nextIndex]);
                        }}
                      >
                        ›
                      </button>

                      {/* Toolbar */}
                      <div className="lightbox-toolbar">
                        <button
                          className="lightbox-btn"
                          onClick={() => handleDownload(selectedImage.imageUrl)}
                        >
                          <Image
                            src={downloadicon}
                            alt="Download"
                            style={{ width: 30, height: 30 }}
                          />
                        </button>

                        {selectedImage.userId === userID && (
                          <button
                            className="lightbox-btn"
                            onClick={() =>
                              handleDeleteImage(
                                selectedImage._id,
                                selectedImage.imageType
                              )
                            }
                          >
                            <Image
                              src={deletebtn}
                              alt="Delete"
                              style={{ width: 30, height: 30 }}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 🎁 Lucky Draw Popup */}
              {showLuckyDrawPopup && (
                <div
                  className="popup-luckdraw-overlay"
                  onClick={() => setShowLuckyDrawPopup(false)}
                >
                  <div
                    className="popup-luckdraw-container"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="popup-luckdraw-content"
                      style={{ marginBlock: "30px" }}
                    >
                      <LuckyDrawForm
                        hostData={orderDetails}
                        urlParams={urlParams}
                        onClose={() => {
                          setShowLuckyDrawPopup(false);
                          setRefetchLuckyDraw(!refetchLuckyDraw);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 🛠 Invitation Modal */}
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
          {slug.length === 1 && (
            <div>
              <WonderlandLandingPage
                isLoggedIn={isLoggedIn}
                userId={userID}
                slug={slug}
              />
            </div>
          )}
          {slug.length === 2 && page === "create-invite" && (
            <div>
              <WonderlandLandingPage
                isLoggedIn={isLoggedIn}
                userId={userID}
                slug={slug}
              />
            </div>
          )}
        </>
      )}

      {/* Guest List Modal Popup */}
      {showPopupGuest && (
        <>
          <div
            style={styles.backdrop}
            onClick={() => setShowPopupGuest(false)}
          />
          <RSVPPopup
            guestList={guestList}
            onClose={() => setShowPopupGuest(false)}
          />
        </>
      )}
    </>
  );
};

const styles = {
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

  wrapper: {
    padding: 20,
    fontFamily: "sans-serif",
    maxWidth: 480,
    margin: "auto",
    backgroundColor: "#FFDBDB",
  },
  heading: {
    fontSize: 28,
    fontWeight: 700,
    // marginBottom: 8,
    color: "rgb(168, 50, 142)",
    textAlign: "center",
  },
  subheading: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: 400,
    color: "#97538C",
    textAlign: "center",
  },
  buttonRow: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#a8328e",
    color: "#fff",
    border: "none",
    padding: "10px 12px",
    borderRadius: 6,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
  },

  uploading: {
    fontSize: 13,
    color: "#444",
    marginBottom: 10,
  },
  loading: {
    fontSize: 15,
    fontWeight: 500,
    textAlign: "center",
    marginTop: 40,
  },
  gallery: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 8,
  },
  imageBox: {
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    display: "block",
  },

  tabsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "5px",
    // flexWrap: "wrap",
    marginTop: 20,
  },

  actionButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(90deg, #351F79 15.1%, #832585 85.42%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
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

export default InvitationCard;
