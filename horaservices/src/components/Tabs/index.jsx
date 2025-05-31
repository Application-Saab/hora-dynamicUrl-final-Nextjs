import React, { useState } from 'react';

// Tab Component
function Tab({ label, isActive, onClick }) {
  return (
    <div 
      className={`tab ${isActive ? 'active' : ''}`} 
      onClick={onClick}
      style={{ cursor: 'pointer', padding: '10px', borderBottom: isActive ? '2px solid #9252AA' : 'none' }}
    >
      {label}
    </div>
  );
}

// Tabs Component
function Tabs({ tabs, defaultTab ,activeTab, onTabChange}) {
  // const [activeTab, setActiveTab] = useState(defaultTab);

  // const handleClick = (tabId) => {
  //   setActiveTab(tabId);
  // };

  return (
    <div className="tabs-container">
      <div className="tabs">
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            label={tab.title}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </div>
      <div className="tab-content">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

export default Tabs;
