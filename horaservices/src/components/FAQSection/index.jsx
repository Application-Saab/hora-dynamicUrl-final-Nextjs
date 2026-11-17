"use client";
import React, { useState } from "react";
import Image from "next/image";
import cancellation from "../../assets/faq-heading-icon.svg";
import Arrow from "../../assets/faq-arrow-down.svg";
import "./faq-section.css";

const FAQSection = ({ faqData = [], heading = "FAQ" }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getQuestion = (item) =>
    item?.question || item?.name || "Untitled Question";
  const getAnswer = (item) =>
    item?.answer || item?.acceptedAnswer?.text || "No answer available.";

  return (
    <div className="faq-ctn">
      <div className="faq-head-ctn">
        <Image src={cancellation} alt="FAQ Icon" width={22} height={28} />
        <h2 className="faq-head-txt">{heading}</h2>
      </div>

      {faqData.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="faq-text-box"
            style={{
              border: isOpen ? "1.16px solid #97538c" : "1.16px solid #EAECF3",
            }}
          >
            {/* Question - always visible */}
            <div
              className="faq-question-row"
              onClick={() => handleToggle(index)}
            >
              <span>{getQuestion(item)}</span>

              <div className="faq-icon-circle">
                <span
                  className="faq-arrow-icon"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <Image src={Arrow} width={16} height={9} alt="toggle" />
                </span>
              </div>
            </div>

            {/* Answer - ALWAYS in DOM for SEO, CSS se hide/show */}
            <div
              className="faq-answer-box"
              style={{
                marginTop: isOpen ? "10px" : "0",
                maxHeight: isOpen ? "500px" : "0",
                opacity: isOpen ? 1 : 0,
              }}
            >
              {getAnswer(item)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQSection;
