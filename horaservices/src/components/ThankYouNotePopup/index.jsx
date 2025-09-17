import React, { useEffect } from "react";
import Image from "next/image";
import StickyImage from "../../assets/sticky1.png"; // adjust path
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
  const noteTextAreaRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
const [charCount, setCharCount] = useState(0);
 const [emojiWidth, setEmojiWidth] = useState(400);
 
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    handleResize(); // initial run
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
    useEffect(() => {
      const updateWidth = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth > 450) {
          setEmojiWidth(450);
        } else if (screenWidth <= 450) {
          setEmojiWidth(screenWidth - 20);
        } else {
          setEmojiWidth(screenWidth - 50);
        }
      };
  
      updateWidth();
      window.addEventListener("resize", updateWidth);
  
      return () => window.removeEventListener("resize", updateWidth);
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
  let input = e.target.value;

  // Split by user-entered lines
  const lines = input.split("\n");
  let adjustedLines = [];

  for (let i = 0; i < lines.length && adjustedLines.length < 8; i++) {
    let line = lines[i];

    if (!line) {
      // Preserve blank line
      adjustedLines.push("");
      continue;
    }

    let words = line.split(" ");
    let currentLine = "";

    for (let j = 0; j < words.length; j++) {
      if (adjustedLines.length >= 8) break;

      let word = words[j];

      // Check if current line + word exceeds 26 chars
      if ((currentLine + (currentLine ? " " : "") + word).length > 26) {
        if (currentLine) adjustedLines.push(currentLine);
        currentLine = word; // start new line with this word
      } else {
        currentLine += (currentLine ? " " : "") + word;
      }
    }

    // Push remaining part of the line
    if (currentLine && adjustedLines.length < 8) {
      adjustedLines.push(currentLine);
    }
  }

  const finalText = adjustedLines.join("\n");
  const totalChars = adjustedLines.reduce((acc, l) => acc + l.length, 0);

  setNoteTitle(finalText);
  setCharCount(totalChars);

  if (finalText.trim() === "") {
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

        {/* <p
          className="word-limit"
          style={{ color: charsWithoutSpaces >= 125 ? "red" : "#4A4A4A" }}
        >
          {charsWithoutSpaces >= 125
            ? "You have reached the 125 character limit!"
            : `${charsWithoutSpaces} / 125 characters`}
        </p> */}
  <p
  className="word-limit"
  style={{ color: charCount >= 184 ? "red" : "#4A4A4A" }} // 8 lines × 23 chars = 184
>
  {charCount >= 184
    ? "You have reached the 8 line / 23 character per line limit!"
    : `${charCount} / 184 characters (excluding spaces)`}
</p>


      </div>
      {showEmojiPicker && (
        <div
          className="emoji-container-thankyou"
          style={{
            position: "static",
            zIndex: 10,
            marginTop: "10px",
          }}
        >
           <EmojiPicker
                          width={emojiWidth}
                          searchDisabled={true}
                          onEmojiClick={(emojiData) => {
                            const textarea = textareaRef.current;
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
          
                            setText((prevText) => {
                              const newText =
                                prevText.substring(0, start) +
                                emojiData.emoji +
                                prevText.substring(end);
          
                              // Update cursor position without focusing (prevents keyboard)
                              requestAnimationFrame(() => {
                                textarea.selectionStart = textarea.selectionEnd =
                                  start + emojiData.emoji.length;
                              });
          
                              return newText;
                            });
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
          padding: "10px",
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
            textAlign: "left",
          }}
          
        >
          <div
            style={{
              fontWeight: "500",
              fontSize: "15px",
              color: "black",
              fontFamily: "'Montserrat', sans-serif",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {noteTitle}
          </div>
         
        </div>

        <div
  style={{
    position: "absolute",
    bottom: 20,
    left: 140,
    fontWeight: "500",
    fontSize: "15px",
    color: "black",
    fontFamily: "'Montserrat', sans-serif",
    zIndex: 1,
  }}
>
  :- {noteBy.length > 15 ? noteBy.substring(0, 15) + "..." : noteBy}
</div>

      </div>
    </div>
  );
};

export default ThankYouNotePopup;
