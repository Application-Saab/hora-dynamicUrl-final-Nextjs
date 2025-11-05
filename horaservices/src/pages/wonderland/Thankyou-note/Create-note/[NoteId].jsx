

// import { useRouter } from "next/router";
// import { useState, useEffect, useRef } from "react";
// import Head from "next/head";
// import html2canvas from "html2canvas";
// import "./createNote.css";
// import { notesData } from "@/utils/ThankyounotesData.js";
// import CustomButton from "@/components/wonderland/common/CustomButton";
// import Image from "next/image";
// import emojiIcon from "@/assets/Emoji.png";
// export default function NoteDetails() {
//   const router = useRouter();
//   const { NoteId } = router.query;
//   const [note, setNote] = useState(null);
//   const [liveData, setLiveData] = useState({ title: "", content: "", author: "" });
//     const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const titleRef = useRef(null);
//   const contentRef = useRef(null);
//   const authorRef = useRef(null);
//   const noteRef = useRef(null);

//   useEffect(() => {
//     if (NoteId) {
//       const found = notesData.find((n) => n.id === Number(NoteId));
//       if (found) {
//         setNote(found);
//         setLiveData({
//           title: found.title || "",
//           content: found.content || "",
//           author: found.author || "",
//         });
//       }
//     }
//   }, [NoteId]);

//   const adjustHeight = (el) => {
//     if (el) {
//       el.style.height = "auto";
//       el.style.height = `${el.scrollHeight}px`;
//     }
//   };

//   const handleChange = (field, value, ref) => {
//     setLiveData((prev) => ({ ...prev, [field]: value }));
//     adjustHeight(ref.current);
//   };

//   const handleDownload = async () => {
//     if (!noteRef.current) return;

//     await new Promise((r) => setTimeout(r, 100));

//     const clone = noteRef.current.cloneNode(true);
//     clone.style.position = "absolute";
//     clone.style.left = "-9999px";
//     document.body.appendChild(clone);

//     const bgColor = note.color?.startsWith("linear-gradient")
//       ? note.color.match(/#[A-Fa-f0-9]{6}/g)?.[0] || "#d4a574"
//       : note.color || "#d4a574";

//     clone.style.background = bgColor;

//     const canvas = await html2canvas(clone, {
//       backgroundColor: bgColor,
//       scale: 2,
//       useCORS: true,
//     });

//     document.body.removeChild(clone);

//     const link = document.createElement("a");
//     link.download = `${liveData.title || "note"}.png`;
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//   };

//   if (!note) return <p>Loading...</p>;

//   return (
//     <>
//       <Head>
//         <link
//           href="https://fonts.googleapis.com/css2?family=Just+Another+Hand&display=swap"
//           rel="stylesheet"
//         />
//       </Head>

//       <div
//         className="createNote-container"
//         style={{background: note.color}}
//       >
//          <div className="createNote-header">
//           {note.icon && <Image src={note.icon} alt="" className="createNote-icon" />}
//         </div>
//         <textarea
//           ref={titleRef}
//           value={liveData.title}
//           rows={1}
//           onChange={(e) => handleChange("title", e.target.value, titleRef)}
//           placeholder="TITLE..."
//          className="textArea-title"
//         />

//         <textarea
//           ref={contentRef}
//           value={liveData.content}
//           rows={2}
//           onChange={(e) => handleChange("content", e.target.value, contentRef)}
//           placeholder="Write your note..."
//           className="textArea-Content "
//         />

//         <textarea
//           ref={authorRef}
//           value={liveData.author}
//           rows={1}
//           onChange={(e) => handleChange("author", e.target.value, authorRef)}
//           placeholder="Your Name"
//           className="textArea-Author"
        
//         />
//       </div>

//       <div
//         ref={noteRef}
//         style={{
//           position: "absolute",
//           left: "-9999px",
//           top: "-9999px",
//           width: "100%",
//           height: "auto",
//           background: note.color,
//           color: "#fff",
//           fontFamily: "'Just Another Hand', cursive",
//           textAlign: "center",
//           padding: "12px",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//         }}
//       >
//          {note.icon && (
//     <div style={{ textAlign: "right", marginBottom: "10px" }}>
//       <Image
//         src={note.icon}
//         alt=""
//         style={{ width: "20px", height: "20px", objectFit: "contain", margin: "0 auto" }}
//       />
//     </div>
//   )}
//         <h2 style={{ textTransform: "uppercase", fontSize: "32px", margin: "0" }}>
//           {liveData.title || ""}
//         </h2>
//         <p style={{ fontSize: "25px", margin: "10px 0", lineHeight: "1.4em" }}>
//           {liveData.content || ""}
//         </p>
//         <p style={{ fontSize: "26px", marginTop: "10px" , textAlign: "left",}}>
//           {liveData.author ? `- ${liveData.author}` : ""}
//         </p>
//       </div>

