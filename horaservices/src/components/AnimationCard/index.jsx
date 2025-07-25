import React, { useEffect, useRef, useState } from "react";
import "./featureAnimation.css"; // Adjust path if needed

const FeatureAnimation = ({ features, clickAnim }) => {
  const [handStep, setHandStep] = useState(0);

  useEffect(() => {
    const steps = features.length;
    const interval = setInterval(() => {
      setHandStep((prev) => (prev + 1) % steps);
    }, 1000); // Change step every 2 seconds

    return () => clearInterval(interval);
  }, [features]);

  return (
    <div className="animationwrapper">
      {features.map((item, index) => (
        <div key={index} className={`card ${item.bg}`}>
          <video
            src={item.anim}
            autoPlay
            loop
            muted
            playsInline
            className="video"
          />
          <div className="contentArea">
            <h3 className="title">{item.title}</h3>
            <button className={`button ${item.btnBg}`}>{item.btn}</button>

            {/* Show hand only for active step */}
            {handStep === index && (
              <video
                src={clickAnim}
                autoPlay
                loop
                muted
                playsInline
                className="clickHand"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureAnimation;
