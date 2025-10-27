"use client";
import React, { useState, useEffect, useRef } from "react";
import "./EventInvitation.css";
import { useSwipeable } from "react-swipeable";
import tabIcon1 from "@/assets/galleryicon.png";
import tabIcon2 from "@/assets/thankyouicon.png";
import imageBackground from "@/assets/imageBackground.jpg";
import imageBackGround from "@/assets/finalInviteBackground.webp";
import LuckDrawTicketBanner from "@/assets/lucky_draw_ticket_bg.jpg";
import Image from "next/image";
import whatshare from "@/assets/whatshare.png";
import { downloadFile } from "@/utils/downloadFile";
import FloatingEditButton from "@/components/FloatingActionButton/FAB";
import { FaArrowLeft } from "react-icons/fa";
import phoneImage from "@/assets/phoneImage.jpeg"
import shareinvitaion from "@/assets/shareinvitation.png"
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
import downloadicon from "@/assets/download-icon.svg";
import deletebtn from "@/assets/deletebtn.svg";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import photo8 from "@/assets/collage/photo8.png";
import "react-datepicker/dist/react-datepicker.css";
import InvitationModal from "@/components/InvitationModal";
import FinalInviteDisplay from "@/components/FinalInviteDisplay";
import GuestListPreview from "@/components/GuestListPreview";
import ThankYouNotePopup from "@/components/ThankYouNotePopup";
import RSVPPopup from "@/components/RSVPPopup";
import GuestRSVPForm from "@/components/GuestRSVPForm";
import WonderlandLandingPage from "@/components/wonderland-old/WonderlandLandingPage";
import { eventOptions } from "@/utils/constants";
import chatIcon from "@/assets/chaticon.png";
import EmojiPicker from "emoji-picker-react";
import { FaRegKeyboard } from "react-icons/fa6";
import SuccessIconImage from "@/assets/success_image_upload.png";
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
  serverTimestamp,
} from "firebase/firestore";

import Wonderlandvideo from "@/assets/Wonderlandvideo.mp4"

import { db } from "../../firebase";
import { getToken, onMessage, getMessaging } from "firebase/messaging";
import LazyImage from "@/components/wonderland/event-wall/LazyImage";
import { FaImage } from "react-icons/fa";
import { usePathname } from "next/navigation";

import A2HSPrompt from "../../components/AddToHomeScreen";
import { handleGroupClick } from "@/utils/unread";
import axios from "axios";
import EventwallGalleryItem from "@/components/wonderland-old/EventwallGalleryItem";
import MediaViewer from "./EventwalPopup";

const VAPID_KEY =
  "BPpalhQL4beB7GAJYcjp7l9uU0ngzjaXpCwCstXa77g8wPiWnxQM7jVS4ffOePSje9nBx6yRWXWX-iY2fw5A2OA";

