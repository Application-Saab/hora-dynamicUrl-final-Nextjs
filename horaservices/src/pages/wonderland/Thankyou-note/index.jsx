import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import "./thankyounote.css";

import Head from "next/head";
import {notesData} from "@/utils/ThankyounotesData.js"

const EventNotes = () => {
  const router = useRouter();
  const { eventid, frompanel } = router.query;
  const handleNoteClick = (noteId) => {
    if(frompanel == 'true'){
      router.push(`/wonderland/Thankyou-note/Create-note/${noteId}?eventid=${eventid}&frompanel=true`);
    }
    router.push(`/wonderland/Thankyou-note/Create-note/${noteId}?eventid=${eventid}`);
  };
  return (
    <>
      <div className="note-container">

        <h2 className="note-heading">Event Notes</h2>
        <div className="notesGrid">
          {notesData.map((note , index ) => (
            <div
              key={note.id}
             className={`noteCard noteCard-${index}`}
              style={{ background: note.color }}
              onClick={() => handleNoteClick(note.id)}
            >
              
              <div className="noteHeader">
                <div className="noteIconsec">
                    {note.icon && <Image src={note.icon} alt="NoteIcon" className="noteIcon" />}
                        <span className="tryBadge">Try</span>
                  </div>
              
                <h3 className="noteTitle">{note.title}</h3>
        
              </div>
              <p className="noteContent">
                {note.content}
                </p>
                {/* <p className="noteContent auther">- {note.author}</p> */}
            </div>


          ))}
        </div>
      </div>
    </>
  );
};

export default EventNotes;
