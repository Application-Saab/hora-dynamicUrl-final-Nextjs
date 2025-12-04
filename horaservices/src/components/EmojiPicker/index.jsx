"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import emojiIcon from "@/assets/Emoji.png";
import ThankYouKeyboard from "@/assets/ThankYouKeyboard.png";
import "./emoji.css";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });


if (typeof window !== "undefined") import("emoji-picker-react");

export default function EmojiPickerButton({
  onEmojiSelect,
  isPickerOpen,
  setIsPickerOpen,
}) {
  const pickerVisible = isPickerOpen ?? false;
  const togglePicker = setIsPickerOpen ?? (() => {});

  const lastFocusedRef = useRef(null);
  const blockKeyboard = useRef(false); 


  useEffect(() => {
    const handleFocus = (e) => {
      if (
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        lastFocusedRef.current = e.target;
      }
    };
    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, []);


  useEffect(() => {
    document.body.classList.toggle("emoji-open", pickerVisible);
  }, [pickerVisible]);


  const handleButtonClick = (e) => {
    e.preventDefault();

    if (pickerVisible) {
      
      togglePicker(false);

    
      if (lastFocusedRef.current) {
        setTimeout(() => {
          lastFocusedRef.current.focus({ preventScroll: true });
        }, 80);
      }

      blockKeyboard.current = false;
      return;
    }

    const active = document.activeElement;
    if (active && (active.tagName === "TEXTAREA" || active.isContentEditable)) {
      active.blur();
    }

    blockKeyboard.current = true; 
    togglePicker(true);
  };

 
  const handleEmojiClick = (emojiObj, event) => {
  event.stopPropagation();

  
  onEmojiSelect?.(emojiObj);

 
  const active = document.activeElement;
  if (active && (active.isContentEditable || active.tagName === "TEXTAREA")) {
    setTimeout(() => {
      active.blur();
    }, 20); 
  }
};


 
  useEffect(() => {
    const block = (e) => {
      if (pickerVisible && blockKeyboard.current) {
        e.stopPropagation();
        e.preventDefault();
        document.activeElement?.blur();
      }
    };
    window.addEventListener("focus", block, true);

    return () => window.removeEventListener("focus", block, true);
  }, [pickerVisible]);

  useEffect(() => {
    if (!pickerVisible) return;

    window.history.pushState({ picker: true }, "");

    const back = (e) => {
      if (pickerVisible) {
        e.preventDefault();
        togglePicker(false);
        window.history.pushState({}, "");
      }
    };
    window.addEventListener("popstate", back);

    return () => window.removeEventListener("popstate", back);
  }, [pickerVisible]);

 
  useEffect(() => {
    const handler = (e) => {
      if (
        pickerVisible &&
        !e.target.closest(".emoji-picker-container") &&
        !e.target.closest(".emoji-button")
      ) {
        togglePicker(false);
        blockKeyboard.current = false;
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [pickerVisible]);

  return (
    <>
      {/* BUTTON */}
      <div
        className="emoji-button"
        onMouseDown={(e) => {
          e.preventDefault();
          handleButtonClick(e);
        }}
      >
        <Image
          src={pickerVisible ? ThankYouKeyboard : emojiIcon}
          alt="emoji"
          width={30}
          height={30}
          style={{
            cursor: "pointer",
            transition: "transform 0.2s",
            transform: pickerVisible ? "scale(0.9)" : "scale(1)",
          }}
        />
      </div>

      {/* PICKER */}
      {pickerVisible && (
        <div className="emoji-picker-container open">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width="100%"
            height={260}
            searchDisabled
            previewConfig={{ showPreview: false }}
            lazyLoadEmojis
            skinTonesDisabled
            theme="auto"
          />
        </div>
      )}
    </>
  );
}
