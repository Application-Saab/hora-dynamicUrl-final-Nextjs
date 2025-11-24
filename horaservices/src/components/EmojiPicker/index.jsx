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

  useEffect(() => {
    if (pickerVisible) {
      document.body.classList.add("emoji-open");
    } else {
      document.body.classList.remove("emoji-open");
    }
  }, [pickerVisible]);

  const handleButtonClick = (e) => {
    e.preventDefault();

    if (pickerVisible) {
      togglePicker(false);
      document.body.classList.remove("emoji-open");
    } else {
      const focused = document.activeElement;
      if (focused && (focused.tagName === "TEXTAREA" || focused.isContentEditable)) {
        focused.blur();
      }
      togglePicker(true);
      document.body.classList.add("emoji-open");
    }
  };

  const handleEmojiClick = (emojiObject, event) => {
    event.stopPropagation();
    onEmojiSelect?.(emojiObject);
  };

  useEffect(() => {

    if (pickerVisible) {
      window.history.pushState({ pickerOpen: true }, "");
    }

    const handleBackButton = (e) => {
      const focused = document.activeElement;

      if (pickerVisible) {
        e.preventDefault();
        togglePicker(false);
        window.history.pushState({}, "");
      } else if (focused && (focused.tagName === "TEXTAREA" || focused.isContentEditable)) {
        e.preventDefault();
        focused.blur();
      }

    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [pickerVisible]);

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
            height={300}
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