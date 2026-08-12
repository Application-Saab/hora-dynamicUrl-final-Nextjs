"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import emojiicon from "@/assets/wonderland/EmojiIconPicker.svg";
import ThankYouKeyboard from "../../assets/wonderland/KeyboardiconPicker.svg";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

if (typeof window !== "undefined") import("emoji-picker-react");

export default function EmojiPickerButtonNotes({
  onEmojiSelect,
  isPickerOpen,
  setIsPickerOpen,
  simple = false, // New prop to control behavior
  emojiIcon = emojiicon,
  keyboardIcon = ThankYouKeyboard,
}) {
  const pickerVisible = isPickerOpen ?? false;
  const togglePicker = setIsPickerOpen ?? (() => {});
  const [forceOpen, setForceOpen] = useState(false);
  const [showKeyboardIcon, setShowKeyboardIcon] = useState(false);

  const lastFocusedRef = useRef(null);
  const blockKeyboard = useRef(false);

  useEffect(() => {
    const handleFocus = (e) => {
      if (e.target.tagName === "TEXTAREA" || e.target.isContentEditable) {
        lastFocusedRef.current = e.target;
      }
    };
    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, []);

  useEffect(() => {
    if (!simple) {
      document.body.classList.toggle("emoji-open", pickerVisible);
    }
  }, [pickerVisible, simple]);

  useEffect(() => {
    if (!simple) return;

    const handleFocus = (e) => {
      if (
        (e.target.tagName === "TEXTAREA" || e.target.isContentEditable) &&
        pickerVisible
      ) {
        togglePicker(false);
      }
    };
    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, [pickerVisible, simple]);

  const handleButtonClick = (e) => {
    e.preventDefault();

    /* ================= SIMPLE MODE ================= */
    if (simple) {
      setForceOpen(false);

      // ⌨️ Keyboard icon clicked
      if (pickerVisible) {
        togglePicker(false);

        // ⚠️ IMPORTANT: delay focus so picker actually closes
        setTimeout(() => {
          if (lastFocusedRef.current) {
            lastFocusedRef.current.focus();
          }
        }, 150);

        return;
      }

      // 😀 Emoji icon clicked
      togglePicker(true);

      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "TEXTAREA" || active.isContentEditable)
      ) {
        active.blur();
      }
      return;
    }

    // Complex mode for Thankyou-note
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

    // Keep cursor visible but prevent keyboard from opening
    const active = document.activeElement;
    if (active && (active.tagName === "TEXTAREA" || active.isContentEditable)) {
      // Instead of blurring, temporarily make it readonly to prevent keyboard
      active.setAttribute("inputmode", "none");
      active.setAttribute("readonly", "true");
      setTimeout(() => {
        active.removeAttribute("readonly");
        active.removeAttribute("inputmode");
      }, 100);
    }

    blockKeyboard.current = true;
    togglePicker(true);
  };

  const handleEmojiClick = (emojiObj, event) => {
    onEmojiSelect?.(emojiObj);

    // In simple mode, reopen picker immediately after selection
    if (simple) {
      // Use queueMicrotask for immediate execution after current task
      queueMicrotask(() => setIsPickerOpen(true));
    }
  };

  useEffect(() => {
    if (simple) return; // Skip complex logic in simple mode

    const block = (e) => {
      if (pickerVisible && blockKeyboard.current) {
        // Prevent focus events that might trigger keyboard, but don't blur
        e.stopPropagation();
        e.preventDefault();
      }
    };
    window.addEventListener("focus", block, true);

    return () => window.removeEventListener("focus", block, true);
  }, [pickerVisible, simple]);

  useEffect(() => {
    if (simple || !pickerVisible) return;

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
  }, [pickerVisible, simple]);

  useEffect(() => {
    const handler = (e) => {
      if (
        pickerVisible &&
        !forceOpen &&
        !e.target.closest(".emoji-picker-container") &&
        !e.target.closest(".emoji-btn")
      ) {
        // Only close on outside click if not in simple mode
        if (!simple) {
          togglePicker(false);
          setForceOpen(false);
          blockKeyboard.current = false;
        }
        // In simple mode, do nothing (picker stays open)
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [pickerVisible, simple, forceOpen]);

  return (
    <>
      {/* BUTTON */}
      <div
        className="emoji-btn"
        onClick={(e) => {
          e.preventDefault();
          handleButtonClick(e);
        }}
      >
        <Image
          src={
            simple
              ? pickerVisible
                ? keyboardIcon
                : emojiIcon // ✅ SIMPLE MODE FIX
              : pickerVisible
              ? keyboardIcon
              : emojiIcon
          }
          alt="emoji"
          width={30}
          height={30}
          style={{
            cursor: "pointer",
            transition: simple ? "none" : "transform 0.2s",
            transform: simple
              ? "none"
              : pickerVisible
              ? "scale(0.9)"
              : "scale(1)",
          }}
        />
      </div>

      {/* PICKER */}
      {pickerVisible && (
        <div className="emoji-picker-container open">
          <div
            onClick={(e) => {
              // Prevent emoji picker from closing when clicking inside in simple mode
              if (simple) {
                e.stopPropagation();
              }
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <EmojiPicker
              onEmojiClick={(emojiObject, event) =>
                handleEmojiClick(emojiObject, event)
              }
              width="100%"
              height={260}
              searchDisabled
              previewConfig={{ showPreview: false }}
              lazyLoadEmojis
              skinTonesDisabled
              theme="auto"
              pickerStyle={{
                borderRadius: "0px",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
