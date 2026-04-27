import LazyVideo from "../../common/LazyVideo";
import EventLazyImage from "../../common/EventLazyImage";
import '../../common/EventLazyImage.css';
import CircularLoader from "@/components/Gallery/CircularLoader";

const EventwallGalleryItem = ({ isVideo, indexOnPage, fullVideoSrc, isEventWall=false ,progress = null, postType = null, id, imageUrl, previewSrc , isLoading }) => {

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
          <CircularLoader />
        </div>
      )}
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
    </div>
  );
};

export const EventwallGalleryItemWonderland = ({ isVideo, thumbnail, indexOnPage }) => {
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
          postType={thumbnail.postType}
        />
      )}
    </>
  );
};





export default EventwallGalleryItem;
