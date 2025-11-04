import React from "react";
import { useRouter } from "next/router";
import "./thankyounote.css";

const notesData = [
  {
    id: 1,
    title: "GUEST NOTE",
    content:
      "Thanks for inviting us. We truly enjoyed being part of Sahaj’s wonderful birthday celebration. May God bless you always.",
    author: "- YashParmar",
    color: "linear-gradient(140.79deg, #F5973D 8.22%, #FABC6F 96.1%)",
  },
  {
    id: 2,
    title: "HOST’S WELCOME",
    content:
      "So thrilled to celebrate with you all! Parking is bit tricky, please use rideshare. Let’s make memories!",
    author: "- YashParmar",
    color: "linear-gradient(140.79deg, #6AADD9 8.22%, #A5C9CD 96.1%)",
  },
  {
    id: 3,
    title: "IMPORTANT!",
    content: "Don’t forget sunscreen & bug spray!",
    author: "- YashParmar",
    color: "linear-gradient(140.79deg, #E05180 8.22%, #E6899E 96.1%)",
  },
  {
    id: 4,
    title: "FOOD INFO",
    content:
      "Dinner will be BBQ with Veggie, Vegan & Meat options. Gluten-free buns available on request!",
    author: "- YashParmar",
    color: "linear-gradient(140.79deg, #F5973D 8.22%, #FABC6F 96.1%)",
  },
  {
    id: 5,
    title: "DRESS CODE",
    content:
      "Tropical Disco! Think bright colors, glitter, and your best dancing shoes.",
    author: "- YashParmar",
    color: "linear-gradient(140.79deg, #6AADD9 8.22%, #A5C9CD 96.1%)",
  },
  {
    id: 6,
    title: "#SarahsSuperBash",
    content: "",
    author: "- YashParmar",
    color: "linear-gradient(140.79deg, #E05180 8.22%, #E6899E 96.1%)",
  },
  {
    id: 7,
    title: "ITINERARY",
    content: `4:00 PM: Guest Arrival
5:00 PM: Games & Fun
6:00 PM: Cake & Food
8:00 PM: Party Ends`,
    author: "- YashParmar",
    color: "linear-gradient(140.44deg, #814FB2 47.49%, #B682C4 89.88%)",
  },
];

const EventNotes = () => {
  const router = useRouter();

  return (
    <div className="note-container">
      <h2 className="note-heading">Event Notes</h2>
      <div className="notesGrid">
        {notesData.map((note) => (
          <div
            key={note.id}
            className="noteCard"
            style={{ background: note.color }}
            onClick={() => router.push(`/notes/${note.id}`)}
          >
            <div>
            <h3 className="noteTitle">{note.title}</h3>
            <p className="noteContent">{note.content}</p>
               <p className="noteAuthor">{note.author}</p>
            </div>
         
          </div>
          
        ))}
      </div>
    </div>
  );
};

export default EventNotes;
