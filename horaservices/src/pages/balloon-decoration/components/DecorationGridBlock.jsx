import DecorationCard from "@/component/Cards/DecorationCard/DecorationCard";
import ChatAndViewCard from "@/component/Cards/ChatAndViewCard";

const DecorationGridBlock = ({ title, data, handleSliderViewMore,handleViewMore }) => {
  return (
    <div className="container">
      <div className="row g-3">
        {data?.map((item, index) => {
          if (item.isViewMore) {
            return (
              <div key={index} className="col-md-3">
                <ChatAndViewCard
                  title={title}
                  item={item}
                  handleViewMore={handleViewMore}
                />
              </div>
            );
          }

          return (
            <div key={index} className="col-md-3 col-6">
              <DecorationCard
                item={item}
                onClick={() => handleSliderViewMore(item.link)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DecorationGridBlock;
