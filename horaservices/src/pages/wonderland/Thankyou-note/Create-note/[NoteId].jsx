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


  const handleFocus = (field, ref) => {
    setActiveField(field);
    const el = ref.current;

    const updateSelection = () => {
      if (el.selectionStart !== undefined) {
        setLastSelection({
          start: el.selectionStart,
          end: el.selectionEnd,
        });
      }
    };

    el.addEventListener("keyup", updateSelection);
    el.addEventListener("mouseup", updateSelection);
  };

  const handleEmojiSelect = (emojiObject) => {
    const emojiImgUrl = emojiObject?.imageUrl || "/default-emoji.png";

    let ref = activeField === "title" ? titleRef.current : contentRef.current;
    if (!ref) return;

    const sel = window.getSelection();


    let range;
    if (sel.rangeCount > 0) {
      range = sel.getRangeAt(0);
    } else {
      ref.focus();
      range = document.createRange();
      range.selectNodeContents(ref);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }


    const img = document.createElement("img");
    img.src = emojiImgUrl;
    img.className = "emoji-inline";

    range.insertNode(img);
    range.setStartAfter(img);
    range.setEndAfter(img);


    const fieldValue = activeField === "title" ? ref.innerText : ref.innerHTML;
    setLiveData((prev) => ({ ...prev, [activeField]: fieldValue }));

    sel.removeAllRanges();
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

            <div
              ref={titleRef}
              contentEditable
              onInput={(e) =>
                handleChange("title", e.currentTarget.innerText, titleRef)
              }
              onFocus={(e) => {
                handleFocus("title", titleRef);
                if (e.currentTarget.innerText === "TITLE...") {
                  e.currentTarget.innerText = "";
                }
              }}
              onBlur={(e) => {
                if (!e.currentTarget.innerText.trim()) {
                  e.currentTarget.innerText = "TITLE...";
                }
              }}
              suppressContentEditableWarning={true}
              className={`textArea-title ${showBorders ? "always-border" : ""}`}
            >
              {liveData.title || "TITLE..."}
            </div>
          </div>
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
