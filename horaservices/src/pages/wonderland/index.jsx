"use client";
import React, { useState, useEffect, useRef } from "react";
import "./EventInvitation.css";
import { useSwipeable } from "react-swipeable";
import tabIcon1 from "@/assets/galleryicon.png";
import tabIcon2 from "@/assets/thankyouicon.png";
import imageBackground from "@/assets/imageBackground.jpg";
import imageBackGround from "@/assets/finalInviteBackground.png";
import LuckDrawTicketBanner from "@/assets/lucky_draw_ticket_bg.jpg";
import Image from "next/image";
import whatshare from "@/assets/whatshare.png";
import shareinvitaion from "@/assets/shareinvitation.png";
import { downloadFile } from "@/utils/downloadFile";
import FloatingEditButton from "@/components/FloatingActionButton/FAB";
import {
  BASE_URL,
  CREATE_GUEST_BY_EVENTID,
  GET_EVENT_IMAGES,
  IMAGE_UPLOAD,
  GET_GUEST_DETTAILS,
  UPLOAD_IMAGES_SELF,
  UPLOAD_THANKYOU_NOTE,
  GET_ALL_TEMPLATES ,
} from "@/utils/apiconstants";
import { useRouter } from "next/router";
import axios from "axios";
import OtpLoginPopup from "@/components/OtpLoginPopup";
import html2canvas from "html2canvas";
import LuckyDrawForm from "../lucky-draw/index";
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
import { eventOptions } from "@/utils/constants";
import chatIcon from "@/assets/chaticon.png"
import EmojiPicker from "emoji-picker-react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebase";
import { getToken, onMessage, getMessaging } from "firebase/messaging";

const VAPID_KEY =
  "BPpalhQL4beB7GAJYcjp7l9uU0ngzjaXpCwCstXa77g8wPiWnxQM7jVS4ffOePSje9nBx6yRWXWX-iY2fw5A2OA";


const InvitationCard = () => {
  const hasSeenMessages = useRef(true);
const prevMessageLength = useRef(0);

  const rsvpRef = useRef(null);
  const router = useRouter();
  const { page, id : queryId } = router.query;
  // const slug = router.query.slug || [];
  const fileInputRef = useRef(null);

  // const queryId = router.query.id;
  const slug = Array.isArray(queryId) ? queryId : queryId?.split("/") || [];

  console.log(
    "%c [ slug ]-54",
    "font-size:13px; background:pink; color:#bf2c9f;",
    slug
  );
  const userID = localStorage.getItem("userID");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const token = localStorage.getItem("token");
  const [errorAddGuest, setErrorAddGuest] = useState("");
  const [openRsvpList, setOpenRsvpList] = useState(false);
  const [errorGetGuest, setErrorGetGuest] = useState(null);
  const [guestDetails, setGuestDetails] = useState({});
    const [showDeletePopup, setShowDeletePopup] = useState(false);
const [deleteTarget, setDeleteTarget] = useState(null);
  console.log(
    "%c [ guestDetails ]-60",
    "font-size:13px; background:pink; color:#bf2c9f;",
    guestDetails
  );
  const [refetchAddGuest, setRefetchAddGuest] = useState(false);
  const [refetchLuckyDraw, setRefetchLuckyDraw] = useState(false);
  const [eventAllImages, setEventAllImages] = useState([]);
 const [refetchLuckyDrawHostDelete, setRefetchLuckyDrawHostDelete] = useState(false);
const [refetchLuckyDrawGuestDelete, setRefetchLuckyDrawGuestDelete] = useState(false);
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
  }, [queryId]);

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
    }, [urlParams.eventId, refetchEventImages, refetchLuckyDraw, refetchLuckyDrawHostDelete,
  refetchLuckyDrawGuestDelete]);

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
  }, [
    urlParams.eventId,
    userID,
    refetchLuckyDraw,
    refetchEventImages,
    refetchAddGuest,
    refetchLuckyDrawGuestDelete
  ]);

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
          setRefetchAddGuest(true);
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
 const [template, setTemplate] = useState(null);

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

  
   const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const chatOpenRef = useRef(false);
  const [unreadCount, setUnreadCount] = useState(0);
    const [selectedMessages, setSelectedMessages] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [userIdd, setUserIdd] = useState(null);
  const [role, setRole] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const textareaRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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
  const [highlightRSVPButtons, setHighlightRSVPButtons] = useState(false);

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
      setErrorMsg("");
  };

  const handleClose = () => {
    setShowModal(false);
  };

 const handleClick = () => {
  router.push(`/templates?eventId=${urlParams.eventId}&eventUserId=${urlParams.eventUserId}&userType=${urlParams.userType}`);
};



  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

   const goToSharePage = () => {
    router.push({
      pathname: "/wonderland/ShareInvitation", // tumhare ShareInvitation page ka route
      query: { data: JSON.stringify(orderDetails) }
    });
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
        router.replace(`/wonderland?id=${loggedInUserId}/${finalEventId}/host`);
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

  // useEffect(() => {
  //   // Show modal if user visits /wonderland (no id in query)
  //   if (
  //     window.location.pathname === "/wonderland"
  //     // !window.location.search.includes("id=")
  //   ) {
  //     setShowModal(true);
  //   }
  // }, []);
  useEffect(() => {
    if (!router.isReady) return;

    // const queryId = router.query.id;
    const eventId = urlParams?.eventId;
    if (!eventId) return;

    fetchOrderDetails(eventId);
  }, [router.isReady, urlParams?.eventId, urlParams, refetchLuckyDraw, refetchLuckyDrawHostDelete]);

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
          templateId: data.templateId,
        });

        setSendCustomerId(hostId);
    
      }
     
    }
     catch (err) {
      console.error("❌ Fetch failed:", err);
   
    }
  };

    const templateId = orderDetails?.templateId;
