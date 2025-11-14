import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import "./thankyounote.css";

import Head from "next/head";
import {notesData} from "@/utils/ThankyounotesData.js"

const EventNotes = () => {
  const router = useRouter();
  const { eventid } = router.query;
  const handleNoteClick = (noteId) => {
    router.push(`/wonderland/Thankyou-note/Create-note/${noteId}?eventid=${eventid}`);
  };
  return (
    <>
      <div className="note-container">

        <h2 className="note-heading">Event Notes</h2>
        <div className="notesGrid">
          {notesData.map((note) => (
            <div
              key={note.id}
              className="noteCard"
              style={{ background: note.color }}
              onClick={() => handleNoteClick(note.id)}
            >
                <span className="tryBadge">Try</span>
              <div className="noteHeader">

                <h3 className="noteTitle">{note.title}</h3>
                {note.icon && <Image src={note.icon} alt="NoteIcon" className="noteIcon" />}
              </div>
              <p className="noteContent">{note.content}</p>
            </div>


          ))}
        </div>
      </div>
    </>
  );
};

export default EventNotes;
