
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import "./UploadCustomTemplate.css";
import { BASE_URL } from "@/utils/apiconstants";
import { saveTemplate } from "@/utils/indexedDB";

const UploadCustomTemplate = ({ eventId, userId, token, label = "Upload Your Own Design" }) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(""); 

  const handleUploadChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!eventId) {
      setError("Event ID missing!");
      return;
    }

    if (!userId) {
      setError("User ID missing!");
      return;
    }

    setError(""); // Clear previous errors
    uploadCustomTemplate(file);
  };

 const uploadCustomTemplate = async (file) => {
  setUploading(true);
  const reader = new FileReader();
  reader.onloadend = async () => {
    try {
    
      await saveTemplate(`template_${eventId}`, reader.result);

      router.replace(`/wonderland/invite?eventid=${eventId}`);
    } catch (err) {
      setError("Failed to save template locally.");
    }
  };
  reader.readAsDataURL(file);

  
  const formData = new FormData();
  formData.append("image", file);
  formData.append("userId", userId);

  try {
    const apiUrl = `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`;
    const res = await fetch(apiUrl, {
      method: "PUT",
      headers: { Authorization: token || "" },
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Backend upload failed");
    }
  } catch (err) {
    setError(err.message || "Upload failed. Please try again.");
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

      {error && <div className="error-popup">{error}</div>}
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
