// import React from "react";
// import "./VenueFoodModal.css";
// import Image from "next/image";
// import vegIcon from "@/assets/veg.svg";
// import nonVegIcon from "@/assets/nonveg.svg";

// const SECTION_CONFIG = [
//   { id: "beverage",   title: "Welcome Drink", emoji: "🥂", itemsKey: "beverage",   noteKey: "beverageNote"                          },
//   { id: "appetisers", title: "Appetisers",    emoji: "🍢", itemsKey: "appetisers", noteKey: "appetisers.note", splitVegNonVeg: true  },
//   { id: "soups",      title: "Soup",          emoji: "🍵", itemsKey: "soups",      noteKey: "soupsNote",       splitVegNonVeg: true  },
//   { id: "salads",     title: "Salads",        emoji: "🥗", itemsKey: "salads",     noteKey: "saladsNote"                             },
//   { id: "mainCourse", title: "Main Course",   emoji: "🍛", itemsKey: "mainCourse", noteKey: "mainCourse.note", splitVegNonVeg: true  },
//   { id: "dal",        title: "Dal",           emoji: "🫕", itemsKey: "dal",        noteKey: "dalNote"                                },
//   { id: "rice",       title: "Rice",          emoji: "🍚", itemsKey: "rice",       noteKey: "riceNote"                               },
//   { id: "bread",      title: "Bread",         emoji: "🫓", itemsKey: "bread",      noteKey: "breadNote"                              },
//   { id: "desserts",   title: "Desserts",      emoji: "🍮", itemsKey: "desserts",   noteKey: "dessertsNote"                           },
//   { id: "iceCream",   title: "Ice Cream",     emoji: "🍦", itemsKey: "iceCream",   noteKey: "iceCreamNote"                           },
// ];

// // Dotted path reader: get(obj, "mainCourse.note") → obj.mainCourse.note
// const get = (obj, path) => path.split(".").reduce((acc, k) => acc?.[k], obj);

// function normaliseItems(raw) {
//   if (!raw) return [];

//   // Case 1: simple array  → ["Jeera Rice", ...]
//   if (Array.isArray(raw)) {
//     return raw.map((label) => ({ label, isNonVeg: false }));
//   }

//   // Case 2: { items: [...] }  → STATIC_FOOD_PACKAGES mainCourse style
//   if (Array.isArray(raw.items)) {
//     return raw.items.map((label) => ({ label, isNonVeg: false }));
//   }

//   // Case 3: { veg: [...], nonVeg: [...] }  → OAKWOOD appetisers / mainCourse style
//   if (raw.veg || raw.nonVeg) {
//     return [
//       ...(raw.veg    || []).map((label) => ({ label, isNonVeg: false })),
//       ...(raw.nonVeg || []).map((label) => ({ label, isNonVeg: true  })),
//     ];
//   }

//   // Case 4: { veg: [...], nonVeg: [...] } inside soups (OAKWOOD soups)
//   if (raw.veg || raw.nonVeg) {
//     return [
//       ...(raw.veg    || []).map((label) => ({ label, isNonVeg: false })),
//       ...(raw.nonVeg || []).map((label) => ({ label, isNonVeg: true  })),
//     ];
//   }

//   return [];
// }

// const renderList = (title, emoji, items, note, splitVegNonVeg = false) => {
//   if (!items || items.length === 0) return null;

//   const vegItems    = items.filter((i) => !i.isNonVeg);
//   const nonVegItems = items.filter((i) =>  i.isNonVeg);

//   // Agar nonVeg items hi nahi hain toh splitVegNonVeg ignore karo
//   const shouldSplit = splitVegNonVeg && nonVegItems.length > 0;

//   return (
//     <div className="vfm-section">
//       <div className="vfm-sec-head">
//         <div className="vfm-sec-icon">{emoji}</div>
//         <span className="vfm-sec-title">{title}</span>
//         {note && <span className="vfm-choose-badge">{note}</span>}
//       </div>

