import { useEffect, useRef } from "react";

/**
 * useBackButtonClose (FIXED VERSION)
 * Sirf tab history entry push karta hai jab modal user action se
 * REAL me open ho (false -> true transition). Page load/mount par
 * agar isOpen already true hai, to koi fake entry push NAHI hoti.
 * Isse double-back-click wala bug fix ho jata hai.
 *
 * @param {boolean} isOpen
 * @param {function} onClose
 */
export default function useBackButtonClose(isOpen, onClose) {
  const wasOpenRef = useRef(isOpen); // mount par current value se hi init, taaki mount ek "open" na maane
  const pushedRef = useRef(false);

  useEffect(() => {
    const wasOpen = wasOpenRef.current;

    // Modal ab open hua (real transition, mount nahi)
    if (isOpen && !wasOpen) {
      window.history.pushState({ modalOpen: true }, "");
      pushedRef.current = true;
    }

    // Modal X/outside-click se close hua aur humne entry push ki thi
    if (!isOpen && wasOpen && pushedRef.current) {
      window.history.back();
      pushedRef.current = false;
    }

    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const handlePopState = () => {
      if (pushedRef.current) {
        onClose();
        pushedRef.current = false;
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [onClose]);
}