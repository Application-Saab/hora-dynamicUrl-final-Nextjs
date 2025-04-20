import { useRouter } from "next/router";

const PhotographyLocalities = ({ city, localities }) => {
    const router = useRouter();
    const handleClick = (localityName) => {
        const formattedLocalityName = localityName.replace(/\s+/g, '-').toLowerCase();
        router.push({
          pathname: `/${city.toLowerCase()}/${formattedLocalityName}/photography-page`, 
        });
      };
  
    return (
      <div className="localities-box decration">
        <h1 className="city-heading">
          {city ? city : "City"} Localities
        </h1>
        <ul className="localities-list">
          {localities.length > 0 ? (
            localities.map((locality, index) => (
              <li key={index} className="locality-item">
                <button
                  onClick={() => handleClick(locality.name)}
                  className="locality-button"
                >
                  {locality.name}
                </button>
              </li>
            ))
          ) : (
            <div className="no-localities">
              No localities found for this city.
            </div>
          )}
        </ul>
      </div>
    );
  };
  
  export default PhotographyLocalities;
  