//       {shouldSplit ? (
//         <>
//           {vegItems.length > 0 && (
//             <>
//               <div className="vfm-sub-label">
//                 <Image src={vegIcon} alt="veg" width={13} height={13} />
//                 <span className="vfm-sub-label-text">Vegetarian</span>
//               </div>
//               {vegItems.map((item, i) => (
//                 <div key={i} className="vfm-dish-item">
//                   <span className="vfm-dish-text">{item.label}</span>
//                 </div>
//               ))}
//             </>
//           )}
//           <div className="vfm-sub-label">
//             <Image src={nonVegIcon} alt="non-veg" width={13} height={13} />
//             <span className="vfm-sub-label-text">Non-Vegetarian</span>
//           </div>
//           {nonVegItems.map((item, i) => (
//             <div key={i} className="vfm-dish-item">
//               <span className="vfm-dish-text">{item.label}</span>
//             </div>
//           ))}
//         </>
//       ) : (
//         items.map((item, i) => (
//           <div key={i} className="vfm-dish-item">
//             <span className="vfm-dish-text">{item.label}</span>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// const VenueFoodModal = ({ data, onClose }) => {
//   if (!data) return null;

//   const { includes } = data;

//   return (
//     <div className="vfm-overlay" onClick={onClose}>
//       <div className="vfm-card" onClick={(e) => e.stopPropagation()}>

//         <div className="vfm-header">
//           <h2 className="vfm-title">{data.name}</h2>
//           <button className="vfm-close-btn" onClick={onClose}>✕</button>
//           <div className="vfm-price-row">
//             <span className="vfm-price-badge">{data.price}</span>
//             {data.tag && <span className="vfm-inclusive">{data.tag}</span>}
//           </div>
//         </div>

//         <div className="vfm-body">
//           {SECTION_CONFIG.map((cfg) => {
//             const rawItems = get(includes, cfg.itemsKey);
//             const note     = get(includes, cfg.noteKey);
//             const items    = normaliseItems(rawItems);
//             return (
//               <React.Fragment key={cfg.id}>
//                 {renderList(cfg.title, cfg.emoji, items, note, cfg.splitVegNonVeg)}
//               </React.Fragment>
//             );
//           })}

//           {includes?.addOns?.length > 0 && (
//             <div className="vfm-section">
//               <div className="vfm-sec-head">
//                 <div className="vfm-sec-icon">➕</div>
//                 <span className="vfm-sec-title">Add-ons</span>
//               </div>
//               {includes.addOns.map((item, i) => (
//                 <div key={i} className="vfm-dish-item vfm-dish-item--addon">
//                   <span className="vfm-dish-text">{item}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default VenueFoodModal;

import React from "react";
import "./VenueFoodModal.css";
import Image from "next/image";
import vegIcon from "@/assets/veg.svg";
import nonVegIcon from "@/assets/nonveg.svg";

const SECTION_CONFIG = [
  { id: "beverage",   title: "Welcome Drink", emoji: "🥂", itemsKey: "beverage",   noteKey: "beverageNote"                          },
  { id: "appetisers", title: "Appetisers",    emoji: "🍢", itemsKey: "appetisers", noteKey: "appetisers.note", splitVegNonVeg: true  },
  { id: "soups",      title: "Soup",          emoji: "🍵", itemsKey: "soups",      noteKey: "soupsNote",       splitVegNonVeg: true  },
  { id: "salads",     title: "Salads",        emoji: "🥗", itemsKey: "salads",     noteKey: "saladsNote"                             },
  { id: "mainCourse", title: "Main Course",   emoji: "🍛", itemsKey: "mainCourse", noteKey: "mainCourse.note", splitVegNonVeg: true  },
  { id: "dal",        title: "Dal",           emoji: "🫕", itemsKey: "dal",        noteKey: "dalNote"                                },
  { id: "rice",       title: "Rice",          emoji: "🍚", itemsKey: "rice",       noteKey: "riceNote"                               },
  { id: "bread",      title: "Bread",         emoji: "🫓", itemsKey: "bread",      noteKey: "breadNote"                              },
  { id: "desserts",   title: "Desserts",      emoji: "🍮", itemsKey: "desserts",   noteKey: "dessertsNote"                           },
  { id: "iceCream",   title: "Ice Cream",     emoji: "🍦", itemsKey: "iceCream",   noteKey: "iceCreamNote"                           },
];

const get = (obj, path) => path.split(".").reduce((acc, k) => acc?.[k], obj);

