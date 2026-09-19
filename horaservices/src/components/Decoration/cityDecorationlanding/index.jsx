import "./CityDecorationlanding.css";

// data = one city's object from cityContentData.js
// e.g. <CityContent data={cityContentData[city?.toLowerCase()]} />
const CityDecorationlanding = ({ data }) => {
  if (!data) return null;

  const {
    city,
    intro,
    areasHeading,
    areasIntro,
    areas = [],
    areasNote,
    homeHeading,
    homeParagraphs = [],

  } = data;

  return (
    <div className="cityContent">
      <div className="cityContent__inner">
        {city && <h2 className="cityContent__title">{city}</h2>}

        {/* Intro */}
        {intro && <p className="cityContent__intro">{intro}</p>}

        {/* Areas we cover */}
        {areas.length > 0 && (
          <div className="cityContent__block">
            {areasHeading && (
              <h3 className="cityContent__heading">{areasHeading}</h3>
            )}
            {areasIntro && (
              <p className="cityContent__paragraph">{areasIntro}</p>
            )}
            <ul className="cityContent__areasList">
              {areas.map((area, index) => (
                <li key={index} className="cityContent__areaItem">
                  <span className="cityContent__areaZone">{area.zone}:</span>{" "}
                  <span className="cityContent__areaLocalities">
                    {area.localities}
                  </span>
                </li>
              ))}
            </ul>
            {areasNote && (
              <p className="cityContent__note">{areasNote}</p>
            )}
          </div>
        )}

        {/* Celebrating at home */}
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

      </div>
    </div>
  );
};

export default CityDecorationlanding;