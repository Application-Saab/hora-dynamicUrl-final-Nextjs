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
import { downloadFile } from "@/utils/downloadFile";
import FloatingEditButton from "@/components/FloatingActionButton/FAB";
import { FaArrowLeft } from "react-icons/fa";
import "../photo-gallery/gallery.css";
import {
  BASE_URL,
  CREATE_GUEST_BY_EVENTID,
  GET_EVENT_IMAGES,
  GET_GUEST_DETTAILS,
  UPLOAD_IMAGES_SELF,
  UPLOAD_THANKYOU_NOTE,
  GET_ALL_TEMPLATES,
  GET_USER_BY_ID,
} from "@/utils/apiconstants";
import { useRouter } from "next/router";
import html2canvas from "html2canvas";
import LuckyDrawForm from "../lucky-draw/index";
import LuckDrawBanner from "@/assets/LuckdrawBanner.jpg";
import emojiIcon from "@/assets/Emoji.png";
import sendIcon from "@/assets/sendicon.png";
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
import InvitationModal from "@/components/InvitationModal";
import FinalInviteDisplay from "@/components/FinalInviteDisplay";
import GuestListPreview from "@/components/GuestListPreview";
import ThankYouNotePopup from "@/components/ThankYouNotePopup";
import RSVPPopup from "@/components/RSVPPopup";
import GuestRSVPForm from "@/components/GuestRSVPForm";
import WonderlandLandingPage from "@/components/wonderland/WonderlandLandingPage";
import { eventOptions } from "@/utils/constants";
import chatIcon from "@/assets/chaticon.png";
import EmojiPicker from "emoji-picker-react";
import { FaRegKeyboard } from "react-icons/fa6";
import SuccessIconImage from "@/assets/success_image_upload.png";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { getToken, onMessage, getMessaging } from "firebase/messaging";
import LazyImage from "@/components/LazyImage";
import { FaImage } from "react-icons/fa";
import { usePathname } from "next/navigation";

import A2HSPrompt from "../../components/AddToHomeScreen";

const VAPID_KEY =
  "BPpalhQL4beB7GAJYcjp7l9uU0ngzjaXpCwCstXa77g8wPiWnxQM7jVS4ffOePSje9nBx6yRWXWX-iY2fw5A2OA";

const dummayImageGallery = [
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
  photo2,
  photo5,
  photo6,
];

const InvitationCard = () => {
  const hasSeenMessages = useRef(true);
  const prevMessageLength = useRef(0);

  const rsvpRef = useRef(null);
  const router = useRouter();
  const { page, id: queryId } = router.query;
  const fileInputRef = useRef(null);

  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    if (pathname === "/wonderland") {
      if (typeof window !== "undefined") {
        if (localStorage.getItem("addToHomeScreenPopup") !== "true") {
          setShowInstall(true);
        }
      }
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, [pathname]);

  const handleInstallClick = async () => {
    setShowInstall(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("addToHomeScreenPopup", "true");
    }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // Prevent Chrome auto prompt
      setDeferredPrompt(e);
      setShowInstall(true); // Show your custom button
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const slug = Array.isArray(queryId) ? queryId : queryId?.split("/") || [];
  const userID = localStorage.getItem("userID");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const token = localStorage.getItem("token");
  const [errorAddGuest, setErrorAddGuest] = useState("");
  const [openRsvpList, setOpenRsvpList] = useState(false);
  const [errorGetGuest, setErrorGetGuest] = useState(null);
  const [guestDetails, setGuestDetails] = useState({});
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showNotifyPermissionMsg, setNotifyPermissionMsg] = useState(false);
  const [userData, setUserData] = useState({});
  console.log('%c [ userData ]-159', 'font-size:13px; background:pink; color:#bf2c9f;', userData)
  console.log(
    "%c [ guestDetails ]-60",
    "font-size:13px; background:pink; color:#bf2c9f;",
    guestDetails
  );
  const [refetchAddGuest, setRefetchAddGuest] = useState(false);
  const [refetchLoginGuest, setRefectchLoginGuest] = useState(false);

  const [refetchLuckyDraw, setRefetchLuckyDraw] = useState(false);
  const [eventAllImages, setEventAllImages] = useState([]);
  const [refetchLuckyDrawHostDelete, setRefetchLuckyDrawHostDelete] =
    useState(false);
  const [refetchLuckyDrawGuestDelete, setRefetchLuckyDrawGuestDelete] =
    useState(false);
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

  const [emojiWidth, setEmojiWidth] = useState(400);

  useEffect(() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth > 450) {
        setEmojiWidth(450);
      } else if (screenWidth <= 450) {
        setEmojiWidth(screenWidth - 20);
      } else {
        setEmojiWidth(screenWidth - 50);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

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
          setEventAllImages([]);
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
    // Initial call
    fetchEventImages();

    // Call every 3 minute
    const interval = setInterval(fetchEventImages, 180000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [
    urlParams.eventUserId,
    urlParams.eventId,
    urlParams.userType,
    refetchEventImages,
    refetchLuckyDraw,
    refetchLuckyDrawHostDelete,
    refetchLuckyDrawGuestDelete,
  ]);

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
          setGuestDetails([]);
          setErrorGetGuest(data.message || "Failed to fetch guest");
        } else {
          setGuestDetails(data.data || []);
          if (data?.data?.rsvpStatus) {
            setHasSubmitted(true);
            localStorage.setItem(
              `rsvp_submitted_${urlParams.eventId}_${userID}`,
              "true"
            );
          }
          // if (urlParams.userType === "guest" && data.data && data.data.name) {
          //   localStorage.setItem("wonderLandUserName", data.data?.name || "");
          // }
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
    refetchLuckyDrawGuestDelete,
    hasSubmitted,
  ]);


    useEffect(() => {
      const fetchUserAccountDetails = async () => {
        if (!userID) {
          console.log('User id not available')
          return;
        }
  
        try {
          const response = await fetch(`${BASE_URL}${GET_USER_BY_ID}/${userID}`, {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (data.error) {
            setUserData({});
            console.log(data.message || "Failed to fetch guests");
          } else {
            setUserData(data.data || {});
            if (data.data && data.data.name) {
              localStorage.setItem("wonderLandUserName", data.data?.name || "");
            }
          }
        } catch (err) {
          console.log("Error fetching guests: " + err.message);
        }
      };
      // Initial call
      fetchUserAccountDetails();
    }, [
      userID,
      urlParams.eventId,
      hasSubmitted,
      refetchAddGuest
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
      if (urlParams.eventUserId === userID) {
        router.push(
          `/wonderland?id=${urlParams.eventUserId}/${urlParams.eventId}/host`
        );
        return;
      }
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
  const [showImageUploadInfo, setShowImageUploadInfo] = useState(false);
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyU06csCT5OIJzO3F9VGTjCIli74-k2puAp8AhybJGHPYvyEmuQmJlvPf60wHsy--NGGg/exec"; // no query params

  const [showLuckyDrawPopup, setShowLuckyDrawPopup] = useState(false);

  const [id, setId] = useState(null);
  const [secondId, setSecondId] = useState("");

  const [userType, setUserType] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  const [messages, setMessages] = useState([]);
  console.log(
    "%c [ messages ]-332",
    "font-size:13px; background:pink; color:#bf2c9f;",
    messages
  );
  const [text, setText] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const chatOpenRef = useRef(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [role, setRole] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const textareaRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // ✅ jab bhi viewport change hoga, input ko visible rakho
      textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    router.push(
      `/templates?eventId=${urlParams.eventId}&eventUserId=${urlParams.eventUserId}&userType=${urlParams.userType}`
    );
  };

  const goToSharePage = () => {
    router.push({
      pathname: "/wonderland/ShareInvitation", // tumhare ShareInvitation page ka route
      query: { data: JSON.stringify(orderDetails) },
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

  useEffect(() => {
    if (!router.isReady) return;

    // const queryId = router.query.id;
    const eventId = urlParams?.eventId;
    if (!eventId) return;

    fetchOrderDetails(eventId);
  }, [
    router.isReady,
    urlParams?.eventId,
    urlParams,
    refetchLuckyDraw,
    refetchLuckyDrawHostDelete,
    refetchLoginGuest,
  ]);

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
    } catch (err) {
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
        const selectedTemplate = data.templates.find(
          (tpl) => tpl._id === templateId
        );

        if (!selectedTemplate) throw new Error("Template not found");

        // backgroundUrl can be either in root or inside configs
        const backgroundUrl =
          selectedTemplate.backgroundUrl ||
          selectedTemplate.configs?.backgroundUrl ||
          null;

        setTemplate({
          cssCode: selectedTemplate.configs?.cssCode || "",
          jsCode: selectedTemplate.configs?.jsCode || "",
          fontUrls: selectedTemplate.configs?.fontUrls
            ? JSON.parse(selectedTemplate.configs.fontUrls)
            : [],
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
      setNoteBy(userType === "host" ? orderDetails?.Name : guestDetails?.name)
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
    setShowImageUploadInfo(true);

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
            setRefetchLuckyDrawHostDelete((prev) => !prev);
          } else {
            setRefetchLuckyDrawGuestDelete((prev) => !prev);
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
    if (noteTitle.trim() === "") {
      setErrorMsg("Please write a thank you message.");
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
    setRole(urlParams.userType);

    registerUser(urlParams.eventId, urlParams.eventUserId, urlParams.userType);
  }, [urlParams]);

  useEffect(() => {
    if (eventId && userID) {
      listenToMessages(eventId, userID);
    }
  }, [eventId, userID]);

  const hasSetUpMessageListener = useRef(false);
  useEffect(() => {
    const chatContainer = document.querySelector(".chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!userID || typeof window === "undefined") return;

    const requestPermissionAndSaveToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const messagingInstance = getMessaging();
        const token = await getToken(messagingInstance, {
          vapidKey: VAPID_KEY,
        });

        console.log("FCM Token:", token);

        if (token) {
          await setDoc(
            doc(db, "fcmTokens", userID),
            { token },
            { merge: true }
          );
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

        setTimeout(() => {
          new Notification("Test Message", {
            body: payload.notification?.body || "You got a message!",
            icon: "/new_logo_light.png",
          });
        }, 3000);
      } catch (err) {
        console.error("FCM Error:", err);
      }
    };

    requestPermissionAndSaveToken();
  }, [userID]);

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
        lastSeenAt: new Date(),
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (
        Notification.permission === "denied" ||
        Notification.permission === "default"
      ) {
        setNotifyPermissionMsg(true);
      } else {
        setNotifyPermissionMsg(false);
      }
    }
  }, []);

  const chatMessagesRef = useRef(null);
  useEffect(() => {
    if (chatOpen && chatMessagesRef.current) {
      const container = chatMessagesRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, chatOpen]); // 🔁 Trigger when messages or chatOpen changes

  useEffect(() => {
    if (eventId && userId) {
      const unsubscribe = listenToMessages(eventId, userId);
      return () => unsubscribe();
    }
  }, [eventId, userId]);

  useEffect(() => {
    chatOpenRef.current = chatOpen;
    if (chatOpen) {
      setUnreadCount(0);

      // ✅ Update lastSeenAt in Firestore
      if (eventId && userId) {
        const userRef = doc(db, "groups", eventId, "members", userId);
        setDoc(userRef, { lastSeenAt: new Date() }, { merge: true });
      }
    }
  }, [chatOpen, eventId, userId]);

  const lastSeenAtRef = useRef(null);
  const notifiedMessageIdsRef = useRef(new Set()); // ✅ Track notified message IDs

  const listenToMessages = (eventId, userId) => {
    const messagesRef = collection(db, "groups", eventId, "messages");
    const q = query(messagesRef, orderBy("sentAt", "asc"));
    const userRef = doc(db, "groups", eventId, "members", userId);

    const unsubscribeUser = onSnapshot(userRef, (memberSnap) => {
      lastSeenAtRef.current =
        memberSnap.exists() && memberSnap.data().lastSeenAt
          ? memberSnap.data().lastSeenAt.toDate()
          : null;
    });

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const unreadMessages = msgs.filter((msg) => {
        if (!msg.sentAt || !msg.senderId) return false;
        if (msg.senderId === userID) return false;

        const msgDate = msg.sentAt.toDate ? msg.sentAt.toDate() : msg.sentAt;
        return lastSeenAtRef.current ? msgDate > lastSeenAtRef.current : true;
      });

      if (!chatOpenRef.current && unreadMessages.length > 0) {
        unreadMessages.forEach((msg) => {
          const alreadyNotified = notifiedMessageIdsRef.current.has(msg.id);

          if (Notification.permission === "granted" && !alreadyNotified) {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification(
                `New message from ${msg.senderName}`,
                {
                  body: msg.text,
                  icon: "/new_logo_light.png", // ensure correct path
                }
              );
            });

            // ✅ Mark message as notified
            notifiedMessageIdsRef.current.add(msg.id);
          }
        });
      }

      if (chatOpenRef.current) {
        setUnreadCount(0);
      } else {
        setUnreadCount(unreadMessages.length);
      }

      setMessages(msgs);
    });

    return () => {
      unsubscribeUser();
      unsubscribeMessages();
    };
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    if (!eventId || !userID) {
      console.warn("Missing eventId or userId — cannot send message.");
      return;
    }
    const localSenderName = localStorage.getItem("wonderLandUserName") || "";

    await addDoc(collection(db, "groups", eventId, "messages"), {
      text,
      senderId: userID,
      // senderName:
      //   urlParams?.userType === "host" ? orderDetails?.Name : localSenderName,
      senderName: localSenderName ? localSenderName : userData?.name,
      senderPhoneNumber: localStorage.getItem("mobileNumber"),
      sentAt: new Date(),
      sentAt: serverTimestamp(),
    });
    console.log(
      "%c [ addDoc ]-1195",
      "font-size:13px; background:pink; color:#bf2c9f;",
      addDoc
    );

    setText("");
    setShowEmojiPicker(false);
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
          <WonderlandLandingPage
            setRefectchLoginGuest={setRefectchLoginGuest}
            isLoggedIn={isLoggedIn}
          />
        </div>
      ) : (
        <>
          {slug.length === 0 && (
            <div>
              <WonderlandLandingPage
                isLoggedIn={isLoggedIn}
                userId={userID}
                slug={slug}
                setRefectchLoginGuest={setRefectchLoginGuest}
              />
            </div>
          )}
          {slug.length === 1 && (
            <div>
              <WonderlandLandingPage
                isLoggedIn={isLoggedIn}
                userId={userID}
                slug={slug}
                setRefectchLoginGuest={setRefectchLoginGuest}
              />
            </div>
          )}
          {slug.length === 2 && page === "create-invite" && (
            <div>
              <WonderlandLandingPage
                isLoggedIn={isLoggedIn}
                userId={userID}
                slug={slug}
                setRefectchLoginGuest={setRefectchLoginGuest}
              />
            </div>
          )}
          {slug.length === 3 && orderDetails && (
            <>
              {showFAB && isHost && <FloatingEditButton onClick={handleEdit} />}
              {/* <A2HSPrompt /> */}

              {orderDetails ? (
                <>
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
                          <style
                            dangerouslySetInnerHTML={{
                              __html: template.cssCode,
                            }}
                          />
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
                            if (userType !== "host" && !hasSubmitted) {
                              setHighlightRSVPButtons(true);
                              setTimeout(
                                () => setHighlightRSVPButtons(false),
                                1500
                              );
                              return;
                            }
                            setChatOpen(true);
                            chatOpenRef.current = true;
                            setUnreadCount(0);

                            const userRef = doc(
                              db,
                              "groups",
                              eventId,
                              "members",
                              userID
                            );
                            await updateDoc(userRef, {
                              lastSeenAt: serverTimestamp(),
                            });
                          }}
                          style={{
                            position: "absolute",
                            cursor:
                              userType === "host" || hasSubmitted
                                ? "pointer"
                                : "not-allowed", // UX ke liye
                            zIndex: 990,
                          }}
                        >
                          <Image
                            src={chatIcon}
                            alt="chat"
                            className="invite-image"
                            width={50}
                            height={50}
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
                  ) : (
                    <div>
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
                        <div
                          className="invite-image-wrapper"
                          onClick={async () => {
                            if (userType !== "host" && !hasSubmitted) {
                              setHighlightRSVPButtons(true);
                              setTimeout(
                                () => setHighlightRSVPButtons(false),
                                1500
                              );
                              return;
                            }
                            setChatOpen(true);
                            chatOpenRef.current = true;
                            setUnreadCount(0);

                            const userRef = doc(
                              db,
                              "groups",
                              eventId,
                              "members",
                              userID
                            );
                            await updateDoc(userRef, {
                              lastSeenAt: serverTimestamp(),
                            });
                          }}
                          style={{
                            position: "absolute",
                            cursor:
                              userType === "host" || hasSubmitted
                                ? "pointer"
                                : "not-allowed",
                            zIndex: 990,
                          }}
                        >
                          <Image
                            src={chatIcon}
                            alt="chat"
                            className="invite-image"
                            width={50}
                            height={50}
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
                          {/* <button className="btn-explore" onClick={handleClick}>
                            <span className="icon-bg-explore">
                              <Image src={shareinvitaion} alt="Explore" className="icon-img" />
                            </span>
                            <span>Explore Themes</span>
                          </button> */}

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
                    <div ref={rsvpRef}>
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
                    <button
                      className="click-now-btn"
                      onClick={() => {
                        if (!hasSubmitted) {
                          setHighlightRSVPButtons(true);
                          setTimeout(
                            () => setHighlightRSVPButtons(false),
                            1500
                          );
                          return;
                        }
                        setShowLuckyDrawPopup(true);
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
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (userType !== "host" && !hasSubmitted) {
                          setHighlightRSVPButtons(true);
                          setTimeout(
                            () => setHighlightRSVPButtons(false),
                            1000
                          );
                          return;
                        }

                        // Upload Pictures
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
                      style={{
                        ...styles.actionButton,
                      }}
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
                  {/* {wallUploading && (
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
                  )} */}

                  <div
                    className="thumbnail-gallery"
                    style={{
                      // opacity: wallUploading ? 0.5 : 1,
                      margin: "20px auto",
                    }}
                  >
                    {eventAllImages.length === 0 ? (
                      <div className="event-grid">
                        {dummayImageGallery?.map((item, index) => (
                          <LazyImage
                            key={index + 1}
                            src={item.src}
                            alt={`Event Image ${index + 1}`}
                            wrapperClassName="masonry-item"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="thumbnail-gallery">
                        <div className="event-grid">
                          {eventAllImages.map((thumbnail, indexOnPage) => (
                            <LazyImage
                              key={thumbnail._id}
                              src={thumbnail.webpUrl}
                              alt={`Event Image ${indexOnPage + 1}`}
                              wrapperClassName="masonry-item"
                              onClick={() => {
                                setSelectedImage(thumbnail); // Image select karo
                                setIsImageOpen(true); // Lightbox open karo
                              }}
                            />
                          ))}
                        </div>
                      </div>
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
                          src={selectedImage.webpUrl}
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
                            onClick={() => downloadFile(selectedImage.imageUrl)}
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
                                  imageType: selectedImage.imageType,
                                });
                                setShowDeletePopup(true);
                              }}
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
                  </div>
                )}
              </div>

              {showDeletePopup && (
                <div className="deletepopup-overlay">
                  <div className="deletepopup">
                    <h3>Confirm Delete</h3>
                    <p>Are you sure you want to delete this photo?</p>
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
        {chatOpen && (
          <div className="chat-overlay">
            <div className="chat-header">
              <div className="chat-user-info">
                <button
                  className="btn back-arrow-chat"
                  onClick={() => {
                    setChatOpen(false);
                    chatOpenRef.current = false;
                  }}
                >
                  <FaArrowLeft fontSize={16} />
                </button>
                <span className="mx-2">{`${orderDetails?.Name}'s`}</span>{" "}
                <span>{orderDetails?.eventType} </span>
              </div>
            </div>

            <div className="chat-messages" ref={chatMessagesRef}>
              {messages.map((msg) => {
                const isSender = msg.senderPhoneNumber === userPhoneNumber;
                const senderName =
                  msg.senderName

                return (
                  <div
                    key={msg.id}
                    className={`chat-message ${
                      isSender ? "sender" : "receiver"
                    }`}
                  >
                    {/* Receiver avatar (left side) */}
                    {!isSender && (
                      <div className="chat-avatar">
                        {senderName
                          ? senderName.charAt(0).toUpperCase()
                          : msg.senderPhoneNumber.charAt(3)}
                      </div>
                    )}

                    {/* Chat bubble */}
                    <div className="chat-bubble">
                      <div className="chat-sender">
                        {senderName
                          ? senderName
                          : `+91 ${msg.senderPhoneNumber.slice(0, -4)}XXXX`}
                      </div>
                      <div className="chat-text">{msg.text}</div>
                      <div className="chat-time">
                        {msg.sentAt?.toDate
                          ? new Date(msg.sentAt.toDate()).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )
                          : ""}
                      </div>
                    </div>

                    {/* Sender avatar (right side) */}
                    {isSender && (
                      <div className="chat-avatar">
                        {senderName
                          ? senderName.charAt(0).toUpperCase()
                          : msg.senderPhoneNumber.charAt(3)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="chat-input-container">
              <button
                type="button"
                onClick={() => {
                  if (showEmojiPicker) {
                      setShowEmojiPicker(false);
                      setTimeout(() => {
                        textareaRef.current?.focus();
                      }, 0);
                    } else {
                      setShowEmojiPicker(true);
                      textareaRef.current?.blur();
                    }
                }}
                className="emoji-btn"
              >
                {showEmojiPicker ? (
                  <FaRegKeyboard fontSize={20} />
                ) : (
                  <Image src={emojiIcon} alt="Emoji" className="emoji-icon" />
                )}

                <div>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />

                  {/* Upload button */}
                  {/* <button
        onClick={handleButtonClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        <FaImage style={{ marginRight: '8px' }} />
        Upload Image
      </button> */}
                </div>
              </button>

              <textarea
                value={text}
                ref={textareaRef}
                className="chat-input"
                rows={1}
                onFocus={() => {
                 if (showEmojiPicker) {
                      setShowEmojiPicker(false);
                    }
                     // ✅ focus karte hi input ko viewport me le aa
                    setTimeout(() => {
                      textareaRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "end",
                      });

                      // ✅ Extra offset ke liye manual scroll adjust
                      window.scrollBy(0, -180); // 80px upar le ja (adjust kar sakta hai device ke hisaab se)
                    }, 300);
                }}
                onChange={(e) => {
                  setText(e.target.value);
                  if (e.target.value.length > 0) {
                      setShowEmojiPicker(false); // typing se emoji picker band ho jaye
                    }
                }}
                onInput={(e) => {
                  e.target.style.height = "auto"; // reset height first
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + "px"; // grow up to 120px max
                }}
                placeholder="Type message here..."
              />

              <button
                onClick={() => {
                  sendMessage();
                  if (textareaRef.current) {
                    textareaRef.current.style.height = "auto"; // reset size after send
                  }
                }}
                className="chat-send-btn"
              >
                <Image src={sendIcon} alt="Send" className="send-icon" />
              </button>

              {/* <textarea
          value={text}
          ref={textareaRef}
          className="chat-input"
          rows={1}
          onFocus={() => {
            // don't hide emoji picker when focusing textarea
          }}
          onChange={(e) => setText(e.target.value)}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
          placeholder="Type message here..."
        />

        <button onClick={sendMessage} className="chat-send-btn">
          <Image src={sendIcon} alt="Send" className="send-icon" />
        </button> */}
            </div>

            {showEmojiPicker && (
              <div
                className="emoji-container"
                onMouseDown={(e) => e.preventDefault()}
                onTouchStart={(e) => e.preventDefault()}
              >
                {/* <EmojiPicker
  width={emojiWidth}
  searchDisabled={true}
  onEmojiClick={(emojiData) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Use functional state update to prevent race conditions
    setText((prevText) => {
      const newText =
        prevText.substring(0, start) +
        emojiData.emoji +
        prevText.substring(end);

      // Update cursor position after inserting emoji
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd =
          start + emojiData.emoji.length;
        textarea.focus();
      });

      return newText;
    });
  }}
/> */}

                <EmojiPicker
                  width={emojiWidth}
                  searchDisabled={true}
                  onEmojiClick={(emojiData) => {
                    const textarea = textareaRef.current;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;

                    setText((prevText) => {
                      const newText =
                        prevText.substring(0, start) +
                        emojiData.emoji +
                        prevText.substring(end);

                      // Update cursor position without focusing (prevents keyboard)
                      requestAnimationFrame(() => {
                        textarea.selectionStart = textarea.selectionEnd =
                          start + emojiData.emoji.length;
                      });

                      return newText;
                    });
                  }}
                />
              </div>
            )}
          </div>
        )}
      </>

      {showImageUploadInfo && (
        <div className="image-upload-popup-overlay">
          <div className="upload-image-popup">
            <h3>Upload Complete</h3>
            <div className="d-flex justify-content-center my-2">
              <Image src={SuccessIconImage} alt="Success" />
            </div>
            <p>
              Your images are uploading will be reflect on event wall after some
              time.
            </p>
            <div className="d-flex justify-content-center">
              <button
                className="upload-image-popup-btn"
                onClick={() => setShowImageUploadInfo(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      
      {pathname === "/wonderland" && showInstall && (
        <div
          className="add-to-home-popup"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 12,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            <h2>Add to Home Screen</h2>
            <p>Install this app on your device for a better experience.</p>
            <button
              onClick={handleInstallClick}
              style={{ padding: "10px 20px", marginTop: 16 }}
            >
              Add to Home Screen
            </button>
            <br />
            <button
              onClick={() => {
                setShowInstall(false);
                localStorage.setItem("addToHomeScreenPopup", "true");
              }}
              style={{
                marginTop: 12,
                background: "none",
                border: "none",
                color: "#888",
                cursor: "pointer",
              }}
            >
              Maybe later
            </button>
          </div>
        </div>
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
    padding: 5,
    fontFamily: "sans-serif",
    maxWidth: 480,
    margin: "auto",
    backgroundColor: "white",
  },
  heading: {
    fontSize: 26,
    fontWeight: 700,
    color: "#97538C",
    textAlign: "center",
  },
  subheading: {
    fontSize: 15,
    padding: "0px 10px 0px 10px",
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
