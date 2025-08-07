// import React, { useState } from "react";
// import Image from "next/image";
// import luckyDrawBanner from "../../assets/lucky_draw_banner.png";
// import logo from "../../assets/hora-light-innerpage.png";
// import "./FormComponent.css";
// // mport giftBoxOpen from "../../assets/giftbox-open.avif";

// const LuckyDrawForm = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     whatsapp: "",
//     photo: null,
//     feedback: "",
//   });

//   const [preview, setPreview] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [boxOpened, setBoxOpened] = useState(false);
//   const [confettiElements, setConfettiElements] = useState([]);
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setPreview(imageUrl);
//       setFormData({ ...formData, photo: file });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name.trim()) {
//       alert("Please enter your name.");
//       return;
//     }
//     if (!formData.whatsapp.trim()) {
//       alert("Please enter your WhatsApp number.");
//       return;
//     }

//     if (formData.whatsapp.length !== 10) {
//       alert("WhatsApp number must be exactly 10 digits.");
//       return;
//     }

//     if (!formData.feedback) {
//       alert("Please select your feedback (Yes or No).");
//       return;
//     }
//     setIsLoading(true);

//     const form = new FormData();
//     form.append("name", formData.name);
//     form.append("whatsapp", formData.whatsapp);
//     form.append("feedback", formData.feedback);
//     if (formData.image) {
//       form.append("image", formData.image);
//     }
//     try {
//       const response = await fetch(
//         "https://script.google.com/macros/s/AKfycbxIUxenB_Pak3pQK5VUqwM9B8M-HMeZyAjoFV5FR2rtB5X6GdXzx6bhCGDeeNQmIqA9/exec",
//         {
//           method: "POST",
//           body: form,
//         }
//       );

//       const result = await response.json();
//       console.log("Success:", result);
//       alert("Thank you!, Check your WhatsApp for Lucky Draw ID.");
//       setFormData({ name: "", whatsapp: "", feedback: "", photo: null });

