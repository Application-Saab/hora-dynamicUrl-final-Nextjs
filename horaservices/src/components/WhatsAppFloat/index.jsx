"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import whatsappIcon from "@/assets/whatsapp-icon.png";
import { trackWAClicks } from "@/utils/storeWhatsappClicks";
export default function WhatsAppFloat({ shouldShow, handleWhatsAppClick }) {
  const texts = ["Customer Support", "Customization", "Book Now"];
  const [index, setIndex] = useState(0);
  const bubbleRef = useRef(null);

  useEffect(() => {
    const bubble = bubbleRef.current;

    const handleIteration = () => {
      setIndex((prev) => (prev + 1) % texts.length);
    };

    bubble?.addEventListener("animationiteration", handleIteration);

    return () => {
      bubble?.removeEventListener("animationiteration", handleIteration);
    };
  }, []);

  if (!shouldShow) return null;

  return (
    <div className="wa-wrapper">
      <div
        className="wa-btn"
        onClick={() => {
          handleWhatsAppClick(texts[index]);
          trackWAClicks();
        }}
      >
        <div className="wa-bubble" ref={bubbleRef}>
          <div className="wa-text">{texts[index]}</div>
        </div>

        <div className="what-icon">
          <Image src={whatsappIcon} alt="whatsapp" width={55} height={55} />
        </div>
      </div>
    </div>
  );
}
