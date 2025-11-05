import { useEffect, useState } from "react";
import "../../pages/wonderland/EventInvitation.css";
import "../../pages/photo-gallery/gallery.css";
import LazyImage from "./event-wall/LazyImage";
import LazyVideo from "./event-wall/LazyVideo";

const EventwallGalleryItem = ({ isVideo, thumbnail, indexOnPage }) => {
  return (
    <>
      {isVideo ? (
        <div style={{ position: "relative" }}>
          <LazyVideo
            previewSrc={thumbnail?.webpUrl}
            fullVideoSrc={thumbnail?.imageUrl}
            wrapperClassName="masonry-item custom-masonry"
            isEventWall={true}
          />
        </div>
      ) : (
        <LazyImage
          key={thumbnail?._id}
          src={thumbnail?.webpUrl}
          alt={`Event Image ${indexOnPage + 1}`}
          wrapperClassName="masonry-item custom-masonry"
          isEventWall={true}
        />
      )}
    </>
  );
};

export default EventwallGalleryItem;