//       setFormData({
//         name: "",
//         whatsapp: "",
//         feedback: "",
//         image: null,
//       });
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Something went wrong. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "whatsapp") {
//       // Allow only digits and restrict length to 10
//       if (/^\d{0,10}$/.test(value)) {
//         setFormData({
//           ...formData,
//           [name]: value,
//         });
//       }
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   return (
//     <div className="lucky-draw-wrapper">
//       <button
//         onClick={onClose}
//         style={{
//           position: "absolute",
//           top: "12px",
//           right: "12px",
//           background: "transparent",
//           border: "none",
//           fontSize: "24px",
//           color: "#9260aa",
//           cursor: "pointer",
//           padding: 0,
//           lineHeight: 1,
//         }}
//       >
//         ✖
//       </button>

//       {!boxOpened ? (
//         <div className="giftbox-container" onClick={() => setBoxOpened(true)}>
//           <Image
//             src="/assets/giftbox-open.avif"
//             alt="Gift Box"
//             width={200}
//             height={200}
//             className="giftbox-closed bounce"
//           />
//           <p className="giftbox-title">Tap to reveal your surprise!</p>
//         </div>
//       ) : (
//         <div className="lucky-draw-container">
//           <div className="close-icon" onClick={onClose}>
//             &times;
//           </div>

//           <Image
//             src={luckyDrawBanner}
//             alt="Banner"
//             width={370}
//             height={"auto"}
//           />

//           <div className="form-container-sec">
//             {Array(50)
//               .fill()
//               .map((_, i) => (
//                 <div
//                   key={i}
//                   className="confetti"
//                   style={{
//                     left: `${Math.random() * 100}%`,
//                     top: `${Math.random() * 100}%`,
//                     backgroundColor: ["#FF5F5F", "#FFCC00", "#3E8BFF"][
//                       Math.floor(Math.random() * 3)
//                     ],
//                   }}
//                 />
//               ))}

//             <div className="content-wrapper">
//               <div className="form-section">
//                 <div className="input-group">
//                   <label htmlFor="name">Name</label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     placeholder="e.g. John Doe"
//                   />
//                 </div>

//                 <div className="input-group">
//                   <label htmlFor="whatsapp">WhatsApp Number</label>
//                   <input
//                     type="tel"
//                     id="whatsapp"
//                     name="whatsapp"
//                     value={formData.whatsapp}
//                     onChange={handleInputChange}
//                     placeholder="e.g. 1234567890"
//                     maxLength={10}
//                   />
//                 </div>

//                 <div className="input-group">
//                   <label htmlFor="photo">Upload Photo</label>
//                   <div className="file-upload">
//                     {preview ? (
//                       <img
//                         src={preview}
//                         alt="Preview"
//                         className="preview-image"
//                       />
//                     ) : (
//                       <div className="placeholder">
//                         <span style={{ color: "black" }}>Choose image</span>
//                       </div>
//                     )}
//                     <input
//                       type="file"
//                       id="photo"
//                       name="photo"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       className="file-input"
//                     />
//                   </div>
//                 </div>

//                 <div className="input-group">
//                   <label>Did you like our service?</label>
//                   <div className="radio-options">
//                     <div className="radio-option">
//                       <input
//                         type="radio"
//                         id="yes"
//                         name="feedback"
//                         value="like"
//                         checked={formData.feedback === "like"}
//                         onChange={handleInputChange}
//                       />
//                       <label htmlFor="yes">Yes</label>
//                     </div>
//                     <div className="radio-option">
//                       <input
//                         type="radio"
//                         id="no"
//                         name="feedback"
//                         value="dislike"
//                         checked={formData.feedback === "dislike"}
//                         onChange={handleInputChange}
//                       />
//                       <label htmlFor="no">No</label>
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   className="submit-button"
//                   onClick={handleSubmit}
//                   disabled={isLoading} // Disable the button while loading
//                 >
//                   {isLoading ? "Submitting..." : "Submit"}{" "}
//                   {/* Show loading text when submitting */}
//                 </button>
//               </div>
//               <div className="footer">
//                 <div className="logo">
//                   {/* <div className="logo-circle">H</div> */}
//                   <Image src={logo} alt="Banner" width={35} height={40} />
//                   <span className="company-name">HORA SERVICES</span>
//                 </div>
//               </div>
//             </div>

//             {isLoading && (
//               <div className="loader">
//                 <div className="spinner"></div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LuckyDrawForm;

import React, { useState } from "react";
import Image from "next/image";
import "./FormComponent.css";
import CamIcon from "../../../public/assets/cam_Icon_luckydraw.svg";
import LogoHora from "../../../public/assets/logo_small_lucky.svg";
import { BASE_URL } from "@/utils/apiconstants";
import { useRouter } from "next/router";

const LuckyDrawForm = ({ onClose }) => {
  const router = useRouter();
  const { id } = router.query;
  let eventId = id ? id.split("/")[0] : null; // Extract eventId from URL
  const userId = id ? id.split("/")[1] : null;

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

  return (
    <div className="lucky-draw-wrapper">
      {!boxOpened ? (
        <div className="giftbox-container" onClick={() => setBoxOpened(true)}>
          <Image
            src="/assets/giftbox-open.avif"
            alt="Gift Box"
            width={200}
            height={200}
            className="giftbox-closed bounce"
          />
          <p className="giftbox-title">Tap to reveal your surprise!</p>
        </div>
      ) : (
        <div className="lucky-draw-container">
          {/* Confetti Effect */}
          {/* {Array(20)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ["#FF5F5F", "#FFCC00", "#3E8BFF"][
                  Math.floor(Math.random() * 3)
                ],
              }}
            />
          ))} */}

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
      )}
    </div>
  );
};

export default LuckyDrawForm;