useEffect(() => {
  if (!templateId) return;

  const fetchTemplate = async () => {
    try {
      const res = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.message || "Failed");

      // Find template by templateId
      const selectedTemplate = data.templates.find(tpl => tpl._id === templateId);

      if (!selectedTemplate) throw new Error("Template not found");

      // backgroundUrl can be either in root or inside configs
      const backgroundUrl = selectedTemplate.backgroundUrl || selectedTemplate.configs?.backgroundUrl || null;

      setTemplate({
        cssCode: selectedTemplate.configs?.cssCode || "",
        jsCode: selectedTemplate.configs?.jsCode || "",
        fontUrls: selectedTemplate.configs?.fontUrls ? JSON.parse(selectedTemplate.configs.fontUrls) : [],
        backgroundUrl: backgroundUrl,
      });
    } catch (err) {
      console.error(err);
      setError("Error fetching template");
    } finally {
      setLoading(false);
    }
  };

  fetchTemplate();
}, [templateId]);

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
  try {
    const res = await fetch(
      `${BASE_URL}/api/customer/event/event-images/${urlParams.eventId}/delete`,
      {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userID, imageId, imageType }),
      }
    );

    const data = await res.json();

    if (!data.error) {
      setEventAllImages((prev) => {
        const newImages = prev.filter((img) => img._id !== imageId);

        if (newImages.length === 0) {
          setIsImageOpen(false);
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
     if (imageType === "luckyDraw") {
  if (isHost) {
    setRefetchLuckyDrawHostDelete(prev => !prev);
  } else {
    setRefetchLuckyDrawGuestDelete(prev => !prev);
  }
}

    } else {
      console.error(data.message || "Failed to delete image");
    }
  } catch (err) {
    console.error("Delete error:", err);
  }
};


  const handleDownload = async () => {
    if (noteTitle.trim() === "" || noteBy.trim() === "") {
 setErrorMsg("Please fill out both fields before saving.");
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
    router.replace(`/wonderland?id=${newRoute}`);
  }, [router.isReady, urlParams, userId, sendCustomerId]);

 useEffect(() => {
  if (!urlParams?.eventId || !urlParams?.eventUserId || !urlParams?.userType)
    return;

  setEventId(urlParams.eventId);
  setUserIdd(urlParams.eventUserId);
  setRole(urlParams.userType);

  registerUser(urlParams.eventId, urlParams.eventUserId, urlParams.userType);

    // listenToMessages(urlParams.eventId, urlParams.eventUserId);
}, [urlParams]);

useEffect(() => {
  if (eventId && userIdd) {
    listenToMessages(eventId, userIdd);
  }
}, [eventId, userIdd]);



  const hasSetUpMessageListener = useRef(false);
  useEffect(() => {
    const chatContainer = document.querySelector(".chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

useEffect(() => {
  if (!userIdd || typeof window === "undefined") return;

  const requestPermissionAndSaveToken = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const messagingInstance = getMessaging();
      const token = await getToken(messagingInstance, { vapidKey: VAPID_KEY });

      console.log("FCM Token:", token);

      if (token) {
        await setDoc(doc(db, "fcmTokens", userIdd), { token }, { merge: true });
      }

      if (!hasSetUpMessageListener.current) {
        onMessage(messagingInstance, (payload) => {
          console.log("Foreground message received:", payload);

          // 🔹 Frontend-only notification
          new Notification(payload.notification?.title || "New Message", {
            body: payload.notification?.body || "You got a message!",
            icon: "/new_logo_light.png",
          });
        });
        hasSetUpMessageListener.current = true;
      }

      // 🔹 Test manually in frontend
      setTimeout(() => {
        new Notification("Test Message", {
          body: "This is a frontend-only test",
          icon: "/new_logo_light.png",
        });
      }, 3000);

    } catch (err) {
      console.error("FCM Error:", err);
    }
  };

  requestPermissionAndSaveToken();
}, [userIdd]);





  const registerUser = async (eventId, userId, role) => {
    const groupRef = doc(db, "groups", eventId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      await setDoc(groupRef, { createdAt: new Date() });
    }

    const memberRef = doc(db, "groups", eventId, "members", userId);
    const memberSnap = await getDoc(memberRef);

    if (!memberSnap.exists()) {
   await setDoc(memberRef, {
  role,
  joinedAt: new Date(),
  lastSeenAt: new Date(), // ✅ set initial lastSeen
});
    }
  };

const lastNotificationRef = useRef(null); 
const lastSeenAtRef = useRef(null); // local tracker

const listenToMessages = (eventId, userId) => {
  const messagesRef = collection(db, "groups", eventId, "messages");
  const q = query(messagesRef, orderBy("sentAt", "asc"));
  const userRef = doc(db, "groups", eventId, "members", userId);

  // Listen to member's lastSeenAt
  onSnapshot(userRef, (memberSnap) => {
    const memberData = memberSnap.exists() ? memberSnap.data() : {};
    lastSeenAtRef.current = memberData.lastSeenAt ? memberData.lastSeenAt.toDate() : null;
  });

  // Listen to messages
  onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const unreadMessages = msgs.filter(msg => {
      if (!msg.sentAt || !msg.senderId) return false;
      const msgDate = msg.sentAt.toDate ? msg.sentAt.toDate() : msg.sentAt;
      return lastSeenAtRef.current ? msgDate > lastSeenAtRef.current : true;
    });

    setMessages(msgs);

    if (!chatOpenRef.current && unreadMessages.length > 0) {
      const lastMsg = unreadMessages[unreadMessages.length - 1];

      // 🔹 Only notify once per message
      if (lastNotificationRef.current !== lastMsg.id) {
        if (Notification.permission === "granted") {
          new Notification(`New message from ${lastMsg.senderId}`, {
            body: lastMsg.text,
            icon: "/new_logo_light.png",
          });
        }

        lastNotificationRef.current = lastMsg.id;

        // 🔹 Mark seen AFTER notification
        setDoc(userRef, { lastSeenAt: new Date() }, { merge: true });
        lastSeenAtRef.current = new Date(); // update local ref
      }
    }

    setUnreadCount(chatOpenRef.current ? 0 : unreadMessages.length);
  });
};