//       <div style={{ textAlign: "center", marginTop: "20px" }}>
        
//          <CustomButton
//               title={"Submit"}
//                onClick={handleDownload}
//             />
//       </div>
//     </>
//   );
// }


// --------------------------------------------------------------------------------------------------------------------------------

import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import html2canvas from "html2canvas";
import "./createNote.css";
import { notesData } from "@/utils/ThankyounotesData.js";
import CustomButton from "@/components/wonderland/common/CustomButton";
import Image from "next/image";
import emojiIcon from "@/assets/Emoji.png";
export default function NoteDetails() {
  const router = useRouter();
  const { NoteId } = router.query;
  const [note, setNote] = useState(null);
  const [liveData, setLiveData] = useState({ title: "", content: "", author: "" });
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeField, setActiveField] = useState(null);

  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const authorRef = useRef(null);
  const noteRef = useRef(null);

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
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const handleChange = (field, value, ref) => {
    setLiveData((prev) => ({ ...prev, [field]: value }));
    adjustHeight(ref.current);
  };

// const handleDownload = async () => {
//   if (!noteRef.current) return;

//   const textareas = noteRef.current.querySelectorAll("textarea");
//   const replacements = [];

//   textareas.forEach((ta) => {
//     const div = document.createElement("div");
//     div.style.whiteSpace = "pre-wrap";
//     div.style.fontFamily = window.getComputedStyle(ta).fontFamily;
//     div.style.fontSize = window.getComputedStyle(ta).fontSize;
//     div.style.color = window.getComputedStyle(ta).color;
//     div.style.textAlign = window.getComputedStyle(ta).textAlign;
//     div.style.margin = window.getComputedStyle(ta).margin;
//     div.style.lineHeight = window.getComputedStyle(ta).lineHeight;
//     div.style.fontWeight = window.getComputedStyle(ta).fontWeight;
//     div.style.letterSpacing = window.getComputedStyle(ta).letterSpacing;
//     div.style.padding = window.getComputedStyle(ta).padding;
//     div.style.width = `${ta.offsetWidth}px`;

//     div.innerText = ta.value || ta.placeholder || "";
//     ta.parentNode.insertBefore(div, ta);
//     ta.style.display = "none";
//     replacements.push({ ta, div });
//   });

//   await document.fonts.ready;
//   await new Promise((r) => setTimeout(r, 100));
//   const canvas = await html2canvas(noteRef.current, {
//     scale: window.devicePixelRatio,
//     useCORS: true,
//     backgroundColor: null,
//   });

//   replacements.forEach(({ ta, div }) => {
//     div.remove();
//     ta.style.display = "";
//   });

//   const link = document.createElement("a");
//   link.download = `${liveData.title || "note"}.png`;
//   link.href = canvas.toDataURL("image/png");
//   link.click();
// };

const handleDownload = async () => {
  if (!noteRef.current) return;

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

    // Preserve exact text and line breaks
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
    logging: false,
  });

  // Restore textareas
  replacements.forEach(({ ta, div }) => {
    div.remove();
    ta.style.display = "";
  });

  const link = document.createElement("a");
  link.download = `${liveData.title || "note"}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
};



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
  ref={noteRef}
  className="createNote-container"
  style={{ background: note.color }}
>
  <div className="createNote-header">
    {note.icon && <Image src={note.icon} alt="" className="createNote-icon" />}
  </div>

  <textarea
    ref={titleRef}
    value={liveData.title}
    rows={1}
    onChange={(e) => handleChange("title", e.target.value, titleRef)}
    onFocus={() => setActiveField("title")}
    onBlur={() => setActiveField(null)}
    onTouchStart={(e) => e.preventDefault()}
    placeholder="TITLE..."
    className={`textArea-title ${activeField === "title" ? "active" : ""}`}
  />

  <textarea
    ref={contentRef}
    value={liveData.content}
    rows={2}
    onChange={(e) => handleChange("content", e.target.value, contentRef)}
    onFocus={() => setActiveField("content")}
    onBlur={() => setActiveField(null)}
    onTouchStart={(e) => e.preventDefault()}
    placeholder="Write your note..."
    className={`textArea-Content ${activeField === "content" ? "active" : ""}`}
  />

  <textarea
    ref={authorRef}
    value={liveData.author}
    rows={1}
    onChange={(e) => handleChange("author", e.target.value, authorRef)}
    onFocus={() => setActiveField("author")}
    onBlur={() => setActiveField(null)}
    onTouchStart={(e) => e.preventDefault()}
    placeholder="Your Name"
    className={`textArea-Author ${activeField === "author" ? "active" : ""}`}
  />
</div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        
         <CustomButton
              title={"Submit"}
               onClick={handleDownload}
            />
      </div>
    </>
  );
}

