import { useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import emojiIcon from "@/assets/Emoji.png";
import ThankYouKeyboard from "@/assets/ThankYouKeyboard.png";
import "./emoji.css";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function EmojiPickerButton({
  onEmojiSelect,
  isPickerOpen,
  setIsPickerOpen,
}) {
  const pickerVisible = isPickerOpen ?? false;
  const togglePicker = setIsPickerOpen ?? (() => { });

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (pickerVisible) {
      togglePicker(false);
      setTimeout(() => {
        const input =
          document.querySelector("textarea:focus") ||
          document.querySelector("textarea");
        input?.focus();
      }, 150);
    } else {
      const focused = document.activeElement;
      if (focused && (focused.tagName === "TEXTAREA" || focused.tagName === "INPUT")) {
        focused.blur();
      }
      togglePicker(true);
    }
  };

  const handleEmojiClick = (emojiData, e) => {
    e.stopPropagation();
    if (emojiData?.emoji) onEmojiSelect?.(emojiData.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerVisible &&
        !e.target.closest(".emoji-picker-container") &&
        !e.target.closest(".emoji-button")
      ) {
        togglePicker(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [pickerVisible]);
  return (
    <>
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
            objectFit: "contain",
            cursor: "pointer",
            transition: "transform 0.2s ease",
            transform: pickerVisible ? "scale(0.95)" : "scale(1)",
          }}
        />
      </div>
      <div className={`emoji-picker-container ${pickerVisible ? "open" : ""}`}>
        {pickerVisible && (
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width="100%"
            height={290}
            searchDisabled
            previewConfig={{ showPreview: false }}
            lazyLoadEmojis
            skinTonesDisabled
            theme="auto"
          />
        )}
      </div>
    </>
  );
}