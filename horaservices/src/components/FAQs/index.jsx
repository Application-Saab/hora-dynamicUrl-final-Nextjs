 import React, { useState } from 'react';

    const FAQAccordion = ({ city }) => {
        const [openIndex, setOpenIndex] = useState(0);
        
        const toggleAccordion = (index) => {
            setOpenIndex(prevIndex => (prevIndex === index ? -1 : index));
        };
        const faqData = [
            { question: `How can I hire an online chef for my event in ${city.toUpperCase()}?`, answer: `Hiring an online chef in ${city.toUpperCase()} is easy! Visit our website or download our app and place the order by selecting your dish, number of people, date, and time of the event to secure their services.` },
            { question: `What makes your catering services the best for small parties in ${city.toUpperCase()}?`, answer: `Our catering services in ${city.toUpperCase()} are tailored for small parties. We offer personalized options to make your event unforgettable.` },
            { question: `Can I book a private chef for a day or night in ${city.toUpperCase()}?`, answer: `Absolutely! Our private chefs are available for hire in ${city.toUpperCase()}, ensuring a unique dining experience for any occasion.` },
            { question: `How do I find a trained verified cook near me in ${city.toUpperCase()}?`, answer: `Finding a trained verified cook near you is simple. Enter your location on our platform, and choose from a list of dishes, number of people, date and time of event.` },
            { question: `Is Book a cook in ${city.toUpperCase()} suitable for last-minute chef bookings?`, answer: `Yes, our platform allows for convenient and quick bookings, you can book the order 24 hours in advance.` },
            { question: `What sets your chefs for hire in ${city.toUpperCase()} apart from others?`, answer: `Our chefs in ${city.toUpperCase()} are not only skilled but also verified, ensuring a high standard of service and culinary expertise.` },
            { question: `Can I hire a cook at home for a special occasion in ${city.toUpperCase()}?`, answer: `Certainly! Explore our selection of cooks available for hire at home in ${city.toUpperCase()} to make your event memorable.` },
            { question: `How do I take a chef in ${city.toUpperCase()} for a personalized cooking experience?`, answer: `Taking a chef in ${city.toUpperCase()} is simple. Choose a chef, specify your preferences, and enjoy a personalized cooking experience in the comfort of your home.` },
            { question: `Are your party caterers in ${city.toUpperCase()} suitable for both small and large events?`, answer: `Yes, our party caterers in ${city.toUpperCase()} cater to a variety of events, from intimate gatherings to larger celebrations.` },
            { question: `Can I hire a professional chef for a night in ${city.toUpperCase()}?`, answer: `Absolutely! Explore our options to hire a professional chef for a night in ${city.toUpperCase()} and create a culinary experience to remember.` },
            { question: `Is it possible to hire someone to cook for me in ${city.toUpperCase()} regularly?`, answer: `Yes, you can hire a cook near you in ${city.toUpperCase()} for regular cooking services. Choose a cook that fits your preferences and schedule.` },
            { question: `What is the process for hiring a private personal chef in ${city.toUpperCase()}?`, answer: `Hiring a private personal chef is easy. Browse through our profiles, select your preferred chef, and book their services for a personalized culinary experience.` }
        ];
        return (
            <div id="FAQs" className="sectionidsec">
                <h1 style={styles.sectionHeader}>FAQ</h1>
                {faqData.map((item, index) => (
                    <div key={index} style={styles.accordionItem}>
                        <div style={styles.question} onClick={() => toggleAccordion(index)}>
                            <span>{index + 1}: {item.question}</span>
                            <span style={styles.toggleIcon}>{openIndex === index ? '−' : '+'}</span>
                        </div>
                        <div style={{ ...styles.answer, maxHeight: openIndex === index ? '200px' : '0px', padding: openIndex === index ? '10px' : '0px' }}>
                            <p>A: {item.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    
    const styles = {
        accordionItem: { borderBottom: '1px solid #ccc', padding: '10px 0' },
        question: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px', color: 'black' },
        answer: { overflow: 'hidden', transition: 'max-height 0.3s ease-in-out, padding 0.3s ease-in-out', fontSize: '16px' },
        sectionHeader: { fontSize: '40px', textTransform: 'uppercase', fontWeight: 'bold', color: '#E6756B', textAlign: 'center', margin: '35px 0 10px' },
        toggleIcon: { fontSize: '24px', fontWeight: 'bold', marginLeft: '10px' }
    };
    
    export default FAQAccordion;
    