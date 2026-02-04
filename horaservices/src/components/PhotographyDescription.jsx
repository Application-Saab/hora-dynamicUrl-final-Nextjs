import { getPhotographyCityParagraphs } from "@/components/JsonDataPhotographyCity/photographyCityParagraphs";

const PhotographyDescription = ({ city }) => {
  const paragraphs = getPhotographyCityParagraphs(city);

  return (
    <div className="description-city m-2">
      <div className="page-width">
        <h1
          style={{
            fontSize: "24px",
            textTransform: "capitalize",
            fontWeight: "bold",
            color: "rgb(157, 74, 147)",
            margin: "11px  0px 20px",
            textAlign: "left",
            letterSpacing: "1.5px",
            borderBottom: "1px solid #cfcbcb",
            padding: "0 0 6px 0",
          }}
        >
          Description
        </h1>

        <div id="city-description" style={{ fontSize: "14px" }}>
          {paragraphs.map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotographyDescription;
