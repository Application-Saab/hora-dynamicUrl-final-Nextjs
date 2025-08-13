import InvitationModal from "@/components/InvitationModal";
import { eventOptions } from "@/pages/wonderland/constants";
import React, { useRef, useState } from "react";
import imageBackground from "../../../assets/imageBackground.jpg";
import { BASE_URL } from "@/utils/apiconstants";
import { useRouter } from "next/router";

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

      //   const result = await res.json();

      if (res.ok && eventId) {
        // setShowModal(false);

        // ✅ Update the URL route to reflect changes
        return router.replace(`/wonderland/${hostUserId}/${eventId}/host`);
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
    //   setSelectedImage("");
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    }
  };

  return (
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
  );
};

export default CreateEventInvite;
