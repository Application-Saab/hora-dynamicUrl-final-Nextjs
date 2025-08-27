import React, { useEffect } from "react";
import Image from "next/image";
import StickyImage from "../../assets/sticky5.png"; // adjust path
import DummySticky from "@/assets/collage/photo2.jpeg";
import "./Thankyounotepopup.css";
import EmojiPicker from "emoji-picker-react";
import { useState, useRef } from "react";
import { FaRegKeyboard } from "react-icons/fa6";
import emojiIcon from "@/assets/Emoji.png";

import Head from "next/head";
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
  userName,
}) => {
  const charsWithoutSpaces = noteTitle.replace(/\s/g, "").length;
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  console.log(
    "%c [ showEmojiPicker ]-26",
    "font-size:13px; background:pink; color:#bf2c9f;",
    showEmojiPicker
  );
  const noteTextAreaRef = useRef(null);
  noteBy = userName || "";
  const [isMobile, setIsMobile] = useState(false);
  console.log(
    "%c [ isMobile ]-30",
    "font-size:13px; background:pink; color:#bf2c9f;",
    isMobile
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    handleResize(); // initial run
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="popup-thankyou">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Aclonica&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <h1 className="title">Thank You Note</h1>
      <h3 className="subtitlePopUp">
        Celebrate the moment with few words of gratitude for {} and crew
      </h3>
      <Image
        src={DummySticky}
        alt="Sticky Note Sample"
        className="thankyou-image"
      />
      <div className="form-group">
        <label className="label">Type Note</label>
        <div className="textarea-with-emoji">
          <textarea
            ref={noteTextAreaRef}
            rows={5}
            placeholder="Write Your thank You Message..."
            value={noteTitle}
            className="textareanote"
            required
            onFocus={() => {
              // ✅ Textarea focus hote hi emoji picker band ho jaye
              if (showEmojiPicker) {
                setShowEmojiPicker(false);
              }
            }}
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

              if (input?.trim() === "") {
                setErrorMsg("Please write a thank you message.");
              } else {
                setErrorMsg("");
              }
            }}
          />

          <button
            type="button"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
            }}
            className="btn emoji-button"
          >
            <Image src={emojiIcon} alt="Emoji" className="emoji-icon" />
          </button>
        </div>

        <p
          className="word-limit"
          style={{ color: charsWithoutSpaces >= 125 ? "red" : "#4A4A4A" }}
        >
          {charsWithoutSpaces >= 125
            ? "You have reached the 125 character limit!"
            : `${charsWithoutSpaces} / 125 characters`}
        </p>
      </div>
      {showEmojiPicker && (
        <div
          className="emoji-container-thankyou"
          style={{
            // position: isMobile ? "static" : "absolute",
            position: "static",
            zIndex: 10,
            marginTop: "10px",
          }}
        >
          <EmojiPicker
            searchDisabled={true}
            height={350}
            // width={300}
            onEmojiClick={(emojiData) => {
              const textarea = noteTextAreaRef.current;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;

              const newText =
                noteTitle.substring(0, start) +
                emojiData.emoji +
                noteTitle.substring(end);

              const newCharCount = newText.replace(/\s/g, "").length;
              if (newCharCount <= 125) {
                setNoteTitle(newText);

                // ✅ Cursor update karo but focus dobara mat do → keyboard auto open nahi hoga
                requestAnimationFrame(() => {
                  textarea.selectionStart = textarea.selectionEnd =
                    start + emojiData.emoji.length;
                });
              }
            }}
          />
        </div>
      )}

      <div className="form-group">
        <label className="label">Type Your Name </label>
        <input
          type="text"
          placeholder="Write Your Name Here"
          value={noteBy}
          required
          onFocus={() => {
            // ✅ Agar emoji picker open hai to band kar do
            if (showEmojiPicker) {
              setShowEmojiPicker(false);
            }
          }}
          onChange={(e) => {
            setNoteBy(e.target.value);
          }}
        />
      </div>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}

      <div className="popup-buttons">
        <button className="cancel-btn" onClick={handleClosePopup}>
          CANCEL
        </button>
        <button className="save-btn" onClick={handleDownload}>
          SAVE
        </button>
      </div>

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
              fontFamily: "'Montserrat', sans-serif",
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
            left: 100,
            fontWeight: "bold",
            fontSize: "20px",
            color: "black",
            fontFamily: "'Montserrat', sans-serif",
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
