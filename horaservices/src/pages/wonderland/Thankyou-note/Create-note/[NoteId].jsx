
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import html2canvas from "html2canvas";
import "./createNote.css";
import { notesData } from "@/utils/ThankyounotesData.js";
import CustomButton from "@/components/wonderland/common/CustomButton";
import Image from "next/image";
import { GET_USER_BY_ID, BASE_URL, UPLOAD_THANKYOU_NOTE, } from "@/utils/apiconstants";
import EmojiPickerButton from "@/components/EmojiPicker";

export default function NoteDetails() {
  const router = useRouter();
  const { NoteId } = router.query;

  const [note, setNote] = useState(null);
  const [liveData, setLiveData] = useState({ title: "", content: "", author: "" });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [lastSelection, setLastSelection] = useState({ start: 0, end: 0 });
  const [preventRefocus, setPreventRefocus] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const authorRef = useRef(null);
  const noteRef = useRef(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userID") : null;

    if (!userId) {
      console.warn("⚠️ No userId found in localStorage");
      return;
    }

    const fetchUserName = async () => {
      try {
        const response = await fetch(`${BASE_URL}${GET_USER_BY_ID}/${userId}`);
        const result = await response.json();
        console.log("🧩 API Response:", result);

        const data = result?.data || result?.user || {};
        const name = data.hostName || data.userName || data.name || "Guest";

        setUserName(name);
      } catch (err) {
        console.error("❌ Error fetching user name:", err);
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
    if (!showEmojiPicker && activeField && !preventRefocus) {
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
 
  const { eventId } = router.query; 
  if (!eventId) {
    console.error("eventId is undefined");
    return;
  }
  const userID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  if (!userID) {
    console.error("userID not found");
    return;
  }

  const emojiButton = noteRef.current.querySelector(".emoji-button");
  if (emojiButton) emojiButton.style.display = "none";

  const textareas = noteRef.current.querySelectorAll("textarea");
  const replacements = [];

  textareas.forEach((ta) => {
    const div = document.createElement("div");
    const computed = window.getComputedStyle(ta);
    Object.assign(div.style, {
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
      overflowWrap: "break-word",
      display: "block",
      boxSizing: "border-box",
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      letterSpacing: computed.letterSpacing,
      lineHeight: computed.lineHeight,
      color: computed.color,
      textAlign: computed.textAlign,
      background: computed.backgroundColor,
      padding: computed.padding,
      margin: computed.margin,
      width: `${ta.offsetWidth}px`,
      minHeight: `${ta.offsetHeight}px`,
      borderRadius: computed.borderRadius,
      transform: computed.transform,
      textTransform: computed.textTransform,
    });
    div.textContent = ta.value || ta.placeholder || "";
    ta.parentNode.insertBefore(div, ta);
    ta.style.display = "none";
    replacements.push({ ta, div });
  });

  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 100));

  const canvas = await html2canvas(noteRef.current, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
  });

  replacements.forEach(({ ta, div }) => {
    div.remove();
    ta.style.display = "";
  });
  if (emojiButton) emojiButton.style.display = "";

 canvas.toBlob(async (blob) => {
  if (!blob) return;

  const formData = new FormData();
  formData.append("image", blob, "note.png");
  formData.append("userId", userID);
  formData.append("name", userName || "Guest"); 

  try {
    const response = await  fetch(`${BASE_URL}${UPLOAD_THANKYOU_NOTE}/${eventId}/thankyou-note`, {
  method: "PUT",
  headers: { Authorization: `${token}` },
  body: formData,
});

    console.log("API Status:", response.status);
    console.log("API Response:", await response.json());
  } catch (err) {
    console.error("Upload failed:", err);
  }
}, "image/png");

};


  // const handleDownload = async () => {
  //   if (!noteRef.current) return;
  //   const emojiButton = noteRef.current.querySelector(".emoji-button");
  //   if (emojiButton) emojiButton.style.display = "none";

  //   const textareas = noteRef.current.querySelectorAll("textarea");
  //   const replacements = [];

  //   textareas.forEach((ta) => {
  //     const div = document.createElement("div");
  //     const computed = window.getComputedStyle(ta);
  //     Object.assign(div.style, {
  //       whiteSpace: "pre-wrap",
  //       wordWrap: "break-word",
  //       overflowWrap: "break-word",
  //       display: "block",
  //       boxSizing: "border-box",
  //       fontFamily: computed.fontFamily,
  //       fontSize: computed.fontSize,
  //       fontWeight: computed.fontWeight,
  //       letterSpacing: computed.letterSpacing,
  //       lineHeight: computed.lineHeight,
  //       color: computed.color,
  //       textAlign: computed.textAlign,
  //       background: computed.backgroundColor,
  //       padding: computed.padding,
  //       margin: computed.margin,
  //       width: `${ta.offsetWidth}px`,
  //       minHeight: `${ta.offsetHeight}px`,
  //       borderRadius: computed.borderRadius,
  //       transform: computed.transform,
  //       textTransform: computed.textTransform,
  //     });
  //     div.textContent = ta.value || ta.placeholder || "";
  //     ta.parentNode.insertBefore(div, ta);
  //     ta.style.display = "none";
  //     replacements.push({ ta, div });
  //   });

  //   await document.fonts.ready;
  //   await new Promise((r) => setTimeout(r, 100));

  //   const canvas = await html2canvas(noteRef.current, {
  //     scale: 2,
  //     useCORS: true,
  //     backgroundColor: null,
  //     logging: false,
  //   });
  //   replacements.forEach(({ ta, div }) => {
  //     div.remove();
  //     ta.style.display = "";
  //   });

  //   if (emojiButton) emojiButton.style.display = "";
  //   const link = document.createElement("a");
  //   link.download = `${liveData.title || "note"}.png`;
  //   link.href = canvas.toDataURL("image/png");
  //   link.click();
  // };

  useEffect(() => {
    const scrollContainer = document.querySelector(".note-scroll-container");
    if (!scrollContainer) return;

    if (showEmojiPicker) {
      scrollContainer.classList.add("keyboard-open");
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
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
      <div
        className="note-scroll-container"
      >

        <div
          ref={noteRef}
          className="createNote-container"
          style={{ background: note.color, position: "relative" }}
        >
          <div className="createNote-header">
            {note.icon && <Image src={note.icon} alt="" className="createNote-icon" />}
          </div>

          <textarea
            ref={titleRef}
            value={liveData.title}
            rows={1}
            onChange={(e) => handleChange("title", e.target.value, titleRef)}
            onFocus={() => { handleFocus("title", titleRef); setFocusedField("title"); }}
            onBlur={() => {
              if (!showEmojiPicker) setFocusedField(null);
            }}

            placeholder="TITLE..."
            className={`textArea-title ${focusedField === "title" || (showEmojiPicker && activeField === "title")
                ? "active-border"
                : ""
              }`}


          />

          <textarea
            ref={contentRef}
            value={liveData.content}
            rows={2}
            onChange={(e) => handleChange("content", e.target.value, contentRef)}
            onFocus={() => {
              handleFocus("content", contentRef);
              setFocusedField("content");
            }}
            onBlur={() => {
              if (!showEmojiPicker) setFocusedField(null);
            }}

            placeholder="Write your note..."
            className={`textArea-Content ${focusedField === "content" || (showEmojiPicker && activeField === "content")
                ? "active-border"
                : ""
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
          <CustomButton title={"Submit"} onClick={handleDownload} />
        </div>
      </div>
    </>
  );
}