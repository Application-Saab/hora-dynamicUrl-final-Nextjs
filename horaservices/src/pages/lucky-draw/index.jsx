import React, { useState } from "react";
import Image from "next/image";
import luckyDrawBanner from "../../assets/lucky_draw_banner.png";
import logo from "../../assets/hora-light-innerpage.png";
import "./FormComponent.css";
// mport giftBoxOpen from "../../assets/giftbox-open.avif";


const LuckyDrawForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    photo: null,
    feedback: "",
  });

  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [boxOpened, setBoxOpened] = useState(false);
const [confettiElements, setConfettiElements] = useState([]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setFormData({ ...formData, photo: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   if (!formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }
  if (!formData.whatsapp.trim()) {
      alert("Please enter your WhatsApp number.");
      return;
    }

    if (formData.whatsapp.length !== 10) {
      alert("WhatsApp number must be exactly 10 digits.");
      return;
    }

    if (!formData.feedback) {
      alert("Please select your feedback (Yes or No).");
      return;
    }    setIsLoading(true);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("whatsapp", formData.whatsapp);
    form.append("feedback", formData.feedback);
  if (formData.image) {
      form.append("image", formData.image);
    }
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxIUxenB_Pak3pQK5VUqwM9B8M-HMeZyAjoFV5FR2rtB5X6GdXzx6bhCGDeeNQmIqA9/exec",
        {
          method: "POST",
          body: form,
        }
      );

      const result = await response.json();
console.log("Success:", result);   
   alert("Thank you!, Check your WhatsApp for Lucky Draw ID.");
      setFormData({ name: "", whatsapp: "", feedback: "", photo: null });

     setFormData({
        name: "",
        whatsapp: "",
        feedback: "",
        image: null,
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
     if (name === "whatsapp") {
      // Allow only digits and restrict length to 10
      if (/^\d{0,10}$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
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
          <div className="close-icon" onClick={onClose}>
  &times;
</div>

          <Image src={luckyDrawBanner} alt="Banner" width={370} height={'auto'} />

          <div className="form-container-sec">
            {Array(50).fill().map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ["#FF5F5F", "#FFCC00", "#3E8BFF"][Math.floor(Math.random() * 3)],
                }}
              />
            ))}

            <div className="content-wrapper">
              <div className="form-section">
                <div className="input-group">
                  <label htmlFor="name">Name</label>
                  <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. John Doe"
            />
                            </div>

                <div className="input-group">
                  <label htmlFor="whatsapp">WhatsApp Number</label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="e.g. 1234567890"
                    maxLength={10}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="photo">Upload Photo</label>
                  <div className="file-upload">
                    {preview ? (
                      <img src={preview} alt="Preview" className="preview-image" />
                    ) : (
                      <div className="placeholder">
                        <span style={{ color: "black" }}>Choose image</span>
                      </div>
                    )}
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Did you like our service?</label>
                  <div className="radio-options">
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="yes"
                        name="feedback"
                        value="like"
                        checked={formData.feedback === "like"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="yes">Yes</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="no"
                        name="feedback"
                        value="dislike"
                        checked={formData.feedback === "dislike"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="no">No</label>
                    </div>
                  </div>
                </div>

               <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={isLoading} // Disable the button while loading
          >
            {isLoading ? "Submitting..." : "Submit"}{" "}
            {/* Show loading text when submitting */}
          </button>
              </div>
 <div className="footer">
          <div className="logo">
            {/* <div className="logo-circle">H</div> */}
            <Image src={logo} alt="Banner" width={35} height={40} />
            <span className="company-name">HORA SERVICES</span>
          </div>
        </div>
      </div>         
         

            {isLoading && (
              <div className="loader">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyDrawForm;
