import React from "react";
import Image from "next/image";
import StickyImage from "../../assets/sticky5.png"; // adjust path

const ThankYouNotePopup = ({
  noteTitle,
  noteBy,
  setNoteTitle,
  setNoteBy,
  errorMsg,
  setErrorMsg,
  handleDownload,
  handleClosePopup,
  noteRef,
  hostData,
}) => {
  const charsWithoutSpaces = noteTitle.replace(/\s/g, "").length;

  return (
    <div className="popup">
      <span className="close-button" onClick={handleClosePopup}>
        ×
      </span>

      <h1 className="title">Thank You Note</h1>
      <h3 className="subtitlePopUp">
        Celebrate the moment with a few words of gratitude.
      </h3>

      <div className="form-group">
        <label className="label">Note Title</label>
        <textarea
          rows={5}
          placeholder="Write your thank you message..."
          value={noteTitle}
          required
          onChange={(e) => {
            const input = e.target.value;
            const charsCount = input.replace(/\s/g, "").length;

            if (charsCount <= 125) {
              setNoteTitle(input);
            } else {
              let count = 0;
              let truncated = "";
              for (const ch of input) {
                if (ch !== " ") count++;
                if (count > 125) break;
                truncated += ch;
              }
              setNoteTitle(truncated);
            }

            if (input?.trim() !== "" && noteBy?.trim() !== "") {
              setErrorMsg("");
            }
          }}
        />
        <p
          className="word-limit"
          style={{ color: charsWithoutSpaces >= 125 ? "red" : "black" }}
        >
          {charsWithoutSpaces >= 125
            ? "You have reached the 125 character limit!"
            : `${charsWithoutSpaces} / 125 characters`}
        </p>
      </div>

      <div className="form-group">
        <label className="label">Note By</label>
        <input
          type="text"
          placeholder="Your name"
          value={noteBy}
          required
          onChange={(e) => {
            setNoteBy(e.target.value);
            if (noteTitle?.trim() !== "" && e.target.value.trim() !== "") {
              setErrorMsg("");
            }
          }}
        />
      </div>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}

      <div className="popup-buttons">
        <button onClick={handleDownload}>Save</button>
      </div>

      {/* Hidden Canvas */}
      <div
        ref={noteRef}
        style={{
          width: "300px",
          height: "300px",
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          backgroundColor: "white",
          borderRadius: "12px",
          overflow: "hidden",
          padding: "15px",
          boxSizing: "border-box",
        }}
      >
        <Image
          src={StickyImage}
          alt="Sticky Note"
          fill
          style={{
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
            borderRadius: "12px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70%",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "20px",
              color: "black",
              fontFamily: "Arial, sans-serif",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
              lineHeight: 1.1,
            }}
          >
            {noteTitle}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 45,
            right: 70,
            fontWeight: "bold",
            fontSize: "20px",
            color: "black",
            fontFamily: "Arial, sans-serif",
            zIndex: 1,
          }}
        >
          - {noteBy}
        </div>
      </div>
    </div>
  );
};

export default ThankYouNotePopup;