// const listenToMessages = (eventId, userId) => {
//   const messagesRef = collection(db, "groups", eventId, "messages");
//   const q = query(messagesRef, orderBy("sentAt", "asc"));
//   const userRef = doc(db, "groups", eventId, "members", userId);

//   // Listen to member's lastSeenAt live
//   onSnapshot(userRef, (memberSnap) => {
//     const lastSeenAt = memberSnap.exists() && memberSnap.data().lastSeenAt
//       ? memberSnap.data().lastSeenAt.toDate()
//       : null;

//     onSnapshot(q, (snapshot) => {
//       const msgs = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       const unreadMessages = msgs.filter(msg => {
//         if (!msg.sentAt || !msg.senderId) return false;

//         const msgDate = msg.sentAt.toDate ? msg.sentAt.toDate() : msg.sentAt;

//         return lastSeenAt ? msgDate > lastSeenAt : true; // ✅ check against lastSeenAt
//       });

//       if (!chatOpenRef.current && unreadMessages.length > 0) {
//         unreadMessages.forEach(msg => {
//           // 🔹 Foreground notification
//           if (Notification.permission === "granted") {
//             new Notification(`New message from ${msg.senderId}`, {
//               body: msg.text,
//               icon: "/new_logo_light.png",
//             });
//           }
//         });
//       }

