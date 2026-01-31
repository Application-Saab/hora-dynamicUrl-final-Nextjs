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
  const lastFocusedRef = useRef(null);
  const blockKeyboard = useRef(false);
  const keyboardLockedRef = useRef(false);

const freezeKeyboardHeight = () => {
  if (!window.visualViewport) return;

  const height = window.innerHeight - window.visualViewport.height;
  if (height > 100) {
    keyboardLockedRef.current = true; // 🔒 LOCK
    setKeyboardHeight(height);
  }
};

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

//   useEffect(() => {
//   if (!window.visualViewport) return;

//   const handleResize = () => {
//     // 🚫 ignore resize while emoji picker transition
//     if (keyboardLockedRef.current) return;

//     const height = window.innerHeight - window.visualViewport.height;
//     if (height > 100) {
//       setKeyboardHeight(height);
//       localStorage.setItem("keyboardHeight", height);
//     }
//   };

//   const cached = localStorage.getItem("keyboardHeight");
//   if (cached) {
//     setKeyboardHeight(parseInt(cached));
//   }

//   window.visualViewport.addEventListener("resize", handleResize);
//   return () =>
//     window.visualViewport.removeEventListener("resize", handleResize);
// }, []);

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

        // real user tap close picker
        setIsPickerOpen(false);

        const elements = document.querySelectorAll(".chat-layout");
        elements.forEach((el) => {
          el.style.paddingBottom = "5px";
        });
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
        setIsPickerOpen(false);
        setTimeout(() => {
          if (lastFocusedRef.current) {
            lastFocusedRef.current.focus();
          }
          textareaRef.current.focus();
        }, 150);
        return;
      }

      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "TEXTAREA" || active.isContentEditable)
      ) {
        active.blur();
      }
      setTimeout(() => {
        setIsPickerOpen(true);
      }, 150);
      return;
    }

    // if (simple) {
    //   freezeKeyboardHeight(); // 🔥 LOCK HEIGHT FIRST

    //   // 🔥 DO NOT blur immediately
    //   setIsPickerOpen(true);

    //   // keyboard ko thoda baad band hone do
    //   setTimeout(() => {
    //     const active = document.activeElement;
    //     if (
    //       active &&
    //       (active.tagName === "TEXTAREA" || active.isContentEditable)
    //     ) {
    //       active.blur();
    //     }
    //   }, 80);

    //   return;
    // }

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
    setIsPickerOpen(true);
  };

  useEffect(() => {
    if (!isPickerOpen) return;

    const elements = document.querySelectorAll(".chat-layout");
    elements.forEach((el) => {
      el.style.paddingBottom = `${keyboardHeight + 5}px`;
    });

    return () => {
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
    // picker band → unlock
    keyboardLockedRef.current = false;
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

      {/* PICKER */}
      {isPickerOpen && (
        <div className="emoji-picker-container open">
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
              height={keyboardHeight}
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

// "use client";
// import { useEffect, useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import emojiicon from "@/assets/Emoji.png";
// import keyboardIcon from "@/assets/ThankYouKeyboard.png";
// import "./emoji.css";

// const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

// export default function EmojiPickerButton({
//   onEmojiSelect,
//   isPickerOpen,
//   setIsPickerOpen,
//   textareaRef,
// }) {
//   const keyboardHeightRef = useRef(260);
//   const keyboardLockedRef = useRef(false);
//   const emojiPaddingActiveRef = useRef(false);
//   const lastFocusedRef = useRef(null);

//   const [keyboardHeight, setKeyboardHeight] = useState(260);

//   /* ================== HELPERS ================== */

//   const getKeyboardHeight = () => {
//     if (!window.visualViewport) return 0;
//     return window.innerHeight - window.visualViewport.height;
//   };

//   const isKeyboardClosed = () => {
//     return getKeyboardHeight() < 80;
//   };

//   /* ================== KEYBOARD HEIGHT TRACK ================== */

//   useEffect(() => {
//     if (!window.visualViewport) return;

//     const onResize = () => {
//       if (keyboardLockedRef.current) return;

//       const h = getKeyboardHeight();
//       if (h > 100) {
//         keyboardHeightRef.current = h;
//         setKeyboardHeight(h);
//       }
//     };

//     window.visualViewport.addEventListener("resize", onResize);
//     return () =>
//       window.visualViewport.removeEventListener("resize", onResize);
//   }, []);

//   /* ================== EMOJI BUTTON CLICK ================== */

//   const handleEmojiButtonClick = (e) => {
//     e.preventDefault();

//     // lock keyboard height
//     keyboardLockedRef.current = true;
//     emojiPaddingActiveRef.current = false;

//     setIsPickerOpen(true);

//     // close keyboard AFTER emoji picker opens
//     requestAnimationFrame(() => {
//       const active = document.activeElement;
//       if (
//         active &&
//         (active.tagName === "TEXTAREA" || active.isContentEditable)
//       ) {
//         lastFocusedRef.current = active;
//         active.blur();
//       }
//     });
//   };

//   /* ================== WAIT FOR KEYBOARD CLOSE ================== */

//   useEffect(() => {
//     if (!isPickerOpen) return;

//     const wait = () => {
//       if (isKeyboardClosed()) {
//         emojiPaddingActiveRef.current = true;

//         document.querySelectorAll(".chat-layout").forEach((el) => {
//           el.style.paddingBottom = `${keyboardHeightRef.current + 5}px`;
//         });
//         return;
//       }
//       requestAnimationFrame(wait);
//     };

//     wait();
//   }, [isPickerOpen]);

//   /* ================== CLOSE EMOJI PICKER ================== */

//   useEffect(() => {
//     if (!isPickerOpen) {
//       emojiPaddingActiveRef.current = false;
//       keyboardLockedRef.current = false;

//       document.querySelectorAll(".chat-layout").forEach((el) => {
//         el.style.paddingBottom = "5px";
//       });
//     }
//   }, [isPickerOpen]);

//   /* ================== INPUT FOCUS ================== */

//   useEffect(() => {
//     const onFocus = (e) => {
//       if (
//         e.target.tagName === "TEXTAREA" ||
//         e.target.isContentEditable
//       ) {
//         setIsPickerOpen(false);
//       }
//     };

//     document.addEventListener("focusin", onFocus);
//     return () => document.removeEventListener("focusin", onFocus);
//   }, []);

//   /* ================== EMOJI SELECT ================== */

//   const handleEmojiClick = (emojiObj) => {
//     onEmojiSelect?.(emojiObj);
//   };

//   /* ================== RENDER ================== */

//   return (
//     <>
//       <div className="emoji-btn" onClick={handleEmojiButtonClick}>
//         <Image
//           src={isPickerOpen ? keyboardIcon.src : emojiicon.src}
//           alt="emoji"
//           width={30}
//           height={30}
//           style={{ cursor: "pointer" }}
//         />
//       </div>

//       {isPickerOpen && (
//         <div className="emoji-picker-container">
//           <EmojiPicker
//             onEmojiClick={handleEmojiClick}
//             width="100%"
//             height={keyboardHeight}
//             searchDisabled
//             previewConfig={{ showPreview: false }}
//             lazyLoadEmojis
//             skinTonesDisabled
//             theme="auto"
//           />
//         </div>
//       )}
//     </>
//   );
// }



// "use client";
// import { useEffect, useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import emojiicon from "@/assets/Emoji.png";
// import ThankYouKeyboard from "@/assets/ThankYouKeyboard.png";
// import "./emoji.css";

// const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

// if (typeof window !== "undefined") import("emoji-picker-react");

// export default function EmojiPickerButton({
//   onEmojiSelect,
//   isPickerOpen,
//   setIsPickerOpen,
//   simple = false,
//   emojiIcon = emojiicon,
//   keyboardIcon = ThankYouKeyboard,
//   ignoreNextFocusRef,
//   textareaRef,
// }) {
//   const [forceOpen, setForceOpen] = useState(false);
//   const [keyboardHeight, setKeyboardHeight] = useState(260);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [freezeInput, setFreezeInput] = useState(false); // 🔥 NEW - freeze input position
//   const lastFocusedRef = useRef(null);
//   const blockKeyboard = useRef(false);
//   const frozenHeightRef = useRef(null);
//   const transitionTimeoutRef = useRef(null);
//   const inputFreezeTimeoutRef = useRef(null);
//   const keyboardClosedRef = useRef(true); // Track keyboard state

//   // 🔥 Monitor ACTUAL keyboard state
//   useEffect(() => {
//     if (!window.visualViewport) return;

//     const handleResize = () => {
//       const height = window.innerHeight - window.visualViewport.height;
      
//       if (height > 100) {
//         // Keyboard is OPEN
//         keyboardClosedRef.current = false;
//         if (!isTransitioning) {
//           setKeyboardHeight(height);
//           frozenHeightRef.current = height;
//           localStorage.setItem("keyboardHeight", height);
//         }
//       } else {
//         // Keyboard is CLOSED
//         keyboardClosedRef.current = true;
//       }
//     };

//     // Restore cached value
//     const cached = localStorage.getItem("keyboardHeight");
//     if (cached) {
//       const cachedHeight = parseInt(cached);
//       setKeyboardHeight(cachedHeight);
//       frozenHeightRef.current = cachedHeight;
//     }

//     window.visualViewport.addEventListener("resize", handleResize);
//     return () =>
//       window.visualViewport.removeEventListener("resize", handleResize);
//   }, [isTransitioning]);

//   // Handle focus events
//   useEffect(() => {
//     const handleFocus = (e) => {
//       const isInput =
//         e.target.tagName === "TEXTAREA" || e.target.isContentEditable;

//       if (isInput) {
//         lastFocusedRef.current = e.target;

//         if (ignoreNextFocusRef?.current) {
//           ignoreNextFocusRef.current = false;
//           return;
//         }

//         if (isPickerOpen) {
//           handleEmojiToKeyboard();
//         }
//       }
//     };

//     document.addEventListener("focusin", handleFocus);
//     return () => document.removeEventListener("focusin", handleFocus);
//   }, [isPickerOpen, simple]);

//   useEffect(() => {
//     if (!simple) {
//       document.body.classList.toggle("emoji-open", isPickerOpen);
//     }
//   }, [isPickerOpen, simple]);

//   // 🔥 Keyboard → Emoji (wait for keyboard to close, then add padding)
//   const handleKeyboardToEmoji = () => {
//     setIsTransitioning(true);
//     setFreezeInput(true); // 🔥 Freeze input at current position
    
//     // Close keyboard
//     const active = document.activeElement;
//     if (active && (active.tagName === "TEXTAREA" || active.isContentEditable)) {
//       active.blur();
//     }

//     // Wait for keyboard to ACTUALLY close before adding padding
//     const checkKeyboardClosed = setInterval(() => {
//       if (keyboardClosedRef.current) {
//         clearInterval(checkKeyboardClosed);
        
//         // NOW add padding and show picker
//         setIsPickerOpen(true);
        
//         // Unfreeze input after picker is visible
//         setTimeout(() => {
//           setFreezeInput(false);
//           setIsTransitioning(false);
//         }, 100);
//       }
//     }, 50);

//     // Safety timeout
//     setTimeout(() => {
//       clearInterval(checkKeyboardClosed);
//       setIsPickerOpen(true);
//       setFreezeInput(false);
//       setIsTransitioning(false);
//     }, 500);
//   };

//   // 🔥 Emoji → Keyboard (remove padding only after keyboard opens)
//   const handleEmojiToKeyboard = () => {
//     setIsTransitioning(true);
//     setFreezeInput(true); // 🔥 Freeze input at current position
    
//     // Keep padding, just close picker
//     setIsPickerOpen(false);

//     // Focus input (keyboard will open)
//     setTimeout(() => {
//       if (lastFocusedRef.current) {
//         lastFocusedRef.current.focus();
//       } else if (textareaRef?.current) {
//         textareaRef.current.focus();
//       }
//     }, 50);

//     // Wait for keyboard to open, then remove freeze
//     setTimeout(() => {
//       setFreezeInput(false);
//       setIsTransitioning(false);
//     }, 400);
//   };

//   const handleButtonClick = (e) => {
//     e.preventDefault();

//     if (simple) {
//       if (!isPickerOpen) {
//         handleKeyboardToEmoji();
//         return;
//       }

//       handleEmojiToKeyboard();
//       return;
//     }

//     // Complex mode
//     if (isPickerOpen && !simple) {
//       setIsPickerOpen(false);

//       if (lastFocusedRef.current) {
//         setTimeout(() => {
//           lastFocusedRef.current.focus({ preventScroll: true });
//         }, 80);
//       }

//       blockKeyboard.current = false;
//       return;
//     }

//     const active = document.activeElement;
//     if (active && (active.tagName === "TEXTAREA" || active.isContentEditable)) {
//       active.setAttribute("inputmode", "none");
//       active.setAttribute("readonly", "true");
//       setTimeout(() => {
//         active.removeAttribute("readonly");
//         active.removeAttribute("inputmode");
//       }, 100);
//     }

//     blockKeyboard.current = true;
//     setIsPickerOpen(true);
//   };

//   // 🔥 Apply padding ONLY when picker is open (not during transition)
//   useEffect(() => {
//     const elements = document.querySelectorAll(".chat-layout");
    
//     if (isPickerOpen && !isTransitioning) {
//       // Picker open and transition done - add padding
//       elements.forEach((el) => {
//         el.style.paddingBottom = `${keyboardHeight + 5}px`;
//       });
//     } else if (!isPickerOpen && !isTransitioning) {
//       // Both closed and no transition - remove padding
//       elements.forEach((el) => {
//         el.style.paddingBottom = "5px";
//       });
//     }
//     // During transition - DON'T change padding (freeze state)
//   }, [isPickerOpen, keyboardHeight, isTransitioning]);

//   // 🔥 Freeze input container position during transition
//   useEffect(() => {
//     if (!freezeInput) return;

//     const inputContainer = document.querySelector(".chat-input-container");
//     if (!inputContainer) return;

//     // Get current position
//     const rect = inputContainer.getBoundingClientRect();
//     const currentBottom = window.innerHeight - rect.bottom;

//     // Fix position
//     inputContainer.style.position = "fixed";
//     inputContainer.style.bottom = `${currentBottom}px`;
//     inputContainer.style.left = inputContainer.offsetLeft + "px";
//     inputContainer.style.right = inputContainer.offsetLeft + "px";

//     return () => {
//       // Release position
//       inputContainer.style.position = "";
//       inputContainer.style.bottom = "";
//       inputContainer.style.left = "";
//       inputContainer.style.right = "";
//     };
//   }, [freezeInput]);

//   const handleEmojiClick = (emojiObj) => {
//     ignoreNextFocusRef.current = true;
//     onEmojiSelect?.(emojiObj);

//     if (simple) {
//       queueMicrotask(() => setIsPickerOpen(true));
//     }
//   };

//   useEffect(() => {
//     if (simple) return;

//     const block = (e) => {
//       if (isPickerOpen && blockKeyboard.current) {
//         e.stopPropagation();
//         e.preventDefault();
//       }
//     };
//     window.addEventListener("focus", block, true);

//     return () => window.removeEventListener("focus", block, true);
//   }, [isPickerOpen, simple]);

//   useEffect(() => {
//     if (simple || !isPickerOpen) return;

//     window.history.pushState({ picker: true }, "");

//     const back = (e) => {
//       if (isPickerOpen) {
//         e.preventDefault();
//         setIsPickerOpen(false);
//         window.history.pushState({}, "");
//       }
//     };
//     window.addEventListener("popstate", back);

//     return () => window.removeEventListener("popstate", back);
//   }, [isPickerOpen, simple]);

//   useEffect(() => {
//     const handler = (e) => {
//       if (
//         isPickerOpen &&
//         !forceOpen &&
//         !e.target.closest(".emoji-picker-container") &&
//         !e.target.closest(".emoji-btn")
//       ) {
//         if (!simple) {
//           setIsPickerOpen(false);
//           setForceOpen(false);
//           blockKeyboard.current = false;
//         }
//       }
//     };

//     document.addEventListener("click", handler);
//     return () => document.removeEventListener("click", handler);
//   }, [isPickerOpen, simple, forceOpen]);

//   useEffect(() => {
//     return () => {
//       if (transitionTimeoutRef.current) {
//         clearTimeout(transitionTimeoutRef.current);
//       }
//       if (inputFreezeTimeoutRef.current) {
//         clearTimeout(inputFreezeTimeoutRef.current);
//       }
//     };
//   }, []);

//   return (
//     <>
//       <div
//         className="emoji-btn"
//         onClick={(e) => {
//           handleButtonClick(e);
//         }}
//       >
//         <Image
//           src={isPickerOpen ? keyboardIcon : emojiIcon}
//           alt="emoji"
//           width={30}
//           height={30}
//           style={{
//             cursor: "pointer",
//             transition: simple ? "none" : "transform 0.2s",
//             transform: simple
//               ? "none"
//               : isPickerOpen
//                 ? "scale(0.9)"
//                 : "scale(1)",
//           }}
//         />
//       </div>

//       {/* PICKER */}
//       {isPickerOpen && (
//         <div className="emoji-picker-container open">
//           <div
//             onClick={(e) => {
//               if (simple) {
//                 e.stopPropagation();
//               }
//             }}
//             style={{ width: "100%", height: "100%" }}
//           >
//             <EmojiPicker
//               onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject)}
//               width="100%"
//               height={keyboardHeight}
//               searchDisabled
//               previewConfig={{ showPreview: false }}
//               lazyLoadEmojis
//               skinTonesDisabled
//               theme="auto"
//               pickerStyle={{
//                 borderRadius: "0px",
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }