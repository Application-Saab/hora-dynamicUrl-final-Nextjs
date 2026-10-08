import React, { useState } from 'react';
import './ReadinessList.css';

const ReadinessListt = () => {
    const [showAll, setShowAll] = useState(false);

    const handleToggle = () => {
        setShowAll(!showAll);
    };

    const items = [
        "Soak Chana 2 hrs before the arrival of chef",
        "Soak Chana 2 hrs before the arrival of chef",
        "Soak Chana 2 hrs before the arrival of chef",
        "Soak Chana 2 hrs before the arrival of chef",
        "Soak Chana 2 hrs before the arrival of chef"
    ];

    return (
        <div className="readiness-container">
            <div className="readiness-header">
                Readiness Required*
                <span className="show-all" onClick={handleToggle}>
                    {showAll ? 'Show Less' : 'Show All'}
                </span>
            </div>
            <ol className="readiness-list">
                {items.slice(0, showAll ? items.length : 2).map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ol>
        </div>
    );
};

export default ReadinessListt;
