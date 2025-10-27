import Index from "@/pages/photography-page";
import { useRouter } from "next/router";
import "@/app/homepage.css";
import PhotographyDescription from "../../../../components/PhotographyDescription";
import PhotographySEOKeywords from "../../../../components/PhotographySEOKeywords";
import PhotographyFAQ from "../../../../components/PhotographyFAQ";
import { faqData } from "@/utils/photographyFAQData";
import FAQAccordion from "@/components/FAQs";
import FAQSection from "@/components/FAQSection";
import { DecorationSEOKeywords } from "@/utils/GetSEOKeywords";


const PhotographyCityPage = () => {
  const router = useRouter();
  let { locality } = router.query;

  if (locality) {
    locality = locality.charAt(0).toUpperCase() + locality.slice(1);
  }


  return (
    <div >
  
      <Index />
        <div className="tab-section-details-productpage">
      <FAQSection faqData={faqData} />
      </div>
      <PhotographyDescription city={locality} />
    
       {/* <div className="my-4 container">
              <DecorationSEOKeywords city={locality} />
            </div> */}
    </div>
  );
};

export default PhotographyCityPage;

