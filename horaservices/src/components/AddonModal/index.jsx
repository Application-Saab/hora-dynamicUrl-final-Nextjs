
import React, { useRef, useState } from "react";
import "./Addon.css"
import giftIcon from "@/assets/giftIcon.svg";
import StarIcon from "../../assets/StarIcon.svg";
import Image from "next/image";

const DESCRIPTION_LIMIT = 50; // yaha se control karo kitna text pehle dikhana hai

const AddonModal = ({
  setIsOpen,
  addOnProducts = [],
  itemQuantities = {},
  onAdd,
  onRemove,
  title = "Party Add-ons",
}) => {
  const addonRef = useRef();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div>
      <div className="modal-overlay11" onClick={() => setIsOpen(false)}>
        <div
          className="modal-content11"
          onClick={(e) => e.stopPropagation()}
        >
         <div className="party-addon-heading" ref={addonRef}>
  <Image
    src={giftIcon}
    alt="Gift"
    className="party-addon-icon"
  />

  <h2 className="party-addon-title">{title}</h2>

  <Image
    src={StarIcon}
    alt="Sparkle"
    className="party-addon-sparkle"
  />
</div>

          <div className="modalcard-scroll-container">
            {addOnProducts.map((item, index) => {
              const desc = item.description?.trim() || "";
              const isLong = desc.length > DESCRIPTION_LIMIT;
              const isExpanded = expandedItems[index];

              const displayText =
                isLong && !isExpanded
                  ? desc.slice(0, DESCRIPTION_LIMIT).trim() + "... "
                  : desc + " ";

              return (
                <div key={index} className="modalcard">
                  <img
                    src={`https://horaservices.com/api/uploads/compressed_webp/${item.image}`}
                    alt={item.title}
                    className="model-image"
                  />

                  <div className="modalcard-body">
                    <h3>{item.title}</h3>
                    {desc && (
                      <p className="Addon-description">
                        {displayText}
                        {isLong && (
                          <span
                            className="read-more-link"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(index);
                            }}
                          >
                            {isExpanded ? "Read less" : "Read more"}
                          </span>
                        )}
                      </p>
                    )}
                    <div className="price-container-addon">
                      <span className="prices">
                        {typeof item.price === "number" ? `₹${item.price}` : "Included"}
                      </span>

                      {typeof item.price === "number" &&
                        (itemQuantities[item.title] ? (
                          <div className="quantitycontrols">
                            <button onClick={() => onRemove(item)} className="quantitybutton">-</button>
                            <span className="qunatity-title">{itemQuantities[item.title]}</span>
                            <button onClick={() => onAdd(item)} className="quantitybutton">+</button>
                          </div>
                        ) : (
                          <button onClick={() => onAdd(item)} className="addbutton">Add</button>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddonModal;