import LazyVideo from "./LazyVideo";
import EventLazyImage from "./EventLazyImage";
import "./EventLazyImage.css";

const EventwallGalleryItem = ({ isVideo, thumbnail, indexOnPage }) => {
  const isLoading = !thumbnail?.postWebpUrl && thumbnail.status !== "done";

  return (
    <>
      {isVideo ? (
          <LazyVideo
            previewSrc={
              isLoading ? thumbnail.localPreview : thumbnail.postWebpUrl
            }
            fullVideoSrc={thumbnail?.postUrl}
            isEventWall={true}
            progress={thumbnail.progress}
            wrapperClassName={`event-masonry-item`}
          />
      ) : (
        <EventLazyImage
          key={thumbnail?._id}
          src={isLoading ? thumbnail.localPreview : thumbnail.postUrl}
          alt={`Event Image ${indexOnPage + 1}`}
          progress={thumbnail.progress}
          wrapperClassName={`event-masonry-item`}
        />
      )}
    </>
  );
};

export default EventwallGalleryItem;
