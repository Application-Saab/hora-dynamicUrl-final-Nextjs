"use client";

import Image from "next/image";
import TemplateSkeleton from "../TemplateSkeleton";
import { useState } from "react";

const TemplateGrid = ({ templates = [], categoryLoading = false, onApply }) => {
  const [loadedImages, setLoadedImages] = useState({});

  if (categoryLoading) return <TemplateSkeleton onlyCards />;

  if (!templates.length) {
    return <p className="no-templates-text">No templates found.</p>;
  }

  return (
    <div className="templates-grid">
      {templates.map((template) => (
        <div
          key={template._id}
          className="template-card"
          onClick={() => onApply(template._id)}
        >
          <span className="try-pill">Try</span>

          <Image
            src={template.webpUrl}
            alt={template.fileName}
            width={250}
            height={350}
            className="template-image"
            onLoad={() =>
              setLoadedImages((prev) => ({
                ...prev,
                [template._id]: true,
              }))
            }
            style={{
              visibility: loadedImages[template._id] ? "visible" : "hidden",
            }}
          />

          {!loadedImages[template._id] && (
            <div className="template-skeleton" />
          )}
        </div>
      ))}
    </div>
  );
};

export default TemplateGrid;
