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
  const [activeField, setActiveField] = useState(null);
  const [lastSelection, setLastSelection] = useState({ start: 0, end: 0 });
  const [showBorders, setShowBorders] = useState(true);

  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const authorRef = useRef(null);
  const noteRef = useRef(null);

  const { makeRequest: createPost } = useApi();
  const [userName, setUserName] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch User Name
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

  // Load Note Data
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

  // Auto height expand textareas
  const adjustHeight = (el) => {
    if (!el) return;

    const currentY = window.scrollY;
    const caret = el.selectionStart;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;

    window.scrollTo({ top: currentY });
    el.setSelectionRange(caret, caret);
  };

  const handleChange = (field, value, ref) => {
    setLiveData((prev) => ({ ...prev, [field]: value }));
    adjustHeight(ref.current);
  };

  // Track cursor selection
  const handleFocus = (field, ref) => {
    setActiveField(field);
    const el = ref.current;

    const updateSelection = () => {
      setLastSelection({
        start: el.selectionStart,
        end: el.selectionEnd,
      });
    };

    el.addEventListener("keyup", updateSelection);
    el.addEventListener("mouseup", updateSelection);
  };

  // Insert emoji AND scroll page to bottom
  const handleEmojiSelect = (emoji) => {
    const ref =
      activeField === "title"
        ? titleRef.current
        : activeField === "content"
        ? contentRef.current
        : authorRef.current;

    if (!ref) return;

    const start = lastSelection.start ?? ref.value.length;
    const end = lastSelection.end ?? ref.value.length;

    const newValue =
      ref.value.slice(0, start) + emoji + ref.value.slice(end);

    ref.value = newValue;

    const newCursor = start + emoji.length;

    setLiveData((prev) => ({ ...prev, [activeField]: newValue }));
    setLastSelection({ start: newCursor, end: newCursor });

    adjustHeight(ref);

    // ⭐ Scroll full window to bottom
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  // // Scroll full page when emoji picker opens
  // useEffect(() => {
  //   if (showEmojiPicker) {
  //     setTimeout(() => {
  //       window.scrollTo({
  //         top: document.body.scrollHeight,
  //         behavior: "smooth",
  //       });
  //     }, 100);
  //   }
  // }, [showEmojiPicker]);

  // Close emoji picker on outside click
  useEffect(() => {
    const clickOutside = (e) => {
      if (
        showEmojiPicker &&
        !e.target.closest(".emoji-picker-container") &&
        !e.target.closest(".emoji-button")
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("click", clickOutside);
    return () => document.removeEventListener("click", clickOutside);
  }, [showEmojiPicker]);

// // 👇 The new logic to handle browser back button
// useEffect(() => {
//   // 1. When the picker opens, push a new state onto the history stack.
//   // This makes the browser's "back" action first target this new state.
//   if (showEmojiPicker) {
//     // Push a new state only when the picker is opened.
//     window.history.pushState({ isPickerOpen: true }, '', null); 
//   }

//   const handlePopState = (e) => {
//     // Check if the component believes the picker is open.
//     if (showEmojiPicker) {
//       // Prevent default back navigation.
//       e.preventDefault(); 
      
//       // Close the picker.
//       setShowEmojiPicker(false);
      
//       // Push a new, clean state back onto history to "undo" the pop state.
//       // This ensures the next 'back' action goes to the previous route.
//       window.history.pushState({ isPickerOpen: false }, '', null);

//     } else {
//       // If the picker is not open, allow the default navigation to occur.
//     }
//   };

//   // Attach the listener
//   window.addEventListener('popstate', handlePopState);

//   // Cleanup: Remove the listener when the component unmounts or effect reruns.
//   return () => {
//     window.removeEventListener('popstate', handlePopState);
//   };
// }, [showEmojiPicker]);

  // Download + Upload
  const handleDownload = async () => {
    if (!noteRef.current) return;
    setUploading(true);
    setShowBorders(false);

    const { eventid } = router.query;
    if (!eventid) return;

    const userID =
      typeof window !== "undefined" ? localStorage.getItem("userID") : null;
    if (!userID) return console.error("userID not found");

    // Capture blob
    const blob = await captureElementAsImage(noteRef.current, [
      ".emoji-button",
    ]);
    if (!blob) return console.error("Failed to capture image.");

    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

    // Step 3: Save draft to localStorage & navigate back
    localStorage.setItem("thankyou-note-draft", base64);
    router.push(`/wonderland/invite?eventid=${eventid}`);

    // API calls in background
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

    // Step 6: Stop uploading spinner (UI clean)
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
          style={{ background: note.color, position: "relative" }}
        >
          <div className="icon-sec">
              {note.icon && (
              <Image src={note.icon} alt="" className="createNote-icon" />
            )}

          </div>
          <div className="createNote-header">
          
            <textarea
              ref={titleRef}
              value={liveData.title}
              rows={1}
              onChange={(e) => handleChange("title", e.target.value, titleRef)}
              onFocus={() => handleFocus("title", titleRef)}
              placeholder="TITLE..."
              className={`textArea-title ${
                showBorders ? "always-border" : ""
              }`}
            />
          </div>

          <textarea
            ref={contentRef}
            // value={liveData.content}
            rows={2}
            onChange={(e) =>
              handleChange("content", e.target.value, contentRef)
            }
            onFocus={() => handleFocus("content", contentRef)}
            placeholder="Write your note..."
            className={`textArea-Content ${
              showBorders ? "always-border" : ""
            }`}
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
