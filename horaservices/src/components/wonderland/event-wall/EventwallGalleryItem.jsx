import LazyVideo from "../../common/LazyVideo";
import EventLazyImage from "../../common/EventLazyImage";
import '../../common/EventLazyImage.css';

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
          />
      ) : (
        <EventLazyImage
          key={thumbnail?._id}
          src={isLoading ? thumbnail.localPreview : thumbnail.postWebpUrl}
          alt={`Event Image ${indexOnPage + 1}`}
          progress={thumbnail.progress}
          wrapperClassName={`event-masonry-item`}
        />
      )}
    </>
  );
};

export default EventwallGalleryItem;
