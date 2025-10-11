

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


const handleNoteInput = (e) => {
  const sel = window.getSelection();
  const range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;

  // Save full cursor position
  const savedCursor = range
    ? {
        container: range.startContainer,
        offset: range.startOffset,
      }
    : null;

  let input = e.currentTarget.innerText;

  // Process input...
  // (Keep your original line-wrapping and truncation logic here)
  // Assume it ends with `const finalText = adjustedLines.join("\n");`

  // Update state
  setNoteTitle(finalText);
  setCharCount(adjustedLines.reduce((acc, l) => acc + l.length, 0));

  // Only update innerText if needed
  if (noteTextAreaRef.current.innerText !== finalText) {
    noteTextAreaRef.current.innerText = finalText;

    // Restore cursor position
    requestAnimationFrame(() => {
      if (!noteTextAreaRef.current || !savedCursor) return;

      const range = document.createRange();
      const sel = window.getSelection();

      // Find correct text node again
      let node = noteTextAreaRef.current;
      let textNode = null;

      // Recursively find the actual text node
      function getTextNodeAtOffset(node, offset) {
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          if (child.nodeType === Node.TEXT_NODE) {
            if (offset <= child.length) return { node: child, offset };
            offset -= child.length;
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const found = getTextNodeAtOffset(child, offset);
            if (found) return found;
          }
        }
        return { node: node, offset: 0 };
      }

      const { node: newNode, offset: newOffset } = getTextNodeAtOffset(
        noteTextAreaRef.current,
        savedCursor.offset
      );

      range.setStart(newNode, newOffset);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    });
  }

  // Validation
  if (finalText.trim() === "") {
    setErrorMsg("Please write a thank you message.");
  } else {
    setErrorMsg("");
  }

  if (showEmojiPicker) setShowEmojiPicker(false);
};

const nameRef = useRef(null);

const handleNameInput = (e) => {
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);

  const cursorPosition = range.startOffset;

  setNoteBy(e.currentTarget.innerText);

  requestAnimationFrame(() => {
    const newRange = document.createRange();
    const textNode = nameRef.current.firstChild || nameRef.current;

    if (textNode && textNode.length >= cursorPosition) {
      newRange.setStart(textNode, cursorPosition);
      newRange.collapse(true);

      sel.removeAllRanges();
      sel.addRange(newRange);
    }
  });
};

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
    
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />


      </Head>

      <h1 className="title">Thank You Note</h1>
      <h3 className="subtitlePopUp">
        Celebrate the moment with few words of gratitude for {} and crew
      </h3>
      {/* <Image
        src={DummySticky}
        alt="Sticky Note Sample"
        className="thankyou-image"
      /> */}
      {/* <div className="thankyou-preview">
  <div className="sticky-preview">
    <Image
      src={StickyImage}
      alt="Sticky Note Background"
      fill
      style={{ objectFit: "cover", borderRadius: "12px" }}
    />

  <div
  className="preview-text"
  contentEditable
  suppressContentEditableWarning={true}
  onInput={(e) => setNoteTitle(e.currentTarget.innerText)}
  style={{
    outline: "none",
    cursor: "text",
    minHeight: "50px",
    whiteSpace: "pre-wrap",
  }}
>
  {noteTitle || "Write your note here..."}
</div>



   <div
  className="preview-name"
  contentEditable
  suppressContentEditableWarning={true}
  onInput={(e) => setNoteBy(e.currentTarget.innerText)}
  style={{
    outline: "none",
    cursor: "text",
  }}
>
  {noteBy || "Your Name"}
</div>

  </div>
</div> */}
<div className="thankyou-preview">
  <div className="sticky-preview" style={{ position: "relative", width: "300px", height: "300px"  }}>
    <Image
      src={StickyImage}
      alt="Sticky Note Background"
      fill
      style={{ objectFit: "cover", borderRadius: "12px" }}
    />

{/* <div
  ref={noteTextAreaRef}
  className="preview-text"
  contentEditable
  suppressContentEditableWarning={true}
  data-placeholder="Write your note here..."
  style={{
    outline: "none",
    cursor: "text",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    minHeight: "150px",
    fontWeight: "500",
    fontSize: "15px",
    fontFamily: "'Montserrat', sans-serif",
  }}
  onInput={handleNoteInput}
>
  {noteTitle}
</div> */}
<div
      ref={noteTextAreaRef}
      className="preview-text"
      contentEditable
      suppressContentEditableWarning={true}
      data-placeholder="Write your note here..."
      onInput={handleNoteInput}
      style={{
        outline: "none",
        cursor: "text",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        fontWeight: "500",
        fontSize: "15px",
        fontFamily: "'Montserrat', sans-serif",
        lineHeight: "1.5em",
        minHeight: "12em",
        maxHeight: "12em",
        overflow: "hidden",
      }}
    >
      {noteTitle}
    </div>

  <div
  ref={nameRef}
  className="preview-name"
  contentEditable
  suppressContentEditableWarning={true}
  style={{
    outline: "none",
    cursor: "text",
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    fontWeight: "500",
    fontSize: "15px",
    fontFamily: "'Montserrat', sans-serif",
  }}
  onInput={handleNameInput}
