import "@/components/Decoration/cityDecorationlanding/cityDecorationlanding.css";

const PhotographyCityLanding = ({ data }) => {
  if (!data) return null;

  const {
    city,
    heading,
    intro,
    homeHeading,
    homeParagraphs = [],
    outdoorHeading,
    outdoorText,
  } = data;

  return (
    <div className="cityContent">
      <div className="cityContent__inner">
        {/* City name */}
        {city && <h2 className="cityContent__title">{city}</h2>}

        {/* Main heading */}
        {heading && <h3 className="cityContent__heading">{heading}</h3>}

        {/* Intro */}
        {intro && <p className="cityContent__intro">{intro}</p>}

        {/* Hourly booking / celebrating at home */}
        {homeParagraphs.length > 0 && (
          <div className="cityContent__block">
            {homeHeading && (
              <h3 className="cityContent__heading">{homeHeading}</h3>
            )}
            {homeParagraphs.map((para, index) => (
              <p key={index} className="cityContent__paragraph">
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Outdoor shoot spots */}
        {outdoorText && (
          <div className="cityContent__block">
            {outdoorHeading && (
              <h3 className="cityContent__heading">{outdoorHeading}</h3>
            )}
            <p className="cityContent__paragraph">{outdoorText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotographyCityLanding;