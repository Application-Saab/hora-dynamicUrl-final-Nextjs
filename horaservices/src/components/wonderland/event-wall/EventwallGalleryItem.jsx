import LazyVideo from "../../common/LazyVideo";
import EventLazyImage from "../../common/EventLazyImage";
import '../../common/EventLazyImage.css';

const EventwallGalleryItem = ({ isVideo, indexOnPage, fullVideoSrc, isEventWall=false ,progress = null, postType = null, id, imageUrl, previewSrc  }) => {

  return (
    <>
      {isVideo ? (
          <LazyVideo
            previewSrc={previewSrc}
            fullVideoSrc={fullVideoSrc}
            isEventWall={isEventWall}
            progress={progress}
          />
      ) : (
        <EventLazyImage
          key={id}
          src={imageUrl}
          alt={`Event Image ${indexOnPage + 1}`}
          progress={progress}
          wrapperClassName={`event-masonry-item`}
          postType={postType}
        />
      )}
    </>
  );
};

export default EventwallGalleryItem;
