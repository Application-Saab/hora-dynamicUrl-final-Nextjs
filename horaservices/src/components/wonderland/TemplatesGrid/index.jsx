"use client";

import Image from "next/image";
import TemplateSkeleton from "../TemplateSkeleton";
import { useState } from "react";

/* ── helper: URL ya fileName se check karo video hai ya nahi ── */
const isVideo = (template) => {
  const url      = template.webpUrl  || "";
  const fileName = template.fileName || "";
  return /\.(mp4|webm|ogg|mov)$/i.test(url) || /\.(mp4|webm|ogg|mov)$/i.test(fileName);
};

const TemplateGrid = ({ templates = [], categoryLoading = false, onApply }) => {
  const [loadedItems, setLoadedItems] = useState({});

  if (categoryLoading) return <TemplateSkeleton onlyCards />;

  if (!templates.length) {
    return <p className="no-templates-text">No templates found.</p>;
  }

  const markLoaded = (id) =>
    setLoadedItems((prev) => ({ ...prev, [id]: true }));

  return (
    <div className="templates-grid">
      {templates.map((template) => {
        const videoTemplate = isVideo(template);

        return (
          <div
            key={template._id}
            className="template-card"
            onClick={() => onApply(template._id)}
          >
            <span className="try-pill">Try</span>

            {/* ── VIDEO template ── */}
            {videoTemplate ? (
              <video
                src={template.webpUrl}
                autoPlay
                loop
                muted
                playsInline
                onLoadedMetadata={() => markLoaded(template._id)}
                className="template-image"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  visibility: loadedItems[template._id] ? "visible" : "hidden",
                }}
              />
            ) : (
              /* ── IMAGE template ── */
              <Image
                src={template.webpUrl}
                alt={template.fileName}
                width={250}
                height={350}
                className="template-image"
                onLoad={() => markLoaded(template._id)}
                style={{
                  visibility: loadedItems[template._id] ? "visible" : "hidden",
                }}
              />
            )}

            {/* Skeleton jab tak load nahi hua */}
            {!loadedItems[template._id] && (
              <div className="template-skeleton" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TemplateGrid;