function normaliseItems(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((label) => ({ label, isNonVeg: false }));
  if (Array.isArray(raw.items)) return raw.items.map((label) => ({ label, isNonVeg: false }));
  if (raw.veg || raw.nonVeg) return [
    ...(raw.veg    || []).map((label) => ({ label, isNonVeg: false })),
    ...(raw.nonVeg || []).map((label) => ({ label, isNonVeg: true  })),
  ];
  return [];
}

const renderList = (title, emoji, items, note, splitVegNonVeg = false) => {
  if (!items || items.length === 0) return null;
  const vegItems    = items.filter((i) => !i.isNonVeg);
  const nonVegItems = items.filter((i) =>  i.isNonVeg);
  const shouldSplit = splitVegNonVeg && nonVegItems.length > 0;

  return (
    <div className="vfm-section">
      <div className="vfm-sec-head">
        <div className="vfm-sec-icon">{emoji}</div>
        <span className="vfm-sec-title">{title}</span>
        {note && <span className="vfm-choose-badge">{note}</span>}
      </div>

      {shouldSplit ? (
        <>
          {vegItems.length > 0 && (
            <>
              <div className="vfm-sub-label">
                <Image src={vegIcon} alt="veg" width={13} height={13} />
                <span className="vfm-sub-label-text">Vegetarian</span>
              </div>
              {vegItems.map((item, i) => (
                <div key={i} className="vfm-dish-item">
                  <span className="vfm-dish-text">{item.label}</span>
                </div>
              ))}
            </>
          )}
          <div className="vfm-sub-label">
            <Image src={nonVegIcon} alt="non-veg" width={13} height={13} />
            <span className="vfm-sub-label-text">Non-Vegetarian</span>
          </div>
          {nonVegItems.map((item, i) => (
            <div key={i} className="vfm-dish-item">
              <span className="vfm-dish-text">{item.label}</span>
            </div>
          ))}
        </>
      ) : (
        items.map((item, i) => (
          <div key={i} className="vfm-dish-item">
            <span className="vfm-dish-text">{item.label}</span>
          </div>
        ))
      )}
    </div>
  );
};

const VenueFoodModal = ({ data, onClose }) => {
  if (!data) return null;
  const { includes } = data;

  return (
    <div className="vfm-overlay" onClick={onClose}>
      <div className="vfm-card" onClick={(e) => e.stopPropagation()}>

        {/* ── HEADER ── */}
        <div className="vfm-header">
          <h2 className="vfm-title">{data.name}</h2>
          <button className="vfm-close-btn" onClick={onClose}>✕</button>

          {/* Price + Guest row */}
          <div className="vfm-info-row">

            {/* Left — Price */}
            <div className="vfm-info-cell">
              <svg className="vfm-cell-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill="#97538C"/>
              </svg>
              <div className="vfm-cell-text">
                <span className="vfm-cell-main">{data.price}</span>
                <span className="vfm-cell-sub">Per Person / All Inclusive</span>
              </div>
            </div>

            <div className="vfm-cell-divider" />

            {/* Right — Guest */}
            <div className="vfm-info-cell">
              <svg className="vfm-cell-icon" viewBox="0 0 24 24" fill="none">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="#97538C"/>
              </svg>
              <div className="vfm-cell-text">
                <span className="vfm-cell-main">{data.minGuest ?? 50} Guest</span>
                <span className="vfm-cell-sub">Minimum Guest</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── BODY ── */}
        <div className="vfm-body">
          {SECTION_CONFIG.map((cfg) => {
            const rawItems = get(includes, cfg.itemsKey);
            const note     = get(includes, cfg.noteKey);
            const items    = normaliseItems(rawItems);
            return (
              <React.Fragment key={cfg.id}>
                {renderList(cfg.title, cfg.emoji, items, note, cfg.splitVegNonVeg)}
              </React.Fragment>
            );
          })}

          {includes?.addOns?.length > 0 && (
            <div className="vfm-section">
              <div className="vfm-sec-head">
                <div className="vfm-sec-icon">➕</div>
                <span className="vfm-sec-title">Add-ons</span>
              </div>
              {includes.addOns.map((item, i) => (
                <div key={i} className="vfm-dish-item vfm-dish-item--addon">
                  <span className="vfm-dish-text">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default VenueFoodModal;
