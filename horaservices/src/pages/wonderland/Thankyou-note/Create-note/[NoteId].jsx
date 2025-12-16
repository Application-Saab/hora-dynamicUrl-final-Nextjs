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
  const [userName, setUserName] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeField, setActiveField] = useState("content");
  const [uploading, setUploading] = useState(false);
  const [showBorders, setShowBorders] = useState(true);

  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const noteRef = useRef(null);

  const lastRangeRef = useRef(null); // ✔ cursor memory

  const { makeRequest: createPost } = useApi();
const userId =
  typeof window !== "undefined" ? localStorage.getItem("userID") : null;

  // ----------- Load Note ------------
  useEffect(() => {
    if (NoteId) {
      const found = notesData.find((n) => n.id === Number(NoteId));
      if (found) setNote(found);
    }
  }, [NoteId]);

  // ----------- Load User Name ------------
  useEffect(() => {
   
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}${GET_USER_BY_ID}/${userId}`);
        const data = await res.json();
        const u = data?.data || data?.user || {};
        setUserName(u.hostName || u.userName || u.name || "Guest");
      } catch (e) {}
    };

    fetchUser();
  }, []);

  // ----------- Keep cursor saved -----------

  const saveCursor = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      lastRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const onFocus = (field, ref) => {
    setActiveField(field);

    const el = ref.current;
    el.addEventListener("keyup", saveCursor);
    el.addEventListener("mouseup", saveCursor);
    el.addEventListener("focus", saveCursor);
  };
useEffect(() => {
  if (note && titleRef.current) {
    titleRef.current.innerHTML = note.title || "";
  }
}, [note]);

  // ----------- INSERT EMOJI (FIXED) -----------

  const insertEmoji = (emojiObject) => {
    const emojiUrl = emojiObject?.imageUrl;

    const ref =
      activeField === "title" ? titleRef.current : contentRef.current;

    // Focus without triggering keyboard by temporarily setting inputmode
    ref.setAttribute('inputmode', 'none');
    ref.focus({ preventScroll: true });
    setTimeout(() => {
      ref.removeAttribute('inputmode');
    }, 50);

    let sel = window.getSelection();
    let range;

    if (
      lastRangeRef.current &&
      ref.contains(lastRangeRef.current.startContainer)
    ) {
      range = lastRangeRef.current;
    } else {
      range = document.createRange();
      range.selectNodeContents(ref);
      range.collapse(false);
    }

    sel.removeAllRanges();
    sel.addRange(range);

    const img = document.createElement("img");
    img.src = emojiUrl;
    img.className = "emoji-inline";

    range.insertNode(img);

    // ⭐ FIX: Move cursor after emoji (THIS IS THE MAGIC FIX)
    const newRange = document.createRange();
    newRange.setStartAfter(img);
    newRange.collapse(true);

    sel.removeAllRanges();
    sel.addRange(newRange);

    lastRangeRef.current = newRange; // save new cursor
  };

  // ----------- Download/Submit ------------
const uploadInBackground = async (blob, eventid) => {
  try {
    if (!userId) return;

    const file = new File([blob], "note.png", { type: blob.type });

    const response = await uploadImage(
      file,
      userId,
      eventid,
      "thankyou-note",
      (percent) => console.log(`Upload progress: ${percent}%`)
    );

    if (response?.success) {
      const postPayload = {
        postById: userId,
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
  } catch (err) {}
};

const handleDownload = async () => {
  if (!noteRef.current) return;

  setUploading(true);
  setShowBorders(false);

  const { eventid } = router.query;
  if (!eventid) return;
  if (!userId) return;

  const blob = await captureElementAsImage(noteRef.current, [".emoji-button"]);
  if (!blob) return;

  const base64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });

  localStorage.setItem(`thankyou-note-draft-${eventid}`, base64);

  router.push(`/wonderland/invite?eventid=${eventid}`);

  uploadInBackground(blob, eventid);

  setUploading(false);
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
          style={{ background: note.color }}
        >
          <div className="icon-sec">
            {note.icon && (
              <Image src={note.icon} alt="" className="createNote-icon" />
            )}
          </div>

          {/* -------- Title -------- */}
   <div
  ref={titleRef}
  contentEditable
  suppressContentEditableWarning={true}
  onFocus={() => onFocus("title", titleRef)}
  className={`textArea-title ${showBorders ? "always-border" : ""}`}
></div>



          {/* -------- Content -------- */}
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocus("content", contentRef)}
            className={`textArea-Content ${showBorders ? "always-border" : ""}`}
            data-placeholder="Write your note..."
          />

          <div className="emojisec">
            <div className="textArea-Author">
              {userName ? `- ${userName}` : "- Loading..."}
            </div>

            <div
              className="emoji-button"
              style={{ position: "absolute", right: 0, top: 0 }}
            >
              <EmojiPickerButton
                onEmojiSelect={insertEmoji}
                isPickerOpen={showEmojiPicker}
                setIsPickerOpen={setShowEmojiPicker}
              />
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <CustomButton
            title="Submit"
            onClick={handleDownload}
            loading={uploading}
          />
        </div>
      </div>
    </>
  );
}
