import React from "react";
import Image from "next/image";
import "./CustomButton.css";

const CustomButton = ({
  title,
  icon: Icon, // React icon component
  imageSrc, // For Next.js Image
  buttonClass = "",
  iconClass = "",
  imageClass = "",
  onClick,
  disabled = false,
  type = "button",
  loading = false,
  variant = "primary", // primary | outline | danger
  imgAlt = "button-icon",
}) => {
  return (
    <button
      type={type}
      className={`common-custom-button ${variant} ${buttonClass}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="button-loader"></span>
      ) : (
        <>
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imgAlt}
              width={22}
              height={22}
              className={`button-media ${imageClass}`}
            />
          ) : (
            Icon && <Icon className={`button-media ${iconClass}`} />
          )}
          {title}
        </>
      )}
    </button>
  );
};

export default CustomButton;
