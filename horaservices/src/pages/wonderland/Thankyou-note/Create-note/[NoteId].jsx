import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import "./createNote.css";
import { notesData } from "@/utils/ThankyounotesData.js";
import CustomButton from "@/components/wonderland/common/CustomButton";
import Image from "next/image";
import {
  GET_USER_BY_ID,
  BASE_URL,
  CREATE_NEW_POST,
} from "@/utils/apiconstants";
import EmojiPickerButton from "@/components/EmojiPicker";
import NoteSkeleton from "@/components/wonderland/NoteSkeleton";
import { captureElementAsImage } from "@/utils/captureElementAsImage";
import { uploadImage } from "@/utils/handleMediaUpload";
import useApi from "@/hooks/useApi";

export default function NoteDetails() {
  const router = useRouter();
  const { NoteId } = router.query;
  const [note, setNote] = useState(null);
  const [liveData, setLiveData] = useState({
    title: "",
    content: "",
    author: "",
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
 
const [activeField, setActiveField] = useState("content"); 

  const [lastSelection, setLastSelection] = useState({ start: 0, end: 0 });
  const [showBorders, setShowBorders] = useState(true);

  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const authorRef = useRef(null);
  const noteRef = useRef(null);

  const { makeRequest: createPost } = useApi();
  const [userName, setUserName] = useState("");
  const [uploading, setUploading] = useState(false);


  useEffect(() => {
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userID") : null;

    if (!userId) return;

    const fetchUserName = async () => {
      try {
        const response = await fetch(`${BASE_URL}${GET_USER_BY_ID}/${userId}`);
        const result = await response.json();

        const data = result?.data || result?.user || {};
        const name = data.hostName || data.userName || data.name || "Guest";

        setUserName(name);
      } catch (err) {
        console.error("Error fetching user name:", err);
      }
    };

    fetchUserName();
  }, []);

 
  useEffect(() => {
    if (NoteId) {
      const found = notesData.find((n) => n.id === Number(NoteId));
      if (found) {
        setNote(found);
        setLiveData({
          title: found.title || "",
          content: found.content || "",
          author: found.author || "",
        });
      }
    }
  }, [NoteId]);

  const adjustHeight = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleChange = (field, value, ref) => {
    setLiveData((prev) => ({ ...prev, [field]: value }));
    adjustHeight(ref.current);
  };


 const [lastRange, setLastRange] = useState(null);

const handleFocus = (field, ref) => {
  setActiveField(field);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      setLastRange(sel.getRangeAt(0));
    }
  };

  const el = ref.current;
  el.addEventListener("keyup", saveSelection);
  el.addEventListener("mouseup", saveSelection);
  el.addEventListener("focus", saveSelection);
};


const handleEmojiSelect = (emojiObject) => {
  const emojiImgUrl = emojiObject?.imageUrl || "/default-emoji.png";

  // Default: content if title not active
  let ref;
  if (activeField === "title" && titleRef.current) ref = titleRef.current;
  else ref = contentRef.current;

  if (!ref) return;

  ref.focus();

  const sel = window.getSelection();
  sel.removeAllRanges();

  
  const range = lastRange?.cloneRange() || document.createRange();
  if (!lastRange || !ref.contains(lastRange.startContainer)) {
    // cursor at end if lastRange is outside
    range.selectNodeContents(ref);
    range.collapse(false);
  }

  sel.addRange(range);

  // Create emoji img
  const img = document.createElement("img");
  img.src = emojiImgUrl;
  img.className = "emoji-inline";

  range.insertNode(img);

  // Move cursor after emoji
  range.setStartAfter(img);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);

 
  setLiveData((prev) => ({
    ...prev,
    [activeField === "title" ? "title" : "content"]: ref.innerHTML,
  }));


  setLastRange(range);
};


  useEffect(() => {
    const clickOutside = (e) => {
      if (
        showEmojiPicker &&
        !e.target.closest(".emoji-picker-container") &&
        !e.target.closest(".emoji-button")
      ) {
        setShowEmojiPicker(false);
        document.body.classList.remove("emoji-open");
      }
    };
    document.addEventListener("click", clickOutside);
    return () => document.removeEventListener("click", clickOutside);
  }, [showEmojiPicker]);


  const handleDownload = async () => {
    if (!noteRef.current) return;
    setUploading(true);
    setShowBorders(false);

    const { eventid } = router.query;
    if (!eventid) return;

    const userID =
      typeof window !== "undefined" ? localStorage.getItem("userID") : null;
    if (!userID) return console.error("userID not found");

   
    const blob = await captureElementAsImage(noteRef.current, [
      ".emoji-button",
    ]);
    if (!blob) return console.error("Failed to capture image.");

    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

   
    localStorage.setItem(`thankyou-note-draft-${eventid}`, base64);
    router.push(`/wonderland/invite?eventid=${eventid}`);

   
    (async () => {
      try {
        const file = new File([blob], "note.png", { type: blob.type });

        const response = await uploadImage(
          file,
          userID,
          eventid,
          "thankyou-note",
          (percent) => console.log(`Upload progress: ${percent}%`)
        );

        if (response?.success) {
          const postPayload = {
            postById: userID,
            postByName: userName || "Guest",
            postType: "thankYouNote",
            postUrl: response.originalUrl,
            postKey: response.originalKey,
            postWebpUrl: response.thumbnailUrl,
            postWebpKey: response.thumbnailKey,
          };

          await createPost(
            `${CREATE_NEW_POST}/${eventid}`,
            "POST",
            postPayload
          );
        }
      } catch (err) {
        console.error("Background upload failed:", err);
      }
    })();

    setUploading(false);
  };
const handleOpenEmojiPicker = () => {
  if (!activeField) {
    setActiveField("content");  
    contentRef.current?.focus(); 
  }
  setShowEmojiPicker((prev) => !prev);
};

  if (!note) return <NoteSkeleton />;

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Just+Another+Hand&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="note-scroll-container">
        <div
          ref={noteRef}
          className="createNote-container"
          style={{ background: note.color, position: "relative" }}
        >
          <div className="icon-sec">
            {note.icon && (
              <Image src={note.icon} alt="" className="createNote-icon" />
            )}

          </div>
          <div className="createNote-header">

        
          </div>
             <div
            ref={titleRef}
            contentEditable
            onInput={(e) =>
             handleChange("title", e.currentTarget.innerHTML, titleRef)
            }
            onFocus={() => handleFocus("title", titleRef)}
            suppressContentEditableWarning={true}
            className={`textArea-title ${showBorders ? "always-border" : ""}`}
            data-placeholder="Write your title..."
          />

          <div
            ref={contentRef}
            contentEditable
            onInput={(e) =>
              handleChange("content", e.currentTarget.innerHTML, contentRef)
            }
            onFocus={() => handleFocus("content", contentRef)}
            suppressContentEditableWarning={true}
            className={`textArea-Content ${showBorders ? "always-border" : ""}`}
            data-placeholder="Write your note..."
          />


          <div className="emojisec">
            <div className="textArea-Author">
              {userName ? `- ${userName}` : "- Fetching your name..."}
            </div>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 300,
              }}
            >
              <EmojiPickerButton
                onClick={handleOpenEmojiPicker}
                onEmojiSelect={handleEmojiSelect}
                isPickerOpen={showEmojiPicker}
                setIsPickerOpen={setShowEmojiPicker}
              />
            </div>
          </div>



        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CustomButton
              title={"Submit"}
              onClick={!uploading && handleDownload}
              loading={uploading}
            />
        </div>
      </div>
    </>
  );
}
