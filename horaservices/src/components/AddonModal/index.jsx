import React, { useRef } from "react";
import "./Addon.css"
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
      <div className="modal-top-box11" ref={addonRef}>
        <h2 className="select-heading-sec">Add Extra Features</h2>
      </div>

      <div
        className="modal-overlay11"
        onClick={() => setIsOpen(false)}
        style={{
          maxHeight: "400px",
          overflowY: "scroll",
          padding: "10px",
          backgroundColor: "#FFF3DB",
          margin: "auto",
        }}
      >
        <div
          className="modal-content11"
          onClick={(e) => e.stopPropagation()}
          style={{ marginTop: "10px" }}
        >
          <div className="modal-middle-box">
            <div className="modalcard-container">
              {addOnProducts.map((item, index) => (
                <div key={index} className="modalcard">
                  <img src={item.image} alt={item.title} className="model-image" />
                  <h3>{item.title}</h3>
                  {/* <p className="Addon-description">{item.description}</p> */}

                  <div className="price-container">
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddonModal;
