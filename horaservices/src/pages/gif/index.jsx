import React, { useState } from "react";
import "./GreetingCard.css";
import GIF from "gif.js";
import html2canvas from "html2canvas";

const GreetingCard = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editableText, setEditableText] = useState(
    "Wishing you a very happy birthday filled with love and laughter"
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleTextChange = (event) => {
    setEditableText(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setIsEditing(false);
    }
  };

  const downloadAsGif = async () => {
    const cardElement = document.querySelector(".card");
    const gif = new GIF({
      workers: 4,
      quality: 10,
      workerScript: "/gif.worker.js",
      repeat: 0,
    });

    const animationFrames = 60;
    const delayPerFrame = 50;

    for (let i = 0; i < animationFrames; i++) {
      cardElement.style.setProperty("--animation-progress", i / animationFrames);

      const canvas = await html2canvas(cardElement, {
        scale: 3,
        logging: false,
        useCORS: true,
      });
      gif.addFrame(canvas, { delay: delayPerFrame });
    }

    gif.on("finished", (blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "animated_greeting_card.gif";
      link.click();
    });

    gif.render();
  };

  return (
    <div className="rectangle-container">
      <div className="card">
        <div className="outside">
          <div className="front">
            <p>Happy Birthday</p>
            <div className="cake">
              <div className="top-layer"></div>
              <div className="middle-layer"></div>
              <div className="bottom-layer"></div>
              <div className="candle"></div>
            </div>
          </div>
          <div className="back"></div>
        </div>
        <div className="inside">
          {isEditing ? (
            <textarea
              value={editableText}
              onChange={handleTextChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
              autoFocus
              className="editable-text"
            />
          ) : (
            <p className="editable-text" onClick={handleTextClick}>
              {editableText}
            </p>
          )}
          {uploadedImage ? (
            <div className="image-container">
              <img src={uploadedImage} alt="Uploaded" className="uploaded-image" />
            </div>
          ) : (
            <label className="upload-label">
              Upload an Image
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
          )}
        </div>
      </div>
      <button className="download-btn" onClick={downloadAsGif}>
        Download as GIF
      </button>
    </div>
  );
};

export default GreetingCard;
