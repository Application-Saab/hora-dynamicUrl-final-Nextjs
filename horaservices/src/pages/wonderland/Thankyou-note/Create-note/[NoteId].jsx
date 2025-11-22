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

  useEffect(() => {
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userID") : null;

    if (!userId) {
      console.warn("No userId found in localStorage");
      return;
    }

    const fetchUserName = async () => {
      try {
        const response = await fetch(`${BASE_URL}${GET_USER_BY_ID}/${userId}`);
        const result = await response.json();
        console.log("API Response:", result);

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
    if (el) {
      const startScrollY = window.scrollY;
      const caretPos = el.selectionStart;

      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;

      window.scrollTo({ top: startScrollY });
      el.setSelectionRange(caretPos, caretPos);
    }
  };

  const handleChange = (field, value, ref) => {
    setLiveData((prev) => ({ ...prev, [field]: value }));
    adjustHeight(ref.current);
  };

  useEffect(() => {
    if (!showEmojiPicker && activeField) {
      const ref =
        activeField === "title"
          ? titleRef.current
          : activeField === "content"
          ? contentRef.current
          : authorRef.current;

      if (ref) {
        ref.focus();
        const { start, end } = lastSelection;
        if (typeof start === "number" && typeof end === "number") {
          setTimeout(() => {
            ref.setSelectionRange(start, end);
          }, 50);
        }
      }
    }
  }, [showEmojiPicker]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showEmojiPicker &&
        !e.target.closest(".emoji-picker-container") &&
        !e.target.closest(".emoji-button")
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showEmojiPicker]);

  const handleFocus = (field, ref) => {
    setActiveField(field);
    const el = ref.current;
    if (!el) return;

    const updateSelection = () => {
      setLastSelection({
        start: el.selectionStart,
        end: el.selectionEnd,
      });
    };

    el.addEventListener("keyup", updateSelection);
    el.addEventListener("mouseup", updateSelection);
  };

  const handleEmojiSelect = (emoji) => {
    const ref =
      activeField === "title"
        ? titleRef.current
        : activeField === "content"
        ? contentRef.current
        : authorRef.current;

    if (!ref) return;

    const scrollContainer = document.querySelector(".note-scroll-container");
    const prevScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
    const prevWindowY = window.scrollY;

    const start = lastSelection.start ?? ref.value.length;
    const end = lastSelection.end ?? ref.value.length;

    const newValue = ref.value.slice(0, start) + emoji + ref.value.slice(end);
    ref.value = newValue;

    const newCursor = start + emoji.length;

    setLiveData((prev) => ({ ...prev, [activeField]: newValue }));
    setLastSelection({ start: newCursor, end: newCursor });

    const oldHeight = ref.scrollHeight;
    adjustHeight(ref);
    const newHeight = ref.scrollHeight;

    if (scrollContainer) {
      const diff = newHeight - oldHeight;
      const isAtBottom =
        prevScrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 10;

      requestAnimationFrame(() => {
        scrollContainer.scrollTop = isAtBottom
          ? scrollContainer.scrollTop + diff
          : prevScrollTop;
      });
    }
    requestAnimationFrame(() => {
      window.scrollTo({ top: prevWindowY });
    });
  };

  const handleDownload = async () => {
    if (!noteRef.current) return;
    setUploading(true);
    setShowBorders(false);

    const { eventid } = router.query;
    if (!eventid) return console.error("eventId is undefined");

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

  useEffect(() => {
    const scrollContainer = document.querySelector(".note-scroll-container");
    if (!scrollContainer) return;

    if (showEmojiPicker) {
      const isAtBottom =
        scrollContainer.scrollHeight -
          scrollContainer.scrollTop -
          scrollContainer.clientHeight <
        10;

      if (isAtBottom) {
        // Only scroll if the user is already at the bottom
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        });
      }

      scrollContainer.classList.add("keyboard-open");
    } else {
      scrollContainer.classList.remove("keyboard-open");
    }
  }, [showEmojiPicker]);

  if (!note) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Just+Another+Hand&display=swap"
          rel="stylesheet"
        />
      </Head>
      {!note ? (
        <NoteSkeleton />
      ) : (
        <div className="note-scroll-container">
          <div
            ref={noteRef}
            className="createNote-container"
            style={{ background: note.color, position: "relative" }}
          >
            <div className="createNote-header">
              {note.icon && (
                <Image src={note.icon} alt="" className="createNote-icon" />
              )}

              <textarea
                ref={titleRef}
                value={liveData.title}
                rows={1}
                onChange={(e) =>
                  handleChange("title", e.target.value, titleRef)
                }
                onFocus={() => {
                  handleFocus("title", titleRef);
                }}
                placeholder="TITLE..."
                className={`textArea-title ${
                  showBorders ? "always-border" : ""
                }`}
              />
            </div>

            <textarea
              ref={contentRef}
              value={liveData.content}
              rows={2}
              onChange={(e) =>
                handleChange("content", e.target.value, contentRef)
              }
              onFocus={() => {
                handleFocus("content", contentRef);
              }}
              placeholder="Write your note..."
              className={`textArea-Content ${
                showBorders ? "always-border" : ""
              }`}
            />

            <textarea
              rows={1}
              value={userName ? `- ${userName}` : ""}
              readOnly
              placeholder="- Fetching your name..."
              className="textArea-Author"
            />

            <div
              style={{
                position: "absolute",
                bottom: "12px",
                right: "12px",
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

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <CustomButton
              title={"Submit"}
              onClick={!uploading && handleDownload}
              loading={uploading}
            />
          </div>
        </div>
      )}
    </>
  );
}