const dummayImageGallery = [
  { _id: 1, isVideo: false, webpUrl : photo1?.src, imageUrl : photo1?.src },
  { _id: 2, isVideo: false, webpUrl : photo2?.src, imageUrl : photo2?.src },
  { _id: 3, isVideo: false, webpUrl : photo3?.src, imageUrl : photo3?.src },
  { _id: 4, isVideo: false, webpUrl : photo4?.src, imageUrl : photo4?.src },
  { _id: 5, isVideo: false, webpUrl : photo5?.src, imageUrl : photo5?.src },
  { _id: 6, isVideo: false, webpUrl : photo6?.src, imageUrl : photo6?.src },
  { _id: 7, isVideo: false, webpUrl : photo7?.src, imageUrl : photo7?.src },
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
 const popupStatus = localStorage.getItem("addToHomeScreenPopup");

 const [unreadCounts, setUnreadCounts] = useState({});
const [totalUnread, setTotalUnread] = useState(
  parseInt(localStorage.getItem("totalUnread") || "0")
);
useEffect(() => {
  const handleUpdate = () => {
    setTotalUnread(parseInt(localStorage.getItem("totalUnread") || "0"));
  };
  window.addEventListener("unreadCountChange", handleUpdate);
  return () => window.removeEventListener("unreadCountChange", handleUpdate);
}, []);

useEffect(() => {
  const handleUpdate = () => {
    setTotalUnread(parseInt(localStorage.getItem("totalUnread") || "0"));
  };
  window.addEventListener("unreadCountChange", handleUpdate);
  return () => window.removeEventListener("unreadCountChange", handleUpdate);
}, []);

useEffect(() => {
  if (pathname === "/wonderland") {
    if (typeof window !== "undefined") {

        
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);  // Store the deferred prompt for later
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }
}, [pathname]); 

const handleInstallClick = async () => {
   setShowInstall(false);

  //  if (typeof window !== "undefined") {
  //    localStorage.setItem("addToHomeScreenPopup", "true");
  //  }

   if (deferredPrompt) {
     // Show the install prompt
     deferredPrompt.prompt();
     const { outcome } = await deferredPrompt.userChoice;
     if (outcome === 'accepted') {
       localStorage.setItem("addToHomeScreenPopup", "true");
     } else {
       localStorage.setItem("addToHomeScreenPopup", "false");
     }

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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    total: 0,
    uploaded: 0,
    remaining: 0,
    percentage: 0,
  });

  const [showCheers, setShowCheers] = useState(false);
  const [showSpark, setShowSpark] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [hideCheers, setHideCheers] = useState(false);

  useEffect(() => {
    if (uploadProgress?.percentage === 100) {
      // Start Cheers animation after progress done
      setShowCheers(true);

      // Spark animation timing
      const sparkTimer = setTimeout(() => setShowSpark(true), 1300);

      // Done text timing
      const doneTimer = setTimeout(() => setShowDone(true), 1800);

      const hideCheersTimer = setTimeout(() => setHideCheers(true), 2500);

      const hideLoadingFull = setTimeout(() => setUploadProgress((prev) => ({
        ...prev,
        total: 0,
        uploaded: 0,
        remaining: 0,
        percentage: 0,
      })), 3500);

      return () => {
        clearTimeout(sparkTimer);
        clearTimeout(doneTimer);
        clearTimeout(hideCheersTimer);
        clearTimeout(hideLoadingFull);
      };
    } else {
      setShowCheers(false);
      setShowSpark(false);
      setShowDone(false);
      setHideCheers(false);
    }
  }, [uploadProgress?.percentage]);

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
    // const interval = setInterval(fetchEventImages, 180000);

    // // Cleanup interval on unmount
    // return () => clearInterval(interval);
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

  const [loadingThumbnails, setLoadingThumbnails] = useState(true);

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
  useEffect(() => {
  if (orderDetails && eventId && userID && hasSubmitted) {
    const userRef = doc(db, "groups", eventId, "members", userID);

    setDoc(
      userRef,
      {
        userId: userID,
        name: guestDetails?.name || orderDetails?.Name || "Guest",
        phoneNumber: userPhoneNumber,
        lastSeenAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}, [orderDetails, eventId, userID, hasSubmitted]);
function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return part;
  });
}


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
          externalTemplateImageUrl: data.externalTemplateImageUrl || "",
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
      setNoteBy(userData?.name);
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
  const selectedFiles = Array.from(e.target.files);
  if (!selectedFiles || selectedFiles.length === 0) return;

  setShowCheers(false);
  setUploading(true);
  const totalFiles = selectedFiles.length;
  let uploadedCount = 0;

  // Reset progress
  setUploadProgress({
    total: totalFiles,
    uploaded: 0,
    remaining: totalFiles,
    percentage: 0,
  });

  // Function to upload one file and append to state
  const uploadSingleFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", userID);
    formData.append("name", userData?.name || "");

    try {
      const response = await axios.put(
        `${BASE_URL}${UPLOAD_IMAGES_SELF}/${urlParams?.eventId}/self-uploaded`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`${file.name}: ${percent}%`);
          },
        }
      );

      // Increment uploaded count and update progress
      uploadedCount += 1;
      setUploadProgress((prev) => ({
        ...prev,
        uploaded: uploadedCount,
        remaining: totalFiles - uploadedCount,
        percentage: Math.round((uploadedCount / totalFiles) * 100),
      }));

      // Append the new image to eventAllImages immediately
      const newImage = response.data.data; // Array of one image
      if (newImage && Array.isArray(newImage)) {
        setEventAllImages((prev) => [...newImage, ...prev]);
      }

      return newImage; // Return for Promise.all (optional, for logging or error handling)
    } catch (err) {
      console.error(`Upload failed for ${file.name}:`, err.message);
      return null;
    }
  };

  // Upload all files in parallel
  const uploadResults = await Promise.all(selectedFiles?.map(uploadSingleFile));

  // Log failed uploads (optional)
  const failedUploads = uploadResults?.filter((result) => result === null);
  if (failedUploads.length > 0) {
    console.warn(`${failedUploads?.length} uploads failed`);
  }

  setUploading(false);
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
    setShowCheers(true);
    setUploadProgress((prev) => ({
        ...prev,
        total: 1,
      }))
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
      formData.append('name', noteBy || userData?.name);
      try {
        await fetch(
          `${BASE_URL}${UPLOAD_THANKYOU_NOTE}/${urlParams?.eventId}/thankyou-note`,
          {
            method: "PUT",
            headers: {
              Authorization: `${token}`,
            },
            body: formData,
          }
        );
        setUploadProgress((prev) => ({
        ...prev,
        percentage: 100,
      }))
        setRefetchEventImages(!refetchEventImages);
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

  // useEffect(() => {
  //   if (eventId && userID) {
  //     listenToMessages(eventId, userID);
  //   }
  // }, [eventId, userID]);

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
        if ("Notification" in window) {
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
        }else {
  console.log("Notifications are not supported on this browser");
}
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

  // useEffect(() => {
  //   if (eventId && userId) {
  //     const unsubscribe = listenToMessages(eventId, userId);
  //     return () => unsubscribe();
  //   }
  // }, [eventId, userId]);

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

  // const listenToMessages = (eventId, userId) => {
  //   const messagesRef = collection(db, "groups", eventId, "messages");
  //   const q = query(messagesRef, orderBy("sentAt", "asc"));
  //   const userRef = doc(db, "groups", eventId, "members", userId);

  //   const unsubscribeUser = onSnapshot(userRef, (memberSnap) => {
  //     lastSeenAtRef.current =
  //       memberSnap.exists() && memberSnap.data().lastSeenAt
  //         ? memberSnap.data().lastSeenAt.toDate()
  //         : null;
  //   });

  //   const unsubscribeMessages = onSnapshot(q, (snapshot) => {
  //     const msgs = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     const unreadMessages = msgs.filter((msg) => {
  //       if (!msg.sentAt || !msg.senderId) return false;
  //       if (msg.senderId === userID) return false;

  //       const msgDate = msg.sentAt.toDate ? msg.sentAt.toDate() : msg.sentAt;
  //       return lastSeenAtRef.current ? msgDate > lastSeenAtRef.current : true;
  //     });

  //     if (!chatOpenRef.current && unreadMessages.length > 0) {
  //       unreadMessages.forEach((msg) => {
  //         const alreadyNotified = notifiedMessageIdsRef.current.has(msg.id);

  //         if (Notification.permission === "granted" && !alreadyNotified && "Notification" in window) {
  //           navigator.serviceWorker.ready.then((registration) => {
  //             registration.showNotification(
  //               `New message from ${msg.senderName}`,
  //               {
  //                 body: msg.text,
  //                 icon: "/new_logo_light.png", // ensure correct path
  //               }
  //             );
  //           });

  //           // ✅ Mark message as notified
  //           notifiedMessageIdsRef.current.add(msg.id);
  //         }
  //       });
  //     }

  //     if (chatOpenRef.current) {
  //       setUnreadCount(0);
  //     } else {
  //       setUnreadCount(unreadMessages.length);
  //     }

  //     setMessages(msgs);
  //   });

  //   return () => {
  //     unsubscribeUser();
  //     unsubscribeMessages();
  //   };
  // };

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
  // helper function to generate a color from string
const getAvatarColor = (name) => {
  const colors = [
    "#F44336", // red
    "#E91E63", // pink
    "#9C27B0", // purple
    "#673AB7", // deep purple
    "#3F51B5", // indigo
    "#2196F3", // blue
    "#009688", // teal
    "#4CAF50", // green
    "#FF9800", // orange
    "#795548"  // brown
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};
  
 const markGroupAsRead = (eventId, unreadCount) => {
  // totalUnread ko get karo
  const totalUnread = parseInt(localStorage.getItem("totalUnread") || "0");

  // clicked group ka unread subtract karo totalUnread se
  const newTotal = Math.max(totalUnread - unreadCount, 0);

  // localStorage update
  localStorage.setItem("totalUnread", newTotal.toString());

  // notify components
  window.dispatchEvent(new Event("unreadCountChange"));
};
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;

    // iOS Safari workaround for autoplay
    const playPromise = video?.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const handler = () => {
          video.play();
          document.removeEventListener("touchstart", handler);
        };
        document.addEventListener("touchstart", handler);
      });
    }
  }, []);

  
  useEffect(() => {
  let pausedVideos = [];

  if (isImageOpen) {
    const allVideos = document.querySelectorAll("video");

    allVideos.forEach((vid) => {
      const insidePopup = vid.closest(".custom-lightbox");
      if (!insidePopup && !vid.paused) {
        pausedVideos.push(vid);
        vid.pause();
      }
    });
  } else {
    pausedVideos.forEach((vid) => {
      vid.play().catch(() => {});
    });
  }

  return () => {
    pausedVideos = []; // cleanup
  };
}, [isImageOpen]);


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
            <div style={{ marginBottom: "50px" }}>
              <WonderlandLandingPage
                isLoggedIn={isLoggedIn}
                userId={userID}
                slug={slug}
                setRefectchLoginGuest={setRefectchLoginGuest}
              />
            </div>
          )}
          {slug.length === 1 && (
            <div style={{ marginBottom: "50px" }}>
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
              {/* {showFAB && isHost && <FloatingEditButton onClick={handleEdit} />} */}
              {/* <A2HSPrompt /> */}

              {orderDetails ? (
                <>
                  {orderDetails?.externalTemplateImageUrl ? (
                    <div style={{padding: "10px 10px 5px 10px"}}>
                      <div
                        className="invitation-container-image-ctn"
                        // style={{
                        //   backgroundImage:
                        //     orderDetails?.externalTemplateImageUrl
                        //       ? `url('${orderDetails.externalTemplateImageUrl}')`
                        //       : "none",
                        //   minHeight: "530px",
                        //   position: "relative",
                        // }}
                      >
                        <img src={orderDetails.externalTemplateImageUrl} alt='template' />
                        {/* <div
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
                                markGroupAsRead(eventId, unreadCount);
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
                        </div> */}
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
                        {/* <div
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
                      markGroupAsRead(eventId, unreadCount);


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
                        </div> */}
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
                      userData={userData}
                    />
                  ) : hasSubmitted ? (
                    <GuestListPreview
                      guestList={guestList}
                      loading={loading}
                      userType={userType}
                      hostData={orderDetails}
                      urlParams={urlParams}
                      userData={userData}
                    />
                  ) : (
                    <div ref={rsvpRef}>
                      <GuestRSVPForm
                        highlightRSVPButtons={highlightRSVPButtons}
                        setHighlightRSVPButtons={setHighlightRSVPButtons}
                        hostData={orderDetails}
                        userData={userData}
                        rsvpGuestName={userData?.name || ""}
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
               {/* {isHost &&
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
                ))} */}
              {/* {!isHost &&
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
                ))} */}

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
                    accept="image/*, video/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </div>

                <div>
                  {(uploading || showCheers) && (
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "20px",
                        width: "300px",
                        minHeight: "70px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        position: "relative",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {uploadProgress.percentage < 100 && (
                        <>
                          <div
                            className="progress custom-progress"
                            role="progressbar"
                            aria-label="Success example"
                            aria-valuenow="25"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            <div
                              className="progress-bar custom-progress-bar"
                              style={{ width: uploadProgress.percentage * 3 }}
                            ></div>
                          </div>
                          <div className="status-text mt-2">UPLOADING... {`${uploadProgress?.uploaded}/${uploadProgress?.total}`}</div>
                        </>
                      )}

                      {/* Glass Cheers Animation */}
                      {(uploadProgress.percentage === 100) && (
                        <div className="glass-container">
                          {!hideCheers && (
                            <>
                              <span
                                className="left-glass"
                                style={{
                                  animation: showCheers
                                    ? "leftCheers 2s ease forwards"
                                    : "none",
                                }}
                              >
                                🍷
                              </span>

                              <span
                                className="right-glass"
                                style={{
                                  animation: showCheers
                                    ? "rightCheers 2s ease forwards"
                                    : "none",
                                }}
                              >
                                🍷
                              </span>
                            </>
                          )}

                          {showSpark && <div className="spark-loader" />}

                          {showDone && (
                            <div className="done-text">UPLOADING DONE 🎉</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Images Grid */}
                   <div style={{ position: "relative", marginTop: "auto" }}>
                  <div
                    className="thumbnail-gallery"
                    style={{
                      margin: "20px auto",
                    }}
                  >
                   {eventAllImages.length === 0 ? (
                      <>
                        <div>
                          <video
                            ref={videoRef}
                            className="video-item"
                            autoPlay
                            loop
                            muted
                            playsInline
                            webkit-playsinline="true"
                            preload="auto"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              marginBottom: "10px",
                            }}
                          >
                            <source src={Wonderlandvideo} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                        <div className="event-grid">
                          {dummayImageGallery?.map((item, index) => (
                              <div
                                key={item._id}
                                style={{
                                  position: "relative",
                                  backgroundColor: "transparent",
                                }}
                              >
                                <EventwallGalleryItem
                                  isVideo={false}
                                  thumbnail={item}
                                  indexOnPage={index}
                                />
                              </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="thumbnail-gallery">
                        <div className="event-grid">
                          {eventAllImages?.map((thumbnail, indexOnPage) => {
                            const isVideo =
                              thumbnail.imageUrl?.match(
                                /\.(mp4|mov|avi|mkv)$/i
                              );

                            return (
                              <div
                                key={thumbnail._id}
                                onClick={() => {
                                  setSelectedImage(thumbnail);
                                  setSelectedIndex(indexOnPage);
                                  setIsImageOpen(true);
                                }}
                                style={{
                                  cursor: "pointer",
                                  position: "relative",
                                  backgroundColor: "transparent",
                                }}
                              >
                                <EventwallGalleryItem isVideo={isVideo} thumbnail={thumbnail} indexOnPage={indexOnPage} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

{isImageOpen && selectedImage && (
                  <div
                    className="custom-lightbox"
                    // onClick={() => setIsImageOpen(false)}
                  >
                    <div
                      className="lightbox-inner"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div {...handlers} className="lightbox-content">
                        <button
                          className="lightbox-close-btn"
                          onClick={() => setIsImageOpen(false)}
                        >
                          ✖
                        </button>

                        <MediaViewer media={selectedImage} />

                      </div>
                        {selectedImage.name && (
                          <p className="lightbox-name">
                            Shared BY : {selectedImage.name}
                          </p>
                        )}
                        <div className="lightbox-toolbar">
                            <button
                              className="lightbox-btn"
                              disabled={selectedImage?.userId !== userID}
                              onClick={(e) => {
                                if(selectedImage?.userId !== userID) return;
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
                                style={{ width: 14, height: 15 }}
                              />
                            </button>
                          <button
                          className="lightbox-btn prev-btn"
                          onClick={() => {
                            const prevIndex =
                              (selectedIndex - 1 + eventAllImages.length) %
                              eventAllImages.length;
                            setSelectedIndex(prevIndex);
                            setSelectedImage(eventAllImages[prevIndex]);
                          }}
                        >
                          <IoIosArrowBack size={25} color="#000000" />
                        </button>
                           <button
                          className="lightbox-btn next-btn"
                          onClick={() => {
                            const nextIndex =
                              (selectedIndex + 1) % eventAllImages.length;
                            setSelectedIndex(nextIndex);
                            setSelectedImage(eventAllImages[nextIndex]);
                          }}
                        >
                          <IoIosArrowForward size={25} color="#000000" />
                        </button>
                          <button
                            className="lightbox-btn"
                            onClick={() => downloadFile(selectedImage.imageUrl)}
                          >
                            <Image
                              src={downloadicon}
                              alt="Download"
                              style={{ width: 16, height: 16 }}
                            />
                          </button>
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
                    <LuckyDrawForm
                      hostData={orderDetails}
                      userData={userData}
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
            userData={userData}
            onClose={() => setShowPopupGuest(false)}
          />
        </>
      )}

      <>
        {/* {chatOpen && (
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
                
                    {!isSender && (
  <div
    className="chat-avatar-receiver"
    style={{
      backgroundColor: getAvatarColor(
        senderName || msg.senderPhoneNumber
      )
    }}
  >
    {senderName
      ? senderName.charAt(0).toUpperCase()
      : msg.senderPhoneNumber.charAt(3)}
  </div>
)}


                    <div className={`chat-bubble ${isSender ? "sender" : "receiver"}`}>
    
      {!isSender && (
        <div className="chat-sender">
          {senderName
            ? senderName
            : `+91 ${msg.senderPhoneNumber.slice(0, -4)}XXXX`}
        </div>
      )}
{/* 
 
<div className="chat-text">{linkify(msg.text)}</div>

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

            <div className="chat-input-container">
              <button
                type="button"
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (showEmojiPicker) {
                    setShowEmojiPicker(false);
                    setTimeout(() => {
                      textareaRef.current?.focus();
                    }, 0);
                  } else {
                      // setShowEmojiPicker(true);
                      // textareaRef.current?.blur();
                        textareaRef.current?.blur();
    setTimeout(() => {
      setShowEmojiPicker(true);
    }, 50);
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
            
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />

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

            
            </div>

            {showEmojiPicker && (
              <div
                className="emoji-container"
                  onPointerDown={(e) => e.preventDefault()} // keep textarea focused

                // onMouseDown={(e) => e.preventDefault()}
                // onTouchStart={(e) => e.preventDefault()}
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
/> 

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
        )} */}
      </>

      

{pathname === "/wonderland" &&
  showInstall &&
  popupStatus !== "true" &&
  popupStatus !== "false" && (

<div className="addhome-popup-overlay">
  <div className="addhome-popup-container">
    <Image src={phoneImage} alt="Phone Preview" className="addhome-phone-image" />

    <div className="addhome-popup-text">
      <p className="addhome-headline">Your parties, one tap away</p>
      <p className="addhome-headline">Pin to your screen.</p>
    </div>

    <button className="addhome-add-button" onClick={handleInstallClick}>
      Add To Screen
    </button>

    <button
      className="addhome-later-button"
      onClick={() => {
        setShowInstall(false);
        localStorage.setItem("addToHomeScreenPopup", "false");
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
