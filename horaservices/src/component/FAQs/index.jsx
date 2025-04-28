import React, { useState } from 'react';

const FAQAccordion = ({ faqData }) => {
    const [openIndex, setOpenIndex] = useState(0);
    
    const toggleAccordion = (index) => {
        setOpenIndex(prevIndex => (prevIndex === index ? -1 : index));
    };
  
    return (
        <div id="FAQs" className="container my-2">
            <h2 className="text-uppercase fw-bold text-purple mb-2 border-bottom" style={{ fontSize: '1.5rem',letterSpacing: '1.5px' }}>
                FAQ
            </h2>
            {faqData.map((item, index) => (
                <div key={index} className="border-bottom py-3">
                    <div
                        className="d-flex justify-content-between align-items-center fw-semibold text-black small cursor-pointer"
                        onClick={() => toggleAccordion(index)}
                    >
                        <span> {item.question}</span>
                        <span className="fs-4 fw-bold ms-2 text-purple">
                            {openIndex === index ? '−' : '+'}
                        </span>
                    </div>

                    <div
                        className={`overflow-hidden transition`}
                        style={{
                            maxHeight: openIndex === index ? '200px' : '0px',
                            paddingTop: openIndex === index ? '8px' : '0px',
                            paddingBottom: openIndex === index ? '8px' : '0px',
                            transition: 'all 0.3s ease-in-out'
                        }}
                    >
                        <p className="mb-0 small">A: {item.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FAQAccordion;
