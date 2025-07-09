import { useRouter } from "next/router";

const LocalitiesSection = ({ title, localities, handleClick }) => {

  return (
    <div className="container mb-2">
      <div className="border border-dark border-1 rounded rounded-2 shadow-sm p-4">
        <h2 className="h4 text-purple border-bottom pb-2 mb-4 fw-bold">
           {title}
        </h2>

        {localities?.length > 0 ? (
          <ul className="list-unstyled d-flex flex-wrap gap-2">
            {localities.map((locality, index) => (
              <li key={index}>
                <button
                  onClick={() => handleClick(locality.name)}
                  className="btn btn-link text-decoration-underline fw-bold text-purple p-0"
                  style={{ fontSize: '0.9rem' }}
                >
                  {locality.name}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted fst-italic">
            No localities found for this city.
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalitiesSection;