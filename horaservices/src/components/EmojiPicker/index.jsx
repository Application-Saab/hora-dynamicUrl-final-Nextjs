"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import emojiicon from "@/assets/Emoji.png";
import ThankYouKeyboard from "@/assets/ThankYouKeyboard.png";
import "./emoji.css";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

if (typeof window !== "undefined") import("emoji-picker-react");

export default function EmojiPickerButton({
  onEmojiSelect,
  onBackspace,
  isPickerOpen,
  setIsPickerOpen,
  simple = false,
  emojiIcon = emojiicon,
  keyboardIcon = ThankYouKeyboard,
  ignoreNextFocusRef,
  textareaRef,
}) {
  const [forceOpen, setForceOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(260);
  const [hasOpened, setHasOpened] = useState(false);
  const lastFocusedRef = useRef(null);
  const blockKeyboard = useRef(false);
  const keepPaddingRef = useRef(false);

  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const height = window.innerHeight - window.visualViewport.height;

      // ignore tiny changes
      if (height > 100) {
        setKeyboardHeight(height);
        localStorage.setItem("keyboardHeight", height);
      }
    };

    // restore cached value
    const cached = localStorage.getItem("keyboardHeight");
    if (cached) {
      setKeyboardHeight(parseInt(cached));
    }

    window.visualViewport.addEventListener("resize", handleResize);

    return () =>
      window.visualViewport.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleFocus = (e) => {
      const isInput =
        e.target.tagName === "TEXTAREA" || e.target.isContentEditable;

      if (isInput) {
        lastFocusedRef.current = e.target;

        // if focus came from emoji insert DO NOTHING
        if (ignoreNextFocusRef.current) {
          ignoreNextFocusRef.current = false;
          return;
        }

        // In simple mode, if picker is already open, user tapped text to reposition cursor.
        // Keep picker open, keep inputmode=none so keyboard doesn't appear.
        if (simple && isPickerOpen) {
          e.target.setAttribute("inputmode", "none");
          return;
        }

        // real user tap — keep padding so layout doesn't jump while keyboard opens
        keepPaddingRef.current = true;
        setIsPickerOpen(false);
      }
    };

    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, [isPickerOpen, simple]);

  useEffect(() => {
    if (!simple) {
      document.body.classList.toggle("emoji-open", isPickerOpen);
    }
  }, [isPickerOpen, simple]);

  const handleButtonClick = (e) => {
    e.preventDefault();
    /* ================= SIMPLE MODE ================= */
    if (simple) {
      setForceOpen(false);
      // Keyboard icon clicked
      if (isPickerOpen) {
        // Keep padding so layout stays stable while keyboard slides in
        keepPaddingRef.current = true;
        if (textareaRef?.current) {
          textareaRef.current.removeAttribute("inputmode");
          textareaRef.current.focus({ preventScroll: true });
        }
        setIsPickerOpen(false);
        return;
      }

      if (textareaRef?.current) {
        textareaRef.current.setAttribute("inputmode", "none");
        textareaRef.current.blur();
      }
      setHasOpened(true);
      setIsPickerOpen(true);
      return;
    }

    // Complex mode for Thankyou-note
    if (isPickerOpen && !simple) {
      setIsPickerOpen(false);

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
    setHasOpened(true);
    setIsPickerOpen(true);
  };

  useEffect(() => {
    if (!isPickerOpen) return;

    const elements = document.querySelectorAll(".chat-layout");
    elements.forEach((el) => {
      el.style.paddingBottom = `${keyboardHeight + 5}px`;
    });

    return () => {
      if (keepPaddingRef.current) {
        keepPaddingRef.current = false;
        return; // visualViewport will clear padding when keyboard opens
      }
      elements.forEach((el) => {
        el.style.paddingBottom = "5px";
      });
    };
  }, [isPickerOpen, keyboardHeight]);

  const handleEmojiClick = (emojiObj) => {
    ignoreNextFocusRef.current = true;
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
      if (isPickerOpen && blockKeyboard.current) {
        // Prevent focus events that might trigger keyboard, but don't blur
        e.stopPropagation();
        e.preventDefault();
      }
    };
    window.addEventListener("focus", block, true);

    return () => window.removeEventListener("focus", block, true);
  }, [isPickerOpen, simple]);
  useEffect(() => {
    if (simple || !isPickerOpen) return;

    window.history.pushState({ picker: true }, "");

    const back = (e) => {
      if (isPickerOpen) {
        e.preventDefault();
        setIsPickerOpen(false);
        window.history.pushState({}, "");
      }
    };
    window.addEventListener("popstate", back);

    return () => window.removeEventListener("popstate", back);
  }, [isPickerOpen, simple]);

  useEffect(() => {
    const handler = (e) => {
      if (
        isPickerOpen &&
        !forceOpen &&
        !e.target.closest(".emoji-picker-container") &&
        !e.target.closest(".emoji-btn")
      ) {
        // Only close on outside click if not in simple mode
        if (!simple) {
          setIsPickerOpen(false);
          setForceOpen(false);
          blockKeyboard.current = false;
        }
        // In simple mode, do nothing (picker stays open)
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isPickerOpen, simple, forceOpen]);

  useEffect(() => {
    if (!isPickerOpen) {
      // Restore inputmode so native keyboard works after picker closes
      if (simple && textareaRef?.current) {
        textareaRef.current.removeAttribute("inputmode");
      }
    }
  }, [isPickerOpen]);

  return (
    <>
      <div
        className="emoji-btn"
        onClick={(e) => {
          handleButtonClick(e);
        }}
      >
        <Image
          src={isPickerOpen ? keyboardIcon : emojiIcon}
          alt="emoji"
          width={30}
          height={30}
          style={{
            cursor: "pointer",
            transition: simple ? "none" : "transform 0.2s",
            transform: simple
              ? "none"
              : isPickerOpen
                ? "scale(0.9)"
                : "scale(1)",
          }}
        />
      </div>

      {/* PICKER — stays in DOM after first open, visibility toggled instantly via CSS */}
      {hasOpened && (
        <div className={`emoji-picker-container${isPickerOpen ? " open" : ""}`}>
          {onBackspace && (
            <div className="emoji-picker-toolbar">
              <button
                className="emoji-backspace-btn"
                onMouseDown={(e) => { e.preventDefault(); onBackspace(); }}
              >
                ⌫
              </button>
            </div>
          )}
          <div
            onClick={(e) => {
              if (simple) {
                e.stopPropagation();
              }
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <EmojiPicker
              onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject)}
              width="100%"
              height={onBackspace ? keyboardHeight - 44 : keyboardHeight}
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
