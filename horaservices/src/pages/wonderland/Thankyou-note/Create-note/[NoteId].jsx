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
import NoteSkeleton from "@/components/wonderland/NoteSkeleton";
import { captureElementAsImage } from "@/utils/captureElementAsImage";
import { addToQueue } from "@/utils/handleMediaUpload";
import useApi from "@/hooks/useApi";
import EmojiPickerButtonNotes from "@/components/EmojiPicker/EmojiPickerNotes";
import { saveFileToOPFS } from "@/utils/eventWallHelpers";
import { fetchWithError } from "@/utils/fetchWithError";
import { safeGetItem } from "@/utils/safeStorage";

export default function NoteDetails() {
  const router = useRouter();
  const { NoteId, frompanel } = router.query;
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
    typeof window !== "undefined" ? safeGetItem("userID") : null;

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
        const res = await fetchWithError(`${BASE_URL}${GET_USER_BY_ID}/${userId}`);
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

    const ref = activeField === "title" ? titleRef.current : contentRef.current;

    // Focus without triggering keyboard by temporarily setting inputmode
    ref.setAttribute("inputmode", "none");
    ref.focus({ preventScroll: true });
    setTimeout(() => {
      ref.removeAttribute("inputmode");
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

  const handleDownload = async () => {
    if (!noteRef.current) return;

    setUploading(true);
    setShowBorders(false);

    const { eventid } = router.query;

    if (!eventid || !userId) return;

    const blob = await captureElementAsImage(noteRef.current, [
      ".emoji-button",
    ]);

    if (!blob) return;

    const file = new File([blob], "thankyou-note.png", {
      type: "image/png",
    });

    const id = crypto.randomUUID();

    // save to OPFS
    const saved = await saveFileToOPFS(file, eventid, id);

    if (!saved) {
      alert("Failed to save image");
      return;
    }

    // queue item
    await addToQueue({
      id,
      eventId: eventid,
      fileName: file.name,
      mimeType: file.type,
      isVideo: false,
      status: "queued",
      progress: 0,
      retryCount: 0,
      createdAt: Date.now(),
      postType: "thankYouNote",
      folder: "thankyou-note",
    });

    // instant navigation
    if(frompanel == 'true'){
      router.push(`/wonderland/invite?eventid=${eventid}&frompanel=true`);
    }
    router.push(`/wonderland/invite?eventid=${eventid}`);

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
          style={{
            background: note.color,
            justifyContent: NoteId == 6 ? "center" : "flex-start",
          }}
        >
          <div className="icon-sec">
            {note.icon && (
              <Image
                src={note.icon}
                alt=""
                className="createNote-icon"
                style={{ height: note.height, width: note.width }}
              />
            )}
          </div>

          {/* -------- Title -------- */}
          {NoteId != 6 && (
            <div
              ref={titleRef}
              contentEditable
              suppressContentEditableWarning={true}
              onFocus={() => onFocus("title", titleRef)}
              className={`textArea-title ${showBorders ? "always-border" : ""}`}
              style={{
                minHeight: NoteId == 6 ? "15vh" : "auto",
                display: NoteId == 6 ? "flex" : "",
                flexDirection: NoteId == 6 ? "column" : "",
                alignItems: NoteId == 6 ? "center" : "",
                justifyContent: NoteId == 6 ? "center" : "",
              }}
            ></div>
          )}
          {NoteId == 6 && (
            <div
              ref={titleRef}
              contentEditable
              suppressContentEditableWarning={true}
              onFocus={() => onFocus("title", titleRef)}
              className={`textArea-Content hashtagText ${showBorders ? "always-border" : ""}`}
              style={{
                display: NoteId == 6 ? "flex" : "",
                flexDirection: NoteId == 6 ? "column" : "",
                alignItems: NoteId == 6 ? "center" : "",
                justifyContent: NoteId == 6 ? "center" : "",
              }}
            ></div>
          )}

          {/* -------- Content -------- */}
          {NoteId != 6 && (
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onFocus={() => onFocus("content", contentRef)}
              className={`textArea-Content ${showBorders ? "always-border" : ""}`}
              data-placeholder="Write your note..."
            />
          )}

          <div
            className="emojisec-notes"
            style={{ marginTop: NoteId == 6 ? "20px" : "" }}
          >
            <div className="textArea-Author">
              {userName ? `- ${userName}` : "- Loading..."}
            </div>

            <div
              className="emoji-button"
              style={{ position: "absolute", right: 5, top: 0 }}
            >
              <EmojiPickerButtonNotes
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
