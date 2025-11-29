"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import "./UploadCustomTemplate.css";
import { BASE_URL } from "@/utils/apiconstants";

const UploadCustomTemplate = ({ eventId, userId, token, label = "Upload Your Own Design" }) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleUploadChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!eventId) {
      console.error("Missing Event ID");
      alert("Event ID missing!");
      return;
    }

    if (!userId) {
      console.error("Missing User ID");
      alert("User ID missing!");
      return;
    }

    uploadCustomTemplate(file);
  };

  const uploadCustomTemplate = async (file) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", userId);

    try {
      const apiUrl = `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`;
      console.log("API URL:", apiUrl);

      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: token || "",
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Upload failed");

    
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem(`localTemplateImage_${eventId}`, reader.result);
        router.replace(`/wonderland/invite?eventid=${eventId}`);
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div 
      className="upload-banner"
      onClick={() => document.getElementById("custom-template-upload").click()}
    >
      <div className="upload-icon-wrapper">
        <span className="upload-plus">+</span>
      </div>
      <p>{label}</p>

      <input
        id="custom-template-upload"
        type="file"
        accept="image/*"
        hidden
        onChange={handleUploadChange}
      />

      {uploading && <div className="upload-overlay">Uploading…</div>}
    </div>
  );
};

UploadCustomTemplate.propTypes = {
  eventId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default UploadCustomTemplate;
