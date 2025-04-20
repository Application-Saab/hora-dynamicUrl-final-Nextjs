import { useState } from "react";
import "@/css/decoration.css";

export const PhotographyFAQSection = ({faqData}) => {
    const [openIndex, setOpenIndex] = useState(null);
  
    const handleToggle = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  
    return (
      <div className="faqSection">
        {faqData.map((item, index) => (
          <div key={index} className="faqItem">
            <div
              onClick={() => handleToggle(index)}
              style={{ cursor: "pointer" }}
            >
              <h3>{item.name}</h3>
              <span>{openIndex === index ? "-" : "+"}</span>
            </div>
            {openIndex === index && (
              <div>
                <p>{item.acceptedAnswer.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };