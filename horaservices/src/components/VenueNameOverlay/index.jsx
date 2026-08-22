// components/VenueNameOverlay.jsx
import { useLayoutEffect, useRef } from "react";
import "./VenueNameOverlay.css";

const MIN_FONT_SIZE = 10; // isse chota font kabhi nahi hoga, chahe text kitna bhi bada ho
const FONT_STEP = 1;

const VenueNameOverlay = ({ venueName }) => {
  const boxRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text || !venueName) return;

    // Har render pe max font-size se shuru karo, phir zaroorat ho to ghatao
    const computedMax = parseFloat(getComputedStyle(text).fontSize);
    let currentSize = computedMax;
    text.style.fontSize = `${currentSize}px`;

    // Text ko chota karte jao jab tak box ke andar fit na ho jaaye
    // (dono width aur height dono directions me check)
    let guard = 0; // infinite loop se bachne ke liye safety limit
    while (
      (text.scrollHeight > box.clientHeight || text.scrollWidth > box.clientWidth) &&
      currentSize > MIN_FONT_SIZE &&
      guard < 30
    ) {
      currentSize -= FONT_STEP;
      text.style.fontSize = `${currentSize}px`;
      guard += 1;
    }
  }, [venueName]);

  if (!venueName) return null;

  return (
    <div className="venue-name-badge" ref={boxRef}>
      <span className="venue-name-text" ref={textRef}>
        {venueName}
      </span>
    </div>
  );
};

export default VenueNameOverlay;