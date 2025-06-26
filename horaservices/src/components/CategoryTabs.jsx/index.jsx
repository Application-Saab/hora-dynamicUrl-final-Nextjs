// components/CategoryTabs.jsx
import Image from "next/image";
import "./CategoryTabs.css"; // Make sure this path is correct

const CategoryTabs = ({ data, onSelect }) => {
  return (
    <div className="category-tabs">
      {data.map((cat) => (
        <button
          key={cat.id}
          className="category-button"
          onClick={() => onSelect(cat)}
        >
          {cat.image ? (
            <Image
              src={cat.image}
              alt={cat.imgAlt}
              width={60}
              height={60}
              className="category-icon"
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
          <span className="category-label">{cat.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
