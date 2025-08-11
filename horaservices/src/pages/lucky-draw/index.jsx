import React, { useState } from "react";
import Image from "next/image";
import "./FormComponent.css";
import CamIcon from "../../assets/camera.png";
import LogoHora from "../../assets/logo_small_lucky.svg";
import { API_BASE_URL } from "@/config";

const LuckyDrawForm = ({ onClose }) => {
  let eventId = "6893126fb25684ca87888152";
  let userId = "68849ffc1651b3b2e77f00c3";
  const [preview, setPreview] = useState(null);
  const [boxOpened, setBoxOpened] = useState(false);
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
        `${API_BASE_URL}/customer/event/event-images/${eventId}/lucky-draw`,
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
        alert("Lucky draw submitted successfully!");
        setPreview(null); // Clear preview after success
        onClose(); // Close the form on success
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

  // return (
  //   <div className="lucky-draw-wrapper">
  //     {!boxOpened ? (
  //       <div className="giftbox-container" onClick={() => setBoxOpened(true)}>
  //         <Image
  //           src="/assets/giftbox-open.avif"
  //           alt="Gift Box"
  //           width={200}
  //           height={200}
  //           className="giftbox-closed bounce"
  //         />
  //         <p className="giftbox-title">Tap to reveal your surprise!</p>
  //       </div>
  //     ) : (
  //       <div className="lucky-draw-container">
  //         {/* Confetti Effect */}
  //         {/* {Array(20)
  //         .fill()
  //         .map((_, i) => (
  //           <div
  //             key={i}
  //             className="confetti"
  //             style={{
  //               left: `${Math.random() * 100}%`,
  //               top: `${Math.random() * 100}%`,
  //               backgroundColor: ["#FF5F5F", "#FFCC00", "#3E8BFF"][
  //                 Math.floor(Math.random() * 3)
  //               ],
  //             }}
  //           />
  //         ))} */}

  //         <h2 className="lucky-draw-title">Pose with Sahaj Win ₹10,000!</h2>
  //         <p className="lucky-draw-description">
  //           Upload your photo with Sahaj from the party to join the lucky draw
  //         </p>
  //         <div
  //           className="file-upload"
  //           onClick={() => document.getElementById("luckyDrawImage").click()}
  //         >
  //           {preview ? (
  //             <img src={preview?.url} alt="Preview" className="preview-image" />
  //           ) : (
  //             <div
  //               style={{
  //                 display: "flex",
  //                 flexDirection: "column",
  //                 alignItems: "center",
  //                 justifyContent: "center",
  //                 height: "100%",
  //               }}
  //             >
  //               <Image src={CamIcon} alt="camera icon" />
  //               <p className="img-label-upload">UPLOAD PHOTO WITH SAHAJ</p>
  //             </div>
  //           )}
  //           <input
  //             type="file"
  //             id="luckyDrawImage"
  //             accept="image/*"
  //             onChange={handleFileChange}
  //           />
  //         </div>
  //         <button className="lucky-btn-submit" onClick={handleSubmit}>
  //           {isLoading ? "Submitting..." : "Submit"}
  //         </button>
  //         <div style={{ marginTop: "25px" }}>
  //           <Image src={LogoHora} alt="logo hora" />
  //           <span className="sponsored-txt">SPONCERED BY HORA</span>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
return (
  <div className="lucky-draw-wrapper">
    <div className="lucky-draw-container">
      <h2 className="lucky-draw-title">Pose with Sahaj Win ₹10,000!</h2>
      <p className="lucky-draw-description">
        Upload your photo with Sahaj from the party to join the lucky draw
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
              height: "100%",
            }}
          >
            <Image src={CamIcon} alt="camera icon" />
            <p className="img-label-upload">UPLOAD PHOTO WITH SAHAJ</p>
          </div>
        )}
        <input
          type="file"
          id="luckyDrawImage"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <button className="lucky-btn-submit" onClick={handleSubmit}>
        {isLoading ? "Submitting..." : "Submit"}
      </button>
      <div style={{ marginTop: "25px" }}>
        <Image src={LogoHora} alt="logo hora" />
        <span className="sponsored-txt">SPONCERED BY HORA</span>
      </div>
    </div>
  </div>
);



};

export default LuckyDrawForm;
