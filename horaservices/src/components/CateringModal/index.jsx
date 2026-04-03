import React from "react";
import "./cateringModal.css";
import Image from "next/image";
import vegIcon from "@/assets/veg.svg";
import nonVegIcon from "@/assets/nonveg.svg";
import { useRouter } from "next/router";

const CateringModal = ({ data, mealTypes = [], allDishes = [], onClose }) => {
  const router = useRouter();

  if (!data) return null;

  const selectedType =
    data.packageType === "liveCatering"
      ? "party-live-buffet-catering"
      : "party-food-delivery";

  const items = data.packageItems || [];

  const mealMap = mealTypes.reduce((acc, meal) => {
    acc[meal._id] = meal.name;
    return acc;
  }, {});

  const dishMap = {};

  (allDishes || [])
    .flatMap(meal => meal.dish || [])
    .forEach(d => {
      dishMap[d._id] = d;
    });

  const groupedItems = items.reduce((acc, dish) => {
    let mealId = dish?.mealId;
    if (Array.isArray(mealId)) {
      mealId = mealId[0];
    }
    const category =
      dish?.mealObject?.name || mealMap[mealId] || "Others";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(dish);
    return acc;
  }, {});

  const handleOrderNow = () => {

  const selectedDishDictionary = {};

  (data.packageItems || []).forEach((pkgItem) => {

    const realDish = dishMap?.[pkgItem._id];

    // 🔥 अगर API data मिला → use it
    if (realDish) {
      selectedDishDictionary[pkgItem._id] = {
        name: realDish.name,
        image: realDish.image,
        cuisineArray: realDish.cuisineArray,
        _id: realDish._id,
        mealId: realDish.mealId
      };
    } 
    else {
      selectedDishDictionary[pkgItem._id] = {
        name: pkgItem.name,
        image: pkgItem.image,
        cuisineArray: [
          pkgItem.price,                 
          pkgItem.per_plate_qty?.qty || 100,  
          pkgItem.per_plate_qty?.unit || "Gram" 
        ],
        _id: pkgItem._id,
        mealId: pkgItem.mealId
      };
    }

  });

  const selectedDishQuantities = Object.values(selectedDishDictionary).map(item => ({
    name: item.name,
    image: item.image,
    price: item.cuisineArray[0],
    quantity: item.cuisineArray[1],
    unit: item.cuisineArray[2],
    id: item.mealId
  }));

  router.push({
    pathname: `/party-food-delivery-live-catering-buffet-select-date/${selectedType}`,
    query: {
      selectedDishDictionary: JSON.stringify(selectedDishDictionary),
      selectedDishPrice: data.price,
      selectedDishes: Object.keys(selectedDishDictionary).length,
      orderType: "package",
      isDishSelected: false,
      selectedCount: Object.keys(selectedDishDictionary).length,
      selectedDishQuantities: JSON.stringify(selectedDishQuantities),
      selectedOption: selectedType
    },
  });
};
  const handleCustomize = () => {
    router.push(
      `/party-food-delivery-live-catering-buffet/${selectedType}`
    );
  };
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
          <button className="outline-btn" onClick={handleOrderNow}>
            Order Now
          </button>
          <button className="filled-btn" onClick={handleCustomize}>Customize Package</button>
        </div>

      </div>
    </div>
  );
};

export default CateringModal;