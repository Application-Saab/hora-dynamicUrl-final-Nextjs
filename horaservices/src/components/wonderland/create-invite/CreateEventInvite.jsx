import InvitationModal from "@/components/InvitationModal";
import { eventOptions } from "@/utils/constants";
import React, { useEffect, useRef, useState } from "react";
import imageBackground from "../../../assets/imageBackground.jpg";
import { BASE_URL } from "@/utils/apiconstants";
import { useRouter } from "next/router";
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
// doc, getDoc, updateDoc,
import { db } from "../../../firebase";

const CreateEventInvite = ({ slug }) => {
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(true);
  const router = useRouter();
  const hostUserId = slug[0];
  const eventId = slug[1];
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    address: "",
    eventType: "",
    eventTypeSearch: "",
  });
  const [uploadedImage, setUploadedImage] = useState(null);

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

        setFormData({
          name: data.hostName,
          eventType: data.eventType,
          date: data.eventDate,
          time: data.eventTime,
          address: data.location,
          eventTypeSearch: "",
        });
        setUploadedImage(data.hostImage || null);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchOrderDetails(eventId);
    }
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    // Set the input value in formData
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Add/remove `has-value` class for date/time inputs
    if (type === "date" || type === "time") {
      if (value) {
        e.target.classList.add("has-value");
      } else {
        e.target.classList.remove("has-value");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result;

      try {
        const compressed = await compressBase64Image(base64String, 500, 0.4); // 👈 compress karo
        setUploadedImage(compressed); //  use compressed base64
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

    reader.readAsDataURL(file); //  Converts file to base64 string
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

    const finalImage = uploadedImage || null;

    if (!token || !hostUserId) {
      alert("Please login to continue.");
      return;
    }

    const payload = {
      userId: hostUserId,
      eventType: formData.eventType,
      hostName: formData.name,
      eventDate: formattedDate,
      eventTime: formattedTime,
      location: formData.address,
      hostImage: finalImage,
    };

    try {
      //  1. Update your backend
      const res = await fetch(
        `${BASE_URL}/api/customer/event/event-invites/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok && eventId && hostUserId) {
        // 2. Check if group exists — update only `hostName`
        const groupRef = doc(db, "groups", eventId);
        const groupSnap = await getDoc(groupRef);

        if (groupSnap.exists()) {
          const finalName =
            (
              (formData.name || "") +
              (formData.name && formData.eventType ? " " : "") +
              (formData.eventType || "")
            ).trim() || "Unnamed";

          console.log(finalName, "finalname");
          await updateDoc(groupRef, {
            name: finalName.trim() || "Unnamed",
            imageUrl: finalImage || "",
          });
          console.log(" Group hostName updated.");

          //  Check if messages collection is empty before adding defaults
          const messagesCol = collection(db, "groups", eventId, "messages");
          const existingMessagesSnapshot = await getDocs(messagesCol);

          if (existingMessagesSnapshot.empty) {
            const defaultMessages = [
              {
                senderId: hostUserId,
                senderName: "You",
                sentAt: serverTimestamp(),
                text: " What’s on your mind? !",
              },
              {
                senderId: hostUserId,
                senderName: "You",
                sentAt: serverTimestamp(),
                text: "Welcome to Wonderland chat — where the fun begins even before the party!",
              },
            ];

            // Add first message
            await addDoc(messagesCol, defaultMessages[0]);
            console.log("First default message added.");

            // Add a small delay before sending the second message (e.g., 2 seconds)
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Add second message
            await addDoc(messagesCol, defaultMessages[1]);
            console.log("Second default message added.");

            // for (const msg of defaultMessages) {
            //   await addDoc(messagesCol, msg);
            // }
            // console.log(" Default messages added.");
          } else {
            console.log(
              "ℹ️ Messages already exist — skipping default messages."
            );
          }
        } else {
          console.log("ℹ️ Group does not exist — skipping update.");
        }

        // Redirect
        return router.replace(`/wonderland?id=${hostUserId}/${eventId}/host`);
      } else {
        alert("Failed to save invitation.");
      }

      // Reset form
      setFormData({
        name: "",
        date: "",
        time: "",
        address: "",
        eventType: "",
        eventTypeSearch: "",
      });
      setUploadedImage(null);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    }
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div>
        <InvitationModal
          showModal={showModal}
          handleClose={() => setShowModal(false)}
          handleSave={handleSave}
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          uploadedImage={uploadedImage}
          eventOptions={eventOptions}
          fileInputRef={fileInputRef}
          orderDetails={""}
          imageBackground={imageBackground}
        />
      </div>
      {/* <div
        className="invite-card"
        style={{
          border: "1px solid rgba(0, 0, 0, 0.53)",
          marginTop: "-20px",
          background: "white",
          marginBottom: "30px",
        }}
      >
        <h2 className="invite-heading party-title">It's Time To Party!</h2>

        <div className="cake-image-wrapper">
          <img src={uploadedImage} alt="Your image" className="cake-image" />
        </div>

        <h3 className="invite-title highlight-title">
          {formData.name || "Someone"}’s {formData.eventType || ""}
        </h3>

        <div className="event-info-wrapper">
          <div className="event-details">
            <div className="event-line">
              📅 Date : {formatDate(formData.date)}
            </div>
            <div className="event-line">⏰ Time : {formData.time}</div>
          </div>
          <div className="event-address">{formData.address}</div>
        </div>
      </div> */}
    </>
  );
};

export default CreateEventInvite;
