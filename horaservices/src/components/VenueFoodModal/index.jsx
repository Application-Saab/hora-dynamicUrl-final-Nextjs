import React from "react";
import "./VenueFoodModal.css";
import Image from "next/image";
import vegIcon from "@/assets/veg.svg";
import nonVegIcon from "@/assets/nonveg.svg";

const SECTION_CONFIG = [
  { id: "beverage",   title: "Welcome Drink", emoji: "🥂", itemsKey: "beverage",   noteKey: "beverageNote"      },
  { id: "appetisers", title: "Appetisers",    emoji: "🍢", itemsKey: "appetisers", noteKey: "appetisers.note", splitVegNonVeg: true },
  { id: "soups",      title: "Soup",          emoji: "🍵", itemsKey: "soups",      noteKey: "soupsNote.note" ,splitVegNonVeg: true        },
  { id: "salads",     title: "Salads",        emoji: "🥗", itemsKey: "salads",     noteKey: "saladsNote"        },
  { id: "mainCourse", title: "Main Course",   emoji: "🍛", itemsKey: "mainCourse", noteKey: "mainCourse.note", splitVegNonVeg: true },
  { id: "dal",        title: "Dal",           emoji: "🫕", itemsKey: "dal",        noteKey: "dalNote"           },
  { id: "rice",       title: "Rice",          emoji: "🍚", itemsKey: "rice",       noteKey: "riceNote"          },
  { id: "bread",      title: "Bread",         emoji: "🫓", itemsKey: "bread",      noteKey: "breadNote"         },
  { id: "desserts",   title: "Desserts",      emoji: "🍮", itemsKey: "desserts",   noteKey: "dessertsNote"      },
  { id: "iceCream",   title: "Ice Cream",     emoji: "🍦", itemsKey: "iceCream",   noteKey: "iceCreamNote"      },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Dotted path reader: get(obj, "mainCourse.note") → obj.mainCourse.note
const get = (obj, path) => path.split(".").reduce((acc, k) => acc?.[k], obj);
function normaliseItems(raw) {
  if (!raw) return [];

  // Case 1: simple array
  if (Array.isArray(raw)) {
    return raw.map((label) => ({ label, isNonVeg: false }));
  }

  // Case 2: veg / nonVeg structure (NEW + IMPORTANT)
  if (raw.veg || raw.nonVeg) {
    return [
      ...(raw.veg || []).map((label) => ({ label, isNonVeg: false })),
      ...(raw.nonVeg || []).map((label) => ({ label, isNonVeg: true })),
    ];
  }

  return [];
}

// ─── renderList ───────────────────────────────────────────────────────────────

const renderList = (title, emoji, items, note, splitVegNonVeg = false) => {
  if (!items || items.length === 0) return null;

  const vegItems    = items.filter((i) => !i.isNonVeg);
  const nonVegItems = items.filter((i) =>  i.isNonVeg);

  return (
    <div className="vfm-section">
      <div className="vfm-sec-head">
        <div className="vfm-sec-icon">{emoji}</div>
        <span className="vfm-sec-title">{title}</span>
        {note && <span className="vfm-choose-badge">{note}</span>}
      </div>

      {splitVegNonVeg && nonVegItems.length > 0 ? (
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

// ─── Main Component ───────────────────────────────────────────────────────────

const VenueFoodModal = ({ data, onClose }) => {
  if (!data) return null;

  const { includes } = data;

  return (
    <div className="vfm-overlay" onClick={onClose}>
      <div className="vfm-card" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="vfm-header">
          <h2 className="vfm-title">{data.name}</h2>
          <button className="vfm-close-btn" onClick={onClose}>✕</button>
          <div className="vfm-price-row">
            <span className="vfm-price-badge">{data.price}</span>
            {data.tag && <span className="vfm-inclusive">{data.tag}</span>}
          </div>
        </div>

        {/* Scrollable body — SECTION_CONFIG loop se sab sections auto-render */}
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
          {includes?.addOns?.length && (
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
