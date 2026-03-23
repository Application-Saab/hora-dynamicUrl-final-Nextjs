import React from "react";
import "./cateringModal.css";
import Image from "next/image";
import vegIcon from "@/assets/veg.svg";
import nonVegIcon from "@/assets/nonveg.svg";
const CateringModal = ({ data, mealTypes = [], onClose }) => {
  if (!data) return null;

  const items = data.packageItems || [];

  // ✅ Create fast lookup map (performance 🔥)
  const mealMap = mealTypes.reduce((acc, meal) => {
    acc[meal._id] = meal.name;
    return acc;
  }, {});

  // ✅ Group dishes by mealId
 const groupedItems = items.reduce((acc, dish) => {

  // 🔥 Step 1: mealId normalize (array / string dono handle)
  let mealId = dish?.mealId;

  if (Array.isArray(mealId)) {
    mealId = mealId[0];
  }

  // 🔥 Step 2: priority wise category resolve
  const category =
    dish?.mealObject?.name ||   // ✅ agar direct aa raha ho
    mealMap[mealId] ||          // ✅ API se map
    "Others";

  if (!acc[category]) {
    acc[category] = [];
  }

  acc[category].push(dish);

  return acc;
}, {});

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <h2 className="modaltitle">
          {data.name} 
  <Image
    src={data.foodType === "veg" ? vegIcon : nonVegIcon}
    alt="food type"
    className="food-dot"
  />
        </h2>
        <div className="divider-line"></div>
        <p className="min-order">
          Minimum order starts from 10 people
        </p>

        {/* 🔥 Scrollable Dish List */}
        <div className="dish-list">

          {Object.keys(groupedItems).length > 0 ? (
            Object.keys(groupedItems).map((category, index) => (
              <div key={index} className="meal-group">

                {/* Heading */}
                <h4 className="meal-heading">{category}</h4>

                {/* Dishes */}
                {groupedItems[category].map((dish, i) => (
                  <div key={i} className="dish-row">
                    <img
                      src={
                        dish.image
                          ? `https://horaservices.com/api/uploads/${dish.image}`
                          : "/default-image.webp"
                      }
                      alt={dish.name}
                    />
                    <span className="dishname">{dish.name}</span>
                  </div>
                ))}

              </div>
            ))
          ) : (
            <p>No dishes available</p>
          )}

        </div>

        {/* Footer */}
        <div className="price-row-bottom">
          <span className="total-price">Total Price</span>
          <span className="Amountprice">₹{data.price}/-</span>
        </div>

        <div className="btn-row">
          <button className="outline-btn">Order Now</button>
          <button className="filled-btn">Customize Package</button>
        </div>

      </div>
    </div>
  );
};

export default CateringModal;