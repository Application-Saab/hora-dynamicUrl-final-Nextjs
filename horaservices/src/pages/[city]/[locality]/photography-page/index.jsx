import Index from "@/pages/photography-page";
import { useRouter } from "next/router";
import "@/app/homepage.css";
import PhotographyDescription from "../../photography-page/components/PhotographyDescription";
import PhotographySEOKeywords from "../../photography-page/components/PhotographySEOKeywords";
import PhotographyFAQ from "../../photography-page/components/PhotographyFAQ";
import { faqData } from "@/utils/photographyFAQData";


const PhotographyCityPage = () => {
  const router = useRouter();
  let { locality } = router.query;

  if (locality) {
    locality = locality.charAt(0).toUpperCase() + locality.slice(1);
  }


  return (
    <div className="page-width">
      <Index />
      <PhotographyFAQ faqData={faqData} />
      <PhotographyDescription city={locality} />
      <PhotographySEOKeywords city={locality} />
    </div>
  );
};

export default PhotographyCityPage;

