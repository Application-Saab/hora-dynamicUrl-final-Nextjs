"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import emojiIcon from "@/assets/Emoji.png";
import ThankYouKeyboard from "@/assets/ThankYouKeyboard.png";
import "./emoji.css";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

// Preload picker
if (typeof window !== "undefined") import("emoji-picker-react");

export default function EmojiPickerButton({
  onEmojiSelect,
  isPickerOpen,
  setIsPickerOpen,
}) {
  const pickerVisible = isPickerOpen ?? false;
  const togglePicker = setIsPickerOpen ?? (() => {});

  const lastFocusedRef = useRef(null);
  const blockKeyboard = useRef(false); // FIXED

  // Store last focus target
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

  // Disable page scroll
  useEffect(() => {
    document.body.classList.toggle("emoji-open", pickerVisible);
  }, [pickerVisible]);

  // Toggle button
  const handleButtonClick = (e) => {
    e.preventDefault();

    if (pickerVisible) {
      // ---------- CLOSE PICKER ----------
      togglePicker(false);

      // restore focus (without opening keyboard)
      if (lastFocusedRef.current) {
        setTimeout(() => {
          lastFocusedRef.current.focus({ preventScroll: true });
        }, 80);
      }

      blockKeyboard.current = false;
      return;
    }

    // ---------- OPEN PICKER ----------
    const active = document.activeElement;
    if (active && (active.tagName === "TEXTAREA" || active.isContentEditable)) {
      active.blur(); // CLOSE KEYBOARD
    }

    blockKeyboard.current = true; // BLOCK REOPEN
    togglePicker(true);
  };

  // Emoji click handler
  const handleEmojiClick = (emojiObj, event) => {
    event.stopPropagation();
    blockKeyboard.current = true; // important fix

    // prevent keyboard from showing after insertion
    setTimeout(() => {
      if (document.activeElement) document.activeElement.blur();
    }, 10);

    onEmojiSelect?.(emojiObj);
  };

  // Prevent keyboard if it tries to open
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

  // Back button closing
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

  // Close picker on outside click
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
            height={270}
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
