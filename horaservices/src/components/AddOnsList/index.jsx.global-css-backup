import Image from "next/image";
import "./addonlist.css";
const AddOnsList = ({ selectedAddOnProduct, itemQuantities, showAddOnmodal, pencil }) => {
  if (!selectedAddOnProduct || selectedAddOnProduct.length === 0) return null;

  return (
    <div className="photodetails-inclusions">
      <h1 className="photodetalis-heading">
        Add-ons
      </h1>

      <span
        onClick={showAddOnmodal}
        style={{
          marginLeft: "6px",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center"
        }}
      >
        <Image
          src={pencil}
          alt="Addons"
          className="addon-icon"
        />
      </span>

    <ul>
  {selectedAddOnProduct.map((item, index) => (
    <li key={index}>
      <div className="itemline">
        {index + 1}. {item.title} = ₹ {item.price} x{" "}
        {itemQuantities[item.title]} = ₹{" "}
        {item.price * itemQuantities[item.title]}
      </div>
    </li>
  ))}
</ul>
    </div>
  );
};

export default AddOnsList;