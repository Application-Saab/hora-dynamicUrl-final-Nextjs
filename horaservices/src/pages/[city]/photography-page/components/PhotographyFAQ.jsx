import { PhotographyFAQSection } from "@/components/JsonDataPhotographyCity/photographyFAQ";
import React from "react";

export function PhotographyFAQ({faqData}) {
  return (
    <div className="faq-container citypage m-4">
      <div className="page-width">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <PhotographyFAQSection faqData={faqData} />
      </div>
    </div>
  );
}

export default PhotographyFAQ;