//       if (chatOpenRef.current) {
//         setUnreadCount(0);
//       } else {
//         setUnreadCount(unreadMessages.length);
//       }

//       setMessages(msgs);
//     });
//   });
// };










// ✅ Send message with safe guards
const sendMessage = async () => {
  if (!text.trim()) return;
  if (!eventId || !userIdd) {
    console.warn("Missing eventId or userId — cannot send message.");
    return;
  }

  await addDoc(collection(db, "groups", eventId, "messages"), {
    text,
    senderId: userIdd,
    senderPhoneNumber: localStorage.getItem("mobileNumber"),
    sentAt: new Date(),
      sentAt: serverTimestamp(), 
  });

  setText("");
};
  useEffect(() => {
    if (userType !== "host" && !hasSubmitted && highlightRSVPButtons) {
      if (rsvpRef.current) {
        rsvpRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      setTimeout(() => setHighlightRSVPButtons(false), 9000);
    }
  }, [highlightRSVPButtons, userType, hasSubmitted]);

 const renderHTML = (jsCode, rawData) => {
  console.log("Background URL:", template?.backgroundUrl);

    return jsCode.replace(/{{(.*?)}}/g, (_, key) => rawData[key.trim()] || "");
  };

  return (
    <>
      {!isLoggedIn ? (
        <div className="no-orders">
          <WonderlandLandingPage isLoggedIn={isLoggedIn} />
        </div>
      ) : (
        <>
          {slug.length === 0 && (
            <div>
              <WonderlandLandingPage
                isLoggedIn={isLoggedIn}
                userId={userID}
                slug={slug}
              />
            </div>
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
          {slug.length === 3 && orderDetails && (
            <>
              {/* {showFAB && isHost && <FloatingEditButton onClick={handleEdit} />} */}

              {orderDetails ? (
                <>

 {/* {templateId && template ? (
  <div style={{ padding: "20px" }}>

    <div
      style={{
        backgroundImage: template.backgroundUrl
          ? `url('${template.backgroundUrl}')`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "300px",
        borderRadius: "12px",
        position: "relative",
        border: "5px solid red",
      }}
    >
   
      {template.fontUrls?.map((url, idx) => (
        <link key={idx} href={url} rel="stylesheet" />
      ))}

      
      {template.cssCode && (
        <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />
      )}

    
      {template.jsCode && (
        <div
          style={{ position: "relative", zIndex: 2 }}
          dangerouslySetInnerHTML={{
            __html: renderHTML(template.jsCode, formData),
          }}
        />
      )}
    </div>
  </div>
) : (
  <div
    className="invitation-container"
    style={{
      backgroundImage: `url(${imageBackGround?.src})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "400px",
      borderRadius: "12px",
      position: "relative",
    }}
  >
    <FinalInviteDisplay
      orderDetails={orderDetails}
      handleClick={handleClick}
      isHost={userType === "host"}
      openChat={() => setChatOpen(true)}
      clearNewMessage={() => setHasNewMessage(false)}
      hasNewMessage={hasNewMessage}
    />
  </div>
  
)} */}

{templateId && template ? (
  <div style={{ padding: "20px" }}>
    <div
      style={{
        backgroundImage: template.backgroundUrl
          ? `url('${template.backgroundUrl}')`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "300px",
        borderRadius: "12px",
        position: "relative", // key!
        border: "5px solid red",
      }}
    >
      {/* Fonts */}
      {template.fontUrls?.map((url, idx) => (
        <link key={idx} href={url} rel="stylesheet" />
      ))}

      {/* Inject template CSS */}
      {template.cssCode && (
        <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />
      )}

      {/* Inject template HTML */}
      {template.jsCode && (
        <div
          style={{ position: "relative", zIndex: 2 }}
          dangerouslySetInnerHTML={{
            __html: renderHTML(template.jsCode, formData),
          }}
        />
      )}


<div
  className="invite-image-wrapper"
 onClick={async () => {
    setChatOpen(true);
    chatOpenRef.current = true;
    setUnreadCount(0);

    // ✅ Update last seen
    const userRef = doc(db, "groups", eventId, "members", userIdd);
    await updateDoc(userRef, {
      lastSeenAt: serverTimestamp(),
    });
  }}
  style={{
    position: "absolute",
    cursor: "pointer",
    zIndex: 999,
  }}
>
  <Image
    src={chatIcon}
    alt="chat"
    className="invite-image"
    width={40}
    height={40}
  />

  {/* ✅ Show badge only if chat is closed and there are unread messages */}
  {!chatOpen && unreadCount > 0 && (
    <span
      style={{
        position: "absolute",
        top: "-4px",
        right: "-4px",
        minWidth: "18px",
        height: "18px",
        backgroundColor: "red",
        color: "white",
        fontSize: "12px",
        fontWeight: "bold",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2px",
      }}
    >
      {unreadCount}
    </span>
  )}
</div>


    </div>
  </div>
) : (
  <div >
    <div
      className="invitation-container"
      style={{
        backgroundImage: `url(${imageBackGround?.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "400px",
        borderRadius: "12px",
        position: "relative", // key!
      }}
    >
      <FinalInviteDisplay
        orderDetails={orderDetails}
        handleClick={handleClick}
        isHost={userType === "host"}
        openChat={() => setChatOpen(true)}
        clearNewMessage={() => setHasNewMessage(false)}
        hasNewMessage={hasNewMessage}
      />

     
     {/* Chat Icon */}
<div
  className="invite-image-wrapper"
 onClick={async () => {
    setChatOpen(true);
    chatOpenRef.current = true;
    setUnreadCount(0);

    // ✅ Update last seen
    const userRef = doc(db, "groups", eventId, "members", userIdd);
    await updateDoc(userRef, {
      lastSeenAt: serverTimestamp(),
    });
  }}
  style={{
    position: "absolute",
    cursor: "pointer",
    zIndex: 999,
  }}
>
  <Image
    src={chatIcon}
    alt="chat"
    className="invite-image"
    width={40}
    height={40}
  />

  {!chatOpen && unreadCount > 0 && (
    <span
      style={{
        position: "absolute",
        top: "-4px",
        right: "-4px",
        minWidth: "18px",
        height: "18px",
        backgroundColor: "red",
        color: "white",
        fontSize: "12px",
        fontWeight: "bold",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2px",
      }}
    >
      {unreadCount}
    </span>
  )}
</div>


    </div>
  </div>
)}




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
                        <div className="invite-buttons">
                          <button className="btn-explore" onClick={handleClick}>
                            <span className="icon-bg-explore">
                              <Image src={shareinvitaion} alt="Explore" className="icon-img" />
                            </span>
                            <span>Explore Themes</span>
                          </button>

                          <button
                            className="button-share"
                            onClick={goToSharePage}
                          >
                            <span>Share Invitation</span>
                            <span className="icon-bg-share">
                              <Image
                                src={whatshare}
                                alt="WhatsApp"
                                className="icon-img"
                              />
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isHost ? (
                    <GuestListPreview
                      guestList={guestList}
                      loading={loading}
                      userType={userType}
                      hostData={orderDetails}
                      urlParams={urlParams}
                    />
                  ) : hasSubmitted ? (
                    <GuestListPreview
                      guestList={guestList}
                      loading={loading}
                      userType={userType}
                      hostData={orderDetails}
                      urlParams={urlParams}
                    />
                  ) : (
                     <div
                      ref={rsvpRef}
                    >

                      <GuestRSVPForm
                        highlightRSVPButtons={highlightRSVPButtons}
                        setHighlightRSVPButtons={setHighlightRSVPButtons}
                        hostData={orderDetails}
                        rsvpGuestName={guestDetails?.name || ""}
                        userType={userType}
                        guestList={guestList}
                        loading={loading}
                        userId={userID}
                        eventId={urlParams.eventId}
                        hasSubmitted={hasSubmitted}
                        setHasSubmitted={setHasSubmitted}
                        setShowPopupGuest={setShowPopupGuest}
                        onSubmit={(data) => {
                          const payload = {
                            ...data,
                            rsvpId: id,
                            userId: secondId,
                          };
                          localStorage.setItem(
                            `rsvp_submitted_${id}_${secondId}`,
                            "true"
                          );
                          setHasSubmitted(true);
                        }}
                      />
                    </div>
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
                         userName={
                          userType === "host"
                            ? orderDetails?.Name
                            : guestDetails?.name
                        }
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
                    {/* <button
                      className="click-now-btn"
                      onClick={() => setShowLuckyDrawPopup(true)}
                    >
                      Click Now
                    </button> */}
                    <button
                      className="click-now-btn"
                      onClick={() => {
                        if (!hasSubmitted) {
                          // RSVP submit nahi hua → highlight effect
                          setHighlightRSVPButtons(true);
                          setTimeout(
                            () => setHighlightRSVPButtons(false),
                            1500
                          ); // 1.5 sec highlight
                          return;
                        }
                        setShowLuckyDrawPopup(true); // RSVP submit hua → normal behaviour
                      }}
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
                    style={{ width: 70, height: 50 }}
                  />
                  Celebration Wall
                </h2>

                <p style={styles.subheading}>
                  A wall filled with your party’s happiest moments and heartfelt
                  messages.
                </p>

                {/* Action Buttons */}
                <div className="tabs-container" style={styles.tabsContainer}>
                  {/* {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!hasSubmitted) {
                          setHighlightRSVPButtons(true);
                          setTimeout(() => setHighlightRSVPButtons(false), 1000);
                          return; // RSVP submit nahi hua → button ka kaam nahi chalega
                        }

                        if (action.title === "Upload Pictures") {
                          const input = document.getElementById("imageUploadInput");
                          if (input) {
                            input.value = "";
                            input.click();
                          }
                        } else {
                          handleActionClick(action.title);
                        }
                      }}
                      style={{
                        ...styles.actionButton,
                        ...(highlightRSVPButtons ? { border: "2px solid red" } : {}),
                      }}
                    >
                      <Image src={action.image} alt={action.title} style={styles.iconStyle} />
                      <span style={styles.buttonLabel}>{action.title}</span>
                    </button>
                  ))} */}
                    {actions.map((action, index) => (
  <button
    key={index}
    onClick={() => {
      // Guest ke liye: RSVP check
      if (userType !== "host" && !hasSubmitted) {
        setHighlightRSVPButtons(true);
        setTimeout(() => setHighlightRSVPButtons(false), 1000);
        return; // RSVP submit nahi hua → button ka kaam nahi chalega
      }

      // Upload Pictures
      if (action.title === "Upload Pictures") {
        const input = document.getElementById("imageUploadInput");
        if (input) {
          input.value = "";
          input.click();
        }
      } else {
        handleActionClick(action.title);
      }
    }}
    style={{
      ...styles.actionButton,
    }}
  >
    <Image src={action.image} alt={action.title} style={styles.iconStyle} />
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
                            src={item.webpUrl}
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
                  <div
                    className="custom-lightbox"
                    onClick={() => setIsImageOpen(false)}
                  >
                    <div
                      className="lightbox-inner"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div {...handlers} className="lightbox-content">
                        <button
                          className="close-btn"
                          onClick={() => setIsImageOpen(false)}
                        >
                          ✖
                        </button>

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

                        <img
                          src={selectedImage.imageUrl}
                          alt=""
                          className="lightbox-img"
                        />
                        {selectedImage.name && (
                          <p className="lightbox-name">
                            Shared BY : {selectedImage.name}
                          </p>
                        )}
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
                            onClick={() =>
                                downloadFile(selectedImage.imageUrl)
                            }
                          >
                            <Image
                              src={downloadicon}
                              alt="Download"
                              style={{ width: 30, height: 30 }}
                            />
                          </button>

                          {selectedImage.userId === userID && (
                            // <button
                            //   className="lightbox-btn"
                            //   onClick={() => handleDeleteImage(selectedImage._id, selectedImage.imageType)}
                            // >
                             <button
  className="lightbox-btn"
  onClick={(e) => {
    e.stopPropagation();
    setDeleteTarget({
      imageId: selectedImage._id,
      imageType: selectedImage.imageType
    });
    setShowDeletePopup(true);
  }}
>
  <Image src={deletebtn} alt="Delete" style={{ width: 30, height: 30 }} />
</button>

                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {showDeletePopup && (
  <div className="deletepopup-overlay">
                  <div className="deletepopup">
                    <h3>Confirm Delete</h3>
                    <p>Are You Sure You Want To Delete This Photo?</p>
                    <div className="deletepopup-buttons">
                      <button
                        className="deletecancel-btn"
                        onClick={() => setShowDeletePopup(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="deletedelete-btn"
                        onClick={() => {
                          handleDeleteImage(
                            deleteTarget.imageId,
                            deleteTarget.imageType
                          );
                          setShowDeletePopup(false);
                        }}

                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
                   
                      <LuckyDrawForm
                        hostData={orderDetails}
                        onClose={() => {
                          setShowLuckyDrawPopup(false);
                          setRefetchLuckyDraw(!refetchLuckyDraw);
                        }}
                      />
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
          hostData={hostData}
            guestList={guestList}
            onClose={() => setShowPopupGuest(false)}
          />
        </>
      )}
             <>
    

        {/* Chat UI */}
       {chatOpen && (
  <div className="chat-overlay">
    <div className="chat-header">
      <div className="chat-user-info">
        <h3>Group Chat</h3>
        <span>{orderDetails?.Name}</span>
        <span>{orderDetails?.eventType} </span>
      </div>
      <button className="chat-close-btn"  onClick={() => {
    setChatOpen(false);
    chatOpenRef.current = false;
  }}>×</button>
    </div>

    <div className="chat-messages">
      {messages.map((msg) => {
        const isSender = msg.senderPhoneNumber === userPhoneNumber;
        return (
          <div
            key={msg.id}
            className={`chat-message ${isSender ? "sender" : "receiver"}`}
          >
            <div className="chat-bubble">
              <div className="chat-sender">+91 {msg.senderPhoneNumber}</div>
              <div className="chat-text">{msg.text}</div>
              <div className="chat-time">
                {msg.sentAt?.toDate
                  ? new Date(msg.sentAt.toDate()).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : ""}
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Input + Emoji */}
    <div className="chat-input-container">
      <button
        type="button"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="emoji-btn"
      >
        ☺
      </button>

      <textarea
        value={text}
        ref={textareaRef}
        className="chat-input"
        rows={1}
        onChange={(e) => {
          setText(e.target.value);
          if (e.target.value.length > 0) {
            setShowEmojiPicker(false);
          }
        }}
        onInput={(e) => {
          e.target.style.height = "auto";
          const newHeight = Math.min(e.target.scrollHeight, 120);
          e.target.style.height = newHeight + "px";
        }}
        placeholder="Type your message..."
      />

      <button onClick={sendMessage} className="chat-send-btn">➤</button>
    </div>

    {showEmojiPicker && (
      <div className="emoji-container">
        <EmojiPicker
          searchDisabled={true}
          onEmojiClick={(emojiData) => {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const newText =
              text.substring(0, start) +
              emojiData.emoji +
              text.substring(end);

            setText(newText);
            setTimeout(() => {
              textarea.focus();
              textarea.selectionStart = textarea.selectionEnd = start + emojiData.emoji.length;
            }, 0);
          }}
        />
      </div>
    )}
  </div>
)}

      </>
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
    padding: 5,
    fontFamily: "sans-serif",
    maxWidth: 480,
    margin: "auto",
    backgroundColor: "white",
  },
  heading: {
    fontSize: 26,
    fontWeight: 700,
    color: '#97538C',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 15,
    padding: "0px 10px 0px 10px",
    marginBottom: 20,
    fontWeight: 400,
    color: '#97538C',
    textAlign: 'center',
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
    fontSize: 11,
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
