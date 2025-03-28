import React, { useState } from 'react';

const FAQAccordion = ({ faqData }) => {
    const [openIndex, setOpenIndex] = useState(0);
    
    const toggleAccordion = (index) => {
        setOpenIndex(prevIndex => (prevIndex === index ? -1 : index));
    };
  
    return (
        <div id="FAQs" className="section-container">
            <h2 className='heading-orange'>FAQ</h2>
            {faqData.map((item, index) => (
                <div key={index} className='accordionItem'>
                    <div className='question' onClick={() => toggleAccordion(index)}>
                        <span>{index + 1}: {item.question}</span>
                        <span className="toggleIcon">{openIndex === index ? '−' : '+'}</span>
                    </div>
                    <div className="answer" style={{ maxHeight: openIndex === index ? '200px' : '0px', padding: openIndex === index ? '4px' : '0px' }}>
                        <p style={{margin:"0"}}>A: {item.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};



export default FAQAccordion;
