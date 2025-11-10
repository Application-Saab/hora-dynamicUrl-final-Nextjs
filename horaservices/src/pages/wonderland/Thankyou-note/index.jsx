import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import "./thankyounote.css";

import Head from "next/head";
import {notesData} from "@/utils/ThankyounotesData.js"

const EventNotes = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Just+Another+Hand&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="note-container">

        <h2 className="note-heading">Event Notes</h2>
        <div className="notesGrid">
          {notesData.map((note) => (
            <div
              key={note.id}
              className="noteCard"
              style={{ background: note.color }}
              onClick={() => router.push(`/wonderland/Thankyou-note/Create-note/${note.id}`)}
            >
              <div className="noteHeader">

                <h3 className="noteTitle">{note.title}</h3>
                {note.icon && <Image src={note.icon} alt="" className="noteIcon" />}
              </div>
              <p className="noteContent">{note.content}</p>
              {/* <p className="noteAuthor">{note.author}</p> */}
            </div>


          ))}
        </div>
      </div>
    </>
  );
};

export default EventNotes;
