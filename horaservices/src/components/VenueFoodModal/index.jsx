import React, { useMemo, useState } from "react";
import "./VenueFoodModal.css";
import { TITLE_ICON_MAP } from "@/utils/foodmodal";
import Image from "next/image";
import VEG_ICON from "@/assets/veg.svg";
import NONVEG_ICON from "@/assets/nonveg.svg";

const ITEMS_LIMIT = 3;

const getCategoryWiseItems = (packageItems = [], categories = []) => {
  const grouped = {};

  if (!Array.isArray(packageItems)) return grouped;

  packageItems.forEach((entry) => {
    const item = entry?.itemId;
    if (!item || !item._id) return;

    const categoryObj =
      entry?.categoryId && typeof entry.categoryId === "object"
        ? entry.categoryId
        : categories.find(
            (cat) => String(cat._id) === String(entry?.categoryId)
          );

    const categoryId = categoryObj?._id || entry?.categoryId || null;
    const categoryName = categoryObj?.title || "Other Dishes";

    if (!grouped[categoryName]) {
      grouped[categoryName] = {
        items: [],
        categoryId: categoryId,
      };
    }

    const alreadyExists = grouped[categoryName].items.some(
      (i) => String(i._id) === String(item._id)
    );

    if (!alreadyExists) {
      grouped[categoryName].items.push({
        _id: item._id,
        title: item.title,
        foodType: (item.foodType || "veg").toLowerCase().trim(),
      });
    }
  });

  return grouped;
};

const DishGroup = ({ groupKey, label, icon, items, expanded, onToggle }) => {
  if (!items || items.length === 0) return null;

  const isOverLimit = items.length > ITEMS_LIMIT;
  const visibleItems = expanded ? items : items.slice(0, ITEMS_LIMIT);

  return (
    <>
      <div className="vfm-sub-label">
        <Image
          src={icon}
          alt={label}
          className="vfm-food-icon"
          width={14}
          height={14}
        />
        <span className="vfm-sub-label-text">{label}</span>
      </div>

      {visibleItems.map((item) => (
        <div key={item._id} className="vfm-dish-item">
          <span className="vfm-dish-text">{item.title}</span>
        </div>
      ))}

      {isOverLimit && (
        <button
          type="button"
          className="vfm-view-all-btn"
          onClick={() => onToggle(groupKey)}
        >
          {expanded ? "View Less" : "View All"}
          <svg
            className={`vfm-view-all-chevron ${
              expanded ? "vfm-view-all-chevron--up" : ""
            }`}
            viewBox="0 0 12 8"
            fill="none"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </>
  );
};

const VenueFoodModal = ({ data, onClose, categories = [] }) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  const categoryWiseItems = useMemo(
    () => getCategoryWiseItems(data?.packageItems, categories),
    [data?.packageItems, categories],
  );

  if (!data) return null;

  const toggleGroup = (key) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getCategoryTag = (categoryId) => {
    if (!categoryId || !data?.packageCategoriesTags) return null;

    const tags = data.packageCategoriesTags;

    return (
      tags[categoryId] ||
      tags[String(categoryId)] ||
      null
    );
  };

  return (
    <div className="vfm-overlay" onClick={onClose}>
      <div className="vfm-card" onClick={(e) => e.stopPropagation()}>
        <div className="vfm-header">
          <h2 className="vfm-title">{data.title}</h2>
          <button className="vfm-close-btn" onClick={onClose}>
            ✕
          </button>

          <div className="vfm-info-row">
            <div className="vfm-info-cell">
              <svg className="vfm-cell-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                  fill="#97538C"
                />
              </svg>
              <div className="vfm-cell-text">
                <span className="vfm-cell-main">
                  {data?.discountedPrice
                    ? `₹${data.discountedPrice}/-`
                    : `₹${data?.actualPrice}/-`}
                </span>
                <span className="vfm-cell-sub">Per Person / {data.tag}</span>
              </div>
            </div>

            <div className="vfm-cell-divider" />

            <div className="vfm-info-cell">
              <svg className="vfm-cell-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                  fill="#97538C"
                />
              </svg>
              <div className="vfm-cell-text">
                <span className="vfm-cell-main">
                  {data.maxGuests ?? 50} Guest
                </span>
                <span className="vfm-cell-sub">Minimum Guest</span>
              </div>
            </div>
          </div>
        </div>

        <div className="vfm-body">
          {Object.entries(categoryWiseItems).map(
            ([categoryName, { items, categoryId }]) => {
              const vegItems = items.filter(
                (item) =>
                  item.foodType === "veg" ||
                  item.foodType === "Veg",
              );

              const nonVegItems = items.filter(
                (item) =>
                  item.foodType === "non-veg" ||
                  item.foodType === "nonveg" ||
                  item.foodType === "non veg" ||
                  item.foodType === "Non-Veg",
              );

              const note = getCategoryTag(categoryId);

              const icon = TITLE_ICON_MAP[categoryName] || null;

              const vegKey = `${categoryName}-veg`;
              const nonVegKey = `${categoryName}-nonveg`;

              return (
                <div className="vfm-section" key={categoryName}>
                  <div className="vfm-sec-pill">
                    {icon ? (
                      <Image
                        className="vfm-sec-icon"
                        src={icon}
                        alt={categoryName}
                        width={20}
                        height={20}
                      />
                    ) : (
                      <div className="vfm-sec-icon vfm-sec-icon--fallback">
                        🍽️
                      </div>
                    )}

                    <span className="vfm-sec-title">{categoryName}</span>

                    {note && (
                      <span className="vfm-choose-badge">{note}</span>
                    )}
                  </div>

                  <DishGroup
                    groupKey={vegKey}
                    label="VEGETARIAN"
                    icon={VEG_ICON}
                    items={vegItems}
                    expanded={!!expandedGroups[vegKey]}
                    onToggle={toggleGroup}
                  />

                  <DishGroup
                    groupKey={nonVegKey}
                    label="NON VEGETARIAN"
                    icon={NONVEG_ICON}
                    items={nonVegItems}
                    expanded={!!expandedGroups[nonVegKey]}
                    onToggle={toggleGroup}
                  />
                </div>
              );
            },
          )}

          {data?.packageAddons?.length > 0 && (
            <div className="vfm-section">
              <div className="vfm-sec-pill">
                <div className="vfm-sec-icon">➕</div>
                <span className="vfm-sec-title">Add-ons</span>
              </div>

              {data.packageAddons.map((addon, index) => (
                <div
                  key={index}
                  className="vfm-dish-item vfm-dish-item--addon"
                >
                  <span className="vfm-dish-text">{addon}</span>
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