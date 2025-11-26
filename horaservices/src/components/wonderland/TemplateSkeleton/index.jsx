import React from "react";
import "./TemplateSkeleton.css";

const TemplateSkeleton = ({ onlyCards = false }) => {
  return (
    <div className="tempskeleton-container">
      {!onlyCards && (
        <div className="tempskeleton-header">
          <div className="tempskeleton-tabs">
            {Array(6)
              .fill("")
              .map((_, i) => (
                <div key={i} className="tempskeleton-tab"></div>
              ))}
          </div>
        </div>
      )}

      <div className="tempskeleton-grid">
        {Array(8)
          .fill("")
          .map((_, i) => (
            <div key={i} className="tempskeleton-card"></div>
          ))}
      </div>
    </div>
  );
};

export default TemplateSkeleton;
