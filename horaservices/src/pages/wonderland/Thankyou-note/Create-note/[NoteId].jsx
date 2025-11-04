import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import "./createNote.css";
import ImportantIcon from "@/assets/ThankyouNote-icon/importanticon.png";
import ThankyounotePin from "@/assets/ThankyouNote-icon/ThankyounotePin.png";
import FoodInfo from "@/assets/ThankyouNote-icon/Foodinfo.png";

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
    icon: ImportantIcon,
  },
  {
    id: 4,
    title: "FOOD INFO",
    content:
      "Dinner will be BBQ with Veggie, Vegan & Meat options. Gluten-free buns available on request!",
    author: "- YashParmar",
    color: "linear-gradient(140.79deg, #F5973D 8.22%, #FABC6F 96.1%)",
    icon: FoodInfo,
  },
  {
    id: 5,
    title: "DRESS CODE",
    content:
      "Tropical Disco! Think bright colors, glitter, and your best dancing shoes.",
    author: "- YashParmar",
    color: "linear-gradient(140.79deg, #6AADD9 8.22%, #A5C9CD 96.1%)",
    icon: ThankyounotePin,
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

      <div className="note-edit-container" style={{ background: note.color }}>
        {/* Editable Title */}
        <input
          className="edit-title"
          value={note.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        {/* Editable Content */}
        <textarea
          ref={contentRef}
          className="edit-content"
          value={note.content}
          onChange={(e) => {
            handleChange("content", e.target.value);
            adjustHeight(e.target);
          }}
        />

        {/* Editable Author */}
        <input
          className="edit-author"
          value={note.author}
          onChange={(e) => handleChange("author", e.target.value)}
        />

        <button
          className="save-btn"
          onClick={() => alert("Note updated successfully!")}
        >
          Save Changes
        </button>
      </div>
    </>
  );
}
