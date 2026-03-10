import { photographyKeywordsSEO } from "@/components/JsonDataPhotographyCity/photographyKeywordsSEO";

const PhotographySEOKeywords = ({ city }) => {
  return <div className="mt-4">{photographyKeywordsSEO({ city })}</div>;
};

export default PhotographySEOKeywords;
