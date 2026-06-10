// import { useState } from "react";
// import "./venuecategories.css";

// const events = [
//   { label: "Birthday",   emoji: "🎂" },
//   { label: "Baby Shower", emoji: "🍼" },
//   { label: "Engagement",  emoji: "💍" },
//   { label: "Reception",   emoji: "👰" },
//   { label: "Corporate",   emoji: "🏢" },
//   { label: "Anniversary", emoji: "🥂" },
// ];

// const VenueCategories = () => {
//   const [active, setActive] = useState("Birthday");

//   return (
    
//     <div className="event-box">
//       <h3>Choose Event Type</h3>

//       <div className="event-scroll">
//         {events.map(({ label, emoji }) => (
//           <div
//             key={label}
//             className={`event-chip ${active === label ? "active" : ""}`}
//             onClick={() => setActive(label)}
//           >
//             <span className="chip-emoji">{emoji}</span>
//             {label}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VenueCategories;




import "./venuecategories.css";

const events = [
  { label: "Birthday",    emoji: "🎂" },
  { label: "Baby Shower", emoji: "🍼" },
  { label: "Engagement",  emoji: "💍" },
  { label: "Reception",   emoji: "👰" },
  { label: "Corporate",   emoji: "🏢" },
  { label: "Anniversary", emoji: "🥂" },
];

const VenueCategories = ({ active, onSelect }) => { // ✅ props se control
  return (
    <div className="event-box">
      <h3>Choose Event Type</h3>
      <div className="event-scroll">
        {events.map(({ label, emoji }) => (
          <div
            key={label}
            className={`event-chip ${active === label ? "active" : ""}`}
            onClick={() => onSelect(label)}
          >
            <span className="chip-emoji">{emoji}</span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueCategories;