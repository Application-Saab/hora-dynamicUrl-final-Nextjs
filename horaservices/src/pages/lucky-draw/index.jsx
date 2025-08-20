import React, { useState } from "react";
import Image from "next/image";
import "./FormComponent.css";
import CamIcon from "../../assets/camera.png";
import LogoHora from "../../assets/logo_small_lucky.svg";
import { BASE_URL } from "@/utils/apiconstants";
import { useRouter } from "next/router";

const LuckyDrawForm = ({ onClose, hostData }) => {
  console.log(
    "%c [ hostData ]-153",
    "font-size:13px; background:pink; color:#bf2c9f;",
    hostData
  );
  const router = useRouter();
  const { id : queryId } = router.query;
  // const slug = router.query.slug || [];
  // const queryId = router.query.id;
  const slug = Array.isArray(queryId) ? queryId : queryId?.split("/") || [];
  let eventId = slug[1];
  const userId = localStorage.getItem("userID");

  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview({ url: imageUrl, file }); // Store URL and file object
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preview || !preview.file) {
      alert("Please upload an image.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", preview.file);
    formData.append("userId", userId);

    try {
      const response = await fetch(
        `${BASE_URL}/api/customer/event/event-images/${eventId}/lucky-draw`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `${localStorage.getItem("token") || ""}`, // Fallback to empty string if no token
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPreview(null);
        onClose();
      } else {
        const error = await response.json();
        alert("Submission failed: " + (error.message || error.error));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
   
      <div className="lucky-draw-container">
        <h2 className="lucky-draw-title">
          Pose with {hostData?.Name} <br /> Win ₹10,000!
        </h2>
        <p className="lucky-draw-description">
          Upload your photo with {hostData?.Name} <br />{" "}
          <span style={{ color: "rgba(151, 83, 140, 1)" }}>from the party</span>{" "}
          to Win the Lucky Ticket
        </p>
        <div
          className="file-upload"
          onClick={() => document.getElementById("luckyDrawImage").click()}
        >
          {preview ? (
            <img src={preview?.url} alt="Preview" className="preview-image" />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              <Image src={CamIcon} alt="camera icon" width={30} height={30} />

              <p
                className="img-label-upload"
                style={{ textTransform: "uppercase" }}
              >
                UPLOAD PHOTO WITH {hostData?.Name}
              </p>
            </div>
          )}
          <input
            type="file"
            id="luckyDrawImage"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            disabled={isLoading}
            className="lucky-btn lucky-btn-cancel"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            className="lucky-btn lucky-btn-submit"
            onClick={handleSubmit}
          >
{isLoading ? (
    <span className="loader"></span>
  ) : (
    "Submit"
  )}
          </button>
        </div>
        <div style={{ marginTop: "50px" }}>
          <Image src={LogoHora} alt="logo hora" />
          <span className="sponsored-txt">SPONCERED BY HORA</span>
        </div>
      </div>

  );
};

export default LuckyDrawForm;
