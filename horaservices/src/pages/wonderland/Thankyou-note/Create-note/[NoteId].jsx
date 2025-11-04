import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import "./createNote.css";
import { notesData } from "@/utils/ThankyounotesData.js";

export default function NoteDetails() {
  const router = useRouter();
  const { NoteId } = router.query;
  const [note, setNote] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (NoteId) {
      const foundNote = notesData.find((n) => n.id === Number(NoteId));
      setNote(foundNote);
    }
  }, [NoteId]);

  useEffect(() => {
    if (contentRef.current) adjustHeight(contentRef.current);
  }, [note]);

  const adjustHeight = (el) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  if (!note) return <p>Loading...</p>;

  const handleChange = (field, value) => {
    setNote((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Just+Another+Hand&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="createNote-container" style={{ background: note.color }}>
        <div className="createNote-header"> 
           {note.icon && <Image src={note.icon} alt="" className="createNote-icon" />}
        </div>
          <input
            className="createNote-title createNote-editable"
            value={note.title}
            onChange={(e) => handleChange("title", e.target.value)}
            onFocus={(e) => e.target.classList.add("active")}
            onBlur={(e) => e.target.classList.remove("active")}
          />
        

        <textarea
          ref={contentRef}
          className="createNote-content createNote-editable"
          value={note.content}
          onChange={(e) => {
            handleChange("content", e.target.value);
            adjustHeight(e.target);
          }}
          onFocus={(e) => e.target.classList.add("active")}
          onBlur={(e) => e.target.classList.remove("active")}
        />

        <input
          className="createNote-author createNote-editable"
          value={note.author}
          onChange={(e) => handleChange("author", e.target.value)}
          onFocus={(e) => e.target.classList.add("active")}
          onBlur={(e) => e.target.classList.remove("active")}
        />

       
      </div>
        <div className="createNote-btn-wrapper">
        <button
          className="createNote-saveBtn"
          onClick={() => alert("Note updated successfully!")}
        >
          Submit
        </button>
      </div>
    </>
  );
}