>
  {noteBy || "Your Name"}
</div>


    {/* Emoji Picker Toggle */}
    <button
      type="button"
      onClick={() => setShowEmojiPicker((prev) => !prev)}
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
      }}
    >
      <Image src={emojiIcon} alt="Emoji" width={24} height={24} />
    </button>

    {/* Emoji Picker */}
 
  </div>
    {showEmojiPicker && (
          <div  style={{ position:"relative", zIndex: 10,  margin: "0px auto"}}>
        <EmojiPicker
          width={emojiWidth}
          searchDisabled={true}
           previewConfig={{ showPreview: false }} 
             skinTonesDisabled={true}    
          onEmojiClick={(emojiData) => {
            const sel = window.getSelection();
            const range = sel.getRangeAt(0);
            const emojiNode = document.createTextNode(emojiData.emoji);
            range.insertNode(emojiNode);
            range.setStartAfter(emojiNode);
            range.setEndAfter(emojiNode);
            sel.removeAllRanges();
            sel.addRange(range);

            setNoteTitle(document.querySelector(".preview-text").innerText);
            setShowEmojiPicker(false);
          }}
        />
      </div>
    )}
</div>
 

    {/* <div className="form-group">
  <label className="label">Type Note</label>
<div className="textarea-with-emoji">
  <textarea
    ref={noteTextAreaRef}
    rows={4}
    placeholder="Write Your Thank You Message..."
    value={noteTitle}
    className="textareanote"
    onFocus={() => {
      if (showEmojiPicker) setShowEmojiPicker(false);
    }}
    onChange={(e) => {
      let input = e.target.value;

      // Split by user-entered lines
      const lines = input.split("\n");
      let adjustedLines = [];

      for (let i = 0; i < lines.length && adjustedLines.length < 8; i++) {
        let line = lines[i];

        if (!line) {
          adjustedLines.push("");
          continue;
        }

        let words = line.split(" ");
        let currentLine = "";

        for (let j = 0; j < words.length; j++) {
          if (adjustedLines.length >= 8) break;
          let word = words[j];

          let testLine = currentLine ? currentLine + " " + word : word;

          if (testLine.length > 27) {
         
            if (currentLine) {
              adjustedLines.push(currentLine);
            }

          
            while (word.length > 27 && adjustedLines.length < 8) {
              adjustedLines.push(word.slice(0, 27));
              word = word.slice(27);
            }

            currentLine = word; 
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine && adjustedLines.length < 8) {
          while (currentLine.length > 27 && adjustedLines.length < 8) {
            adjustedLines.push(currentLine.slice(0, 27));
            currentLine = currentLine.slice(27);
          }
          if (currentLine && adjustedLines.length < 8) {
            adjustedLines.push(currentLine);
          }
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

      if (showEmojiPicker) setShowEmojiPicker(false); 
    }}
    onInput={(e) => {
      e.target.style.height = "auto";
      e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    }}
  />

 
  <button
    type="button"
    onClick={() => {
      setShowEmojiPicker((prev) => !prev);
      if (showEmojiPicker) {
        noteTextAreaRef.current?.focus();
      } else {
        noteTextAreaRef.current?.blur();
      }
    }}
    className="btn emoji-button"
  >
    <Image src={emojiIcon} alt="Emoji" className="emoji-icon" />
  </button>
</div>



  <p
  className="word-limit"
  style={{ color: charCount >= 216 ? "red" : "#4A4A4A" }}
>
  {charCount >= 216
    ? "You have reached the 8 line / 27 character per line limit!"
    : `${charCount} / 216 characters`}
</p>


  {showEmojiPicker && (
    <div className="emoji-container-thankyou" style={{ position: "static", zIndex: 10, marginTop: "10px" }}>
      <EmojiPicker
        width={emojiWidth}
        searchDisabled={true}
        onEmojiClick={(emojiData) => {
          const textarea = noteTextAreaRef.current;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;

          setNoteTitle((prevText) => {
            const newText =
              prevText.substring(0, start) +
              emojiData.emoji +
              prevText.substring(end);

            // Update cursor position
            requestAnimationFrame(() => {
              textarea.selectionStart = textarea.selectionEnd = start + emojiData.emoji.length;
            });

            return newText;
          });

          setShowEmojiPicker(false); 
        }}
      />
    </div>
  )}
</div>


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
      </div> */}

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
          padding: "5px",
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
            top: "52%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "75%",
            zIndex: 1,
            textAlign: "left",
            alignItems:"center"
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
              justifyContent:"center"
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
  - {noteBy.length > 15 ? noteBy.substring(0, 15) + "..." : noteBy}
</div>

      </div>
      
    </div>
  );
};

export default ThankYouNotePopup;
