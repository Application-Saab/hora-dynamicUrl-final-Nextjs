
import React, { useRef } from "react";
import giftIcon from "@/assets/giftIcon.svg";
import StarIcon from "../../assets/StarIcon.svg";
import Image from "next/image";
const AddonModal = ({
  setIsOpen,
  addOnProducts = [],
  itemQuantities = {},
  onAdd,
  onRemove,
}) => {
  const addonRef = useRef();

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

  <h2 className="party-addon-title">Party Add-ons</h2>

  <Image
    src={StarIcon}
    alt="Sparkle"
    className="party-addon-sparkle"
  />
</div>

          <div className="modalcard-scroll-container">
            {addOnProducts.map((item, index) => (
              <div key={index} className="modalcard">
                <img
                  src={`https://horaservices.com/api/uploads/compressed_webp/${item.image}`}
                  alt={item.title}
                  className="model-image"
                />

                <div className="modalcard-body">
                  <h3>{item.title}</h3>
                 {item.description?.trim() && (
  <p className="Addon-description">
    {item.description}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddonModal;