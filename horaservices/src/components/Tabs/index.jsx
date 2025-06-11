// import React, { useState } from 'react';

// // Tab Component
// function Tab({ label, isActive, onClick }) {
//   return (
//     <div 
//       className={`tab ${isActive ? 'active' : ''}`} 
//       onClick={onClick}
//       style={{ cursor: 'pointer', padding: '10px', borderBottom: isActive ? '2px solid #9252AA' : 'none' }}
//     >
//       {label}
//     </div>
//   );
// }

// // Tabs Component
// function Tabs({ tabs, defaultTab ,activeTab, onTabChange}) {
//   // const [activeTab, setActiveTab] = useState(defaultTab);

//   // const handleClick = (tabId) => {
//   //   setActiveTab(tabId);
//   // };

//   return (
//     <div className="tabs-container">
//       <div className="tabs">
//         {tabs.map(tab => (
//           <Tab
//             key={tab.id}
//             label={tab.title}
//             isActive={activeTab === tab.id}
//             onClick={() => onTabChange(tab.id)}
//           />
//         ))}
//       </div>
//       <div className="tab-content">
//         {tabs.find(tab => tab.id === activeTab)?.content}
//       </div>
//     </div>
//   );
// }

// export default Tabs;


import React, { useState, useEffect } from 'react';

// Single Tab button
function Tab({ label, isActive, onClick }) {
  return (
    <div
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        padding: '10px 16px',
        borderBottom: isActive ? '2px solid #9252AA' : '2px solid transparent',
        fontWeight: isActive ? '600' : '400',
        color: isActive ? '#9252AA' : '#333',
        transition: 'all 0.3s ease'
      }}
    >
      {label}
    </div>
  );
}

// Main Tabs component
function Tabs({ tabs = [], defaultTab, activeTab: controlledActiveTab, onTabChange }) {
  const isControlled = controlledActiveTab !== undefined && onTabChange !== undefined;
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || (tabs[0]?.id ?? ''));

  const currentTab = isControlled ? controlledActiveTab : internalActiveTab;
  const setActiveTab = isControlled ? onTabChange : setInternalActiveTab;

  useEffect(() => {
    if (!isControlled && defaultTab) {
      setInternalActiveTab(defaultTab);
    }
  }, [defaultTab, isControlled]);

  return (
    <div className="tabs-container">
      <div className="tabs" style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.title}
            isActive={currentTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>
      <div className="tab-content" style={{ padding: '16px 0' }}>
        {tabs.find((tab) => tab.id === currentTab)?.content}
      </div>
    </div>
  );
}

export default Tabs;