import FAQAccordion from "@/components/FAQs";
import "@/css/decoration.css";
import React from "react";

export function PhotographyFAQ({faqData}) {
  return (
    <div className="faq-container citypage m-4">
      <div className="page-width">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <FAQAccordion faqData={faqData} />
      </div>
    </div>
  );
}

export default PhotographyFAQ;
