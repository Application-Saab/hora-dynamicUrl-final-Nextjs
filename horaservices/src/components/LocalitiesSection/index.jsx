import "./localities.css";

const LocalitiesSection = ({
  title,
  localities,
  href,
  citySlug,
  localityFromPage,
}) => {
  const getHref = (localitySlug) => {
    if (!href || href === "" || href === undefined) {
      if (localityFromPage) {
        return `/${citySlug}/${localityFromPage}/${localitySlug}`;
      } else {
        return `/${citySlug}/${localitySlug}`;
      }
    }
    if (href) {
      if (localityFromPage) {
        return `/${citySlug}/${localityFromPage}${href}/${localitySlug}`;
      } else {
        return `/${citySlug}/${localitySlug}${href}`;
      }
    }
  };
  return (
    <div className="containerBox">
      <div className="localities-card">
        <h2>{title}</h2>

        {localities?.length > 0 ? (
          <ul className="localities-list">
            {localities.map((locality, index) => {
              const name = locality.name || locality;
              const slug = (
                locality.slug ||
                locality.name.toLowerCase().replace(/\s+/g, "-")
              )
                .replace(/\s+/g, "-")
                .toLowerCase();

              return (
                <li key={index}>
                  <a href={getHref(slug)}>{name}</a>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="no-localities">
            No localities found for this city.
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalitiesSection;

export const OtherDecorationCategorySection = ({
  title,
  localities,
  href,
  citySlug,
  localityFromPage,
}) => {
  const getHref = (localitySlug) => {
    if (!href || href === "" || href === undefined) {
      if (localityFromPage) {
        return `/${citySlug}/${localityFromPage}/${localitySlug}`;
      } else {
        return `/${citySlug}/${localitySlug}`;
      }
    }
    if (href) {
      if (localityFromPage) {
        return `/${citySlug}/${localityFromPage}${href}/${localitySlug}`;
      } else {
        return `/${citySlug}${href}/${localitySlug}`;
      }
    }
  };
  return (
    <div className="containerBox">
      <div className="localities-card">
        <h2>{title}</h2>

        {localities?.length > 0 ? (
          <ul className="localities-list">
            {localities.map((locality, index) => {
              const name = locality.name;
              const slug = (
                locality.slug
              )
                .replace(/\s+/g, "-")
                .toLowerCase();

              return (
                <li key={index}>
                  <a href={getHref(slug)}>{name}</a>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="no-localities">
            No localities found for this city.
          </div>
        )}
      </div>
    </div>
  );
};
