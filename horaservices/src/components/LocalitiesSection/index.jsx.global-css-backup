import { useRouter } from "next/router";
import "./localities.css";
const LocalitiesSection = ({ title, localities, handleClick }) => {
  return (
    <div className="container">
      <div className="localities-card">
        <h2>{title}</h2>

        {localities?.length > 0 ? (
          <ul className="localities-list">
            {localities.map((locality, index) => (
              <li key={index}>
                <button onClick={() => handleClick(locality.slug || locality.name)}>
                  {locality.name || locality}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-localities">No localities found for this city.</div>
        )}
      </div>
    </div>
  );
};

export default LocalitiesSection;
