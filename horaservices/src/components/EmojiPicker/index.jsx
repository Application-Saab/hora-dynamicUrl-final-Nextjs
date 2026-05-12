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
  showEmojiPickerRef,
}) {
  const [keyboardHeight, setKeyboardHeight] = useState(260);
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);
  const [hasOpened, setHasOpened] = useState(false);
  const lastFocusedRef = useRef(null);
  const blockKeyboard = useRef(false);
  const keepPaddingRef = useRef(false);
  // Tracks when cleanup itself calls history.back() so onPopState can ignore that event
  const pendingGoBackRef = useRef(false);

  // Synchronously marks ref false so setVvh sees the correct state immediately
  const markPickerClosed = () => {
    if (showEmojiPickerRef) showEmojiPickerRef.current = false;
  };

  useEffect(() => {
    // Measure env(safe-area-inset-bottom) once via a temporary DOM element.
    // This is the only reliable cross-browser way to read CSS env() values in JS.
    const el = document.createElement("div");
    el.style.cssText =
      "position:fixed;bottom:0;left:0;width:0;height:env(safe-area-inset-bottom,0px);visibility:hidden;pointer-events:none";
    document.body.appendChild(el);
    const sab = el.getBoundingClientRect().height || 0;
    document.body.removeChild(el);
    setSafeAreaBottom(sab);

    if (!window.visualViewport) return;

    const handleResize = () => {
      const height = window.innerHeight - window.visualViewport.height;
      if (height > 100) {
        setKeyboardHeight(height);
        localStorage.setItem("keyboardHeight", height);
      }
    };

    const cached = localStorage.getItem("keyboardHeight");
    if (cached) setKeyboardHeight(parseInt(cached));

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

        // In simple mode, if the input still has inputmode="none" it means the picker
        // is open and this focus came from a swipe gesture (not a deliberate tap to type).
        // Keep inputmode so keyboard stays closed and picker stays visible.
        if (simple && isPickerOpen && e.target.getAttribute("inputmode") === "none") {
          return;
        }

        // real user tap — remove inputmode so keyboard opens, close picker
        e.target.removeAttribute("inputmode");
        keepPaddingRef.current = true;
        markPickerClosed(); // sync update so setVvh reads correct state immediately
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
      // Keyboard icon clicked
      if (isPickerOpen) {
        // Hide picker DOM immediately so it disappears this frame before React re-renders
        document.querySelector(".emoji-picker-container.open")?.classList.remove("open");
        keepPaddingRef.current = true;
        markPickerClosed();
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
      // Set ref NOW so setVvh sees it during the keyboard-close animation
      // and does not clear paddingBottom before openPicker fires
      if (showEmojiPickerRef) showEmojiPickerRef.current = true;
      // On iOS, wait for keyboard close animation (~300ms) before showing picker
      // so it doesn't appear mid-slide and get pushed off-screen
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const keyboardOpen = window.visualViewport &&
        (window.innerHeight - window.visualViewport.height) > 100;
      const delay = isIOS && keyboardOpen ? 320 : 0;
      const openPicker = () => {
        const chatLayouts = document.querySelectorAll(".chat-layout");
        chatLayouts.forEach((el) => {
          el.style.paddingBottom = `${keyboardHeight}px`;
        });
        setIsPickerOpen(true);
        // RAF safety net: if setVvh fires one final time after this and clears
        // padding, restore it immediately in the next frame
        requestAnimationFrame(() => {
          chatLayouts.forEach((el) => {
            el.style.paddingBottom = `${keyboardHeight}px`;
          });
        });
      };
      if (delay > 0) {
        setTimeout(openPicker, delay);
      } else {
        openPicker();
      }
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
      el.style.paddingBottom = `${keyboardHeight}px`;
    });

    return () => {
      if (keepPaddingRef.current) {
        keepPaddingRef.current = false;
        return; // visualViewport will clear padding when keyboard opens
      }
      elements.forEach((el) => {
        el.style.paddingBottom = "";
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

  // Simple mode: push a history entry when picker opens so the Android back button
  // closes the picker first instead of navigating away from the page.
  useEffect(() => {
    if (!simple || !isPickerOpen) return;

    window.history.pushState({ emojiPickerSimple: true }, "");

    const onPopState = () => {
      // Ignore popstate events triggered by our own cleanup's history.back() call.
      // Without this guard, rapid open→close→open cycles cause the async history.back()
      // from the previous close to fire the new listener and unexpectedly close the picker.
      if (pendingGoBackRef.current) {
        pendingGoBackRef.current = false;
        return;
      }
      // Ensure padding is cleared when back button closes the picker (safety reset).
      keepPaddingRef.current = false;
      markPickerClosed();
      setIsPickerOpen(false);
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
      // If the picker was closed by something other than the back button (keyboard icon,
      // outside tap, etc.), pop our injected history entry so the user doesn't need an
      // extra back press to leave chat.
      if (window.history.state?.emojiPickerSimple) {
        pendingGoBackRef.current = true;
        window.history.back();
      }
    };
  }, [isPickerOpen, simple]);

  useEffect(() => {
    const handler = (e) => {
      if (
        isPickerOpen &&
        !e.target.closest(".emoji-picker-container") &&
        !e.target.closest(".emoji-btn") &&
        !e.target.closest(".chat-input-container")
      ) {
        // Remove .open immediately via DOM so the picker hides THIS frame
        // without waiting for React re-render — prevents the "frozen emoji" visual glitch
        document.querySelector(".emoji-picker-container.open")?.classList.remove("open");
        // Clear layout padding at the same time
        document.querySelectorAll(".chat-layout").forEach((el) => {
          el.style.paddingBottom = "";
        });
        markPickerClosed();
        setIsPickerOpen(false);
        if (!simple) {
          blockKeyboard.current = false;
        }
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isPickerOpen, simple]);

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
              height={Math.max(keyboardHeight - safeAreaBottom, 180)}
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
          {onBackspace && (
            <button
              className="emoji-backspace-btn"
              onMouseDown={(e) => { e.preventDefault(); onBackspace(); }}
            >
              ⌫
            </button>
          )}
        </div>
      )}
    </>
  );
}
