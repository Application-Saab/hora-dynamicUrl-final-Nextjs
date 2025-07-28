"use client";
import React, { useState } from "react";
import Image from "next/image";
import cancellation from "../../assets/Cancellation.svg"; // Adjust path if needed
import Arrow from "../../assets/arrow.png"
const FAQSection = ({ faqData, heading = "FAQ" }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getQuestion = (item) => item?.question || item?.name || "Untitled Question";
  const getAnswer = (item) => item?.answer || item?.acceptedAnswer?.text || "No answer available.";

  return (
    //  style={{ marginTop: "40px", padding: "0 16px" }}
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop:"10px",
          marginBottom: "10px",
          marginLeft: "10px",
        }}
      >
        <Image src={cancellation} alt="FAQ Icon" width={25} height={25} />
        <h2
          style={{
            color: "#97538c",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "100%",
            letterSpacing: "0%",
            margin: 0,
          }}
        >
          {heading}
        </h2>
      </div>

      {faqData.map((item, index) => (
        <div
          key={index}
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "12px 14px",
            marginBottom: "12px",
            border:
              openIndex === index ? "1.5px solid #97538c" : "2px solid #ddd",
            transition: "border 0.3s ease",
          }}
        >
          <div
            onClick={() => handleToggle(index)}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 600,
              fontSize: "15px",
              color: "#3b3b3b",
            }}
          >
            <span>{getQuestion(item)}</span>

            <div
              style={{
                width: "20px",
                height: "20px",
                minWidth: "20px",
                borderRadius: "50%",
                backgroundColor: "#97538c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "10px",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontSize: "10px",
                  transform:
                    openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                  display: "inline-block",
                }}
              >
                <Image src={Arrow} width={10} height={13}/>
              </span>
            </div>
          </div>

          {openIndex === index && (
            <div
              style={{
                marginTop: "10px",
                color: "#555",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {getAnswer(item)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQSection;
