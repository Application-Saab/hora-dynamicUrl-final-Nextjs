
import "./Sectiondescription.css";

const SectionDescription = ({
  title = "Description",
  sections = [],
  intro,
  closingCta,
}) => {
  return (
    <div className="sectionDescription">
      <div className="sectionDescription__inner">
        <h2 className="sectionDescription__title">{title}</h2>

        {/* Intro text */}
        {intro && (
          <p className="sectionDescription__paragraph">
            {intro}
          </p>
        )}

        {/* Content sections */}
        {sections.map((section, sIndex) => (
          <div key={sIndex} className="sectionDescription__section">
            {section.heading && (
              <h3 className="sectionDescription__heading">
                {section.heading}
              </h3>
            )}

            {/* Support photography data: section.body */}
            {section.body && (
              <p className="sectionDescription__paragraph">
                {section.body}
              </p>
            )}

            {/* Support existing blocks data */}
            {section.blocks?.map((block, bIndex) => {
              if (block.type === "paragraph") {
                return (
                  <p
                    key={bIndex}
                    className="sectionDescription__paragraph"
                  >
                    {block.text}
                  </p>
                );
              }

              if (block.type === "table") {
                return (
                  <div
                    key={bIndex}
                    className="sectionDescription__tableWrap"
                  >
                    <table className="sectionDescription__table">
                      <thead>
                        <tr>
                          {block.headers.map((header, hIndex) => (
                            <th
                              key={hIndex}
                              className="sectionDescription__tableHeadCell"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {block.rows.map((row, rIndex) => (
                          <tr
                            key={rIndex}
                            className="sectionDescription__tableRow"
                          >
                            {row.map((cell, cIndex) => (
                              <td
                                key={cIndex}
                                className="sectionDescription__tableCell"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (block.type === "list") {
                return (
                  <ul
                    key={bIndex}
                    className="sectionDescription__list"
                  >
                    {block.items.map((item, iIndex) => (
                      <li
                        key={iIndex}
                        className="sectionDescription__listItem"
                      >
                        {item.href ? (
                          <a
                            href={item.href}
                            className="sectionDescription__link"
                          >
                            {item.text}
                          </a>
                        ) : (
                          item.text
                        )}
                      </li>
                    ))}
                  </ul>
                );
              }

              return null;
            })}
          </div>
        ))}

        {/* Closing CTA text */}
        {closingCta && (
          <p className="sectionDescription__paragraph">
            {closingCta}
          </p>
        )}
      </div>
    </div>
  );
};

export default SectionDescription;
