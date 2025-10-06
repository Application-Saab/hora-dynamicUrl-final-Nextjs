import React, { useEffect } from "react";
import "./EmojiLoader.css";

const EmojiLoader = () => {
  useEffect(() => {
    // Confetti generate karna
    const confettiContainer = document.createElement("div");
    confettiContainer.className = "confetti-container";
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 50; i++) {
      const c = document.createElement("div");
      c.classList.add("confetti");
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
      c.style.animationDelay = Math.random() * 3 + "s";
      confettiContainer.appendChild(c);
    }

    return () => {
      // Cleanup confetti jab component unmount ho
      confettiContainer.remove();
    };
  }, []);

  return (
      <div className="emoji-loader">
      <div className="icon icon1">🎉</div>
      <div className="icon icon2">👥</div>
      <div className="icon icon3">🌍</div>
      <div className="icon icon4">👤</div>
    </div>
  );
};

export default EmojiLoader;
